import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guards';
import { RolesGuard } from './roles/roles.guard';
import { SchedulesModule } from './schedules/schedules.module';
import { StopsModule } from './stops/stops.module';
import { RoutesModule } from './routes/routes.module';
import { Schedule } from './schedules/schedule.entity';
import { Stop } from './stops/stop.entity';
import { Route } from './routes/routes.entity';
import { FavoriteSchedulesModule } from './favorite-schedules/favorite-schedules.module';
import { FavoriteSchedule } from './favorite-schedules/favorite-schedules.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        entities: [User, Schedule, Stop, Route, FavoriteSchedule],
        synchronize: false,
        migrations: ['dist/migrations/*.js'],
        ssl: process.env.DB_SSL === 'true',
      }),
    }),
    TypeOrmModule.forFeature([User, Schedule, Stop, Route, FavoriteSchedule]),
    AuthModule,
    UsersModule,
    SchedulesModule,
    StopsModule,
    RoutesModule,
    FavoriteSchedulesModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
