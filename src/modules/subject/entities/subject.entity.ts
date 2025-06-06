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
import { Assignment } from 'src/modules/assignment/entities/assignment.entity';
import { FinalGrade } from 'src/modules/final-grade/entities/final-grade.entity';
import { Group } from 'src/modules/group/entities/group.entity';
import { SubjectInstance } from 'src/modules/subject-instance/entities/subject-instance.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { v4 } from 'uuid';

export enum SubjectType {
  EXAM = 'exam',
  CREDIT = 'credit',
}

@Table({ tableName: 'subjects' })
export class Subject extends Model<Subject> {
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

  @ApiProperty({ enum: () => SubjectType })
  @Column({
    type: DataType.ENUM('exam', 'credit'),
    allowNull: false,
  })
  type: SubjectType;

  @Column(DataType.STRING)
  @ForeignKey(() => Group)
  group_id: string;

  @Column(DataType.STRING)
  @ForeignKey(() => User)
  teacher_id: string;

  @BelongsTo(() => User)
  teacher: User;

  @BelongsTo(() => Group)
  group: Group;

  @HasMany(() => SubjectInstance)
  subjectInstances: SubjectInstance[];

  @HasMany(() => Assignment)
  assignments: Assignment[];

  @HasMany(() => FinalGrade)
  finalGrades: FinalGrade[];

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

export const subjectProviders = [
  {
    provide: 'SUBJECT_REPOSITORY',
    useValue: Subject,
    sequelize,
    modelName: 'Subject',
    hooks: {
      BeforeCreate: (entity: Subject) => {
        entity.id = v4();
      },
    },
  },
];
