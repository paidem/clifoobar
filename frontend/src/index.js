import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css'
import './index.css';
import App from "./Components/App/App";
import {AppProvider} from "./Context/AppContext";
import {ActionsProvider} from "./Context/ActionsContext";

ReactDOM.render(
    <AppProvider>
        <ActionsProvider>
            <App/>
        </ActionsProvider>
    </AppProvider>
    , document.getElementById('root'));
