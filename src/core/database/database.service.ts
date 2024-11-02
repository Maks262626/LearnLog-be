import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { Cat } from 'src/modules/cat/entities/cat.entity';
import { User } from 'src/modules/user/entities/user.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async (configService: ConfigService) => {
      console.log(configService);
      console.log(process.env.DB_HOST);
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: configService.get<string>('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get<string>('db.username'),
        password: configService.get<string>('db.password'),
        database: configService.get<string>('db.name'),
      });
      sequelize.addModels([Cat,User]);
      return sequelize;
    },
    inject: [ConfigService],
  },
];
