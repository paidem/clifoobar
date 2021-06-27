import React, {useContext, useEffect, useRef, useState} from 'react';
import {AppContext} from "../../Context/AppContext";
import {ActionsContext} from "../../Context/ActionsContext";
import {Button, Dropdown, Icon, Input, Label, Segment, SegmentGroup} from "semantic-ui-react";
import SnippetModal from "../Modals/SnippetModal";
import LoginForm from "./LoginForm";
import {orderOptions, pageSizeOptions} from "../../Context/Enums";
import { withRouter } from 'react-router-dom';

function Header(props) {
    // Context
    const [appState, setAppState] = useContext(AppContext);
    const [appActions,] = useContext(ActionsContext);

    // Flag if login form should be shown instead of search
    const [showLogin, setShowLogin] = useState(false);

    const [logoutConfirmationActive, setLogoutConfirmationActive] = useState(false);

    // Timer which controls timeot for display size update
    const updateAppQueryTimer = useRef(0);

    // Search input callbak
    const onInputChanged = (inputValue) => {
        if (updateAppQueryTimer.current) {
            clearTimeout(updateAppQueryTimer.current);
        }

        setAppState(state => ({...state, snippetsQueryInput: inputValue}));

        updateAppQueryTimer.current = setTimeout(() => {
            setAppState(state => ({...state, snippetsQuery: state.snippetsQueryInput, snippetsActivePage: 1}));
        }, 400)

    };

    const clearSearch = () => {
        setAppState(state => ({...state, snippetsQuery: "", snippetsQueryInput: "", snippetsActivePage: 1}));
    };

    useEffect(() => {
        if (appState.user) {
            setShowLogin(false)
        }

        if (!appState.searchApplied && appState.snippetsQueryInput === "") {
            setAppState(state => ({...state, searchApplied: true}))
            if (props.match.params.search){
                onInputChanged(props.match.params.search);
            }
            else if (props.location.hash) {
                onInputChanged(props.location.hash.replace("#", ""));
            }
        }
    }, [appActions, appState.user, appState.searchApplied, appState.snippetsQueryInput, props, onInputChanged, setAppState]);

    // // Syncronize search input back from AppState
    // useEffect(() => {
    //     if (appState.snippetsQuery && appState.snippetsQuery !== search && appState.snippetsQuery.length > search.length) {
    //         setSearch(appState.snippetsQuery);
    //
    //         // if we modified input - focus input
    //         inputRef.current.focus();
    //     }
    // }, [appState.snippetsQuery, search]);

    return (
        <SegmentGroup>
            <Segment
                style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.2em'}}>
                <div>
                    <Button
                        size='tiny'
                        color='green'
                        disabled={!appState.user}
                        onClick={() => appActions.openModal({type: SnippetModal, data: null})}
                    >
                        New
                    </Button>
                    {/*}*/}
                </div>
                <div style={{flexGrow: 1}}>
                    {(!appState.user && showLogin) ?
                        <LoginForm handleLoginSuccess={() => setShowLogin(false)}/> :
                        <Input fluid size='small' icon placeholder='Search...'
                               autoFocus={true}
                               ref={appState.snippetsQueryInputRef}
                               value={appState.snippetsQueryInput}
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
                        </Input>}
                </div>
                <div style={{padding: '0 10px'}}>
                    <Dropdown
                        inline
                        options={orderOptions}
                        value={appState.snippetsOrder}
                        onChange={(event, eventData) => {
                            setAppState(s => ({...s, snippetsOrder: eventData.value}));
                            localStorage.setItem('snippetsOrder', eventData.value)
                        }}
                    />
                    &nbsp;
                    &nbsp;
                    <Dropdown
                        inline
                        options={pageSizeOptions}
                        value={appState.snippetsPageSize}
                        onChange={(event, eventData) => {
                            setAppState(s => ({...s, snippetsPageSize: eventData.value}));
                            localStorage.setItem('snippetsPageSize', eventData.value)
                        }}
                    />
                </div>
                <div>
                    {logoutConfirmationActive ?
                        <Button.Group size='tiny'>
                            <Button negative onClick={() => appActions.logout()}>Logout</Button>
                            <Button.Or/>
                            <Button onClick={() => setLogoutConfirmationActive(false)}>Stay</Button>
                        </Button.Group>
                        :
                        appState.user ?
                            <Button size='tiny' animated='fade' color='grey'
                                    onClick={() => setLogoutConfirmationActive(true)}>
                                <Button.Content visible>
                                    {appState.user.username}
                                </Button.Content>
                                <Button.Content hidden>
                                    Logout
                                </Button.Content>
                            </Button> :
                            <Button size='tiny'
                                    onClick={() => {
                                        setShowLogin(!showLogin);
                                        setAppState(s => ({...s, userLoginFailed: false}));
                                    }}>
                                {showLogin ? "Cancel" : "Login"}
                            </Button>
                    }
                </div>
            </Segment>
        </SegmentGroup>

    )
}

export default withRouter(Header);