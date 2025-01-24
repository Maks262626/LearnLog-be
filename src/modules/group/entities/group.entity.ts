import { ApiProperty } from "@nestjs/swagger";
import sequelize from "sequelize";
import { BeforeCreate, BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { Faculty } from "src/modules/faculty/entities/faculty.entity";
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