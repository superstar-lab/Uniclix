import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router";
import { backendUrl } from "../../config/api";
import { setComposerModal } from "../../actions/composer";
import { startLogout } from "../../actions/auth";

const TopMenu = ({ setComposerModal, logout, profile, props }) => (
    <div className="navbar-wrap">
        <div className="navbar-uniclix">
            <a href={backendUrl} className="brand"><img src="/images/uniclix.png" /></a>
            <ul className="top-menu">
                <li>
                <NavLink to="/scheduled" activeClassName="active" className="first-nav-item">Social media manager</NavLink>

                </li>
                <li>
                <a href="https://twitter.uniclixapp.com/" target="_blank" activeClassName="active">Twitter Booster</a>
                </li>
            </ul>
            <div className="right-top-nav">
                <div className="current-profile">
                    {typeof profile !== 'undefined' && typeof profile.user !== 'undefined' && <div className="current-profile-info">
                        <p className="current-profile-name">{profile.user.name}</p>
                        <p className="current-profile-email">{profile.user.email}</p>
                    </div>}
                    <div className="current-profile-avatar">
                        <img src="/images/dummy_profile.png" />
                    </div>
                </div>
                <ul className="current-profile-links">
                    <li>
                        <NavLink to="/settings" activeClassName="active" className="first-nav-item">
                            <i className={`fa fa-cog `}></i> Settings</NavLink>
                    </li>
                    <li>
                        <a className="link-cursor first-nav-item" onClick={logout}>
                            <i className={`fa fa-sign-out-alt`}></i> Logout</a>
                    </li>
                </ul>
            </div>
        </div>
        {!!profile.subscription ?
           (!profile.subscription.activeSubscription ?
               <div className="top-alert"><span>You have {profile.role.trial_days} days remaining on your Twitter Booster trial.</span>
                   Add your billing information now to start your subscription.
        <button className="btn-text-pink" onClick={() => props.history.push('/twitter-booster/manage-accounts')}>Start subscription</button>
               </div>
               : ""
           ) : ""
       }
    </div>
);

const mapStateToProps = (state, props) => {
    const profile = state.profile
    return {
        profile,
        props
    };
};

const mapDispatchToProps = (dispatch) => ({
    setComposerModal: (isOpen) => dispatch(setComposerModal(isOpen)),
    logout: () => dispatch(startLogout())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopMenu));