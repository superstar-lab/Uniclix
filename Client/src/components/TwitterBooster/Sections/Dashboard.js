import React from 'react';
import { connect } from "react-redux";
import UpgradeAlert from '../../UpgradeAlert';
import channelSelector from "../../../selectors/channels";
import { startSetChannels } from "../../../actions/channels";
import 'react-dates/initialize';
import TweetsTable from '../../Analytics/Twitter/Cards/TweetsTable';
import TwitterOverviewCard from '../../Analytics/Twitter/TwitterOverviewCard';
import ChartsSection from '../../Analytics/Sections/ChartsSection';
import AccountSelector from '../../../components/AccountSelector';

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: false,
            forbidden: false,
            calendarChange: false,
            loading: props.channelsLoading,
            selectedAccount: props.selectedChannel.id
        }
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

    onAccountChange = (value) => this.setState({selectedAccount: value});

    render() {
        const { selectedAccount } = this.state;

        const propData = {
            calendarChange: this.state.calendarChange,
            setForbidden: this.setForbidden,
            selectedAccount,
            selectedChannel: this.props.selectedChannel
        }

        return (
            <div className="analytics-page">
                <div className="section-header mb-20">
                    <h1 className="page-title">Analytics</h1>
                    <div className="section-header__first-row">
                        <h3>Twitter Overview</h3>
                        <AccountSelector
                            socialMedia="twitter"
                            onChange={this.onAccountChange}
                            value={selectedAccount}
                        />
                    </div>
                </div>
                <UpgradeAlert isOpen={this.state.forbidden && !this.state.loading} goBack={true} setForbidden={this.setForbidden} />
                {!this.state.forbidden &&
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
