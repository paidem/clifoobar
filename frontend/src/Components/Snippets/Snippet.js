import React, {useContext, useState} from 'react';
import {Card, Icon, Segment} from "semantic-ui-react";
import Moment from 'react-moment';
import 'moment-timezone';

function Snippet({snippet}) {
    return (
        <React.Fragment>
            <Card fluid raised >
                <Card.Content>
                    <span style={{float:"right"}}>
                        <Moment fromNow
                                withTitle
                                titleFormat="YYYY-MM-DD HH:mm"
                                // title={"aa" + <Moment format="YYYY-MM-DD HH:mm">{snippet.created}</Moment>}
                        >
                            {snippet.created}
                        </Moment>
                    </span>
                    <Card.Header>{snippet.name}</Card.Header>

                    <Card.Description>
                        <p>{snippet.description}</p>
                        <Segment inverted>
                            <pre style={{margin:0}}>{snippet.body}</pre>
                        </Segment>
                    </Card.Description>

                </Card.Content>
            </Card>
        </React.Fragment>
    )
}

export default Snippet;