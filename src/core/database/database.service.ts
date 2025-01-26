import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { Assignment } from 'src/modules/assignment/entities/assignment.entity';
import { Faculty } from 'src/modules/faculty/entities/faculty.entity';
import { FinalGrade } from 'src/modules/final-grade/entities/final-grade.entity';
import { Group } from 'src/modules/group/entities/group.entity';
import { StudentSubmission } from 'src/modules/student-submission/entities/student-submission.entity';
import { Subject } from 'src/modules/subject/entities/subject.entity';
import { University } from 'src/modules/university/entities/university.entity';
import { User } from 'src/modules/user/entities/user.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: configService.get<string>('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get<string>('db.username'),
        password: configService.get<string>('db.password'),
        database: configService.get<string>('db.name'),
      });
      sequelize.addModels([User, University, Faculty, Group, Subject, FinalGrade, Assignment,StudentSubmission]);
      return sequelize;
    },
    inject: [ConfigService],
  },
];
