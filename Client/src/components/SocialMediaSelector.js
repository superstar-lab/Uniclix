import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

const { Option } = Select;

class SocialMediaSelector extends React.Component {
  static propTypes = {
    socialMedias: PropTypes.arrayOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
  };

  render() {
    const { socialMedias, onChange, value } = this.props;

    return (
      <Select
        value={value}
        size="large"
        onChange={onChange}
      >
        {
          socialMedias && socialMedias
            .map(socialMedia => (
              <Option key={socialMedia} value={socialMedia}>
                <span className="social-media-selector-option">
                  <i className={`fab fa-${socialMedia} ${socialMedia}`}></i>
                  <span>{`${socialMedia.charAt(0).toUpperCase()}${socialMedia.slice(1)}`}</span>
                </span>
              </Option>
          ))
        }
      </Select>
    );
  }
}

export default SocialMediaSelector;
