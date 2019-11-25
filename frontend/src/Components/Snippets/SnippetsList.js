import React, {useContext} from 'react';
import Snippet from "./Snippet";
import {AppContext} from "../../Context/AppContext";


function SnippetsList({items}) {
    // Context
    const [appState, setAppState] = useContext(AppContext);

    return (
        <div>
            {items.map(item => <Snippet key={item.id} snippet={item}/>)}
        </div>
    )
}

export default SnippetsList;