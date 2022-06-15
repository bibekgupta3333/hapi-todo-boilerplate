// handlers
import {
  getSubTask,
  getSubTasks,
  createSubTask,
  deleteSubTask,
  updateSubTask,
} from './handlers';
// hapi
import Hapi from '@hapi/hapi';
// types
import Joi from 'joi';
import { createSubTaskValidator, updateSubTaskValidator } from './types';

const subTasksPlugin = {
  name: 'app/sub-tasks',
  dependencies: ['prisma'],
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: 'GET',
        path: '/sub-tasks/{subTaskId}',
        handler: getSubTask,
        options: {
          description: 'Get a sub-task',
          notes: 'Get a sub-task by the id passed in the path',
          tags: ['api'], // swagger tag for api
          validate: {
            params: Joi.object({
              subTaskId: Joi.string().required(),
            }),
            failAction: (request, h, err) => {
              throw err;
            },
          },
        },
      },
      {
        method: 'GET',
        path: '/sub-tasks',
        handler: getSubTasks,
        options: {
          description: 'Get all sub-tasks',
          notes: 'Get all sub-tasks',
          tags: ['api'], // swagger tag for api
        },
      },
      {
        method: 'POST',
        path: '/sub-tasks',
        handler: createSubTask,
        options: {
          description: 'Create a sub-task',
          notes: 'Create a sub-task item ',
          tags: ['api'], // swagger tag for api
          validate: {
            payload: createSubTaskValidator,
            failAction: (request, h, err) => {
              throw err;
            },
          },
        },
      },
      {
        method: 'PUT',
        path: '/sub-tasks/{subTaskId}',
        handler: updateSubTask,
        options: {
          description: 'Update a sub-task',
          notes: 'Update a sub-task item by the id passed in the path',
          tags: ['api'], // swagger tag for api
          validate: {
            params: Joi.object({
              subTaskId: Joi.string().required(),
            }),
            payload: updateSubTaskValidator,
            failAction: (request, h, err) => {
              throw err;
            },
          },
        },
      },
      {
        method: 'DELETE',
        path: '/sub-tasks/{subTaskId}',
        handler: deleteSubTask,
        options: {
          description: 'Delete a sub-task',
          notes: 'Delete a sub-task item by the id passed in the path',
          tags: ['api'], // swagger tag for api
          validate: {
            params: Joi.object({
              subTaskId: Joi.string().required(),
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

export default subTasksPlugin;
