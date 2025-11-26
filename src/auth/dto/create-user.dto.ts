import { IsEmail, IsString, MinLength, Min } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(1)
    nombre: string;

    @IsString()
    @IsEmail({}, { message: 'El email no es válido' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;
}