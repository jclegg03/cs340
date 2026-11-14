export class Service {
    protected apiUrl: string;

    constructor() {
        this.apiUrl = "https://u74wryiyf1.execute-api.us-west-2.amazonaws.com/dev";
    }

    protected callApi<ResT, ReqT>(
        endpoint: string,
        method: string,
        body?: ReqT
    ): Promise<ResT> {
        return fetch(`${this.apiUrl}/${endpoint}`, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : undefined,
        }).then((res) => res.json());
    }
}