import React, {useContext, useState} from 'react';
import {Card, Icon, Segment} from "semantic-ui-react";


function Snippet({snippet}) {
    return (
        <React.Fragment>
            <Card fluid raised >
                <Card.Content>
                    <Card.Header>{snippet.name}</Card.Header>
                    <Card.Description>
                        <p>{snippet.description}</p>
                        <Segment inverted >
                            <pre style={{margin:0}}>{snippet.body}</pre>
                        </Segment>
                    </Card.Description>
                </Card.Content>
            </Card>
        </React.Fragment>
    )
}

export default Snippet;