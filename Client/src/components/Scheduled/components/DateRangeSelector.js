import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { UTC_MONTHS } from '../../../utils/constants';

class DateRangeSelector extends React.Component {
  static propTypes = {
    startDate: PropTypes.object.isRequired,
    endDate: PropTypes.object.isRequired,
    selectedPeriod: PropTypes.oneOf(['Year', 'Month', 'Week', 'Day' ]),
    onDateChange: PropTypes.func.isRequired,
    resetDates: PropTypes.bool.isRequired,
    pastTimeLimit: PropTypes.number,
    calendarMode: PropTypes.bool
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedPeriod !== this.props.selectedPeriod && this.props.resetDates) {
      this.resetDates();
    }
  }

  resetDates = () => {
    const { selectedPeriod, timezone, onDateChange } = this.props;
    // The timezone is important because we are creating a moment object using the local
    // timezone when we need to use the selected one. Otherwise the dates will be wrong.
    let newStartDate = moment().tz(timezone),
      newEndDate;

    switch (selectedPeriod) {
      case 'Day':
        newEndDate = newStartDate.clone();
        break;
      case 'Year':
      case 'Month':
      case 'Week':
        newStartDate = newStartDate.clone().startOf(selectedPeriod.toLowerCase());
        newEndDate = newStartDate.clone().endOf(selectedPeriod.toLowerCase());
        break;
    }

    onDateChange(newStartDate.toDate(), newEndDate.toDate());
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
        dateStructure = <span>{`${startDate.date()} ${UTC_MONTHS[startDate.month()]}`}</span>;
        break;
      case 'Week':
        dateStructure = <span>
          {`${startDate.date()} ${UTC_MONTHS[startDate.month()]} - ${endDate.date()} ${UTC_MONTHS[endDate.month()]}`}
        </span>;
        break;
      case 'Month':
          const showYear = moment().year() !== startDate.year();
        dateStructure = <span>
          {
            showYear ?
              `${UTC_MONTHS[startDate.month()]} - ${startDate.year()}` :
              `${UTC_MONTHS[startDate.month()]}`
          }
        </span>;
        break;
      case 'Year':
        dateStructure = <span>{startDate.year()}</span>;
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
