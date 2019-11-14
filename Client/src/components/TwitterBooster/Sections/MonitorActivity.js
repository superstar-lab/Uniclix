import React from 'react';
import { connect } from "react-redux";
import channelSelector from "../../../selectors/channels";
import { startSetChannels } from "../../../actions/channels";
import 'react-dates/initialize';
import Tabs from '../../Tabs';

class MonitorActivity extends React.Component {
    myClick() {
        alert("Hello World!");
    };
    render() {
        return (
            <div>
                <div className="section-header no-border mb-40">
                    <div className="section-header__first-row">
                        <h2>Monitor Activity</h2>
                    </div>
                </div>
                <Tabs>
                    <div label="New Tab">
                        Tweets from people you follow.
                    </div>
                    <div label="+">
                        add new account( show tweets from another account )
                    </div>
                </Tabs>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const selectedTwitterChannel = { selected: 1, provider: "twitter" };
    const selectedChannel = channelSelector(state.channels.list, selectedTwitterChannel);

    return {
        channelsLoading: state.channels.loading,
        selectedChannel: selectedChannel.length ? selectedChannel[0] : {}
    };
};

const mapDispatchToProps = (dispatch) => ({
    startSetChannels: () => dispatch(startSetChannels())
});

export default connect(mapStateToProps, mapDispatchToProps)(MonitorActivity);
