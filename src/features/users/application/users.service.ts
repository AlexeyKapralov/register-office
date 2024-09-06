import { Injectable } from '@nestjs/common';
import { InterlayerNotice } from '../../../base/models/interlayer';
import { UserViewDto } from '../api/dto/output/user-view.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { Role } from '../../../base/models/role.enum';

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository) {}

    async createUser(
        passwordHash: string,
        login: string,
        email: string,
        roleTitle: Role,
    ): Promise<InterlayerNotice<UserViewDto | null>> {
        const notice = new InterlayerNotice<UserViewDto | null>();

        const userByLogin = await this.usersRepository.findUserByLogin(login);
        const userByEmail = await this.usersRepository.findUserByEmail(email);
        if (userByLogin || userByEmail) {
            notice.addError('login or email already exist');
            return notice;
        }

        const user = await this.usersRepository.createUser(
            passwordHash,
            login,
            email,
            roleTitle,
        );
        if (!user) {
            notice.addError('user was not created');
            return notice;
        }
        notice.addData(user);
        return notice;
    }
}
