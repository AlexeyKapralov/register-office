import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../models/role.enum';
import { ROLES_KEY } from '../../common/decorators/validate/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );
        const { user } = context.switchToHttp().getRequest();

        if (!requiredRoles) {
            return user;
        }

        if (requiredRoles.some((role) => user.role?.includes(role))) {
            return user;
        } else {
            return false;
        }
    }
}
