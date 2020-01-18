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
    value: PropTypes.string.isRequired
  };

  render() {
    const { accounts, socialMedia, onChange, value } = this.props;

    return (
      <Select
        value={value}
        size="large"
        onChange={onChange}
      >
        {
          accounts && accounts
            .filter((account => account.type === socialMedia))
            .map(({ username, avatar, id }) => (
              <Option key={username} value={id}>
                <span className="account-selector-option">
                  <img src={avatar} />
                  <span>{username}</span>
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
