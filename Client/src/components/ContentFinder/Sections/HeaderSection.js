import React from 'react';
import PropTypes from 'prop-types';

class HeaderSection extends React.Component {
  static propTypes = {
    showTopics: PropTypes.bool.isRequired,
    toggleKeywords: PropTypes.func.isRequired
  };

  render() {
    const { showTopics, toggleKeywords } = this.props;

    return (
      <div className={`header ${!showTopics ? 'articles' : ''}`}>
        <h2>Content Finder</h2>
        <div className="description-container">
          <div className="description">Selecting at least 3 keywords of your interest</div>
          {
            !showTopics && (
              <div
                onClick={toggleKeywords}
                className="toggle-keywords">
                  Configure keywords
              </div>
            )
          }
        </div>
        {
          !showTopics && <div className="seperator"></div>
        }
      </div>
    );
  }
}

export default HeaderSection;
