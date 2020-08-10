import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

const TodaysAgenda = ({ posts, timezone, channelsList }) => {
  const currentDate = timezone ? moment().tz(timezone) : moment();

  const filterTodaysByTimezone = (post) => {
    const { payload: { scheduled: { publishUTCDateTime } } } = post;
    const postDateTime = moment(publishUTCDateTime).tz(timezone);

    return postDateTime.date() === currentDate.date() &&
      postDateTime.month() === currentDate.month();
  }
  
  return (
    <div>
      {
      
        <div className="todays-agenda">
          <h4>Today’s agenda, {currentDate.format('MMMM D.')}</h4>
          {
            posts.filter(filterTodaysByTimezone).map((post) => (
              <div
                key={post.id}
                className="event-in-agenda"
                style={{ backgroundColor: post.category.color }}
              >
                <div className="event-content">
                  <div className="event-header">
                    <div className="hour">
                      {moment(post.payload.scheduled.publishUTCDateTime).tz(timezone).format("h:mm A")}
                    </div>
                    <div className="category" style={{ backgroundColor: post.category.color }}
                        className="category-post">
                        {post.category.category_name}
                    </div>
                  </div>
                  <div className="content">
                  { post.content ?
                      `${(post.content).substring(0, 200)}${post.content.length > 200 ? '...' : ''}` :
                      ''
                  }
                  </div>
                  <div className="event-channels">
                    {
                      channelsList
                        .filter(channel => post['channel_ids'].indexOf(channel.id) !== -1)
                        .map(({ type, avatar }, index) => (
                          <div key={`${type}-${index}`}>
                            <img src={avatar} />
                            <i className={`fab fa-${type} ${type}_bg`} />
                          </div>
                        ))
                    }
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      }
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    channelsList: state.channels.list
  };
};

export default connect(mapStateToProps, null)(TodaysAgenda);
