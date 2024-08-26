import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminCorregido1724119069800 implements MigrationInterface {
    name = 'AddAdminCorregido1724119069800'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "IsAdmin" TO "isAdmin"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "isAdmin" TO "IsAdmin"`);
    }

}
