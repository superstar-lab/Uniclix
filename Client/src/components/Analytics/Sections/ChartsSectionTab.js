import React from 'react';

import { UTC_MONTHS } from '../../../utils/constants';

const PERIODS = [
  'Year',
  'Month',
  'Week',
  'Day'
]

class ChartsSectionTab extends React.Component {
  state = {
    accountId: 'account',
    selectedPeriod: 'Week',
    rangeMovement: 0 // Will determine the dates that the user is seeing
  };

  componentDidUpdate(prevProps, prevState) {
      if (this.state.selectedPeriod !== prevState.selectedPeriod) {
        this.setState({ rangeMovement: 0 });
      }
    }

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

  moveDates = (toAdd) => {
    const { rangeMovement } = this.state;

    this.setState({ rangeMovement: rangeMovement + toAdd });
  };

  renderDateRangePicker = () => {
    const { selectedPeriod, rangeMovement } = this.state;
    let dateStructure = '',
      date = new Date(),
      baseYear = date.getFullYear(),
      baseMonth = date.getMonth(),
      baseDate = date.getDate();
      
    
    switch (selectedPeriod) {
      case 'Day':
        // I'm adding since the value of rangeMovement will be a negative number
        const day = new Date(baseYear, baseMonth, baseDate + rangeMovement);
        dateStructure = <span>{`${day.getDate()} ${UTC_MONTHS[date.getMonth()]}`}</span>
        break;
      case 'Week':
        // Multiplying by 6 because of the edge day + the rest of the days in the week
        const startDate = new Date(baseYear, baseMonth, baseDate + 6 * (rangeMovement - 1)),
          endDate = new Date(baseYear, baseMonth, baseDate + 6 * (rangeMovement));
        
        dateStructure = <span>
          {`${startDate.getDate()} ${UTC_MONTHS[startDate.getMonth()]} - ${endDate.getDate()} ${UTC_MONTHS[endDate.getMonth()]}`}
        </span>;
        break;
      case 'Month':
        const month = new Date(baseYear, baseMonth + rangeMovement, baseDate),
          showYear = baseYear !== month.getFullYear();
        dateStructure = <span>
          {
            showYear ?
              `${UTC_MONTHS[month.getMonth()]} - ${month.getFullYear()}` :
              `${UTC_MONTHS[month.getMonth()]}`
          }
        </span>;
        break;
      case 'Year':
        const year = new Date(baseYear + rangeMovement, baseMonth, baseDate);
        dateStructure = <span>{`${year.getFullYear()}`}</span>
        break;          
    }

    return <div className="date-range-container">
      <span className="arrow left" onClick={() => this.moveDates(-1)}>
        <img src="/images/icons/blue-arrow.svg" />
      </span>
      <span className="text">
        {dateStructure}
      </span>
      {
        !!rangeMovement && <span className="arrow right" onClick={() => this.moveDates(1)}>
          <img src="/images/icons/blue-arrow.svg" />
        </span>
      }
    </div>
  };

  render() {
    const {renderChart, accountId, leftInfo} = this.props;
    const {selectedPeriod} = this.state;

    return (
      <div className="chart-container">
        <div className="selection-row">
          <div className="left-info">{leftInfo}</div>
          <div className="date-range-picker">
            {this.renderDateRangePicker()}
          </div>
          <div className="period-buttons">
            {this.renderButtons()}
          </div>
        </div>
        {renderChart(accountId, selectedPeriod)}
      </div>
    );
  };
};

export default ChartsSectionTab;
