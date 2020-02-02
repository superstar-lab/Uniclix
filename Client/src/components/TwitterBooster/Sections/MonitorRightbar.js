import React from 'react';
import { connect } from "react-redux";
import channelSelector, { streamChannels } from "../../../selectors/channels";
import { startSetChannels } from "../../../actions/channels";
import { Typography, Button, withStyles } from '@material-ui/core';
import ReactTooltip from 'react-tooltip';

class MonitorRightbar extends React.Component {

    state = {
        isSelected: false,
        isAccountSelected: false,
        networkClassName: 'cardlist-firstbtn',
        accountClassName: 'cardlist-account',
        socialAccountAvatar: '',
    }

    handleMedia = () => {
        let isSelected = !this.state.isSelected;

        if (isSelected) {
            this.setState({ networkClassName: 'cardlist-firstbtn active' });
        } else {
            this.setState({ networkClassName: 'cardlist-firstbtn' });
        }

        this.setState({ isSelected: isSelected });
    }

    handleItemCard = () => {

        this.setState({ networkClassName: 'cardlist-firstbtn' });
        this.setState({ accountClassName: 'cardlist-account' });
        this.setState({ isSelected: false });
        this.setState({ isAccountSelected: false });
    }

    render() {
        const {
            state: {
                isSelected
            },
            props: {
                socialNetWorks,
                selectedSocial,
                creators,
                onChangeSocial,
                onClickCreator
            },
            handleMedia,
            handleItemCard,
        } = this;
        
        return (
            <div className="monitor-right-bar">
                {isSelected &&
                    <div className="socialmedia-box">
                        {
                            socialNetWorks.map((content, key) => (
                                content == selectedSocial ? null : <Button key={key} onClick={() => { onChangeSocial(content); handleItemCard(); }}><img src={`/images/monitor-icons/${content}-small.svg`} /></Button>
                            ))
                        }
                    </div>
                }
                <div>
                    <StylesButton className={this.state.networkClassName} onClick={() => handleMedia()}>
                        <img src={`/images/monitor-icons/${selectedSocial}-small.svg`} />
                    </StylesButton>
                </div>

                {
                    creators.map((item, key) => (
                        <div key={key} onClick={() => { handleItemCard(); onClickCreator(item) }}>
                            <StylesButton className="cardlist-secondbtn" onClick={this.handleClick} data-for={item.value} data-tip data-event-off='scroll mousewheel blur' data-iscapture='true'>
                                <img src={`/images/monitor-icons/${item.icon}-small.svg`} />
                            </StylesButton>
                            <ReactTooltip className="tooltipTheme" place="left" type="info" effect="solid" id={item.value}>
                                <Typography className="cardlist-tooltiplabel">{item.label}</Typography>
                            </ReactTooltip>
                        </div>
                    ))
                }
            </div>
        );
    }
}

const StylesButton = withStyles(theme => ({
    root: {
        '&:hover': {
            background: "#EAF3FB"
        },
        '&.active': {
            background: "#EAF3FB"
        }
    }
}))(Button);

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

export default connect(mapStateToProps, mapDispatchToProps)(MonitorRightbar);
