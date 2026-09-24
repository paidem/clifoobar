import React, {useState} from 'react';
import {Button, Form, Header, Modal, TextArea} from "semantic-ui-react";
import ModalBase from "./ModalBase";

function EditCopyModal({handleClose, data}) {
    const [body, setBody] = useState(data.snippet.body);

    const copy = () => {
        data.onCopy(body);
        handleClose();
    };

    return (
        <ModalBase size="large" handleClose={handleClose} closeOnEscape>
            <Header icon='copy outline' content={data.snippet.name}/>
            <Modal.Content>
                <Form>
                    <TextArea
                        autoFocus
                        value={body}
                        onChange={(e, {value}) => setBody(value)}
                        rows={Math.min(body.split(/\r\n|\r|\n/).length + 1, 30)}
                        style={{fontFamily: 'monospace'}}
                    />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={handleClose}>Close</Button>
                <Button color='orange' icon='copy outline' content='Copy' onClick={copy}/>
            </Modal.Actions>
        </ModalBase>
    );
}

export default EditCopyModal;
