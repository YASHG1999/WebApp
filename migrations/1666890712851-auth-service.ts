import { MigrationInterface, QueryRunner } from "typeorm";

export class authService1666890712851 implements MigrationInterface {
    name = 'authService1666890712851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "auth"."user"
            ADD "is_deleted" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "auth"."user" DROP COLUMN "is_deleted"
        `);
    }

}
