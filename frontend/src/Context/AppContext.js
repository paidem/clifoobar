import React, {useContext, useState} from 'react';
import cfbapi from "../Api/cfbapi";

const api = new cfbapi();

const AppContext = React.createContext([{}, () => {
}]);


const AppProvider = (props) => {

    const updateSnippets = ({query}={}) => {
        setState((state) => ({...state, snippetsLoading: true}));
        api.getSnippets({query: query})
            .then(r => {
                    let newSnippets = r.data.map(s => ({...s, created: new Date(s.created)}))
                    setState(state => ({...state, snippets: newSnippets}))
                }
            )
            .finally(() => {
                setState((state) => ({...state, snippetsLoading: false}));
            })
    };
        
    const checkLoginStatus = (retriesLeft) => {
        retriesLeft--;

        api.getCurrentUser()
            .then(r => {
                setState(oldState => ({...oldState,
                    apiError: null,
                    user: r.data,
                    userLoginFailed: false
                }));
                updateSnippets();
            })
            .catch(e => {
                    if (!e.response) {
                        console.log("No response. Retries left: " + retriesLeft);
                        setState(oldState => ({
                            ...oldState,
                            apiError: "No response. Retries left: " + retriesLeft,
                            user: null
                        }));
                        if (retriesLeft > 0) {
                            setTimeout(() => checkLoginStatus(retriesLeft), 2000);
                        }
                    } else {
                        setState(oldState => ({...oldState,
                            apiError: null,
                            user: null,
                            userLoginFailed: true,
                        }));
                    }
                }
            )
    };

    const defaultState = {
        api: api,
        snippets: [],
        snippetsLoading: false,
        user: null,
        userLoginFailed: false,
        query: null,
        actions: {
            checkLoginStatus: checkLoginStatus,
            updateSnippets: updateSnippets,
        }
    };

    const [state, setState] = useState(defaultState);

    return (
        <AppContext.Provider value={[state, setState]}>
            {props.children}
        </AppContext.Provider>
    );
};

export {AppContext, AppProvider};