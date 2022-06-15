// hapi
import Hapi from '@hapi/hapi';
// prisma
import { PrismaClient } from '@prisma/client';

// Module augmentation to add shared application state
declare module '@hapi/hapi' {
  interface ServerApplicationState {
    prisma: PrismaClient;
  }
}

// plugin to instantiate Prisma Client
const prismaPlugin: Hapi.Plugin<null> = {
  name: 'prisma',
  register: async function (server: Hapi.Server) {
    const prisma = new PrismaClient({
      // Uncomment 👇 for logs
      log: ['error', 'warn', 'query'],
    });

    server.app.prisma = prisma;

    // Close DB connection after the server's connection listeners are stopped
    server.ext({
      type: 'onPostStop',
      method: async (server: Hapi.Server) => {
        server.app.prisma.$disconnect();
      },
    });
  },
};

export default prismaPlugin;
