import React, {useState} from 'react';

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


function SnippetBodyHighlight({snippet}) {
return (
      <SyntaxHighlighter
                                        language={snippet.language ? snippet.language : "text"}
                                        style={getStyle(snippet)}
                                        showLineNumbers={showLineNumbers(snippet)}
                                        wrapLines={true}
                                        lineProps={getLineProps(snippet)}
                                    >
                                        {snippet.body}
                                    </SyntaxHighlighter>
)
}

export default SnippetBodyHighlight