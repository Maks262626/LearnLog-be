import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import sequelize from "sequelize";
import { BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, HasMany, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { SubjectInstance } from "src/modules/subject-instance/entities/subject-instance.entity";
import { Subject } from "src/modules/subject/entities/subject.entity";
import { v4 } from "uuid";

@Table({ tableName: 'subject_schedules' })
export class SubjectSchedule extends Model<SubjectSchedule>{
  @PrimaryKey
  @ApiProperty()
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  id: string;

  @ApiProperty()
  @Column(DataType.DATE)
  start_date: Date;

  @ApiProperty()
  @Column(DataType.TIME)
  start_time: string;

  @ApiProperty()
  @Column(DataType.DATE)
  @Optional()
  end_date?: Date;

  @ApiProperty()
  @Column(DataType.TIME)
  @Optional()
  end_time?: string;

  @ApiProperty()
  @Column(DataType.STRING)
  @Optional()
  day_of_week_mask?: string;

  @ApiProperty()
  @Column(DataType.INTEGER)
  @Optional()
  instanse_count?: number;

  @ApiProperty()
  @Column(DataType.INTEGER)
  @Optional()
  default_url?: string;

  @Column(DataType.STRING)
  @ForeignKey(() => Subject)
  subject_id: string;

  @BelongsTo(() => Subject)
  subject: Subject;

  @HasMany(()=> SubjectInstance)
  subjectInstances: SubjectInstance[];

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

export const subjectScheduleProviders = [
  {
    provide: 'SUBJECT_SCHEDULE_REPOSITORY',
    useValue: SubjectSchedule,
    sequelize,
    modelName: 'SubjectSchedule',
    hooks: {
      BeforeCreate: (entity: SubjectSchedule) => {
        entity.id = v4();
      }
    }
  }
]