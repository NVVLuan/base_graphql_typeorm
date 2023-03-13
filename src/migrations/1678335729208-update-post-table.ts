import { MigrationInterface, QueryRunner } from "typeorm";

export class updatePostTable1678335729208 implements MigrationInterface {
    name = 'updatePostTable1678335729208'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "age" integer NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'ghost', "email" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "voucher" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "status" "public"."voucher_status_enum" NOT NULL DEFAULT 'not_active', "eventId" uuid, "userId" uuid, CONSTRAINT "PK_677ae75f380e81c2f103a57ffaf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_001fc95326b5aa94ee174e54bd" ON "voucher" ("eventId") `);
        await queryRunner.query(`CREATE TABLE "event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name_event" character varying NOT NULL, "issued" integer NOT NULL, "edit_by" character varying, "max_quantity" integer NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "voucher" ADD CONSTRAINT "FK_001fc95326b5aa94ee174e54bd9" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "voucher" ADD CONSTRAINT "FK_80a57d757e0be8225f261c7994f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher" DROP CONSTRAINT "FK_80a57d757e0be8225f261c7994f"`);
        await queryRunner.query(`ALTER TABLE "voucher" DROP CONSTRAINT "FK_001fc95326b5aa94ee174e54bd9"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_001fc95326b5aa94ee174e54bd"`);
        await queryRunner.query(`DROP TABLE "voucher"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
