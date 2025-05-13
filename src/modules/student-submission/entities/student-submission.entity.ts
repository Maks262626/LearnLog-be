import { Optional } from '@nestjs/common';
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
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Assignment } from 'src/modules/assignment/entities/assignment.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { v4 } from 'uuid';

export enum StudentSubmissionStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  GRADED = 'graded',
  RESUBMISSION_REQUESTED = 'resubmission_requested',
  LATE_SUBMISSION = 'late_submission',
}

@Table({ tableName: 'student_submissions' })
export class StudentSubmission extends Model<StudentSubmission> {
  @PrimaryKey
  @ApiProperty()
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  id: string;

  @ApiProperty()
  @Column(DataType.STRING)
  file_url: string;

  @ApiProperty()
  @Column(DataType.DATE)
  submission_date: Date;

  @ApiProperty()
  @Column(DataType.STRING)
  @Optional()
  student_comments?: string;

  @ApiProperty({ enum: () => StudentSubmissionStatus })
  @Column({
    type: DataType.ENUM(
      'pending',
      'reviewed',
      'graded',
      'resubmission_requested',
      'late_submission',
    ),
    allowNull: false,
  })
  status: StudentSubmissionStatus;

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

export const studentSubmissionProviders = [
  {
    provide: 'STUDENT_SUBMISSION_REPOSITORY',
    useValue: StudentSubmission,
    sequelize,
    modelName: 'StudentSubmission',
    hooks: {
      BeforeCreate: (entity: StudentSubmission) => {
        entity.id = v4();
      },
    },
  },
];
