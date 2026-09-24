import React from 'react';
import {Modal} from "semantic-ui-react";

function ModalBase({children, handleClose, size, style, className, closeOnEscape = false}) {
    return (
        <Modal
            open={true}
            onClose={handleClose}
            size={size || 'small'}
            centered={false}
            closeOnDimmerClick={false}
            closeOnEscape={closeOnEscape}
            style={style}
            className={className}
        >
            {children}
        </Modal>
    );
}

export default ModalBase;