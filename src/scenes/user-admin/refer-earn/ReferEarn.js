import React, { Component } from 'react';
import { message, Button, Icon } from 'antd';
import {FacebookShareButton} from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { getReferral } from '../../../services/session/authorization';
import MixpanelTrackWrapper from '../../../components/common/MixpanelTracker';

import './referearn.scss';

const ButtonGroup = Button.Group;
const success = () => {
    message.success('Copied.');
};

class ReferEarn extends Component {
    constructor() {
        super();

        this.state = {
            referLink: ''
        }
    }

    async componentDidMount() {
        const referral =  await getReferral();

        this.setState({
            referLink: referral.data.referral_link
        });
    }

    render() {
        return (
            <div className="user-admin-refer-earn">
                <h1 className="text-left">Refer & Earn</h1>
                <h3>Your referral link is <a href={this.state.referLink}>{this.state.referLink}</a></h3>
                <div className="button-group">
                    <FacebookShareButton url={this.state.referLink}>
                        <div id="fb-share-button">
                            <svg viewBox="0 0 12 12" preserveAspectRatio="xMidYMid meet">
                                <path className="svg-icon-path" d="M9.1,0.1V2H8C7.6,2,7.3,2.1,7.1,2.3C7,2.4,6.9,2.7,6.9,3v1.4H9L8.8,6.5H6.9V12H4.7V6.5H2.9V4.4h1.8V2.8 c0-0.9,0.3-1.6,0.7-2.1C6,0.2,6.6,0,7.5,0C8.2,0,8.7,0,9.1,0.1z"></path>
                            </svg>
                            <span>Share</span>
                        </div>
                    </FacebookShareButton>
                    <CopyToClipboard text={this.state.referLink}
                        onCopy={() => this.setState({copied: true})}>
                        <Button type="primary" onClick={success}>
                            <Icon type="copy" theme="outlined" />
                        </Button>
                    </CopyToClipboard>
                </div>
                <h3>* Earn $5 for each referral</h3>
            </div>
        );
    }
}

export default MixpanelTrackWrapper(ReferEarn, 'ReferEarn');