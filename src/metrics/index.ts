import * as client from 'prom-client';
import config from '../config';
import { Request, Response, Application } from 'express';
import promBundle from 'express-prom-bundle';

export { client };

const prefix = config.metrics.prefix;

export const esResponseHistogram = new client.Histogram({
    name: `${prefix}es_request_duration_seconds`,
    help: 'Elasticsearch query duration according to query type.',
    labelNames: ['query_type'],
    buckets: [0.003, 0.03, 0.1, 0.3, 1.5, 10]
});

export default function start (app: Application, path: string) {
    app.get(path, (req: Request, res: Response) => {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(client.register.metrics());
        res.end();
    });

    const opts = {
        httpDurationMetricName: `${prefix}http_request_duration_seconds`,
        includeUp: false,
        includeMethod: false,
        includePath: false,
        includeStatusCode: true,

        promClient: {
            collectDefaultMetrics: {
                prefix
            }
        }
    };

    const metricsMiddleware = promBundle(opts);

    app.use(metricsMiddleware);
}
