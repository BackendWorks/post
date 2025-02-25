import { ROLE } from '../enums/app.enum';

export interface IUser {
    id: string;
    email: string;
    username?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    isVerified: boolean;
    phone?: string;
    role: ROLE;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    isDeleted: boolean;
}
