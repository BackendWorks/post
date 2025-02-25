import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { ROLES_DECORATOR_KEY } from '../constants/request.constant';
import { ROLE } from '../enums/app.enum';

export const AllowedRoles = (roles: ROLE[]): CustomDecorator<string> =>
    SetMetadata(ROLES_DECORATOR_KEY, roles);
