'use strict';

class ExtendableError extends Error {
  constructor(message){
    super(message);
    this.message = message;
    if (typeof Error.captureStackTrace === 'function'){
      Error.captureStackTrace(this, this.constructor);
    }
    else {
      this.stack = (new Error(message)).stack;
    }
  }
}

class NotValidId extends ExtendableError {
  constructor(message) {
    super(message);
    this.name = 'NotValidId';
  }
}

module.exports.NotValidId = NotValidId;
