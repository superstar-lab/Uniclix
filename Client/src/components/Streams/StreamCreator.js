import React from 'react';
import {connect} from 'react-redux';
import Select from 'react-select';
import Modal from 'react-modal';
import channelSelector, {streamChannels} from '../../selectors/channels';
import streamTypes from './StreamTypesFixture';
import {addStream} from '../../requests/streams';
import Loader from '../Loader';
import {isEmptyObject} from '../../utils/helpers';
import AutoCompleteSearch from '../AutoCompleteSearch';
import SocialAccountsPrompt from '../SocialAccountsPrompt';

class StreamCreator extends React.Component{

    state = {
        selectedAccount:  Object.entries(this.props.selectedChannel).length ? 
        {label: <ProfileChannel channel={this.props.selectedChannel} />, value: this.props.selectedChannel.name, type: this.props.selectedChannel.type, id: this.props.selectedChannel.id} : 
        (this.props.channels.length ? 
          {label: <ProfileChannel channel={this.props.channels[0]} />, value: this.props.channels[0].name, type: this.props.channels[0].type, id: this.props.channels[0].id} : {}),
        loading: false,
        searchModal: false,
        autoCompleteSearchModal: false,
        searchTerm: "",
        verticalDisplay: this.props.verticalDisplay ? this.props.verticalDisplay : false,
        defaultItem: this.props.defaultItem ? this.props.defaultItem : false
    }

    handleAccountChange = (selectedAccount) => {
        this.setState(() => ({
            selectedAccount
        }));
    };

    submitStream = (item) => {

        this.setState(() => ({
            loading: true
        }));

        const channelId = this.state.selectedAccount.id;
        const network = this.state.selectedAccount.type;
        const selectedTab = this.props.selectedTab;
        const searchTerm = this.state.searchTerm;

        return addStream(item, channelId, selectedTab, network, searchTerm).then(() => this.props.reload()).then(() => {
            this.setState(() => ({
                loading: false
            }));
           if(typeof this.props.close !== "undefined") this.props.close();
        });
    };

    handleTypeClick = (item) => {
        const {selectedAccount} = this.state;
        let input = item;
        if(item.value == "myPostsMentions"){
            if(selectedAccount.type == "facebook"){
                input =  {label: "My Posts", value: "myPosts"} 
            }else if(selectedAccount.type == "twitter"){
                input = {label: "My Tweets", value: "tweets"};
            }

            this.submitStream(input).then(response => {
                input = {label: "Mentions", value: "mentions"};
                this.submitStream(input);
            });

            return;
        }
        else if(item.value === "keywords"){
            if(selectedAccount.type == "facebook"){
                this.toggleAutoCompleteSearchModal();
                return;
            }else if(selectedAccount.type == "twitter"){
                this.toggleSearchModal();
                return;
            }
        }else if(item.value === "browse"){
            this.toggleStreamCreator();
            return;
        } 

        if(item.value === "search"){
            this.toggleSearchModal();
            return;
        }else if(item.value === "pages"){
            this.toggleAutoCompleteSearchModal();
            return;
        }

        this.submitStream(input);
    }

    handleSearchInputChange = (event) => {

        try{
            const value = event.target.value;
            this.setState(() => (
                {searchTerm: value}
            ));
        }catch(e){}
    } 

    toggleSearchModal = () => {
        this.setState(() => ({
            searchModal: !this.state.searchModal
        }), () => {
            if(!this.state.searchModal && this.state.searchTerm !== ""){
                this.submitStream({label: "Search", value: "search", icon: "search"});
            }
        });
    };

    toggleAutoCompleteSearchModal = () => {
        this.setState(() => ({
            autoCompleteSearchModal: !this.state.autoCompleteSearchModal
        }), () => {
            if(!this.state.autoCompleteSearchModal && this.state.searchTerm !== ""){
                this.submitStream({label: "Pages", value: "pages", icon: "flag"});
            }
        });
    };

    setAutoCompleteSelected = (value) => {
        this.setState(() => ({
            searchTerm: value
        }));
    };


    render(){
        return (this.state.loading ? <Loader /> : 
                isEmptyObject(this.state.selectedAccount) || typeof(this.state.selectedAccount) === "undefined" ? 
                    <div className="streams-default-container">
                        <div className="p20">
                            <SocialAccountsPrompt 
                                image = "/images/connect_linkedin_accounts.svg"
                                title = "Prove the impact of your social media initiatives"
                                description = "Track your social growth, and get meaningful stats"
                                buttonTitle = "Connect your Social Accounts"
                                buttonLink = "/accounts"
                            />
                        </div>  
                    </div>
                    :
                    <div className={`streams-default-container ${this.state.verticalDisplay && 'streams-default-container-new'}`}>

                    <Modal isOpen={!!this.state.searchModal} ariaHideApp={false} className="stream-type-modal search-modal">
                        <div>
                            <input type="text" onChange={e => this.handleSearchInputChange(e)} value={this.state.searchTerm} placeholder="Example: coca cola or #fashion"/>
                            <button onClick={this.toggleSearchModal} className="publish-btn-group gradient-background-teal-blue link-cursor">Done</button>
                        </div>
                    </Modal>

                    <Modal isOpen={!!this.state.autoCompleteSearchModal} ariaHideApp={false} className="stream-type-modal search-modal">
                        <div>
                            <AutoCompleteSearch placeholder="Type a page name..." channelId={this.state.selectedAccount.id} setSelected={this.setAutoCompleteSelected}/>
                            <button onClick={this.toggleAutoCompleteSearchModal} className="publish-btn-group autocomplete-done gradient-background-teal-blue link-cursor">Done</button>
                        </div>
                    </Modal>

                    <div className="account-selection">
                        <Select
                            value={this.state.selectedAccount}
                            onChange={this.handleAccountChange}
                            options={this.props.channels.map(channel => {
                                return {label: <ProfileChannel channel={channel} />, value: channel.name, type: channel.type, id: channel.id}
                            })}
                        />
                    </div>
                    <div className={`streams-default ${this.state.verticalDisplay && 'streams-default-new'}`}>
                            
                        {!this.state.defaultItem ? 
                            (streamTypes[this.state.selectedAccount.type]).map((item, index) => (
                            <div key={index} className="selection-item" onClick={(e) => this.handleTypeClick(item)}>
                                <i className={`fa fa-${item.icon}`}></i>
                                <span>{item.label}</span>
                            </div>
                        ))
                        : <button className="magento-btn" onClick={() => this.handleTypeClick(this.state.defaultItem)}>Create Stream</button>
                        }

                    </div>
                    {typeof this.props.close !== "undefined" && 
                    <div className="txt-center p10">
                            <p onClick={this.props.close} className="link-cursor">Cancel</p>
                    </div>}
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
    const channels = streamChannels(state.channels.list);
    const selectedChannel = channelSelector(channels, {selected: 1});
    
    return {
        channels,
        selectedChannel: selectedChannel.length ? selectedChannel[0] : {}
    }
}


export default connect(mapStateToProps)(StreamCreator);