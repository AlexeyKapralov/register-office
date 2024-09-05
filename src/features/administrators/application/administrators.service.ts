import { Injectable } from '@nestjs/common';
import { AdministratorsRepository } from '../infrastructure/administrators.repository';
import { DoctorInputDto } from '../../doctors/api/dto/input/doctor-input.dto';
import { CryptoService } from '../../../base/services/crypto-service';

@Injectable()
export class AdministratorsService {
    constructor(
        private administratorsRepository: AdministratorsRepository,
        private cryptoService: CryptoService,
    ) {}

    async createUser(doctorInputDto: DoctorInputDto) {
        doctorInputDto.password = await this.cryptoService.createPasswordHash(
            doctorInputDto.password,
        );
        const user =
            await this.administratorsRepository.createDoctor(doctorInputDto);

        return user;
    }
}
