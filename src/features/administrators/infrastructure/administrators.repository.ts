import { Inject, Injectable } from '@nestjs/common';
import { ModelClass } from 'objection';
import { UsersModel } from '../../../database/models/users.model';
import { DoctorInputDto } from '../../doctors/api/dto/input/doctor-input.dto';

@Injectable()
export class AdministratorsRepository {
    constructor(
        @Inject('UsersModel')
        private readonly usersModel: ModelClass<UsersModel>,
    ) {}

    async createDoctor(doctorInputDto: DoctorInputDto) {
        const user = await this.usersModel.query().insert({
            createdAt: new Date(),
            password: doctorInputDto.password,
            login: doctorInputDto.login,
            email: doctorInputDto.email,
            //todo временную заглушку убрать
            roleId: '550e8400-e29b-41d4-a716-446655440000',
        });
        return user;
    }
}
