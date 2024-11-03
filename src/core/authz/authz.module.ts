import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthzService } from './authz.service';
import { DatabaseModule } from '../database/database.module';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    HttpModule,
    forwardRef(()=>UserModule) 
  ],
  providers: [JwtStrategy,AuthzService],
  exports: [PassportModule,AuthzService],
})
export class AuthzModule {}
