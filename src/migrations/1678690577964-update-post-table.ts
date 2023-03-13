import { MigrationInterface, QueryRunner } from "typeorm";

export class updatePostTable1678690577964 implements MigrationInterface {
    name = 'updatePostTable1678690577964'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "voucher" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "status" "public"."voucher_status_enum" NOT NULL DEFAULT 'not_active', "eventId" uuid, "userId" uuid, CONSTRAINT "PK_677ae75f380e81c2f103a57ffaf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_001fc95326b5aa94ee174e54bd" ON "voucher" ("eventId") `);
        await queryRunner.query(`ALTER TABLE "voucher" ADD CONSTRAINT "FK_001fc95326b5aa94ee174e54bd9" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "voucher" ADD CONSTRAINT "FK_80a57d757e0be8225f261c7994f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher" DROP CONSTRAINT "FK_80a57d757e0be8225f261c7994f"`);
        await queryRunner.query(`ALTER TABLE "voucher" DROP CONSTRAINT "FK_001fc95326b5aa94ee174e54bd9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_001fc95326b5aa94ee174e54bd"`);
        await queryRunner.query(`DROP TABLE "voucher"`);
    }

}
