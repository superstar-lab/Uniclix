import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { Redirect } from 'react-router-dom';
import moment from "moment";
import DraftEditor from './DraftEditor';
import UpgradeAlert from './UpgradeAlert';
import channelSelector, { publishChannels as publishableChannels } from '../selectors/channels';
import boardsSelector from '../selectors/boards';
import { publish, getCategories } from '../requests/channels';
import { setPost, setPostedArticle } from "../actions/posts";
import { LoaderWithOverlay } from "./Loader";
import { startSetChannels } from "../actions/channels";
import SelectChannelsModal from "./SelectChannelsModal";
import SelectPinterestBoards from './SelectPinterestBoards';
import { setComposerModal } from "../actions/composer";
import formatTime from "../utils/formatTime";
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import momentTz from "moment-timezone";
import { minutes } from "../fixtures/time";


class Compose extends React.Component {

    defaultPost = {
        id: "",
        content: "",
        type: "store",
        images: [],
        scheduled_at: moment(),
        scheduled_at_original: moment(),
        category_id: ""
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
        forbidden: false,
        categories: [],
        filtredCategories: [],
        showCalendar: false,
        calendarFocused: false,
        postDate: moment(new Date()).format("MMM. DD, YYYY"),
        category: "",
        countries: [],
        openCategory: false,
        calendarDataDate: moment(new Date()).format("MMM. DD, YYYY"),
        calendarDataTime: moment(new Date()).add(1, "hours").format('hh:mm'),
        calendarDataPeriod: 'AM',
        calendarData: {
            time: {
                hour: moment(new Date()).add(1, "hours").format("hh"),
                minutes: minutes[Math.floor(Math.random() * minutes.length)],
                time: moment(new Date()).format("A")
            }
        },
        publishState: {
            name: "Post at Best Time",
            value: "best"
        },
        publishTimestamp: null,
        publishDateTime: null,
        publishUTCDateTime: moment().utc().format("YYYY-MM-DDTHH:mm"),
        publishTimezone: momentTz.tz.guess()
    };

    state = this.defaultState;

    componentDidMount() {
        this.setRestrictions();
        this.setCategory();

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
        if (this.props.startAt !== prevProps.startAt) {
            this.setState({
                canSchedule: true,
                calendarDataDate: moment(this.props.startAt ? this.props.startAt : new Date()).format("MMM. DD, YYYY"),
                calendarDataTime: moment(this.props.startAt ? this.props.startAt : new Date()).format('hh:mm'),
                calendarDataPeriod: moment(this.props.startAt ? this.props.startAt : new Date()).format('A'),
                publishState: {
                    name: "Custom Time",
                    value: "date"
                },
                publishDateTime: this.props.startAt ? this.props.startAt : new Date(),
                postDate: moment(this.props.startAt ? this.props.startAt : new Date()),
                calendarData: {
                    time: {
                        hour: moment(this.props.startAt ? this.props.startAt : new Date()).format("hh"),
                        minutes: moment(this.props.startAt ? this.props.startAt : new Date()).format("mm"),
                        time: moment(this.props.startAt ? this.props.startAt : new Date()).format("A"),
                    }
                },
            })
        }
    }
    setCategory = () => {
        getCategories()
            .then((response) => {
                this.setState(() => ({
                    categories: response.categories,
                    filtredCategories: response.categories
                }))
            }).catch((error) => {
                console.log(error)
            })
    };
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

    updateCategory = (e) => {
        let category = e.target.value;

        this.setState({
            category: category
        });
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
        const category_id = this.state.category;

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
            articleId,
            category_id
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

    onFocusChange = ({ focused }) => {
        this.setState((prevState) => ({
            calendarFocused: focused,
            showCalendar: !focused ? focused : prevState.showCalendar
        }));
    };

    onDateChange = (postDate) => {
        this.setState(() => ({ postDate }), () => this.setPublishTimestamp());
    };


    filterCategory = (e) => {
        let val = e.target.value;
        let cats = this.state.categories;
        let filtredCategories = cats.filter(item => item.category_name.toLowerCase().includes(val.toLowerCase()))

        this.setState({
            filtredCategories: filtredCategories,
            categoryName: val
        })
    }
    selectCategory = (val, name) => {
        this.setState({ category: val, categoryName: name, openCountry: false })
    }

    setPublishTimestamp = () => {
        this.setState({
            calendarDataDate: moment(this.state.postDate).format("MMM. DD, YYYY"),
            calendarDataTime: moment(this.state.postDate).add(1, "hours").format('hh:mm'),
            publishDateTime: moment(this.state.postDate).format("YYYY-MM-DDTHH:mmZ"),
        })
    };
    formatChangeTime = (val) => {
        this.setState({
            calendarDataTime: formatTime(val)
        })

    }

    render() {

        // const scheduledLabel = this.state.scheduledLabel && <div className="schedule-info">{this.state.scheduledLabel}</div>;
        const { filtredCategories, openCategory,
            postDate, showCalendar, calendarFocused,
            calendarDataDate,
            calendarDataPeriod,
            openPT,
            categoryName,
            calendarDataTime } = this.state;
        const items = filtredCategories.map((item) => {
            return <li onClick={() => this.selectCategory(item.id, item.category_name)}> {item.category_name} </li>;
        });
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
                                    <h2>Post</h2>
                                    <button type="button" id="closeModal"
                                        onClick={() => {
                                            this.props.setPost(undefined);
                                            this.props.setComposerModal(!this.state.openModal);
                                            this.setState(() => (this.defaultState))
                                        }} className="close fa fa-times">
                                    </button>
                                </div>

                                <div>
                                    <ul className="compose-header">
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
                                        {
                                            this.state.type !== "edit" &&
                                            <li onClick={this.toggleSelectChannelsModal}
                                                className="add-new-channel"><i className="fa fa-plus"></i></li>
                                        }
                                    </ul>
                                </div>

                                <div className="compose-body">
                                    <DraftEditor
                                        scheduledLabel={null}
                                        onChange={this.updateContent}
                                        onImagesChange={this.updatePictures}
                                        content={this.state.content}
                                        pictures={this.state.pictures}
                                    />
                                    <div className="group-field">
                                        <div className={`form-field form-country ${openCategory ? 'open-country' : ''}`}>
                                            <label htmlFor="location">Category</label>

                                            <input
                                                className="form-control whiteBg"
                                                type="text"
                                                id="location"
                                                onFocus={() => this.setState({ openCategory: true })}
                                                onBlur={() => { setTimeout(() => { this.setState({ openCategory: false }) }, 600) }}
                                                value={categoryName}
                                                autoComplete="new-password"
                                                autoComplete="false"
                                                autoComplete="off"
                                                onChange={(e) => this.filterCategory(e)}
                                                placeholder="Select or create your category" />
                                            {openCategory &&
                                                <ul className="country-list">
                                                    {items}
                                                </ul>
                                            }
                                        </div>
                                    </div>
                                    <div className="group-field">
                                        <div className="row">
                                            <div className="col-xs-12 col-md-4">
                                                <label>Schedule</label>
                                                <input type="text"
                                                    onFocus={() => this.setState({ showCalendar: true, calendarFocused: true })}
                                                    onBlur={() => {
                                                        setTimeout(() => {
                                                            this.setState({ showCalendar: false, calendarFocused: false })
                                                        }, 600)
                                                    }}
                                                    value={calendarDataDate}
                                                    placeholde="Date"
                                                    className="form-control whiteBg" name="schedule_date"
                                                    autoComplete="new-password" />
                                                {!!showCalendar &&
                                                    <div className="uc-calendar">
                                                        <SingleDatePicker
                                                            onDateChange={this.onDateChange}
                                                            date={postDate}
                                                            focused={calendarFocused}
                                                            onFocusChange={this.onFocusChange}
                                                            numberOfMonths={1}
                                                            showDefaultInputIcon={false}
                                                            keepOpenOnDateSelect={true}
                                                            keepFocusOnInput={true}
                                                            inputIconPosition="after"
                                                            readOnly={true}
                                                            small={true}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                            <div className="col-xs-12 col-md-2">
                                                <input type="text"
                                                    className="form-control whiteBg"
                                                    onChange={(e) => this.formatChangeTime(e.target.value)}
                                                    placeholder="HH:MM"
                                                    value={calendarDataTime}
                                                    name="schedule_date" />
                                            </div>
                                            <div className="col-xs-12 col-md-2">
                                                <div className={`form-field form-country ${openPT ? 'open-country' : ''}`}>
                                                    <input
                                                        className="form-control whiteBg"
                                                        type="text"
                                                        id="periodTime"
                                                        onFocus={() => this.setState({ openPT: true })}
                                                        onBlur={() => { setTimeout(() => { this.setState({ openPT: false }) }, 600) }}
                                                        autoComplete="false"
                                                        value={calendarDataPeriod}
                                                        autoComplete="new-password"
                                                        placeholder="Select or create your category" />
                                                    {openPT &&
                                                        <ul className="country-list">
                                                            <li onClick={() => this.setState({ calendarDataPeriod: 'AM' })}> AM </li>
                                                            <li onClick={() => this.setState({ calendarDataPeriod: 'PM' })}> PM </li>
                                                        </ul>
                                                    }
                                                </div>

                                            </div>
                                            <div className="col-xs-12 col-md-4">
                                                <label className="checkbox-inline">
                                                    <input type="checkbox"
                                                        className="form-control whiteBg"
                                                        onChange={() => { }}
                                                        name="schedule_date" />
                                                    Post at best time
                                                    </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer" style={{ position: "relative" }}>
                                        <div className="pull-right">
                                            <button onClick={() => {
                                                if (!this.state.letterCount < 1) {
                                                    this.publish({
                                                        publishState: this.state.publishState,
                                                        publishTimestamp: this.state.publishTimestamp,
                                                        publishDateTime: this.state.publishDateTime,
                                                        publishUTCDateTime: this.state.publishUTCDateTime,
                                                        publishTimezone: this.state.publishTimezone
                                                    }, this.state.publishState.value);
                                                }
                                            }} className={`publish-btn default-button ${
                                                !this.state.letterCount < 1 ?
                                                    '' : 'disabled-btn'}`}>
                                                Post</button>
                                        </div>
                                    </div>
                                    {!!this.state.error && <div className='alert alert-danger'>{this.state.error}</div>}
                                </div>
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