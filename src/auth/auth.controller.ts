import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({
        summary: 'Registrar un nuevo usuario',
        description: 'Crea un nuevo usuario en el sistema y devuelve el token de acceso inicial.'
    })
    register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Post('login')
    @ApiOperation({
        summary: 'Iniciar sesión',
        description: 'Valida credenciales (email/password) y devuelve un token JWT para acceder a rutas protegidas.'
    })
    login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @Get('profile')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @ApiOperation({
        summary: 'Obtener perfil actual',
        description: 'Devuelve la información del usuario autenticado basado en el JWT enviado.'
    })
    getProfile(@Request() req: any) {
        return {
            mensaje: 'Esta es una ruta privada',
            user: req.user
        };
    }
}