import React from 'react';
import {connect} from 'react-redux';
import 'react-dates/initialize';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';
import { isInclusivelyBeforeDay } from 'react-dates';
import channelSelector, { channelById } from '../../../selectors/channels';
import Select from 'react-select';
import TwitterOverviewCard from '../Twitter/Cards/TwitterOverviewCard';
import TwiterPageOverviewCard from '../Twitter/Cards/TwitterPageOverviewCard';
import TweetsChart from '../Twitter/Cards/TweetsChart';
import TwitterEngagementCard from '../Twitter/Cards/TwitterEngagementCard';
import TwitterEngagementChart from '../Twitter/Cards/TwitterEngagementChart';
import TweetsTable from '../Twitter/Cards/TweetsTable';
import { isEmptyObject } from '../../../utils/helpers';
import UpgradeIntro from '../../UpgradeIntro';
import SocialAccountsPrompt from '../../SocialAccountsPrompt';

class TwitterOverview extends React.Component {

    state = {
        startDate: moment().subtract(30, 'days'),
        endDate: moment().add(1, 'days'),
        selectedAccount: Object.entries(this.props.selectedChannel).length ? 
        {label: <ProfileChannel channel={this.props.selectedChannel} />, value: this.props.selectedChannel.id, type: this.props.selectedChannel.type} : 
        (this.props.channels.length ? 
          {label: <ProfileChannel channel={this.props.channels[0]} />, value: this.props.channels[0].id, type: this.props.channels[0].type} : {}),
        loading: false,
        forbidden: false,
        calendarChange: false
    }

    handleAccountChange = (selectedAccount) => {
        this.setState(() => ({
            selectedAccount
        }));
    };

    onCalendarClose() {
        this.setState(() => ({
            calendarChange : !this.state.calendarChange
        }));
    }

    setForbidden = (forbidden = false) => {
        if (forbidden != this.state.forbidden) {
            this.setState(() => ({
                forbidden
            }));
        }
    };

    render(){
        const propData = {
            startDate: this.state.startDate,
            endDate: this.state.endDate, 
            selectedAccount: this.state.selectedAccount.value,
            calendarChange: this.state.calendarChange,
            setForbidden: this.setForbidden,
            selectedChannel: channelById(this.props.channels, { id: this.state.selectedAccount.value })
        }
        return (
            <div>
                {!this.state.forbidden && !isEmptyObject(this.state.selectedAccount) ? <div>
                <div className="row">            
                    <div className="col-xs-12">
                        <div className="analytics-head">
                            <div className="analytics-head-left">
                                Twitter Overview
                            </div>
                            <div className="streams-default-container">
                                <div className="account-selection">
                                    <Select
                                        value={this.state.selectedAccount}
                                        onChange={this.handleAccountChange}
                                        options={this.props.channels.map(channel => {
                                            return {label: <ProfileChannel channel={channel} />, value: channel.id, type: channel.type}
                                        })}
                                    />
                                </div>        
                            </div> 
                            {/* <div className="analytics-head-right">
                                <DateRangePicker
                                    startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                                    startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                                    endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                                    endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                                    isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
                                    onDatesChange={({startDate, endDate}) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
                                    focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                                    onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                                    showDefaultInputIcon={true}
                                    onClose={({})=> this.onCalendarClose()}
                                />
                            </div>                    */}
                        </div>                        
                    </div>
                </div>
                <div className="row overview-cards-container mb20">
                    <div className="col-md-3 col-xs-12">
                        <TwitterOverviewCard 
                            name='Tweets' 
                            type="tweetsCount" 
                            description='tweets' 
                            tooltipDesc='Total tweets of your selected twitter account'
                            {...propData}/>               
                    </div>
                    <div className="col-md-3 col-xs-12">
                        <TwitterOverviewCard 
                            name='Followers' 
                            type="followersCount" 
                            description='followers'
                            tooltipDesc='Total followers of your selected twitter account'
                            {...propData}/>
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
                            {...propData}/>
                    </div>
                </div>
                {/* <div className="row mb20">
                    <div className="col-md-3 col-xs-12">
                        <TwiterPageOverviewCard 
                            name="Tweets by Account"  
                            type='tweetsCount'
                            description="Uniclix"
                            tooltipDesc='Number of your posts on your Twitter account'
                            {...propData}/>
                    </div>
                    <div className="col-md-9 col-xs-12">
                        <TweetsChart 
                            name="Tweets" 
                            type='tweetsChartData'
                            tooltipDesc='The number of tweets published from your Twitter accounts'
                            {...propData}/>
                    </div>
                </div>
                <div className="row mb20">
                    <div className="col-md-3 col-xs-12">
                        <TwiterPageOverviewCard 
                            name="Followers by Account"  
                            type='followersCount'
                            description="Uniclix"
                            tooltipDesc='Number of followers on your Twitter account'
                            {...propData}/>
                    </div>
                    <div className="col-md-9 col-xs-12">
                        <TweetsChart 
                            name="Followers" 
                            type='followersChartData'
                            tooltipDesc='The number of people who are following your Twitter accounts'
                            {...propData}/>
                    </div>
                </div>
                <div className="row mb20">
                    <div className="col-md-3 col-xs-12">
                        <TwitterEngagementCard 
                            name="Engagement by Type" 
                            type='engagementsByType'
                            tooltipDesc='The number of interactions received for the tweets published in the selected timeframe, broken down by retweets, replies and likes'
                            {...propData}/>
                    </div>
                    <div className="col-md-9 col-xs-12">
                        <TwitterEngagementChart 
                            name="Engagement by Type" 
                            type='engagementByTypeData'
                            tooltipDesc='The sum of interactions received for the tweets published in the selected timeframe: retweets, replies and likes'
                            {...propData}/>
                    </div>
                </div> */}
                <div className="row mb20">
                    <div className="col-xs-12">
                        <TweetsTable 
                            name="Tweets Table" 
                            type='tweetsTableData'
                            tooltipDesc='The list of tweets published by your Twitter account, with their engagement stats: retweets, replies and likes'
                            {...propData}/>
                    </div>
                </div>
                </div> : 
                <div>
                {this.state.forbidden ? 
                    <UpgradeIntro 
                        title="A simpler way to measure performance"
                        description = "Track your social growth, and get meaningful stats on your social media accounts."
                        infoData = {[
                            {
                                title: "Social Snapshot",
                                description: "Get a meaningful and concise snapshot of your key Twitter, Facebook, and LinkedIn activities."
                            },
                            {
                                title: "Engagement Metrics",
                                description: "Get a clear view of engagement for each of your social media accounts."
                            },
                            {
                                title: "Post Performance Metrics",
                                description: "Track engagement for all of your individual post in one platform."
                            }
                        ]}
                        image = "/images/analytic_intro.svg"
                        buttonLink = "/settings/billing"
                    /> :
                    
                        <SocialAccountsPrompt 
                            image = "/images/connect_twitter_accounts.svg"
                            title = "Prove the impact of your social media initiatives"
                            description = "Track your social growth, and get meaningful stats"
                            buttonTitle = "Connect your Twitter Account"
                            buttonLink = "/accounts/twitter"
                        />
                    }            
                </div>}
            </div>
        );
    }
}

const ProfileChannel = ({channel}) => (
    <div className="channel-container">
        <div className="profile-info pull-right">
            <span className="pull-left profile-img-container">
                <img src={channel.avatar}/>
                <i className={`fa fa-${channel.type} ${channel.type}_bg smallIcon`}></i>
            </span>
            <div className="pull-left"><p className="profile-name" title={channel.name}>{channel.name}</p>
            <p className="profile-username">{channel.username !== null ? "@"+channel.username : ""}</p>
            </div>
        </div>
    </div>
);

const mapStateToProps = (state) => {

    const twitterChannelsFilter = {selected: undefined, provider: "twitter", publishable: true};
    const channels = channelSelector(state.channels.list, twitterChannelsFilter);
    const selectedChannel = channelSelector(state.channels.list, { selected: 1, provider: "twitter" });

    return {
        channels,
        selectedChannel: selectedChannel.length ? selectedChannel[0] : {}
    };
};

export default connect(mapStateToProps)(TwitterOverview);