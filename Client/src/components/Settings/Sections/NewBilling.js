import React from 'react';
import { connect } from 'react-redux';
import { startSetProfile } from "../../../actions/profile";
import { changePlan, cancelAddon, getPlans, cancelSubscription, resumeSubscription } from '../../../requests/billing';
import UpgradeAlert from '../../UpgradeAlert';
import Checkout from './Checkout';
import { LoaderWithOverlay as Loader } from '../../Loader';

class Billing extends React.Component {

  state = {
    forbidden: false,
    plans: null,
    subscription: null,
    addon: null,
    loading: true,
    error: false,
  }

  componentDidMount() {
    try {
      getPlans()
        .then((response) => {
          this.setState(() => ({
            plans: response.plans,
            subscription: response.subscription,
            addon: response.addon,
            loading: false
          }));
        }).catch(error => {
          this.setState(() => ({
            error: "Something went wrong!",
          }));
          return Promise.reject(error);
        });
    } catch (error) {

    }
  }

  onPlanClick = (plan) => {
    this.setLoading(true);
    changePlan(plan).then(response => {
      this.props.startSetProfile();
      this.setLoading(false);
    }).then()
      .catch(error => {
        if (error.response.status === 403) {
          this.setForbidden(true);
        } else if(error.response.status === 500) {
          this.setState(() => ({
            error: response
          }));
        }
      });
  };

  cancelPlan = () => {
    this.setLoading(true);
    cancelSubscription().then(response => {
      this.props.startSetProfile();
      this.setLoading(false);
    });
  };

  resumePlan = (type) => {
    this.setLoading(true);
    resumeSubscription(type).then(response => {
      this.props.startSetProfile();
      this.setLoading(false);
    });
  };


  onAddonCancel = (addon) => {
    this.setLoading(true);
    cancelAddon(addon).then(response => {
      this.props.startSetProfile();
      this.setLoading(false);
    });
  };

  setForbidden = (forbidden = false) => {
    this.setState(() => ({
      forbidden
    }));
  };

  setLoading = (loading = false) => {
    this.setState(() => ({
      loading
    }));
  }

  render() {
    const { profile } = this.props;
    return (
      <div>
        {this.state.error &&
          <div className="alert alert-danger">{this.state.error}</div>
        }
        {this.state.loading && <Loader />}
        {this.state.plans != null &&
          <div className="flex-container flex-space-between pricing-table">
            <UpgradeAlert
              isOpen={this.state.forbidden}
              setForbidden={this.setForbidden}
              title="Change required"
              confirmBtn="Accounts"
              text="Please remove some accounts to correspond to the limits of the new plan"
              type="info"
              redirectUri="/accounts"
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
                  <td className="feature-category"><i className="fa fa-angle-right"></i>Users</td>
                  <td>1</td>
                  <td>1</td>
                  <td>1</td>
                  <td>2</td>
                  <td>6</td>
                  <td>6</td>
                  <td></td>
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
                    {this.state.plans.map((plan, index) => (
                        <td key={index}>
                        {
                            profile.subscription.currentPlan == 1 
                            ? <Checkout plan={plan.name} subType="main" trialDays={plan.trial_days} setLoading={this.setLoading} setProfile={this.props.startSetProfile} text={plan.trial_days == 0 ? "Buy" : "Start " + plan.trial_days + " Free Trial"}/>
                            : [
                                (plan.id == 1 
                                ? "Free Plan"
                                : plan.id != 1 && plan.id == profile.subscription.currentPlan && profile.subscription.onGracePeriod == false && profile.subscription.activeSubscription == true?
                                <button onClick={() => this.cancelPlan()} className="plan-btn btn-cancel">Cancel</button>
                                : plan.id != 1 && plan.id == profile.subscription.currentPlan && profile.subscription.onGracePeriod == true &&profile.subscription.activeSubscription == true?
                                <button onClick={() => this.resumePlan('main')} className="plan-btn btn-resume">Resume</button>
                                : plan.id != 1 && plan.id != profile.subscription.currentPlan && profile.subscription.activeSubscription == true ? 
                                <button onClick={() => this.onPlanClick(plan.name)} className="plan-btn free-plan">Change</button>
                                : <Checkout plan={plan.name} subType="main" trialDays={plan.trial_days} setLoading={this.setLoading} setProfile={this.props.startSetProfile} text={plan.trial_days == 0 ? "Buy" : "Start " + plan.trial_days + " Free Trial"}/>
                                )
                            ]
                        }
                        </td>
                    ))}

                    <td>
                    {
                        profile.addon == null ? <Checkout plan="twitter_growth" subType="addon" setLoading={this.setLoading} setProfile={this.props.startSetProfile} trialDays="30" text="Free 30 Days Trial" /> :
                        [
                            (
                                profile.addon.activeAddon == true && profile.addon.addonOnGracePeriod ==false
                                ? <button onClick={() => this.onAddonCancel('twitter_growth')} className="plan-btn btn-cancel">Cancel Addon</button>
                                : profile.addon.activeAddon == true && profile.addon.addonOnGracePeriod == true
                                ? <button onClick={() => this.resumePlan('addon')} className="plan-btn btn-resume">Resume Addon</button> 
                                : <Checkout plan="twitter_growth" subType="addon" setLoading={this.setLoading} setProfile={this.props.startSetProfile} trialDays="30" text="Free 30 Days Trial" />
                            )
                        ] 
                    }                                    
                    </td> 

                </tr>
              </tbody>
            </table>
          </div>}
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