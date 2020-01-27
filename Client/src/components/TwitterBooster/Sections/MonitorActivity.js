import React, { useState } from 'react';
import { connect } from "react-redux";
import channelSelector from "../../../selectors/channels";
import { startSetChannels } from "../../../actions/channels";
import 'react-dates/initialize';
import Tabs from '../../Tabs';
import { Container, Typography, Grid } from '@material-ui/core';
import { Select } from 'antd';
import Dashboard from './Dashboard';
import RightSidebar from './RightSidebar'

const { Option } = Select;

const label = {
    marginTop: 30,
}

const spacing = {
    marginRight: 20
}

const smalltitle = {
    fontFamily: 'Rubik',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    letterSpacing: 0.130517,
    color: '#363636',
    width: 110
}

const rightspacing = {
    marginTop: -360,
}

const TwitterData = [
    {
        title: "Home", icon: "/images/monitor-icons/Feed.svg"
    },
    {
        title: "Mentions", icon: "/images/monitor-icons/Mentions.svg"
    },
    {
        title: "Retweets", icon: "/images/monitor-icons/Retweets.svg"
    },
    {
        title: "Followers", icon: "/images/monitor-icons/Followers.svg"
    },
    {
        title: "Following", icon: "/images/monitor-icons/Following.svg"
    },
    {
        title: "Liked", icon: "/images/monitor-icons/Liked.svg"
    },
    {
        title: "My posts", icon: "/images/monitor-icons/Myposts.svg"
    },
    {
        title: "Search topics", icon: "/images/monitor-icons/Searchtopics.svg"
    },
]

const FacebookData = [
    {
        title: "Time line", icon: "/images/monitor-icons/Feed.svg"
    },
    {
        title: "Mentions", icon: "/images/monitor-icons/Mentions.svg"
    },
    {
        title: "Unpublished", icon: "/images/monitor-icons/Retweets.svg"
    },
    {
        title: "Pages", icon: "/images/monitor-icons/Followers.svg"
    },
    {
        title: "Scheduled", icon: "/images/monitor-icons/Following.svg"
    },
    {
        title: "My posts", icon: "/images/monitor-icons/Liked.svg"
    },
    {
        title: "Messages", icon: "/images/monitor-icons/Myposts.svg"
    },
]

class MonitorActivity extends React.Component {
    state = {
        socialmedias : [
            "Twitter",
            "Facebook"
        ],
        hours : [
            "2 minutes",
            "5 minutes",
            "10 minutes",
            "1 hour",
            "2 hours"
        ],
        selectedHour: '',
        selectedSocialMedia: '',
    }

    componentWillMount() {
        this.setState({selectedHour: this.state.hours[0]});
        this.setState({selectedSocialMedia: this.state.socialmedias[0]});
    }

    onChangeHour = (val) => {
        this.setState({selectedHour: val});
    }

    onChangeSocialMedias = (val) => {
        this.setState({selectedSocialMedia: val});
    }

    render() {
   
        let socialmedias = this.state.socialmedias;
        let hours = this.state.hours;   
        let Data;
        if (this.state.selectedSocialMedia == "Twitter") {
            Data = TwitterData;
        } else {
            Data = FacebookData;
        }
        return (
            <div>
                <div className="section-header no-border mb-40">
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                    >
                        <Grid container item lg={9} md={7}>
                            <h2>Monitor Activity</h2>
                        </Grid>
                        <div style={{marginRight: 20}}>
                            <span>Refresh every</span>
                        </div>
                        <div >
                            <Select size="normal" value={this.state.selectedHour} onChange={this.onChangeHour} style={smalltitle} >
                                {hours.map((hour, key) => (
                                    <Option value={hour} key={key} onClick={this.onRefresh}>
                                        <span className="social-media-selector-option">{hour}</span>
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </Grid>
                </div>
                
                <Tabs>
                    <div label="New Tab">
                        <div style={label}>
                            <span style={spacing}>Social Network</span>
                            <Select size="normal" value={this.state.selectedSocialMedia} onChange={this.onChangeSocialMedias} style={smalltitle}>
                                {socialmedias.map((socialmedia) => (
                                    <Option value={socialmedia} >
                                        <span className="social-media-selector-option">{socialmedia}</span>
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <Grid container>
                            <Grid item md={9}>
                                <Dashboard type={Data}/>
                            </Grid>
                        </Grid>
                    </div>
                    <div label="+">
                        add new account( show tweets from another account )
                    </div>
                </Tabs>

                <div style={rightspacing}>
                    <RightSidebar />
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
        selectedChannel: selectedChannel.length ? selectedChannel[0] : {}
    };
};

const mapDispatchToProps = (dispatch) => ({
    startSetChannels: () => dispatch(startSetChannels())
});

export default connect(mapStateToProps, mapDispatchToProps)(MonitorActivity);

