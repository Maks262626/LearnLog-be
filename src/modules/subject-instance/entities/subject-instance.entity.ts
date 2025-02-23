import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import sequelize from "sequelize";
import { BelongsTo, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { SubjectSchedule } from "src/modules/subject-schedule/entities/subject-schedule.entity";
import { v4 } from "uuid";

export enum SubjectInstanceType {
  LECTURE = 'lecture',
  PRACTICE = 'practice'
}

export enum SubjectInstanceStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELED = 'canceled'
}

@Table({ tableName: 'subject_instances' })
export class SubjectInstance extends Model<SubjectInstance> {
  @PrimaryKey
  @ApiProperty()
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  id: string;

  @ApiProperty()
  @Column(DataType.STRING)
  name: string;

  @ApiProperty({ enum: () => SubjectInstanceType })
  @Column({
    type: DataType.ENUM('lecture', 'practice'),
    allowNull: false,
  })
  type: SubjectInstanceType;

  @ApiProperty({ enum: () => SubjectInstanceStatus })
  @Column({
    type: DataType.ENUM('pending', 'completed', 'canceled'),
    allowNull: false,
  })
  status: SubjectInstanceStatus;

  @ApiProperty()
  @Column(DataType.STRING)
  @Optional()
  location?: string;

  @ApiProperty()
  @Column(DataType.STRING)
  @Optional()
  url?: string;

  @Column(DataType.STRING)
  @ForeignKey(() => SubjectSchedule)
  schedule_id: string;

  @BelongsTo(() => SubjectSchedule)
  subject_schedule: SubjectSchedule;

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

export const subjectInstanceProviders = [
  {
    provide: 'SUBJECT_INSTANCE_REPOSITORY',
    useValue: SubjectInstance,
    sequelize,
    modelName: 'SubjectInstance',
    hooks: {
      BeforeCreate: (entity: SubjectInstance) => {
        entity.id = v4();
      }
    }
  }
];