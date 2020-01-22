import React from 'react';
import { Route, Switch } from 'react-router-dom';

import TwitterAnalyticsBoard from '../components/Analytics/Twitter/TwitterAnalyticsBoard';
import FacebookOverview from '../components/Analytics/Facebook/FacebookOverview';

const AnalyticsRouter = ({ selectedAccount }) => (
    <div>
        <Switch>
            <Route path={`/analytics/facebook`} component={FacebookOverview} />
            <Route
                path={`/analytics/twitter`}
                render={(props) => <TwitterAnalyticsBoard {...props} selectedAccount={selectedAccount} />}
            />
            {/* <Route path={`/analytics/linkedin-overview`} component={LinkedinOverview} /> */}
        </Switch>
    </div>
);

export default AnalyticsRouter;