import React from 'react';
import { Modal as AntdModal } from 'antd';
import ReactModal from 'react-modal';

const FunctionModal = ({ type, ...props }) => {
  return AntdModal[type]({
    className: 'alert-modal',
    icon: null,
    okType: 'link',
    centered: true,
    ...props
  });
}

export const Modal = ({ title, message, onOk, onCancel, className, isOpen }) => {
  return (
    <ReactModal
      ariaHideApp={false}
      className={`custom-modal ${className}`}
      isOpen={isOpen}
    >
      <div className="modal-title">{title}</div>
      <div className="modal-content1">{message}</div>
      <div style={{float:'right'}}>
        { !!onCancel && <button onClick={onCancel} className="modalBtn" >No</button>}
        <button onClick={onOk} className="modalBtn" >Yes</button>
      </div>
    </ReactModal>
  );
};

export default FunctionModal;
