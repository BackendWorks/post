import { ROLE } from '../enums/app.enum';

export interface IAuthPayload {
    id: string;
    role: ROLE;
}

export interface IRequest {
    user: IAuthPayload;
}
