import React from 'react';
import PropTypes from 'prop-types';

class DisplayOptions extends React.Component {
  static propTypes = {
    setView: PropTypes.func.isRequired
  };
  
  render() {
    const { setView } = this.props;

    return (
      <div className="options-container">
        <div className="icons">
          <div onClick={() => setView('grid')}>
            <img src="/images/icons/grid.svg" />
          </div>
          <div onClick={() => setView('list')}>
            <img src="/images/icons/list.svg" />
          </div>
        </div>
      </div>
    );
  }
}

export default DisplayOptions;
