import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import PreviewCard from './PreviewCard';

class FacebookPreview extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    date: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    timezone: PropTypes.string.isRequired,
    pictures: PropTypes.array.isRequired,
    videos: PropTypes.array.isRequired
  }

  render() {
    const {
      channel: {
        details: {
          payload: {
            name,
            avatar
          }
        }
      },
      text,
      date,
      timezone,
      pictures,
      videos
    } = this.props;
    const previewDate = date ?
      moment(date).tz(timezone).format('MMMM DD, HH:mm a') :
      new Date().toString();

    return (
      <PreviewCard
        avatar={avatar}
        name={name}
        subTitle={previewDate}
        pictures={pictures}
        videos={videos}
        text={text}
        socialMedia="facebook"
      />
    );
  }
}

export default FacebookPreview;
