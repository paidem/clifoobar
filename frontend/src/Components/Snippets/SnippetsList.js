import React, {useContext, useState} from 'react';
import Snippet from "./Snippet";


function SnippetsList({items}) {
    return(
        <div>
            {items.map(item => <Snippet key={item.id} snippet={item}/>)}
        </div>
    )
}

export default SnippetsList;