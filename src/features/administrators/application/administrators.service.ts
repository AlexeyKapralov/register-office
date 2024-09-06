import { Injectable } from '@nestjs/common';
import { AdministratorsRepository } from '../infrastructure/administrators.repository';
import { DoctorInputDto } from '../../doctors/api/dto/input/doctor-input.dto';
import { CryptoService } from '../../../base/services/crypto-service';
import { DoctorsViewDto } from '../../doctors/api/dto/output/doctors-view-dto';
import { doctorViewMapper } from '../../../base/mappers/doctor-view.mapper';
import { InterlayerNotice } from '../../../base/models/interlayer';
import { UsersService } from '../../users/application/users.service';
import { Role } from '../../../base/models/role.enum';

@Injectable()
export class AdministratorsService {
    constructor(
        private administratorsRepository: AdministratorsRepository,
        private usersService: UsersService,
        private cryptoService: CryptoService,
    ) {}

    async createDoctor(
        doctorInputDto: DoctorInputDto,
    ): Promise<InterlayerNotice<DoctorsViewDto>> {
        const notice = new InterlayerNotice<DoctorsViewDto | null>();

        const passwordHash = await this.cryptoService.createPasswordHash(
            doctorInputDto.password,
        );
        const userInterlayer = await this.usersService.createUser(
            passwordHash,
            doctorInputDto.login,
            doctorInputDto.email,
            Role.Doctor,
        );
        if (userInterlayer.hasError()) {
            notice.addError(userInterlayer.extensions[0].message);
            return notice;
        }
        const doctor = await this.administratorsRepository.createDoctor(
            {
                ...doctorInputDto,
                password: passwordHash,
            },
            userInterlayer.data.id,
        );

        notice.addData(doctorViewMapper(doctor));
        return notice;
    }
}
