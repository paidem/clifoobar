import React, {useRef, useState} from 'react';
import cfbapi from "../Api/cfbapi";
import {orderOptions} from "./Enums";

const api = new cfbapi();

const AppContext = React.createContext([{}, () => {
}]);


const AppProvider = (props) => {

    const defaultState = {
        api: api,
        searchApplied: false,
        snippets: [],
        snippetsLoading: false,
        snippetsQuery: null,
        snippetsQueryInput: "",
        snippetsQueryInputRef: useRef(),
        snippetsOrder: orderOptions[0].value,
        snippetsPageSize: 0,
        snippetsActivePage: 1,
        snippetsTotal: 0,
        order_by: '-popularity',
        tags: [],
        user: null,
        userLoginFailed: false,
        showLogin: false,

    };

    const [state, setState] = useState(defaultState);

    return (
        <AppContext.Provider value={[state, setState]}>
            {props.children}
        </AppContext.Provider>
    );
};

export {AppContext, AppProvider};