import { UsersModel } from '../../database/models/users.model';
import { UserViewDto } from '../../features/users/api/dto/output/user-view.dto';

export const userViewMapper = (user: UsersModel): UserViewDto => {
    return {
        id: user.id,
        login: user.login,
        email: user.email,
        roleId: user.roleId,
        createdAt: user.createdAt,
    };
};
