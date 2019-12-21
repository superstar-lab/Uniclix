import React from 'react';
import { connect } from 'react-redux';
import BottomScrollListener from 'react-bottom-scroll-listener';
import UpgradeAlert from '../../UpgradeAlert';
import { setComposerModal } from "../../../actions/composer";
import channelSelector from '../../../selectors/channels';
import { scheduledPosts, destroyPost, postNow } from '../../../requests/channels';
import PostList from '../../PostList';
import Loader from '../../Loader';
import Tabs from '../../Tabs';
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
        events: []
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
        // {
        //     "salon_id": 1,
        //     "employee_id": 10,
        //     "start_time": "2019-05-29T11:00",
        //     "salons_service_ids": ["611"],
        //     "stilerocard_service_ids": [],
        //     "styleocard_service_ids": [],
        //     "client_notice": "",
        //     "with_stilerocard": false,
        //     "payment_method": "at_property",
        //     id: 0,
        //     allDay: false,
        //     title: 'Board meeting',
        //     resource: '190- CH',
        //     hexColor: "8edffc",
        //     start: new Date(2019, 0, 29, 9, 0, 0),
        //     end: new Date(2019, 0, 29, 13, 0, 0),
        //     resource: {
        //         price: '190- CH',
        //         staf: 'John Smith',
        //         services: ['Hair Styling', 'Wash Hair', 'Massage', 'Gel', 'Hair Styling', 'Wash'],
        //         diff: new Date(new Date().setHours(new Date().getHours()))
        //     },
        // }
        let StructureEvents = events.map((event) =>{
            let timeevent = new Date(event[0].scheduled_at);
            timeevent.setTime(timeevent.getTime() + (60*60*1000));
            event[0].start = new Date(event[0].scheduled_at)
            event[0].end = new Date(timeevent)
            return event[0];
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

    render() {
        return (
            <div className="main-section">
                <UpgradeAlert isOpen={this.state.forbidden && !this.state.loading} goBack={true} setForbidden={this.setForbidden} />
                <div className="section-header no-border mb-40">
                    <div className="section-header__first-row row">
                        <div className="col-xs-12 col-md-8 ">
                            <h2>SCHEDULED POSTS</h2>
                        </div>
                        <div className="col-xs-12 col-md-4">
                            <button className="magento-btn pull-right" onClick={() => { this.props.setComposerModal(true) }}>New Post</button>
                        </div>
                    </div>
                </div>
                <Tabs>
                    <div label="Schedule">
                        <PostList
                            action={this.state.action}
                            setAction={this.setAction}
                            destroyPost={this.destroy}
                            publishPost={this.publishPost}
                            error={this.state.error}
                            setError={this.setError}
                            posts={this.state.posts}
                            events={this.state.events}
                            loading={this.state.loading}
                            title=""
                            type="scheduled-posts"
                        />
                    </div>
                    <div label="Awaiting Approval">
                        <PastScheduled />
                    </div>
                    <div label="Draft"></div>
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