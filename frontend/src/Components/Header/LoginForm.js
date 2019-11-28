import React, {useContext, useEffect, useState, useRef} from 'react';
import {Form, Input} from "semantic-ui-react";
import {AppContext} from "../../Context/AppContext";
import {ActionsContext} from "../../Context/ActionsContext";

function LoginForm() {
    const [appState,] = useContext(AppContext);
    const [appActions,] = useContext(ActionsContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        appActions.login({username, password})
    };

    return (
        <Form onSubmit={handleLogin} >
            <Form.Group>
                <Form.Input
                    error={appState.userLoginFailed}
                    label='Username'
                    placeholder=''
                    value={username}
                    onChange={(event, data) => {
                        setUsername(data.value)
                    }}
                />
                <Form.Input
                    error={appState.userLoginFailed}
                    type='password'
                    label='Password'
                    placeholder=''
                    value={password}
                    onChange={(event, data) => {
                        setPassword(data.value)
                    }}
                />
            </Form.Group>
            <Form.Button content='Submit'/>
        </Form>
    );
}

export default LoginForm;
