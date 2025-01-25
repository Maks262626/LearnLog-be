import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import sequelize from "sequelize";
import { BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { Subject } from "src/modules/subject/entities/subject.entity";
import { User } from "src/modules/user/entities/user.entity";
import { v4 } from "uuid";

@Table({ tableName: 'final_grades' })
export class FinalGrade extends Model<FinalGrade>{
  @PrimaryKey
  @ApiProperty()
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  id: string;

  @ApiProperty()
  @Column(DataType.INTEGER)
  final_grade: number;

  @ApiProperty({required:false})
  @Optional()
  @Column(DataType.INTEGER)
  exam_grade?: number;

  @Column(DataType.STRING)
  @ForeignKey(() => Subject)
  subject_id: string;

  @Column(DataType.STRING)
  @ForeignKey(() => User)
  user_id: string;

  @BelongsTo(() => Subject)
  subject: Subject;

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

export const finalGradeProviders = [
  {
    provide: 'FINAL_GRADE_REPOSITORY',
    useValue: FinalGrade,
    sequelize,
    modelName: 'FinalGrade',
    hooks: {
      BeforeCreate: (entity: FinalGrade) => {
        entity.id = v4();
      }
    }
  }
]