import React from 'react';
import { connect } from 'react-redux';
import Geosuggest from 'react-geosuggest';
import { startSetChannels } from '../../actions/channels';
import channelSelector from "../../selectors/channels";
import { addKeywordTarget, destroyKeywordTarget } from '../../requests/twitter/channels';
import Loader from '../../components/Loader';

class KeywordTargetSearchList extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        target: "",
        location: "",
        loading: false,
        suggestedTargets: [
            { keyword: "TECHNOLOGY", location: "" },
            { keyword: "SPORTS", location: "" },
            { keyword: "BUSINESS", location: "" },
            { keyword: "NEWS", location: "" },
            { keyword: "Bongos", location: "" },
            { keyword: "Memes", location: "" },
            { keyword: "Fashion", location: "" },
            { keyword: "Mindfulness", location: "" },
            { keyword: "BEAUTY", location: "" },
            { keyword: "Travel", location: "" },
            { keyword: "Design", location: "" },

        ]
    };

    onChange = (e) => {
        const target = e.target.value;
        this.setState(() => ({
            target
        }));
    };

    onLocationSelect = (suggestedLocation) => {

        if (typeof suggestedLocation.location != "undefined") {
            this.setState(() => ({
                location: JSON.stringify({
                    ...suggestedLocation.location,
                    label: suggestedLocation.label
                })
            }));
        }
    };

    onSubmit = (e, addedTarget = false) => {
        this.setLoading(true);
        if (e) e.preventDefault();

        const target = addedTarget ? addedTarget : this.state.target;
        const location = this.state.location;
        if (target.length) {
            addKeywordTarget(target, location)
                .then((response) => {
                    this.props.reloadTargets(response);
                    this.setLoading(false);
                }).catch((error) => {
                    this.setLoading(false);

                    if (error.response.status === 401) {

                        if (this.props.selectedChannel.active) {
                            this.props.startSetChannels();
                        }
                    }

                    return Promise.reject(error);
                });
        } else {
            this.setLoading(false);
        }
    };

    setLoading = (loading = false) => {
        this.setState(() => ({
            loading
        }));
    }

    removeTarget = (target) => {
        this.setLoading(true);
        destroyKeywordTarget(target)
            .then((response) => {
                this.props.reloadTargets(response);
                this.setLoading(false);
            }).catch((error) => {
                this.setLoading(false);

                if (error.response.status === 401) {

                    if (this.props.selectedChannel.active) {
                        this.props.startSetChannels();
                    }
                }

                return Promise.reject(error);
            });
    }

    render() {
        return (
            <div className="row">
                <div className="col-xs-12">
                    <div className="item-list shadow-box">
                        <div className="search-bar mt20">
                            <form onSubmit={this.onSubmit}>
                                <div className="form-row">
                                    <div className="relative-pos">
                                        <input type="text" className="form-control p20 search-input" onChange={this.onChange} id="keyword" name="keyword" placeholder="Add Hashtag" />
                                        <div className="btn-container">
                                            {
                                                this.state.target ?
                                                    <button className="gradient-background-teal-blue white-button add-target">+</button>
                                                    :
                                                    <button className="gradient-background-teal-blue white-button add-target disabled" disabled>+</button>
                                            }
                                        </div>
                                    </div>

                                </div>
                            </form>
                        </div>

                        <div className="added">
                         

                            <div className="seperator mt20 mb20"></div>
                            <div>
                                <div className={`section-header no-border mt20 mb20`}>
                                    <div className="section-header__first-row">
                                    </div>

                                    <div className="section-header__second-row">
                                        <h3>Trending Topics</h3>
                                    </div>
                                </div>
                                <div className="added-items">
                                    {this.state.suggestedTargets.map((target, index) => (
                                        this.props.targets.map(function (keyw, e) {
                                            return keyw.keyword
                                        }).indexOf(target.keyword) == -1 ?
                                            <div key={index} onClick={(e) => this.onSubmit(false, target.keyword)} className="keyword-item">
                                                #{target.keyword}
                                            </div>
                                            :
                                            this.props.targets.map((actualKey, e) => {
                                                if (actualKey.keyword == target.keyword) {
                                                    return (
                                                        <div key={e} onClick={(e) => this.removeTarget(actualKey.id)} className="keyword-item  added-keyword">
                                                            #{actualKey.keyword}
                                                        </div>
                                                    )
                                                }
                                            })

                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className={`section-header no-border mt20 mb20`}>
                                    <div className="section-header__first-row">
                                    </div>

                                    <div className="section-header__second-row">
                                        <h3>Added by you</h3>
                                    </div>
                                </div>
                                <div className="added-items">
                                    {this.props.targets.map((target, index) => (
                                        this.state.suggestedTargets.map(function (keyU, e) {
                                            return keyU.keyword
                                        }).indexOf(target.keyword) < 0 ?
                                            <KeywordItem key={target.id} target={target} removeTarget={this.removeTarget} />
                                            :
                                            ''
                                    ))}
                                </div>
                            </div>

                            {this.props.targets.length >= 3 && <button onClick={() => this.props.showSearchView(false)} className="btn-blue">Show me posts to share</button>}
                            {this.state.loading && <Loader />}

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const KeywordItem = ({ target, removeTarget }) => (
    <div className="keyword-item added-keyword">
        #{target.keyword} <i onClick={() => removeTarget(target.id)} className="fa fa-close"></i>
    </div>
);

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
})

export default connect(mapStateToProps, mapDispatchToProps)(KeywordTargetSearchList);