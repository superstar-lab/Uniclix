import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import BottomScrollListener from 'react-bottom-scroll-listener';
import Article from './Article';
import { updateProfile } from "../../../requests/profile";
import { getArticles } from '../../../requests/articles';
import { startSetProfile } from '../../../actions/profile';
import { setPost } from '../../../actions/posts';
import { ArticleLoader } from '../../Loader';
import TailoredPostModal from '../../TailoredPostModal';

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
        isTailoredPostOpen: false,
        openedTitle: "",
        openedImage: "",
        openedSource: "",
        openedDescription: "",
        openedPostId: "",
        page: 0
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
                    page
                }));
            }else{
                this.setState((prevState) => ({
                    articles: [...prevState.articles, ...response.data],
                    loading: false,
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

    toggleTailoredPostModal = ({title = "", image = "", source = "", description = "", postId = ""}) => {
        this.setState(() => ({
            isTailoredPostOpen: !this.state.isTailoredPostOpen,
            openedTitle: title,
            openedImage: image,
            openedSource: source,
            openedDescription: description,
            openedPostId: postId
        }));
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
        const { articles, loading } = this.state;
        const { filterTopics } = this.props;

        return(
            <div className="articles-container">
                <TailoredPostModal 
                    isOpen={this.state.isTailoredPostOpen}
                    postId={this.state.openedPostId}
                    title={this.state.openedTitle}
                    image={this.state.openedImage}
                    source={this.state.openedSource}
                    description={this.state.openedDescription}
                    toggleTailoredPostModal={this.toggleTailoredPostModal}
                />
                {
                    !!articles.length && !filterTopics.length && articles.map((article, index) => (
                            <div key={index}>
                            <Article
                                key={index}
                                article={article}
                                setPost={this.props.setPost}
                                toggleTailoredPostModal={this.toggleTailoredPostModal}
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
                                toggleTailoredPostModal={this.toggleTailoredPostModal}
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
    setPost: (post) => dispatch(setPost(post))
});

export default connect(mapStateToProps, mapDispatchToProps)(Articles);