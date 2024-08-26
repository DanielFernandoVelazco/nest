/* eslint-disable prettier/prettier */
import { Controller, Delete, Get, Post, Put, Res, Req, Param, Query, Body, UseInterceptors, ParseUUIDPipe, HttpException, HttpStatus, NotFoundException, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response, Request } from 'express';
//import { User } from './user.interface';
//import { User as UserEntity } from './users.entity';
//import { AuthGuard } from 'src/guards/auth.guard';
import { DateAdderInterceptor } from 'src/interceptors/dateAdder.interceptor';
import { UsersDbService } from './usersDb.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from './dtos/userCredentials.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from 'src/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
//import { request } from 'http';
//import { MinSizeValidatorPipe } from 'src/pipes/min-size-validator.pipe';

@ApiTags('Users')
@Controller('users')
//@UseGuards(AuthGuard)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly usersDbService: UsersDbService,
        private readonly cloudinaryService: CloudinaryService,
        private readonly authService: AuthService
    ) { }

    @Get()
    getUsers(@Query('name') name?: string) {

        if (name) return this.usersDbService.getUserByName(name);

        return this.usersDbService.getUsers();
    }

    @ApiBearerAuth()
    @Get('profile')
    @UseGuards(AuthGuard)
    getUserProfile(
        /*@Headers('token') token?: string*/
        @Req() request: Request & { user: any }
    ) {
        //if (token !== '123') return 'Sin acceso';
        console.log(request.user);
        return 'Este endpoint retorna el perido de un usuario';
    }

    @ApiBearerAuth()
    @Post('profile/images')
    @UseInterceptors(FileInterceptor('image'))
    @UseGuards(AuthGuard)
    getUserImages(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({
                    maxSize: 100000,
                    message: 'El tamaño maximo es de 100kb'
                }),
                new FileTypeValidator({
                    fileType: /(jpg|jpeg|png|webp)$/,
                })
            ]
        })
    ) file: Express.Multer.File) {
        //return this.cloudinaryService.uploadImage(file);
        return file;
    }

    //@HttpCode(418)
    @Get('coffee')
    getCoffee() {
        try {
            throw new Error()
        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.I_AM_A_TEAPOT,
                    error: "Envio de cafe fallido"
                },
                HttpStatus.I_AM_A_TEAPOT
            )
        }
    }

    @Get('message')
    getMessage(@Res() response: Response) {
        response.status(200).send('Este es un mensaje');
    }

    @Get('request')
    getRequest(@Req() request: Request) {
        console.log(request);
        return 'Esta ruta loguea el request';
    }

    @Get('admin')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    getAdmin() {
        return 'Ruta protegida'
    }

    @Get(':id')
    async getUserById(@Param('id', ParseUUIDPipe) id: string) {
        const user = await this.usersDbService.getUserById((id));
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        return user
    }

    @Post('signup')
    @UseInterceptors(DateAdderInterceptor)
    createUser(@Body() user: CreateUserDto, @Req() request: Request & { now: string }) {
        //console.log('dentro del endpoint', request.now);
        //console.log({ user });
        return this.authService.signUp({
            ...user,
            created_at: request.now,
            //IsAdmin: false
        });
    }

    @Get('auth0/protected')
    getAuth0Protected(@Req() req: Request) {
        return JSON.stringify(req.oidc.user);
    }

    @Post('signin')
    async signin(@Body() user: UserCredentialsDto) {
        //console.log('Received DTO:', user);
        return this.authService.signIn(user.email, user.password);
    }

    @Put()
    updateUser() {
        return 'Este endpoint modifica un usuario';
    }

    @Delete()
    deleteUser() {
        return 'Este endpoint elimina un usuario';
    }
}