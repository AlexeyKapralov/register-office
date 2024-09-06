import { Injectable } from '@nestjs/common';
import { AdministratorsRepository } from '../infrastructure/administrators.repository';
import { DoctorInputDto } from '../../doctors/api/dto/input/doctor-input.dto';
import { CryptoService } from '../../../base/services/crypto-service';
import { DoctorsViewDto } from '../../doctors/api/dto/output/doctors-view-dto';
import { InterlayerNotice } from '../../../base/models/interlayer';
import { UsersService } from '../../users/application/users.service';
import { DoctorsService } from '../../doctors/application/doctors.service';
import { DoctorInputUpdateDto } from '../../doctors/api/dto/input/doctor-input-update.dto';

@Injectable()
export class AdministratorsService {
    constructor(
        private usersService: UsersService,
        private cryptoService: CryptoService,
        private doctorsService: DoctorsService,
        private administratorsRepository: AdministratorsRepository,
    ) {}

    async createDoctor(
        doctorInputDto: DoctorInputDto,
    ): Promise<InterlayerNotice<DoctorsViewDto>> {
        const notice = new InterlayerNotice<DoctorsViewDto | null>();

        const passwordHash = await this.cryptoService.createPasswordHash(
            doctorInputDto.password,
        );
        const doctor = await this.administratorsRepository.createDoctor(
            doctorInputDto,
            passwordHash,
        );
        if (!doctor) {
            notice.addError('doctor was not created');
            return notice;
        }
        notice.addData(doctor);
        return notice;
    }

    async removeDoctor(doctorId: string): Promise<InterlayerNotice> {
        const notice = new InterlayerNotice();

        const checkDoctorAndGetUserIdInterlayer =
            await this.doctorsService.findUserIdByDoctorId(doctorId);
        if (checkDoctorAndGetUserIdInterlayer.hasError()) {
            notice.addError(
                checkDoctorAndGetUserIdInterlayer.extensions[0].message,
            );
            return notice;
        }

        const isDoctorDelete = await this.administratorsRepository.removeDoctor(
            checkDoctorAndGetUserIdInterlayer.data,
            doctorId,
        );
        if (!isDoctorDelete) {
            notice.addError('doctor was not delete');
            return notice;
        }
        return notice;
    }

    async updateDoctor(
        doctorId: string,
        doctorInputDto: DoctorInputUpdateDto,
    ): Promise<InterlayerNotice> {
        const notice = new InterlayerNotice();

        const doctorInterlayer =
            await this.doctorsService.findDoctorById(doctorId);

        if (doctorInterlayer.hasError()) {
            notice.addError('doctor was not found');
            return notice;
        }
        const userIdInterlayer =
            await this.doctorsService.findUserIdByDoctorId(doctorId);

        let passwordHash = null;
        if (doctorInputDto.password) {
            passwordHash = await this.cryptoService.createPasswordHash(
                doctorInputDto.password,
            );
        }

        const isDoctorUpdated =
            await this.administratorsRepository.updateDoctor(
                doctorInputDto,
                passwordHash,
                userIdInterlayer.data,
                doctorInterlayer.data.doctorId,
            );
        if (!isDoctorUpdated) {
            notice.addError('doctor was not updated');
            return notice;
        }
        return notice;
    }
}
