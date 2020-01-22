import React from 'react';
import { connect } from "react-redux";
import 'react-dates/initialize';

import channelSelector from "../../../selectors/channels";
import { startSetChannels } from "../../../actions/channels";

import TweetsTable from './Cards/TweetsTable';
import TwitterOverviewCard from './TwitterOverviewCard';
import ChartsSection from '../Sections/ChartsSection';

class TwitterAnalyticsBoard extends React.Component {

    socialMediasSelectorOptions = [];

    constructor(props) {
        super(props);

        this.state = {
            data: false,
            forbidden: false,
            calendarChange: false,
            loading: props.channelsLoading
        }
    }

    render() {
        const { selectedAccount } = this.props;

        const propData = {
            calendarChange: this.state.calendarChange,
            setForbidden: this.setForbidden,
            selectedAccount,
            selectedChannel: this.props.selectedChannel
        }

        return (
            <div>
                <div className="row overview-cards-container mb20">
                    <div className="col-md-3 col-xs-12">
                        <TwitterOverviewCard
                            title="Tweets"
                            type="tweetsCount"
                            icon="edit"
                            {...propData}
                        />
                    </div>
                    <div className="col-md-3 col-xs-12">
                        <TwitterOverviewCard
                            title="Followers"
                            type="followersCount"
                            icon="followers"
                            {...propData}
                        />
                    </div>
                    <div className="col-md-3 col-xs-12">
                        <TwitterOverviewCard
                            title="Engagements"
                            type="followingCount"
                            icon="chart"
                            {...propData}
                        />
                    </div>
                    <div className="col-md-3 col-xs-12">
                        <TwitterOverviewCard
                            title="Impressions"
                            type="totalLikesCount"
                            icon="eye"
                            {...propData}
                        />
                    </div>
                </div>
                <ChartsSection {...propData} />
                <div className="row mb20">
                    <div className="col-xs-12">
                        <TweetsTable
                            name="Tweets Table"
                            type='tweetsTableData'
                            tooltipDesc='The list of tweets published by your Twitter account, with their engagement stats: retweets, replies and likes'
                            {...propData} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const selectedTwitterChannel = { selected: 1, provider: "twitter" };
    const selectedChannel = channelSelector(state.channels.list, selectedTwitterChannel);

    return {
        channelsLoading: state.channels.loading,
        selectedChannel: selectedChannel.length ? selectedChannel[0] : {},
        allChannels: state.channels.list
    };
};

const mapDispatchToProps = (dispatch) => ({
    startSetChannels: () => dispatch(startSetChannels())
});

export default connect(mapStateToProps, mapDispatchToProps)(TwitterAnalyticsBoard);
