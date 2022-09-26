import { MigrationInterface, QueryRunner } from 'typeorm';

export class authService1664181075993 implements MigrationInterface {
  name = 'authService1664181075993';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
                'INTERNAL'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "auth"."user" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" uuid,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(100),
                "country_code" character varying(5),
                "phone_number" character varying(15),
                "email" character varying(255),
                "avatar_url" character varying(255),
                "phone_confirmed_at" TIMESTAMP,
                "email_confirmed_at" TIMESTAMP,
                "last_sign_in_at" TIMESTAMP,
                "meta_data" jsonb DEFAULT '[]',
                "is_active" boolean NOT NULL DEFAULT true,
                "is_verified" boolean NOT NULL DEFAULT false,
                "banned_until" TIMESTAMP,
                "roles" "auth"."user_roles_enum" array NOT NULL DEFAULT '{VISITOR}',
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_01eea41349b6c9275aec646eee" ON "auth"."user" ("phone_number")
        `);
    await queryRunner.query(`
            CREATE TABLE "auth"."otp_tokens" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" uuid,
                "id" SERIAL NOT NULL,
                "otp" character varying(6) NOT NULL,
                "user_id" uuid,
                "phone_number" character varying(12) NOT NULL,
                "valid_till" TIMESTAMP NOT NULL,
                "sent_at" TIMESTAMP,
                "retries_count" integer DEFAULT '5',
                "retries_allowed" integer DEFAULT '5',
                CONSTRAINT "PK_424fa4c4152eafc0b2d929e138d" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_f1e3c3fc7ef592324f5a32d85e" ON "auth"."otp_tokens" ("phone_number")
        `);
    await queryRunner.query(`
            CREATE TABLE "auth"."refresh_token" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" uuid,
                "id" SERIAL NOT NULL,
                "token" character varying(1000),
                "user_id" uuid,
                "valid_till" TIMESTAMP,
                "revoked" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_6bbe63d2fe75e7f0ba1710351d" ON "auth"."refresh_token" ("user_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "auth"."devices" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" uuid,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid,
                "device_id" character varying,
                "mac_address" character varying(100),
                "manufacturer" character varying(100),
                "model" character varying(100),
                "os" character varying(100),
                "app_version" character varying(20),
                "is_active" boolean NOT NULL DEFAULT true,
                "last_refreshed_at" TIMESTAMP,
                "notification_token" character varying(255),
                CONSTRAINT "PK_b1514758245c12daf43486dd1f0" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_5e9bee993b4ce35c3606cda194" ON "auth"."devices" ("user_id")
        `);
    await queryRunner.query(`
            CREATE TYPE "auth"."addresses_type_enum" AS ENUM('Home', 'Work', 'Other')
        `);
    await queryRunner.query(`
            CREATE TABLE "auth"."addresses" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_by" uuid,
                "id" SERIAL NOT NULL,
                "user_id" character varying NOT NULL,
                "name" character varying,
                "type" "auth"."addresses_type_enum" NOT NULL DEFAULT 'Other',
                "lat" double precision NOT NULL,
                "long" double precision NOT NULL,
                "is_default" boolean,
                "address_line_1" character varying NOT NULL,
                "address_line_2" character varying,
                "landmark" character varying,
                "city" character varying,
                "state" character varying,
                "pincode" integer,
                "is_active" boolean NOT NULL DEFAULT true,
                "contact_number" character varying,
                CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "auth"."otp_tokens"
            ADD CONSTRAINT "FK_7003728e208144a06a974b2dbe2" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "auth"."refresh_token"
            ADD CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "auth"."devices"
            ADD CONSTRAINT "FK_5e9bee993b4ce35c3606cda194c" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "auth"."devices" DROP CONSTRAINT "FK_5e9bee993b4ce35c3606cda194c"
        `);
    await queryRunner.query(`
            ALTER TABLE "auth"."refresh_token" DROP CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4"
        `);
    await queryRunner.query(`
            ALTER TABLE "auth"."otp_tokens" DROP CONSTRAINT "FK_7003728e208144a06a974b2dbe2"
        `);
    await queryRunner.query(`
            DROP TABLE "auth"."addresses"
        `);
    await queryRunner.query(`
            DROP TYPE "auth"."addresses_type_enum"
        `);
    await queryRunner.query(`
            DROP INDEX "auth"."IDX_5e9bee993b4ce35c3606cda194"
        `);
    await queryRunner.query(`
            DROP TABLE "auth"."devices"
        `);
    await queryRunner.query(`
            DROP INDEX "auth"."IDX_6bbe63d2fe75e7f0ba1710351d"
        `);
    await queryRunner.query(`
            DROP TABLE "auth"."refresh_token"
        `);
    await queryRunner.query(`
            DROP INDEX "auth"."IDX_f1e3c3fc7ef592324f5a32d85e"
        `);
    await queryRunner.query(`
            DROP TABLE "auth"."otp_tokens"
        `);
    await queryRunner.query(`
            DROP INDEX "auth"."IDX_01eea41349b6c9275aec646eee"
        `);
    await queryRunner.query(`
            DROP TABLE "auth"."user"
        `);
    await queryRunner.query(`
            DROP TYPE "auth"."user_roles_enum"
        `);
  }
}
