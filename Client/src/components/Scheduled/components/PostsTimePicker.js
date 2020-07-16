import React from 'react';
import PropTypes from 'prop-types';
import {Button, Select, TimePicker} from 'antd';

const { Option } = Select;

class PostsTimePicker extends React.Component {

  constructor(props) {
    super(props);

  }

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
                onChange={(value) => {this.props.onEveryDateTimeChange(value, week, index)}}
                value={item.time}
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