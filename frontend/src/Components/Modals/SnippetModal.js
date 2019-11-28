import React, {useContext, useEffect, useState, useCallback} from 'react';
import {
    Button,
    Checkbox, Container, Divider,
    Dropdown,
    Form,
    Grid,
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
import SnippetBodyHighlight from "../Snippets/SnippetBodyHighlight";
import Tags from '@yaireo/tagify/dist/react.tagify'

const languageOptions = [
    {key: 'accesslog', value: 'accesslog', text: 'accesslog'},
    {key: 'apache', value: 'apache', text: 'apache'},
    {key: 'autohotkey', value: 'autohotkey', text: 'autohotkey'},
    {key: 'bash', value: 'bash', text: 'Bash'},
    {key: 'cpp', value: 'cpp', text: 'C++'},
    {key: 'cs', value: 'cs', text: 'C#'},
    {key: 'dockerfile', value: 'dockerfile', text: 'dockerfile'},
    {key: 'dos', value: 'dos', text: 'dos'},
    {key: 'go', value: 'go', text: 'go'},
    {key: 'java', value: 'java', text: 'Java'},
    {key: 'javascript', value: 'javascript', text: 'JavaScript'},
    {key: 'json', value: 'json', text: 'JSON'},
    {key: 'kotlin', value: 'kotlin', text: 'kotlin'},
    {key: 'less', value: 'less', text: 'LESS'},
    {key: 'markdown', value: 'markdown', text: 'markdown'},
    {key: 'nginx', value: 'nginx', text: 'nginx'},
    {key: 'objectivec', value: 'objectivec', text: 'objectivec'},
    {key: 'pgsql', value: 'pgsql', text: 'pgsql'},
    {key: 'php', value: 'php', text: 'php'},
    {key: 'plaintext', value: 'plaintext', text: 'plaintext'},
    {key: 'properties', value: 'properties', text: 'properties'},
    {key: 'python', value: 'python', text: 'Python'},
    {key: 'ruby', value: 'ruby', text: 'Ruby'},
    {key: 'scss', value: 'scss', text: 'SCSS'},
    {key: 'shell', value: 'shell', text: 'Shell'},
    {key: 'sql', value: 'sql', text: 'SQL'},
    {key: 'swift', value: 'swift', text: 'Swift'},
    {key: 'text', value: 'text', text: 'Text'},
    {key: 'typescript', value: 'typescript', text: 'Typescript'},
    {key: 'vbnet', value: 'vbnet', text: 'VB.Net'},
    {key: 'vbscript', value: 'vbscript', text: 'VBscript'},
    {key: 'xml', value: 'xml', text: 'XML'},
    {key: 'yaml', value: 'yaml', text: 'Yaml'},
];

const snippetDefaultValues = {
    name: "",
    description: "",
    body: "",
    language: null,
    personal: false,
};

const defaultRows = {
    description: 2,
    body: 5,
};

function SnippetModal({handleClose, data = {edit: false, snippet: {}}}) {
    const [appState,] = useContext(AppContext);
    const [appActions,] = useContext(ActionsContext);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(false);
    const [deleteConfirmationActive, setDeleteConfirmationActive] = useState(false);


    const [snippetData, setSnippetData] = useState(snippetDefaultValues);
    const [rows, setRows] = useState(defaultRows);

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

    const updateRows = useCallback(({name, value}) => {
        if (defaultRows[name] > 0) {
            let numRows = value.split(/\r\n|\r|\n/).length;
            if (numRows > defaultRows[name]) {
                let rowUpdate = {};
                rowUpdate[name] = numRows;
                setRows(r => ({...r, ...rowUpdate}));
            }
        }
    }, []);

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
        update[eventData.name] = eventData.value;
        setSnippetData(s => ({...s, ...update}));
        updateRows(eventData);
    };

    const handleDelete = () => {
        appActions.deleteSnippet(data.snippet.id)
            .then(response => handleClose())
            .catch(handleApiError)
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmationActive(false);
    };

    // const onTagifyRemove = (i) => {
    //     let tags = snippetData.tags;
    //     tags.splice(i, 1);
    //     setSnippetData(s => ({...s, tags: tags}));
    // };
    //
    // const onTagifyAdd = (tag) => {
    //     let tags = snippetData.tags;
    //     tags.concat(tag);
    //     setSnippetData(s => ({...s, tags: tags}));
    // };

    // callbacks for all of Tagify's events:
    const onTagifyAdd = e => {
        setSnippetData(sd => {
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

            // Resize textareas to fit data
            updateRows({name: "description", value: data.snippet.description});
            updateRows({name: "body", value: data.snippet.body});

            // If we already have snippet, it's nice to show a preview
            setPreview(true);
        }
    }, [data, updateRows]);


    return (
        <ModalBase size="large" handleClose={handleClose} className={snippetData.personal ? 'personal' : ''}>
            <Header icon='file code outline'
                    content={(data && data.edit ? 'Edit ' : 'New ') + (snippetData.personal ? 'personal ' : '') + 'snippet'}
                // style={{backgroundColor:"#21ba45"}}
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
                        </Form.Field>
                    </Form.Group>
                    <Form.Field>
                        <label>Description</label>
                        <TextArea
                            value={snippetData.description}
                            onChange={handleInputChange}
                            name='description'
                            rows={rows.description}
                            style={{fontFamily: "monospace"}}
                        />


                    </Form.Field>
                    <Form.Field>
                        <label>Snippet</label>
                    </Form.Field>
                    <Form.Field>
                        <Grid>
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Dropdown
                                        clearable
                                        search
                                        selection
                                        value={snippetData.language}
                                        options={sortArrayOfObjects(languageOptions, "text")}
                                        onChange={(event, eventData) => {
                                            setSnippetData(s => ({...s, language: eventData.value}))
                                        }}
                                        placeholder='Select language'
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <Checkbox toggle
                                              checked={preview}
                                              onChange={(event, eventData) => {
                                                  setPreview(eventData.checked)
                                              }}
                                    />
                                    &nbsp;Preview
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={preview ? 2 : 1} divided>
                                <Grid.Column>
                                    <TextArea
                                        value={snippetData.body}
                                        onChange={handleInputChange}
                                        name='body'
                                        rows={rows.body}
                                        style={{fontFamily: "monospace", color: "#FFFFFF", backgroundColor: "#000000"}}
                                    />
                                </Grid.Column>
                                {preview &&
                                <Grid.Column>
                                    <div style={{lineHeight: 1.25}}>
                                        <SnippetBodyHighlight
                                            snippet={{body: snippetData.body, language: snippetData.language}}/>
                                    </div>
                                </Grid.Column>
                                }
                            </Grid.Row>
                        </Grid>
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
                                <Button onClick={handleDeleteCancel}>Cancel</Button>
                                <Button.Or/>
                                <Button negative onClick={handleDelete}>Delete</Button>
                            </Button.Group>
                            :
                            <Button
                                color='red'
                                disabled={!data || !data.edit}
                                onClick={() => setDeleteConfirmationActive(true)}>
                                <Icon name='delete'/> Delete
                            </Button>
                        }
                    </Container>
                </Form>
            </Modal.Content>
        </ModalBase>
    );
}

export default SnippetModal;