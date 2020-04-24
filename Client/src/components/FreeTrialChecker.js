import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const FreeTrialChecker = ({ freeTrialEnded, isBillingPage }) => {
  return freeTrialEnded && !isBillingPage ? <Redirect to="/settings/billing" /> : null;
};

const mapStateToProps = (state) => ({
  freeTrialEnded: state.profile.remain_date <= 0 &&
      state.profile.subscription.activeSubscription === false
});

export default connect(mapStateToProps)(FreeTrialChecker);
