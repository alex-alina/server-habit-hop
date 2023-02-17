import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { DefaultNamingStrategy } from 'typeorm/naming-strategy/DefaultNamingStrategy'
import { NamingStrategyInterface } from 'typeorm/naming-strategy/NamingStrategyInterface'
import { snakeCase } from 'typeorm/util/StringUtils'
import { join } from 'path';

class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {

  tableName(targetName: string, userSpecifiedName: string): string {
    return userSpecifiedName ? userSpecifiedName : snakeCase(targetName) + 's';
  }

  columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
    return snakeCase(embeddedPrefixes.concat(customName ? customName : propertyName).join("_"));
  }

  columnNameCustomized(customName: string): string {
    return customName;
  }

  relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }
}

const parentDir = join(__dirname, '..');

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || '0.0.0.0',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'habit-hop',
  entities: [
    `${parentDir}/**/entity.ts`,
  ],
  synchronize: true,
  logging: false,
  namingStrategy: new CustomNamingStrategy()
};

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;