import React, { Component } from 'react';
import { Table, Button, Collapse, Input, Tabs } from 'antd';

import { getCustomTasks, getCustomTaskStatuses, interactCustomTask, updateCustomTask } from '../../../../services/session/authorization';
import MixpanelTrackWrapper from '../../../../components/common/MixpanelTracker';

import './customtasks.scss'

const TabPane = Tabs.TabPane;
const { Column, ColumnGroup } = Table;
const STATUSES = {
	'na': 'N/A',
	'pe': 'Pending',
	'ap': 'Approved',
	'de': 'Declined',
};

class CustomTasks extends Component {

	constructor() {
		super();

		this.state = {
			data: [],
			loading: false,
			currentTab: 1,
			pagination: {
				pageSize: 5,
				defaultCurrent: 1,
				onChange: (page) => {
					this.updateTable(page, this.state.currentTab == "2");
				}
			},
			siteUrl: '',
			showInstruction: false,
			selectedRecord: -1,
			workproof: '',
		};

		this._onChangeTab = this._onChangeTab.bind(this);
	}

	componentDidMount() {
		this.updateTable(this.state.pagination.defaultCurrent, false);
	}

	async updateTable(page, submitted) {
		const params = submitted ? {
			limit: this.state.pagination.pageSize,
			offset: (page - 1) * this.state.pagination.pageSize,
			submitted: true,
		} : {
			limit: this.state.pagination.pageSize,
			offset: (page - 1) * this.state.pagination.pageSize,
		};

		this.setState({
			loading: true
		});

		const res = await getCustomTasks(params);
		const resStatus = await getCustomTaskStatuses();

		if (!res) {
			this.setState({
				data: [],
				loading: false,
				showInstruction: false,
			});
			return;
		}

		this.setState({
			data: res.results,
			statuses: resStatus.results,
			loading: false,
			pagination: { ...this.state.pagination, ...{ total: res.count } },
			showInstruction: false,
		});
	}

	toggleInstruction(record) {
		return (e) => {
			if (this.state.currentTab == "2") return;

			this.setState({ showInstruction: !this.showInstruction, instruction: record.instruction, selectedRecord: record.id });
		}
	}

	handleProofChange = (e) => {
		this.setState({ workproof: e.target.value });
	}

	async updateTask(data) {

		const res = await updateCustomTask({ ...data, status: 'pe', action: 1 });

		if (res) {
			this.updateTable(this.state.pagination.defaultCurrent, false);
		}
	}

	submitWorkproof = (e) => {
		this.updateTask({
			id: this.state.selectedRecord,
			workproof: this.state.workproof
		});
	}

	renderInstruction() {
		const { instruction } = this.state;

		return (
			<div>
				<strong>Instruction:&nbsp;</strong>{instruction}
				<div className="proof-submit">
					<strong>Work proof:</strong>
					<Input placeholder="Work proof" value={this.state.workproof} onChange={this.handleProofChange}/>
					<Button type="primary" onClick={this.submitWorkproof}>Submit</Button>
				</div>
			</div>
		)
	}

	renderTable() {

		return (
			<Table pagination={this.state.pagination} loading={this.state.loading} dataSource={this.state.data} rowKey="id" scroll={{x:575}}>
				<Column
					title="#"
					key="index"
					render={(text, record, index) => index + 1}
				/>
				<Column
					title="Task title"
					dataIndex="title"
					key="title"
					render={(text, record) => (
						<a onClick={this.toggleInstruction(record)}>{text}</a>
					)}
				/>
				<Column
					title="Reward amount"
					dataIndex="reward"
					key="reward"
					render={(text) => `$${text}`}
				/>
				<Column
					title="Action"
					dataIndex="action"
					key="action"
					render={(text) => {
						return this.state.currentTab == "1" ? 'Available' : 'Submitted';
					}}
				/>
				<Column
					title="Status"
					dataIndex="status"
					key="status"
					render={(text, record) => {
						if (this.state.currentTab == "1") return STATUSES['na'];

						let status = this.state.statuses.filter(status => status.task == record.id)[0];
						if (status)
							return STATUSES[status.status];
					}}
				/>
			</Table>
		)
	}

	_onChangeTab(key) {
		this.setState({ currentTab: key, showInstruction: false });
		this.updateTable(this.state.pagination.defaultCurrent, key == "2");
	}

	render() {
		return (
			<div>
				<Tabs defaultActiveKey="1" onChange={this._onChangeTab}>
					<TabPane tab="Available Tasks" key="1">{this.renderTable()}</TabPane>
					<TabPane tab="Submitted Tasks" key="2">{this.renderTable()}</TabPane>
				</Tabs>
				{
					this.state.showInstruction &&
						this.renderInstruction()
				}
			</div>
		);
	}
}

export default MixpanelTrackWrapper(CustomTasks, 'CustomTasks');