import React from 'react';
import { connect } from 'react-redux'
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import { Select, Button } from 'antd';

import { validateEmail } from '../../../../utils/validator'
import { updateTeamMember } from '../../../../requests/team';

import FunctionModal from '../../../Modal';
import Loader from '../../../Loader';

const { Option } = Select;

class AddMemberModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    channels: PropTypes.array.isRequired,
    teamId: PropTypes.number.isRequired,
    refreshMembers: PropTypes.func.isRequired,
    editMember: PropTypes.object
  }

  constructor(props) {
    super(props);

    let member = {
      name: '',
      email: '',
      isAdmin: '',
      accountsGroups: [
        []
      ],
      accountsGroupsRoles: ['']
    }

    if (!!props.editMember) {
      member = this.prepareMemeberToEdit();
    }

    this.state = {
      ...member,
      remainingAccountOptions: [ ...props.channels ],
      isLoading: false,
      errors: []
    }
  }

  componentDidUpdate(prevProps) {
    if (!!this.props.editMember && prevProps.editMember !== this.props.editMember) {
      const member = this.prepareMemeberToEdit();
      const remainingAccountOptions = this.getRemaningOptions();
      this.setState({ ...member, remainingAccountOptions });
    }

    if (prevProps.channels !== this.props.channels) {
      let remainingAccountOptions = [ ...this.props.channels ]
      if (this.props.editMember) {
        remainingAccountOptions = this.getRemaningOptions();
      }
      this.setState({ remainingAccountOptions });
    }
  }

  getRemaningOptions = () => {
    const { channels, editMember: { assignedChannels } } = this.props;
    const remaningAccounts = channels.filter(channel => {
      const i = assignedChannels.findIndex(selected => selected.id === channel.id);
      return i === -1;
    });

    return remaningAccounts;
  }

  // This function gets the data that came from the editMember
  // and shape it to match with what the component needs
  prepareMemeberToEdit() {
    const { editMember: { is_admin, assignedChannels, details: { name, email } } } = this.props;
    const member = {};

    member.name = name
    member.email = email;
    member.isAdmin = is_admin ? 'true' : 'false';
    member.accountsGroups = [];
    member.accountsGroupsRoles = [];
    assignedChannels.forEach(({ permissionLevel, ...channel }) => {
      // First we get the role group index
      const groupIndex = member.accountsGroupsRoles.indexOf(permissionLevel);
      if (groupIndex === -1) {
        // If the role was not saved yet, we push the channel in a new array into the
        // accountsGroups array and the role into the accountsGroupsRoles array
        member.accountsGroups.push([ channel ]);
        member.accountsGroupsRoles.push(permissionLevel);
      } else {
        // If already exists, we add it into the corresponding array
        member.accountsGroups[groupIndex].push(channel);
      }
    });

    return member;
  }

  onEmailChange = (e) => {
    this.setState({ email: e.currentTarget.value });
  }

  onNameChange = (e) => {
    this.setState({ name: e.currentTarget.value });
  }

  onRoleChange = (value) => {
    this.setState({ isAdmin: value });
  }

  onAddAccount = groupIndex => id => {
    const { accountsGroups, remainingAccountOptions } = this.state;
    // We get all the options with an id different to the one sent
    const remainingOptions = remainingAccountOptions.filter(option => option.id !== id);
    // Now we get the choosen channel and add it to the group
    const selectedChannel = remainingAccountOptions.find(channel => channel.id === id);
    accountsGroups[groupIndex].push(selectedChannel);

    this.setState({
      accountsGroups: [...accountsGroups],
      remainingAccountOptions: [ ...remainingOptions ]
    });
  }

  onRemoveAccount = groupIndex => id => {
    const { accountsGroups, remainingAccountOptions } = this.state;
    const selectedChannel = accountsGroups[groupIndex].find(option => option.id === id);

    accountsGroups[groupIndex] = accountsGroups[groupIndex].filter(option => option.id !== id);
    remainingAccountOptions.push(selectedChannel);

    this.setState({
      accountsGroups: [...accountsGroups],
      remainingAccountOptions: [ ...remainingAccountOptions ]
    });
  }

  addNewGroup = () => {
    this.setState({
      accountsGroups: [ ...this.state.accountsGroups, [] ],
      accountsGroupsRoles: [ ...this.state.accountsGroupsRoles, '' ]
    });
  };

  onGroupRoleChange = groupIndex => value => {
    const { accountsGroupsRoles } = this.state;
    accountsGroupsRoles[groupIndex] = value;
    this.setState({ accountsGroupsRoles: [ ...accountsGroupsRoles ] })
  };

  closeModal = () => {
    // We reset the modal
    this.setState({
      name: '',
      email: '',
      isAdmin: '',
      accountsGroups: [
        []
      ],
      accountsGroupsRoles: [''],
      remainingAccountOptions: [ ...this.props.channels ],
      isLoading: false
    })
    this.props.toggleModal();
  };

  isSaveDisabled = () => {
    const { name, email, isAdmin, accountsGroups, accountsGroupsRoles } = this.state;

    if (!name.length) {
      return true;
    }

    if (!email.length || !validateEmail(email)) {
      return true;
    }

    if (!isAdmin.length) {
      return true;
    }

    let groupsFilled = false;
    accountsGroups.forEach(group => {if (!group.length) groupsFilled = true});
    if (groupsFilled) {
      return true;
    }

    let rolesFilled = false;
    accountsGroupsRoles.forEach(roles => {if (!roles.length) groupsFilled = true});
    if (rolesFilled) {
      return true;
    }

    return false;
  };

  onSaveMember = () => {
    const assignedChannels = [];
    const { name, email, isAdmin, accountsGroups, accountsGroupsRoles } = this.state;
    const { teamId, refreshMembers } = this.props;

    accountsGroups.forEach((group, i) => {
      group.forEach(account => {
        account.permissionLevel = accountsGroupsRoles[i];
        assignedChannels.push(account)
      });
    });

    const data = {
      name,
      email,
      isAdmin: isAdmin === 'true' ? 1 : 0,
      teamId,
      assignedChannels
    };

    this.setState({ isLoading: true });
    updateTeamMember(data)
      .then(() => {
        this.setState({ isLoading: false });
        this.closeModal();
        refreshMembers();
      })
      .catch(err => {
        this.setState({ isLoading: false });
        FunctionModal({
          type: 'error',
          title: 'Error',
          content: 'There was an error trying to save the new member, please try again later.'
        })
        console.log(err);
      });
  };

  render() {
    const { isOpen, editMember } = this.props;
    const { name, email, isAdmin, accountsGroups, remainingAccountOptions, accountsGroupsRoles, isLoading } = this.state;

    return (
      <ReactModal
        ariaHideApp={false}
        className="add-memeber-modal"
        isOpen={isOpen}
      >
        <div className="add-member-title">
          Add team member
        </div>
        <div className="name-section">
          <label htmlFor="name">Name</label>
          <input
            type="name"
            className="form-control"
            onChange={this.onNameChange}
            value={name}
            placeholder="John Doe"
            id="name"
            name="name"
          />
        </div>
        <div className="email-section">
          <div>
            <label htmlFor="email">Email</label>
            <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  onChange={this.onEmailChange}
                  value={email}
                  placeholder="johndoe@example.com"
                  id="email"
                  name="email"
                  disabled={!!editMember}
                />
                <Select
                  value={isAdmin}
                  onSelect={this.onRoleChange}
                >
                    <Option key="Select Role" value="">Select Role</Option>
                    <Option key="Member" value="false">Member</Option>
                    <Option key="Admin" value="true">Admin</Option>
                </Select>
            </div>
          </div>
        </div>
        <div>
          <label>Accounts</label>
          {
            accountsGroups.map((group, groupIndex) => (
              <div className="input-group accounts-group-container">
                <Select
                  mode="multiple"
                  showArrow
                  style={{ width: '100%' }}
                  onSelect={this.onAddAccount(groupIndex)}
                  onDeselect={this.onRemoveAccount(groupIndex)}
                  value={group.map(account => account.id)}
                >
                  {
                    [...group, ...remainingAccountOptions].map(account => (
                      <Option key={`${account.id}-${groupIndex}`} value={account.id}>
                        { account.username ? `@${account.username}` : account.name }
                      </Option>
                    ))
                  }
                </Select>
                <Select
                  value={accountsGroupsRoles[groupIndex]}
                  onSelect={this.onGroupRoleChange(groupIndex)}
                >
                    <Option key="Select Permission" value="">Select Role</Option>
                    <Option key="Select Role" value="member">Approval Required</Option>
                    <Option key="Member" value="publisher">Publisher</Option>
                </Select>
              </div>
            ))
          }
          <button onClick={this.addNewGroup} className="add-modal-button-container">
            <div className="add-modal-plus-btn">
                <i className="fa fa-plus"></i>
            </div>
            <span className="btn-label">Add Accounts Group</span>
          </button>
        </div>
        <div className="buttons-section">
          <Button type="link" onClick={this.closeModal}>Cancel</Button>
          <Button
            type="primary"
            shape="round"
            disabled={this.isSaveDisabled()}
            onClick={this.onSaveMember}
          >Save</Button>
        </div>
        { isLoading && <Loader fullscreen /> }
      </ReactModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    channels: state.channels.list
  };
};

export default connect(mapStateToProps, { updateTeamMember })(AddMemberModal);
