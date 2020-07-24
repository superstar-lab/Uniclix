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
    const dateTime = moment(time, 'h:mm A').tz(timezone);

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
                format="h:mm A"
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