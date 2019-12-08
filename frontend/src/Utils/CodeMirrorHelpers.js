
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
