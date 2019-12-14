import React, {useContext, useState} from 'react';
import {
    Button,
    Checkbox,
    Container,
    Dropdown,
    Form,
    Grid,
    Header,
    Icon,
    Input,
    Message,
    Modal,
    Segment
} from "semantic-ui-react";
import uuid from 'react-uuid'
import Tags from '@yaireo/tagify/dist/react.tagify'

import {AppContext} from "../../Context/AppContext";
import {ActionsContext} from "../../Context/ActionsContext";
import ModalBase from "./ModalBase";
import {sortArrayOfObjects} from "../../Utils/sortArrayOfObjects";
import '../../Utils/CodeMirrorPartsLoader.js'
import {Controlled as CodeMirror} from 'react-codemirror2'
import {getLanguageMode, getShowLineNumbers} from "../../Utils/CodeMirrorHelpers";
import ReactMarkdown from "react-markdown";

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
    const [previewDescription, setPreviewDescription] = useState(false);
    const [deleteConfirmationActive, setDeleteConfirmationActive] = useState(false);

    // We HAVE to set empty array here, otherway we are reusing tags from previous snippt, as array are by reference
    // DO NOT optimize and DO NOT move "tags: []" to snippetDefaultValues
    const [snippetData, setSnippetData] = useState((data && data.edit) ? data.snippet : {
        ...snippetDefaultValues,
        tags: []
    });

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
        update[event.target.name] = event.target.value;
        setSnippetData(s => ({...s, ...update}));
    };

    const handleBodyInputChange = (editor, data, value) => {
        setSnippetData(s => ({...s, body: value}));
    };

    const handleDescriptionInputChange = (editor, data, value) => {
        setSnippetData(s => ({...s, description: value}));
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
                                          setSnippetData(s => ({...s, personal: eventData.checked}))
                                      }}
                            />
                            {snippetData.personal &&
                            <span style={{marginLeft: "10px", display: "inline-block", verticalAlign: "top"}}>This snippet will be only visible to you</span>}
                        </Form.Field>
                    </Form.Group>
                    <Form.Field>
                        <strong>Description</strong> (<a target='_blank'
                                                         href='https://www.markdownguide.org/cheat-sheet/'>markdown</a>)
                        <span style={{float: 'right'}}>
                            Preview &nbsp;
                            <Checkbox toggle
                                      checked={previewDescription}
                                      onChange={(event, eventData) => {
                                          setPreviewDescription(eventData.checked)
                                      }}
                            />
                        </span>

                        <Segment>
                            <Grid columns={previewDescription ? 2 : 1} divided>
                                <Grid.Row>
                                    <Grid.Column>
                                        <CodeMirror
                                            name="description"
                                            value={snippetData.description}
                                            onBeforeChange={handleDescriptionInputChange}
                                            options={{
                                                mode: 'markdown',
                                                lineNumbers: false,
                                                theme: 'default'
                                            }}/>
                                    </Grid.Column>
                                    {previewDescription && <Grid.Column>
                                        <ReactMarkdown source={snippetData.description}/>
                                    </Grid.Column>}
                                </Grid.Row>
                            </Grid>
                        </Segment>

                    </Form.Field>
                    <Form.Field>
                        <label style={{maxWidth: "200px", float: "left", paddingTop: "15px"}}>Snippet</label>
                        <Dropdown
                            clearable
                            search
                            selection
                            value={snippetData.language}
                            options={sortArrayOfObjects(appState.languages, "text").map(lang => ({
                                key: uuid(),
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
                        <CodeMirror
                            name="body"
                            value={snippetData.body}
                            onBeforeChange={handleBodyInputChange}
                            options={{
                                mode: getLanguageMode(snippetData.language),
                                lineNumbers: getShowLineNumbers(snippetData.language),
                                theme: 'dracula'
                            }}/>

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