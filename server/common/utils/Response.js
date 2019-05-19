
export default class Response {
    constructor(data = null, httpCode = 200, messages = []) {
        this.data = data
        this.httpCode = httpCode
        this.messages = Array.isArray(messages) ? messages : [messages]
    }
}
