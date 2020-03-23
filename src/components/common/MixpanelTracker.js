import React, { Component } from 'react';

import { isLoggedIn } from '../../services/session/authorization';

export default function mixPanelTrackWrapper(WrappedComponent, eventStr) {

	class MixpanelTracker extends Component {

		componentDidMount() {
			if (isLoggedIn) {
				if (window.mixpanel == undefined)
					return;

				window.mixpanel.track(eventStr);
			}
		}

		render() {
			return <WrappedComponent { ...this.props } />
		}
	}

	return MixpanelTracker;
}