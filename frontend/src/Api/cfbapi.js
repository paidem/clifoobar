import axios from "axios";
import {normalizeTags} from "../Utils/normalizeTags";

export default class ClifoobarApi {
    apiInstance = axios.create({
        baseURL: '/api/',
        timeout: 1000,
        xsrfCookieName: "csrftoken",
        xsrfHeaderName: "X-CSRFToken",
    });

    constructor() {
        this.apiInstance.interceptors.response.use(response => {
                return response;
            }, (error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log("Api error:");
                    console.log("Data: ");
                    console.log(error.response.data);
                    console.log("Status: " + error.response.status);
                    console.log("Headers: ");
                    console.log(error.response.headers);

                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log("Request: " + error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error: ', error.message);
                }

                return Promise.reject(error);
            }
        );

    }

    getUsers() {
        return this.apiInstance.get("/users/");
    }

    getAuthConfig() {
        return this.apiInstance.get("/auth/config");
    }

    getCurrentUser() {
        return this.apiInstance.get("/users/current/");
    }


    getSnippets({query, page, page_size, order_by}) {
        let params = {
            q: query,
            page: page,
            page_size: page_size,
            order_by: order_by,
        };
        return this.apiInstance.get('/snippets', {params: params});
    }

    getSnippet(id) {
        return this.apiInstance.get("/snippets/" + id + "/");
    }

    voteForSnippet(id) {
        return this.apiInstance.post("/snippets/" + id + "/vote");
    }

    saveSnippet({name, description, body, language, personal, tags, id = null}, editMode = false) {
        const payload = {
            name,
            description,
            body,
            language,
            personal,
            tags: normalizeTags(tags),
        };

        if (editMode) {
            return this.apiInstance.put("/snippets/" + id + "/", payload);
        } else {
            return this.apiInstance.post("/snippets/", payload);
        }
    };

    deleteSnippet(id, callback) {
        return this.apiInstance.delete("/snippets/" + id + "/")
            .then(() => {
                callback && callback();
            })

    }

    getTags() {
        return this.apiInstance.get("/tags/");
    }

    async loginLocal({username, password}) {
        let bodyFormData = new FormData();
        bodyFormData.set('username', username);
        bodyFormData.set('password', password);
        bodyFormData.set('next', "/");
        await this.apiInstance.get("/admin/login/", {baseURL: "/"});

        return this.apiInstance.post("/admin/login/", bodyFormData, {baseURL: "/"});
    }

    redirectToOAuthLogin(nextPath) {
        const path = nextPath || `${window.location.pathname}${window.location.search}${window.location.hash}`;
        window.location.assign(`/api/auth/oauth/login?next=${encodeURIComponent(path)}`);
    }

    getLanguages () {
        return this.apiInstance.get("/languages/");
    }

    logoutLocal() {
        return this.apiInstance.get("/admin/logout/", {baseURL: "/"});
    }

    redirectToAuthLogout(nextPath) {
        const path = nextPath || `${window.location.pathname}${window.location.search}${window.location.hash}`;
        window.location.assign(`/api/auth/logout?next=${encodeURIComponent(path)}`);
    }
}
