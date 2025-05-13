import { ApiProperty } from '@nestjs/swagger';
import sequelize from 'sequelize';
import {
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Faculty } from 'src/modules/faculty/entities/faculty.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { v4 } from 'uuid';

@Table({ tableName: 'universities' })
export class University extends Model<University> {
  @PrimaryKey
  @ApiProperty()
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  id: string;

  @ApiProperty()
  @Column(DataType.STRING)
  name: string;

  @HasMany(() => Faculty)
  faculties: Faculty[];

  @HasMany(() => User)
  users: User[];

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

export const universityProviders = [
  {
    provide: 'UNIVERSITY_REPOSITORY',
    useValue: University,
    sequelize,
    modelName: 'University',
    hooks: {
      beforeCreate: (entity: University) => {
        entity.id = v4();
      },
    },
  },
];
