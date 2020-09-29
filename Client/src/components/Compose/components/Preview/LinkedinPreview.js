import React from 'react';
import PropTypes from 'prop-types';

import PreviewCard from './PreviewCard';

class LinkedinPreview extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    channel: PropTypes.object.isRequired,
    pictures: PropTypes.array.isRequired,
    videos: PropTypes.array.isRequired
  }

  render() {
    const {
      channel: {
        name,
        avatar
      },
      text,
      pictures,
      videos
    } = this.props;

    return (
      <PreviewCard
        avatar={avatar}
        name={name}
        pictures={pictures}
        videos={videos}
        text={text}
        socialMedia="linkedin"
      />
    );
  }
}

export default LinkedinPreview;
