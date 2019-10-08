import React from 'react';
import Modal from 'react-modal';

const InfoModal = ({isOpen, title, body, action}) => (
    <Modal isOpen={isOpen} ariaHideApp={false} className="info-modal-container">
        <div className="info-modal">
            <img src="/images/hello_bubble_smiley.svg" />
            <h3>{title}</h3>
            <p>{body}</p>
            <button className="magento-btn" onClick={action}>Get Started</button>
        </div>
    </Modal>
);

export default InfoModal;