import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { IRequest } from '../interfaces/request.interface';

export const AuthUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<IRequest>();
        return request.user;
    },
);
