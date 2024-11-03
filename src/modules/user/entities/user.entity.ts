import { ApiProperty } from '@nestjs/swagger';
import sequelize from 'sequelize';
import {
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { v4 } from 'uuid';

export enum UserRoleName {
  STUDENT = 'student',
  TEACHER = 'teacher',
  MANAGER = 'manager',
  SUPERADMIN = 'superadmin',
}

export enum UserRoleIds {
  STUDENT = 'rol_YP1iBik9zDDklK5p',
  TEACHER = 'rol_a7eacseLbIHOzo0A',
  MANAGER = 'rol_xxW6H2OOXd6FbwFp',
  SUPERADMIN = 'rol_H6mRELAwRiBZ5ZlZ',
}

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column(DataType.STRING)
  auth0_user_id: string;

  @ApiProperty()
  @Column(DataType.STRING)
  first_name: string;

  @ApiProperty()
  @Column(DataType.STRING)
  last_name: string;

  @ApiProperty()
  @Column(DataType.BOOLEAN)
  is_registration_completed: boolean;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  university_id: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  faculty_id: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  group_id: string;

  @ApiProperty()
  @CreatedAt
  declare created_at: Date;

  @ApiProperty()
  @UpdatedAt
  declare updated_at: Date;

  @ApiProperty()
  @DeletedAt
  declare deleted_at?: Date;
}

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useValue: User,
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (entity: User) => {
        entity.id = v4();
      },
    },
  },
];
