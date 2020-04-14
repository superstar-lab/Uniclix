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
    const selectedAccount = accounts.filter(({ id }) => selectedAccounts.has(id));

    return selectedAccount[0].type;
  }

  // This will determine the accounts that are going to be shown in the list
  setSelectedMedia = (media) => this.setState({ selectedMedia: media });

  onClickAccount = (id) => {
    const { selectedAccounts } = this.state;

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

  render() {
    const { selectedAccounts, orderedAccounts, selectedMedia } = this.state;

    const availableSocialMedias = Object.keys(orderedAccounts);

    return (
      <div className="modal-content main-modal-style">
        <div className="modal-header-container">
            <h3>Select social accounts</h3>
        </div>
        <div className="modal-body scrollable-400 scrollbar">
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
          <div className="modal-results col-md-8">
            {
              orderedAccounts[selectedMedia].map(({ details: { channel_id }, avatar, name}) => (
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
                      />
                      <span className="checkmark"></span>
                      <img
                        className="avatar-box"
                        onError={(e) => e.target.src='/images/dummy_profile.png'}
                        src={avatar}
                      />
                        {name}
                  </label>
              </div>  
              ))
            }
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

const mapStateToProps = (state) => ({ accounts: filterFacebookProfiles(state.channels.list) });

export default connect(mapStateToProps, { updatePublishChannels, setShowSelectAccount })(SelectAccountsModal);
