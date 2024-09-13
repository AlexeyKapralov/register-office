import { UsersService } from './users.service';
import { UsersRepository } from '../infrastructure/users.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { InterlayerNotice } from '../../../base/models/interlayer';
import { Role } from '../../../base/models/role.enum';
import { UserViewDto } from '../api/dto/output/user-view.dto';
import { UsersModel } from '../../../database/models/users.model';
import * as userViewMapper from '../../../base/mappers/user-view.mapper';

describe('Users services unit tests', () => {
    let usersService: UsersService;
    let usersRepository: UsersRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: UsersRepository,
                    useValue: createMock<UsersRepository>(),
                },
            ],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        usersRepository = module.get<UsersRepository>(UsersRepository);
    });

    it('should create user', async () => {
        const passwordHash = 'passwordHash';
        const login = 'login';
        const email = 'email';
        const roleTitle = Role.Patient;

        const userViewDto: UserViewDto = {
            id: 'userId',
            createdAt: new Date(),
            login: login,
            email: email,
            roleId: 'role',
        };
        const notice = new InterlayerNotice<UserViewDto | null>(userViewDto);

        const user: UsersModel = {
            id: 'userId',
            login,
            email,
            password: passwordHash,
            roleId: roleTitle,
            createdAt: new Date(),
            deletedAt: new Date(),
        } as UsersModel;

        const usersViewDto: UserViewDto = {
            id: user.id,
            login: user.login,
            email: user.email,
            roleId: user.roleId,
            createdAt: user.createdAt,
        };

        jest.spyOn(usersRepository, 'getUserByLogin').mockResolvedValue(null);
        jest.spyOn(usersRepository, 'getUserByEmail').mockResolvedValue(null);
        jest.spyOn(usersRepository, 'createUser').mockResolvedValue(user);
        jest.spyOn(userViewMapper, 'userViewMapper').mockReturnValue(
            usersViewDto,
        );

        const result = await usersService.createUser(
            passwordHash,
            login,
            email,
            roleTitle,
            null,
        );
        expect(result.hasError()).toBeFalsy();
        expect(result.data).toEqual(usersViewDto);
    });

    it('should create user', async () => {
        const passwordHash = 'passwordHash';
        const login = 'login';
        const email = 'email';
        const roleTitle = Role.Patient;

        const userViewDto: UserViewDto = {
            id: 'userId',
            createdAt: new Date(),
            login: login,
            email: email,
            roleId: 'role',
        };
        const notice = new InterlayerNotice<UserViewDto | null>(userViewDto);

        const user: UsersModel = {
            id: 'userId',
            login,
            email,
            password: passwordHash,
            roleId: roleTitle,
            createdAt: new Date(),
            deletedAt: new Date(),
        } as UsersModel;

        const usersViewDto: UserViewDto = {
            id: user.id,
            login: user.login,
            email: user.email,
            roleId: user.roleId,
            createdAt: user.createdAt,
        };

        jest.spyOn(usersRepository, 'getUserByLogin').mockResolvedValue(null);
        jest.spyOn(usersRepository, 'getUserByEmail').mockResolvedValue(null);
        jest.spyOn(usersRepository, 'createUser').mockResolvedValue(user);
        jest.spyOn(userViewMapper, 'userViewMapper').mockReturnValue(
            usersViewDto,
        );

        const result = await usersService.createUser(
            passwordHash,
            login,
            email,
            roleTitle,
            null,
        );
        expect(result.hasError()).toBeFalsy();
        expect(result.data).toEqual(usersViewDto);
    });

    it('should get user role', async () => {
        const roleId = 'roleId';
        const roleTitle = 'roleTitle';
        const notice = new InterlayerNotice<string | null>(roleTitle);

        jest.spyOn(usersRepository, 'getUserRole').mockResolvedValue(roleTitle);

        const result = await usersService.getUserRole(roleId);
        expect(result.hasError()).toBeFalsy();
        expect(result.data).toEqual(roleTitle);
    });

    it('should delete user', async () => {
        const userId = 'userID';
        const notice = new InterlayerNotice();

        const user: UsersModel = {
            id: 'userId',
            login: 'login',
            email: 'email',
            password: 'passwordHash',
            roleId: 'roleTitle',
            createdAt: new Date(),
            deletedAt: new Date(),
        } as UsersModel;

        jest.spyOn(usersRepository, 'getUserById').mockResolvedValue(user);
        jest.spyOn(usersRepository, 'deleteUser').mockResolvedValue(true);

        const result = await usersService.deleteUser(userId, null);
        expect(result.hasError()).toBeFalsy();
    });

    it('should update user', async () => {
        const userId = 'userID';
        const login = 'login';
        const email = 'email';
        const passwordHash = 'passwordHash';
        const notice = new InterlayerNotice();

        const user: UsersModel = {
            id: 'userId',
            login: 'login',
            email: 'email',
            password: 'passwordHash',
            roleId: 'roleTitle',
            createdAt: new Date(),
            deletedAt: new Date(),
        } as UsersModel;

        jest.spyOn(usersRepository, 'getUserById').mockResolvedValue(user);
        jest.spyOn(usersRepository, 'updateUser').mockResolvedValue(true);

        const result = await usersService.updateUser(
            userId,
            login,
            email,
            passwordHash,
            null,
        );
        expect(result.hasError()).toBeFalsy();
    });
});
