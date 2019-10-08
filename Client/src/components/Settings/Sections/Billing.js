import React from 'react';
import { connect } from 'react-redux';
import { startSetProfile } from "../../../actions/profile";
import { changePlan, activateAddon, cancelAddon } from '../../../requests/billing';
import UpgradeAlert from '../../UpgradeAlert';

class Billing extends React.Component {

    state = {
        forbidden: false,
        error: 'Please delete some accounts to correspond to the limits of your new plan.',
        redirect: '/accounts'
    }

    onPlanClick = (plan) => {
        changePlan(plan).then(response => {
            this.props.startSetProfile();
        }).then()
            .catch(error => {
                if (error.response.status === 403) {
                    this.setState(() => ({
                        forbidden: true,
                        error: error.response.data.error,
                        redirect: error.response.data.redirect  
                    }))
                } else {
                    this.setError("Something went wrong!");
                }
            });
    };

    onAddonClick = (addon) => {
        activateAddon(addon).then(response => {
            this.props.startSetProfile();
        });
    };

    onAddonCancel = (addon) => {
        cancelAddon(addon).then(response => {
            this.props.startSetProfile();
        });
    };

    setForbidden = (forbidden = false) => {
        this.setState(() => ({
            forbidden
        }));
    };

    render() {
        const { profile } = this.props;
        return (
            <div className="flex-container flex-space-between pricing-table">
                <UpgradeAlert
                    isOpen={this.state.forbidden}
                    setForbidden={this.setForbidden}
                    title="Change required"
                    confirmBtn="Accounts"
                    text={this.state.error}
                    type="info"
                    redirectUri={this.state.redirect}
                />
                <table className="table table-striped flex-center">
                    <tbody>
                        <tr>
                            <th scope="col" className="empty-td"></th>
                            <th scope="col" className={`plan plan-free`}>Free</th>
                            <th scope="col" className={`plan plan-basic`}>Basic $10</th>
                            <th scope="col" className={`plan plan-plus animated wobble`}>Plus $15</th>
                            <th scope="col" className={`plan plan-premium`}>Premium $35</th>
                            <th scope="col" className={`plan plan-pro`}>Pro $70</th>
                            <th scope="col" className={`plan plan-agency`}>Agency $140</th>
                            <th scope="col" className={`plan plan-twitter-growth`}>Twitter Growth $9.99</th>
                        </tr>

                        <tr>
                            <td className="feature-category"><i className="fa fa-angle-right"></i>Social Accounts</td>
                            <td>1</td>
                            <td>6</td>
                            <td>10</td>
                            <td>25</td>
                            <td>50</td>
                            <td>100</td>
                            <td>Recommended Followers</td>
                        </tr>
                        <tr>
                            <td className="feature-category"><i className="fa fa-angle-right"></i>Post Limitation</td>
                            <td>10 posts per account </td>
                            <td>Unlimited</td>
                            <td>Unlimited</td>
                            <td>Unlimited</td>
                            <td>Unlimited</td>
                            <td>Unlimited</td>
                            <td>Recommended Unfollowers</td>
                        </tr>
                        <tr>
                            <td className="feature-category"><i className="fa fa-angle-right"></i>Schedule and Publish</td>
                            <td>Limited</td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td>Target Audience</td>
                        </tr>
                        <tr>
                            <td className="feature-category"><i className="fa fa-angle-right"></i>Content Curation</td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td>Clear Inactive Users</td>
                        </tr>
                        <tr>
                            <td className="feature-category"><i className="fa fa-angle-right"></i>Mentions</td>
                            <td><i className="fa fa-close pink-cross"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td>Reply to Followers</td>
                        </tr>
                        <tr>
                            <td className="feature-category"><i className="fa fa-angle-right"></i>Social Listening & Monitoring</td>
                            <td><i className="fa fa-close pink-cross"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td>Mentions</td>
                        </tr>
                        <tr>
                            <td className="feature-category"><i className="fa fa-angle-right"></i>Analytics</td>
                            <td>Limited</td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className="feature-category"><i className="fa fa-angle-right"></i>Advanced schedule</td>
                            <td><i className="fa fa-close pink-cross"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td><i className="fa fa-check green-check"></i></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className="empty-td"></td>
                            <td>
                                {profile.role !== null && profile.role.name === 'free' ?
                                    <button disabled className="plan-btn free-plan disabled-btn">Current Plan</button>
                                    :
                                    <button onClick={() => this.onPlanClick('free')} className="plan-btn free-plan">Change</button>
                                }

                            </td>
                            <td>
                                {profile.role !== null && profile.role.name === 'basic' ?
                                    <button disabled className="plan-btn basic-plan disabled-btn">Current Plan</button>
                                    :
                                    <button onClick={() => this.onPlanClick('basic')} className="plan-btn basic-plan">Sign Up Free</button>
                                }

                            </td>
                            <td>
                                {profile.role !== null && profile.role.name === 'plus' ?
                                    <button disabled className="plan-btn plus-plan disabled-btn">Current Plan</button>
                                    :
                                    <button onClick={() => this.onPlanClick('plus')} className="plan-btn plus-plan">Sign Up Free</button>
                                }

                            </td>
                            <td>
                                {profile.role !== null && profile.role.name === 'premium' ?
                                    <button disabled className="plan-btn premium-plan disabled-btn">Current Plan</button>
                                    :
                                    <button onClick={() => this.onPlanClick('premium')} className="plan-btn premium-plan">Sign Up Free</button>
                                }

                            </td>

                            <td>
                                {profile.role !== null && profile.role.name === 'pro' ?
                                    <button disabled className="plan-btn pro-plan disabled-btn">Current Plan</button>
                                    :
                                    <button onClick={() => this.onPlanClick('pro')} className="plan-btn pro-plan">Sign Up Free</button>
                                }
                            </td>

                            <td>
                                {profile.role !== null && profile.role.name === 'agency' ?
                                    <button disabled className="plan-btn agency-plan disabled-btn">Current Plan</button>
                                    :
                                    <button onClick={() => this.onPlanClick('agency')} className="plan-btn agency-plan">Sign Up Free</button>
                                }

                            </td>

                            <td>
                                {profile.roleAddons.length && profile.roleAddons[0].name === 'twitter_growth' ?
                                    <button onClick={() => this.onAddonCancel('twitter_growth')} className="plan-btn twitter-growth-addon">Cancel Addon</button>
                                    :
                                    <button onClick={() => this.onAddonClick('twitter_growth')} className="plan-btn twitter-growth-addon">Sign Up Free</button>
                                }
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        profile: state.profile
    };
};

const mapDispatchToProps = (dispatch) => ({
    startSetProfile: () => dispatch(startSetProfile())
});

export default connect(mapStateToProps, mapDispatchToProps)(Billing);