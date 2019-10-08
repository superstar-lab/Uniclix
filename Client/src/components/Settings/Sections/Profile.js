import React from 'react';
import { connect } from "react-redux";
import Modal from "react-modal";
import GeoSuggest from "react-geosuggest";
import {updateProfile} from "../../../requests/profile";
import momentTz from "moment-timezone";
import TimezoneSelectOptions from '../Fixtures/TimezoneOptions';
import {validateEmail, validateUrl} from "../../../utils/validator";
import {startSetProfile} from "../../../actions/profile";
import {LoaderWithOverlay} from "../../Loader";

class Profile extends React.Component{

    state = {
        name: "",
        email: "",
        website: "",
        organizationName: "",
        reason: "",
        topics: [],
        topic: "",
        locations: [],
        location: "",
        timezone: "",
        isTopicsModalOpen: false,
        isLocationsModalOpen: false,
        error: false,
        success: false,
        loading: false
    };

    componentDidMount(){
        this.initializeProfileData();
    }

    initializeProfileData = () => {
        if(this.props.profile){
            const user = this.props.profile.user;
            const topics = this.props.profile.topics;
            const locations = this.props.profile.locations;

            let stateCopy = Object.assign({}, this.state);
            stateCopy["name"] = user.name ? user.name : "";
            stateCopy["email"] = user.email ? user.email : "";
            stateCopy["website"] = user.website ? user.website : "";
            stateCopy["organizationName"] = user.organization_name ? user.organization_name : "";
            stateCopy["reason"] = user.usage_reason ? user.usage_reason : "Myself";
            stateCopy["topics"] = topics.map((topic) => topic.topic);
            stateCopy["locations"] = locations.map((location) => {
                if(location){
                    location = JSON.parse(location.location);
                    return location;
                }
            });

            stateCopy["timezone"] = user.timezone ? user.timezone : momentTz.tz.guess();

            this.setState(() => (stateCopy));
        }
    };

    toggleTopicsModal = (e) => {
        e.preventDefault();
        this.setState(() => ({
            isTopicsModalOpen: !this.state.isTopicsModalOpen
        }));
    };

    onTopicsFieldChange = (topic) => {
        this.setState(() => ({
            topic
        }));
    };

    onLocationsFieldChange = (location) => {
        console.log(location);
        this.setState(() => ({
            location
        }));
    };

    onFieldChange = (e) => {
        const id = e.target.id;
        let state = Object.assign({}, this.state);
        state[id] = e.target.value;
        this.setState(() => (state));
    };

    onSubmit = (e) => {
        e.preventDefault();

        this.setState(() => ({
            error: false
        }));

        if(!validateEmail(this.state.email) || this.state.email === ""){
            this.setState(() => ({
                error: "Please fix the email!",
                loading: false
            }));

            return;
        }

        if(this.state.website !== "" && !validateUrl(this.state.website)){
            this.setState(() => ({
                error: "Please fix the website url!",
                loading: false
            }));

            return;
        }

        if(this.state.name === ""){
            this.setState(() => ({
                error: "Name can't be empty!",
                loading: false
            }));

            return;
        }

        this.setState(() => ({
            loading: true
        }));

        updateProfile({
            name: this.state.name,
            email: this.state.email,
            website: this.state.website,
            organization_name: this.state.organizationName,
            topics: this.state.topics,
            locations: this.state.locations,
            timezone: this.state.timezone,
            reason: this.state.reason
        }).then((response) => {
            this.props.startSetProfile();
            this.setState(() => ({
                success: "Your profile information has been updated.",
                loading: false
            }));
        }).catch((error) => {
            console.log(error);
            this.setState(() => ({
                error: "Something went wrong.",
                loading: false
            }));
        });
    };

    toggleLocationsModal = (e) => {
        e.preventDefault();
        this.setState(() => ({
            isLocationsModalOpen: !this.state.isLocationsModalOpen
        }));
    };

    addTopic = (e) => {
        e.preventDefault();
        if(this.state.topic){
            this.setState((prevState) => {
                return {
                    topics: [
                        ...prevState.topics.filter(topic => topic !== prevState.topic),
                        prevState.topic
                    ],
                    topic: ""}
            });
        }
    };

    addLocation = (e) => {
        e.preventDefault();
        if(this.state.location){
            this.setState((prevState) => {
                return {
                    locations: [
                        ...prevState.locations.filter(location => JSON.stringify(location) !== JSON.stringify(prevState.location)),
                        prevState.location
                    ],
                    location: ""}
            });
        }
    };

    removeTopic = (index) => {
        let topics = [...this.state.topics];
        topics.splice(index, 1);

        this.setState(() => ({
            topics
        }));
    };

    removeLocation = (index) => {
        let locations = [...this.state.locations];
        locations.splice(index, 1);

        this.setState(() => ({
            locations
        }));
    };

    render(){
        return (
            <div>
                {this.state.loading && <LoaderWithOverlay/>}
                <Modal
                    isOpen={this.state.isTopicsModalOpen}
                    ariaHideApp={false}
                    className="topicsModal"
                >       
                    <form onSubmit={(e) => this.addTopic(e)}>  
                        <h3>Add Topics</h3>
                        <div className="form-group flex_container-center">
                            <div>
                                {this.state.topics.length >= 15 ?
                                    <input disabled type="text" className="form-control" onChange={(e) => this.onTopicsFieldChange(e.target.value)} value={this.state.topic} placeholder="food, pets, fashion..." /> 
                                :
                                    <input type="text" className="form-control" onChange={(e) => this.onTopicsFieldChange(e.target.value)} value={this.state.topic} placeholder="food, pets, fashion..." /> 
                                }
                                
                            </div>
                        </div>
                    </form>

                        
                        {!!this.state.topics.length && this.state.topics.map((topic, index) => (
                          <div key={index} className="addedItemLabels">{topic} <span className="fa fa-times link-cursor" onClick={() => this.removeTopic(index)}></span></div>  
                        ))}
                        
                        <div className="right-inline top-border p10 m10-top">
                            <button className="magento-btn small-btn" onClick={this.toggleTopicsModal}>Add</button>
                        </div>
                </Modal>


                <Modal
                    isOpen={this.state.isLocationsModalOpen}
                    ariaHideApp={false}
                    className="topicsModal"
                >       
                    <form onSubmit={(e) => this.addLocation(e)}>  
                        <h3>Add Locations</h3>
                        <div className="form-group flex_container-center">
                            <div>
                                <GeoSuggest 
                                    onSuggestSelect={this.onLocationsFieldChange}
                                    initialValue={this.state.location && this.state.location.label}
                                    disabled={this.state.locations.length >= 5 ? true : false}
                                />
                            </div>
                        </div>
                    </form>

                        
                        {!!this.state.locations.length && this.state.locations.map((location, index) => (
                        <div key={index} className="addedItemLabels">{location.label} <span className="fa fa-times link-cursor" onClick={() => this.removeLocation(index)}></span></div>  
                        ))}
                        
                        <div className="right-inline top-border p10 m10-top">
                            <button className="magento-btn small-btn" onClick={this.toggleLocationsModal}>Add</button>
                        </div>
                </Modal>

                <h2>PROFILE</h2>
                {this.state.error && 
                    <div className="alert alert-danger">{this.state.error}</div>
                }

                {this.state.success && 
                    <div className="alert alert-success">{this.state.success}</div>
                }
                <form onSubmit={(e) => this.onSubmit(e)} className="profile-form">
                    <div className="form-group shadow-box main-content-style">

 
                        <h3>Personal information</h3>
                        
                        <div className="column-container">
                            <div className="col-6 col-md-6 form-field">
                                <label htmlFor="name">Name</label>
                                <input type="text" className="form-control" onChange={(e) => this.onFieldChange(e)} id="name" value={this.state.name} placeholder="johndoe" />
                            </div>
            
                            <div className="col-6 col-md-6 form-field">
                                <label htmlFor="email">Email</label>
                                <input type="email" className="form-control" id="email" onChange={(e) => this.onFieldChange(e)} value={this.state.email} placeholder="johndoe@example.com" />
                            </div>
                        </div>
        
                        <div className="form-field">
                            <label htmlFor="website">Website</label>
                            <input type="text" className="form-control" value={this.state.website} onChange={(e) => this.onFieldChange(e)} id="website" placeholder="www.example.com" />
                        </div>
        
                    </div>
        
        
                    <div className="form-group shadow-box main-content-style">

                        <h3>Other details</h3>

                        <div className="clearer clearfix">
                            <div className="col-6 col-md-6 clearfix">
                                <label htmlFor="name">I am using Uniclix for:</label>
                                <select type="text" value={this.state.reason} onChange={(e) => this.onFieldChange(e)} className="form-control" id="reason">
                                    <option>Myself</option>
                                    <option>My Business</option>
                                    <option>My Clients</option>
                                </select>
                            </div>

                            <div className="col-6 col-md-6 clearfix">
                                <label htmlFor="topics">Organization Name</label>
                                <input type="text" className="form-control whiteBg" id="organizationName" onChange={(e) => this.onFieldChange(e)} value={this.state.organizationName} placeholder="My Organization" />
                            </div>
                        </div>

                        <div className="seperator"></div>
                        
                        <div className="clearer clearfix">
                            <label htmlFor="topics">My Topics</label> 
                            <div className="clearfix">
                                <button href="javascript:void();" className="default-white-btn pull-right" onClick={this.toggleTopicsModal}><span className="cus-plus-icon">+</span>Add Topic</button>
                            </div>
                            {!!this.state.topics.length && this.state.topics.map((topic, index) => (
                                <div key={index} className="addedItemLabels">{topic} <span className="fa fa-times link-cursor" onClick={() => this.removeTopic(index)}></span></div>  
                              ))}
                            <input type="hidden" className="form-control whiteBg" id="topics" readOnly={true} onClick={this.toggleTopicsModal} value={this.state.topics.map(topic => ` ${topic}`)} placeholder="food, pets, fashion..." />
                        </div>
        
                        <div className="seperator"></div>

                        <div className="clearer clearfix">
                            <label htmlFor="website">My Locations</label>
                            <div className="clearfix">
                                <button href="javascript:void();" className="default-white-btn pull-right" onClick={this.toggleLocationsModal}><span className="cus-plus-icon">+</span>Add Location</button>
                            </div>

                            {!!this.state.locations.length && this.state.locations.map((location, index) => (
                                <div key={index} className="addedItemLabels">{location.label} <span className="fa fa-times link-cursor" onClick={() => this.removeLocation(index)}></span></div>  
                            ))}

                            <input type="hidden" className="form-control whiteBg" id="website" readOnly={true} value={this.state.locations.map(location => ` ${location.label}`)} onClick={this.toggleLocationsModal} placeholder="New York City, Amsterdam, Venice..." />
                        </div>
        
                        <div className="seperator"></div>

                        <div className="form-field">
                            <label htmlFor="name">Timezone</label>
                            <select type="text" className="form-control" onChange={(e) => this.onFieldChange(e)} value={this.state.timezone} id="timezone">
                                {TimezoneSelectOptions.map((timezone, index) => (
                                    <option key={index} value={timezone.value}>{timezone.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <button className="magento-btn pull-right">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        profile: state.profile
    };
};

const mapDispatchToProps = (dispatch) => ({
    startSetProfile: () => dispatch(startSetProfile())
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);