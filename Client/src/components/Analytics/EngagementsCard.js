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
    data: PropTypes.object,
    period: PropTypes.string,
    isLoading: PropTypes.bool
  };

  render() {
    const {
      engagementType,
      data,
      period,
      isLoading
    } = this.props;

    return (
      <div className="engagements-card">
        {
          !isLoading && data.historicalEngagement !== undefined && (
            <React.Fragment>
              <div className="graphics">
                <div className="left-side">
                  <div className="total">
                    <img src={`/images/icons/${ICONS[engagementType]}.svg`} />
                    <span className="number">{data.historicalEngagement}</span>
                  </div>
                  <div className="engagement-label">{engagementType}</div>
                </div>
                <div className="right-side">
                  <img src={`/images/icons/analytics-line-${COLOR_LINE[engagementType]}.svg`} />
                  <div className="difference">
                    <span className="amount">
                      {`${data.difference > 0 ? `+${data.difference}` : data.difference}`}
                    </span>
                    {`this ${period}`}
                  </div>
                </div>
              </div>
              <div className="total-period">
                <span className="amount">{`${data.totalEngagementInPeriod} ${engagementType.toLowerCase()}`}</span>{` this ${period}`}
              </div>
            </React.Fragment>
          )
        }
        {
          !isLoading && data.historicalEngagement === undefined && (
            <div>No data.</div>
          )
        }
        { isLoading && <Loader type="Bars" color="#46a5d1" height={60} width={60} /> }
      </div>
    );
  }
}

export default EngagementsCard;
