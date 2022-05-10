declare namespace Express {
    interface Request {
        account_number: string;
        org_id: string;
        username?: string;
        is_internal?: boolean;
    }
}
