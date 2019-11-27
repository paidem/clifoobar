import React from 'react';
import {Modal} from "semantic-ui-react";

function ModalBase({children, handleClose, size, style, className}) {
    return (
        <Modal
            open={true}
            onClose={handleClose}
            size={size || 'small'}
            centered={false}
            closeOnDimmerClick={false}
            onKeyDown={(event) => {
                let code = event.charCode || event.keyCode;
                code === 27 && handleClose();
            }}
            style={style}
            className={className}
        >
            {children}
        </Modal>
    );
}

export default ModalBase;