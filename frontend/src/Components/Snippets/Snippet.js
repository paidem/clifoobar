import React, {useState} from 'react';
import {Button, Card, Grid, Label} from "semantic-ui-react";
import Moment from 'react-moment';
import 'moment-timezone';
import SnippetBodyHighlight from "./SnippetBodyHighlight";


const defaultCopyButtonIcon = 'copy outline';
const successCopyButtonIcon = 'thumbs up';

function Snippet({snippet}) {

    const [copyButtonIcon, setCopyButtonIcon] = useState(defaultCopyButtonIcon);

    const copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        setCopyButtonIcon(successCopyButtonIcon);
        setTimeout(() => setCopyButtonIcon(defaultCopyButtonIcon),2000);

    };

    return (
        <React.Fragment>
            <Card fluid raised>
                <Label size='large' attached='top'>{snippet.name}
                  <span style={{float: "right"}}>Created&nbsp;
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
                                    <code >{snippet.description}</code>
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
                                    <Button basic color="green" size='medium'
                                            onClick={() => copyToClipboard(snippet.body)}
                                            icon={copyButtonIcon}
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