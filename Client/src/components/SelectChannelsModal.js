import React from 'react';
import channelSelector from '../selectors/channels';
import { withRouter } from 'react-router';

class SelectChannelsModal extends React.Component{

    state = {
        twitterSelect: false,
        facebookSelect: false,
        linkedinSelect: false,
        pinterestSelect: false
    }

    componentDidMount() {
        const {channels} = this.props;
        const twitterChannels = channelSelector(channels, {selected: undefined, provider: "twitter"});
        const facebookChannels = channelSelector(channels, {selected: undefined, provider: "facebook"});
        const linkedinChannels = channelSelector(channels, {selected: undefined, provider: "linkedin"});
        const pinterestChannels = channelSelector(channels, {selected: undefined, provider: "pinterest"});

        if(twitterChannels.length > 0){
            this.toggleTwitterSelect();
        }else if(facebookChannels.length > 0){
            this.toggleFacebookSelect();
        }else if(linkedinChannels.length > 0){
            this.toggleLinkedinSelect();
        }else if(pinterestChannels.length > 0){
            this.togglePinterestSelect();
        }
    }

    toggleTwitterSelect = () => {
        this.setState(() => ({
            twitterSelect: !this.state.twitterSelect,
            pinterestSelect: false,
            facebookSelect: false,
            linkedinSelect: false
        }));
    };

    toggleFacebookSelect = () => {
        this.setState(() => ({
            facebookSelect: !this.state.facebookSelect,
            pinterestSelect: false,
            linkedinSelect: false,
            twitterSelect: false
        }));
    };

    toggleLinkedinSelect = () => {
        this.setState(() => ({
            linkedinSelect: !this.state.linkedinSelect,
            pinterestSelect: false,
            facebookSelect: false,
            twitterSelect: false
        }));
    };

    togglePinterestSelect = () => {
        this.setState(() => ({
            pinterestSelect: !this.state.pinterestSelect,
            linkedinSelect: false,
            facebookSelect: false,
            twitterSelect: false
        }));
    };

    onAddAccountsClick = () => {
        this.props.toggleComposer();
        this.props.toggle();
        return this.props.history.push(`/accounts`);
    };

    render(){

        const {channels, onChange, toggle, twitterSelectType = "radio"} = this.props;

        const twitterChannels = channelSelector(channels, {selected: undefined, provider: "twitter"});
        const facebookChannels = channelSelector(channels, {selected: undefined, provider: "facebook"});
        const linkedinChannels = channelSelector(channels, {selected: undefined, provider: "linkedin"});
        const pinterestChannels = channelSelector(channels, {selected: undefined, provider: "pinterest"});

        return (
            <div className="modal-content main-modal-style">
                <div className="modal-header-container">
                    <h3>Select social accounts</h3>
                    <button className="default-white-btn" onClick={this.onAddAccountsClick}><span className="cus-plus-icon">+</span> Add accounts</button>
                </div>
                
                <div className="modal-body scrollable-400 scrollbar">

                    <div className="modal-menu col-md-4">

                        <ul>
                            {!!twitterChannels.length &&
                                <li onClick={this.toggleTwitterSelect} className={this.state.twitterSelect && 'selected'}>
                                 <i className="fab fa-twitter twitter_color"> </i> <p>Twitter</p>
                                </li>
                            }

                            {!!facebookChannels.length &&
                                <li onClick={this.toggleFacebookSelect} className={this.state.facebookSelect && 'selected'}>
                                <i className="fab fa-facebook facebook_color"> </i> Facebook
                                </li>
                            }

                            {!!linkedinChannels.length &&
                                <li onClick={this.toggleLinkedinSelect} className={this.state.linkedinSelect && 'selected'}>
                                <i className="fab fa-linkedin linkedin_color"> </i> Linkedin
                                </li>
                            }

                            {!!pinterestChannels.length &&
                                <li onClick={this.togglePinterestSelect} className={this.state.pinterestSelect && 'selected'}>
                                <i className="fab fa-pinterest pinterest_color"> </i> Pinterest
                                </li>
                            }
                            
                        </ul>
                    </div>
                    <div className="modal-results col-md-8">
                        {!!twitterChannels.length && this.state.twitterSelect &&
                        
                            twitterChannels.map((channel) => (
                                <div className={`channel-selection-container ${channel.selected && 'selected'}` }>
                                    <label key={channel.id} className="channel-item selection-container">
                                        <input type={twitterSelectType} onChange={() => onChange(channel)} defaultChecked={channel.selected ? "checked" : ""} name="twitter_channel" />
                                        <span className={`checkmark ${twitterSelectType == 'radio' ? 'round' : ''}`}></span>
                                        <img className="avatar-box" onError={(e) => e.target.src='/images/dummy_profile.png'} src={channel.avatar} /> {channel.name}
                                    </label>
                                </div>    
                            )
                        )}

                        {!!facebookChannels.length && this.state.facebookSelect &&
                        
                            facebookChannels.map((channel) => (
                                <div className={`channel-selection-container ${channel.selected && 'selected'}` }>
                                    <label key={channel.id} className="channel-item selection-container">
                                        <input type="checkbox" onChange={() => onChange(channel)} defaultChecked={channel.selected ? "checked" : ""} name="facebook_channel" />
                                        <span className="checkmark"></span>
                                        <img className="avatar-box" onError={(e) => e.target.src='/images/dummy_profile.png'} src={channel.avatar} /> {channel.name}
                                    </label>
                                </div>    
                            )
                        )}

                        {!!linkedinChannels.length && this.state.linkedinSelect &&
                        
                            linkedinChannels.map((channel) => (
                                <div className={`channel-selection-container ${channel.selected && 'selected'}` }>
                                    <label key={channel.id} className="channel-item selection-container">
                                        <input type="checkbox" onChange={() => onChange(channel)} defaultChecked={channel.selected ? "checked" : ""} name="linkedin_channel" />
                                        <span className="checkmark"></span>
                                        <img className="avatar-box" onError={(e) => e.target.src='/images/dummy_profile.png'} src={channel.avatar} /> {channel.name}
                                    </label>
                                </div>    
                            )
                        )}

                        {!!pinterestChannels.length &&                                                                                                                                                                          this.state.pinterestSelect &&
                            
                            pinterestChannels.map((channel) => (
                                <div className={`channel-selection-container ${channel.selected && 'selected'}` }>
                                    <label key={channel.id} className="channel-item selection-container">
                                        <input type="checkbox" onChange={() => onChange(channel)} defaultChecked={channel.selected ? "checked" : ""} name="pinterest_channel" />
                                        <span className="checkmark"></span>
                                        <img className="avatar-box" onError={(e) => e.target.src='/images/dummy_profile.png'} src={channel.avatar} /> {channel.name}
                                    </label>
                                </div>
                            )
                        )}
                    </div>
                </div>
        
                <div className="modal-footer">
                    <div onClick={toggle}>
                        <button className="magento-btn small-btn">Done</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(SelectChannelsModal);