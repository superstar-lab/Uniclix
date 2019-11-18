import React from 'react';

const ChannelItems = ({ channels, setAction }) => (
    channels.map((channel) => (
        <ChannelItem key={channel.id} channel={channel} setAction={setAction} />
    ))
);

const ChannelItem = ({ channel, setAction }) => (
    <div>
        <div className="twitter-middleware-btn added-channel-btn">
            <div className="block-urls2">
                <div className="profile-info account-info pull-right">
                    <div className="channel-profile-info">
                        <img className="pull-left" onError={(e) => e.target.src = '/images/dummy_profile.png'} src={channel.avatar} />
                        <div>
                            {/* <p className="profile-name">{ channel.name }  <span className="profile-state"></span></p> */}
                            <p className="profile-username">@{channel.username}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="user-action mrnone" onClick={() => setAction({ id: channel.id, type: "delete" })}><i className="fa fa-trash"></i></div>

        </div>
    </div>

);

export default ChannelItems;