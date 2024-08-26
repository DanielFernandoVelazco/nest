/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsEmail, MinLength, IsEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'The name of the user have to be three characters long',
        example: 'User_1'
    })
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @ApiProperty({
        description: 'The email of the user have to be email valid',
        example: 'QjKQK@example.com'
    })
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @ApiProperty({
        description: 'The password of the user have to be six characters long',
        example: '123456'
    })
    password: string;

    @IsEmpty()
    @ApiProperty({
        description: 'The isAdmin is asigned by system default ',
        example: 'false'
    })
    isAdmin: boolean;
}