import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { TRENDING_TOPICS } from './config';

import HeaderSection from './Sections/HeaderSection';
import DisplayOptions from './Sections/DisplayOptions';
import AddedByYouSection from './Sections/AddedByYouSection';
import TopicButton from './Sections/TopicButton';
import SaveTopicsButton from './Sections/SaveTopicsButton';
import Articles from './Sections/Articles';
import Loader from '../../components/Loader';
import Compose from '../../components/Compose';

class ContentFinderLanding extends React.Component {
  static propTypes = {
    selectedTopics: PropTypes.array
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      showTopics: !props.selectedTopics.length,
      articlesView: 'grid',
      filterTopics: []
    };
  }

  toggleKeywords = () => this.setState({ showTopics: !this.state.showTopics });

  setLoadingState = (isLoading, showTopics = true) => this.setState({
    isLoading,
    showTopics
  });

  setArticlesView = (value) => this.setState({ articlesView: value });

  setFilterTopic = (topic) => {
    this.setState({ filterTopics: [ ...this.state.filterTopics, topic.toUpperCase() ] });
  }

  deleteFilterTopic = (topic) => {
    const { filterTopics } = this.state;
    const topicIndex = filterTopics.indexOf(topic);

    filterTopics.splice(topicIndex, 1);
    this.setState({ filterTopics: [ ...filterTopics ] })
  };

  render() {
    const { selectedTopics } = this.props;
    const { isLoading, showTopics, filterTopics } = this.state;

    const topicsAddedBYou = selectedTopics.filter(topic => TRENDING_TOPICS.indexOf(topic) === -1);

    return (
      <div className="content-finder">
        <HeaderSection showTopics={showTopics} toggleKeywords={this.toggleKeywords} />
        {
          showTopics && (
            <React.Fragment>
              <AddedByYouSection topicsAddedByYou={topicsAddedBYou} allTopics={selectedTopics} />
                <div className="seperator mt20 mb20"></div>
                <span className="sub-title">Trending Topics</span>
                <div className="topics">
                  {
                    TRENDING_TOPICS.map((topic, index) => (
                      <TopicButton
                        key={`${index}-${topic}`}
                        topic={topic}
                        isSelected={selectedTopics.indexOf(topic) !== -1}
                      />
                    ))
                  }
                </div>
              <SaveTopicsButton
                setLoading={this.setLoadingState}
                selectedTopics={selectedTopics}
              />
            </React.Fragment>
          )
        }
        {
          !showTopics && (
            <React.Fragment>
              <DisplayOptions
                setView={this.setArticlesView}
                selectedTopics={this.props.selectedTopics}
                setFilterTopic={this.setFilterTopic}
                deleteFilterTopic={this.deleteFilterTopic}
              />
              <Articles filterTopics={filterTopics} />
            </React.Fragment>
          )
        }
        <Compose />
        { isLoading && <Loader fullscreen /> }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { selectedTopics: state.profile.topics };
};

export default connect(mapStateToProps, null)(ContentFinderLanding);
