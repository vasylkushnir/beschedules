import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>('JWT_SECRET', ''),
        signOptions: { expiresIn: cfg.get<string>('JWT_EXPIRES_IN', '15m') },
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
