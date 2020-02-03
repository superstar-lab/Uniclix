import React from 'react';
import { connect } from "react-redux";
import channelSelector, { streamChannels } from "../../../selectors/channels";
import { startSetChannels } from "../../../actions/channels";
import { Typography, Button, withStyles } from '@material-ui/core';
import ReactTooltip from 'react-tooltip';
import Popup from "reactjs-popup";
import AccountSelector from '../../AccountSelector';

const ACCOUNT_SELECTOR_FILTERS = {
    'facebook': (account) => account.details.account_type !== 'profile'
};

const popupStyle = {
    width: 385,
    border: 0,
    borderRadius: 8,
    boxShadow: '(0, 0, 0, 0.2) 0px 1px 3px',
}

class MonitorRightbar extends React.Component {

    state = {
        isSelected: false,
        className: 'cardlist-firstbtn',
        selectedAccount: Object.entries(this.props.selectedChannel).length ?
            { label: <ProfileChannel channel={this.props.selectedChannel} />, value: this.props.selectedChannel.name, type: this.props.selectedChannel.type, id: this.props.selectedChannel.id } :
            (this.props.channels.length ?
                { label: <ProfileChannel channel={this.props.channels[0]} />, value: this.props.channels[0].name, type: this.props.channels[0].type, id: this.props.channels[0].id } : {}),
        creators: [],
    }

    componentWillMount() {
        this.setState({ creators: this.props.creators });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.creators != this.props.creators && this.props.creators != null) {
            this.setState({ creators: this.props.creators });
        }
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

    handleClick = () => {
        this.setState({ isSelected: false });
    }

    getAccountSelectorOptions = (selectedSocial) => {
        const { channels } = this.props;
        const socialMediaFilter = ACCOUNT_SELECTOR_FILTERS[selectedSocial];
        let options = channels.filter((account => account.type === selectedSocial));
        if (socialMediaFilter) {
            options = options.filter(socialMediaFilter);
        }
        return options;
    };

    render() {
        const {
            state: {
                isSelected,
                creators
            },
            props: {
                socialNetWorks,
                selectedSocial,
                onChangeSocial,
                onClickCreator,
                selectedAvatar,
                onAccountChange,
                selectedAccountId,
                accounts
            },
            handleMedia,
            handleItemCard,
        } = this;

        return (
            <div className="monitor-right-bar">
                {
                    isSelected &&
                    <div className="socialmedia-box">
                        {
                            socialNetWorks.map((content, key) => (
                                content == selectedSocial ? null : <Button key={key} onClick={() => { this.setState({ creators: [] }); onChangeSocial(content); this.handleClick(); }}><img src={`/images/monitor-icons/${content}-small.svg`} /></Button>
                            ))
                        }
                    </div>
                }
                <div>
                    <StylesButton className={this.state.className} onClick={() => handleMedia()}>
                        <img src={`/images/monitor-icons/${selectedSocial}-small.svg`} />
                    </StylesButton>
                    <Popup
                        modal
                        contentStyle={popupStyle}
                        trigger={
                            <div>
                                <StylesButton className="cardlist-secondbtn" data-for="account" data-tip data-event-off='scroll mousewheel blur' data-iscapture='true' onClick={() => this.handleClick()}>
                                    <img className="account-icon" src={`${selectedAvatar}`} />
                                </StylesButton>
                            </div>
                        }
                    >
                        {
                            close => (
                                <div className="account-modal">
                                    <div className="account-modal label">
                                        <span className="account-modal title">Select Account</span>
                                        <AccountSelector
                                            onChange={onAccountChange}
                                            value={selectedAccountId}
                                            accounts={accounts}
                                        />
                                    </div>
                                    <div className="account-modal button">
                                        <Button className="account-modal button title" onClick={close}>OK</Button>
                                    </div>
                                </div>
                            )
                        }
                    </Popup>
                    <ReactTooltip className="tooltipTheme" place="left" type="info" effect="solid" id="account">
                        <Typography className="cardlist-tooltiplabel">Select Account</Typography>
                    </ReactTooltip>
                </div>
                {
                    creators.map((item, key) => (
                        <div key={key}>
                            <StylesButton className="cardlist-secondbtn" onClick={() => { handleItemCard(); onClickCreator(item) }} data-for={item.value} data-tip data-iscapture='true' data-event-off='scroll mousewheel blur'>
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

const ProfileChannel = ({ channel }) => (
    <div className="channel-container">
        <div className="profile-info pull-right">
            <span className="pull-left profile-img-container">
                <img src={channel.avatar} />
                <i className={`fa fa-${channel.type} ${channel.type}_bg smallIcon`}></i>
            </span>
            <div className="pull-left"><p className="profile-name" title={channel.name}>{channel.name}</p>
                <p className="profile-username">{channel.username !== null ? "@" + channel.username : ""}</p>
            </div>
        </div>
    </div>
);

const mapStateToProps = (state) => {
    const selectedTwitterChannel = { selected: 1, provider: "twitter" };
    const selectedChannel = channelSelector(state.channels.list, selectedTwitterChannel);
    const channels = streamChannels(state.channels.list);

    return {
        channels,
        channelsLoading: state.channels.loading,
        selectedChannel: selectedChannel.length ? selectedChannel[0] : {}
    };
};

const mapDispatchToProps = (dispatch) => ({
    startSetChannels: () => dispatch(startSetChannels())
});

export default connect(mapStateToProps, mapDispatchToProps)(MonitorRightbar);
