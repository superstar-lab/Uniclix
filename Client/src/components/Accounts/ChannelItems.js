import React from 'react';

const ChannelItems = ({ channels, setAction }) => (
    channels.map((channel) => (
        <ChannelItem key={channel.id} channel={channel} setAction={setAction} />
    ))
);

const ChannelItem = ({ channel, setAction }) => (
    <div className="accounts-container__content__wrapper__body">
        <div className="channel-container">
            <a href="#" className="block-urls">
                <div className="profile-info account-info pull-right">
                    <img className="pull-left" onError={(e) => e.target.src='/images/dummy_profile.png'} src={channel.avatar} />
                    <div className="pull-left">
                        <p className="profile-name" title={channel.name}><i className={`fa fa-circle ${!!channel.active ? `green-txt` : `red-txt`}`}> </i> {channel.name}</p>
                        <p className="profile-username">{!!channel.username && `@${channel.username}`}</p>
                    </div>
                    <div className="item-actions pull-right">
                        <div className="trash-btn" onClick={() => setAction({id: channel.id, type: "delete"})}><i className="fa fa-trash"></i> <span className="delete-text"> Delete</span></div>
                    </div>
                </div>
            </a>
        </div>
    </div>
);

export default ChannelItems;