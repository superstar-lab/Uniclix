import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import BottomScrollListener from 'react-bottom-scroll-listener';
import moment from 'moment';

import { updateProfile } from "../../../requests/profile";
import { getArticles } from '../../../requests/articles';
import { setPost } from '../../../actions/posts';
import { startSetProfile } from '../../../actions/profile';
import { setComposerForArticle } from '../../../actions/composer';

import Article from './Article';
import { ArticleLoader } from '../../Loader';

class Articles extends React.Component {
    static propTypes = {
        filterTopics: PropTypes.array.isRequired
    };

    state = {
        articles: [],
        loading: false,
        forbidden: false,
        topics: [],
        topic: "",
        page: 0,
        last_page: 0
    }

    componentDidMount(){
        this.initializeTopics();
        this.loadArticles();
    }

    initializeTopics = () => {
        if(this.props.profile){
            const topics = this.props.profile.topics;

            let stateCopy = Object.assign({}, this.state);
            stateCopy["topics"] = topics.map((topic) => topic.topic);
            this.setState(() => (stateCopy));
        }
    };

    loadArticles = (pageNumber = false) => {
        let page = pageNumber ? pageNumber : this.state.page + 1;
        this.setState(() => ({
            loading: true
        }));
        getArticles(page)
        .then((response) => {
            if(page < 2){
                this.setState(() => ({
                    articles: [...response.data],
                    loading: false,
                    forbidden: false,
                    last_page: response.last_page,
                    page
                }));
            }else{
                this.setState((prevState) => ({
                    articles: [...prevState.articles, ...response.data],
                    loading: false,
                    last_page: response.last_page,
                    page
                }));
            }
        }).catch((error) => {
            if(error.response.status === 403){
                this.setForbidden(true);
            }
            this.setState(() => ({
                loading: false
            }));
        });
    };

    openComposer = ({title = "", image = "", source = "", description = "", articleId = ""}) => {
        const { profile: { user: { timezone } } } = this.props;
        this.props.setComposerForArticle({
            content: `${title} ${source}`,
            pictures: image ? [image] : [],
            articleId,
            date: moment().tz(timezone).format('YYYY-MM-DDTHH:mmZ'),
            selectedTimezone: timezone
        });
    }

    onTopicsFieldChange = (topic) => {
        this.setState(() => ({
            topic
        }));
    };

    onTopicsSave = () => {

        this.setState(() => ({
            loading: true
        }));

        updateProfile({
            topics: this.state.topics
        }).then((response) => {
            this.props.startSetProfile().then((response) => {
                this.loadArticles(1);
            });
            this.setState(() => ({
                loading: false
            }));
        }).catch((error) => {
            console.log(error);
            this.setState(() => ({
                loading: false
            }));
        });
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

    removeTopic = (index) => {
        let topics = [...this.state.topics];
        topics.splice(index, 1);

        this.setState(() => ({
            topics
        }));
    };

    setForbidden = (forbidden = false) => {
        this.setState(() => ({
            forbidden
        }));
    };

    render() {
        const { articles, loading, page, last_page } = this.state;
        const { filterTopics } = this.props;

        return (
            <div className="articles-container">
                {
                    !!articles.length && !filterTopics.length && articles.map((article, index) => (
                            <div key={index}>
                            <Article
                                key={index}
                                article={article}
                                setPost={this.props.setPost}
                                toggleComposer={this.openComposer}
                            />
                            </div>
                    ))
                }
                {
                    !!articles.length && !!filterTopics.length && articles
                        .filter(({ topic }) => filterTopics.indexOf(topic) !== -1)
                        .map((article, index) => (
                            <div key={index}>
                                <Article
                                    key={index}
                                    article={article}
                                    setPost={this.props.setPost}
                                    toggleComposer={this.openComposer}
                                />
                            </div>
                        ))
                }
                {
                    loading && (
                        <div>
                            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3"><ArticleLoader /></div>
                            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3"><ArticleLoader /></div>
                            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3"><ArticleLoader /></div>
                        </div>
                    )
                }
                {
                    !!articles.length && page < last_page && <BottomScrollListener onBottom={this.loadArticles} />
                }
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
    startSetProfile: () => dispatch(startSetProfile()),
    setPost: (post) => dispatch(setPost(post)),
    setComposerForArticle: (data) => dispatch(setComposerForArticle(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Articles);