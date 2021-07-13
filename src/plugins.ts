import { ValidationError, UserInputError } from 'apollo-server-express';
import log from './util/log';
import * as probes from './probes';
import {GraphQLRequestContext} from 'apollo-server-types';
import {GraphQLRequestListener} from 'apollo-server-plugin-base';

function errorHandler (e: any) {
    // TODO: there are more error @types that should be treated as validation errors
    if (e instanceof ValidationError || e.originalError instanceof UserInputError || e.originalError === undefined) {
        probes.validationError(e);
    } else {
        probes.systemError(e);
    }

    return e;
}

export const observabilityPlugin = {
    async requestDidStart<T>(requestContext: GraphQLRequestContext<T>): Promise<GraphQLRequestListener<T> | void> {
        log.debug({query: requestContext.request.query, variables: requestContext.request.variables}, 'incoming GraphQL query');

        return {
            async didEncounterErrors<T>(errors: GraphQLRequestContext<T>) {
                if (errors.errors) {
                    errors.errors.forEach((e: any) => errorHandler(e));
                }
            }
        };
    }
};
