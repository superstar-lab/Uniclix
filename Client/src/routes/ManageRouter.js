import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Dashboard from '../components/TwitterBooster/Sections/Dashboard';
import MonitorActivity from '../components/TwitterBooster/Sections/MonitorActivity';
import AccountTargets from '../components/TwitterBooster/Sections/AccountTargets';
import KeywordTargets from '../components/TwitterBooster/Sections/KeywordTargets';
import Fans from '../components/TwitterBooster/Sections/Fans';
import NonFollowers from '../components/TwitterBooster/Sections/NonFollowers';
import RecentUnfollowers from '../components/TwitterBooster/Sections/RecentUnfollowers';
import RecentFollowers from '../components/TwitterBooster/Sections/RecentFollowers';
import InactiveFollowing from '../components/TwitterBooster/Sections/InactiveFollowing';
import Following from '../components/TwitterBooster/Sections/Following';
import WhiteList from '../components/TwitterBooster/Sections/WhiteList';
import BlackList from '../components/TwitterBooster/Sections/BlackList';
import Accounts from '../components/Accounts/Social';

const ManageRouter = () => (
    <div>
        <Switch>
            <Route exact path={`/twitter-booster`} render={() => <Redirect to="/twitter-booster/dashboard"/>} />
            <Route path={`/twitter-booster/dashboard`} component={Dashboard} />
            <Route path={`/twitter-booster/monitor-activity`} component={MonitorActivity} />
            <Route path={`/twitter-booster/account-targets`} component={AccountTargets} />
            <Route path={`/twitter-booster/keyword-targets`} component={KeywordTargets} />
            <Route path={`/twitter-booster/fans`} component={Fans} />
            <Route path={`/twitter-booster/non-followers`} component={NonFollowers} />
            <Route path={`/social-media-manager/manage-accounts`} component={Accounts} />
            <Route path={`/twitter-booster/recent-followers`} component={RecentFollowers} />
            <Route path={`/twitter-booster/inactive-following`} component={InactiveFollowing} />
            <Route path={`/twitter-booster/following`} component={Following} />
            <Route path={`/twitter-booster/WhiteList`} component={WhiteList} />
            <Route path={`/twitter-booster/BlackList`} component={BlackList} />
        </Switch>
    </div>
);

export default ManageRouter;