import { Component } from 'react';
import { isEmpty } from 'lodash';

import { getProfile } from '../../services/session/authorization';

export default class MixpanelIdentify extends Component {

	constructor() {
		super();

		this.state = {
			user: {},
			loaded: false,
		};
	}

	componentDidMount() {
		this.fetchUser();
	}

	async fetchUser() {
		const res = await getProfile();
		this.setState({
			user: res.data,
			loaded: true,
		}, () => {
			const { email, username, id } = this.state.user;
			if (window.mixpanel == undefined)
				return;
				
			window.mixpanel.people.set({
				"$email": email,
				"username": username,
				"$distinct_id": id,
			});

			window.mixpanel.identify(id);
		});
	}

	render() {

		return ( null );
	}
}