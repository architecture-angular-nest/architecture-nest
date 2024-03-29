import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: 'db',
  entities: ['dist/**/*.entity.js'],
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource.isInitialized ? dataSource : dataSource.initialize();
