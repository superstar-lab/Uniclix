import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { LoaderWithOverlay } from "../../Loader";

class RenameTabModal extends React.Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        tabData: PropTypes.object.isRequired,
        onClose: PropTypes.func.isRequired,
        onRenameSuccess: PropTypes.func.isRequired
    }

    state = {
        tabData: { title: '' },
        loading: false,
        error: false,
        success: false
    };

    componentWillMount() {
        this.setState({ tabData: this.props.tabData });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tabData != {})
            this.setState({ tabData: nextProps.tabData });
    }

    onNameChange = (e) => {
        let value = e.target.value;
        this.setState((prevState) => ({
            ...prevState,
            tabData: {
                ...prevState.tabData,
                title: value
            }
        }));
        if (value == '')
            this.setState({ error: 'Tab name cannot be empty.' });
        else
            this.setState({ error: false });
    };

    onSubmit = () => {
        let _this = this;
        if (_this.state.tabData.title == '') return;

        _this.setState({ loading: true });
        window.setTimeout(function () { _this.setState({ loading: false }); _this.props.onRenameSuccess(_this.state.tabData); }, 1000);
    }

    render() {
        const {
            props: {
                isOpen,
                onClose
            },
            state: {
                tabData,
                error,
                success,
                loading
            },
            onNameChange,
            onSubmit
        } = this;

        return (
            <Modal
                isOpen={isOpen}
                ariaHideApp={false}
                className="team-modal"
            >
                <div className="main-modal-style">
                    <div className="modal-header-container">
                        <h3>Change tab name</h3>
                    </div>
                    {loading ? <LoaderWithOverlay /> : null}
                    <div className="modal-body">
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}
                        <div className="profile-form">
                            <div className="scrollbar">
                                <div className="col-12 col-md-12 form-field m-sm">
                                    <div className="input-group">
                                        <input type="name" className="form-control" id="tab-name" onChange={(e) => onNameChange(e)} value={tabData.title} placeholder="Please input the tab name" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="magento-btn small-btn modal-btn pull-right" onClick={() => onSubmit()}>Submit</button>
                        <button onClick={() => onClose()} className="btn btn-link pull-right modal-btn2 ">Cancel</button>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default RenameTabModal;