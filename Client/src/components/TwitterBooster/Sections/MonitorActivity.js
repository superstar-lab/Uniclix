import React, { useState } from 'react';
import { connect } from "react-redux";
import channelSelector from "../../../selectors/channels";
import { startSetChannels } from "../../../actions/channels";
import 'react-dates/initialize';
import Tabs from '../../Tabs';
import { Container, Typography, Grid } from '@material-ui/core';
import { Select } from 'antd';
import StreamCreators from './StreamCreators'
import MonitorRightbar from './MonitorRightbar'
import getSocialMediaCards from '../../../config/socialmediacards';

const { Option } = Select;

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
        let data;
        let cardlists = getSocialMediaCards();
        if (this.state.selectedSocialMedia == "Twitter") {
            data = cardlists.twitterBigIcons;
        } else {
            data = cardlists.facebookBigIcons;
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
                        <div className="monitor-refresh-btn">
                            <span>Refresh every</span>
                        </div>
                        <div >
                            <Select className="monitor-smalltitle" size="normal" value={this.state.selectedHour} onChange={this.onChangeHour}>
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
                        <div className="monitor-label">
                            <span className="monitor-spacing">Social Network</span>
                            <Select className="monitor-smalltitle" size="normal" value={this.state.selectedSocialMedia} onChange={this.onChangeSocialMedias}>
                                {socialmedias.map((socialmedia) => (
                                    <Option value={socialmedia} >
                                        <span className="social-media-selector-option">{socialmedia}</span>
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <Grid container>
                            <Grid item md={9}>
                                <StreamCreators type={data}/>
                            </Grid>
                        </Grid>
                    </div>
                    <div label="+">
                        add new account( show tweets from another account )
                    </div>
                </Tabs>

                <Grid className="monitor-rightspacing" container>
                    <MonitorRightbar />
                </Grid>
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

