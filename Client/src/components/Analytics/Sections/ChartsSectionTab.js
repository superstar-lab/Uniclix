import React from 'react';

import { UTC_MONTHS, MONTHS_FINISH_DATE } from '../../../utils/constants';

const PERIODS = [
  'Year',
  'Month',
  'Week',
  'Day'
]

const TWITTER_PERIODS = [
  'Month',
  'Week',
  'Day'
];

class ChartsSectionTab extends React.Component {

  constructor(props) {
    super(props);

    const endDate = new Date();
    const rangeMovementLimit = this.calculateRangeMovementLimit('Week');

    this.state = {
      accountId: 'account',
      selectedPeriod: 'Week',
      rangeMovement: 0, // Will determine the dates that the user is seeing
      startDate: new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate() - 6
      ).getTime(),
      endDate: endDate.getTime(),
      rangeMovementLimit
    };
  }

  onPeriodChange = (selectedPeriod) => {
    const { startDate, endDate } = this.getStateDates(0, selectedPeriod);
    const rangeMovementLimit = this.calculateRangeMovementLimit(selectedPeriod);

    // We want to reset the values when the period is changed
    this.setState({
      rangeMovement: 0,
      startDate: startDate.getTime(),
      endDate: endDate.getTime(),
      selectedPeriod,
      rangeMovementLimit
    });
  }

  renderButtons = () => {
    const { selectedPeriod } = this.state,
      periodsToMap = this.props.socialMedia === 'twitter' ? TWITTER_PERIODS : PERIODS;

    return periodsToMap.map(period => (
      <button
        key={period}
        className={period === selectedPeriod ? 'btn selected' : 'btn'}
        onClick={() => this.onPeriodChange(period)}
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

  getStateDates = (rangeMovement, period) => {
    let startDate = null,
      endDate = null,
      baseDate = null;

    switch (period) {
      case 'Day':
        startDate = this.getDate(rangeMovement, period);
        // End date will same date but at 23:59:59
        endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 23, 59, 59);
        break;
      case 'Week':
        baseDate = this.getDate(rangeMovement, period);
        startDate = this.getDate(rangeMovement - 1, period);
        endDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 23, 59, 59);
        break;
      case 'Month':
        baseDate = this.getDate(rangeMovement, period);
        const year = baseDate.getFullYear(),
          month = baseDate.getMonth();

        startDate = new Date(year, month, 1);
        endDate = new Date(year, month, MONTHS_FINISH_DATE[month], 23, 59, 59);
        break;
      case 'Year':
        baseDate = this.getDate(rangeMovement, period);
        startDate = new Date(baseDate.getFullYear(), 0, 1);
        endDate = new Date(baseDate.getFullYear(), 11, 31, 23, 59, 59);
        break;
    }

    return { startDate, endDate };
  }

  // We need to change the dates here in order to trigger the API call
  // with the correct data.
  moveDates = (toAdd, selectedPeriod) => {
    const { rangeMovement } = this.state;
    const { startDate, endDate } = this.getStateDates(rangeMovement + toAdd, selectedPeriod);

    this.setState({
      rangeMovement: rangeMovement + toAdd,
      startDate: startDate.getTime(),
      endDate: endDate.getTime()
    });
  };

  // This function calculates how further can the user go to the past
  // returning the limit of the rangeMovement
  calculateRangeMovementLimit = (selectedPeriod) => {
    const { pastTimeLimit } = this.props;
    let rangeMovementLimit = null;

    switch (selectedPeriod) {
      case 'Day':
        rangeMovementLimit = -pastTimeLimit;
        break;
      case 'Week':
        rangeMovementLimit = -pastTimeLimit / 7;
        break;
      case 'Month':
        rangeMovementLimit = -pastTimeLimit / 30;
        break;
      case 'Year':
        rangeMovementLimit = -pastTimeLimit / 365;
        break;
    }

    // We substract 1 because the rangeMovement starts in 0
    return rangeMovementLimit - 1;
  };

  renderDateRangePicker = () => {
    const { selectedPeriod, rangeMovement, rangeMovementLimit } = this.state;
    let dateStructure = '';

    switch (selectedPeriod) {
      case 'Day':
        // I'm adding since the value of rangeMovement will be a negative number
        const date = this.getDate(rangeMovement, selectedPeriod);
        dateStructure = <span>{`${date.getDate()} ${UTC_MONTHS[date.getMonth()]}`}</span>;
        break;
      case 'Week':
        // Multiplying by 6 because of the edge day + the rest of the days in the week
        const startWeek = this.getDate(rangeMovement - 1, selectedPeriod),
          endWeek = this.getDate(rangeMovement, selectedPeriod);
        
        dateStructure = <span>
          {`${startWeek.getDate()} ${UTC_MONTHS[startWeek.getMonth()]} - ${endWeek.getDate()} ${UTC_MONTHS[endWeek.getMonth()]}`}
        </span>;
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
        break;
      case 'Year':
        const year = this.getDate(rangeMovement, selectedPeriod);
        dateStructure = <span>{`${year.getFullYear()}`}</span>;
        break;          
    }

    return <div className="date-range-container">
      {
        rangeMovement > rangeMovementLimit && <span className="arrow left" onClick={() => this.moveDates(-1, selectedPeriod)}>
          <img src="/images/icons/blue-arrow.svg" />
        </span>
      }
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
    const { renderChart, accountId, leftInfo, socialMedia } = this.props;
    const { selectedPeriod, startDate, endDate } = this.state;

    return (
      <div className="chart-container">
        <div className="selection-row">
          <div className="left-info">{leftInfo}</div>
          <div className="date-range-picker">
            {this.renderDateRangePicker()}
          </div>
          <div className={`period-buttons ${socialMedia}`}>
            {this.renderButtons()}
          </div>
        </div>
        {renderChart({ accountId, selectedPeriod, startDate, endDate })}
      </div>
    );
  };
};

export default ChartsSectionTab;
