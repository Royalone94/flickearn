import React, {Component} from 'react';

import MixpanelTrackWrapper from '../../../components/common/MixpanelTracker';

class Promotion extends Component {
    render() {
        return (
            <div className="user-admin-promotion">
                <h2>Promotion</h2>
                <h3>Get 10% extra balance on Ethereum deposit.</h3>
            </div>
        );
    }
}

export default MixpanelTrackWrapper(Promotion, 'Promotion');