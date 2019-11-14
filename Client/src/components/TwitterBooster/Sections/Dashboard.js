import React from 'react';
import { connect } from "react-redux";
import UpgradeAlert from '../../UpgradeAlert';
import channelSelector from "../../../selectors/channels";
import { startSetChannels } from "../../../actions/channels";
import 'react-dates/initialize';
import TwitterOverviewCard from '../../Analytics/Twitter/Cards/TwitterOverviewCard';
import TweetsTable from '../../Analytics/Twitter/Cards/TweetsTable';
import Tabs from '../../Tabs';
// require('./styles.css');

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        data: false,
        forbidden: false,
        calendarChange: false,
        loading: this.props.channelsLoading
    }

    setLoading = (loading = false) => {
        this.setState(() => ({
            loading
        }));
    };

    setForbidden = (forbidden = false) => {
        if (forbidden != this.state.forbidden) {
            this.setState(() => ({
                forbidden
            }));
        }
    };


    render() {
        const propData = {
            calendarChange: this.state.calendarChange,
            setForbidden: this.setForbidden,
            selectedAccount: this.props.selectedChannel.id,
            selectedChannel: this.props.selectedChannel
        }

        return (
            <div>
                <div className="section-header no-border mb-40">
                    <div className="section-header__first-row">
                        <h2>Posts</h2>
                    </div>
                </div>

                <Tabs>
                    <div label="Scheduled">
                        See ya later, <em>Alligator</em>!
                    </div>
                    <div label="Awaiting Aproval">
                        After 'while, <em>Crocodile</em>!
                        </div>
                    <div label="Draft">
                        Nothing to see here, this tab is <em>extinct</em>!
                    </div>
                </Tabs>

                <UpgradeAlert isOpen={this.state.forbidden && !this.state.loading} goBack={true} setForbidden={this.setForbidden} />
                {!this.state.forbidden &&
                    <div>
                        <div className="row overview-cards-container mb20">
                            <div className="col-md-3 col-xs-12">
                                <TwitterOverviewCard
                                    name='Tweets'
                                    type="tweetsCount"
                                    description='tweets'
                                    tooltipDesc='The number of tweets published from your Twitter account'
                                    {...propData} />
                            </div>
                            <div className="col-md-3 col-xs-12">
                                <TwitterOverviewCard
                                    name='Followers'
                                    type="followersCount"
                                    description='followers'
                                    tooltipDesc='The number of people who are following your Twitter account'
                                    {...propData} />
                            </div>
                            <div className="col-md-3 col-xs-12">
                                <TwitterOverviewCard
                                    name='Following'
                                    type="followingCount"
                                    description='following'
                                    tooltipDesc='Toatal number of people you are following on your Twitter accounts'
                                    {...propData} />
                            </div>
                            <div className="col-md-3 col-xs-12">
                                <TwitterOverviewCard
                                    name='Likes'
                                    type="totalLikesCount"
                                    description='likes'
                                    tooltipDesc='Number of likes with your selected account'
                                    {...propData} />
                            </div>
                        </div>

                        <div className="row mb20">
                            <div className="col-xs-12">
                                <TweetsTable
                                    name="Tweets Table"
                                    type='tweetsTableData'
                                    tooltipDesc='The list of tweets published by your Twitter account, with their engagement stats: retweets, replies and likes'
                                    {...propData} />
                            </div>
                        </div>

                    </div>}

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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
