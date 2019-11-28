import React, {useContext, useEffect, useState, useRef} from 'react';
import {AppContext} from "../../Context/AppContext";
import {ActionsContext} from "../../Context/ActionsContext";
import {Button, Container, Divider, Form, Grid, Icon, Input, Label, Segment, SegmentGroup} from "semantic-ui-react";
import SnippetModal from "../Modals/SnippetModal";
import LoginForm from "./LoginForm";

function Header() {
    // Context
    const [appState, setAppState] = useContext(AppContext);
    const [appActions,] = useContext(ActionsContext);
    const [showLogin, setShowLogin] = useState(false);

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

    useEffect(() => {
        if (appState.user) {
            setShowLogin(false)
        }
    }, [appActions, appState.user]);

    return (
        <SegmentGroup>
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
                        {appState.user &&
                        <Button
                            onClick={() => appActions.openModal({type: SnippetModal, data: null})}
                        >
                            New
                        </Button>}
                        <div style={{float: "right"}}>
                            {appState.user ?
                                <Button animated='fade' color='green' onClick={() => appActions.logout()}>
                                    <Button.Content visible
                                                    color='green'> {appState.user.username}</Button.Content>
                                    <Button.Content hidden color='red'>Logout</Button.Content>
                                </Button>
                                :

                                <Button onClick={() => {
                                    setShowLogin(!showLogin);
                                    setAppState(s => ({...s, userLoginFailed: false}));
                                }}>
                                    {showLogin ? "Cancel" : "Login"}
                                </Button>

                            }
                        </div>
                    </Grid.Column>
                </Grid>
            </Segment>
            {(!appState.user && showLogin) &&
            <Segment>
                <Grid stackable divided>
                    <Grid.Column computer={10}>
                    </Grid.Column>
                    <Grid.Column computer={6}>
                        <LoginForm handleLoginSuccess={() => setShowLogin(false)}/>
                    </Grid.Column>
                </Grid>
            </Segment>}
        </SegmentGroup>

    )
}

export default Header;