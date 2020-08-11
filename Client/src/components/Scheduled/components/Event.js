import React from 'react';
import moment from 'moment';

import { destroyPost } from '../../../requests/channels';
import { isOwnerOrAdmin } from '../../../utils/helpers';

const Event = ({
  event,
  view,
  timezone,
  closeEvent,
  isSelected,
  channelsList,
  toggleLoading,
  fetchPosts,
  setComposerToEdit,
  accessLevel,
  deleteWeekPost
}) => {
  const { content, payload: { scheduled: { publishUTCDateTime } }, category, channel_ids } = event;
  let timeEvent = moment(publishUTCDateTime).tz(timezone);
  const wasNotAlreadyPosted = timeEvent.isAfter(moment().tz());

  const channels = channelsList.filter(channel => channel_ids.indexOf(channel.id) !== -1);

  // Everytime the card gets clicked the calendar is re-rendered.
  // I prevent that behavior by stop propagating the event
  const onClick = (e) => {
    if (isSelected) {
      e.stopPropagation();
    }
  };

  const deletePost = () => {
    deleteWeekPost(event.post_id);
  };

  const editPost = () => {

    // We want to let the user to edit the post when it wasn't published yet
    if (wasNotAlreadyPosted) {
      const {
        post_id,
        channel_ids,
        content,
        payload: { images, videos, scheduled: { publishUTCDateTime } },
        category_id
      } = event;

      const date = moment(publishUTCDateTime).tz(timezone).format('YYYY-MM-DDTHH:mmZ');

      const postData = {
        id: post_id,
        publishChannels: new Set(channel_ids),
        content,
        pictures: images,
        videos: videos,
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
            {
              isOwnerOrAdmin(accessLevel) && (
                <React.Fragment>
                  <div onClick={deletePost}>
                    <i className="far fa-trash-alt"></i>
                  </div>
                  <div className={!wasNotAlreadyPosted ? 'disabled' : ''} onClick={editPost}>
                    <i className="fas fa-pen"></i>
                  </div>
                </React.Fragment>
              )
            }
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
          { content ? `${(content).substring(0, 40)}${content.length > 40 ? '...' : ''}` : '' }
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
            {
              isOwnerOrAdmin(accessLevel) && (
                <React.Fragment>
                  <div onClick={deletePost}>
                    <i className="far fa-trash-alt"></i>
                  </div>
                  <div className={!wasNotAlreadyPosted ? 'disabled' : ''} onClick={editPost}>
                    <i className="fas fa-pen"></i>
                  </div>
                </React.Fragment>
              )
            }
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

  const renderMonthView = () => {
    return (
      <div>
        { timeEvent.format("h:mm A") }
      </div>
    );
  };

  switch(view) {
    case 'day':
      return renderDayView();
    case 'week':
      return renderWeekView();
    case 'month':
      return renderMonthView();
    default:
      return null;
  }
};

export default Event;
