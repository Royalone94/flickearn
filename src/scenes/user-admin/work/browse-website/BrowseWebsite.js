import React, { Component } from 'react';
import { Table, Button, Collapse } from 'antd';
import { Link } from 'react-router-dom';
import { getUserWorkVideoPath, getUserWorkWebsitePath } from '../../../../utils/urlBuilder';
import { getTasks, interactTask, getCampaign, saveReferralInfo } from '../../../../services/session/authorization';

import MixpanelTrackWrapper from '../../../../components/common/MixpanelTracker';
import IframeModal from '../../../../components/iframe-modal/IframeModal';

const { Panel } = Collapse;
const { Column, ColumnGroup } = Table;

class BrowseWebsite extends Component {

	constructor() {
		super();

		this.state = {
			data: [],
			activeKey: '0',
			loading: false,
			pagination: {
				pageSize: 5,
				defaultCurrent: 1,
				onChange: (page) => {
					this.updateTable(page);
				}
			},
			siteUrl: ''
		}

		this.selectedSite = {};
	}

	componentDidMount() {
		this.updateTable(this.state.pagination.defaultCurrent);
	}

	async updateTable(page) {
		const params = {
			limit: this.state.pagination.pageSize,
			offset: (page - 1) * this.state.pagination.pageSize,
			kind: 1
		}

		this.setState({
			loading: true
		});

		const res = await getTasks(params);

		if (!res) {
			this.setState({
				data: [],
				loading: false
			});
			return;
		}

		this.setState({
			data: res.results,
			activeKey: '1',
			loading: false,
			pagination: { ...this.state.pagination, ...{ total: res.count } }
		});
	}

	onCollapseChange(key) {
		this.setState({
			activeKey: this.state.activeKey === '0' ? '1' : '0'
		});
	}
	
	async visitSite(record) {
		// if (window.mixpanel == undefined)
		// 	return;
		// window.mixpanel.track('Visit Task', { taskId: record.id, link: record.link });

		const res = await getCampaign(record.campaign);
		var token = saveReferralInfo(record.link, record.id);

		window.open(res.pre_url + record.link + `?referral_token=${token}`);
	}

	render() {
		return (
			<Table pagination={this.state.pagination} loading={this.state.loading} dataSource={this.state.data} rowKey="id" scroll={{x:575}}>
				<Column
					title="#"
					key="index"
					render={(text, record, index) => index + 1}
				/>
				<Column
					title="TVC Name"
					dataIndex="name"
					key="name"
				/>
				<Column
					title="Reward amount"
					dataIndex="reward"
					key="reward"
					render={(text) => `$${text}`}
				/>
				<Column
					title="Visit"
					key="btn"
					render={(text, record) => (
						<Button 
							type="primary" 
							onClick={() => this.visitSite(record)}>
							Visit
						</Button>
					)}
				/>
			</Table>
		);
	}
}

export default MixpanelTrackWrapper(BrowseWebsite, 'BrowseWebsite');