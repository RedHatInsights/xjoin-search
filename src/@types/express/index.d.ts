declare namespace Express {
    interface Request {
        org_id: string;
        username?: string;
        is_internal?: boolean;
    }
}
