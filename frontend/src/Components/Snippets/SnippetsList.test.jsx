import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SnippetsList from "./SnippetsList";
import { AppContext } from "../../Context/AppContext";

vi.mock("./Snippet", () => ({
    default: ({ snippet }) => <div data-testid="snippet-item">{snippet.name}</div>,
}));

describe("SnippetsList", () => {
    it("renders pagination and updates active page", async () => {
        const setAppState = vi.fn();
        const appState = {
            snippetsTotal: 21,
            snippetsPageSize: 10,
            snippetsActivePage: 1,
        };

        render(
            <AppContext.Provider value={[appState, setAppState]}>
                <SnippetsList
                    items={[
                        {
                            id: 1,
                            name: "snippet-1",
                        },
                    ]}
                />
            </AppContext.Provider>
        );

        expect(screen.getByTestId("snippet-item")).toBeInTheDocument();

        await userEvent.click(screen.getByText("2"));

        expect(setAppState).toHaveBeenCalledTimes(1);

        const updater = setAppState.mock.calls[0][0];
        expect(updater(appState)).toMatchObject({ snippetsActivePage: 2 });
    });
});
