import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { TRENDING_TOPICS } from './config';

import AddedByYouSection from './Sections/AddedByYouSection';
import TopicButton from './Sections/TopicButton';
import SaveTopicsButton from './Sections/SaveTopicsButton';
import Loader from '../../components/Loader';

class ContentFinderLanding extends React.Component {
  static propTypes = {
    selectedTopics: PropTypes.array
  };

  state = {
    isLoading: false
  };

  setLoadingState = (value) => this.setState({ isLoading: value });

  render() {
    const { selectedTopics } = this.props;
    const { isLoading } = this.state;

    const topicsAddedBYou = selectedTopics.filter(topic => TRENDING_TOPICS.indexOf(topic) === -1);

    return (
      <div className="content-finder">
        <h2>Content Finder</h2>
        <div className="description">Articles based on your choise of keywords</div>
        <AddedByYouSection topicsAddedByYou={topicsAddedBYou} />
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
        { isLoading && <Loader fullscreen /> }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { selectedTopics: state.profile.topics };
};

export default connect(mapStateToProps, null)(ContentFinderLanding);
