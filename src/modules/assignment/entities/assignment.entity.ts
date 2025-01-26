import { ApiProperty } from "@nestjs/swagger";
import sequelize from "sequelize";
import { BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { Subject } from "src/modules/subject/entities/subject.entity";
import { v4 } from "uuid";

@Table({ tableName: 'assignments' })
export class Assignment extends Model<Assignment>{
  @PrimaryKey
  @ApiProperty()
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  id: string;

  @ApiProperty()
  @Column(DataType.STRING)
  name: string;

  @ApiProperty()
  @Column(DataType.STRING)
  desciption: string;

  @ApiProperty()
  @Column(DataType.DATE)
  due_date: Date;

  @Column(DataType.STRING)
  @ForeignKey(() => Subject)
  subject_id: string;
 
  @BelongsTo(() => Subject)
  subject: Subject;

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

export const assignmentProviders = [
  {
    provide: 'ASSIGNMENT_REPOSITORY',
    useValue: Assignment,
    sequelize,
    modelName: 'Assignment',
    hooks: {
      BeforeCreate: (entity: Assignment) => {
        entity.id = v4();
      }
    }
  }
]