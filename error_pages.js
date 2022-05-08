class Base_Error {
    status
    message
    constructor(content) {
        this.content = content
    }
    render() {
        return `<!DOCTYPE html><html><body><h1>${this.status} - ${this.message}</h1>${this.content ?? ""
            }</body></html>`
    }
}

class Error400 extends Base_Error {
    status=400
    message='Bad Request'
}

class Error404 extends Base_Error {
    status = 404
    message = 'Not Found'
}
module.exports = { Error400,Error404 }