import React from 'react';
import PropTypes from 'prop-types';

import Tabs from '../../Tabs';
import ChartsSectionTab from '../Sections/ChartsSectionTab';
import TwitterSimpleChart from './TwitterSimpleChart';
import TwitterEngagementsChart from './TwitterEngagementsChart';
import TwitterImpressionsChart from './TwitterImpressionsChart';

class TwitterChartsSection extends React.Component {
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
        </div>
        {/* <div label="Impressions">
          <ChartsSectionTab
              accountId={selectedAccount}
              socialMedia={socialMedia}
              pastTimeLimit={90}
              renderChart={
              (props) =>
                (<TwitterImpressionsChart {...props} />)
              }
            />
        </div> */}
      </Tabs>
    );
  }

}

export default TwitterChartsSection;
