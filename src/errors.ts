import { ApolloError } from 'apollo-server-express';

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
    constructor(original_error: any, message = 'Elastic seach error', code = 'ELASTIC_SEARCH_ERROR') {
        super(message, code, {original_error});
    }
}

export class ResultWindowError extends ElasticSearchError {
    constructor(original_error: any,
        message = 'Request could not be completed because the page is too deep',
        code = 'REQUEST_WINDOW_ERROR')
    {
        super(original_error, message, code);
    }
}
