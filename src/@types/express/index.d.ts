declare namespace Express {
    interface Request {
        account_number: string;
        username?: string;
        is_internal?: boolean;
    }
}
