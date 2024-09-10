import * as bcrypt from 'bcrypt';

export class CryptoService {
    private readonly DEFAULT_SALT = 10;

    async createPasswordHash(
        password: string,
        salt: number = this.DEFAULT_SALT,
    ): Promise<string> {
        return await bcrypt.hash(password, salt);
    }

    async comparePasswordHash(
        password: string,
        dbHash: string,
    ): Promise<boolean> {
        return await bcrypt.compare(password, dbHash);
    }
}
