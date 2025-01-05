import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EscrowModule } from './modules/escrow/escrow.module';
import { AuthModule } from './modules/auth/auth.module';
import { LightningModule } from './modules/lightning/lightning.module';
import { ConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';
import { ResponseWrapperInterceptor } from './common/interceptors/response-wrapper.interceptor';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: AppConfigService) => configService.databaseConfig,
      inject: [AppConfigService],
    }),
    AuthModule,
    EscrowModule,
    LightningModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseWrapperInterceptor,
    },
  ],
})
export class AppModule {} 