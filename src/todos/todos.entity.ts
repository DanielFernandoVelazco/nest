/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { File } from "./files.entity";

@Entity({
    name: 'todos',
})

export class Todo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ default: false })
    isCompleted: boolean;

    @OneToMany(() => File, (file) => file.todo)
    files: File[]
}