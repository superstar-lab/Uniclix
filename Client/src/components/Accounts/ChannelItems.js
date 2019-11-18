import React from 'react';

const ChannelItems = ({ channels, setAction }) => (
    channels.map((channel) => (
        <ChannelItem key={channel.id} channel={channel} setAction={setAction} />
    ))
);

const ChannelItem = ({ channel, setAction }) => (
    <div className="channel-buttons">
        <div className="twitter-middleware-btn added-channel-btn">
            <a href="#" className="block-urls2">
                <div className="profile-info account-info pull-right">
                    <div className="channel-profile-info">
                        <img className="pull-left" onError={(e) => e.target.src = '/images/dummy_profile.png'} src={channel.avatar} />
                        <div>
                            {/* <p className="profile-name">{ channel.name }  <span className="profile-state"></span></p> */}
                            <p className="profile-username">@{channel.username}</p>
                        </div>
                    </div>

                    <div className="item-actions pull-right">
                        <div className="trash-btn" onClick={() => setAction({ id: channel.id, type: "delete" })}><i className="fa fa-trash"></i> <span className="delete-text"> Delete</span></div>
                    </div>
                </div>
            </a>
        </div>
    </div>






);

export default ChannelItems;