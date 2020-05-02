import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Profile from '../components/Settings/Sections/Profile';
import BillingProfile from '../components/Settings/Sections/BillingProfile';
import Social from '../components/Settings/Sections/Social';
import BillingPlans from '../components/Settings/Sections/BillingPlans';
import Team from '../components/Settings/Sections/Team';
import CongratsPayment from '../components/Settings/Sections/CongratsPayment';

const SettingsRouter = () => (
    <div>
        <Switch>
            <Route exact path={`/settings`} render={() => <Redirect to="/settings/profile"/>} />
            <Route exact path={`/accounts`} render={() => <Redirect to="/scheduled/posts"/>} />
            <Route path={`/settings/profile`} component={Profile} />
            <Route path={`/settings/team`} component={Team} />
            <Route path={`/settings/billing`} exact={true} component={BillingProfile} />
            <Route path={`/settings/billing/thank-you-basic`} exact={true} component={CongratsPayment} />
            <Route path={`/settings/billing/thank-you-premium`} exact={true} component={CongratsPayment} />
            <Route path={`/settings/billing/thank-you-pro`} exact={true} component={CongratsPayment} />
            <Route path={`/settings/manage-account`} exact={true} component={Social} />
            <Route path={`/settings/billing/plans`} component={BillingPlans} />
        </Switch>
    </div>
);

export default SettingsRouter;