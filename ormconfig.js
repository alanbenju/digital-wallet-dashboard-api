module.exports = {
  "type": "postgres",
  "host": process.env.DB_HOST,
  "port": process.env.DB_PORT,
  "username": process.env.DB_USERNAME,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_DATABASE,
  "autoLoadEntities": true,
  "synchronize": true,
  "entities": ["dist/**/*.entity{.ts,.js}"],
  "cli": {
    "entitiesDir": "src/entity"
  }
}
