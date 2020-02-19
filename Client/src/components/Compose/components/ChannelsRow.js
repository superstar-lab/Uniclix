import React from 'react';
import PropTypes from 'prop-types';

class ChannelsRow extends React.Component {
  static propTypes = {
    publishChannels: PropTypes.array.isRequired,
    setShowSelectAccount: PropTypes.func.isRequired,
  };

  toggleSelectChannelsModal = () => {
    this.props.setShowSelectAccount(!this.props.showSelectAccounts);
  };

  render() {
    const { publishChannels } = this.props;

    return (
      <div className="channels-section">
        {
          publishChannels && publishChannels
            .map(({ type, avatar, selected }, index) => {
              return selected ? (
                <div key={`${type}-${index}`}>
                  <img src={avatar} />
                  <i className={`fab fa-${type} ${type}_bg`} />
                </div>
              ) :
              ''
            })
        }
        <div className="circle" onClick={this.toggleSelectChannelsModal}>
            <i className="fa fa-plus" />
        </div>
      </div>
    );
  }
}

export default ChannelsRow;
