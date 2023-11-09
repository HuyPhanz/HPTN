import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { StoresModule } from './stores/stores.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    StoresModule,
    StoresModule,
    EventsModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
