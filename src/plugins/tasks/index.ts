// handlers
import {
  getTask,
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from './handlers';
// hapi
import Hapi from '@hapi/hapi';
// types
import Joi from 'joi';
import { createTaskValidator, updateTaskValidator } from './types';

const tasksPlugin = {
  name: 'app/tasks',
  dependencies: ['prisma'],
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: 'GET',
        path: '/tasks/{taskId}',
        handler: getTask,
        options: {
          description: 'Get a task',
          notes: 'Get a task item by the id passed in the path',
          tags: ['api'], // swagger tag for api
          validate: {
            params: Joi.object({
              taskId: Joi.string().required(),
            }),
            failAction: (request, h, err) => {
              throw err;
            },
          },
        },
      },
      {
        method: 'GET',
        path: '/tasks',
        handler: getTasks,
        options: {
          description: 'Get all tasks',
          notes: 'Get all tasks',
          tags: ['api'], // swagger tag for api
        },
      },
      {
        method: 'POST',
        path: '/tasks',
        handler: createTask,
        options: {
          description: 'Create a task',
          notes: 'Create a task item ',
          tags: ['api'], // swagger tag for api
          validate: {
            payload: createTaskValidator,
            failAction: (request, h, err) => {
              throw err;
            },
          },
        },
      },
      {
        method: 'PUT',
        path: '/tasks/{taskId}',
        handler: updateTask,
        options: {
          description: 'Update a task',
          notes: 'Update a task item by the id passed in the path',
          tags: ['api'], // swagger tag for api
          validate: {
            params: Joi.object({
              taskId: Joi.string().required(),
            }),
            payload: updateTaskValidator,
            failAction: (request, h, err) => {
              throw err;
            },
          },
        },
      },
      {
        method: 'DELETE',
        path: '/tasks/{taskId}',
        handler: deleteTask,
        options: {
          description: 'Delete a task',
          notes: 'Delete a task and its subtask by the id passed in the path',
          tags: ['api'], // swagger tag for api
          validate: {
            params: Joi.object({
              taskId: Joi.string().required(),
            }),
            failAction: (request, h, err) => {
              throw err;
            },
          },
        },
      },
    ]);
  },
};

export default tasksPlugin;
