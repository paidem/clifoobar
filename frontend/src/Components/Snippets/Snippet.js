import React, {useContext, useRef, useState} from 'react';
import {Button, Card, Divider, Grid, Input, Label} from "semantic-ui-react";
import Moment from 'react-moment';
import 'moment-timezone';
import {ActionsContext} from "../../Context/ActionsContext";
import SnippetModal from "../Modals/SnippetModal";
import {AppContext} from "../../Context/AppContext";
import {Controlled as CodeMirror} from 'react-codemirror2'
import '../../Utils/CodeMirrorPartsLoader.js'
import './Snippet.css'
import {getLanguageMode, getShowLineNumbers} from "../../Utils/CodeMirrorHelpers";
import ReactMarkdown from "react-markdown";

const defaultCopyButtonIcon = 'copy outline';
const successCopyButtonIcon = 'thumbs up';
const expandButtonIcon = 'angle double down';
const collapseButtonIcon = 'angle double up';

function Snippet({snippet}) {
    const [appState,] = useContext(AppContext);
    const [appActions,] = useContext(ActionsContext);
    const [expandedSnippet, setExpandedSnippet] = useState(false);
    const [copyButtonIcon, setCopyButtonIcon] = useState(defaultCopyButtonIcon);
    const [voteEnabled, setVoteEnabled] = useState(true);

    const [copyUrlButtonText, setCopyUrlButtonText] = useState("Copy link")

    const titleRef = useRef();

    const copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        setCopyButtonIcon(successCopyButtonIcon);

        setTimeout(() => setCopyButtonIcon(defaultCopyButtonIcon), 2000);

        if (voteEnabled) {
            appActions.voteForSnippet(snippet);
            setVoteEnabled(false);
            setTimeout(() => setVoteEnabled(true), 60000)
        }

    };

    const copyUrlToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        setCopyUrlButtonText("Copied!")
        setTimeout(() => {setCopyUrlButtonText("Copy link")},2000)
    }

    const addTagToSearch = (tag) => {
        appActions.addTagToSearch(tag);
        appState.snippetsQueryInputRef.current.focus();
    };

    const longSnippet = snippet && snippet.body.split(/\r\n|\r|\n/).length > 10;

    return (
        <React.Fragment>

            <Card fluid raised>
                <Label size='large' attached='top' className={snippet.personal ? 'personal' : ''}>
                    <a id={snippet.id} href={"#" + snippet.id} ref={titleRef}>{snippet.name}</a>
                    <span style={{float: "right"}}>
                        
                        by {snippet.author.full_name}{snippet.personal && ' (personal)'}&nbsp;|&nbsp;
                        <Moment fromNow
                                withTitle
                                titleFormat="YYYY-MM-DD HH:mm"
                        >
                            {snippet.created}
                        </Moment><strong>&nbsp;|&nbsp;{snippet.language}</strong>
                    </span>
                </Label>

                <Card.Content>
                    <Card.Description>
                        <Grid>
                            <Grid.Column mobile={16} tablet={10} computer={10}>
                                <div className='snippetDescription'>
                                    <ReactMarkdown source={snippet.description}/>
                                </div>
                                {snippet.tags.length > 0 &&
                                <div className='snippetTags'>
                                    <Label.Group size='small'>
                                        {snippet.tags.map(tag =>
                                            <Label key={'taglabel' + tag} as='a'
                                                   onClick={() => addTagToSearch(tag)}>
                                                {tag}
                                            </Label>)}
                                    </Label.Group>
                                </div>}
                            </Grid.Column>
                            <Grid.Column mobile={16} tablet={6} computer={6} textAlign='right'>
                                {(appState.user && (appState.user.is_superuser || (snippet.author && snippet.author.id === appState.user.id))) &&
                                <Button
                                    color='grey'
                                    content='Edit'
                                    icon='edit'
                                    size='tiny'
                                    onClick={() => appActions.openModal({
                                        type: SnippetModal,
                                        data: {edit: true, snippet: snippet},
                                    })}
                                />}
                                <Button
                                    style={{marginTop: "5px"}}
                                    color='blue'
                                    content={copyUrlButtonText}
                                    icon={copyButtonIcon}
                                    onClick={() => copyUrlToClipboard(window.location.origin + "/#" + snippet.id)}
                                    size='tiny'
                                />
                            </Grid.Column>

                        </Grid>



                        {snippet.body.length > 0 &&
                        <React.Fragment>
                            <Divider className='snippetDivider'/>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start"
                            }}>
                                <div style={{flexGrow: 1, overflow: 'hidden', position: 'relative'}}>
                                    <CodeMirror
                                        className={longSnippet && !expandedSnippet ? 'height-200' : 'autoheight'}
                                        value={snippet.body}
                                        options={{
                                            mode: getLanguageMode(snippet.language),
                                            lineNumbers: getShowLineNumbers(snippet.language),
                                            readOnly: true,
                                            theme: 'dracula'
                                        }}/>

                                    {(longSnippet && !expandedSnippet) &&
                                    <Button
                                        size='tiny'
                                        icon={expandButtonIcon}
                                        inverted
                                        className='expansionButtonTop'
                                        onClick={() => {
                                            setExpandedSnippet(true)
                                            window.location.hash = "#";
                                        }}/>
                                    }

                                    {(longSnippet && expandedSnippet) &&
                                    <React.Fragment>
                                        <Button size='tiny'
                                                icon={collapseButtonIcon}
                                                inverted
                                                className='expansionButtonTop'
                                                onClick={() => {
                                                    setExpandedSnippet(false);
                                                }}/>
                                        <Button size='tiny'
                                                icon={collapseButtonIcon}
                                                inverted
                                                className='expansionButtonBottom'
                                                onClick={() => {
                                                    setExpandedSnippet(false);
                                                    // Check if the snippet name is off the screen.
                                                    // If it is off screen - navigate to it. Otherway we will see
                                                    // irrelevant data after collapse
                                                    if (titleRef.current.getBoundingClientRect().top < 0) {
                                                        window.location.hash = "#" + snippet.id;
                                                    }
                                                }}/>
                                    </React.Fragment>
                                    }
                                </div>

                                <Button
                                    style={{marginLeft: "5px"}}
                                    color='orange'
                                    content=''
                                    compact
                                    icon={copyButtonIcon}
                                    label={{
                                        basic: true,
                                        color: 'grey',
                                        pointing: 'left',
                                        content: snippet.popularity
                                    }}
                                    onClick={() => copyToClipboard(snippet.body)}
                                    size='medium'
                                />

                            </div>
                        </React.Fragment>
                        }
                    </Card.Description>
                </Card.Content>
            </Card>
        </React.Fragment>
    )
}

export default Snippet;