import { ApiProperty } from "@nestjs/swagger";
import sequelize from "sequelize";
import { BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, HasMany, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { Faculty } from "src/modules/faculty/entities/faculty.entity";
import { Subject } from "src/modules/subject/entities/subject.entity";
import { User } from "src/modules/user/entities/user.entity";
import { v4 } from "uuid";

@Table({tableName: 'groups'})
export class Group extends Model<Group> {
  @PrimaryKey
  @ApiProperty()
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  id: string;

  @ApiProperty()
  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  @ForeignKey(() => Faculty)
  faculty_id: string;

  @BelongsTo(()=>Faculty)
  faculty: Faculty;

  @HasMany(()=>User)
  users: User[];

  @HasMany(()=>Subject)
  subject: Subject[];

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

export const groupProviders = [
  {
    provide: 'GROUP_REPOSITORY',
    useValue: Group,
    sequelize,
    modelName: 'Group',
    hooks: {
      BeforeCreate: (entity: Group) => {
        entity.id = v4();
      }
    }
  }
]