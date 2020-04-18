import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Input } from 'antd';

import { addTopic, removeTopic } from '../../../actions/profile';

class AddedByYouSection extends React.Component {
  static propTypes = {
    topicsAddedByYou: PropTypes.array.isRequired,
    allTopics: PropTypes.array.isRequired
  };

  state = {
    inputValue: ''
  }

  onAddTopic = () => {
    const { allTopics, addTopic } = this.props;
    const { inputValue } = this.state;

    // We avoid the user to enter the same topic more than once
    if (allTopics.indexOf(inputValue.toUpperCase()) === -1) {
      addTopic(inputValue.toUpperCase());
      this.setState({ inputValue: '' })
    }
  }

  onInputChange = (e) => {
    const { value } = e.currentTarget;
    this.setState({ inputValue: value });
  };

  render() {
    const { topicsAddedByYou, removeTopic } = this.props;
    const { inputValue } = this.state;

    return (
      <div className="topics-added-by-you">
        <Input
          placeholder="Add keywords"
          value={inputValue}
          onChange={this.onInputChange}
          onPressEnter={this.onAddTopic}
          size="large"
        />
          {
            !topicsAddedByYou.length && (
              <div className="message-container">
                <div className="title">Be the first to know the trending news</div>
                <div className="description">
                  Search keywords and curate articles from thousands of sources to share them in no time
                </div>
              </div>
            )
          }
          {
            !!topicsAddedByYou.length && (
              <div className="topics">
                  <div className="sub-title">Added by you</div>
                  {
                    topicsAddedByYou.map(topic => (
                      <div
                        className="keyword-item"
                        onClick={() => removeTopic(topic)}
                      >
                        #{topic}
                        <i className="fa fa-close"></i>
                      </div>
                    ))
                  }
              </div>
            )
          }
      </div>
    );
  }
}

export default connect(null, { addTopic, removeTopic })(AddedByYouSection);
