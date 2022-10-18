import { MigrationInterface, QueryRunner } from "typeorm";

export class authService1666086743485 implements MigrationInterface {
    name = 'authService1666086743485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "auth"."user"
            ADD "greeting" character varying(100)
        `);
        await queryRunner.query(`
            ALTER TYPE "auth"."user_roles_enum"
            RENAME TO "user_roles_enum_old"
        `);
        await queryRunner.query(`
            CREATE TYPE "auth"."user_roles_enum" AS ENUM(
                'VISITOR',
                'ADMIN',
                'REVENUEMANAGER',
                'CLUSTERMANAGER',
                'SHIFTMANAGER',
                'FRANCHISEOWNER',
                'CONSUMER',
                'WAREHOUSEADMIN',
                'INTERNAL',
                'INTEGRATION'
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "auth"."user"
            ALTER COLUMN "roles" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "auth"."user"
            ALTER COLUMN "roles" TYPE "auth"."user_roles_enum" [] USING "roles"::"text"::"auth"."user_roles_enum" []
        `);
        await queryRunner.query(`
            ALTER TABLE "auth"."user"
            ALTER COLUMN "roles"
            SET DEFAULT '{VISITOR}'
        `);
        await queryRunner.query(`
            DROP TYPE "auth"."user_roles_enum_old"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "auth"."user_roles_enum_old" AS ENUM(
                'VISITOR',
                'ADMIN',
                'REVENUEMANAGER',
                'CLUSTERMANAGER',
                'SHIFTMANAGER',
                'FRANCHISEOWNER',
                'CONSUMER',
                'WAREHOUSEADMIN',
                'INTERNAL'
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "auth"."user"
            ALTER COLUMN "roles" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "auth"."user"
            ALTER COLUMN "roles" TYPE "auth"."user_roles_enum_old" [] USING "roles"::"text"::"auth"."user_roles_enum_old" []
        `);
        await queryRunner.query(`
            ALTER TABLE "auth"."user"
            ALTER COLUMN "roles"
            SET DEFAULT '{VISITOR}'
        `);
        await queryRunner.query(`
            DROP TYPE "auth"."user_roles_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "auth"."user_roles_enum_old"
            RENAME TO "user_roles_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "auth"."user" DROP COLUMN "greeting"
        `);
    }

}
