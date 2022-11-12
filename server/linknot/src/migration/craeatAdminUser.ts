import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { UserEntity } from "../database/entities/user.entities";

export class CreateAdminUser1547919837483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    let user = new UserEntity();
    user.firstName = "admin";
    user.email = "admin@admin.com"
    user.password = "admin";
    user.hashPassword();
    user.role = "ADMIN";
    const userRepository = getRepository(UserEntity);
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
