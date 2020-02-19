import React from 'react';
import moment from 'moment';

import { destroyPost } from '../../../requests/channels';

const Event = ({ event, timezone, closeEvent, isSelected, channelsList, toggleLoading, fetchPosts }) => {
  const { content, wasAlreadyPosted, payload: { scheduled: { publishUTCDateTime } }, category } = event;
  let timeEvent = moment(publishUTCDateTime).tz(timezone);

  const channels = channelsList.filter(channel => event['channel_id'] === channel.id);

  // Everytime the card gets clicked the calendar is re-rendered.
  // I prevent that behavior by stop propagating the event
  const onClick = (e) => {
    if (isSelected) {
      e.stopPropagation();
    }
  };

  const deletePost = () => {
    try {
      toggleLoading();
      destroyPost(event.id)
        .then(() => {
          toggleLoading();
          fetchPosts();
        })
    } catch(error) {
      toggleLoading();
    }
  };

  // this flag will determine if the event needs to be expanded
  // towards above or not
  const expandAbove = timeEvent.hours() >= 22;

  return (
    <div className={`event-card-calendar ${expandAbove ? 'expand-above': ''}`} onClick={onClick}>
      <div className="event-header">
        <div
          className="topic"
          style={{ backgroundColor: category.color }}
        >
          {category.category_name}
        </div>
        <div className="icons-section">
          <div onClick={deletePost}>
            <i className="far fa-trash-alt"></i>
          </div>
          <div className={wasAlreadyPosted ? 'disabled' : ''}>
            <i className="fas fa-pen"></i>
          </div>
          <div onClick={closeEvent}>
            <i className="fas fa-times"></i>
          </div>
        </div>
      </div>
      <div className="title">
        {
          isSelected ? 
            timeEvent.format("ddd D, h:mm A.") :
            timeEvent.format("h:mm A")
        }
      </div>
      <div className="description">
        {`${(content).substring(0, 40)}${content.length > 40 ? '...' : ''}`}
      </div>
      <div className="event-channels">
        {
          channels.map(({ type, avatar }, index) => (
            <div key={`${type}-${index}`}>
              <img src={avatar} />
              <i className={`fab fa-${type} ${type}_bg`} />
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Event;
