import React from 'react';
import { connect } from "react-redux";
import VerticalMenu from "../Menus/VerticalMenu";
import channelSelector from "../../selectors/channels";
import MenuItems from "../TwitterBooster/Fixtures/MenuItems";
import { setGlobalChannel } from '../../actions/channels';
import ScheduledRouter from '../../routes/ScheduledRouter';

// const menuItems = [
//     {   
//         id: "unapproved_posts",
//         displayName: "Awaiting Approval",
//         uri: "/scheduled/unapproved" 
//     },
//     {   
//         id: "scheduled_posts",
//         displayName: "Scheduled Posts",
//         uri: "/scheduled/posts" 
//     },
//     {   
//         id: "scheduled_past",
//         displayName: "Past Scheduled",
//         uri: "/scheduled/past" 
//     }
// ];

const Scheduled = ({ channels, selectedChannel, selectChannel }) => (
    <div className="body-wrap">
        <VerticalMenu
            menuItems={MenuItems}
            channels={channels}
            selectedChannel={selectedChannel}
            selectChannel={selectChannel}
        />
        <div className="body-container">
            <ScheduledRouter />
        </div>
    </div>
);

const mapStateToProps = (state) => {

    const unselectedGlobalChannels = { selected: 0, provider: undefined };
    const selectedGlobalChannel = { selected: 1, provider: undefined };

    const channels = channelSelector(state.channels.list, unselectedGlobalChannels);
    const selectedChannel = channelSelector(state.channels.list, selectedGlobalChannel);

    return {
        channels,
        selectedChannel: selectedChannel.length ? selectedChannel[0] : {}
    };
};

const mapDispatchToProps = (dispatch) => ({
    selectChannel: (id) => dispatch(setGlobalChannel(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Scheduled);