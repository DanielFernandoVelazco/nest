/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { TodosService } from './todos.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ToDos')
@Controller('todos')

export class TodosController {
    constructor(
        private readonly todosService: TodosService,
        private readonly filesService: FilesService
    ) { }

    @Get()
    getTodos() {
        return this.todosService.getTodos();
    }

    @Get(':id')
    @UsePipes(new ValidationPipe({ transform: true }))
    getTodoById(@Param('id') id: number) {
        return this.todosService.findById(id)
    }

    @Post()
    createTodo(@Body() todo: any) {
        return this.todosService.create(todo)
    }


    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @Body('id') id: number,
        @UploadedFile() file: Express.Multer.File
    ) {
        const todo = await this.todosService.findById(id)

        return this.filesService.saveFile({
            name: file.originalname,
            minetype: file.mimetype,
            data: file.buffer,
            todo
        })
    }
}