import React, {useContext} from 'react';
import Snippet from "./Snippet";
import {AppContext} from "../../Context/AppContext";
import {Pagination} from "semantic-ui-react";


function SnippetsList({items}) {
    // Context
    const [appState, setAppState] = useContext(AppContext);

    const handlePaginationChange = (e, {activePage}) => {
        setAppState(state => ({...state, snippetsActivePage: activePage}));
    };

    return (
        <div>
            {items.map(item => <Snippet key={item.id} snippet={item}/>)}
            {(appState.snippetsTotal > appState.snippetsPageSize) &&
            <Pagination defaultActivePage={1}
                        firstItem={null}
                        lastItem={{
                            'aria-label': 'Last item',
                            content: 'Last',
                        }}
                        nextItem={null}
                        prevItem={null}
                        activePage={appState.snippetsActivePage}
                        totalPages={Math.ceil(appState.snippetsTotal / appState.snippetsPageSize)}
                        onPageChange={handlePaginationChange}
            />}
        </div>
    )
}

export default SnippetsList;