import * as client from 'prom-client';
import config from '../config';
import { Request, Response, Application } from 'express';
import promBundle from 'express-prom-bundle';

export { client };

export default function start (app: Application) {
    app.get('/metrics', (req: Request, res: Response) => {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(client.register.metrics());
        res.end();
    });

    const prefix = config.metrics.prefix;
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
