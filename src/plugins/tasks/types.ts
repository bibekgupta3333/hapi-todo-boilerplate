// types
import Joi from 'joi';
// primsa
import { StatusType } from '@prisma/client';

// types
export interface TaskInput {
  title: string;
  status?: StatusType;
  subTasks?: [string];
}

// validators

const TaskInputValidator = Joi.object({
  title: Joi.string().alter({
    create: (schema) => schema.required(),
    update: (schema) => schema.optional(),
  }),
  status: Joi.string().alter({
    create: (schema) => schema.optional(),
    update: (schema) => schema.optional(),
  }),
  subTasks: Joi.array().items(
    Joi.string().alter({
      create: (schema) => schema.optional(),
      update: (schema) => schema.optional(),
    }),
  ),
});

export const createTaskValidator = TaskInputValidator.tailor('create');
export const updateTaskValidator = TaskInputValidator.tailor('update');
