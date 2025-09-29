import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface JwtUser {
  id: number;
  email: string;
  role: string;
}

export const CurrentUser = createParamDecorator(
  (data: keyof JwtUser | undefined, ctx: ExecutionContext): unknown => {
    const req = ctx.switchToHttp().getRequest<{ user: JwtUser }>();

    const user = req.user;

    if (data) {
      return user[data];
    }
    return user;
  },
);
