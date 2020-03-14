import { Modal as AntdModal } from 'antd';

const Modal = ({ type, ...props }) => {
  return AntdModal[type]({
    className: 'alert-modal',
    icon: null,
    okType: 'link',
    centered: true,
    ...props
  });
}

export default Modal;
