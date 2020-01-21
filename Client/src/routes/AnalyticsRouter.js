import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Overview from '../components/Analytics/Sections/Overview';
import Advanced from '../components/Analytics/Sections/Advanced';
import FacebookOverview from '../components/Analytics/Facebook/FacebookOverview';
import TwitterOverview from '../components/Analytics/Twitter/TwitterOverview';
import LinkedinOverview from '../components/Analytics/Linkedin/LinkedinOverview';
import TwitterAnalytics from '../components/TwitterBooster/Sections/Dashboard';


const AnalyticsRouter = () => (
    <div>
        <Switch>
            {/* <Route path={`/analytics/facebook-overview`} component={FacebookOverview} /> */}
            <Route path={`/analytics/twitter`} component={TwitterAnalytics} />
            {/* <Route path={`/analytics/linkedin-overview`} component={LinkedinOverview} /> */}
        </Switch>
    </div>
);

export default AnalyticsRouter;