import React from 'react';

import ReadMore from '../../../ReadMore';

class TweetCard extends React.Component {
  render() {
    const { avatar, username, screenName, text, date, likes, comments, retweets } = this.props;

    return (
      <div className="tweet-card">
        <div className="user-info">
          <div>
            <img src={avatar} />
          </div>
          <div className="user-names">
            <div className="username">{username}</div>
            <div className="screen-name">{`@${screenName}`}</div>
          </div>
        </div>
        <div className="text"><ReadMore>{text}</ReadMore></div>
        <div className="date">{date}</div>
        <div className="tweet-info">
          <div className="data">
            <div className="amount">{likes}</div>
            <div className="label">Likes</div>
          </div>
          <div className="data">
            <div className="amount">{comments}</div>
            <div className="label">Comments</div>
          </div>
          <div className="data">
            <div className="amount">{retweets}</div>
            <div className="label">Retweets</div>
          </div>
        </div>
      </div>
    );
  }
}

export default TweetCard;
