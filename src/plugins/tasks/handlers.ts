// types
import { TaskInput } from './types';
// hapi
import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';

export async function getTask(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app;
  const taskId = request.params.taskId;

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        subTasks: true,
      },
    });
    console.log(task);
    if (!task) {
      return h.response().code(404);
    }
    return h.response(task).code(200);
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to get task');
  }
}

export async function getTasks(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app;

  try {
    const tasks = await prisma.task.findMany({
      include: {
        subTasks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return h.response(tasks).code(200);
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to get tasks');
  }
}

export async function createTask(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;
  const payload = request.payload as TaskInput;

  try {
    const task = await prisma.task.create({
      data: {
        title: payload.title,
      },
    });
    return h.response(task).code(201);
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to create task');
  }
}

export async function updateTask(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;
  const taskId = request.params.taskId;
  const payload = request.payload as Partial<TaskInput>;

  try {
    const task = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: payload,
    });
    return h.response(task).code(200);
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to update task');
  }
}

export async function deleteTask(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;
  const taskId = request.params.taskId;

  try {
    const a = await prisma.$transaction([
      prisma.subTask.deleteMany({
        where: {
          task: {
            id: taskId,
          },
        },
      }),
      prisma.task.delete({
        where: {
          id: taskId,
        },
      }),
    ]);
    return h.response().code(204);
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to delete task');
  }
}
