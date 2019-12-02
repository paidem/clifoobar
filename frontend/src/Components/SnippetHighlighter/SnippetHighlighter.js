import React, {useEffect, useRef, useState} from 'react';
import uuid from 'react-uuid'

import SyntaxHighlighter from 'react-syntax-highlighter';
import {agate, darcula, tomorrowNightBlue} from 'react-syntax-highlighter/dist/esm/styles/hljs';

import './SnippetHighlighter.css'
import {
    arrowSignPromptLanguages,
    dollarSignPromptLanguages,
    noLineNumbersLanguages
} from "./SettingsArrays";


function getShowLineNumbers(value, language) {
    if (!language)
        return false;

    if (noLineNumbersLanguages.includes(language.toLowerCase())) {
        return false;
    }

    return true;
}

function getStyle(language) {
    if (!language)
        return darcula;

    let lang = language.toLowerCase();

    if (['text', 'bash', 'shell', 'dos'].includes(lang)) {
        return agate;
    }

    if (['powershell'].includes(lang)) {
        return tomorrowNightBlue
    }

    return darcula
}

function getLineProps(language) {
    if (!language)
        return null;

    let lang = language.toLowerCase();

    if (dollarSignPromptLanguages.includes(lang)) {
        return {className: "dollarSignPrompt"};
    }

    if (arrowSignPromptLanguages.includes(lang)) {
        return {className: "arrowSignPrompt"};
    }
    return null
}


function SnippetHighlighter({
                                value,
                                onChange,
                                name,
                                language = "text",
                                wrapperStyle = {},
                                editable = false,
                                customStyle = {}
                            }) {
    const [highlighterId, setHighlighterId] = useState(); // Reference to highlighter
    const inputRef = useRef(); // Reference to input (textarea)
    const wrapperExt = useRef(); // Reference to ext wrapper

    // As I need to access highlighter element, and there could be several elements, I will give them
    // unique id's so I can refere to them using document.getElementById(highlighterId);
    // useRef() cannot be used, because SyntaxHighlighter is a functional component
    useEffect(() => {
        if (!highlighterId) {
            setHighlighterId(uuid())
        }
    }, [highlighterId, setHighlighterId]);


    useEffect(() => {
        if (!editable) {
            return
        }
        // The idea is to calculate padding of overlay transparent textarea (found at inputRef)
        // using location (clientRect) of main highlighter element and the actual code element inside it
        if (highlighterId) {
            let highlighterEl = document.getElementById(highlighterId);
            if (highlighterEl) {
                // If we have line number enabled, the code is at [1], otherwise at [0]
                let codeEl = highlighterEl.childNodes[highlighterEl.childNodes.length - 1];
                if (codeEl) {
                    let codeRect = codeEl.getBoundingClientRect();
                    let highlighterRect = highlighterEl.getBoundingClientRect();
                    inputRef.current.style.paddingLeft = (codeRect.left - highlighterRect.left) + "px";
                    inputRef.current.style.paddingTop = (codeRect.top - highlighterRect.top) + "px";
                    console.log(codeRect);
                    console.log(highlighterRect);


                }
            }
        }
    });

    if (editable) {
        return (
            <div className='ehla-wrapper-ext' ref={wrapperExt} style={wrapperStyle}>
                <div className='ehla-wrapper-int'>
             <textarea
                 ref={inputRef}
                 className="ehla-input"
                 id="ehla-input"
                 onChange={onChange}
                 name={name}
                 rows={value && value.split(/\r\n|\r|\n/).length} value={value}
             />
                    <SyntaxHighlighter
                        id={highlighterId}
                        className="ehla-highlighter"
                        language={language}
                        style={getStyle(language)}
                        showLineNumbers={getShowLineNumbers(value, language)}
                        // lineProps={getLineProps(language)}
                        wrapLines={true}>
                        {value}
                    </SyntaxHighlighter>
                </div>
            </div>
        )
    } else {
        return (
            <SyntaxHighlighter
                id={highlighterId}
                language={language}
                style={getStyle(language)}
                showLineNumbers={getShowLineNumbers(value, language)}
                lineProps={getLineProps(language)}
                wrapLines={true}
                customStyle={customStyle}
            >
                {value}
            </SyntaxHighlighter>

        )
    }

}

export default SnippetHighlighter;