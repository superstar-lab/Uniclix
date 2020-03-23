import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router";
import { backendUrl } from "../../config/api";
import { setComposerModal } from "../../actions/composer";
import { startLogout } from "../../actions/auth";

class TopMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        };
    }

    toggleIsOpen = () => this.setState({ isOpen: !this.state.isOpen });

    render() {
        const { setComposerModal, logout, profile, props } = this.props;
        const { isOpen } = this.state;

        return (
            <div className="navbar-wrap">
                <div className="navbar-uniclix">
                    <a href={backendUrl} className="brand">
                        <img src="/images/uniclix.png" />
                    </a>
                    <ul className="top-menu">
                        <li>
                        <NavLink to="/scheduled" activeclassname="active" className="first-nav-item">
                            Social media manager
                        </NavLink>
                        </li>
                        <li>
                            <a
                                href="https://twitter.uniclixapp.com/"
                                target="_blank"
                                activeclassname="active">
                                    Twitter Booster
                            </a>
                        </li>
                    </ul>
                    <div
                        className={`right-top-nav ${isOpen ? 'open' : ''}`}
                        onClick={this.toggleIsOpen}
                    >
                        <div className="current-profile">
                            {
                                typeof profile !== 'undefined'
                                    && typeof profile.user !== 'undefined'
                                    && (
                                        <div className="current-profile-info">
                                            <p className="current-profile-name">{profile.user.name}</p>
                                            <p className="current-profile-email">{profile.user.email}</p>
                                        </div>
                                    )
                            }
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
                                    <i className={`fa fa-sign-out-alt`}></i> Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                {!!profile.subscription ?
                (!profile.subscription.activeSubscription ?
                    (
                        profile.remain_date > 0 ?
                        <div className="top-alert">
                            <span>
                                You have {profile.remain_date} days remaining on your Uniclix trial.
                            </span>
                            Add your billing information now to start your subscription.
                            <button
                                className="btn-text-pink"
                                onClick={() => props.history.push('/settings/billing')}>
                                    Start subscription
                            </button>
                        </div>
                        :
                        ""
                    )
                    :
                    ""
                ) 
                :
                ""
            }
            </div>
        );
    }
};

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