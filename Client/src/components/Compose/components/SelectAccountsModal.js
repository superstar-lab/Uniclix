import React from 'react';
import { connect } from 'react-redux';
import { updatePublishChannels, setShowSelectAccount } from "../../../actions/composer";
import { filterFacebookProfiles } from '../../../utils/helpers';

class SelectAccountsModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedAccounts: new Set(props.selectedAccounts),
      orderedAccounts: this.orderAccounts(),
      selectedMedia: this.getSelectedMedia()
    }
  }

  // We group all the connected accounts by type
  orderAccounts = () => {
    const mappedAccounts = {};

    this.props.accounts.forEach(account => {
      if (mappedAccounts[account.type]) {
        mappedAccounts[account.type].push(account);
      } else {
        mappedAccounts[account.type] = [account];
      }
    });

    return mappedAccounts;
  };

  getSelectedMedia = () => {
    const { accounts, selectedAccounts } = this.props;
    let selectedAccount = accounts.filter(({ id }) => selectedAccounts.has(id));

    if (selectedAccount[0]) {
      return selectedAccount[0].type
    } else {
      selectedAccount = accounts.find(( { selected } ) => selected === 1);

      return selectedAccount.type;
    }
  }

  // This will determine the accounts that are going to be shown in the list
  setSelectedMedia = (media) => this.setState({ selectedMedia: media });

  onClickAccount = (id) => {
    const { selectedAccounts } = this.state;

    if (this.checkIfChannelDisabled()) return;

    if (selectedAccounts.has(id)) {
      selectedAccounts.delete(id);
    } else {
      selectedAccounts.add(id);
    }

    this.setState({ selectedAccounts: new Set(selectedAccounts) });
  };

  onClickDone = () => {
    const { setShowSelectAccount, updatePublishChannels } = this.props;
    updatePublishChannels(this.state.selectedAccounts);
    setShowSelectAccount(false);
  }

  // Checks if the channels is enabled
  checkIfChannelDisabled = () => {
    const { selectedMedia } = this.state;
    const { imagesAmount } = this.props;

    if (selectedMedia === 'linkedin' && imagesAmount > 1) return true;

    return false;
  }

  // Returns the correspoinding warning message
  getMessage = () => {
    const { selectedMedia } = this.state;
    const { imagesAmount } = this.props;

    if (selectedMedia === 'linkedin' && imagesAmount > 1) {
      return 'Linkedin does not allow to post more than one photo at the time';
    }
  }

  render() {
    const { selectedAccounts, orderedAccounts, selectedMedia } = this.state;

    const availableSocialMedias = Object.keys(orderedAccounts);
    const message = this.getMessage();

    return (
      <div className="modal-content main-modal-style select-account-modal">
        <div className="modal-header-container">
            <h3>Select social accounts fede</h3>
        </div>
        <div className="modal-body">
          <div className="select-account-modal-content">
            <div className="modal-menu col-md-4">
              <ul>
              {
                availableSocialMedias.map(media => (
                  <li
                    onClick={() => this.setSelectedMedia(media)}
                    className={`${selectedMedia === media ? 'selected' : ''}`}
                  >
                    <i className={`fab fa-${media} ${media}_color`}> </i> <p>{media}</p>
                  </li>
                ))
              }
              </ul>
            </div>
            <div className="modal-results accounts col-md-8 scrollable-400 scrollbar">
              { !!message && <div className="channels-message">{ message }</div> }
              {
                orderedAccounts[selectedMedia].map(({ details: { channel_id }, avatar, name, username}) => (
                  <div
                    className={
                      `channel-selection-container ${selectedAccounts.has(channel_id) && 'selected'}`
                    }
                    key={channel_id}
                  >
                    <label className="channel-item selection-container">
                        <input
                          type="checkbox"
                          onChange={() => this.onClickAccount(channel_id)}
                          defaultChecked={selectedAccounts.has(channel_id) ? 'checked' : ''}
                          name={`${selectedMedia}_channel`}
                          disabled={this.checkIfChannelDisabled()}
                        />
                        <div className="account-info">
                          <img
                            className="avatar"
                            onError={(e) => e.target.src='/images/dummy_profile.png'}
                            src={avatar}
                          />
                          <div className="names-container">
                            <span className="account-name">{name}</span>
                            { 
                              selectedMedia === 'twitter' && 
                                <span className="twitter-name">{`@${username}`}</span>
                            }
                          </div>
                        </div>
                        { selectedAccounts.has(channel_id) && <span className="fa fa-check"></span> }
                    </label>
                </div>  
                ))
              }
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="magento-btn small-btn"
              onClick={this.onClickDone}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  accounts: filterFacebookProfiles(state.channels.list),
  imagesAmount: state.composer.pictures.length
});

export default connect(mapStateToProps, { updatePublishChannels, setShowSelectAccount })(SelectAccountsModal);
