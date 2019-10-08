import React from 'react';
import Modal from 'react-modal';
import {NavLink} from 'react-router-dom';

const UpgradeModal = ({isOpen}) => (
    <Modal isOpen={isOpen} ariaHideApp={false}>
        <div>You need to upgrade to unlock this feature.
            <NavLink to="/settings/billing">Upgrade</NavLink>
        </div>
    </Modal>
);

export default UpgradeModal;