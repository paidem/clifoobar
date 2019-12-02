import React, {useRef, useState} from 'react';
import cfbapi from "../Api/cfbapi";

const api = new cfbapi();

const AppContext = React.createContext([{}, () => {
}]);


const AppProvider = (props) => {

    const defaultState = {
        api: api,
        snippets: [],
        snippetsLoading: false,
        snippetsQuery: null,
        snippetsQueryInput: "",
        snippetsQueryInputRef: useRef(),
        snippetsPageSize: 0,
        snippetsActivePage: 1,
        snippetsTotal: 0,
        order_by: '-popularity',
        tags: [],
        user: null,
        userLoginFailed: false,

    };

    const [state, setState] = useState(defaultState);

    return (
        <AppContext.Provider value={[state, setState]}>
            {props.children}
        </AppContext.Provider>
    );
};

export {AppContext, AppProvider};