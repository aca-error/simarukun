/**
 * Jest Global Setup
 * Digunakan untuk setup database connection sebelum menjalankan tests
 */

const { TypeOrmModule } = require('@nestjs/typeorm');
const { Test } = require('@nestjs/testing');

module.exports = async () => {
  // Setup TypeORM connection for testing
  const moduleRef = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || 'test',
        password: process.env.DB_PASSWORD || 'test',
        database: process.env.DB_NAME || 'simarukun_test',
        entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
        synchronize: true,
        migrationsRun: true,
        logging: false,
      }),
    ],
  }).compile();

  // Store the module reference for cleanup
  global.__TEST_MODULE__ = moduleRef;

  console.log('Global setup completed: Database connection established');
};
