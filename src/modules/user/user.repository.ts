import { Inject, Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { where } from "sequelize";

@Injectable()
export class UserRepository{
  constructor(
    @Inject('USER_REPOSITORY') private usersRepository: typeof User,
  ){}

  async createUser(createUserDto: CreateUserDto):Promise<User>{
    return this.usersRepository.create({...createUserDto});
  }
  async findAllUsers():Promise<User[]>{
    const users = await this.usersRepository.findAll();
    return users;
  }
  async findUser(id:string):Promise<User>{
    const user = await this.usersRepository.findByPk(id);
    return user;
  }
  async updateUser(id:string,updateUserDto:UpdateUserDto):Promise<boolean>{
    const user = await this.usersRepository.update(updateUserDto,{
      where: {id}
    })
    return Boolean(user[0]);
  }
  async deleteUser(id:string):Promise<boolean>{
    const user = await this.usersRepository.destroy({
      where: {id}
    })
    return Boolean(user[0]);
  }
  async getUserMe(auth0_user_id: string) {
    const user = await this.usersRepository.findOne({
      where: {auth0_user_id:auth0_user_id}
    })
    return user;
  }
}