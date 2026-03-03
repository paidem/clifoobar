import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
import { AppContext } from "../../Context/AppContext";
import { ActionsContext } from "../../Context/ActionsContext";

vi.mock("../Header/Header", () => ({
    default: () => <div data-testid="header">Header</div>,
}));

vi.mock("../Snippets/SnippetsList", () => ({
    default: () => <div data-testid="snippets-list">Snippets</div>,
}));

describe("App", () => {
    it("renders and triggers initial app action calls", () => {
        const updateSettingsFromLocalStorage = vi.fn();
        const checkLoginStatus = vi.fn();
        const updateSnippets = vi.fn();
        const updateTags = vi.fn();
        const updateLanguages = vi.fn();

        const appState = {
            activeModal: null,
            snippets: [],
            snippetsQuery: "",
            snippetsActivePage: 1,
            snippetsPageSize: 10,
            snippetsOrder: "-popularity",
        };

        const appActions = {
            updateSettingsFromLocalStorage,
            checkLoginStatus,
            updateSnippets,
            updateTags,
            updateLanguages,
        };

        render(
            <AppContext.Provider value={[appState, vi.fn()]}>
                <ActionsContext.Provider value={[appActions, vi.fn()]}>
                    <App />
                </ActionsContext.Provider>
            </AppContext.Provider>
        );

        expect(screen.getByTestId("header")).toBeInTheDocument();
        expect(screen.getByTestId("snippets-list")).toBeInTheDocument();

        expect(updateSettingsFromLocalStorage).toHaveBeenCalledTimes(1);
        expect(checkLoginStatus).toHaveBeenCalledWith(10);
        expect(updateSnippets).toHaveBeenCalledTimes(1);
        expect(updateTags).toHaveBeenCalledTimes(1);
        expect(updateLanguages).toHaveBeenCalledTimes(1);
    });
});
