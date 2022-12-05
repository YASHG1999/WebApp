import { MigrationInterface, QueryRunner } from 'typeorm';

export class authService1670222936303 implements MigrationInterface {
  name = 'authService1670222936303';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "auth"."user_store_mapping"
        (
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_by" uuid,
            "id"         SERIAL    NOT NULL,
            "user_id"    uuid      NOT NULL,
            "store_id"   integer   NOT NULL,
            "is_active"  boolean   NOT NULL DEFAULT true,
            CONSTRAINT "PK_203d6527fd4ceba996b9e6f0e99" PRIMARY KEY ("id")
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "auth"."user_store_mapping"
    `);
  }
}
