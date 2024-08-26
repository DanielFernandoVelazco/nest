/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { File } from "./files.entity";
import { Repository } from "typeorm";
import { Todo } from "./todos.entity";


@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(File) private readonly fileRepository: Repository<File>
    ) { }

    async saveFile(
        { name, minetype, data, todo }: {
            name: string,
            minetype: string,
            data: Buffer,
            todo: Todo
        }
    ) {
        const file = new File()
        file.name = name
        file.mimeType = minetype
        file.date = data
        file.todo = todo
        return this.fileRepository.save(file)
    }
}