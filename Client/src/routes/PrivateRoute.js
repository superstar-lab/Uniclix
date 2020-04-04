import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import TopMenu from "../components/Menus/TopMenu";
import EmailChecker from "../components/EmailChecker";
import ActiveChecker from "../components/ActiveChecker";
import Middleware from "../components/Middleware";
import SocialAccountsPrompt from "../components/SocialAccountsPrompt";
import ROUTES from '../config/routesPerRole';

import {
    BrowserView,
    MobileView
} from "react-device-detect";

export const PrivateRoute = ({
    isAuthenticated,
    middleware,
    component: Component,
    accessLevel,
    location,
    ...rest }) => {

        return (
        <Route {...rest} component={(props) => (
            isAuthenticated ?
                (
                    (!!middleware) ?
                        (
                            <div>
                                <Middleware />
                            </div>
                        ) :
                        ROUTES[accessLevel].indexOf(location.pathname) !== -1 ?
                        (
                            <div>
                                <BrowserView viewClassName="app-wrap">
                                    <TopMenu />
                                    <Component {...props} />
                                    <EmailChecker />
                                    <ActiveChecker />
                                </BrowserView>

                                <MobileView>
                                    <div className="p20">
                                        <SocialAccountsPrompt
                                            image="/images/hello_bubble_smiley.svg"
                                            title="Please switch to desktop version!"
                                            description="We support only the desktop version at the moment. Please hang in there, our mobile app is coming soon."
                                        />
                                    </div>

                                </MobileView>

                            </div>
                        ) :
                        <Redirect to="/scheduled/posts" />
                ) : (
                    <Redirect to="/" />
                )
        )} />
    )};

const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.token,
    middleware: state.middleware.step,
    accessLevel: state.profile.accessLevel
});

export default connect(mapStateToProps)(PrivateRoute);