import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MenuItemModule } from './menu-item/menu-item.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { NormativeModule } from './normative/normative.module';
import { MenuItemVariantModule } from './menu-item-variant/menu-item-variant.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 3306,
      username: process.env.DATABASE_USER || 'user',
      password: process.env.DATABASE_PASSWORD || 'userpassword',
      database: process.env.DATABASE_NAME || 'pizzacms',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // path to your entities
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    UserModule,
    MenuItemModule,
    IngredientModule,
    NormativeModule,
    MenuItemVariantModule,
  ],
})
export class AppModule {}
