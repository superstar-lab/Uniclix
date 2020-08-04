import React from 'react';
import { DatePicker, TimePicker, Checkbox } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import { isOwnerOrAdmin } from '../../../utils/helpers';

class DateTimeSelector extends React.Component {
  static propTypes = {
    selectedTimezone: PropTypes.string.isRequired,
    postDate: PropTypes.string.isRequired,
    postAtBestTime: PropTypes.bool.isRequired,
    postNow: PropTypes.bool.isRequired,
    setDate: PropTypes.func.isRequired,
    setPostAtBestTime: PropTypes.func.isRequired,
    setPostNow: PropTypes.func.isRequired,
    cntScheduling: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const date = moment(this.props.postDate).tz('Europe/London');
    this.props.setDate(date.format('YYYY-MM-DDTHH:mmZ'));
  };

  disabledDate = (current) => {
    const { selectedTimezone } = this.props;
    const today = moment().tz(selectedTimezone);
    // Can not select days before today
    return current &&
      (current.isBefore(today, 'day') || current.date() < today.date()) &&
      current.isSameOrBefore(today, 'month') &&
      current.isSameOrBefore(today, 'year');
  };

  disableHours = () => {
    const { selectedTimezone } = this.props,
      dateTime = this.getDateTime(),
      now = moment().tz(selectedTimezone),
      disabledHours = [];

    // if the dateTime is a future date, we don't want to disable hours
    if (dateTime.date() > now.date() &&
      dateTime.isSameOrAfter(now, 'month') &&
      dateTime.isSameOrAfter(now, 'year')
    ) {
      return [];
    }

    for (let i = 0; i < now.hour(); i++) {
      disabledHours.push(i);
    }

    return disabledHours;
  };

  disableMinutes = (selectedHour) => {
    const { selectedTimezone } = this.props,
      dateTime = this.getDateTime(),
      now = moment().tz(selectedTimezone),
      disabledMinutes = [];

    // if the dateTime is a future date, we don't want to disable hours
    if (dateTime.date() >= now.date() &&
      dateTime.isSameOrAfter(now, 'month') &&
      dateTime.isSameOrAfter(now, 'year') &&
      selectedHour > now.hour()
    ) {
      return [];
    }

    for (let i = 0; i < now.minutes(); i++) {
      disabledMinutes.push(i);
    }

    return disabledMinutes;
  };

  getDateTime() {
    const { postDate, selectedTimezone } = this.props;
    const dateTime = moment(postDate).tz(selectedTimezone);

    return dateTime;
  };

  onDateTimeChange = (value) => {
    value.tz('Europe/London');
    this.props.setDate(value.format('YYYY-MM-DDTHH:mmZ'));
  };

  onPostAtBestTime = (e) => {
    this.props.setPostAtBestTime(e.target.checked);
  };

  onPostNow = (e) => {
    const { selectedTimezone, setPostNow, setDate } = this.props;
    const now = moment().tz(selectedTimezone);

    setPostNow(e.target.checked);
    setDate(now.format('YYYY-MM-DDTHH:mmZ'));
  };

  render() {
    const { postAtBestTime, postNow, accessLevel, cntScheduling } = this.props;
    const dateTime = this.getDateTime();

    return (
      <div className="schedule-section">
        <div className="subtitle">Schedule</div>
        <div className="schedule-container">
          <DatePicker
            onChange={this.onDateTimeChange}
            disabledDate={this.disabledDate}
            value={dateTime}
            size="large"
            format="MMMM DD, YYYY"
            disabled={postAtBestTime || postNow}
          />
          <TimePicker
            use12Hours
            format="h:mm A"
            onChange={this.onDateTimeChange}
            value={dateTime}
            size="large"
            disabledHours={this.disableHours}
            disabledMinutes={this.disableMinutes}
            disabled={postAtBestTime || postNow}
          />
          {
            isOwnerOrAdmin(accessLevel) && (
              <div className="checkboxes-group">
                <Checkbox checked={postAtBestTime} disabled={cntScheduling == 0 || postNow} onChange={this.onPostAtBestTime}>
                  Post at best time
                </Checkbox>
                <Checkbox checked={postNow} disabled={postAtBestTime} onChange={this.onPostNow}>
                  Post now
                </Checkbox>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default DateTimeSelector;
