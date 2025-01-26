import { ApiProperty } from "@nestjs/swagger";
import sequelize from "sequelize";
import { BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { Assignment } from "src/modules/assignment/entities/assignment.entity";
import { User } from "src/modules/user/entities/user.entity";
import { v4 } from "uuid";

@Table({ tableName: 'grades' })
export class Grade extends Model<Grade>{
  @PrimaryKey
  @ApiProperty()
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  id: string;
  
  @ApiProperty()
  @Column(DataType.INTEGER)
  grade_value: number;

  @Column(DataType.STRING)
  @ForeignKey(() => Assignment)
  assignment_id: string;

  @Column(DataType.STRING)
  @ForeignKey(() => User)
  user_id: string;

  @BelongsTo(() => Assignment)
  assignment: Assignment;

  @BelongsTo(() => User)
  user: User;

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

export const gradeProviders = [
  {
    provide: 'GRADE_REPOSITORY',
    useValue: Grade,
    sequelize,
    modelName: 'Grade',
    hooks: {
      BeforeCreate: (entity: Grade) => {
        entity.id = v4();
      }
    }
  }
]