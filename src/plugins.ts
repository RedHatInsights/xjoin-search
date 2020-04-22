import { ValidationError, UserInputError } from 'apollo-server-express';
import log from './util/log';
import * as probes from './probes';
import {GraphQLRequestContext} from 'apollo-server-types';

function errorHandler (e: any) {
    // TODO: there are more error types that should be treated as validation errors
    if (e instanceof ValidationError || e.originalError instanceof UserInputError || e.originalError === undefined) {
        probes.validationError(e);
    } else {
        probes.systemError(e);
    }

    return e;
}

export const observabilityPlugin = {
    requestDidStart<T>(requestContext: GraphQLRequestContext<T>) {
        log.debug({query: requestContext.request.query, variables: requestContext.request.variables}, 'incoming GraphQL query');

        return {
            didEncounterErrors<T>(errors: GraphQLRequestContext<T>) {
                if (errors.errors) {
                    errors.errors.forEach((e: any) => errorHandler(e));
                }
            }
        };
    }
};
