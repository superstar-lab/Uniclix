import React from 'react';

import Tabs from '../../../components/Tabs';
import ChartsSectionTab from './ChartsSectionTab';
import TweetsChart from '../Twitter/TweetsChart';
import FollowersChart from '../Twitter/FollowersChart';
import TwitterEngagementsChart from '../Twitter/TwitterEngagementsChart';
import EngagementsCard from '../EngagementsCard';
import TwitterImpressionsChart from '../Twitter/TwitterImpressionsChart';

class ChartsSection extends React.Component {

  engagementsInfo = (
    <div className="engagement-balls">
      <div className="ball-text">
        <div className="ball reactions"></div>
        <div>Reactions</div>
      </div>
      <div className="ball-text">
        <div className="ball comments"></div>
        <div>Coments</div>
      </div>
      <div className="ball-text">
        <div className="ball shares"></div>
        <div>Shares</div>
      </div>
    </div>
  );

  render() {
    const { selectedAccount } = this.props;

    return (
      <Tabs>
        <div label="Tweets">
          <ChartsSectionTab
            accountId={selectedAccount}
            renderChart={
            (accountId, selectedPeriod) =>
              (<TweetsChart accountId={accountId} period={selectedPeriod} />)
            }
          />
        </div>
        <div label="Fans">
          <ChartsSectionTab
            accountId={selectedAccount}
            renderChart={
            (accountId, selectedPeriod) =>
              (<FollowersChart accountId={accountId} period={selectedPeriod} />)
            }
          />
        </div>
        <div label="Engagements">
          <ChartsSectionTab
              leftInfo={this.engagementsInfo}
              accountId={selectedAccount}
              renderChart={
              (accountId, selectedPeriod) =>
                (<TwitterEngagementsChart accountId={accountId} period={selectedPeriod} />)
              }
            />
          <div className="engagements-cards-section">
            <EngagementsCard
              engagementType="Reactions"
              historicalEngagement={462}
              totalEngagementInPeriod={41}
              difference="+12"
              period="week"
            />
            <EngagementsCard
              engagementType="Comments"
              historicalEngagement={195}
              totalEngagementInPeriod={12}
              difference="+3"
              period="week"
            />
            <EngagementsCard
              engagementType="Shares"
              historicalEngagement={124}
              totalEngagementInPeriod={5}
              difference="-2"
              period="week"
            />
          </div>
        </div>
        <div label="Impressions">
          <ChartsSectionTab
              accountId={selectedAccount}
              renderChart={
              (accountId, selectedPeriod) =>
                (<TwitterImpressionsChart accountId={accountId} period={selectedPeriod} />)
              }
            />
        </div>
      </Tabs>
    );
  }

}

export default ChartsSection;
