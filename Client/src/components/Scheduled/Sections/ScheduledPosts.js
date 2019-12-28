import React from 'react';
import { connect } from 'react-redux';
import BottomScrollListener from 'react-bottom-scroll-listener';
import UpgradeAlert from '../../UpgradeAlert';
import { setComposerModal } from "../../../actions/composer";
import channelSelector from '../../../selectors/channels';
import { scheduledPosts, destroyPost, postNow } from '../../../requests/channels';
import PostListCalendar from '../../PostListCalendar';
import Loader from '../../Loader';
import Tabs from '../../Tabs';
import UnapprovedPosts from './UnapprovedPosts';
import PastScheduled from './PastScheduled';

export class ScheduledPosts extends React.Component {

    defaultAction = {
        type: '',
        id: ''
    };

    state = {
        posts: [],
        page: 1,
        loading: this.props.channelsLoading,
        action: this.defaultAction,
        forbidden: false,
        error: false,
        titleDate: "",
        events: [],
        viewType: "week",
        currentDate: new Date(),
        Navigate: 'week',
        calendarDate: new Date(),
        viewTypes: [
            {
                id: 'month',
                label: 'Month'
            },
            {
                id: 'week',
                label: 'Week'
            },
            {
                id: 'day',
                label: 'Day'
            }
        ]
    }

    componentDidMount() {

        if (!this.props.channelsLoading) {
            this.fetchPosts();
        }
    }

    componentDidUpdate(prevProps) {
        if ((this.props.selectedChannel !== prevProps.selectedChannel)) {
            this.fetchPosts();
        }
    }

    setLoading = (loading = false) => {
        this.setState(() => ({
            loading
        }));
    };

    setAction = (action = this.defaultAction) => {
        this.setState(() => ({
            action
        }));
    };

    setError = (error = true) => {
        this.setState(() => ({
            error
        }));
    };

    setForbidden = (forbidden = false) => {
        this.setState(() => ({
            forbidden
        }));
    };

    publishPost = (postId) => {
        this.setLoading(true);
        return postNow(postId)
            .then((response) => {
                this.fetchPosts();
                this.setLoading(false);
            }).catch((error) => {

                if (typeof error.response.data.message != 'undefined') {
                    this.setState(() => ({
                        error: error.response.data.message
                    }));
                }

                if (typeof error.response.data.error != 'undefined') {
                    this.setState(() => ({
                        error: error.response.data.error
                    }));
                }

                this.setLoading(false);
            });
    };

    destroy = (postId) => {
        this.setLoading(true);
        return destroyPost(postId)
            .then((response) => {
                this.fetchPosts();
                this.setLoading(false);
            }).catch((error) => {

                if (typeof error.response.data.message != 'undefined') {
                    this.setState(() => ({
                        error: error.response.data.message
                    }));
                }

                if (typeof error.response.data.error != 'undefined') {
                    this.setState(() => ({
                        error: error.response.data.error
                    }));
                }

                this.setLoading(false);
            });
    };

    formatEvents = (events) => {
        let StructureEvents = []
        events.map((event) => {
            let eventItem = event.map((eventItem) => {
                let timeevent = new Date(eventItem.scheduled_at);
                let timeeventstart = timeevent.setTime(timeevent - (60 * timeevent.getMinutes() * 1000));
                timeevent.setTime(timeeventstart + (60 * 60 * 1000));
                eventItem.start = new Date(timeeventstart)
                eventItem.end = new Date(timeevent)
                StructureEvents.push(eventItem)
                return eventItem;
            })
            return eventItem;
        })
        return StructureEvents
    }

    fetchPosts = () => {
        this.setLoading(true);
        scheduledPosts()
            .then((response) => {

                this.setState(() => ({
                    posts: response.items,
                    loading: false,
                    forbidden: false,
                    page: 1,
                    events: this.formatEvents(response.items)
                }));

                setTimeout(() => {
                    this.setState({
                        titleDate: document.getElementsByClassName('rbc-toolbar-label')[0].innerHTML
                    })
                }, 10)
            }).catch((error) => {

                if (typeof error.response.data.message != 'undefined') {
                    this.setState(() => ({
                        error: error.response.data.message
                    }));
                }

                if (error.response.status === 403) {
                    this.setForbidden(true);
                }

                this.setLoading(false);
            });
    };

    loadMore = () => {
        this.setLoading(true);
        let page = this.state.page + 1;
        scheduledPosts(page)
            .then((response) => {
                this.setState((prevState) => ({
                    posts: prevState.posts.concat(response.items),
                    page,
                    loading: false
                }));
            }).catch((error) => {
                this.setLoading(false);

                if (error.response.status === 401) {

                    if (this.props.selectedChannel.active) {
                        this.props.startSetChannels();
                    }
                }

                return Promise.reject(error);
            });
    };




    changeView = (item) => {
        this.setState({
            viewType: item.target.value,
            Navigate: item.target.value
        })
        setTimeout(() => {
            if (document.getElementsByClassName('rbc-toolbar-label')[0]) {
                this.setState({
                    titleDate: document.getElementsByClassName('rbc-toolbar-label')[0].innerHTML
                })
            }
        }, 15)
    }

    onNextDate = () => {
        let { currentDate, viewType } = this.state
        let newDate = new Date();
        switch (viewType) {
            case 'day':
                newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
                break;
            case 'week':
                newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7);
                break
            case 'month':
                newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
                break
            default:
                newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
                break;
        }
        this.setState({
            calendarDate: newDate,
            currentDate: newDate,
        })

        setTimeout(() => {
            this.setState({
                titleDate: document.getElementsByClassName('rbc-toolbar-label')[0].innerHTML
            })
        }, 1)
    }

    onPrevDate = () => {
        let { currentDate, viewType } = this.state
        let newDate = new Date();
        switch (viewType) {
            case 'day':
                newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
                break;
            case 'week':
                newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
                break
            case 'month':
                newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
                break
            default:
                newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
                break;
        }
        this.setState({
            calendarDate: newDate,
            currentDate: newDate,
        })

        setTimeout(() => {
            this.setState({
                titleDate: document.getElementsByClassName('rbc-toolbar-label')[0].innerHTML
            })
        }, 1)
    }

    render() {
        return (
            <div className="main-section">
                <UpgradeAlert isOpen={this.state.forbidden && !this.state.loading} goBack={true} setForbidden={this.setForbidden} />
                <div className="section-header no-border mb-40">
                    <div className="section-header__first-row row">
                        <div className="col-xs-12 col-md-8 ">
                            <h2>POSTS</h2>
                        </div>
                        <div className="col-xs-12 col-md-4">
                            <button className="magento-btn pull-right" onClick={() => { this.props.setComposerModal(true) }}>New Post</button>
                        </div>
                    </div>
                </div>
                <Tabs>
                    <div label="Schedule">
                        <PostListCalendar
                            action={this.state.action}
                            setAction={this.setAction}
                            destroyPost={this.destroy}
                            publishPost={this.publishPost}
                            error={this.state.error}
                            setError={this.setError}
                            posts={this.state.posts}
                            title=""
                            calendarDate={this.state.calendarDate}
                            viewTypes={this.state.viewTypes}
                            viewType={this.state.viewType}
                            events={this.state.events}
                            loading={this.state.loading}
                            changeView={this.changeView}
                            onPrevDate={this.onPrevDate}
                            onNextDate={this.onNextDate}
                            Navigate={this.state.Navigate}
                            titleDate={this.state.titleDate}
                            type="scheduled-posts"
                        />
                    </div>
                    <div label="Awaiting Approval">
                        <UnapprovedPosts />
                    </div>
                    <div label="Past Posts">
                        <PastScheduled />
                    </div>
                </Tabs>
                <BottomScrollListener onBottom={this.loadMore} />
                {this.state.loading && <Loader />}
            </div>

        );
    }
}

//TODO refresh schedule page when publishing, fetch past scheduled posts
const mapStateToProps = (state) => {
    const selectedGlobalChannel = { selected: 1, provider: undefined };
    const selectedChannel = channelSelector(state.channels.list, selectedGlobalChannel);

    return {
        channelsLoading: state.channels.loading,
        selectedChannel: selectedChannel.length ? selectedChannel[0] : {}
    };
};

const mapDispatchToProps = (dispatch) => ({
    setComposerModal: (modal) => dispatch(setComposerModal(modal))
});


export default connect(mapStateToProps, mapDispatchToProps)(ScheduledPosts);