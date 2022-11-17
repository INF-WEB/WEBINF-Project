import { getRepository } from "typeorm"
import { NextFunction, Request, Response } from "express"
import { UserEntity } from "../database/entities/user.entities"
import { validate } from "class-validator";

class UserController{

    static listAll = async (req: Request, res: Response) => {
      //Get users from database
      const userRepository = getRepository(UserEntity);
      const users = await userRepository.find({
        select: ["id", "email", ] //We dont want to send the passwords on response
      });
    
      //Send the users object
      res.send(users);
    };
    
    static getOneById = async (req: Request, res: Response) => {
        //Get the ID from the url
        //Check can give problem!!
        const id: string = (req.params.id);
        
        //Get the user from database
        const userRepository = getRepository(UserEntity);
        try {
            const user = await userRepository.findOneOrFail({
                where: {id:id}, 
                select: ["id", "email", "jobStatus"]
            });
        } catch (error) {
            res.status(404).send("User not found");
        }
    };
    //TODO:
    //Need to be extended to working with all specs
    static newUser = async (req: Request, res: Response) => {
      //Get parameters from the body
      let { firstName, lastName, email, password, jobStatus } = req.body;
      console.log(req.body);
      
      let user = new UserEntity();
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.password = password;
      user.jobStatus = jobStatus;
    
      //Validate if the parameters are ok
      const errors = await validate(user);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }
    
      //Hash the password, to securely store on DB
      user.hashPassword();
    
      //Try to save. If fails, the username is already in use
      const userRepository = getRepository(UserEntity);
      try {
        await userRepository.save(user);
      } catch (e) {
        res.status(409).send("username already in use");
        return;
      }
    
      //If all ok, send 201 response
      res.status(201).send("User created");
    };
    
    static editUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
        
        //Get values from the body
        const { firstName, role } = req.body;
        
        //Try to find user on database
        const userRepository = getRepository(UserEntity);
        let user: UserEntity;
        try {
            user = await userRepository.findOneOrFail({
                        where: {id:id},     
                        });

        } catch (error) {
            //If not found, send a 404 response
            res.status(404).send("User not found");
            return;
        }
        
        //Validate the new values on model
        user.firstName = firstName;
        
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        
        //Try to safe, if fails, that means username already in use
        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send("username already in use");
            return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };
    
    static deleteUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;
    
    const userRepository = getRepository(UserEntity);
    let user: UserEntity;
    try {
        user = await userRepository.findOneOrFail({
                        where: {id:id},     
                        });
    } catch (error) {
        res.status(404).send("User not found");
        return;
    }
    userRepository.delete(id);
    
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
    };
};
    
export default UserController;
