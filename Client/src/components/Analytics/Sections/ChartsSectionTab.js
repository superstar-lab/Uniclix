import React from 'react';

import { UTC_MONTHS } from '../../../utils/constants';

const PERIODS = [
  'Year',
  'Month',
  'Week',
  'Day'
]

class ChartsSectionTab extends React.Component {

  constructor(props) {
    super(props);

    const endDate = new Date();

    this.state = {
      accountId: 'account',
      selectedPeriod: 'Week',
      rangeMovement: 0, // Will determine the dates that the user is seeing
      startDate: new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate() - 6
      ).getTime(),
      endDate: endDate.getTime()
    };
  }

  componentDidUpdate(prevProps, prevState) {
      const { selectedPeriod } = this.state;
      // We want to reset the values when the period is changed
      if (selectedPeriod !== prevState.selectedPeriod) {
        const startDate = selectedPeriod === 'Week' ?
          this.getDate(- 1, selectedPeriod) :
          this.getDate(0, selectedPeriod),
        endDate = selectedPeriod === 'Week' ?
          this.getDate(0, selectedPeriod) :
          startDate;

        this.setState({
          rangeMovement: 0,
          startDate: startDate.getTime(),
          endDate: endDate.getTime()
        });
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

  getDate = (rangeMovement, period) => {
    const date = new Date(),
      baseYear = date.getFullYear(),
      baseMonth = date.getMonth(),
      baseDate = date.getDate();
    let resultingDate = null;

    switch (period) {
      case 'Day':
        resultingDate = new Date(baseYear, baseMonth, baseDate + rangeMovement);
        break;
      case 'Week':
        resultingDate = new Date(baseYear, baseMonth, baseDate + 6 * (rangeMovement));
        break;
      case 'Month':
        resultingDate = new Date(baseYear, baseMonth + rangeMovement, baseDate);
        break;
      case 'Year':
        resultingDate = new Date(baseYear + rangeMovement, baseMonth, baseDate);
        break;
    }

    return resultingDate;
  };

  // We need to change the dates here in order to trigger the API call
  // with the correct data.
  moveDates = (toAdd, selectedPeriod) => {
    const { rangeMovement } = this.state,
      startDate = selectedPeriod === 'Week' ?
        this.getDate(rangeMovement + toAdd - 1, selectedPeriod) :
        this.getDate(rangeMovement + toAdd, selectedPeriod),
      endDate = selectedPeriod === 'Week' ?
        this.getDate(rangeMovement + toAdd, selectedPeriod) :
        startDate;

    this.setState({
      rangeMovement: rangeMovement + toAdd,
      startDate: startDate.getTime(),
      endDate: endDate.getTime()
    });
  };

  renderDateRangePicker = () => {
    const { selectedPeriod, rangeMovement } = this.state;
    let dateStructure = '',
      startDate = null,
      endDate = null;
      
    
    switch (selectedPeriod) {
      case 'Day':
        // I'm adding since the value of rangeMovement will be a negative number
        const date = this.getDate(rangeMovement, selectedPeriod);
        dateStructure = <span>{`${date.getDate()} ${UTC_MONTHS[date.getMonth()]}`}</span>;
        startDate = date;
        break;
      case 'Week':
        // Multiplying by 6 because of the edge day + the rest of the days in the week
        const startWeek = this.getDate(rangeMovement - 1, selectedPeriod),
          endWeek = this.getDate(rangeMovement, selectedPeriod);
        
        dateStructure = <span>
          {`${startWeek.getDate()} ${UTC_MONTHS[startWeek.getMonth()]} - ${endWeek.getDate()} ${UTC_MONTHS[endWeek.getMonth()]}`}
        </span>;
        startDate = startWeek;
        endDate = endWeek;
        break;
      case 'Month':
        const month = this.getDate(rangeMovement, selectedPeriod),
          showYear = new Date().getFullYear() !== month.getFullYear();
        dateStructure = <span>
          {
            showYear ?
              `${UTC_MONTHS[month.getMonth()]} - ${month.getFullYear()}` :
              `${UTC_MONTHS[month.getMonth()]}`
          }
        </span>;
        startDate = month;
        break;
      case 'Year':
        const year = this.getDate(rangeMovement, selectedPeriod);
        dateStructure = <span>{`${year.getFullYear()}`}</span>;
        startDate = year;
        break;          
    }

    return <div className="date-range-container">
      <span className="arrow left" onClick={() => this.moveDates(-1, selectedPeriod)}>
        <img src="/images/icons/blue-arrow.svg" />
      </span>
      <span className="text">
        {dateStructure}
      </span>
      {
        !!rangeMovement && <span className="arrow right" onClick={() => this.moveDates(1, selectedPeriod)}>
          <img src="/images/icons/blue-arrow.svg" />
        </span>
      }
    </div>
  };

  render() {
    const { renderChart, accountId, leftInfo } = this.props;
    const { selectedPeriod, startDate, endDate } = this.state;

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
        {renderChart({ accountId, selectedPeriod, startDate, endDate })}
      </div>
    );
  };
};

export default ChartsSectionTab;
