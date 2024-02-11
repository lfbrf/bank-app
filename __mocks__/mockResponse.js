class Response {
    constructor(body, options) {
      this.body = body;
      this.options = options;
    }
  
    async json() {
      return JSON.parse(this.body);
    }
  }
  
  module.exports = Response;