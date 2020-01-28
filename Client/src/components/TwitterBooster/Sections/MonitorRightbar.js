import React from 'react';
import { connect } from "react-redux";
import channelSelector from "../../../selectors/channels";
import { startSetChannels } from "../../../actions/channels";
import { Container, Typography, Grid, Card, CardActions, CardContent, Button, Icon, Tooltip, withStyles} from '@material-ui/core';
import ReactTooltip from 'react-tooltip';
import getSocialMediaCards from '../../../config/socialmediacards';

class MonitorRightbar extends React.Component {
    
    state = {
        socialmedias : [
            "Twitter",
            "Facebook"
        ],
        selectedSocialMedia: 'Twitter',
        twitterIcon: "/images/monitor-icons/twitter-small.svg",
        facebookIcon: "/images/monitor-icons/facebook-small.svg",
        isSelected: false,
        isEntered: false
    }

    handleMedia = () => {
        this.setState({isSelected: !this.state.isSelected});
        console.log(this.state.isSelected);
    }
    
    handleClick = (e) => {
        console.log(e.target.value);
    }

    render() {
        
        let socialMediaIcon;

        let data = getSocialMediaCards();
        
        if(this.state.selectedSocialMedia == "Twitter"){
            socialMediaIcon = this.state.twitterIcon;
        }
        else {
            socialMediaIcon = this.state.facebookIcon;
        }
        
        return(
            <Grid
                className="cardlist-rightbar"
                container
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
            >
                <Grid item className="cardlist-gridtopspacing">
                    <StylesButton className="cardlist-firstbtn" onClick={this.handleMedia}>
                        <img src={socialMediaIcon}/>
                    </StylesButton>
                </Grid>
                {data.twitterSmallIcons.map((item) => (
                    <Grid item>
                        <StylesButton className="cardlist-secondbtn" onClick={this.handleClick} data-for={item.id} data-tip>
                            <img src={item.icon}/>
                        </StylesButton>
                        <ReactTooltip className="tooltipTheme" place="left" type="info" effect="solid" id={item.id} delayShow={100}>
                            <Typography className="cardlist-tooltiplabel">{item.label}</Typography>
                        </ReactTooltip>
                    </Grid>
                ))}
            </Grid>
        );
    }
}    

const StylesButton = withStyles(theme => ({
    root:{
        '&:hover':{
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