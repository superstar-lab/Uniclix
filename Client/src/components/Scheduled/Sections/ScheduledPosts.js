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

  flattenPosts = (items) => {
    const flattenedPosts = [];
    items.forEach(posts => flattenedPosts.push(...posts))

    return flattenedPosts;
  }

  fetchPosts = () => {
    const { startDate, endDate } = this.state;
    this.setState({ isLoading: true });

    try {
      scheduledPosts(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'))
        .then((response) => {
            const posts = this.flattenPosts(response.items);
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

  onPeriodChange = (value) => {
    this.setState({ calendarDisplay: value });
  };

  render() {
    const { startDate, endDate, calendarDisplay, posts, isLoading } = this.state;
    const { timezone } = this.props;

    return (
      <div className="calendar-events">
        <div className="calendar-container">
          <div className="header">
            <DateRangeSelector
              startDate={startDate}
              endDate={endDate}
              selectedPeriod={calendarDisplay}
              onDateChange={this.onDateChange}
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
