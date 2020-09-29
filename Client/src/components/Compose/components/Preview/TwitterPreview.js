import React from 'react';
import PropTypes from 'prop-types';

import PreviewCard from './PreviewCard';

class TwitterPreview extends React.Component {
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
        username,
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
        subTitle={`@${username}`}
        pictures={pictures}
        videos={videos}
        text={text}
        socialMedia="twitter"
      />
    );
  }
}

export default TwitterPreview;
