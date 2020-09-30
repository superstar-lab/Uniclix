import React from 'react';
import PropTypes from 'prop-types';
import {Button, Select} from 'antd';

const { Option } = Select;

class SchedulingTableHeader extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {
    const { onTurnScheduleTime, weeks } = this.props;

    return (
      <tr>
        {
          weeks.map((week, index) => (
            <th>
              <div><label>{week.name}</label></div>
              <Button key={index} value={index} onClick={onTurnScheduleTime}>{week.status == true ? "Turn on" : "Turn off"}</Button>
            </th>
          ))
        }
      </tr>
    );
  }
}

export default SchedulingTableHeader;
