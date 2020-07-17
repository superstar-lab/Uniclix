import React from 'react';
import moment from 'moment';
import {Select, Button, notification, TimePicker, Modal} from 'antd';

import { scheduledPosts } from '../../../requests/channels';

import SchedulingTableHeader from '../components/SchedulingTableHeader';
import SchedulingTableBody from '../components/SchedulingTableBody';
import Compose from '../../Compose/index';
import DateRangeSelector from '../components/DateRangeSelector';
import PostsCalendar from '../components/PostsCalendar';
import TodaysAgenda from '../components/TodaysAgenda';
import Loader from '../../Loader';

const { Option } = Select;

const POSTSCHEDULING = [
  "Every Day",
  "Weekdays",
  "Weekends",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

class PostScheduling extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isQueue: true,
      postSchedulingOption: 'Every Day',
      bestTime: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 21, 0, 0, 0),
      weeks: [
        {name: "Monday", status: false},
        {name: "Tuesday", status: false},
        {name: "Wednesday", status: false},
        {name: "Thursday", status: false},
        {name: "Friday", status: false},
        {name: "Saturday", status: false},
        {name: "Sunday", status: false},
      ],
      schedulingTimes: [],
      visible: false,
    }
  }

  componentWillMount() {

  }

  getDateTime() {
    const { timezone } = this.props;
    const { bestTime } = this.state;
    const dateTime = moment(bestTime).tz(timezone);

    return dateTime;
  };

  onChangeQueue = () => {
    if (this.state.isQueue) {
      notification.success({
        message: 'Done!',
        description: 'Ok! Your stack is now active again.'
      });
    } else {
      notification.success({
        message: 'Done!',
        description: 'Awesome, we\'ve paused all updates for this social account!'
      });
    }
    this.setState({
      isQueue: !this.state.isQueue,
    });
  };

  onDateTimeChange = (value) => {
    value.tz('Europe/London');
    this.setState({
      bestTime: value.format('YYYY-MM-DDTHH:mmZ')
    });
  };

  onEveryDateTimeChange = (value, week, index) => {
    const { timezone } = this.props;
    const { schedulingTimes } = this.state;

    let tmpSchedulingTimes = schedulingTimes;
    if (value != null) {
      value.tz('Europe/London');
      const dateTime = moment(value.format('YYYY-MM-DDTHH:mmZ')).tz(timezone);
      tmpSchedulingTimes[week][index].time = dateTime;

      this.setState({
        schedulingTimes: tmpSchedulingTimes,
      });
    } else {
      tmpSchedulingTimes[week].splice(index, 1);

      this.setState({
        schedulingTimes: tmpSchedulingTimes,
      });
    }
    notification.success({
      message: 'Done!',
      description: 'Awesome! Your schedule has been successfully saved.'
    });
  };

  onPostSchedulingChange = (postSchedulingOption) => {
    this.setState({ postSchedulingOption });
  };

  onAddPostTime = () => {
    const { timezone } = this.props;
    const { schedulingTimes, postSchedulingOption } = this.state;
    const dateTime = this.getDateTime();

    let tmpSchedulingTimes = schedulingTimes;
    let start, end = 0;

    if (tmpSchedulingTimes.length == 0) {
      for (let i = 0; i < 7; i++) {
        tmpSchedulingTimes[i] = [];
      }
    }

    switch(postSchedulingOption) {
      case "Every Day":
        start = 0;
        end = 7;
        break;
      case "Weekdays":
        start = 0;
        end = 5;
        break;
      case "Weekends":
        start = 5;
        end = 7;
        break;
      case "Monday":
        start = 0;
        end = 1;
        break;
      case "Tuesday":
        start = 1;
        end = 2;
        break;
      case "Wednesday":
        start = 2;
        end = 3;
        break;
      case "Thursday":
        start = 3;
        end = 4;
        break;
      case "Friday":
        start = 4;
        end = 5;
        break;
      case "Saturday":
        start = 5;
        end = 6;
        break;
      case "Sunday":
        start = 6;
        end = 7;
    }

    for (let i = start; i < end; i++) {
      tmpSchedulingTimes[i].push({ time: dateTime });
    }

    this.setState({
      schedulingTimes: tmpSchedulingTimes,
    });
    notification.success({
      message: 'Done!',
      description: 'Awesome! Your schedule has been successfully saved.'
    });
  };

  onClearPostTime = () => {
    this.setState({
      visible: true,
    });
  };

  onTurnScheduleTime = (e) => {
    const { weeks } = this.state;
    let tmpWeeks = weeks;
    tmpWeeks[e.target.value].status = !tmpWeeks[e.target.value].status;
    this.setState({
      weeks: tmpWeeks,
    });
    notification.success({
      message: 'Done!',
      description: 'Awesome! Your schedule has been successfully saved.'
    });
  }

  handleOk = () => {
    this.setState({
      schedulingTimes: [],
      visible: false,
    });
    notification.success({
      message: 'Done!',
      description: 'Awesome! Your schedule has been successfully saved.'
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { postSchedulingOption, weeks, schedulingTimes, visible } = this.state;
    const { name } = this.props;
    const dateTime = this.getDateTime();

    return (
      <div className="post-scheduling">
        <Modal
          title="Are you sure?"
          visible={visible}
          okText="I'm Sure, Empty It"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={400}
          style={{ top: 300 }}
        >
          Would you like us to remove all your posting times for {name}?
        </Modal>
        <div className="post-scheduling-container">
          <div className="post-scheduling-title">
            Your posting schedule for {name}
          </div>
          <div className="post-scheduling-queue-section">
            <div className="post-scheduling-padding">
              <div>{this.state.isQueue ? "Your stack has been paused!" : "Stop all posts from being sent on this Social Account?"}</div>
              <Button type="primary" className="btn-queue" onClick={this.onChangeQueue}>{this.state.isQueue ? "Resume Stacks" : "Pause Stacks"}</Button>
            </div>
          </div>
          <div className="post-scheduling-time-section">
            <div className="time-label">Add a new posting time</div>
            <div className="post-scheduling-time-margin-top">
              <Select
                value={postSchedulingOption}
                size="large"
                className="post-time-margin-right"
                onChange={this.onPostSchedulingChange}
              >
                {
                  POSTSCHEDULING && POSTSCHEDULING.map(schedule => (
                    <Option key={schedule} value={schedule} title={schedule}>
                      {schedule}
                    </Option>
                  ))
                }
              </Select>
              <div className="time-label post-time-margin-right">Choose times</div>
              <TimePicker
                use12Hours
                format="h:mm A"
                onChange={this.onDateTimeChange}
                value={dateTime}
                size="large"
                className="post-time-margin-right"
              />
              <Button className="post-time-margin-right" type="primary" onClick={this.onAddPostTime}>Add Posting Time</Button>
            </div>
          </div>
          <div className="post-scheduling-display-section">
            <div className="post-scheduling-display-header">
              <div className="post-scheduling-display-title">Posting times<i className="fa fa-question-circle"></i></div>
              {
                schedulingTimes.length == 0 ?
                  ""
                  :
                  <Button onClick={this.onClearPostTime}>Clear all Posting Times</Button>
              }
            </div>
            {
              schedulingTimes.length == 0 ?
                <div className="post-scheduling-display-body">
                  <i className="fa fa-3x fa-clock-o"></i>
                  <div className="post-scheduling-display-title">Looks like you don't have any posting times set!</div>
                  <div className="post-scheduling-display-subtitle">Add a new posting time to start publishing posts from your stack.</div>
                </div>
                :
                <table>
                  <SchedulingTableHeader weeks={weeks} onTurnScheduleTime={this.onTurnScheduleTime}/>
                  <SchedulingTableBody schedulingTimes={schedulingTimes} onEveryDateTimeChange={this.onEveryDateTimeChange}/>
                </table>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default PostScheduling;
