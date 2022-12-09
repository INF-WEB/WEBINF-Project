import { getRepository } from "typeorm"
import { NextFunction, Request, Response } from "express"
import { UserEntity } from "../database/entities/user.entities"
import { validate } from "class-validator";
import { createJWT } from "../middlewares/checkJwt";
import { database } from "../RDFAcces/RDFDataAcess";
import { rdfDatabase } from "..";

class UserController{

    static listAll = async (req: Request, res: Response) => {
      //Get users from database
      const userRepository = getRepository(UserEntity);
      const users = await userRepository.find({
        select: ["id", "email", "lastName", "name", "type" ] //We dont want to send the passwords on response
      });
    
      //Send the users object
      res.send(users);
    };
    
    static getAccountDetails = async (req: Request, res: Response) => {
        //Get the ID from the url
        //Check can give problem!!
        const id = res.locals.jwtPayload.id;
        
        //Get the user from database
        const userRepository = getRepository(UserEntity);
        try {
            const user = await userRepository.findOneOrFail({
                where: {id:id}, 
                select: ["email","name", "lastName" , "type", "userURI"]
            });
            let result: object;
            if(user.type === "Person"){
                result = await rdfDatabase.selectUser(user.userURI);
            }else{
                result = await rdfDatabase.selectCompany(user.userURI);
            }
           
			res.status(200).send({user, result});

        } catch (error) {
            res.status(404).send("User not found");
        }

    };


    //For asking details from body userid
    static getDetails =async (req:Request, res: Response) => {
        let {userId} = req.body;
        const userRepository = getRepository(UserEntity);
        try {
            const user = await userRepository.findOneOrFail({
                where: {id:userId}, 
                select: ["email","name", "lastName" , "type", "userURI"]
            });
            let result: object;
            if(user.type === "Person"){
                result = await rdfDatabase.selectUser(user.userURI);
            }else{
                result = await rdfDatabase.selectCompany(user.userURI);
            }
           
			res.status(200).send({user, result});

        } catch (error) {
            res.status(404).send("User not found");
        }

    }

    //Need to be extended to working with all specs
    static newUser = async (req: Request, res: Response) => {
      	//Get parameters from the body
        let { name, lastName, email, area, webpage, password, search, type } = req.body;
        console.log(req.body);
        
        let user = new UserEntity();
        user.name = name;
        if(lastName){
          user.lastName = lastName;

        }else{
            lastName = "";
        }
        user.email = email;
        user.password = password;
        user.type = type;
        if(!webpage){
            webpage = "";
        }
        if(!area){
            area = "";
        }

        //Validate if the parameters are ok
        const errors = await validate(user);
        if (errors.length > 0) {
          res.status(400).send(errors);
          return;
        }

        // Saves user for first time and creates primary key
        const userRepository = getRepository(UserEntity);
        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send("User already a life 1");
            return;
        }
        //Hash the password, to securely store on DB
        user.hashPassword();
     
        if(type === "Person"){
            let userURI= await rdfDatabase.createUser(name, lastName, email, area, webpage, Boolean(search), user.id);
            user.userURI = userURI;
        }else{
            let userURI = await rdfDatabase.createCompany(email, name, webpage, area, user.id);
            user.userURI = userURI;
        }

        //Update user and add userURI 
        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).send("User already a life 2");
            return;
        }

		//Also log the user in
        const token = createJWT({email: user.email, id: user.id}, "1h");
		req.session = {jwt: token};

        //If all ok, send 201 response
        res.status(201).send("User created");
    };
    
	//Can change values of search, name, lastname 
    static editUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = res.locals.jwtPayload.id;
        
        //Get values from the body
        const { name, lastName, search, webpage, area } = req.body;
        
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
		user = UserController.changeUserValue(user, name, lastName);
        
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
        if(user.type === "Person"){
            await rdfDatabase.updateUser(user.userURI, {firstname: name, lastname: lastName, webpage: webpage, lookingForJob: Boolean(search)});
        }else{
            await rdfDatabase.updateCompany(user.userURI, {name: name, webpage: webpage, headquaters: area});
        }
        //After all send a 204 (no content, but accepted) response
        res.status(200).send("Values have changed");
    };
    
    static deleteUser = async (req: Request, res: Response) => {
    //Get the ID from the sesssion jwt token
    const id = res.locals.jwtPayload.id;
	
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
    const uri = user.userURI;
    const type = user.type;
    await userRepository.delete(id);
    if(type === "Person"){
        await rdfDatabase.deleteUser(uri);
    }else{
        await rdfDatabase.deleteCompany(uri);
    }

	//Also log the user out 
	req.session = null;
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
    };




	static changeUserValue(user:UserEntity, name:any, lastName:any) {
		 //Validate the new values on model
		 if(name){
			user.name = name;
		}
		if(lastName){
			user.lastName = lastName;
		}
		
		return user;
	}

    static testDatabase() {
        rdfDatabase.tests();
    }

    

};
    
export default UserController;
