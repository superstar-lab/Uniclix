import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addTopic, removeTopic } from '../../../actions/profile';

class TopicButton extends React.Component {
  static propTypes = {
    topic: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired
  }

  onAddTopic = () => {
    const { addTopic, topic } = this.props;
    addTopic(topic);
  }

  onRemoveTopic = () => {
    const { removeTopic, topic } = this.props;
    removeTopic(topic);
  }

  render() {
    const { topic, isSelected } = this.props;

    return (
      <div
        onClick={ isSelected ? this.onRemoveTopic : this.onAddTopic }
        className={`keyword-item ${ isSelected ? 'added-keyword' : ''}`}>
          #{topic}
      </div>
    );
  }
}

export default connect(null, { addTopic, removeTopic })(TopicButton);
