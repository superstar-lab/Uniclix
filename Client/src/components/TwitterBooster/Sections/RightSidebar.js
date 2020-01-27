import React from 'react';
import { connect } from "react-redux";
import channelSelector from "../../../selectors/channels";
import { startSetChannels } from "../../../actions/channels";
import { Container, Typography, Grid, Card, CardActions, CardContent, Button, Icon, Tooltip, withStyles} from '@material-ui/core';
import ReactTooltip from 'react-tooltip';


const Data = [
    {
        icon: "/images/monitor-icons/home-small.svg"
    },
    {
        icon: "/images/monitor-icons/mentions-small.svg"
    },
    {
        icon: "/images/monitor-icons/flag-small.svg"
    },
    {
        icon: "/images/monitor-icons/followers-small.svg"
    },
    {
        icon: "/images/monitor-icons/following-small.svg"
    },
    {
        icon: "/images/monitor-icons/liked-small.svg"
    },
    {
        icon: "/images/monitor-icons/message-small.svg"
    },
    {
        icon: "/images/monitor-icons/retweets-small.svg"
    },
    {
        icon: "/images/monitor-icons/myposts-small.svg"
    },
    {
        icon: "/images/monitor-icons/searchtopics-small.svg"
    },
]

const rightbar = {
    marginRight: -30,
    background: 'white',
    borderRadius: "20px 0px 0px 0px",
    marginLeft: "97%",
    width: "fit-content",
    minHeight: 637
}

const firstbtn = {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: "0px 50px 50px 0px",
}

const secondbtn = {
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: "0px 50px 50px 0px",
}

const tooltip = {
    fontFamily: 'Rubik',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: 14,
    textAlign: 'right',
    letterSpacing: 0.130517,
    /* UI/Primary/white */
    color: '#FFFFFF'
}

const StylesButton = withStyles(theme => ({
    root:{
        '&:hover':{
            background: "#EAF3FB"
        }
    }
}))(Button);

class RightSidebar extends React.Component {
    
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
        if(this.state.selectedSocialMedia == "Twitter"){
            socialMediaIcon = this.state.twitterIcon;
        }
        else {
            socialMediaIcon = this.state.facebookIcon;
        }
        return(
                <Grid
                    container
                    direction="column"
                    justify="flex-start"
                    alignItems="flex-start"
                    style={rightbar}
                >

                    
                    <Grid item style={{marginTop:15}}>
                        <StylesButton style={firstbtn} onClick={this.handleMedia} data-for='Tooltip' data-tip>
                            <img src={socialMediaIcon}/>
                        </StylesButton>
                    </Grid>
                    {Data.map((item) => (
                        <Grid item>
                            <StylesButton style={secondbtn} onClick={this.handleClick}>
                                <img src={item.icon}/>
                            </StylesButton>
                        </Grid>
                    ))}  
                    <ReactTooltip place="left" type="info" effect="solid" id="Tooltip" delayShow={100}>
                        <Typography style={tooltip}>Mentions</Typography>
                    </ReactTooltip>
                </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(RightSidebar);