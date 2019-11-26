import React, {useContext, useEffect} from 'react';
import {AppContext} from "../../Context/AppContext";
import SnippetsList from "../Snippets/SnippetsList";
import Header from "../Header/Header";
import {Container, Segment} from "semantic-ui-react";
import {ActionsContext} from "../../Context/ActionsContext";

function App() {
    // Context
    const [appState, ] = useContext(AppContext);
    const [appActions, ] = useContext(ActionsContext);

    useEffect(() => {
        appActions.checkLoginStatus(10);
    }, [appActions]);

    useEffect(() => {
        appActions.updateSnippets({
            query: appState.snippetsQuery,
            page: appState.snippetsActivePage,
            page_size: appState.snippetsPageSize,
        });
    }, [appActions, appState.snippetsActivePage, appState.snippetsPageSize, appState.snippetsQuery]);


    return (
        <div className="App">
            <Container>
                <Header/>
                <SnippetsList items={appState.snippets}/>
            </Container>
        </div>
    );
}

export default App;
