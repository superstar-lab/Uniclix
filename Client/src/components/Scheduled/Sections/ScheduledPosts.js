import React from 'react';
import moment from 'moment';
import { Select } from 'antd';

import { scheduledPosts } from '../../../requests/channels';

import Compose from '../../Compose/index';
import DateRangeSelector from '../components/DateRangeSelector';
import PostsCalendar from '../components/PostsCalendar';
import TodaysAgenda from '../components/TodaysAgenda';
import Loader from '../../Loader';

const { Option } = Select;

const PERIODS = [
  'Month',
  'Week',
  'Day'
];

class ScheduledPosts extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      posts: [],
      calendarDisplay: 'Week',
      resetDates: true,
      startDate: moment().tz(props.timezone).startOf('week'),
      endDate: moment().tz(props.timezone).endOf('week')
    }
  }

  componentDidMount() {
    this.fetchPosts();
  }

  componentDidUpdate(prevProps, prevState) {
    // We get the posts when the date changes
    if (prevState.startDate.format('YYYY-MM-DD') !== this.state.startDate.format('YYYY-MM-DD')) {
      this.fetchPosts();
    }
  }

  fetchPosts = () => {
    const { startDate, endDate } = this.state;
    this.setState({ isLoading: true });

    // We need to add to extra days because the backend returns the event
    // taking into account the UTC date and no the selected timezone. This
    // provokes to some dates to not appear when they should. By increasing the
    // requested range, we make sure to get all the event of the given period.
    const cloneStart = startDate.clone().subtract(1, 'days'),
      cloneEnd = endDate.clone().add(1, 'days');

    try {
      scheduledPosts(cloneStart.format('YYYY-MM-DD'), cloneEnd.format('YYYY-MM-DD'))
        .then((response) => {
            const posts = response.items;
            this.setState({
                posts,
                isLoading: false,
            });
        }).catch((error) => {
          this.setState({ isLoading: false });
        });
    } catch(error) {
      console.log(error);
    }
  }

  onDateChange = (startDate, endDate) => {
    const { timezone } = this.props;

    this.setState({
      startDate: moment(startDate).tz(timezone),
      endDate: moment(endDate).tz(timezone)
    });
  };

  onPeriodChange = (calendarDisplay, resetDates = true) => {
    this.setState({ calendarDisplay, resetDates });
  };

  render() {
    const { startDate, endDate, calendarDisplay, posts, isLoading, resetDates } = this.state;
    const { timezone } = this.props;

    return (
      <div className="calendar-events">
        <div className="calendar-container">
          <div className="header">
            <DateRangeSelector
              startDate={startDate}
              endDate={endDate}
              selectedPeriod={calendarDisplay}
              timezone={timezone}
              onDateChange={this.onDateChange}
              resetDates={resetDates}
            />
            <Select value={calendarDisplay} onChange={this.onPeriodChange}>
              {
                PERIODS.map(period => <Option key={period} value={period}>{period}</Option>)
              }
            </Select>
          </div>
          <PostsCalendar
            events={posts}
            view={calendarDisplay.toLowerCase()}
            timezone={timezone}
            startDate={startDate}
            fetchPosts={this.fetchPosts}
            onDateChange={this.onDateChange}
            onPeriodChange={this.onPeriodChange}
          />
        </div>
        <div>
          <TodaysAgenda
            posts={posts}
            timezone={timezone}
          />
        </div>
        { isLoading && <Loader fullscreen /> }
        <Compose onPost={this.fetchPosts} />
      </div>
    );
  }
}

export default ScheduledPosts;
