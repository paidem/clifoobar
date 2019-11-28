import React, {useContext, useEffect} from 'react';
import {AppContext} from "../../Context/AppContext";
import SnippetsList from "../Snippets/SnippetsList";
import Header from "../Header/Header";
import {Container} from "semantic-ui-react";
import {ActionsContext} from "../../Context/ActionsContext";

function App() {
    // Context
    const [appState,] = useContext(AppContext);
    const [appActions,] = useContext(ActionsContext);

    useEffect(() => {
        appActions.checkLoginStatus(10);
    }, [appActions]);

    useEffect(() => {
        if (!appState.activeModal) {
            appActions.updateSnippets({
                query: appState.snippetsQuery,
                page: appState.snippetsActivePage,
                page_size: appState.snippetsPageSize,
                order_by: appState.order_by,
            });
            appActions.updateTags();
        }
    }, [appActions, appState.activeModal, appState.order_by, appState.snippetsActivePage, appState.snippetsPageSize, appState.snippetsQuery]);

    return (
        <div className="App">
            {appState.activeModal}
            <Container>
                <Header/>
            </Container>
            <Container style={{paddingTop: "30px"}}>
                <SnippetsList items={appState.snippets}/>
            </Container>
        </div>
    );
}

export default App;
