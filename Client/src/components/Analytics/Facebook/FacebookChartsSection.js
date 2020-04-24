import React from 'react';
import PropTypes from 'prop-types';

import Tabs from '../../Tabs';
import ChartsSectionTab from '../Sections/ChartsSectionTab';
import FacebookSimpleChart from './FacebookSimpleChart';
import FacebookEngagementsChart from './FacebookEngagementsChart';

class FacebookChartsSection extends React.Component {
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
        <div label="Posts">
          <ChartsSectionTab
            accountId={selectedAccount}
            socialMedia={socialMedia}
            renderChart={
            (props) =>
              (<FacebookSimpleChart {...props} endPointType="postsChartData" chartDataKey="Posts" />)
            }
          />
        </div>
        <div label="Fans">
          <ChartsSectionTab
            accountId={selectedAccount}
            socialMedia={socialMedia}
            renderChart={
            (props) =>
              (<FacebookSimpleChart {...props} endPointType="fansChartData" chartDataKey="Fans" />)
            }
          />
        </div>
        <div label="Engagements">
          <ChartsSectionTab
              leftInfo={this.engagementsInfo}
              accountId={selectedAccount}
              socialMedia={socialMedia}
              renderChart={
              (props) =>
                (<FacebookEngagementsChart {...props} />)
              }
            />
        </div>
        <div label="Impressions">
          <ChartsSectionTab
            accountId={selectedAccount}
            socialMedia={socialMedia}
            renderChart={
            (props) =>
              (<FacebookSimpleChart {...props} endPointType="impressionsChartData" chartDataKey="Tweets" />)
            }
          />
        </div>
      </Tabs>
    );
  }

}

export default FacebookChartsSection;
