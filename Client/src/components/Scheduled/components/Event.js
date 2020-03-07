import React from 'react';
import moment from 'moment';

import { destroyPost } from '../../../requests/channels';

const Event = ({ event, view, timezone, closeEvent, isSelected, channelsList, toggleLoading, fetchPosts, setComposerToEdit }) => {
  const { content, wasAlreadyPosted, payload: { scheduled: { publishUTCDateTime } }, category, channel_ids } = event;
  let timeEvent = moment(publishUTCDateTime).tz(timezone);

  const channels = channelsList.filter(channel => channel_ids.indexOf(channel.id) !== -1);

  // Everytime the card gets clicked the calendar is re-rendered.
  // I prevent that behavior by stop propagating the event
  const onClick = (e) => {
    if (isSelected) {
      e.stopPropagation();
    }
  };

  const deletePost = () => {
    toggleLoading();
    destroyPost(event.id)
      .then(() => {
        toggleLoading();
        fetchPosts();
      })
      .catch(() => {
        toggleLoading();
      });
  };

  const editPost = () => {
    if (!wasAlreadyPosted) {
      const {
        post_id,
        channel_ids,
        content,
        payload: { images, scheduled: { publishUTCDateTime } },
        category_id
      } = event;

      const date = moment(publishUTCDateTime).tz(timezone).format('YYYY-MM-DDTHH:mmZ');

      const postData = {
        id: post_id,
        publishChannels: new Set(channel_ids),
        content,
        pictures: images,
        category: category_id,
        date,
        selectedTimezone: timezone
      };

      setComposerToEdit(postData);
    }
  };

  // this flag will determine if the event needs to be expanded
  // towards above or not
  const expandAbove = timeEvent.hours() >= 22;

  const renderWeekView = () => {
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
            <div className={wasAlreadyPosted ? 'disabled' : ''} onClick={editPost}>
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

  const renderDayView = () => {
    return (
      <div className="event-card-calendar" onClick={onClick}>
        <div className="left-section">
          <div
            className="topic"
            style={{ backgroundColor: category.color }}
          >
            {category.category_name}
          </div>
          <div className="title">
            {
              isSelected ?
                timeEvent.format("ddd D, h:mm A.") :
                timeEvent.format("h:mm A")
            }
          </div>
        </div>
        <div className="middle-section">
          <div className="description">
            {`${(content).substring(0, 300)}${content.length > 300 ? '...' : ''}`}
          </div>
        </div>
        <div className="right-section">
          <div className="icons-section">
            <div onClick={deletePost}>
              <i className="far fa-trash-alt"></i>
            </div>
            <div className={wasAlreadyPosted ? 'disabled' : ''} onClick={editPost}>
              <i className="fas fa-pen"></i>
            </div>
            <div onClick={closeEvent}>
              <i className="fas fa-times"></i>
            </div>
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
      </div>
    );
  }

  switch(view) {
    case 'day':
      return renderDayView();
    case 'week':
    case 'year':
      return renderWeekView();
    default:
      return null;
  }
};

export default Event;
