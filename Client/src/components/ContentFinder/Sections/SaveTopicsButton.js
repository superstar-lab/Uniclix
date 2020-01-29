import React from 'react';
import PropTypes from 'prop-types';

import { updateProfile } from '../../../requests/profile';

class SaveTopicsButton extends React.Component {
  static propTypes = {
    setLoading: PropTypes.func.isRequired,
    selectedTopics: PropTypes.array.isRequired
  };

  onTopicsSave = () => {
    const { setLoading, selectedTopics } = this.props;

    setLoading(true);

    updateProfile({
        topics: selectedTopics
    }).then((response) => {
        setLoading(false);
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
          Show me posts to share
      </button>
    );
  }
}

export default SaveTopicsButton;
