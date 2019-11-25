import React, {useContext, useEffect, useState, useRef} from 'react';
import {AppContext} from "../../Context/AppContext";

function Header() {
    // Context
    const [appState, setAppState] = useContext(AppContext);
    const [search, setSearch] = useState("");

     // Timer which controls timeot for display size update
    const updateAppQueryTimer = useRef(0);

    const onInputChanged = (event) => {
        let inputValue = event.target.value;

        if (updateAppQueryTimer.current) {
            clearTimeout(updateAppQueryTimer.current);
        }

        setSearch(inputValue);

        updateAppQueryTimer.current = setTimeout(() => {
            setAppState(state => ({...state, query: inputValue}));

        },300)

    };

    return (
        <div>
            <input value={search}
                   onChange={onInputChanged}
                   onKeyDown={(event) => {
                       // Handle Esc button to clear
                       let code = event.charCode || event.keyCode;
                       if (code === 27){
                           setSearch("");
                           setAppState(state => ({...state, query:""}));
                       }
                   }}
            />
        </div>
    )
}

export default Header;