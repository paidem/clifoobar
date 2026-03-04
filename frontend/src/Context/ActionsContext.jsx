import React, {useCallback, useContext, useEffect, useMemo, useRef} from 'react';
import {AppContext} from "./AppContext";
import {orderOptions} from "./Enums";
import {normalizeTags} from "../Utils/normalizeTags";

const ActionsContext = React.createContext([{}, () => {
}]);


const ActionsProvider = (props) => {
    // App Context
    const [appState, setAppState] = useContext(AppContext);
    const appStateRef = useRef(appState);

    useEffect(() => {
        appStateRef.current = appState;
    }, [appState]);

    const updateAppState = useCallback((stateDiff) => {
        setAppState(state => ({...state, ...stateDiff}));
    }, [setAppState]);


    const updateSnippets = useCallback((props) => {
        const state = appStateRef.current;
        updateAppState({snippetsLoading: true});

        state.api.getSnippets(
            {
                query: props.query,
                page: props.page,
                page_size: props.page_size,
                order_by: props.order_by,
            })
            .then(response => {
                    if (response.data.results) {
                        updateAppState({
                            snippets: response.data.results.map(s => ({
                                ...s,
                                created: new Date(s.created),
                                tags: normalizeTags(s.tags),
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
    }, [updateAppState]);

    const updateSettingsFromLocalStorage = useCallback(() => {
        setAppState(state => ({
            ...state,
            snippetsPageSize: localStorage.getItem("snippetsPageSize") || '10',
            snippetsOrder: localStorage.getItem("snippetsOrder") || orderOptions[0].value
        }));
    }, [setAppState]);

    const saveSnippet = useCallback((props, editMode) => {
        return appStateRef.current.api.saveSnippet(props, editMode);
    }, []);

    const updateAuthConfig = useCallback(() => {
        return appStateRef.current.api.getAuthConfig()
            .then(response => {
                updateAppState({
                    authMode: response.data.mode || "local",
                    oauthLoginUrl: response.data.oauth_login_url || null,
                });
            })
            .catch(() => {
                updateAppState({authMode: "local", oauthLoginUrl: null});
            });
    }, [updateAppState]);

    const deleteSnippet = useCallback((id, callback) => {
        return appStateRef.current.api.deleteSnippet(id, callback);
    }, []);

    const checkLoginStatus = useCallback((retriesLeft) => {
        retriesLeft--;

        appStateRef.current.api.getCurrentUser()
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
    }, [setAppState]);

    const login = useCallback((props) => {
        const state = appStateRef.current;
        if (state.authMode === "oauth") {
            state.api.redirectToOAuthLogin();
            return Promise.resolve();
        }

        return state.api.loginLocal(props)
            .then(response => {
                checkLoginStatus(5);
                updateAppState({userLoginFailed: false});
            })
            .catch(error => {
                updateAppState({userLoginFailed: true});
            })
    }, [checkLoginStatus, updateAppState]);

    const logout = useCallback(() => {
        const state = appStateRef.current;
        if (state.authMode === "oauth") {
            state.api.redirectToAuthLogout();
            return;
        }

        state.api.logoutLocal()
            .then(response => {
                updateAppState({user: null});
            })
    }, [updateAppState]);

    const openModal = useCallback(({type, data}) => {
        let modal = React.createElement(type, props = {
                data: data,
                handleClose: () => {
                    updateAppState({activeModal: null});
                }
            }
        );

        updateAppState({activeModal: modal});
    }, [updateAppState]);


    const voteForSnippet = useCallback(async (snippet) => {
        setAppState(state => {
            let updatedSnippet = snippet;
            updatedSnippet.popularity += 1;
            state.snippets.splice(state.snippets.indexOf(snippet), 1, updatedSnippet);
            return (state)
        });

        await appStateRef.current.api.voteForSnippet(snippet.id);
    }, [setAppState]);

    const addTagToSearch = useCallback((tag) => {
        setAppState(state => {
            let update = {};

            // Modify search input
            if (state.snippetsQuery && state.snippetsQuery.length > 0) {
                update.snippetsQueryInput = state.snippetsQuery.trim() + ' #' + tag + ' ';
            } else {
                update.snippetsQueryInput = '#' + tag + ' ';
            }

            // Modify effective query string
            update.snippetsQuery = update.snippetsQueryInput;

            // our updated snippet list could be shorter with added tag, so set page to 1
            update.snippetsActivePage = 1;
            return {...state, ...update};
        });
    }, [setAppState]);

    const updateTags = useCallback(() => {
        appStateRef.current.api.getTags()
            .then(response => {
                let tags = response.data.map(item => item.name);
                updateAppState({tags: tags});
            })
    }, [updateAppState]);

    const updateLanguages = useCallback(() => {
        appStateRef.current.api.getLanguages()
            .then(response => {
                updateAppState({languages: response.data});
            })
    }, [updateAppState]);

    const actions = useMemo(() => ({
        addTagToSearch: addTagToSearch,
        updateAuthConfig: updateAuthConfig,
        saveSnippet: saveSnippet,
        checkLoginStatus: checkLoginStatus,
        updateSnippets: updateSnippets,
        updateSettingsFromLocalStorage: updateSettingsFromLocalStorage,
        updateTags: updateTags,
        updateLanguages: updateLanguages,
        openModal: openModal,
        login: login,
        logout: logout,
        voteForSnippet: voteForSnippet,
        deleteSnippet: deleteSnippet
    }), [
        addTagToSearch,
        updateAuthConfig,
        saveSnippet,
        checkLoginStatus,
        updateSnippets,
        updateSettingsFromLocalStorage,
        updateTags,
        updateLanguages,
        openModal,
        login,
        logout,
        voteForSnippet,
        deleteSnippet,
    ]);

    return (
        <ActionsContext.Provider value={[actions, () => {}]}>
            {props.children}
        </ActionsContext.Provider>
    );
};

export {ActionsContext, ActionsProvider};
