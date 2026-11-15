import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { Users } from './entities/users.entity';
import { ErrorHandlingService } from '../../common/response/errorHandler.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly errorHandler: ErrorHandlingService,
    ) {}

    async findById(id: string): Promise<Users | null> {
        return this.usersRepository.findOne({
            where: { id, deleted: false },
            relations: { role: true, children: true },
        });
    }

    async findByEmail(email: string): Promise<Users | null> {
        return this.usersRepository.findOne({
            where: { email: email.toLowerCase().trim(), deleted: false },
            relations: { role: true, children: true },
        });
    }

    async create(user: Users): Promise<Users> {
        return this.usersRepository.create(user);
    }

    async update(id: string, partial: Partial<Users>): Promise<Users | null> {
        return this.usersRepository.update({ id }, partial as any);
    }

    async markEmailVerified(id: string): Promise<void> {
        await this.usersRepository.update({ id }, { emailVerified: true });
    }

    async findAll(): Promise<Users[]> {
        return this.usersRepository.find({
            where: { deleted: false },
            relations: { role: true, children: true },
        });
    }
}
