import React from 'react';
import PropTypes from 'prop-types';

const COLOR_LINE = {
  Reactions: 'pink',
  Comments: 'blue',
  Shares: 'orange'
};

const ICONS = {
  Reactions: 'blue-heart',
  Comments: 'chat-bubbles',
  Shares: 'share-arrow'
};

class EngagementsCard extends React.Component {
  static propTypes = {
    engagementType: PropTypes.oneOf(['Reactions', 'Comments', 'Shares']),
    historicalEngagement: PropTypes.number.isRequired,
    totalEngagementInPeriod: PropTypes.number.isRequired,
    difference: PropTypes.string.isRequired,
    period: PropTypes.string.isRequired
  };

  render() {
    const {
      engagementType,
      historicalEngagement,
      totalEngagementInPeriod,
      difference,
      period
    } = this.props;

    return (
      <div className="engagements-card">
        <div className="graphics">
          <div className="left-side">
            <div className="total">
              <img src={`/images/icons/${ICONS[engagementType]}.svg`} />
              <span className="number">{historicalEngagement}</span>
            </div>
            <div className="engagement-label">{engagementType}</div>
          </div>
          <div className="right-side">
            <img src={`/images/icons/analytics-line-${COLOR_LINE[engagementType]}.svg`} />
            <div className="difference">
              <span className="amount">{difference}</span>
              {`this ${period}`}
            </div>
          </div>
        </div>
        <div className="total-period">
          <span className="amount">{`${totalEngagementInPeriod} ${engagementType.toLowerCase()}`}</span>{` this ${period}`}
        </div>
      </div>
    );
  }
}

export default EngagementsCard;
