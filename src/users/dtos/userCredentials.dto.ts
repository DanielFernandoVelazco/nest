/* eslint-disable prettier/prettier */
import { CreateUserDto } from "./createUser.dto";
import { PickType } from "@nestjs/swagger";

export class UserCredentialsDto extends PickType(CreateUserDto, [
    'email',
    'password',
]) { }

