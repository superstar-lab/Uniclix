import React from 'react';
import moment from 'moment';
import {Select, Button, notification, TimePicker, Modal} from 'antd';

import { schedulingTimes, schedulingStore, schedulingEdit, destroyTime, clearAll } from '../../../requests/channels';

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
      isLoading: false,
      isQueue: true,
      postSchedulingOption: 'Every Day',
      bestTime: "21:00",
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
    this.setState({ isLoading: true });

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
            isLoading: false,
          });
        }).catch((error) => {
        this.setState({ isLoading: false });
      });
    } catch(error) {
      console.log(error);
    }
  }

  getDateTime() {
    const { timezone } = this.props;
    const { bestTime } = this.state;
    const dateTime = moment.tz(bestTime, 'hh:mm A', timezone);

    return dateTime;
  };

  getStringTime24 = (valueString) => {
    let isAm = valueString.split(' ')[1];
    let time = '';
    if (isAm == "AM") {
      let hour = 0;
      if (parseInt(valueString.split(' ')[0].split(":")[0]) == 12) {
        time = hour + ":" + valueString.split(' ')[0].split(":")[1];
      } else {
        time = valueString.split(' ')[0];
      }
    } else {
      let hour = 0;
      if (parseInt(valueString.split(' ')[0].split(":")[0]) == 12) {
        hour = parseInt(valueString.split(' ')[0].split(":")[0]);
      } else  {
        hour = parseInt(valueString.split(' ')[0].split(":")[0]) + 12;
      }
      time = hour + ":" + valueString.split(' ')[0].split(":")[1];
    }

    return time;
  };

  getScheduleTimes = (tmpSchedulingTimes) => {
    let schedulingTimes = [];

    for (let i = 0; i < 7; i++) {
      schedulingTimes[i] = [];
    }

    tmpSchedulingTimes.forEach(time => {
      switch(time.schedule_week) {
        case 0:
          schedulingTimes[0].push({ time: time.schedule_time, timeId: time.time_id, posted: time.posted, content: time.content });
          break;
        case 1:
          schedulingTimes[1].push({ time: time.schedule_time, timeId: time.time_id, posted: time.posted, content: time.content });
          break;
        case 2:
          schedulingTimes[2].push({ time: time.schedule_time, timeId: time.time_id, posted: time.posted, content: time.content });
          break;
        case 3:
          schedulingTimes[3].push({ time: time.schedule_time, timeId: time.time_id, posted: time.posted, content: time.content });
          break;
        case 4:
          schedulingTimes[4].push({ time: time.schedule_time, timeId: time.time_id, posted: time.posted, content: time.content });
          break;
        case 5:
          schedulingTimes[5].push({ time: time.schedule_time, timeId: time.time_id, posted: time.posted, content: time.content });
          break;
        case 6:
          schedulingTimes[6].push({ time: time.schedule_time, timeId: time.time_id, posted: time.posted, content: time.content });
      }
    });

    return schedulingTimes;
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

  onDateTimeChange = (value, valueString) => {
    let time = this.getStringTime24(valueString);
    value.tz('Europe/London');
    this.setState({
      bestTime: time
    });
  };

  onEveryDateTimeChange = (value, valueString, week, index, timeId) => {
    const { timezone } = this.props;
    const { schedulingTimes } = this.state;

    if (value != null) {
      value.tz('Europe/London');
      const dateTime = this.getStringTime24(valueString);

      try {
        schedulingEdit(timeId, dateTime)
          .then((response) => {
            const tmpSchedulingTimes = response.items;
            let schedulingTimes = [];
            if (tmpSchedulingTimes.length > 0) {
              schedulingTimes = this.getScheduleTimes(tmpSchedulingTimes);
            }

            this.setState({
              schedulingTimes,
            });
          }).catch((error) => {
        });
      } catch(error) {
        console.log(error);
      }
    } else {
      try {
        destroyTime(timeId)
          .then((response) => {
            const tmpSchedulingTimes = response.items;
            let schedulingTimes = [];
            if (tmpSchedulingTimes.length > 0) {
              schedulingTimes = this.getScheduleTimes(tmpSchedulingTimes);
            }

            this.setState({
              schedulingTimes,
            });
          }).catch((error) => {
        });
      } catch(error) {
        console.log(error);
      }
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
    const { schedulingTimes, postSchedulingOption, bestTime } = this.state;
    const dateTime = this.getDateTime();

    let start, end = 0;
    let times = [];

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
      times.push({ schedule_time: bestTime, schedule_week: i });
    }

    try {
      schedulingStore({
        times
      })
        .then((response) => {
          const tmpSchedulingTimes = response.items;
          let schedulingTimes = [];
          if (tmpSchedulingTimes.length > 0) {
            schedulingTimes = this.getScheduleTimes(tmpSchedulingTimes);
          }

          this.setState({
            schedulingTimes,
          });

          notification.success({
            message: 'Done!',
            description: 'Awesome! Your schedule has been successfully saved.'
          });
        }).catch((error) => {
      });
    } catch(error) {
      console.log(error);
    }
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
    try {
      clearAll()
        .then((response) => {
          const tmpSchedulingTimes = response.items;
          let schedulingTimes = [];
          if (tmpSchedulingTimes.length > 0) {
            schedulingTimes = this.getScheduleTimes(tmpSchedulingTimes);
          }

          this.setState({
            schedulingTimes,
            visible: false,
          });
          notification.success({
            message: 'Done!',
            description: 'Awesome! Your schedule has been successfully saved.'
          });
        }).catch((error) => {
      });
    } catch(error) {
      console.log(error);
    }
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { postSchedulingOption, weeks, schedulingTimes, visible, isLoading } = this.state;
    const { name, timezone } = this.props;
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
                format="hh:mm A"
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
                  <SchedulingTableBody schedulingTimes={schedulingTimes} timezone={timezone} onEveryDateTimeChange={this.onEveryDateTimeChange}/>
                </table>
            }
          </div>
        </div>
        { isLoading && <Loader fullscreen /> }
      </div>
    );
  }
}

export default PostScheduling;
