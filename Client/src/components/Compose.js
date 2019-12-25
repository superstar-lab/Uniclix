import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { Redirect } from 'react-router-dom';
import moment from "moment";
import DraftEditor from './DraftEditor';
import UpgradeAlert from './UpgradeAlert';
import channelSelector, { publishChannels as publishableChannels } from '../selectors/channels';
import boardsSelector from '../selectors/boards';
import { publish } from '../requests/channels';
import { setPost, setPostedArticle } from "../actions/posts";
import { LoaderWithOverlay } from "./Loader";
import { startSetChannels } from "../actions/channels";
import SelectChannelsModal from "./SelectChannelsModal";
import SelectPinterestBoards from './SelectPinterestBoards';
import PublishButton from './PublishButton';
import { setComposerModal } from "../actions/composer";


class Compose extends React.Component {

    defaultPost = {
        id: "",
        content: "",
        type: "store",
        images: [],
        scheduled_at: moment(),
        scheduled_at_original: moment()
    };

    defaultState = {
        content: "",
        type: 'store',
        selectChannelsModal: false,
        openModal: this.props.composer,
        publishChannels: publishableChannels(this.props.channel),
        optionsMenu: false,
        letterCount: 0,
        pictures: [],
        selectedPinterestChannel: false,
        loading: false,
        stored: false,
        refresh: true,
        restricted: false,
        twitterRestricted: false,
        pinterestRestricted: false,
        scheduledLabel: "",
        error: false,
        forbidden: false
    };

    state = this.defaultState;

    componentDidMount() {
        this.setRestrictions();
    }

    componentDidUpdate(prevProps, prevState) {

        const currentChannels = publishableChannels(this.props.channels);

        if (prevProps.post !== this.props.post && this.props.post) {

            let refresh = this.state.refresh;

            if (typeof (this.props.post.refresh) !== "undefined") {
                refresh = this.props.post.refresh;
            }

            this.setState(() => ({
                content: this.props.post.content ? this.props.post.content : "",
                pictures: this.props.post.images,
                type: this.props.post ? this.props.post.type : "store",
                letterCount: this.props.post.content ? this.props.post.content.length : 0,
                refresh
            }));
        }

        if (this.state.stored) {
            this.toggleModal();
        }

        if (prevProps.channels !== this.props.channels) {
            this.setState(() => ({
                publishChannels: currentChannels
            }));
        }

        if (prevProps.composer !== this.props.composer) {
            this.setState(() => ({
                openModal: this.props.composer
            }));
        }

        if (prevState.letterCount !== this.state.letterCount
            || prevState.pictures !== this.state.pictures
            || prevProps.channels !== this.props.channels
            || prevState.publishChannels !== this.state.publishChannels) {
            this.setRestrictions();
        }
    }

    setRestrictions = () => {

        const selectedChannels = channelSelector(this.state.publishChannels, { selected: true, provider: undefined });

        const restricted = !((this.state.letterCount > 0 || this.state.pictures.length > 0)
            && selectedChannels.length);

        const twitterRestricted = (this.state.letterCount > 280 || this.state.pictures.length > 4)
            && channelSelector(selectedChannels, { selected: undefined, provider: "twitter" }).length;

        const pinterestRestricted = (this.state.pictures.length < 1)
            && channelSelector(selectedChannels, { selected: undefined, provider: "pinterest" }).length

        this.setState(() => ({
            restricted,
            twitterRestricted,
            pinterestRestricted
        }));
    };

    toggleModal = () => {
        this.props.setComposerModal(!this.state.openModal);
    };

    toggleSelectPinterestBoardsModal = () => {
        this.setState(() => ({
            selectedPinterestChannel: false,
            selectChannelsModal: true
        }));
    };

    updateContent = (content = "") => {
        this.setState(() => ({
            content: content,
            letterCount: content.length
        }));
    };

    updatePictures = (pictures = []) => {
        this.setState(() => ({
            pictures: pictures
        }));
    };

    updateScheduledLabel = (scheduledLabel) => {
        this.setState(() => ({
            scheduledLabel
        }));
    };

    onChannelSelectionChange = (obj) => {
        const selectedPinterestChannel = !obj.selected && obj.type == "pinterest" ? obj : false;

        const publishChannels = this.state.publishChannels.map((channel) => {
            if (channel.id === obj.id) {
                return {
                    ...channel,
                    selected: channel.selected ? 0 : 1
                }
            }
            else {

                if (obj.type == "twitter" && channel.type == "twitter") {
                    return {
                        ...channel,
                        selected: 0
                    }
                } else {
                    return {
                        ...channel
                    };
                }
            }
        });

        this.setState(() => ({
            publishChannels,
            selectedPinterestChannel
        }));
    };

    onPinterestBoardSelectionChange = (obj, boards) => {
        const selectedBoards = boardsSelector(boards, { selected: true });
        const publishChannels = this.state.publishChannels.map((channel) => {
            if (channel.id === obj.id) {
                return {
                    ...channel,
                    boards,
                    selectedBoards
                };
            }
            else {

                if (obj.type == "twitter" && channel.type == "twitter") {
                    return {
                        ...channel,
                        selected: 0
                    };
                } else {
                    return {
                        ...channel
                    };
                }
            }
        });

        this.setState(() => ({
            publishChannels
        }));
    };

    toggleSelectChannelsModal = () => {

        if (this.state.selectChannelsModal) {
            localStorage.setItem('publishChannels', JSON.stringify(this.state.publishChannels));
        }

        this.setState(() => ({
            publishChannels: publishableChannels(this.state.publishChannels),
            selectChannelsModal: !this.state.selectChannelsModal
        }));
    };

    toggleOptionsMenu = () => {
        this.setState(() => ({ optionsMenu: !this.state.optionsMenu }));
    };

    setForbidden = (forbidden = false) => {
        this.setState(() => ({
            forbidden,
            loading: false
        }));
    };

    publish = (scheduled, publishType) => {
        const content = this.state.content;
        const type = this.state.type;
        const id = this.props.post ? this.props.post.id : "";
        const articleId = this.props.post && typeof (this.props.post.articleId) !== "undefined" ? this.props.post.articleId : "";
        const images = this.state.pictures;
        const publishChannels = channelSelector(this.state.publishChannels, { selected: true, provider: undefined });

        this.setState(() => ({
            loading: true
        }));

        publish({
            content,
            images,
            publishChannels,
            publishType,
            scheduled,
            type,
            id,
            articleId
        })
            .then((response) => {
                this.setState(() => ({
                    loading: false,
                    stored: true
                }), () => {
                    if (articleId) {
                        this.props.setPostedArticle({
                            articleId,
                            posted: publishType == "now" ? 1 : 0
                        });
                    }

                    this.props.startSetChannels();
                });
            }).catch((error) => {
                if (error.response.status === 403) {
                    this.setForbidden(true);
                    return;
                }

                let errorMessage = "Something went wrong";
                if (error.response.status === 401) {

                    if (typeof error.response.data.error !== "undefined")
                        errorMessage = error.response.data.error;

                    if (typeof error.response.data.message !== "undefined")
                        errorMessage = error.response.data.message;
                }

                this.setState(() => ({
                    loading: false,
                    error: errorMessage
                }));
            });
    }

    render() {

        const scheduledLabel = this.state.scheduledLabel && <div className="schedule-info">{this.state.scheduledLabel}</div>;
        return (
            <Modal isOpen={this.state.openModal}
                closeTimeoutMS={300}
                ariaHideApp={false}
                className="flex-center modal-no-radius no-outline">
                <UpgradeAlert
                    isOpen={this.state.forbidden && !this.state.loading}
                    text={`You exceeded the post limit for this month.`}
                    setForbidden={this.setForbidden}
                    toggle={this.toggleModal} />

                <div>
                    {(this.state.stored && this.state.refresh) && <Redirect to={location.pathname} />}
                    {this.state.loading && <LoaderWithOverlay />}

                    <div className="modal-dialog modal-dialog-centered compose-dialog" role="document">
                        <Modal isOpen={!!this.state.selectedPinterestChannel} ariaHideApp={false} className="modal-no-bg">
                            <SelectPinterestBoards
                                onChange={this.onPinterestBoardSelectionChange}
                                channel={this.state.selectedPinterestChannel}
                                toggle={this.toggleSelectPinterestBoardsModal} />
                        </Modal>

                        {this.state.selectChannelsModal ?

                            <SelectChannelsModal
                                channels={this.state.publishChannels}
                                onChange={this.onChannelSelectionChange}
                                toggle={this.toggleSelectChannelsModal}
                                toggleComposer={this.toggleModal}
                            />

                            :

                            <div className="modal-content">

                                <div className="modal-header">
                                    <button type="button" id="closeModal"
                                        onClick={() => {
                                            this.props.setPost(undefined);
                                            this.props.setComposerModal(!this.state.openModal);
                                            this.setState(() => (this.defaultState))
                                        }} className="close fa fa-times-circle">
                                    </button>
                                    <ul className="compose-header">
                                        {
                                            this.state.type !== "edit" &&
                                            <li onClick={this.toggleSelectChannelsModal}
                                                className="add-new-channel"><i className="fa fa-plus"></i></li>
                                        }


                                        {!!this.state.publishChannels.length &&
                                            channelSelector(
                                                this.state.publishChannels,
                                                { selected: true, provider: undefined }).map((channel) => (
                                                    <li key={channel.id} className="channel-item">
                                                        {
                                                            this.state.type !== "edit" &&
                                                            <div className="remove-overlay fa fa-close" onClick={() => this.onChannelSelectionChange(channel)}></div>
                                                        }
                                                        <img onError={(e) => e.target.src = '/images/dummy_profile.png'} src={channel.avatar} />
                                                        <i className={`fa fa-${channel.type} ${channel.type}_bg smallIcon`}></i>
                                                    </li>
                                                ))}

                                    </ul>
                                </div>

                                <DraftEditor
                                    scheduledLabel={scheduledLabel}
                                    onChange={this.updateContent}
                                    onImagesChange={this.updatePictures}
                                    content={this.state.content}
                                    pictures={this.state.pictures}
                                />

                                <div className="modal-footer" style={{ position: "relative" }}>
                                    <PublishButton
                                        action={this.publish}
                                        onChange={this.updateScheduledLabel}
                                        startAt={this.props.startAt}
                                        restricted={this.state.restricted || this.state.twitterRestricted || this.state.pinterestRestricted}
                                    />

                                    <p className={`letter-count ${this.state.twitterRestricted && this.state.letterCount > 280 ? 'red-txt' : ''}`}>{this.state.letterCount}</p>
                                </div>
                                {!!this.state.error && <div className='alert alert-danger'>{this.state.error}</div>}
                            </div>
                        }

                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    const channels = channelSelector(state.channels.list, { selected: undefined, provider: undefined, publishable: true });
    return {
        channels,
        post: state.posts.post,
        composer: state.composer.modal,
        startAt: state.composer.data,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setPost: (post) => dispatch(setPost(post)),
    setPostedArticle: (article) => dispatch(setPostedArticle(article)),
    setComposerModal: (modal) => dispatch(setComposerModal(modal)),
    startSetChannels: () => dispatch(startSetChannels())
});

export default connect(mapStateToProps, mapDispatchToProps)(Compose);