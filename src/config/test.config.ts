export default () => ({
  port: 3001,
  database: {
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'your_password',
    database: 'escrow_db_test',
  },
  jwt: {
    secret: 'test_jwt_secret_key',
    expiresIn: '1h',
  },
  lightning: {
    nodeUrl: 'http://localhost:8080',
    macaroon: 'test_macaroon',
  },
}); 