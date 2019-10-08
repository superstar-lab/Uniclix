import React from 'react';
import {connect} from 'react-redux';
import Modal from "react-modal";
import UpgradeAlert from '../../UpgradeAlert';
import BottomScrollListener from 'react-bottom-scroll-listener';
import Article from './Article';
import {updateProfile} from "../../../requests/profile";
import {getArticles} from '../../../requests/articles';
import {startSetProfile} from '../../../actions/profile';
import {setPost} from '../../../actions/posts';
import {ArticleLoader} from '../../Loader';
import TailoredPostModal from '../../TailoredPostModal';
import SocialAccountsPrompt from '../../SocialAccountsPrompt';

class Articles extends React.Component {

    state = {
        articles: [],
        loading: false,
        forbidden: false,
        topics: [],
        topic: "",
        isTopicsModalOpen: false,
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

    toggleTopicsModal = () => {
        this.setState(() => ({
            isTopicsModalOpen: !this.state.isTopicsModalOpen
        }));
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
            isTopicsModalOpen: false,
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

    render(){   
        return(
            <div>
            <UpgradeAlert isOpen={this.state.forbidden && !this.state.loading} goBack={true} setForbidden={this.setForbidden}/>
                <TailoredPostModal 
                    isOpen={this.state.isTailoredPostOpen}
                    postId={this.state.openedPostId}
                    title={this.state.openedTitle}
                    image={this.state.openedImage}
                    source={this.state.openedSource}
                    description={this.state.openedDescription}
                    toggleTailoredPostModal={this.toggleTailoredPostModal}
                />

                <Modal
                    isOpen={this.state.isTopicsModalOpen}
                    ariaHideApp={false}
                    closeTimeoutMS={300}
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
                            <button className="magento-btn small-btn" onClick={this.onTopicsSave}>Add</button>
                        </div>
                </Modal>
                
                {!(!!this.state.articles.length) && this.state.loading && 
                    <div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3"><ArticleLoader /></div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3"><ArticleLoader /></div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3"><ArticleLoader /></div>
                    </div>
                }
                { !!this.state.articles.length ?                 
                    <div>

                        <h4 className="center-inline">Articles based on your choice of <a onClick={this.toggleTopicsModal} className="link-cursor">topics</a></h4>
                        {this.state.loading &&  <div>
                            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3"><ArticleLoader /></div>
                            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3"><ArticleLoader /></div>
                            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3"><ArticleLoader /></div>
                        </div>}
                        <br/>

                        {!!this.state.articles.length &&
                            this.state.articles.map( (article, index) => {

                                return (
                                    <div key={index}>
                                    <Article key={index} article={article} setPost={this.props.setPost} toggleTailoredPostModal={this.toggleTailoredPostModal}/>
                                    </div>
                                );
                            })
                        }
                        {this.state.loading &&  <div>
                            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3"><ArticleLoader /></div>
                            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3"><ArticleLoader /></div>
                            <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3"><ArticleLoader /></div>
                        </div>}
                        <BottomScrollListener onBottom={this.loadArticles} /> 
                    </div>
                :   
                    
                    <div className="initial-topics">
                    {this.state.loading &&  <div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3"><ArticleLoader /></div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3"><ArticleLoader /></div>
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3"><ArticleLoader /></div>
                    </div>}
                        {!this.state.loading &&
                            <SocialAccountsPrompt 
                                image = "/images/hello_bubble_smiley.svg"
                                title = "Be the first to know your industry’s trending news"
                                description = "Curate articles from thousands of sources that can base shared on the fly."
                                buttonTitle = "Lest start  by selecting relevant keywords"
                                action = {this.toggleTopicsModal}
                            />
                        }

                    </div>
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