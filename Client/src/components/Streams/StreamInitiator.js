import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import channelSelector, { streamChannels } from '../../selectors/channels';
import { startSetChannels } from "../../actions/channels";
import { addStream } from '../../requests/streams';
import StreamCreator from './StreamCreator';
import StreamCreators from "../TwitterBooster/Sections/StreamCreators";
import AutoCompleteSearch from '../AutoCompleteSearch';
import getSocialMediaCards from '../../config/socialmediacards';
import { Grid } from '@material-ui/core';
import AccountSelector from '../../components/AccountSelector';
import SocialMediaSelector from '../../components/SocialMediaSelector';

const ACCOUNT_SELECTOR_FILTERS = {
    'facebook': (account) => account.details.account_type !== 'profile'
};
class StreamInitiator extends React.Component {

    state = {
        selectedAccount: Object.entries(this.props.selectedChannel).length ?
            { label: <ProfileChannel channel={this.props.selectedChannel} />, value: this.props.selectedChannel.name, type: this.props.selectedChannel.type, id: this.props.selectedChannel.id } :
            (this.props.channels.length ?
                { label: <ProfileChannel channel={this.props.channels[0]} />, value: this.props.channels[0].name, type: this.props.channels[0].type, id: this.props.channels[0].id } : {}),
        selectedAccountId: '',
        loading: false,
        searchModal: false,
        autoCompleteSearchModal: false,
        searchTerm: "",
        socialMediaCards: {},
        selectedSocial: '',
        socialMediasSelectorOptions: [],
        streamIcons: [],
        streamCreator: this.props.streamCreator ? this.props.streamCreator : false
    }

    //Set the default state value
    componentWillMount() {
        let socialMediaCards = getSocialMediaCards();
        let socialMediasSelectorOptions = [];
        this.props.channels.forEach(({ type, id }) => {
            // Getting the options for the socialMedia dropdown
            if (socialMediasSelectorOptions.indexOf(type) === -1) {
                socialMediasSelectorOptions.push(type);
            }
        });
        this.setState({socialMediasSelectorOptions: socialMediasSelectorOptions});
        // Check length of social network list
        if (socialMediasSelectorOptions.length <= 0)
            return ;

        let selectedSocial = socialMediasSelectorOptions[0];
        this.setState({selectedSocial: selectedSocial});
        this.setState({ socialMediaCards: socialMediaCards });
        let streamIcons = socialMediaCards[selectedSocial];
        this.setState({ streamIcons: streamIcons});
        const accountSelectorOptions = this.getAccountSelectorOptions(selectedSocial);
        let selectedAccountId = accountSelectorOptions[0].id;
        let selectedAccount = accountSelectorOptions.find((item) => item.id === selectedAccountId);
        this.setState({ selectedAccount: selectedAccount });
        this.setState({ selectedAccountId: selectedAccountId });
        
        this.props.onChangeSocial(selectedSocial);
        this.props.onChangeAccount(selectedAccountId);
    }
    
    //Function to add stream
    submitStream = (item) => {
        this.setState(() => ({
            loading: true
        }));

        const channelId = this.state.selectedAccount.id;
        const network = this.state.selectedAccount.type;
        const selectedTab = this.props.selectedTab;
        const searchTerm = this.state.searchTerm;

        return addStream(item, channelId, selectedTab, network, searchTerm).then(() => this.props.reload()).then(() => {
            if (typeof this.props.close !== "undefined") this.props.close();
        });
    };

    handleTypeClick = (item) => {
        const {selectedAccount} = this.state;
        let input = item;
        if(item.value === "keywords"){
            if(selectedAccount.type == "facebook"){
                this.toggleAutoCompleteSearchModal();
                return;
            }else if(selectedAccount.type == "twitter"){
                this.toggleSearchModal();
                return;
            }
        }  
        
        this.submitStream(input);
    }

    handleSearchInputChange = (event) => {

        try {
            const value = event.target.value;
            this.setState(() => (
                { searchTerm: value }
            ));
        } catch (e) { }
    }

    toggleSearchModal = () => {
        this.setState(() => ({
            searchModal: !this.state.searchModal
        }), () => {
            if (!this.state.searchModal && this.state.searchTerm !== "") {
                this.submitStream({ label: "Search", value: "search", icon: "search" });
            }
        });
    };

    toggleAutoCompleteSearchModal = () => {
        this.setState(() => ({
            autoCompleteSearchModal: !this.state.autoCompleteSearchModal
        }), () => {
            if (!this.state.autoCompleteSearchModal && this.state.searchTerm !== "") {
                this.submitStream({ label: "Pages", value: "pages", icon: "flag" });
            }
        });
    };

    setAutoCompleteSelected = (value) => {
        this.setState(() => ({
            searchTerm: value
        }));
    };

    //Function to get social network type by value
    onSocialMediaChange = (selectedSocial) => {
        this.setState({ selectedSocial: selectedSocial});        
        let socialMediaCards = this.state.socialMediaCards;
        let streamIcons = socialMediaCards[selectedSocial];
        this.setState({streamIcons: streamIcons});
        let accounts = this.getAccountSelectorOptions(selectedSocial);                
        this.setState({selectedAccount: accounts[0]});
        this.setState({selectedAccountId: accounts[0].id});
        this.props.onChangeSocial(selectedSocial);
        this.props.onChangeAccount(accounts[0].id);
    };

    //Function to set account by selectedAccountId
    onAccountChange = (selectedAccountId) => {        
        this.props.onChangeAccount(selectedAccountId);
        let selectedAccount = this.props.channels.find((item) => item.id === selectedAccountId);
        if (selectedAccount) {
            this.setState({selectedAccount: selectedAccount});
            this.setState({selectedAccountId: selectedAccountId});
        }
    };

    //Function to get account option object
    getAccountSelectorOptions = (selectedSocial) => {
        const { channels } = this.props;
        const socialMediaFilter = ACCOUNT_SELECTOR_FILTERS[selectedSocial];
        let options = channels.filter((account => account.type === selectedSocial));
        if (socialMediaFilter) {
            options = options.filter(socialMediaFilter);
        }
        return options;
    };

    //Function to send add stream request when button click event occurs
    onClickCreator = (item) => {
        let input;
        if(item.value == 'search' || item.value == 'pages'){
            input = {label: 'Search Keywords', value: 'keywords'};
            this.handleTypeClick(input);
            return;
        } else {
            this.handleTypeClick(item);
        }
    }

    toggleStreamCreator = () => {
        this.setState(() => ({
            streamCreator: !this.state.streamCreator
        }));
    };

    render() {
        const { selectedSocial, selectedAccountId, socialMediasSelectorOptions } = this.state;
        return (
            <div>
                <Modal isOpen={!!this.state.searchModal} ariaHideApp={false} className="stream-type-modal search-modal">
                    <div>
                        <input type="text" onChange={e => this.handleSearchInputChange(e)} value={this.state.searchTerm} placeholder="Example: coca cola or #fashion" />
                        <button onClick={this.toggleSearchModal} className="publish-btn-group gradient-background-teal-blue link-cursor">Done</button>
                    </div>
                </Modal>

                <Modal isOpen={!!this.state.autoCompleteSearchModal} ariaHideApp={false} className="stream-type-modal search-modal">
                    <div>
                        <AutoCompleteSearch placeholder="Type a page name..." channelId={selectedAccountId} setSelected={this.setAutoCompleteSelected} />
                        <button onClick={this.toggleAutoCompleteSearchModal} className="publish-btn-group autocomplete-done gradient-background-teal-blue link-cursor">Done</button>
                    </div>
                </Modal>

                <div className="monitor-label">
                    <span className="monitor-spacing">Social Network</span>
                    <div className="monitor-right-spacing">
                        <SocialMediaSelector
                            socialMedias={socialMediasSelectorOptions}
                            value={selectedSocial}
                            onChange={this.onSocialMediaChange}
                        />
                    </div>
                    <span className="monitor-spacing">Users</span>
                    <div className="monitor-right-spacing">
                        <AccountSelector
                            onChange={this.onAccountChange}
                            value={selectedAccountId}
                            accounts={this.getAccountSelectorOptions(selectedSocial)}
                        />
                    </div>
                </div>

                <Grid container>
                    <Grid item md={9}>
                        <StreamCreators
                            creators={this.state.streamIcons}
                            onClickCreator={this.onClickCreator}
                        />
                    </Grid>
                </Grid>
            </div>

        )
    }
}

export const StreamFeedItemPlaceholder = () => (
    <div>
        <div className="profile-placeholder">
            <div className="profile-image-placeholder"></div>
            <div className="profile-text-placeholder">
                <div></div>
                <div></div>
            </div>
        </div>

        <div className="text-placeholder">
            <div></div>
            <div></div>
            <div></div>
        </div>

        <div className="iconx-placeholder">
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
);

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
    const channels = streamChannels(state.channels.list);
    const selectedChannel = channelSelector(channels, { selected: 1 });

    return {
        channels,
        selectedChannel: selectedChannel.length ? selectedChannel[0] : {},
    }
}

const mapDispatchToProps = (dispatch) => ({
    startSetChannels: () => dispatch(startSetChannels())
});

export default connect(mapStateToProps, mapDispatchToProps)(StreamInitiator);