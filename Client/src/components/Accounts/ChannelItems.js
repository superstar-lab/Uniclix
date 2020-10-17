import React from 'react';

const ChannelItems = ({ channels, setAction }) => (
    channels.map((channel) => (
        <ChannelItem key={channel.id} channel={channel} setAction={setAction} />
    ))
);

const ChannelItem = ({ channel, setAction }) => (
    <div className="account-square">
        <div className="square-content">
            <div className="avatar-container">
                <img
                    onError={(e) => e.target.src = '/images/dummy_profile.png'}
                    src={channel.avatar}
                />
                <i className={`fa fa-${channel.type} ${channel.type}_bg smallIcon`} />
            </div>
            <div className="name-holder">
                <p className="profile-name acc-name">
                    { !!channel.username ? `@${channel.username}` : channel.name } 
                </p>
            </div>
        </div>
        <div
            className="user-action mrnone"
            onClick={() => setAction({ id: channel.id, type: "delete" })}
        >
            <i className="fa fa-trash"></i>
        </div>

    </div>

);

export default ChannelItems;