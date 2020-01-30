import React from 'react';
import { connect } from "react-redux";
import channelSelector from "../../../selectors/channels";
import { startSetChannels } from "../../../actions/channels";
import { Typography, Button, withStyles } from '@material-ui/core';
import ReactTooltip from 'react-tooltip';

class MonitorRightbar extends React.Component {

    state = {
        isSelected: false,
        className: 'cardlist-firstbtn',
        selectedCards: [],
    }

    handleMedia = () => {
        let isSelected = !this.state.isSelected;

        if (isSelected) {
            this.setState({ className: 'cardlist-firstbtn active' });
        } else {
            this.setState({ className: 'cardlist-firstbtn' });
        }

        this.setState({ isSelected: isSelected });
    }

    handleItemCard = () => {

        this.setState({ className: 'cardlist-firstbtn' });
        this.setState({ isSelected: false });
    }

    render() {
        const {
            state: {

            },
            props: {
                creators,
                socialCards,
                socialValue,
                onClickCreator,
                onChangeSocial
            },
            handleMedia,
            handleItemCard,
        } = this;

        let socialMediaIcon;
        let isSelected = this.state.isSelected;

        if (socialValue == "Twitter") {
            socialMediaIcon = socialCards[0].icon;
        }
        else {
            socialMediaIcon = socialCards[1].icon;
        }

        return (
            <div className="monitor-right-bar">
                {isSelected &&
                    <div className="socialmedia-box">
                        {
                            socialCards.map((content, key) => (
                                content.title == socialValue ? null : <Button key={key} id={content.id} value={content.title} onClick={() => { onChangeSocial(content.title); handleItemCard(); }}><img src={content.icon} /></Button>
                            ))
                        }
                    </div>
                }
                <div>
                    <StylesButton className={this.state.className} onClick={() => handleMedia()}>
                        <img src={socialMediaIcon} />
                    </StylesButton>
                </div>
                {
                    creators.map((item, key) => (
                        <div key={key} onClick={() => { handleItemCard(); onClickCreator(item.title) }}>
                            <StylesButton className="cardlist-secondbtn" onClick={this.handleClick} data-for={item.id} data-tip data-event-off='scroll mousewheel blur' data-iscapture='true'>
                                <img src={item.icon} />
                            </StylesButton>
                            <ReactTooltip className="tooltipTheme" place="left" type="info" effect="solid" id={item.id} delayShow={100}>
                                <Typography className="cardlist-tooltiplabel">{item.title}</Typography>
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
