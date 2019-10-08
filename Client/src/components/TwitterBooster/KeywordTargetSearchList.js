import React from 'react';
import {connect} from 'react-redux';
import Geosuggest from 'react-geosuggest';
import {startSetChannels} from '../../actions/channels';
import channelSelector from "../../selectors/channels";
import {addKeywordTarget, destroyKeywordTarget} from '../../requests/twitter/channels';
import Loader from '../../components/Loader';
import InfoModal from '../InfoModal';

class KeywordTargetSearchList extends React.Component{
    constructor(props){
        super(props);
    }

    state = {
        target: "",
        location: "",
        loading: false,
        infoModal: localStorage.getItem('twitterBoosterInfoModal') !== 'seen'
    };

    onChange = (e) => {
        const target = e.target.value;
        this.setState(() => ({
            target
        }));
    };

    onLocationSelect = (suggestedLocation) => {

        if(typeof suggestedLocation.location != "undefined"){
            this.setState(() => ({
                location: JSON.stringify({
                    ...suggestedLocation.location,
                    label: suggestedLocation.label
                })
            }));
        }
    };

    onSubmit = (e) => {
        this.setLoading(true);
        e.preventDefault();
        const target = this.state.target;
        const location = this.state.location;
        if(target.length){
          addKeywordTarget(target, location)
          .then((response) => {
              this.props.reloadTargets(response);
              this.setLoading(false);
            }).catch((error) => {
                this.setLoading(false);

                if(error.response.status === 401){
                    
                    if(this.props.selectedChannel.active){
                       this.props.startSetChannels();
                    }
                }

                return Promise.reject(error);
            });  
        }
    };

    setLoading = (loading = false) => {
        this.setState(() => ({
            loading
        }));
    }

    rememberInfoModal = () => {
        localStorage.setItem('twitterBoosterInfoModal', 'seen');
        this.setState(() => ({infoModal: false}));
    };

    removeTarget = (target) => {
        this.setLoading(true);
        destroyKeywordTarget(target)
        .then((response) => {
            this.props.reloadTargets(response);
            this.setLoading(false);
        }).catch((error) => {
            this.setLoading(false);

            if(error.response.status === 401){
                    
                if(this.props.selectedChannel.active){
                   this.props.startSetChannels();
                }
            }

            return Promise.reject(error);
        });
    }

    render(){
        return (
            <div className="row">

                <InfoModal
                    isOpen={this.state.infoModal}
                    title={"Welcome to Uniclix Twitter Booster"}
                    body={"Start by setting up your targeted audience"}
                    action={this.rememberInfoModal}
                />

                <div className="target-info">                
                    <h4>Find relevant users: track users who use your #hashtags of interest.</h4> 
                    <p>Please add at least 4 #hashtags, this will help UniClix find enough results and suggestions.</p> 
                </div>

                <div className="col-xs-12">
                    <div className="item-list shadow-box">
                        <div className="item-header">
                            <button onClick={() => this.props.showSearchView(false)} className="gradient-background-teal-blue default-button">Done</button>
                        </div>
                        <div className="search-bar mt20">
                            <form onSubmit={this.onSubmit}>
                                <div className="form-row">
                                    <div className="col-md-9 mb-3 p10-5">
                                        <input type="text" className="form-control p20 left-radius" onChange={this.onChange} id="keyword" name="keyword" placeholder="Enter keywords" />
                                    </div>
                                    <div className="col-md-2 mb-3 p10-5 pstatic">
                                        <div className="">
                                            <Geosuggest 
                                                inputClassName="form-control p20 right-radius location-search" 
                                                autoComplete="off" 
                                                id="location" 
                                                placeholder="&#xf041; Worldwide"
                                                onSuggestSelect={this.onLocationSelect}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-1 mb-3 p10-5">
                                        {
                                            this.state.target ?
                                            <button className="gradient-background-teal-blue white-button add-target">ADD</button>
                                            :
                                            <button className="gradient-background-teal-blue white-button add-target disabled" disabled>ADD</button>
                                        }
                                        
                                    </div>
                                </div> 
                            </form>
                    </div>

                        <div className="added">

                            {!!this.props.targets.length && 
                                <div>                                
                                    <div className="list-header">
                                        <div className="col-sm-4 col-md-5 col-5"> Keyword </div>
                                        <div className="col-sm-4 col-md-5 col-5"> Location </div>
                                    </div>

                                    <div className="added-items">
                                        {this.props.targets.map((target) => <KeywordItem key={target.id} target={target} removeTarget={this.removeTarget} />)}
                                    </div>
                                </div>
                            }
                            {this.state.loading && <Loader />}
 
                        </div>
                    </div>
                </div>
            </div>
        );
    }
} 

const KeywordItem = ({target, removeTarget}) => (
    <div className="item-row ptb20 keyword-item">
        <div className="col-sm-4 col-md-5 col-5"> #{target.keyword} </div>
        <div className="col-sm-4 col-md-5 col-5"> {target.location ? JSON.parse(target.location).label : "Worldwide"} </div>

        <div className="col-sm-1 col-md-1 col-1 pull-right txt-center">
            <div onClick={() => removeTarget(target.id)} className="trash-btn"><i className="fa fa-trash"></i> <span className="delete-text"> Delete</span></div>
        </div>
    </div>
);

const mapStateToProps = (state) => {
    const selectedTwitterChannel = {selected: 1, provider: "twitter"};
    const selectedChannel = channelSelector(state.channels.list, selectedTwitterChannel);

    return {
        channelsLoading: state.channels.loading,
        selectedChannel: selectedChannel.length ? selectedChannel[0] : {}
    };
};

const mapDispatchToProps = (dispatch) => ({
    startSetChannels: () => dispatch(startSetChannels())
})

export default connect(mapStateToProps, mapDispatchToProps)(KeywordTargetSearchList);