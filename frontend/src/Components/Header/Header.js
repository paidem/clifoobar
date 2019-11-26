import React, {useContext, useEffect, useState, useRef} from 'react';
import {AppContext} from "../../Context/AppContext";
import {ActionsContext} from "../../Context/ActionsContext";
import {Button, Container, Divider, Grid, Icon, Input, Segment} from "semantic-ui-react";
import SnippetModal from "../Modals/SnippetModal";

function Header() {
    // Context
    const [appState, setAppState] = useContext(AppContext);
    const [appActions,] = useContext(ActionsContext);

    const [search, setSearch] = useState("");

    // Timer which controls timeot for display size update
    const updateAppQueryTimer = useRef(0);

    const onInputChanged = (inputValue) => {
        if (updateAppQueryTimer.current) {
            clearTimeout(updateAppQueryTimer.current);
        }

        setSearch(inputValue);

        updateAppQueryTimer.current = setTimeout(() => {
            setAppState(state => ({...state, snippetsQuery: inputValue, snippetsActivePage: 1}));
        }, 300)

    };

    const clearSearch = () => {
        setSearch("");
        setAppState(state => ({...state, snippetsQuery: ""}));
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
                    <Button
                        onClick={() => appActions.openModal({type: SnippetModal, data: null})}
                    >
                        New
                    </Button>
                    {appState.user && <span style={{float: "right"}}>User: {appState.user.username}</span>}
                </Grid.Column>
            </Grid>
        </Segment>
    )
}

export default Header;