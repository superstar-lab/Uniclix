import React from 'react';
import PropTypes from 'prop-types';
import {Button, Select, TimePicker} from 'antd';
import moment from "moment";

const { Option } = Select;

class PostsTimePicker extends React.Component {

  constructor(props) {
    super(props);

  }

  getDateTime = (time) => {
    const { timezone } = this.props;
    const dateTime = moment.tz(time, 'hh:mm A', timezone);

    return dateTime;
  };

  render() {
    const { schedulingTime, week } = this.props;

    return (
      <ul>
        {
          schedulingTime.map((item, index) => (
            <li>
              <TimePicker
                use12Hours
                format="hh:mm A"
                onChange={(value, valueString) => {this.props.onEveryDateTimeChange(value, valueString, week, index, item.timeId)}}
                value={this.getDateTime(item.time)}
                size="small"
                style={{width: 90}}
              />
            </li>
          ))
        }
      </ul>
    );
  }
}

export default PostsTimePicker;