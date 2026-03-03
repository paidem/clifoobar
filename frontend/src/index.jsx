import React from 'react';
import { createRoot } from 'react-dom/client';
import 'semantic-ui-css/semantic.min.css'
import './index.css';
import App from "./Components/App/App";
import {AppProvider} from "./Context/AppContext";
import {ActionsProvider} from "./Context/ActionsContext";

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <AppProvider>
        <ActionsProvider>
            <App/>
        </ActionsProvider>
    </AppProvider>
);

