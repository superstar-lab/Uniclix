import React from 'react';
import Modal from 'react-modal';

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

    render(){
        const {isOpen, accounts, onSave, error, closeModal} = this.props;
        return (
            <Modal
            isOpen={isOpen}
            ariaHideApp={false}
            className="account-select-modal"
            >       
        
                <div className="center-inline p10 m10-top">
                    Select Accounts
                </div>

                <div className="close-icon" onClick={closeModal}>
                    <img src="/images/monitor-icons/close.svg" />
                </div>

                <div className="center-inline p10 m10-top">
                    <div className="form-group center-inline account-items-wrapper top-border">
                        {accounts.map(account => (
                            <AccountItem key={account.id} account={account} removeAccount = {this.removeAccount} addAccount={this.addAccount} />
                        ))}
                    </div>
                </div>

                <div className="center-inline p10">
                    {!!error && <div className="alert-danger">{error}</div>}
                    <button onClick={() => onSave(this.state.addedAccounts)} className="upgrade-btn fat-btn-filled">Save</button>
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
        const actionBtn = this.state.added ? "sub-btn" : "add-btn";
        const {account} = this.props;

        return (                
            
                <div className="account-item-container bottom-border">
                    <div>
                        <img src={account.avatar} className="account-img"></img>
                    </div>
                    <h5 className="ps10">{account.name}</h5>
                    <div className={`${actionBtn} action-btn`} onClick={this.toggleAdded}>
                        {this.state.added ?
                            <i className="fa fa-minus-circle"></i>
                        :
                            <i className="fa fa-plus-circle"></i>
                        }
                        
                    </div>
                </div>
        );
    }
}

export default SelectAccountsModal;