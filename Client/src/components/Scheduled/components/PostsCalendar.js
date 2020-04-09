import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from "moment";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { setComposerModal, setComposerToEdit } from '../../../actions/composer';
import { momentToDate } from '../../../utils/formatTime';
import Event from './Event';
import Loader from '../../Loader';

const localizer = momentLocalizer(moment);

class PostsCalendar extends React.Component {
  static propTypes = {
    events: PropTypes.array.isRequired,
    view: PropTypes.oneOf(['month', 'week', 'day']),
    timezone: PropTypes.string.isRequired,
    channelsList: PropTypes.array.isRequired,
    fetchPosts: PropTypes.func.isRequired,
    onPeriodChange: PropTypes.func.isRequired,
    onDateChange: PropTypes.func.isRequired,
    startDate: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      currentDate: props.timezone ? moment().tz(props.timezone) : moment(),
      selectedEvent: {},
      isLoading: false,
      intervalId: ''
    }
  }

  componentDidMount() {
    // We want to keep updating the calendar as the minutes pass.
    const intervalId = setInterval(() => {
      this.setState({ currentDate: moment().tz(this.props.timezone) });
    }, 60000);

    this.setState({ intervalId });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.timezone !== this.props.timezone) {
      this.setState({ currentDate: moment().tz(this.props.timezone) })
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  // We add necessary fields to the event objects so we can display them
  // in the calendar
  prepareEvents = () => {
    const { events, timezone } = this.props;
    const { currentDate } = this.state;

    const preparedEvents = events.map(event => {
      const { payload: { scheduled: { publishUTCDateTime } } } = event,
        eventDate = moment(publishUTCDateTime).tz(timezone),
        // we want the posts to take all the space available in the hour
        startDate = eventDate.clone().minutes(0),
        endDate = eventDate.clone().minutes(59);
      
      return {
        ...event,
        start: momentToDate(startDate),
        end: momentToDate(endDate),
        wasAlreadyPosted: startDate.isSameOrBefore(currentDate)
      };
    });

    return preparedEvents;
  };

  eventPropGetter = (event) => {
    const { selectedEvent } = this.state;
    const { view } = this.props;

    let className = event.id === selectedEvent.id ? `rbc-selected ${view}` : ''

    return { className, style: { backgroundColor: event.category.color } };
  }

  slotPropGetter = (slot) => {
    const { currentDate } = this.state;
    // 1800000 ms is half hour
    const className = momentToDate(currentDate).getTime() - slot.getTime() > 1800000 ?
      'disabled' :
      '';

    return { className };
  }

  dayPropGetter = (day) => {
    const { view, timezone } = this.props;
    const { currentDate } = this.state;

    if (view === 'month') {
      const dayMoment = moment(day).tz(timezone);
      const today = moment(currentDate.format('YYYY-MM-DD')).tz(timezone);
      const className = dayMoment.isBefore(today) ?
        'disabled' :
        '';

      return { className };
    }
  }

  onSelectEvent = (event) => {
    const { view, onPeriodChange, onDateChange, timezone } = this.props;

    if (view === 'month') {
      const startDate = moment(event.payload.scheduled.publishUTCDateTime).tz(timezone);
      const endDate = moment(event.payload.scheduled.publishUTCDateTime).tz(timezone);

      onDateChange(startDate, endDate);
      onPeriodChange('Day', false);
    }

    this.setState({ selectedEvent: event });
  };

  onCloseEvent = (e) => {
    e.stopPropagation();
    this.setState({ selectedEvent: {} });
  }

  toggleLoading = () => {
    this.setState({ isLoading: !this.state.isLoading });
  };

  onSelectSlot = (slotInfo) => {
    const { view, onPeriodChange, onDateChange, setComposerModal, timezone } = this.props;
    const { currentDate } = this.state;

    // When is month view, when the user clicks we want to show him the selected day
    // in the day view
    if (view === 'month') {
      // We need to do this to avoid getting a different date when changing timezones
      const startDateString = moment(slotInfo.start).format('YYYY-MM-DDTHH:mm');
      const endDateString = moment(slotInfo.end).format('YYYY-MM-DDTHH:mm');
      const currentTz = moment().tz(timezone).format('Z');
      const startDate = moment(`${startDateString}${currentTz}`);
      const endDate = moment(`${endDateString}${currentTz}`);

      onDateChange(startDate, endDate);
      onPeriodChange('Day', false);
    } else {
      if (slotInfo.end.getTime() > momentToDate(currentDate).getTime()) {
        // The Calendar will keep the local timezone. Formating this way
        // we set the datetime using the calendar's datetime but
        // keeping the timezone that the user selected
        const date = moment(slotInfo.start).format('YYYY-MM-DDTHH:mm');
        const postTz = moment().tz(timezone).format('Z');
        setComposerModal(`${date}${postTz}`, timezone);
      }
    }
  };

  render() {
    const { view, startDate, channelsList, setComposerToEdit, timezone, fetchPosts, accessLevel } = this.props;
    const { currentDate, selectedEvent, isLoading } = this.state;

    return (
      currentDate ? (
        <React.Fragment>
          <Calendar
            localizer={localizer}
            formats={formats}
            events={this.prepareEvents()}
            defaultView="week"
            view={view}
            date={momentToDate(startDate)}
            getNow={() => momentToDate(currentDate)}
            components={{
              event: ({ event: event }) => (
                <Event
                  event={event}
                  closeEvent={this.onCloseEvent}
                  isSelected={event.id === selectedEvent.id}
                  channelsList={channelsList}
                  toggleLoading={this.toggleLoading}
                  fetchPosts={fetchPosts}
                  timezone={timezone}
                  setComposerToEdit={setComposerToEdit}
                  view={view}
                  accessLevel={accessLevel}
                />
              )
            }}
            eventPropGetter={this.eventPropGetter}
            slotPropGetter={this.slotPropGetter}
            dayPropGetter={this.dayPropGetter}
            onSelectEvent={this.onSelectEvent}
            selected={selectedEvent}
            selectable={true}
            onSelectSlot={this.onSelectSlot}
          />
          { isLoading && <Loader fullscreen /> }
        </React.Fragment>
      ) :
      null
    );
  }
}

const formats = {
  timeGutterFormat: (value) => {
    const time = moment(value);

    return time.format('h A');
  },
  dayFormat: (value) => {
    const time = moment(value);

    return time.format('ddd D');
  },
  eventTimeRangeFormat: (values) => {
    const startTime = moment(values.start);

    return startTime.format('H:mm A');
  }
};

const mapStateToProps = (state) => {
  return {
    channelsList: state.channels.list,
    accessLevel: state.profile.accessLevel
  };
};

export default connect(mapStateToProps, { setComposerModal, setComposerToEdit })(PostsCalendar);
