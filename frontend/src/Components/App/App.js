import React, {useContext, useEffect} from 'react';
import {AppContext} from "../../Context/AppContext";
import SnippetsList from "../Snippets/SnippetsList";
import Header from "../Header/Header";

function App() {
    // Context
    const [appState, setAppState] = useContext(AppContext);

    useEffect(() => {
        appState.actions.checkLoginStatus(10);
    }, [appState.actions]);
    
    useEffect(() => {
         // appState.actions.updateSnippets({query: "bla"});
        appState.actions.updateSnippets({query: appState.query});
    }, [appState.actions, appState.query]);


    return (
        <div className="App">
            {appState.user && appState.user.username}
            <Header/>
            <SnippetsList items={appState.snippets}/>
        </div>
    );
}

export default App;
