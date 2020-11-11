import React from 'react';
import Modal from 'react-modal';
import { Tabs, Button } from 'antd';

const { TabPane } = Tabs

class SelectAccountsModal extends React.Component{

    state = {
        addedAccounts: []
    }

    addAccount = (account) => {
        this.setState(() => ({
            addedAccounts: [...this.state.addedAccounts, account]
        }));
    };

    removeAccount = (account) => {
        this.setState(() => ({
            addedAccounts: this.state.addedAccounts.filter( target => target !== account )
        }));
    };

    renderAccount = account => {
        return (
            <AccountItem
                key={account.id}
                account={account}
                removeAccount={this.removeAccount}
                addAccount={this.addAccount}
            />
        )
    }

    renderLinkedinTabs = () => {
        const { accounts } = this.props;

        return (
            <Tabs animated={false}>
                <TabPane tab="Linkedin pages" key="1">
                    {
                        accounts.length ?
                        accounts.map(this.renderAccount) :
                            <div className="no-accounts-msg">There are no pages to be added</div>
                    }
                </TabPane>
            </Tabs>
        )
    }

    renderFacebookTabs = () => {
        const fbAccounts = { pages: [], groups: [] };
        const { accounts } = this.props;

        accounts.map(account => {
            if (account.type === 'page') fbAccounts.pages.push(account);
            if (account.type === 'group') fbAccounts.groups.push(account);
        });

        return (
            <Tabs animated={false}>
                <TabPane tab="Facebook pages" key="0">
                    {
                        fbAccounts.pages.length ?
                            fbAccounts.pages.map(this.renderAccount) :
                            <div className="no-accounts-msg">There are no pages to be added</div>
                    }
                </TabPane>
                <TabPane tab="Facebook groups" key="1">
                    {
                        fbAccounts.groups.length ?
                            fbAccounts.groups.map(this.renderAccount) :
                            <div className="no-accounts-msg">There are no groups to be added</div>
                    }
                </TabPane>
            </Tabs>
        )
    }

    renderTabs = () => {
        const { socialMedia } = this.props;

        switch(socialMedia) {
            case 'facebook':
                return this.renderFacebookTabs();
            case 'linkedin':
                return this.renderLinkedinTabs();
        }
    }

    render(){
        const {isOpen, onSave, error, closeModal, socialMedia} = this.props;

        return (
            <Modal
                isOpen={isOpen}
                ariaHideApp={false}
                className="account-select-modal"
            >       
                <div className="modal-title">
                    { socialMedia === 'facebook' ? 
                        'Select groups and pages to connect' :
                        'Select pages to connect'
                    }
                </div>

                <div className="close-icon" onClick={closeModal}>
                    <img src="/images/monitor-icons/close.svg" />
                </div>
                { this.renderTabs() }
                <div className="modal-btns">
                    {!!error && <div className="alert-danger">{error}</div>}
                    <Button
                        type="link"
                        onClick={() => closeModal()}
                        className="cancel"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        shape="round"
                        onClick={() => onSave(this.state.addedAccounts)}
                        className="connect" 
                    >
                        Connect
                    </Button>
                </div>
        
            </Modal>
        );        
    }
}

class AccountItem extends React.Component{
    state = {
        added: false
    }

    toggleAdded = () => {
        this.setState(() => ({
            added: !this.state.added
        }), () => {
            if(this.state.added){
                this.props.addAccount(this.props.account);
            }else{
                this.props.removeAccount(this.props.account);
            }
        })
    };

    render(){
        const { added } = this.state
        const {account} = this.props;

        return (                
            
                <div
                    className={`account-item-container bottom-border ${added ? 'selected': ''}`}
                    onClick={this.toggleAdded}
                >
                    <div className="account-info">
                        <img src={account.avatar} className="account-img"></img>
                        <div className="name">{account.name}</div>
                    </div>
                    { added && <i className="fa fa-check" />}
                </div>
        );
    }
}

export default SelectAccountsModal;