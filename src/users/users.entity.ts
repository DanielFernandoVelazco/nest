/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { Column } from "typeorm";

@Entity({
    name: 'users'
})

export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid()

    @Column()
    name: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({ default: false })
    isAdmin: boolean

    @Column()
    created_at: string
}