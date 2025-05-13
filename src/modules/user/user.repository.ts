import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRoleName } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(@Inject('USER_REPOSITORY') private usersRepository: typeof User) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.create({ ...createUserDto });
  }
  async findAllUsers(): Promise<User[]> {
    const users = await this.usersRepository.findAll();
    return users;
  }
  async findUsersFromUniversity(id: string): Promise<User[]> {
    const users = await this.usersRepository.findAll({
      where: { university_id: id },
      order: [
        ['first_name', 'ASC'],
        ['last_name', 'ASC'],
      ],
    });
    return users;
  }
  async findUsersFromFaculty(id: string): Promise<User[]> {
    const users = await this.usersRepository.findAll({
      where: {
        [Op.and]: [
          { faculty_id: id },
          {
            [Op.or]: [{ role: { [Op.not]: UserRoleName.MANAGER } }, { role: { [Op.is]: null } }],
          },
        ],
      },
      order: [
        ['first_name', 'ASC'],
        ['last_name', 'ASC'],
      ],
    });
    return users;
  }
  async findUsersFromGroup(id: string): Promise<User[]> {
    const users = await this.usersRepository.findAll({
      where: { group_id: id },
      order: [
        ['first_name', 'ASC'],
        ['last_name', 'ASC'],
      ],
    });
    return users;
  }
  async findUser(id: string): Promise<User> {
    const user = await this.usersRepository.findByPk(id);
    return user;
  }
  async getTeachersByFacultyId(faculty_id: string): Promise<User[]> {
    const teachers = await this.usersRepository.findAll({
      where: { role: UserRoleName.TEACHER, faculty_id },
    });
    return teachers;
  }
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<boolean> {
    const user = await this.usersRepository.update(updateUserDto, {
      where: { id },
    });
    return Boolean(user[0]);
  }
  async updateUserRole(id: string, role: UserRoleName) {
    const user = await this.usersRepository.update({ role }, { where: { id } });
    return Boolean(user[0]);
  }
  async deleteUser(id: string): Promise<boolean> {
    const user = await this.usersRepository.destroy({
      where: { id },
    });
    return Boolean(user[0]);
  }
  async getUserMe(auth0_user_id: string) {
    const user = await this.usersRepository.findOne({
      where: { auth0_user_id: auth0_user_id },
    });
    return user;
  }
}
