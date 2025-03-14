import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export default class TypeOrmConfig {
  static getOrmConfig(configServise: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      port: 5432,
      username: configServise.get('POSTGRES_USER'),
      password: configServise.get('POSTGRES_PASSWORD'),
      database: configServise.get('POSTGRES_DB'),
      host: configServise.get('POSTGRES_HOST'),
      entities: [join(__dirname, '../../**/**/**/*.entity{.ts,.js}')],
      namingStrategy: new SnakeNamingStrategy(),
      synchronize: false,
    };
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (
    configServise: ConfigService,
  ): Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configServise),
  inject: [ConfigService],
};