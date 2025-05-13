import { ApiProperty } from '@nestjs/swagger';
import sequelize from 'sequelize';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Grade } from 'src/modules/grade/entities/grade.entity';
import { StudentSubmission } from 'src/modules/student-submission/entities/student-submission.entity';
import { Subject } from 'src/modules/subject/entities/subject.entity';
import { v4 } from 'uuid';

@Table({ tableName: 'assignments' })
export class Assignment extends Model<Assignment> {
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
  description: string;

  @ApiProperty()
  @Column(DataType.DATE)
  due_date: Date;

  @Column(DataType.STRING)
  @ForeignKey(() => Subject)
  subject_id: string;

  @BelongsTo(() => Subject)
  subject: Subject;

  @HasMany(() => StudentSubmission)
  studentSubmissions: StudentSubmission[];

  @HasMany(() => Grade)
  grades: Grade[];

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
      },
    },
  },
];
