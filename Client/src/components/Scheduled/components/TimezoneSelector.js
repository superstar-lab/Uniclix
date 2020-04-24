import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

import TimezoneSelectOptions from '../../Settings/Fixtures/TimezoneOptions';

const { Option } = Select;

class TimezoneSelector extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
  };

  render() {
    const { onChange, value } = this.props;
    
    return (
      <div className="timezone-selector">
        <span className="select-label">Set Timezone (UTC)</span>
        <Select onChange={onChange} style={{width: 300}} value={value}>
          {
            TimezoneSelectOptions.map(timezone => (
              <Option
                key={timezone.value}
                value={timezone.value}
                title={timezone.name}
              >
                {timezone.name}
              </Option>
            ))
          }
        </Select>
      </div>
    );
  }
}

export default TimezoneSelector;
