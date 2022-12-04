import "reflect-metadata"
import { DataSource } from "typeorm"
import { UserEntity } from "./database/entities/user.entities"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [UserEntity],
    migrations: [],
    subscribers: [],
})
