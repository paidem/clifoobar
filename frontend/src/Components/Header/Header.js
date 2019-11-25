import React, {useContext, useEffect, useState, useRef} from 'react';
import {AppContext} from "../../Context/AppContext";
import {Container, Divider, Grid, Icon, Input, Segment} from "semantic-ui-react";

function Header() {
    // Context
    const [appState, setAppState] = useContext(AppContext);
    const [search, setSearch] = useState("");

    // Timer which controls timeot for display size update
    const updateAppQueryTimer = useRef(0);

    const onInputChanged = (inputValue) => {
        if (updateAppQueryTimer.current) {
            clearTimeout(updateAppQueryTimer.current);
        }

        setSearch(inputValue);

        updateAppQueryTimer.current = setTimeout(() => {
            setAppState(state => ({...state, query: inputValue}));

        }, 300)

    };

    const clearSearch = () => {
        setSearch("");
        setAppState(state => ({...state, query: ""}));
    };

    return (
        <Segment>
            <Grid stackable divided>
                <Grid.Column computer={10}>
                    <Input fluid size='small' fluid icon placeholder='Search...'
                           value={search}
                           onChange={(event) => {
                               onInputChanged(event.target.value)
                           }}
                           onKeyDown={(event) => {
                               // Handle Esc button to clear
                               let code = event.charCode || event.keyCode;
                               if (code === 27) {
                                   clearSearch();
                               }
                           }}>
                        <input/>
                        <Icon name='times circle outline' size='large' link
                              onClick={() => clearSearch()}/>
                    </Input>
                </Grid.Column>
                <Grid.Column computer={6}>

                    {appState.user && <span style={{float: "right"}}>User: {appState.user.username}</span>}
                </Grid.Column>
            </Grid>
        </Segment>
    )
}

export default Header;