import { MigrationInterface, QueryRunner } from 'typeorm';

export class authService1664181146789 implements MigrationInterface {
  name = 'authService1664181146789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "auth"."addresses"
            ADD "lithos_ref" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "auth"."addresses"
            ALTER COLUMN "lat" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "auth"."addresses"
            ALTER COLUMN "long" DROP NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "auth"."addresses"
            ALTER COLUMN "long"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "auth"."addresses"
            ALTER COLUMN "lat"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "auth"."addresses" DROP COLUMN "lithos_ref"
        `);
  }
}
