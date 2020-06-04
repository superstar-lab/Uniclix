import React from 'react';
import { Route, Switch } from 'react-router-dom';
import userflow from 'userflow.js';
import MonitorActivity from '../components/TwitterBooster/Sections/MonitorActivity';
import AccountTargets from '../components/TwitterBooster/Sections/AccountTargets';
import KeywordTargets from '../components/TwitterBooster/Sections/KeywordTargets';
import Fans from '../components/TwitterBooster/Sections/Fans';
import NonFollowers from '../components/TwitterBooster/Sections/NonFollowers';
import RecentFollowers from '../components/TwitterBooster/Sections/RecentFollowers';
import InactiveFollowing from '../components/TwitterBooster/Sections/InactiveFollowing';
import Following from '../components/TwitterBooster/Sections/Following';
import WhiteList from '../components/TwitterBooster/Sections/WhiteList';
import BlackList from '../components/TwitterBooster/Sections/BlackList';
import AnalyticsLanding from '../components/Analytics/AnalyticsLanding';
import ScheduledRouter from '../routes/ScheduledRouter';
import ContentFinderLanding from '../components/ContentFinder/ContentFinderLanding';

const ManageRouter = () => (
    <div>
        <Switch>
            <Route path={`/analytics`} component={AnalyticsLanding} />
            <Route path={`/monitor-activity`} component={MonitorActivity} />
            <Route path={`/content-finder`} component={ContentFinderLanding} />
            <Route path={'/scheduled/'} component={ScheduledRouter} />
            {/*Obsolete routes. Still there to avoid breaking things but will be changed in the future*/}
            <Route path={`/twitter-booster/account-targets`} component={AccountTargets} />
            <Route path={`/twitter-booster/fans`} component={Fans} />
            <Route path={`/twitter-booster/non-followers`} component={NonFollowers} />
            <Route path={`/twitter-booster/recent-followers`} component={RecentFollowers} />
            <Route path={`/twitter-booster/inactive-following`} component={InactiveFollowing} />
            <Route path={`/twitter-booster/following`} component={Following} />
            <Route path={`/twitter-booster/WhiteList`} component={WhiteList} />
            <Route path={`/twitter-booster/BlackList`} component={BlackList} />
        </Switch>
    </div>
);

export default ManageRouter;