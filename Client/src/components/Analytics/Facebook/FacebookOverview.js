import React from 'react';
import {connect} from 'react-redux';
import 'react-dates/initialize';
import moment from 'moment';
import OverviewCard from './Cards/OverviewCard';
import PageOverviewCard from './Cards/PageOverviewCard';
import PostsChart from './Cards/PostsChart';
import EngagementCard from './Cards/EngagementCard';
import EngagementChart from './Cards/EngagementChart';
import PostsTable from './Cards/PostsTable';
import { DateRangePicker } from 'react-dates';
import { isInclusivelyBeforeDay } from 'react-dates';
import UpgradeIntro from '../../UpgradeIntro';
import SocialAccountsPrompt from '../../SocialAccountsPrompt';
import channelSelector, {channelById} from '../../../selectors/channels';
import Select from 'react-select';
import { isEmptyObject } from '../../../utils/helpers';

class FacebookOverview extends React.Component {

    state = {
        startDate: moment().subtract(30, 'days'),
        endDate: moment().add(1, 'days'),
        selectedAccount: Object.entries(this.props.selectedChannel).length ? 
        {label: <ProfileChannel channel={this.props.selectedChannel} />, value: this.props.selectedChannel.id, type: this.props.selectedChannel.type} : 
        (this.props.channels.length ? 
          {label: <ProfileChannel channel={this.props.channels[0]} />, value: this.props.channels[0].id, type: this.props.channels[0].type} : {}),
        loading: false,
        forbidden: false,
        calendarChange: false,
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
                                Facebook Overview
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
                            <div className="analytics-head-right">
                                <DateRangePicker
                                    startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                                    startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                                    endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                                    endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                                    isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
                                    onDatesChange={({startDate, endDate}) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
                                    focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                                    onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
                                    onClose={({})=> this.onCalendarClose()}
                                />
                            </div>                   
                        </div>                        
                    </div>
                </div>
                <div className="row overview-cards-container mb20">
                    <div className="col-md-3 col-xs-12">
                        <OverviewCard 
                            name='Posts' 
                            type="postsCount" 
                            description='posts' 
                            tooltipDesc='The total number of posts that have been published on your Pages'
                            {...propData}/>
                    </div>
                    <div className="col-md-3 col-xs-12">
                        <OverviewCard 
                            name='Fans' 
                            type="fansCount"
                            description='fans'
                            tooltipDesc='The total number of fans (people who liked the Page) for your Page'
                            {...propData} />
                    </div>
                    <div className="col-md-3 col-xs-12">
                        <OverviewCard 
                            name='Engagement'
                            type='engagementsCount' 
                            description='engagements'
                            tooltipDesc='The sum of reactions, comments and shares recieved by content of your Pages (for the selected timeframe)'
                            {...propData} />
                    </div>
                    <div className="col-md-3 col-xs-12">
                        <OverviewCard 
                            name='Impressions' 
                            type='impressionsCount'
                            description='impressions'
                            tooltipDesc="The number of times any content from your Page or about your Page entered a person' s screen. This includes posts, check-ins, ads, social information from people who interact with your Page and more. (Total Count)"
                            description='impressions'
                            {...propData} />
                    </div>
                </div>
                <div className="row mb20">
                    <div className="col-md-3 col-xs-12">
                        <PageOverviewCard 
                            name="Posts by Page"  
                            type='postsCount'
                            description="Uniclix"
                            tooltipDesc='Number of posts and Page'
                            {...propData}/>
                    </div>
                    <div className="col-md-9 col-xs-12">
                        <PostsChart 
                            name="Posts" 
                            type='postsChartData'
                            tooltipDesc='The total number of posts that have been published on your Pages'
                            {...propData}/>
                    </div>
                </div>
                <div className="row mb20">
                    <div className="col-md-3 col-xs-12">
                        <PageOverviewCard 
                            name="Fans by Page" 
                            type='fansCount'
                            description="Uniclix"
                            tooltipDesc='Number of fans on selected timeframe'
                            {...propData}/>
                    </div>
                    <div className="col-md-9 col-xs-12">
                        <PostsChart 
                            name="Fans" 
                            type='fansChartData'
                            tooltipDesc='The total number of fans(people who liked the Page) for your Page'
                            {...propData}/>
                    </div>
                </div>
                <div className="row mb20">
                    <div className="col-md-3 col-xs-12">
                        <EngagementCard 
                            name="Engagement by Type" 
                            type='engagementsByType'
                            tooltipDesc='The number of interactions received for content of your Page, broken down by reactions, comments and shares.'
                            {...propData}/>
                    </div>
                    <div className="col-md-9 col-xs-12">
                        <EngagementChart 
                            name="Engagement by Type" 
                            type='engagementByTypeData'
                            tooltipDesc='The number of interactions received for content associated with your Page, broken down by reactions, comments and shares.'
                            {...propData}/>
                    </div>
                </div>
                <div className="row mb20">
                    <div className="col-xs-12">
                        <PostsTable 
                            name="Posts Table" 
                            type='postsData'
                            tooltipDesc='The list of posts published by your Page, with their engagement stats: reactions, comments and shares'
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
                            image = "/images/connect_facebook_pages.svg"
                            title = "Prove the impact of your social media initiatives"
                            description = "Track your social growth, and get meaningful stats"
                            buttonTitle = "Connect your Facebook Pages"
                            buttonLink = "/accounts/facebook"
                        />
                    }                 
                </div>
                }
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

    const facebookChannelsFilter = { selected: undefined, provider: "facebook", publishable: true };
    const channels = channelSelector(state.channels.list, facebookChannelsFilter);
    const selectedChannel = channelSelector(state.channels.list, { selected: 1, provider: "facebook", publishable: true });

    return {
        channels,
        selectedChannel: selectedChannel.length ? selectedChannel[0] : {}
    };
};

export default connect(mapStateToProps)(FacebookOverview);