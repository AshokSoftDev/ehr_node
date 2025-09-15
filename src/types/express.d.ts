import { Request } from 'express';
import { ParsedQs } from 'qs';

// declare global {
//     namespace Express {
//         interface Request {
//             user?: {
//                 userId: string;
//                 email: string;
//                 accountType: string;
//                 groupId?: string | null;
//             };
//         }
//     }
// }

// Typed request interfaces
export interface TypedRequest<TBody = any, TQuery = ParsedQs, TParams = any> extends Request {
    body: TBody;
    query: TQuery;
    params: TParams;
}

export interface AuthRequest<TBody = any, TQuery = ParsedQs, TParams = any> extends TypedRequest<TBody, TQuery, TParams> {
    user: {
        userId: string;
        email: string;
        accountType: string;
        groupId?: string;
    };
}
