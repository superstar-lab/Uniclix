import React from 'react';
import moment from 'moment';
import { Select } from 'antd';
import InfiniteScroll from "react-infinite-scroll-component";

import {scheduledPosts, schedulingTimes} from '../../../requests/channels';

import Compose from '../../Compose/index';
import DateRangeSelector from '../components/DateRangeSelector';
import PostsCalendar from '../components/PostsCalendar';
import TodaysAgenda from '../components/TodaysAgenda';
import PostsDay from '../components/PostsDay';
import Loader from '../../Loader';

const { Option } = Select;

const PERIODS = [
  'Month',
  'Week',
  'Day'
];
const monthNames = [
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];
const weekday = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];
const cntDate = 20;

class ScheduledPosts extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      posts: [],
      calendarDisplay: 'Day',
      resetDates: true,
      startDate: moment().tz(props.timezone).startOf('week'),
      endDate: moment().tz(props.timezone).endOf('week'),
      items: [],
      page: 0,
      schedulingTimes: [],
    }
  }

  componentWillMount() {
    try {
      schedulingTimes()
        .then((response) => {
          const tmpSchedulingTimes = response.items;
          let schedulingTimes = [];
          if (tmpSchedulingTimes.length > 0) {
            schedulingTimes = this.getScheduleTimes(tmpSchedulingTimes);
          }

          this.setState({
            schedulingTimes,
          });
          this.fetchMoreData();
        }).catch((error) => {
      });
    } catch(error) {
      console.log(error);
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
  };

  fetchMoreData = () => {
    const { items, page, schedulingTimes } = this.state;
    const { timezone } = this.props;
    let tmpItems = items;
    let tmpPage = page;
    const cloneStart = moment().tz(timezone).add(tmpPage * cntDate, 'days').subtract(1, 'days').format('YYYY-MM-DD'),
      cloneEnd = moment().tz(timezone).add((tmpPage + 1) * cntDate, 'days').format('YYYY-MM-DD');

    try {
      scheduledPosts(cloneStart, cloneEnd)
        .then((response) => {
          const posts = response.items;
          for (let i = tmpPage * cntDate; i < (tmpPage + 1) * cntDate; i++) {
            let date = moment().tz(timezone).add(i, 'days');
            let weekdayNames = weekday[date.day()];
            if (i === 0) {
              weekdayNames = 'Today';
            }
            if (i === 1) {
              weekdayNames = 'Tomorrow';
            }
            let settingTimes = [];
            if (date.day() === 0) {
              settingTimes = JSON.parse(JSON.stringify(schedulingTimes[6]));
            } else {
              settingTimes = JSON.parse(JSON.stringify(schedulingTimes[date.day() - 1]));
            }
            for (let j = 0; j <settingTimes.length; j++) {
              for (let k = 0; k < posts.length; k++) {
                if (posts[k].is_best === 1 && (posts[k].payload.scheduled.publishDateTime === (date.format('YYYY-MM-DD') + ' ' + settingTimes[j].time))) {
                  settingTimes[j] = posts[k];
                }
              }
            }

            tmpItems.push({ day: date.format('YYYY-MM-DD'), weekdayNames: weekdayNames, monthNames: monthNames[date.month()], date: date.date(), settingTimes: settingTimes })
          }

          tmpPage++;
          this.setState({
            items: tmpItems,
            page: tmpPage
          });
        }).catch((error) => {
      });
    } catch(error) {
      console.log(error);
    }
  };

  getScheduleTimes = (tmpSchedulingTimes) => {
    let schedulingTimes = [];

    for (let i = 0; i < 7; i++) {
      schedulingTimes[i] = [];
    }

    tmpSchedulingTimes.forEach(time => {
      switch(time.schedule_week) {
        case 0:
          schedulingTimes[0].push({ time: time.schedule_time, timeId: time.time_id, hover: true });
          break;
        case 1:
          schedulingTimes[1].push({ time: time.schedule_time, timeId: time.time_id, hover: true });
          break;
        case 2:
          schedulingTimes[2].push({ time: time.schedule_time, timeId: time.time_id, hover: true });
          break;
        case 3:
          schedulingTimes[3].push({ time: time.schedule_time, timeId: time.time_id, hover: true });
          break;
        case 4:
          schedulingTimes[4].push({ time: time.schedule_time, timeId: time.time_id, hover: true });
          break;
        case 5:
          schedulingTimes[5].push({ time: time.schedule_time, timeId: time.time_id, hover: true });
          break;
        case 6:
          schedulingTimes[6].push({ time: time.schedule_time, timeId: time.time_id, hover: true });
      }
    });

    return schedulingTimes;
  };

  onResetPage = () => {
    this.setState({
      page: 0,
      items: [],
    });
  };

  onDateChange = (startDate, endDate) => {
    const { timezone } = this.props;

    this.setState({
      startDate: moment(startDate).tz(timezone),
      endDate: moment(endDate).tz(timezone)
    });
  };

  onPeriodChange = (calendarDisplay, resetDates = true) => {
    this.setState({ calendarDisplay, resetDates, items: [], page: 0 });
    if (calendarDisplay === 'Day') {
      this.fetchMoreData();
    }
  };

  onHover = (indexI, indexJ, hover) => {
    const { items } = this.state;
    let tmpItems = items;
    if (tmpItems[indexI].settingTimes[indexJ].time !== undefined) {
      tmpItems[indexI].settingTimes[indexJ].hover = hover;
    }
    this.setState({
      items: tmpItems
    });
  };

  render() {
    const { startDate, endDate, calendarDisplay, posts, isLoading, resetDates } = this.state;
    const { timezone, selectedChannel } = this.props;

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
          {
            calendarDisplay === 'Day' ?
              <div>
                <div>
                  <h4 className="infinite-best-btn-title">Create Post</h4>
                  <button className="infinite-best-btn" onClick={this.props.onBestPostClick}>
                    <div>What's on your mind?</div>
                    <div className="infinite-best-btn-icon">
                      <div className="infinite-best-btn-icon-laugh"><strong>☺</strong></div>
                      <i className="fa fa-image upload-images"/>
                    </div>
                  </button>
                </div>
                <InfiniteScroll
                  dataLength={this.state.items.length}
                  next={this.fetchMoreData}
                  hasMore={true}
                  style={{ overflowY: 'hidden' }}
                >
                  {this.state.items.map((item, index) => (
                    <div>
                      <div className="infinite-title">
                        <strong>{item.weekdayNames}, </strong>{item.monthNames} {item.date}
                      </div>
                      <PostsDay
                        settingTimes={item.settingTimes}
                        day={item.day}
                        timezone={timezone}
                        selectedChannel={selectedChannel}
                        indexI={index}
                        onHover={this.onHover}
                        onBestPostClick={this.props.onBestPostClick}
                        fetchMoreData={this.fetchMoreData}
                        onResetPage={this.onResetPage}
                        fetchPosts={this.fetchPosts}
                      />
                    </div>
                  ))}
                </InfiniteScroll>
              </div>
              :
              <PostsCalendar
                events={posts}
                view={calendarDisplay.toLowerCase()}
                timezone={timezone}
                startDate={startDate}
                fetchPosts={this.fetchPosts}
                onDateChange={this.onDateChange}
                onPeriodChange={this.onPeriodChange}
              />
          }
        </div>
        <div>
          <TodaysAgenda
            posts={posts}
            timezone={timezone}
          />
        </div>
        { isLoading && <Loader fullscreen /> }
        <Compose onPost={()=>{this.onResetPage(), this.fetchPosts(), this.fetchMoreData()}} />
      </div>
    );
  }
}

export default ScheduledPosts;
