declare namespace Express { // eslint-disable-line @typescript-eslint/no-namespace
    export interface Request {
        account_number: string;
        username: string;
        is_internal: boolean;
    }
}

declare module 'pino-cloudwatch' {
    export default function build (options: any): any;
}
