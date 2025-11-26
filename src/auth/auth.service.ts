import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    // REGISTRO
    async register(createUserDto: CreateUserDto) {
        try {
            const { password, ...userData } = createUserDto;

            const user = this.userRepository.create({
                ...userData,
                password: bcrypt.hashSync(password, 10),
            });

            await this.userRepository.save(user);

            const { password: _, ...userResponse } = user;
            return {
                ...userResponse,
                token: this.getJwtToken({ id: user.id }),
            };
        } catch (error) {
            this.handleDBErrors(error);
        }
    }

    // LOGIN
    async login(loginUserDto: LoginUserDto) {
        const { password, email } = loginUserDto;

        const user = await this.userRepository.findOne({
            where: { email },
            select: { email: true, password: true, id: true, nombre: true },
        });

        if (!user) throw new UnauthorizedException('Credenciales no válidas');

        // Verificar password
        if (!bcrypt.compareSync(password, user.password))
            throw new UnauthorizedException('Credenciales no válidas');

        const { password: _, ...userResponse } = user;
        return {
            ...userResponse,
            token: this.getJwtToken({ id: user.id }),
        };
    }

    // Generar JWT
    private getJwtToken(payload: { id: number }) {
        return this.jwtService.sign(payload);
    }

    // Manejo de errores centralizado
    private handleDBErrors(error: any): never {
        if (error.code === '23505') throw new BadRequestException('El email ya existe');
        console.log(error);
        throw new InternalServerErrorException('Por favor revisa los logs del servidor');
    }
}