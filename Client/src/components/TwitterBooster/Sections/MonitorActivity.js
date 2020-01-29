import React, { useState } from 'react';
import { connect } from "react-redux";
import channelSelector from "../../../selectors/channels";
import { startSetChannels } from "../../../actions/channels";
import 'react-dates/initialize';
import { Grid } from '@material-ui/core';
import { Select } from 'antd';
import Activities from './Activities';

const { Option } = Select;

class MonitorActivity extends React.Component {
    state = {
        hours: [
            "2 minutes",
            "5 minutes",
            "10 minutes",
            "1 hour",
            "2 hours"
        ],
        selectedHour: '',
    }

    componentWillMount() {
        this.setState({ selectedHour: this.state.hours[0] });
    }

    onChangeHour = (val) => {
        this.setState({ selectedHour: val });
    }

    getRefreshRate = () => {
        switch (this.state.selectedHour) {
            case "2 minutes":
                return 2;
            case "5 minutes":
                return 5;
            case "10 minutes":
                return 10;
            case "1 hour":
                return 60;
            case "2 hours":
                return 120;
        }
    }

    render() {
        const {
            state: {
                hours
            },
            getRefreshRate
        } = this;

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
                            <Select className="monitor-smalltitle" size="default" value={this.state.selectedHour} onChange={(val) => this.onChangeHour(val)}>
                                {hours.map((hour, key) => (
                                    <Option value={hour} key={key}>
                                        <span className="social-media-selector-option">{hour}</span>
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </Grid>
                </div>
                <div>

                    <Activities refreshRate={getRefreshRate()} />
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

