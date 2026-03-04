import React, { useRef, useState } from "react";
import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Header from "./Header";
import { AppContext } from "../../Context/AppContext";
import { ActionsContext } from "../../Context/ActionsContext";

function HeaderHarness({ initialPath }) {
    const [appState, setAppState] = useState({
        user: null,
        showLogin: false,
        userLoginFailed: false,
        searchApplied: false,
        snippetsQueryInput: "",
        snippetsQueryInputRef: useRef(),
        snippetsOrder: "-popularity",
        snippetsPageSize: "10",
        authMode: "local",
    });

    const appActions = {
        openModal: vi.fn(),
        logout: vi.fn(),
    };

    return (
        <AppContext.Provider value={[appState, setAppState]}>
            <ActionsContext.Provider value={[appActions, vi.fn()]}>
                <MemoryRouter initialEntries={[initialPath]}>
                    <Routes>
                        <Route path="/" element={<Header />} />
                        <Route path="/:search" element={<Header />} />
                    </Routes>
                </MemoryRouter>
            </ActionsContext.Provider>
        </AppContext.Provider>
    );
}

describe("Header", () => {
    it("initializes search input from URL parameter", () => {
        vi.useFakeTimers();

        render(<HeaderHarness initialPath="/my-search" />);
        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(screen.getByPlaceholderText("Search...")).toHaveValue("my-search");

        vi.useRealTimers();
    });
});
