import React from "react";
import { Helmet } from 'react-helmet';
import {Router, Route, Switch} from "react-router-dom";
import createHistory from "history/createBrowserHistory";

import { googleTagManagerID } from '../config/api';

import Streams from "../components/Streams/Streams";
import Accounts from "../components/Accounts/Accounts";
import Settings from "../components/Settings/Settings";
import LoginPage from "../components/LoginPage";
import AutoLogin from "../components/AutoLogin";
import NotFoundPage from "../components/NotFoundPage";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import MasterPage from '../components/MasterPage';
import OnBoarding from '../components/OnBoarding';

export const history = createHistory();

class AppRouter extends React.Component {
    render() {
        return  (
            <Router history={history}>
                <div>
                    <Switch>
                        <PublicRoute path="/" component={LoginPage} exact={true}/>
                        <PrivateRoute path="/streams" component={Streams} />
                        <PrivateRoute path="/accounts" component={Settings} />
                        <PrivateRoute path="/settings" component={Settings} />
                        <PrivateRoute path="/analytics" component={MasterPage} />
                        {/* <PrivateRoute path="/monitor-activity" component={MasterPage} /> */}
                        <PrivateRoute path="/content-finder" component={MasterPage} />
                        <PrivateRoute path="/scheduled" component={MasterPage} />
                        <PrivateRoute path="/social-media-manager" component={Accounts} />
                        <PrivateRoute path="/on-boarding" noWrappers component={OnBoarding} />
                        <PublicRoute path="/autologin/:email/:password" component={AutoLogin} />
                        <Route component={NotFoundPage}/>
                    </Switch>
                    <Helmet>
                        {
                            googleTagManagerID ? (
                                <noscript>
                                    {
                                        `<iframe src="https://www.googletagmanager.com/ns.html?id=${googleTagManagerID}"height="0" width="0" style="display:none;visibility:hidden"></iframe>`
                                    }
                                </noscript>
                            ) : null
                        }
                    </Helmet>
                </div>
            </Router>
        );
    }
}

export default AppRouter;