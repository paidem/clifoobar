import React, {useState, useContext} from 'react';
import {Button, Card, Grid, Icon, Label, Statistic} from "semantic-ui-react";
import Moment from 'react-moment';
import 'moment-timezone';
import SnippetBodyHighlight from "./SnippetBodyHighlight";
import {ActionsContext} from "../../Context/ActionsContext";


const defaultCopyButtonIcon = 'copy outline';
const successCopyButtonIcon = 'thumbs up';

function Snippet({snippet}) {
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

        if (voteEnabled){
            appActions.voteForSnippet(snippet);
            setVoteEnabled(false);
            setTimeout(() => setVoteEnabled(true), 60000)

        }


    };

    return (
        <React.Fragment>
            <Card fluid raised>
                <Label size='large' attached='top'>{snippet.name}
                    <span style={{float: "right"}}>
                        by {snippet.author.full_name}&nbsp;|&nbsp;
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
                                    <SnippetBodyHighlight snippet={snippet}/>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={3} computer={2}>
                                    {/*<Button basic color="green" size='medium'*/}
                                    {/*        onClick={() => copyToClipboard(snippet.body)}*/}
                                    {/*        icon={copyButtonIcon}*/}
                                    {/*/>*/}

                                    <Button
                                        color='blue'
                                        content=''
                                        compact
                                        icon={copyButtonIcon}
                                        label={{
                                            basic: true,
                                            color: 'blue',
                                            pointing: 'left',
                                            content: snippet.popularity
                                        }}
                                        onClick={() => copyToClipboard(snippet.body)}
                                        size='medium'
                                    />


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