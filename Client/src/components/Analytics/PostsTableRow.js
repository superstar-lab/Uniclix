import React from 'react';
import PropTypes from 'prop-types';

import ReadMore from '../ReadMore';

class PostsTableRow extends React.Component {
  static propTypes = {
    avatar: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    likesLabel: PropTypes.string.isRequired,
    comments: PropTypes.number.isRequired,
    shares: PropTypes.number.isRequired,
    sharesLabel: PropTypes.string.isRequired,
    screenName: PropTypes.string
  };

  render() {
    const {
      avatar,
      username,
      screenName,
      text,
      date,
      likes,
      comments,
      shares,
      sharesLabel,
      likesLabel
    } = this.props;

    return (
      <div className="post-card">
        <div className="user-info">
          <div>
            <img src={avatar} />
          </div>
          <div className="user-names">
            <div className="username">{username}</div>
            { screenName && <div className="screen-name">{`@${screenName}`}</div> }
          </div>
        </div>
        <div className="text"><ReadMore>{text}</ReadMore></div>
        <div className="date">{date}</div>
        <div className="post-info">
          <div className="data">
            <div className="amount">{likes}</div>
            <div className="label">{likesLabel}</div>
          </div>
          <div className="data">
            <div className="amount">{comments}</div>
            <div className="label">Comments</div>
          </div>
          <div className="data">
            <div className="amount">{shares}</div>
            <div className="label">{sharesLabel}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default PostsTableRow;
