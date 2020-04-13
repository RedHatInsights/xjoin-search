import { ApolloError } from "apollo-server-express";

export default class HttpError extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
      super(message);
      this.status = status;
      this.message = message;
  }
}

export class HttpErrorBadRequest extends HttpError {
    constructor(message = 'BadRequest') {
        super(400, message);
    }
}

export class HttpErrorUnauthorized extends HttpError {
    constructor() {
        super(401, 'Unauthorized');
    }
}

export class HttpErrorForbidden extends HttpError {
    constructor() {
        super(403, 'Forbidden');
    }
}

export class ElasticSearchError extends ApolloError {
    constructor( original_error:any, message:string = "elastic seach error") {
        super(`${message} || Original error: ${original_error}`,
        "ELASTIC_SEARCH_ERROR");
    }
}

export class ResultWindowError extends ElasticSearchError {
    constructor(original_error:any, message:string = "request could not be completed because the page is too deep") {
        super(`${message} || Original error: ${original_error}`,
        "PAGE_TOO_DEEP")
    }
}