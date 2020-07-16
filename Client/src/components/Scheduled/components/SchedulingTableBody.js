import React from 'react';
import PropTypes from 'prop-types';
import {Button, Select, TimePicker} from 'antd';

import PostsTimePicker from './PostsTimePicker';

const { Option } = Select;

class SchedulingTableBody extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {
    const { schedulingTimes } = this.props;

    return (
      <tr>
        {
          schedulingTimes.map((schedulingTime, index) => (
            <td>
              <PostsTimePicker schedulingTime={schedulingTime} week={index} onEveryDateTimeChange={this.props.onEveryDateTimeChange}/>
            </td>
          ))
        }
      </tr>
    );
  }
}

export default SchedulingTableBody;