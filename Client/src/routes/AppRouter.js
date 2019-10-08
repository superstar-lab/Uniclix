import React from "react";
import {Router, Route, Switch} from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import ContentFinder from "../components/ContentFinder/ContentFinder";
import TwitterBooster from "../components/TwitterBooster/TwitterBooster";
import Scheduled from "../components/Scheduled/Scheduled";
import Streams from "../components/Streams/Streams";
import Accounts from "../components/Accounts/Accounts";
import Settings from "../components/Settings/Settings";
import Analytics from "../components/Analytics/Analytics";
import LoginPage from "../components/LoginPage";
import NotFoundPage from "../components/NotFoundPage";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

export const history = createHistory();

class AppRouter extends React.Component {
    render(){
        return  (
            <Router history={history}>
                <div>
                    <Switch>
                        <PublicRoute path="/" component={LoginPage} exact={true}/>
                        <PrivateRoute path="/content-finder" component={ContentFinder} />
                        <PrivateRoute path="/twitter-booster" component={TwitterBooster} />
                        <PrivateRoute path="/scheduled" component={Scheduled} />
                        <PrivateRoute path="/streams" component={Streams} />
                        <PrivateRoute path="/accounts" component={Accounts} />
                        <PrivateRoute path="/settings" component={Settings} />
                        <PrivateRoute path="/analytics" component={Analytics} />
                        <Route component={NotFoundPage}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default AppRouter;