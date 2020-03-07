import React from 'react';
import {connect} from 'react-redux';
import {truncate} from '../../../utils/helpers';

const Article = ({article, postedArticle, toggleComposer}) => {
    if(article.posted == null){

        if(typeof(postedArticle) !== "undefined" && typeof(postedArticle.articleId) !== "undefined"){

            if(typeof(postedArticle.posted) !== "undefined" && postedArticle.articleId == article.id){
                article.posted = postedArticle.posted;
            }
        }
    }

    return (
        <div className="card-display col-sm-12 col-md-6 col-lg-4 col-xl-3">
            <div className="card-content">
                <div className="image-container">
                    <img
                        className="card-img-top"
                        onError={(e) => e.target.src='/images/uniclix.png'}
                        src={article.image_url ? article.image_url : '/images/uniclix.png'}
                    />
                    <div className="topic-label">{article.topic.toUpperCase()}</div>
                    <div className="img-overlay">
                        <div className="icons">
                            <div onClick={() => {
                                toggleComposer({
                                    title: article.title,
                                    image: article.image_url,
                                    source: article.url,
                                    description: article.description,
                                    articleBody: article.content ? article.content : article.description,
                                    articleId: article.id
                                })
                            }}>
                                <div className="svg-container">
                                    <img src="/images/icons/share-arrow.svg" />
                                </div>
                                <div className="action-label">Share</div>
                            </div>
                            <a href={article.url} target="_blank">
                                <div>
                                    <div className="svg-container">
                                        <img src="/images/icons/read.svg" />
                                    </div>
                                    <div className="action-label">Read</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <h5 className="card-title">
                        {truncate(article.title, 60)}
                        {
                            article.posted != null ?
                                (
                                    article.posted ?
                                        <span className="alert-success pull-right p10">POSTED</span> :
                                        <span className="alert-info pull-right p10">SCHEDULED</span>
                                ) :
                                ""
                        }
                    </h5>
                    <p className="card-text">
                        {truncate(article.description, 100)}
                    </p>
                    <p className="card-text">
                        <small className="text-muted page">
                            {article.source_url}
                        </small>
                    </p>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        postedArticle: state.posts.article
    }
}

export default connect(mapStateToProps)(Article);