import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Select } from 'antd';

const { Option } = Select;

class AccountSelector extends React.Component {
  static propTypes = {
    accounts: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number.isRequired
  };

  render() {
    const { accounts, onChange, value } = this.props;

    return (
      <Select
        value={value}
        size="large"
        onChange={onChange}
        style={{ width: 210 }}
      >
        {
          accounts && accounts
            .map(({ username, name, avatar, id, type }) => (
              <Option key={username} value={id}>
                <span className="account-selector-option">
                  <img src={avatar} />
                  <span>{ type !== 'twitter' ? name : `@${username}` }</span>
                </span>
              </Option>
          ))
        }
      </Select>
    );
  }
}

export default AccountSelector;
