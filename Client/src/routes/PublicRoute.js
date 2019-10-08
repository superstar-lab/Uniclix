import React from 'react';
import {connect} from 'react-redux';
import {Route, Redirect, withRouter} from 'react-router-dom';

export const PublicRoute = ({
    isAuthenticated, 
    component: Component, 
    ...rest}) => (
    <Route {...rest} component={(props) => {
        let redirect = props.location.search.indexOf("twitter-booster") != -1 ? '/twitter-booster/keyword-targets' : '/accounts';
        return (
            !isAuthenticated ? 
            (   <div>
                    <Component {...props} />
                </div>
            ) : (
                <Redirect to={`${redirect+props.location.search}`} />
            )
        )}
    } />
);

const mapStateToProps = (state) => ({
    isAuthenticated: !!state.auth.token
});

export default connect(mapStateToProps)(withRouter(PublicRoute));