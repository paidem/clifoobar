import React, {useState, useContext} from 'react';
import {Button, Card, Grid, Icon, Label, Statistic} from "semantic-ui-react";
import Moment from 'react-moment';
import 'moment-timezone';
import SnippetBodyHighlight from "./SnippetBodyHighlight";
import {ActionsContext} from "../../Context/ActionsContext";
import ModalBase from "../Modals/ModalBase";
import SnippetModal from "../Modals/SnippetModal";
import {AppContext} from "../../Context/AppContext";


const defaultCopyButtonIcon = 'copy outline';
const successCopyButtonIcon = 'thumbs up';

function Snippet({snippet}) {
    const [appState,] = useContext(AppContext);
    const [appActions,] = useContext(ActionsContext);

    const [copyButtonIcon, setCopyButtonIcon] = useState(defaultCopyButtonIcon);
    const [voteEnabled, setVoteEnabled] = useState(true);

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

    return (
        <React.Fragment>
            <Card fluid raised>
                <Label size='large' attached='top' className={snippet.personal && 'personal'}>
                    {snippet.name}
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
                            <Grid.Row>
                                <Grid.Column mobile={16} tablet={10} computer={14}>
                                    <div className='snippetDescription'>
                                        <code>{snippet.description}</code>
                                    </div>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={6} computer={2}>

                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row>
                                <Grid.Column mobile={16} tablet={13} computer={14}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start"
                                    }}>
                                        <div style={{display: "block", flexGrow: 5}}>
                                            <SnippetBodyHighlight snippet={snippet}/>
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
                                        <br/>

                                    </div>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={3} computer={2}>
                                    {(appState.user && snippet.author && snippet.author.id === appState.user.id) &&
                                    <Button
                                        color='grey'
                                        content=''
                                        compact
                                        icon='edit'
                                        label={{
                                            color:'grey',
                                            pointing:'left',
                                            content:'Edit'}}
                                        size='medium'
                                        onClick={() => appActions.openModal({type: SnippetModal, data: {edit: true, snippet: snippet}})}
                                    />}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Card.Description>
                </Card.Content>
            </Card>
        </React.Fragment>
    )
}

export default Snippet;