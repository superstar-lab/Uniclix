import React from 'react';
import PropTypes from 'prop-types';

import { pageInsightsByType as fbpageInsightsByType } from '../../requests/facebook/channels';
import { pageInsightsByType as twPageInsightsByType } from '../../requests/twitter/channels';

import EngagementsCard from './EngagementsCard';

const endpoints = {
  twitter: twPageInsightsByType,
  facebook: fbpageInsightsByType
};

class EngagementCardsSection extends React.Component {
  static propTypes = {
    accountId: PropTypes.number.isRequired,
    startDate: PropTypes.number.isRequired,
    endDate: PropTypes.number.isRequired,
    selectedPeriod: PropTypes.string.isRequired,
    socialMedia: PropTypes.string.isRequired
  }

  state = {
    data: null,
    isLoading: false
  };

  fetchAnalyticsData = () => {
    const { accountId, startDate, endDate, selectedPeriod, socialMedia } = this.props;
    const pageInsightsByType = endpoints[socialMedia];

    this.setState({isLoading: true});

    pageInsightsByType(
      accountId,
      startDate,
      endDate,
      'engagementsCardData',
      selectedPeriod.toLowerCase()
    )
      .then((response) => {
        this.setState({isLoading: false, data: response});
      })
      .catch(() => {
        this.setState({isLoading: false});
      });
  }

  componentDidMount() {
    this.fetchAnalyticsData();
  }

  componentDidUpdate(prevProps) {
    const { selectedPeriod, accountId, startDate } = this.props;
    if (
      selectedPeriod !== prevProps.selectedPeriod ||
      accountId !== prevProps.accountId ||
      startDate !== prevProps.startDate
    ) {
      this.fetchAnalyticsData();
    }
  }

  render() {
    const { isLoading, data } = this.state;
    const { selectedPeriod } = this.props;

    return (
      <div className="engagements-cards-section">
        <EngagementsCard
          engagementType="Reactions"
          data={data ? data.reactions : {}}
          period={selectedPeriod.toLowerCase()}
          isLoading={isLoading}
        />
        <EngagementsCard
          engagementType="Comments"
          data={data ? data.comments : {}}
          period={selectedPeriod.toLowerCase()}
          isLoading={isLoading}
        />
        <EngagementsCard
          engagementType="Shares"
          data={data ? data.shares.historicalNumber : {}}
          period={selectedPeriod.toLowerCase()}
          isLoading={isLoading}
        />
    </div>
    );
  }
}

export default EngagementCardsSection;
