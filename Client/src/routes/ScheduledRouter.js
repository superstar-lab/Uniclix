import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import UnapprovedPosts from '../components/Scheduled/Sections/UnapprovedPosts';
import Scheduled from '../components/Scheduled/Scheduled';
import PastScheduled from '../components/Scheduled/Sections/PastScheduled';

const ScheduledRouter = () => (
    <Switch>
        <Route exact path={`/scheduled`} render={() => <Redirect to="/scheduled/posts" />} />
        <Route path={`/scheduled/unapproved`} component={UnapprovedPosts} />
        <Route path={`/scheduled/posts`} component={Scheduled} />
        <Route path={`/scheduled/past`} component={PastScheduled} />
    </Switch>
);

export default ScheduledRouter;