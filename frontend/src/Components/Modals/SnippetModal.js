import React, {useContext, useEffect, useState} from 'react';
import {
    Button,
    Checkbox,
    Container,
    Dropdown,
    Form,
    Header,
    Icon,
    Input,
    Message,
    Modal,
    TextArea
} from "semantic-ui-react";
import {AppContext} from "../../Context/AppContext";
import {ActionsContext} from "../../Context/ActionsContext";
import ModalBase from "./ModalBase";
import {sortArrayOfObjects} from "../../Utils/sortArrayOfObjects";
import Tags from '@yaireo/tagify/dist/react.tagify'

import SnippetHighlighter from "../SnippetHighlighter/SnippetHighlighter";

const snippetDefaultValues = {
    name: "",
    description: "",
    body: "",
    language: null,
    personal: false,
};

function SnippetModal({handleClose, data = {edit: false, snippet: {}}}) {
    const [appState,] = useContext(AppContext);
    const [appActions,] = useContext(ActionsContext);
    const [error, setError] = useState(null);
    // const [preview, setPreview] = useState(false);
    const [deleteConfirmationActive, setDeleteConfirmationActive] = useState(false);

    // We HAVE to set empty array here, otherway we are reusing tags from previous snippt, as array are by reference
    // DO NOT optimize and DO NOT move "tags: []" to snippetDefaultValues
    const [snippetData, setSnippetData] = useState({...snippetDefaultValues, tags: []});

    const handleApiError = (error) => {
        if (error.response && error.response.data && error.response.data.detail) {
            setError(error.response.data.detail);
        } else if (error.response && error.response.data) {
            setError(JSON.stringify(error.response.data));
        } else {
            // objects are not valid react child and we render error verbatim, so to make it string, concat
            setError("" + error);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        appActions.saveSnippet(snippetData, data && data.edit)
            .then(response => {
                handleClose();
            })
            .catch(handleApiError)
    };

    const handleInputChange = (event, eventData) => {
        let update = {};
        // Remove empty lines at start of input, because it confuses hightlighter
        let newValue = event.target.value.replace(/^(\r\n|\n|\r)/g,"");
        update[event.target.name] = newValue 
        setSnippetData(s => ({...s, ...update}));
    };

    const handleDelete = (e) => {
        e.preventDefault();
        appActions.deleteSnippet(data.snippet.id)
            .then(response => handleClose())
            .catch(handleApiError)
    };

    const handleDeleteCancel = (e) => {
        e.preventDefault();
        setDeleteConfirmationActive(false);
    };

    // callbacks for all of Tagify's events:
    const onTagifyAdd = e => {
        setSnippetData(sd => {
            sd.tags = sd.tags || []; // if sd.tags does not exist - create it
            sd.tags.push(e.detail.data.value);
            return sd;
        });
    };

    const onTagifyRemove = e => {
        setSnippetData(sd => {
            sd.tags.splice(sd.tags.indexOf(e.detail.data.value), 1);
            return sd;
        })
    };

    // const onTagifyInput = e => {
    //     console.log('input:', e.detail);
    // }

    // const onTagifyInvalid = e => {
    //     console.log('invalid:', e.detail);
    // };

    const tagifySettings = {
        whitelist: appState.tags,
        callbacks: {
            add: onTagifyAdd,
            remove: onTagifyRemove,
            // input: onTagifyInput,
            // invalid: onTagifyInvalid
        }
    };

    // Load data if we are in edit mode
    useEffect(() => {
        if (data && data.edit) {
            setSnippetData(data.snippet);
        }
    }, [data]);

    return (
        <ModalBase size="large" handleClose={handleClose} className={snippetData.personal ? 'personal' : ''}>
            <Header icon='file code outline'
                    content={(data && data.edit ? 'Edit ' : 'New ') + (snippetData.personal ? 'personal ' : '') + 'snippet'}
            />
            <Modal.Content>
                {error && <Message negative content={error}/>}
                <Form onSubmit={submit}>
                    <Form.Field>
                        <label>Name</label>
                        <Input
                            value={snippetData.name}
                            onChange={handleInputChange}
                            name='name'
                            autoFocus={true}/>
                    </Form.Field>
                    <Form.Group widths='equal'>
                        <Form.Field>
                            <label>Tags</label>
                            <Tags mode='textarea'
                                // autofocus={true}
                                  className='tagsInput'
                                  name='tags'
                                  settings={tagifySettings}
                                  initialValue={data && data.snippet && data.snippet.tags && data.snippet.tags.join(', ')}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Personal snippet</label>
                            <Checkbox toggle
                                      checked={snippetData.personal}
                                      onChange={(event, eventData) => {
                                          console.log(eventData);
                                          setSnippetData(s => ({...s, personal: eventData.checked}))
                                      }}
                            />
                            {snippetData.personal &&
                            <span style={{marginLeft: "10px", display: "inline-block", verticalAlign: "top"}}>This snippet will be only visible to you</span>}
                        </Form.Field>
                    </Form.Group>
                    <Form.Field>
                        <label>Description</label>
                        <TextArea
                            value={snippetData.description}
                            onChange={handleInputChange}
                            name='description'
                            rows={Math.min(10, Math.max(3, snippetData.description && snippetData.description.split(/\r\n|\r|\n/).length))}
                            style={{fontFamily: "monospace"}}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label style={{maxWidth: "200px", float: "left", paddingTop: "15px"}}>Snippet</label>
                        <Dropdown
                            clearable
                            search
                            selection
                            value={snippetData.language}
                            options={sortArrayOfObjects(appState.languages, "text").map(lang => ({
                                key: lang.code,
                                value: lang.code,
                                text: lang.name
                            }))}
                            style={{maxWidth: "200px", marginBottom: "10px", float: "right"}}
                            onChange={(event, eventData) => {
                                setSnippetData(s => ({...s, language: eventData.value}))
                            }}
                            placeholder='Select language'
                        />
                        <label style={{
                            maxWidth: "200px",
                            float: "right",
                            paddingTop: "15px"
                        }}>Language&nbsp;&nbsp;&nbsp;</label>
                    </Form.Field>
                    <Form.Field>
                        {/*<EditableHighlightArea*/}
                        {/*    name="body"*/}
                        {/*    language={snippetData.language}*/}
                        {/*    value={snippetData.body}*/}
                        {/*    onChange={handleInputChange}*/}
                        {/*    wrapperStyle={{height: Math.min(300, snippetData.body.split(/\r\n|\r|\n/).length*17)}}*/}
                        {/*/>*/}
                        <SnippetHighlighter
                            editable={true}
                                name="body"
                            language={snippetData.language}
                            value={snippetData.body}
                            onChange={handleInputChange}
                            wrapperStyle={{height: Math.min(300, snippetData.body.split(/\r\n|\r|\n/).length*17)}}
                        />

                    </Form.Field>
                    <Container fluid style={{display: "flex", justifyContent: "space-between"}}>
                        <div>
                            <Button type='submit' color='green'>
                                <Icon name='checkmark'/> {(data && data.edit) ? 'Save' : 'Create'}
                            </Button>
                            <Button
                                color='grey'
                                basic
                                onClick={handleClose}>
                                <Icon name='stop'/> Cancel
                            </Button>
                        </div>
                        {deleteConfirmationActive ?
                            <Button.Group>
                                <Button negative onClick={handleDelete}>Delete</Button>
                                <Button.Or/>
                                <Button onClick={handleDeleteCancel}>Cancel</Button>
                            </Button.Group>
                            :
                            <Button
                                color='red'
                                disabled={!data || !data.edit}
                                onClick={() => setDeleteConfirmationActive(true)}>
                                Delete
                            </Button>
                        }
                    </Container>
                </Form>
            </Modal.Content>
        </ModalBase>
    );
}

export default SnippetModal;