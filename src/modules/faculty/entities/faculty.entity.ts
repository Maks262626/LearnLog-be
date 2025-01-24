import { ApiProperty } from "@nestjs/swagger";
import sequelize from "sequelize";
import { BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, HasMany, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { Group } from "src/modules/group/entities/group.entity";
import { University } from "src/modules/university/entities/university.entity";
import { User } from "src/modules/user/entities/user.entity";
import { v4 } from "uuid";

@Table({tableName: 'faculties'})
export class Faculty extends Model<Faculty>{
  @PrimaryKey
  @ApiProperty()
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  id: string;

  @ApiProperty()
  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  @ForeignKey(() => University)
  university_id: string;

  @BelongsTo(()=>University)
  university: University;

  @HasMany(()=>Group)
  groups: Group[];

  @HasMany(()=>User)
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

export const facultyProviders = [
  {
    provide: 'FACULTY_REPOSITORY',
    useValue: Faculty,
    sequelize,
    modelName: 'Faculty',
    hooks: {
      beforeCreate: (entity: Faculty) => {
        entity.id = v4();
      }
    }
  }
]