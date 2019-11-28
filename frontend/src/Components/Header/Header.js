import React, {useContext, useEffect, useState, useRef} from 'react';
import {AppContext} from "../../Context/AppContext";
import {ActionsContext} from "../../Context/ActionsContext";
import {
    Button,
    Dropdown,
    Grid,
    Icon,
    Input,
    Segment,
    SegmentGroup
} from "semantic-ui-react";
import SnippetModal from "../Modals/SnippetModal";
import LoginForm from "./LoginForm";


const orderOptions = [
    {
        key: 'popularity-desc',
        text: 'By popularity',
        value: '-popularity',
    },
    {
        key: 'created-desc',
        text: 'Newest',
        value: '-created',
    },
    {
        key: 'created-asc',
        text: 'Oldest',
        value: 'created',
    },
    {
        key: 'personal',
        text: 'My personal',
        value: '-personal',
    },
];

const pageSizeOptions = [
    {
        key: '5',
        text: '5',
        value: '5',
    },
    {
        key: '10',
        text: '10',
        value: '10',
    },
    {
        key: '20',
        text: '20',
        value: '20',
    },
    {
        key: '50',
        text: '50',
        value: '50',
    },
    {
        key: '100',
        text: '100',
        value: '100',
    },

];


function Header() {
    // Context
    const [appState, setAppState] = useContext(AppContext);
    const [appActions,] = useContext(ActionsContext);
    const [showLogin, setShowLogin] = useState(false);

    const [search, setSearch] = useState("");

    // Timer which controls timeot for display size update
    const updateAppQueryTimer = useRef(0);

    const inputRef = useRef();

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
        setAppState(state => ({...state, snippetsQuery: "", snippetsActivePage: 1}));
    };

    useEffect(() => {
        if (appState.user) {
            setShowLogin(false)
        }
    }, [appActions, appState.user]);

    // Syncronize search input back from AppState
    useEffect(() => {
        if (appState.snippetsQuery && appState.snippetsQuery !== search && appState.snippetsQuery.length > search.length) {
            setSearch(appState.snippetsQuery);

            // if we modified input - focus input
            inputRef.current.focus();
        }
    }, [appState.snippetsQuery, search]);

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
                               ref={inputRef}
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
                        </Input>}
                </div>
                <div style={{padding: '0 10px'}}>
                    <Dropdown
                        inline
                        options={orderOptions}
                        defaultValue={localStorage.getItem("order_by") || orderOptions[0].value}
                        onChange={(event, eventData) => {
                            setAppState(s => ({...s, order_by: eventData.value}));
                            localStorage.setItem('order_by', eventData.value)
                        }}
                    />
                    &nbsp;
                    &nbsp;
                    <Dropdown
                        inline
                        options={pageSizeOptions}
                        defaultValue={localStorage.getItem("snippetsPageSize") ||  '10'}
                        onChange={(event, eventData) => {
                            setAppState(s => ({...s, snippetsPageSize: eventData.value}));
                            localStorage.setItem('snippetsPageSize', eventData.value)
                        }}
                    />
                </div>
                <div>
                    {appState.user ?
                        <Button size='tiny' animated='fade' color='grey' onClick={() => appActions.logout()}>
                            <Button.Content visible>
                                {appState.user.username}
                            </Button.Content>
                            <Button.Content hidden>
                                Logout
                            </Button.Content>
                        </Button>
                        :
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

export default Header;