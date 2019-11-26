import React from 'react';
import {Button, Card, Grid, Icon} from "semantic-ui-react";
import Moment from 'react-moment';
import 'moment-timezone';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {darcula, tomorrowNightBlue, agate} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
    noLineNumbersLanguages,
    dollarSignPromptLanguages,
    arrowSignPromptLanguages
} from "../../Settings/SettingsArrays";

function showLineNumbers(snippet) {
    if (!snippet.language)
        return false;
    let lang = snippet.language.toLowerCase();

    if (noLineNumbersLanguages.includes(lang)) {
        return false;
    }

    if (snippet.body.split(/\r\n|\r|\n/).length < 3) {
        return false;
    }

    return true;
}

function getStyle(snippet) {
    if (!snippet.language)
        return darcula;

    let lang = snippet.language.toLowerCase();

    if (['text', 'bash', 'shell'].includes(lang)) {
        return agate;
    }

    if (['powershell'].includes(lang)) {
        return tomorrowNightBlue
    }

    return darcula
}

function getLineProps(snippet) {
    if (!snippet.language)
        return null;

    let lang = snippet.language.toLowerCase();

    if (dollarSignPromptLanguages.includes(lang)) {
        return {className: "dollarSignPrompt"};
    }

    if (arrowSignPromptLanguages.includes(lang)) {
        return {className: "arrowSignPrompt"};
    }
    return null
}

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

function Snippet({snippet}) {
    return (
        <React.Fragment>
            <Card fluid raised>
                <Card.Content>
                    <span style={{float: "right"}}>
                        <Moment fromNow
                                withTitle
                                titleFormat="YYYY-MM-DD HH:mm"
                        >
                            {snippet.created}
                        </Moment><strong>;&nbsp;{snippet.language}</strong>
                    </span>
                    <Card.Header>
                        {snippet.name}
                    </Card.Header>

                    <Card.Description>
                        <Grid stackable divided>
                            <Grid.Column computer={14}>
                                {snippet.description}
                                <SyntaxHighlighter
                                    language={snippet.language ? snippet.language : "text"}
                                    style={getStyle(snippet)}
                                    showLineNumbers={showLineNumbers(snippet)}
                                    wrapLines={true}
                                    lineProps={getLineProps(snippet)}
                                >
                                    {snippet.body}
                                </SyntaxHighlighter>
                            </Grid.Column>
                            <Grid.Column computer={2}>
                                <Button basic color="green" size='small' animated='vertical'
                                        onClick={() => copyToClipboard(snippet.body)}
                                >
                                    <Button.Content hidden>Copy</Button.Content>
                                    <Button.Content visible>
                                        <Icon name='copy outline'/>
                                    </Button.Content>
                                </Button>
                            </Grid.Column>
                        </Grid>
                    </Card.Description>

                </Card.Content>
            </Card>
        </React.Fragment>
    )
}

export default Snippet;