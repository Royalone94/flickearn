import React, { Component } from 'react';
import { Table, Button, Collapse } from 'antd';
import { Link, Route } from 'react-router-dom';
import * as _ from 'lodash';

import { getTasks, activateUser, getProfile, interactTask, loadAppConfigItem } from '../../../services/session/authorization';
import YoutubePlayer from '../../../components/youtube-player/YoutubePlayer';
import IframeModal from '../../../components/iframe-modal/IframeModal';
import BrowseWebsites from './browse-website/BrowseWebsite';
import WatchVideo from './watch-video/WatchVideo';
import CustomTasks from './custom-tasks/CustomTasks';
import { getUserWorkVideoPath, getUserWorkWebsitePath, getUserWorkCustomTasksPath } from '../../../utils/urlBuilder';


const { Panel } = Collapse;
const { Column, ColumnGroup } = Table;

export default class Work extends Component {

	constructor() {
		super();

		var minAmount = parseInt(loadAppConfigItem('ACTIVATION_COST'));

		this.state = {
			data: [],
			activeKey: '0',
			loading: false,
			user: {},
			loaded: false,
			pagination: {
				pageSize: 5,
				defaultCurrent: 1,
				onChange: (page) => {
					this.updateTable(page);
				}
			},
			videoUrl: '',
			siteUrl: '',
			activationCost: minAmount,
		}

		this.selectedVideo = {};
		this.selectedSite = {};
	}

	componentDidMount() {
		this.updateTable(this.state.pagination.defaultCurrent);
		this.fetchUser();
	}

	async onActivateUser() {
		const res = await activateUser(this.state.user);
		if (!res) return;
		this.setState({
			user: { ...this.state.user, ...{ status: 1 } }
		});
	}

	onCollapseChange(key) {
		this.setState({
			activeKey: this.state.activeKey === '0' ? '1' : '0',
		});
	}

	async fetchUser() {
		const res = await getProfile();
		this.setState({
			user: res.data,
			loaded: true,
		});
	}

	async updateTable(page) {
		const params = {
			limit: this.state.pagination.pageSize,
			offset: (page - 1) * this.state.pagination.pageSize,
		};

		this.setState({
			loading: true,
		});

		const res = await getTasks(params);

		if (!res) {
			this.setState({
				data: [],
				loading: false,
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

	render() {

		return (
			<div className="user-admin-work">
				<h2 className="text-left">Work</h2>
				<Link to={getUserWorkWebsitePath()}><Button type="primary" size="large" className="mr-1">Browse Website</Button></Link>
				<Link to={getUserWorkVideoPath()}><Button type="primary" size="large" className="ml-1">Watch Videos</Button></Link>
				<Link to={getUserWorkCustomTasksPath()}><Button type="primary" size="large" className="ml-1">Custom Tasks</Button></Link>

				<div className="mt-3">
					<Collapse accordion activeKey={this.state.activeKey} onChange={this.onCollapseChange.bind(this)}>
						<Panel header="Tasks" key="1">
							<Route path={`${this.props.match.path}browse-websites`} component={BrowseWebsites} />
							<Route path={`${this.props.match.path}watch-video`} component={WatchVideo} />
							<Route path={`${this.props.match.path}custom-tasks`} component={CustomTasks} />
						</Panel>
					</Collapse>
				</div>
				{
					this.state.user.status === 0 && this.state.loaded && <div>
						<h2 className="mt-4 ml-3 fs-3">To view more ads, please <Button onClick={this.onActivateUser.bind(this)} type="primary" size="large" className="ml-1">Activate</Button> your account.</h2>
						<h3 className="mt-3">* You will be charged ${this.state.activationCost} from your account balance to activate your account.</h3>
						<h3>* Your account will remain active for 90 days since the day of activation.</h3>
					</div>
				}
			</div>
		);
	}
}
