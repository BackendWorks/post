import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/config/constants';

export const Roles = (roles: Role[]) => SetMetadata('roles', roles);
