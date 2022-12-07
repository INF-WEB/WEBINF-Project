import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn
  } from "typeorm";
  import { Length, IsNotEmpty, length } from "class-validator";
  import * as bcrypt from "bcryptjs";
  import UserRecord from "../records/user.record";
//Store for userdata
//!!! extra carefull around passwoord
//maybe find place to hash before

@Entity("user")
export class UserEntity implements UserRecord {
    @PrimaryGeneratedColumn("uuid")
    id!: UserRecord["id"];
    
    @Column("text")
    @Length(2, 20)
    name!: UserRecord["name"];
    
    @Column("text",  {default: ""})
    lastName?: UserRecord["lastName"];

    @Column("text")
    @Length(2, 100)
    password!: UserRecord["password"];
    
    @Column("text", {unique: true})
    email!: UserRecord["email"];

    @Column("text")
    @Length(2, 20)
    type: UserRecord["type"];

    @Column("text", {default: ""})
    userURI: UserRecord["userURI"];
    
    @Column()
    @CreateDateColumn()
    createdAt: Date;
    
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
    
    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }
    
    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}
