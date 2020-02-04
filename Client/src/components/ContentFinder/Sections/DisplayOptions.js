import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

const { Option } = Select;

class DisplayOptions extends React.Component {
  static propTypes = {
    setView: PropTypes.func.isRequired,
    selectedTopics: PropTypes.array,
    setFilterTopic: PropTypes.func.isRequired,
    deleteFilterTopic: PropTypes.func.isRequired
  };
  
  render() {
    const {
      setView,
      selectedTopics,
      setFilterTopic,
      deleteFilterTopic
    } = this.props;

    return (
      <div className="options-container">
        <div className="search-bar">
          <Select
            mode="multiple"
            showSearch
            showArrow
            style={{ width: '100%' }}
            onSelect={setFilterTopic}
            onDeselect={deleteFilterTopic}
          >
            {
              selectedTopics.map((topic, index) => (
                <Option key={`${topic}-${index}`} value={topic}>
                  {`#${topic}`}
                </Option>
              ))
            }
          </Select>
        </div>
        {/* Will be commented until we decide to add this feature
        <div className="icons">
          <div onClick={() => setView('grid')}>
            <img src="/images/icons/grid.svg" />
          </div>
          <div onClick={() => setView('list')}>
            <img src="/images/icons/list.svg" />
          </div>
        </div>
        */}
      </div>
    );
  }
}

export default DisplayOptions;
