// SyntaxError: Block-scoped declarations (let, const, function, class) not yet supported outside strict mode
'use strict';
module.export = class Todo {
    // constructor(title='') { SyntaxError: Unexpected token =
    constructor(title) {
        this.title = title
    }
}
