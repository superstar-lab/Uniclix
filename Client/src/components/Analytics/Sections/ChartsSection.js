import React from 'react';

import Tabs from '../../../components/Tabs';
import ChartsSectionTab from './ChartsSectionTab';
import TweetsChart from '../Twitter/TweetsChart';

class ChartsSection extends React.Component {

  render() {
    return (
      <Tabs>
        <div label="Tweets">
          <ChartsSectionTab
            accountId={this.props.selectedAccount}
            renderChart={
            (accountId, selectedPeriod) =>
              (<TweetsChart accountId={accountId} period={selectedPeriod} />)
            }
          />
        </div>
        <div label="Fans">
          My Fans
        </div>
        <div label="Engagements">
          My Engagements
        </div>
        <div label="Impressions">
          My Impressions
        </div>
      </Tabs>
    );
  }

}

export default ChartsSection;
