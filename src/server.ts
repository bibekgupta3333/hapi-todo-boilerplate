// pino
import pino from 'pino';
import pretty from 'pino-pretty';
// env
import dotenv from 'dotenv';
// plugins
import tasksPlugin from './plugins/tasks';
import prismaPlugin from './plugins/prisma';
import subTasksPlugin from './plugins/subTasks';
// hapi
import Hapi from '@hapi/hapi';
import hapiPino from 'hapi-pino';
// swagger
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  routes: { cors: true },
});

const stream = pretty({
  colorize: true,
});
const logger = pino(stream);

const swaggerOptions: HapiSwagger.RegisterOptions = {
  info: {
    title: 'Todo task API Documentation',
    version: '1',
  },
};
const swaggerPlugin: Array<Hapi.ServerRegisterPluginObject<any>> = [
  {
    plugin: Inert,
  },
  {
    plugin: Vision,
  },
  {
    plugin: HapiSwagger,
    options: swaggerOptions,
  },
];
export async function createServer(): Promise<Hapi.Server> {
  // Register the logger
  await server.register({
    plugin: hapiPino,
    options: {
      logEvents:
        process.env.CI === 'true' || process.env.TEST === 'true'
          ? false
          : undefined,
      // prettyPrint: process.env.NODE_ENV !== "production",
      // Redact Authorization headers, see https://getpino.io/#/docs/redaction
      // redact: ['req.headers.authorization'],
      prettifier: isProduction ?? logger,
    },
  });
  // Register the swagger
  await server.register(swaggerPlugin);

  // register other plugin
  await server.register([prismaPlugin, tasksPlugin, subTasksPlugin]);

  // initialize the server
  await server.initialize();

  return server;
}

export async function startServer(server: Hapi.Server): Promise<Hapi.Server> {
  await server.start();
  server.log('info', `Server running on ${server.info.uri}`);
  return server;
}

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
