import axios from "axios";

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

    getCurrentUser() {
        return this.apiInstance.get("/users/current/");
    }


    getSnippets({query, page, page_size}) {
        let queryPart = "?";

        queryPart += query ? "&q=" + query : "";
        queryPart += "&page=" + page;
        queryPart += "&page_size=" + page_size;

        return this.apiInstance.get("/snippets/" + queryPart);
    }

    getSnippet(id) {
        return this.apiInstance.get("/snippets/" + id + "/");
    }

    voteForSnippet(id) {
        return this.apiInstance.post("/snippets/" + id + "/vote");
    }

    createSnippet({name, description, body, language, personal}) {
        let bodyFormData = new FormData();
        bodyFormData.set('name', name);
        bodyFormData.set('description', description);
        bodyFormData.set('body', body);
        bodyFormData.set('language', language);
        bodyFormData.set('personal', personal);
        return this.apiInstance.post("/snippets/", bodyFormData);
    };

    async login({username, password}) {
        let bodyFormData = new FormData();
        bodyFormData.set('username', username);
        bodyFormData.set('password', password);
        bodyFormData.set('next', "/");
        await this.apiInstance.get("/admin/login/", {baseURL: "/"});

        return this.apiInstance.post("/admin/login/", bodyFormData, {baseURL: "/"});
    }

    logout() {
        return this.apiInstance.get("/admin/logout/", {baseURL: "/"})
    }
}
