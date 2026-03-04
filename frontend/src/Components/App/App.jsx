import React, {useContext, useEffect} from 'react';
import {AppContext} from "../../Context/AppContext";
import SnippetsList from "../Snippets/SnippetsList";
import Header from "../Header/Header";
import {Container, Label} from "semantic-ui-react";
import {ActionsContext} from "../../Context/ActionsContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
    // Context
    const [appState,] = useContext(AppContext);
    const [appActions,] = useContext(ActionsContext);

    useEffect(() => {
        appActions.updateSettingsFromLocalStorage()
    }, [appActions]);

    useEffect(() => {
        appActions.updateAuthConfig();
    }, [appActions]);

    useEffect(() => {
        appActions.checkLoginStatus(10);
    }, [appActions]);

    useEffect(() => {
        if (!appState.activeModal && appState.snippetsPageSize > 0) {
            appActions.updateSnippets({
                query: appState.snippetsQuery,
                page: appState.snippetsActivePage,
                page_size: appState.snippetsPageSize,
                order_by: appState.snippetsOrder,
            });
            appActions.updateTags();
            appActions.updateLanguages();
        }
    }, [appActions, appState.activeModal, appState.order_by, appState.snippetsActivePage, appState.snippetsOrder, appState.snippetsPageSize, appState.snippetsQuery]);

    return (
        <div className="App">
            <Router>
            {appState.activeModal}
            <Container style={{paddingBottom: '10px'}}>
                <Routes>
                    <Route path="/" element={<Header />} />
                    <Route path="/:search" element={<Header />} />
                </Routes>
            </Container>
            <Container>
                {/*<Route path="/" exact component={() => {return <SnippetsList items={appState.snippets}/>}} />*/}
                <SnippetsList items={appState.snippets}/>
            </Container>
            <Container style={{paddingBottom: "40px"}}>
            </Container>
            <Label as='a' target="_blank" href="https://github.com/paidem/clifoobar" image attached='bottom left'>
                <img src='favicon.ico' alt="logo"/>
                CLI Foo Bar
                <Label.Detail>
                    {import.meta.env.VITE_APP_VERSION || import.meta.env.REACT_APP_VERSION}
                </Label.Detail>
            </Label>
            </Router>
        </div>
    );
}

export default App;
