import React, {useContext, useState} from 'react';


function Snippet({snippet}) {
    return(
        <div>
            <h3>{snippet.name}</h3>
            <p>{snippet.description}</p>
            <pre>{snippet.body}</pre>
        </div>
    )
}

export default Snippet;