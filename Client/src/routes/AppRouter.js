import React from "react";
import {Router, Route, Switch} from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import ContentFinder from "../components/ContentFinder/ContentFinder";
import Scheduled from "../components/Scheduled/Scheduled";
import Streams from "../components/Streams/Streams";
import Accounts from "../components/Accounts/Accounts";
import Settings from "../components/Settings/Settings";
import LoginPage from "../components/LoginPage";
import NotFoundPage from "../components/NotFoundPage";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import MasterPage from '../components/MasterPage';

export const history = createHistory();

class AppRouter extends React.Component {
    render(){
        return  (
            <Router history={history}>
                <div>
                    <Switch>
                        <PublicRoute path="/" component={LoginPage} exact={true}/>
                        <PrivateRoute path="/streams" component={Streams} />
                        <PrivateRoute path="/accounts" component={Settings} />
                        <PrivateRoute path="/settings" component={Settings} />
                        <PrivateRoute path="/analytics" component={MasterPage} />
                        <PrivateRoute path="/monitor-activity" component={MasterPage} />
                        <PrivateRoute path="/content-finder" component={MasterPage} />
                        <PrivateRoute path="/scheduled" component={MasterPage} />
                        <PrivateRoute path="/social-media-manager" component={Accounts} />
                        <Route component={NotFoundPage}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default AppRouter;