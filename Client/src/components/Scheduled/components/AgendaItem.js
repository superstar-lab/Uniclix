import React from 'react';

const AgendaItem = ({ post, channelsList }) => {
  const channelsCount = post['channel_ids'].length;
  const channelIds = channelsCount <= 3 ? post['channel_ids'] : post['channel_ids'].splice(0, 2);

  return (
    <div
      className="event-in-agenda"
    >
      <div className="event-content">
        <div className="content">
        {
          post.content ?
            `${(post.content).substring(0, 200)}${post.content.length > 200 ? '...' : ''}` :
            ''
        }
        </div>
        <div className="footer">
          <div className="event-channels">
            {
              channelsList
                .filter(channel => channelIds.indexOf(channel.id) !== -1)
                .map(({ type, avatar }, index) => (
                  <div className="channel" key={`${type}-${index}`}>
                    <img src={avatar} />
                    <i className={`fab fa-${type} ${type}_bg`} />
                  </div>
                ))
            }
            {
              channelsCount > 3 && (
                <div className="rest-of-channels">
                  { `+${channelsCount - 2}` }
                </div>
              )
            }
          </div>
          <div
            style={{ backgroundColor: post.category.color }}
            className="category-post"
          >
              {post.category.category_name}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgendaItem;
