import React from 'react';
import { connect } from 'react-redux';
import { ToastContainer } from "react-toastr";
import { withRouter } from "react-router";
import { Prompt } from 'react-router';
import { startSetChannels } from "../../../actions/channels";
import { activateADM, saveAutoMessages, getAutoMessages } from '../../../requests/twitter/channels';
import UpgradeAlert from '../../UpgradeAlert';
import channelSelector from '../../../selectors/channels';
import LoaderWithOverlay from '../../Loader';
import DraftEditor from "../../DraftEditor";
let toastContainer;
const predefinedMessages = [
    "Welcome @username to my profile, thanks for follow me!",
    "Add a new message, give warmth to your welcome and boost your account"
]
class AutoDM extends React.Component {
    state = {
        loading: true,
        firstLoading: true,
        isTabActive: 'predefined',
        keyword: "",
        keywordActive: "",
        replaceKeyword: 0,
        activeKeywords: [],
        isADMactive: this.props.selectedChannel.details.auto_dm,
        shouldBlockNavigation: false
    }
    componentDidMount() {
        if (!this.props.channelsLoading) {
            this.fetchData();
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if ((this.props.selectedChannel !== prevProps.selectedChannel) || (this.state.category !== prevState.category)) {
            this.fetchData();
            this.setState({
                isADMactive: this.props.selectedChannel.details.auto_dm
            })
        }
        if (this.state.shouldBlockNavigation) {
            window.onbeforeunload = true
        } else {
            window.onbeforeunload = undefined
        }
    }
    fetchData = (order = 'desc') => {
        return getAutoMessages().then((response) => {
            let allData = response.data;
            let alldataArray = allData.map((item) => {
                return item.message;
            })
            let activeResponse = allData.filter((item) => {
                if (item.active) {
                    return item.message;
                }
            })
            this.setState({
                activeKeywords: alldataArray,
                isADMactive: this.state.isADMactive,
                loading: false,
                firstLoading: false
            });
            if (activeResponse.length > 0 && !!this.state.isADMactive) {
                this.setState({
                    keyword: activeResponse[0].message,
                    keywordActive: activeResponse[0].message,
                    replaceKeyword: activeResponse[0].message.length
                })
            } else {
                this.setState({
                    keyword: "",
                    replaceKeyword: 0
                })
            }
            return Promise.resolve(response)
        })
            .catch((error) => {
                if (typeof error.response.statusText == "undefined") {
                    console.log(error);
                    return;
                }
                console.log(error);
                Promise.reject(error);
            });
    };
    ChangeTab = (newIndex) => {
        this.setState(() => ({
            isTabActive: newIndex
        }));
    }
    onFieldChange = (e) => {
        const id = e.target.id;
        let state = Object.assign({}, this.state);
        state[id] = e.target.value;
        this.setState(() => (state));
    };
    selectMessage = (val) => {
        if (!!this.state.isADMactive)
            this.setState({ keyword: val, replaceKeyword: this.state.replaceKeyword + 1 });
    }
    activateDm = (e) => {
        this.setState({ loading: true })
        const channelId = this.props.selectedChannel.id;
        const status = !this.state.isADMactive;
        return activateADM(channelId, status)
            .then((response) => {
                this.props.startSetChannels();
                this.setState({ isADMactive: status, loading: false })
                let message = !!this.state.isADMactive ? 'activated' : 'deactivated'
                toastContainer.success(`Auto DM ${message} successfully.`, "Success", { closeButton: true });
                this.fetchData();
                return Promise.resolve(response)
            })
            .catch((error) => {
                if (typeof error.response.statusText == "undefined") {
                    return;
                }
                Promise.reject(error);
            });
    }
    saveMessage = () => {
        const channelId = this.props.selectedChannel.id;
        const status = this.state.keyword;
        if (this.state.isADMactive) {
            this.setState({ loading: true })
            return saveAutoMessages(channelId, status)
                .then((response) => {
                    toastContainer.success(`Auto DM response set successfully.`, "Success", { closeButton: true });
                    this.setState({
                        loading: false,
                        keyword: status
                    });
                    this.fetchData();
                    return Promise.resolve(response)
                })
                .catch((error) => {
                    this.setState({
                        loading: false
                    });
                    if (typeof error.response.statusText == "undefined") {
                        return;
                    }
                    Promise.reject(error);
                });
        }
    }
    updateDMState = (keyword = "") => {
        if (!!this.state.isADMactive) {
            this.setState({ letterCount: 10000 - keyword.length, keyword })
        } else {
            this.setState({ replaceKeyword: 0, keyword: "" })
        }
        if (keyword != this.state.keywordActive) {
            this.setState({ shouldBlockNavigation: true })
        } else {
            this.setState({ shouldBlockNavigation: false })
        }
    };
    render() {
        const { isTabActive, isADMactive, keyword, replaceKeyword, activeKeywords, loading, firstLoading, shouldBlockNavigation } = this.state
        return (
            firstLoading ?
                <LoaderWithOverlay />
                :
                <React.Fragment>
                    <Prompt
                        when={shouldBlockNavigation}
                        message={`You haven't saved your message yet. Do you want to leave without finishing?`}
                    />
                    <div>
                        <div>
                            <UpgradeAlert isOpen={this.state.forbidden && !this.state.loading} goBack={true} setForbidden={this.setForbidden} />
                            <ToastContainer
                                ref={ref => toastContainer = ref}
                                className="toast-top-right"
                            />
                            <div className="section-header">
                                <div className="section-header__first-row">
                                    <h2>Auto DM
                                    <label className={`switch round ${!!isADMactive ? 'checked' : ''}`}>
                                            <input type="checkbox" defaultChecked={!!isADMactive ? 'checked' : ''} onChange={(e) => this.activateDm(e)} />
                                            <span className="slider round"></span>
                                            <p className={"off"}>Off</p>
                                            <p className={"on"}>On</p>
                                        </label>
                                    </h2>
                                </div>
                                <div className="section-header__second-row">
                                    <p>This is your Auto direct message, you can choose and edit a predefined one or start writing your own.</p>
                                </div>
                            </div>
                        </div>
                        {loading && <LoaderWithOverlay />}
                        {!!isADMactive &&
                            <div className="aadm-cnt">
                                <div className="form-row">
                                    <div className="relative-pos add-dm-message">
                                        <DraftEditor
                                            onChange={this.updateDMState}
                                            content={keyword}
                                            disabled={isADMactive != 0}
                                            pictures={[]}
                                            ChangeAllContent={replaceKeyword}
                                            textBtn={true}
                                            showImagesIcon={false}
                                            showHashtagsIcon={false}
                                            inclusive={false}
                                            sendAction={this.saveMessage}
                                        />
                                    </div>
                                </div>
                                <div className="tab-cnt">
                                    <h3 className="subsection-header">Predefined Messages</h3>
                                    <div className="tab-head">
                                        <div className={`tab-nav-item ${isTabActive == 'predefined' ? 'active' : ''}`}>
                                            <button href="#personal-info" onClick={() => this.ChangeTab('predefined')}>Predefined</button>
                                        </div>
                                        <div className={`tab-nav-item ${isTabActive == 'created-by-me' ? 'active' : ''}`}>
                                            <button href="#company-info" onClick={() => this.ChangeTab('created-by-me')}>Created by me</button>
                                        </div>
                                    </div>
                                    <div className="tab-body">
                                        <div className={`cnt-item ${isTabActive == 'predefined' ? 'active' : ''}`}>
                                            <ul className="list-items">
                                                {
                                                    predefinedMessages.map((predMessage, index) => (
                                                        <li className="list-item" key={index}>{predMessage}
                                                            <button className="blue-txt-btn add-message"
                                                                onClick={() => this.selectMessage(`${predMessage}`)}>Select</button>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </div >
                                        <div className={`cnt-item ${isTabActive == 'created-by-me' ? 'active' : ''}`}>
                                            <ul className="list-items">
                                                {
                                                    activeKeywords.map((item, index) => (
                                                        predefinedMessages.includes(item) ? '' :
                                                            <li className="list-item" key={index}>{item}
                                                                <button className={`blue-txt-btn add-message  ${isADMactive != 0 ? "" : "disabled"}`}
                                                                    onClick={() => this.selectMessage(`${item}`)}>Select</button>
                                                            </li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    </div >
                                </div >
                            </div>
                        }
                    </div>
                </React.Fragment>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AutoDM));