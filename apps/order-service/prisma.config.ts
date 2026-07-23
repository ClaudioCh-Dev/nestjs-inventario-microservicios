import { defineConfig } from 'prisma/config';
import 'dotenv/config'; // Carga las variables de tu archivo .env al process.env

export default defineConfig({
  schema: 'src/database/prisma/schema.prisma',
  migrations: {
    path: 'src/database/migrations',
  },
  datasource: {
    // Ahora process.env.DATABASE_URL sí tendrá el valor correcto
    url: process.env['DATABASE_URL'],
  },
});
