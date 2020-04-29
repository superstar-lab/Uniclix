import React from 'react';
import PropTypes from 'prop-types';

import { updateProfile } from '../../../requests/profile';

class SaveTopicsButton extends React.Component {
  static propTypes = {
    setLoading: PropTypes.func.isRequired,
    selectedTopics: PropTypes.array.isRequired,
    resetTopics: PropTypes.func.isRequired
  };

  onTopicsSave = () => {
    const { setLoading, selectedTopics, resetTopics } = this.props;

    setLoading(true);

    updateProfile({
        topics: selectedTopics
    }).then((response) => {
        setLoading(false, false);
        resetTopics();
    }).catch((error) => {
        console.log(error);
        setLoading(false);
    });
  };

  render() {
    const { selectedTopics } = this.props;

    return (
      <button
        className="btn-blue"
        onClick={() => this.onTopicsSave(false)}
        disabled={!selectedTopics.length}
      >
          Find Content
      </button>
    );
  }
}

export default SaveTopicsButton;
