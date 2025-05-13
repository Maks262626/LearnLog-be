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
import { SubjectInstance } from 'src/modules/subject-instance/entities/subject-instance.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { v4 } from 'uuid';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
}

@Table({ tableName: 'attendances' })
export class Attendance extends Model<Attendance> {
  @PrimaryKey
  @ApiProperty()
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  id: string;

  @ApiProperty({ enum: () => AttendanceStatus })
  @Column({
    type: DataType.ENUM('present', 'absent', 'late'),
    allowNull: false,
  })
  status: AttendanceStatus;

  @Column(DataType.STRING)
  @ForeignKey(() => User)
  user_id: string;

  @Column(DataType.STRING)
  @ForeignKey(() => SubjectInstance)
  subject_instance_id: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => SubjectInstance)
  subjectInstance: SubjectInstance;

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

export const attendanceProviders = [
  {
    provide: 'ATTENDANCE_REPOSITORY',
    useValue: Attendance,
    sequelize,
    modelName: 'Attendance',
    hooks: {
      BeforeCreate: (entity: Attendance) => {
        entity.id = v4();
      },
    },
  },
];
