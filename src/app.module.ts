import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { AuthzModule } from './core/authz/authz.module';
import { DatabaseModule } from './core/database/database.module';
import { UniversityModule } from './modules/university/university.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      load: [() => config],
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AuthzModule,
    UniversityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
