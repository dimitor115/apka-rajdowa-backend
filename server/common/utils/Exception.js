export default class Exception {
  constructor(messages = [], httpCode = 500) {
    this.messages = Array.isArray(messages) ? messages : [messages];
    this.httpCode = httpCode;
  }
}
