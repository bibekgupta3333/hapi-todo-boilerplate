// types
import Joi from 'joi';
// prisma
import { StatusType } from '@prisma/client';

// types
export interface subTaskInput {
  title: string;
  status?: StatusType;
  taskId: string;
}

// validators
const SubTaskInputValidator = Joi.object({
  title: Joi.string().alter({
    create: (schema) => schema.required(),
    update: (schema) => schema.optional(),
  }),
  status: Joi.string().alter({
    create: (schema) => schema.optional(),
    update: (schema) => schema.optional(),
  }),
  taskId: Joi.string().alter({
    create: (schema) => schema.required(),
    update: (schema) => schema.optional(),
  }),
});

export const createSubTaskValidator = SubTaskInputValidator.tailor('create');
export const updateSubTaskValidator = SubTaskInputValidator.tailor('update');
