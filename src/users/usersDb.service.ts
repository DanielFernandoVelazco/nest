/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersDbService {

    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ) { }

    saveUser(user: Omit<User, 'id'>) {
        return this.usersRepository.save(user)
    }

    getUserById(id: string) {
        return this.usersRepository.findOne({ where: { id } })
    }

    getUsers() {
        return this.usersRepository.find()
    }

    getUserByName(name: string) {
        return this.usersRepository.findOne({ where: { name } })
    }

    getUserByEmail(email: string) {
        return this.usersRepository.findOne({ where: { email } })
    }
}