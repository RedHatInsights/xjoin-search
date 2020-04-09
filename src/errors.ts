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
    constructor() {
        super("elastic search encountered an error",
        "ELASTIC_SEARCH_ERROR");
    }
}

export class ResultWindowError extends ApolloError {
    constructor() {
        super("request could not be completed because the page is too deep",
        "PAGE_TOO_DEEP")
    }
}