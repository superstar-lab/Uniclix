import React from 'react';
import PropTypes from 'prop-types';

import Tabs from '../../../components/Tabs';
import ChartsSectionTab from './ChartsSectionTab';
import TwitterSimpleChart from '../Twitter/TwitterSimpleChart';
import TwitterEngagementsChart from '../Twitter/TwitterEngagementsChart';
import EngagementsCard from '../EngagementsCard';
import TwitterImpressionsChart from '../Twitter/TwitterImpressionsChart';

class ChartsSection extends React.Component {
  static propTypes = {
    selectedAccount: PropTypes.number.isRequired,
    socialMedia: PropTypes.string.isRequired
  };

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
    const { selectedAccount, socialMedia } = this.props;

    return (
      <Tabs>
        <div label="Tweets">
          <ChartsSectionTab
            accountId={selectedAccount}
            socialMedia={socialMedia}
            pastTimeLimit={90}
            renderChart={
            (props) =>
              (<TwitterSimpleChart {...props} endPointType="tweetsChartData" chartDataKey="Tweets" />)
            }
          />
        </div>
        <div label="Fans">
          <ChartsSectionTab
            accountId={selectedAccount}
            socialMedia={socialMedia}
            pastTimeLimit={90}
            renderChart={
            (props) =>
              (<TwitterSimpleChart {...props} endPointType="followersChartData" chartDataKey="Followers" />)
            }
          />
        </div>
        <div label="Engagements">
          <ChartsSectionTab
              leftInfo={this.engagementsInfo}
              accountId={selectedAccount}
              socialMedia={socialMedia}
              pastTimeLimit={90}
              renderChart={
              (props) =>
                (<TwitterEngagementsChart {...props} />)
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
              socialMedia={socialMedia}
              pastTimeLimit={90}
              renderChart={
              (props) =>
                (<TwitterImpressionsChart {...props} />)
              }
            />
        </div>
      </Tabs>
    );
  }

}

export default ChartsSection;
