import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Select } from 'antd';

const { Option } = Select;

class AccountSelector extends React.Component {
  static propTypes = {
    socialMedia: PropTypes.string,
    accounts: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number.isRequired
  };

  render() {
    const { accounts, socialMedia, onChange, value } = this.props;

    return (
      <Select
        value={value}
        size="large"
        onChange={onChange}
        style={{ width: 210 }}
      >
        {
          accounts && accounts
            .filter((account => account.type === socialMedia))
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

const mapStateToProps = (state) => {
  return {
    accounts: state.channels.list
  };
};

export default connect(mapStateToProps, null)(AccountSelector);
