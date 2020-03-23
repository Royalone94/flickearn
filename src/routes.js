import React from 'react';
import {Route} from 'react-router';
import {Switch, HashRouter} from 'react-router-dom';
import Homepage from './scenes/homepage/Homepage';
/*Authorization*/
import {Login, Registration, Restore, ConfirmPassword} from './scenes/authorization';
/*User Admin*/
import {Dasboard, Deposit, KYC, MyReferrals, Promotion, PaymentDetails, ReferEarn, TransferFunds, Work, Withdraw, Settings, BrowseWebsite, WatchVideo, CustomTasks} from './scenes/user-admin';
/*Route Paths*/
import * as paths from './utils/urlBuilder';

import PageNotFound from './scenes/not-found/NotFound';
import MixpanelIdentify from './components/common/MixpanelIdentify';
import PageWrapper from './components/page-wrapper/PageWrapper';
import routerWrapper from './components/route-wrapper/RouteWrapper';

export default (
    <HashRouter>
        <PageWrapper>
            <MixpanelIdentify />
            <Switch>
                <Route exact path={paths.getHomePath.mask} component={Homepage}/>
                <Route path={paths.getLoginPath.mask} component={routerWrapper(Login, false, false)}/>
                <Route path={paths.getRegistrationPath.mask} component={routerWrapper(Registration, false, false)}/>
                <Route exact path={paths.getRestorePath.mask} component={routerWrapper(Restore, false, false)}/>
                <Route path={paths.getConfirmNewPasswordPath.mask} component={routerWrapper(ConfirmPassword, false, false)}/>

                <Route exact path={paths.getUserDashboardPath.mask} component={routerWrapper(Dasboard, true, true)}/>
                <Route path={paths.getUserDepositPath.mask} component={routerWrapper(Deposit, true, true)}/>
                <Route path={paths.getUserPromotionPath.mask} component={routerWrapper(Promotion, true, true)}/>
                <Route path={paths.getUserWorkPath.mask} component={routerWrapper(Work, true, true)}/>

                <Route path={paths.getUserReferPath.mask} component={routerWrapper(ReferEarn, true, true)}/>
                <Route path={paths.getUserReferralsPath.mask} component={routerWrapper(MyReferrals, true, true)}/>
                <Route path={paths.getUserKycPath.mask} component={routerWrapper(KYC, true, true)}/>
                <Route path={paths.getUserPaymentDetailsPath.mask} component={routerWrapper(PaymentDetails, true, true)}/>
                <Route path={paths.getUserTransferFundsPath.mask} component={routerWrapper(TransferFunds, true, true)}/>
                <Route path={paths.getUserWithdrawPath.mask} component={routerWrapper(Withdraw, true, true)}/>
                <Route path={paths.getUserSettingsPath.mask} component={routerWrapper(Settings, true, true)}/>

                <Route path="*" component={PageNotFound}/>
            </Switch>
        </PageWrapper>
    </HashRouter>
);
