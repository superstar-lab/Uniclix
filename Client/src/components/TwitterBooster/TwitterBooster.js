import React from 'react';
import { connect } from "react-redux";
import VerticalMenu from "../Menus/VerticalMenu";
import MenuItems from "./Fixtures/MenuItems";
import ManageRouter from "../../routes/ManageRouter";
import channelSelector from "../../selectors/channels";
import { setTwitterChannel } from '../../actions/channels';
import SocialAccountsPrompt from '../SocialAccountsPrompt';

const Manage = ({channels, selectedChannel, selectChannel}) => { 
    const hasChannel = typeof(selectedChannel.username) !== "undefined"; 
    return (
        <div className="body-wrap">
            {!!hasChannel ? <div>
                <VerticalMenu 
                    menuItems={MenuItems} 
                    channels={channels} 
                    selectedChannel={selectedChannel}
                    selectChannel={selectChannel}
                    />
                <div className="body-container">
                    <div className="main-section">
                        <ManageRouter/>
                    </div>
                </div>
            </div>:
            <div className="mt100">
                <SocialAccountsPrompt 
                    image = "/images/connect_twitter_accounts.svg"
                    title = "Prove the impact of your social media initiatives"
                    description = "Track your social growth, and get meaningful stats"
                    buttonTitle = "Connect your Twitter Account"
                    buttonLink = "/accounts/twitter"
                />
            </div>
            }

        </div>  
    );
};

const mapStateToProps = (state) => {

    const unselectedTwitterChannels = {selected: 0, provider: "twitter"};
    const selectedTwitterChannel = {selected: 1, provider: "twitter"};

    const channels = channelSelector(state.channels.list, unselectedTwitterChannels);
    const selectedChannel = channelSelector(state.channels.list, selectedTwitterChannel);

    return {
        channels,
        selectedChannel: selectedChannel.length ? selectedChannel[0] : {}
    };
};

const mapDispatchToProps = (dispatch) => ({
    selectChannel: (id) => dispatch(setTwitterChannel(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Manage);