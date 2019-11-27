import React, {useContext, useState} from 'react';
import {AppContext} from "./AppContext";

const ActionsContext = React.createContext([{}, () => {
}]);


const ActionsProvider = (props) => {
    // App Context
    const [appState, setAppState] = useContext(AppContext);

    const updateAppState = (stateDiff) => {
        setAppState(state => ({...state, ...stateDiff}));
    };


    const updateSnippets = (props) => {
        updateAppState({snippetsLoading: true});

        appState.api.getSnippets(
            {
                query: props.query,
                page: props.page,
                page_size: props.page_size,
            })
            .then(response => {
                    if (response.data.results) {
                        updateAppState({
                            snippets: response.data.results.map(s => ({
                                ...s,
                                created: new Date(s.created),
                                language: s.language ? s.language.toLowerCase() : ""
                            })),
                            snippetsTotal: response.data.count,
                        });
                    } else {
                        updateAppState({snippets: [], snippetsActivePage: 1});
                    }

                }
            )
            .finally(() => {
                updateAppState({snippetsLoading: false});
            })
    };

    const saveSnippet = (props, editMode) => {
        return appState.api.saveSnippet(props, editMode);
    };

    const login = (props) => {
        return appState.api.login(props)
            .then(response => {
                checkLoginStatus(5);
                updateAppState({userLoginFailed: false});
            })
            .catch(error => {
                updateAppState({userLoginFailed: true});
            })
    };

    const logout = () => {
        appState.api.logout()
            .then(response => {
                updateAppState({user: null});
            })
    };

    const checkLoginStatus = (retriesLeft) => {
        retriesLeft--;

        appState.api.getCurrentUser()
            .then(r => {
                setAppState(oldState => ({
                    ...oldState,
                    apiError: null,
                    user: r.data,
                    userLoginFailed: false
                }));
            })
            .catch(e => {
                    if (!e.response) {
                        console.log("No response. Retries left: " + retriesLeft);
                        setAppState(oldState => ({
                            ...oldState,
                            apiError: "No response. Retries left: " + retriesLeft,
                            user: null
                        }));
                        if (retriesLeft > 0) {
                            setTimeout(() => checkLoginStatus(retriesLeft), 2000);
                        }
                    } else {
                        setAppState(oldState => ({
                            ...oldState,
                            apiError: null,
                            user: null,
                            userLoginFailed: true,
                        }));
                    }
                }
            )
    };

    const openModal = ({type, data}) => {
        let modal = React.createElement(type, props = {
                data: data,
                handleClose: () => {
                    updateAppState({activeModal: null});
                }
            }
        );

        updateAppState({activeModal: modal});
    };


    const voteForSnippet = async (snippet) => {
        setAppState(state => {
            let updatedSnippet = snippet;
            updatedSnippet.popularity += 1;
            state.snippets.splice(state.snippets.indexOf(snippet), 1, updatedSnippet);
            return (state)
        });

        await appState.api.voteForSnippet(snippet.id);
    };

    const defaultState = {
        saveSnippet: saveSnippet,
        checkLoginStatus: checkLoginStatus,
        updateSnippets: updateSnippets,
        openModal: openModal,
        login: login,
        logout: logout,
        voteForSnippet: voteForSnippet,
    };

    const [state, setState] = useState(defaultState);

    return (
        <ActionsContext.Provider value={[state, setState]}>
            {props.children}
        </ActionsContext.Provider>
    );
};

export {ActionsContext, ActionsProvider};