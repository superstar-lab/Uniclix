import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { UTC_MONTHS, MONTHS_FINISH_DATE } from '../../../utils/constants';

class DateRangeSelector extends React.Component {
  static propTypes = {
    startDate: PropTypes.object.isRequired,
    endDate: PropTypes.object.isRequired,
    selectedPeriod: PropTypes.oneOf(['Year', 'Month', 'Week', 'Day' ]),
    onDateChange: PropTypes.func.isRequired,
    pastTimeLimit: PropTypes.number,
    calendarMode: PropTypes.bool
  }

  moveDates = (toAdd) => {
    const { selectedPeriod, startDate, onDateChange } = this.props;
    let newStartDate = moment(startDate),
      newEndDate = '',
      referenceDate = '';

    switch (selectedPeriod) {
      case 'Day':
        newStartDate = newStartDate.clone().add(toAdd, 'day');
        newEndDate = newStartDate.clone();
        break;
      case 'Year':
      case 'Month':
      case 'Week':
        referenceDate = newStartDate.clone().add(toAdd, selectedPeriod.toLowerCase());
        newStartDate = referenceDate.clone().startOf(selectedPeriod.toLowerCase());
        newEndDate = referenceDate.clone().endOf(selectedPeriod.toLowerCase());
        break;
    }

    onDateChange(newStartDate.toDate(), newEndDate.toDate());
  }

  renderDateRangePicker = () => {
    const { selectedPeriod, startDate, endDate } = this.props;
    let dateStructure = '';

    switch (selectedPeriod) {
      case 'Day':
        // I'm adding since the value of rangeMovement will be a negative number
        const date = new Date(startDate);
        dateStructure = <span>{`${date.getDate()} ${UTC_MONTHS[date.getMonth()]}`}</span>;
        break;
      case 'Week':
        // Multiplying by 6 because of the edge day + the rest of the days in the week
        const startWeek = new Date(startDate),
          endWeek = new Date(endDate);

        dateStructure = <span>
          {`${startWeek.getDate()} ${UTC_MONTHS[startWeek.getMonth()]} - ${endWeek.getDate()} ${UTC_MONTHS[endWeek.getMonth()]}`}
        </span>;
        break;
      case 'Month':
        const month = new Date(startDate),
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
        const year = new Date(startDate);
        dateStructure = <span>{`${year.getFullYear()}`}</span>;
        break;          
    }

    return (
      <div className="date-range-container">
          <span className="arrow left" onClick={() => this.moveDates(-1)}>
            <img src="/images/icons/blue-arrow.svg" />
          </span>
        <span className="text">
          {dateStructure}
        </span>
        <span className="arrow right" onClick={() => this.moveDates(1)}>
          <img src="/images/icons/blue-arrow.svg" />
        </span>
      </div>
    );
  };
  
  render() {
    return (
      <div className="chart-container">
        <div className="selection-row">
          <div className="date-range-picker">
            {this.renderDateRangePicker()}
          </div>
        </div>
      </div>
    );
  }
}

export default DateRangeSelector;
