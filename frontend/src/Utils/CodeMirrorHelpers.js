
import { cpp } from "@codemirror/lang-cpp";
import { css } from "@codemirror/lang-css";
import { go } from "@codemirror/lang-go";
import { html } from "@codemirror/lang-html";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { php } from "@codemirror/lang-php";
import { python } from "@codemirror/lang-python";
import { sql } from "@codemirror/lang-sql";
import { xml } from "@codemirror/lang-xml";
import { yaml } from "@codemirror/lang-yaml";
import { oneDark } from "@codemirror/theme-one-dark";

export const noLineNumbersLanguages = [
    'accesslog',
    'bash',
    'plaintext',
    'powershell',
    'shell',
];
export const dollarSignPromptLanguages = ['bash', 'git'];
export const arrowSignPromptLanguages = ['powershell', 'shell'];


export function getShowLineNumbers(language) {
    if (!language)
        return false;

    if (noLineNumbersLanguages.includes(language.toLowerCase())) {
        return false;
    }

    return true;
}

export function getLanguageMode(code) {
    if (!code){
        return "textfile"
    }

    let clikeLanguages = [
        'c', 'c++', 'cpp', 'c#', 'cs', 'csharp',
        'java', 'scala', 'kotlin',
        'objectivec', 'objective-c'
    ];

    if (clikeLanguages.includes(code.toLowerCase())) {
        return "clike";
    }

    if (code.toLowerCase() === "json"){
        return "javascript";
    }

    return code.toLowerCase();
}

export function getCodeMirrorExtensions(code) {
    const language = getLanguageMode(code);

    switch (language) {
        case "c":
        case "c++":
        case "cpp":
        case "cs":
        case "csharp":
        case "objective-c":
        case "objectivec":
            return [cpp()];
        case "java":
            return [java()];
        case "kotlin":
            return [java()];
        case "css":
            return [css()];
        case "go":
            return [go()];
        case "htmlmixed":
            return [html()];
        case "javascript":
            return [javascript({ jsx: true })];
        case "jsx":
            return [javascript({ jsx: true })];
        case "json":
            return [json()];
        case "markdown":
            return [markdown()];
        case "php":
            return [php()];
        case "python":
            return [python()];
        case "sql":
            return [sql()];
        case "xml":
            return [xml()];
        case "yaml":
            return [yaml()];
        default:
            return [];
    }
}

export function getCodeMirrorTheme(themeName) {
    return themeName === "dracula" ? oneDark : "light";
}
