import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1759170983213 implements MigrationInterface {
    name = 'InitSchema1759170983213'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stops" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "country" character varying DEFAULT 'Україна', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_user_id" integer, "updated_by_user_id" integer, CONSTRAINT "PK_ed1be877403ad3c921b07f62ca5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_672de41eee4b73747c1eb35198" ON "stops" ("name") `);
        await queryRunner.query(`CREATE TABLE "routes" ("id" SERIAL NOT NULL, "schedule_id" integer NOT NULL, "stop_id" integer NOT NULL, "sequence" integer NOT NULL, "arrival_time" TIMESTAMP WITH TIME ZONE, "departure_time" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_user_id" integer, "updated_by_user_id" integer, CONSTRAINT "UQ_a4db8185e06604d74b5550de1ea" UNIQUE ("schedule_id", "sequence"), CONSTRAINT "PK_76100511cdfa1d013c859f01d8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0cc44f759b913295418d135c89" ON "routes" ("schedule_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_07e81c9d003f0adc3eaa233b84" ON "routes" ("stop_id") `);
        await queryRunner.query(`CREATE TYPE "public"."schedules_type_enum" AS ENUM('regional', 'regional_express', 'night_express', 'night_fast', 'night_passenger')`);
        await queryRunner.query(`CREATE TABLE "schedules" ("id" SERIAL NOT NULL, "train_number" character varying NOT NULL, "type" "public"."schedules_type_enum" NOT NULL DEFAULT 'night_fast', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by_user_id" integer, "updated_by_user_id" integer, CONSTRAINT "PK_7e33fc2ea755a5765e3564e66dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6bd9f63215dec683eb8ae29b68" ON "schedules" ("train_number") `);
        await queryRunner.query(`CREATE TABLE "favorite_schedules" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "schedule_id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_18dd178a871bf7ec4dbc93faced" UNIQUE ("user_id", "schedule_id"), CONSTRAINT "PK_b7d2994e2b28ad3d2eed61ebd08" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cedd9a469602456ce0fae03c6b" ON "favorite_schedules" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7a08779095edf66b95ded3180b" ON "favorite_schedules" ("schedule_id") `);
        await queryRunner.query(`ALTER TABLE "routes" ADD CONSTRAINT "FK_0cc44f759b913295418d135c892" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "routes" ADD CONSTRAINT "FK_07e81c9d003f0adc3eaa233b840" FOREIGN KEY ("stop_id") REFERENCES "stops"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite_schedules" ADD CONSTRAINT "FK_cedd9a469602456ce0fae03c6b4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorite_schedules" ADD CONSTRAINT "FK_7a08779095edf66b95ded3180bb" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorite_schedules" DROP CONSTRAINT "FK_7a08779095edf66b95ded3180bb"`);
        await queryRunner.query(`ALTER TABLE "favorite_schedules" DROP CONSTRAINT "FK_cedd9a469602456ce0fae03c6b4"`);
        await queryRunner.query(`ALTER TABLE "routes" DROP CONSTRAINT "FK_07e81c9d003f0adc3eaa233b840"`);
        await queryRunner.query(`ALTER TABLE "routes" DROP CONSTRAINT "FK_0cc44f759b913295418d135c892"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7a08779095edf66b95ded3180b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cedd9a469602456ce0fae03c6b"`);
        await queryRunner.query(`DROP TABLE "favorite_schedules"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6bd9f63215dec683eb8ae29b68"`);
        await queryRunner.query(`DROP TABLE "schedules"`);
        await queryRunner.query(`DROP TYPE "public"."schedules_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_07e81c9d003f0adc3eaa233b84"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0cc44f759b913295418d135c89"`);
        await queryRunner.query(`DROP TABLE "routes"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_672de41eee4b73747c1eb35198"`);
        await queryRunner.query(`DROP TABLE "stops"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
