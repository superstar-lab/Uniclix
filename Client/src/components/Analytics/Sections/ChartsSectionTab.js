import React from 'react';

const PERIODS = [
  'Year',
  'Month',
  'Week',
  'Day'
]

class ChartsSectionTab extends React.Component {
  state = {
    accountId: 'account',
    selectedPeriod: 'Week'    
  };

  renderButtons = () => {
    const { selectedPeriod } = this.state;

    return PERIODS.map(period => (
      <button
        key={period}
        className={period === selectedPeriod ? 'btn selected' : 'btn'}
        onClick={() => this.setState({selectedPeriod: period})}
      >
        {period}
      </button>
    ))
  }

  render() {
    const {renderChart, accountId} = this.props;
    const {selectedPeriod} = this.state;

    return (
      <div>
        <div className="selection-row">
          <div className="accounts-dropdown"></div>
          <div className="period-buttons">
            {this.renderButtons()}
          </div>
        </div>
        {renderChart(accountId, selectedPeriod)}
      </div>
    );
  }
};

export default ChartsSectionTab;
