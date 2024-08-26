/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { User } from "./user.interface";

@Injectable()
export class UsersRepository {

    private users: User[] = [
        {
            id: 1,
            name: 'User 1',
            email: 'QjKQK@example.com',
        },
        {
            id: 2,
            name: 'User 2',
            email: '2L0pW@example.com',
        },
        {
            id: 3,
            name: 'User 3',
            email: '3L0pW@example.com',
        }
    ]

    async getUsers() {
        return this.users;
    }

    async getById(id: number) {
        return this.users.find(user => user.id === id);
    }

    async getByName(name: string) {
        return this.users.find(user => user.name === name);
    }

    async createUser(user: Omit<User, 'id'>) {
        const id = this.users.length + 1;
        this.users = [... this.users, { id, ...user }]
        return { id, ...user }
    }
}