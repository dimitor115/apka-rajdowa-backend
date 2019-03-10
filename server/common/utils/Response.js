
export default class Response {
  constructor(body = null, httpCode = 200, messages = []) {
    this.body = body
    this.httpCode = httpCode
    this.messages = Array.isArray(messages) ? messages : [messages]
  }
}
