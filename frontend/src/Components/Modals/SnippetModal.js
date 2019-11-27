import React, {useContext, useEffect, useState, useCallback} from 'react';
import {
    Button,
    Checkbox,
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

const languageOptions = [
    {key: 'bash', value: 'bash', text: 'Bash'},
    {key: 'sql', value: 'sql', text: 'SQL'},
    {key: 'java', value: 'java', text: 'Java'},
    {key: 'javascript', value: 'javascript', text: 'JavaScript'},
    {key: 'python', value: 'python', text: 'Python'},
    {key: 'cpp', value: 'cpp', text: 'C++'},
    {key: 'shell', value: 'shell', text: 'Shell'},
    {key: 'text', value: 'text', text: 'Text'},

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


    const [snippetData, setSnippetData] = useState(snippetDefaultValues);
    const [rows, setRows] = useState(defaultRows);


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
            .catch(error => {
                if (error.response && error.response.data && error.response.data.detail) {
                    setError(error.response.data.detail);
                } else if (error.response && error.response.data){
                    setError(JSON.stringify(error.response.data));
                }
                else {
                    // objects are not valid react child and we render error verbatim, so to make it string, concat
                    setError("" + error);
                }
            })

    };

    const handleInputChange = (event, eventData) => {
        let update = {};
        update[eventData.name] = eventData.value;
        setSnippetData(s => ({...s, ...update}));
        updateRows(eventData);
    };

    // Load data if we are in edit mode
    useEffect(() => {
        console.log("Effect")
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
        <ModalBase size="large" handleClose={handleClose} className={snippetData.personal && 'personal'}>
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
                            <Grid.Row columns={2} divided>
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
                    <Button type='submit' color='black' basic>
                        <Icon name='checkmark'/> Create
                    </Button>
                    <Button color='grey' onClick={handleClose}>
                        <Icon name='delete'/> Cancel
                    </Button>
                </Form>
            </Modal.Content>
        </ModalBase>
    );
}

export default SnippetModal;