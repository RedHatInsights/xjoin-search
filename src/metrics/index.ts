import * as client from 'prom-client';
import config from '../config';
import { Request, Response, Application } from 'express';

export { client };

export default function start (app: Application) {
    client.collectDefaultMetrics({
        prefix: config.metrics.prefix,
        timeout: 5000
    });

    app.get('/metrics', (req: Request, res: Response) => {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(client.register.metrics());
        res.end();
    });
}
