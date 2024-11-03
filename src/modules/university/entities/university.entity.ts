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
