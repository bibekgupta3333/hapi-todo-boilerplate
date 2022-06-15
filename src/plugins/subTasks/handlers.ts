// types
import { subTaskInput } from './types';
// hapi
import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';

export async function getSubTask(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;
  const subTaskId = request.params.subTaskId;

  try {
    const subTask = await prisma.subTask.findUnique({
      where: {
        id: subTaskId,
      },
    });
    if (!subTask) {
      return h.response().code(404);
    }
    return h.response(subTask).code(200);
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to get subTask');
  }
}

export async function getSubTasks(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;

  try {
    const subTasks = await prisma.subTask.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return h.response(subTasks).code(200);
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to get subTasks');
  }
}

export async function createSubTask(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;
  const payload = request.payload as subTaskInput;

  try {
    // when creating a task make the authenticated user a teacher of the task
    const subTask = await prisma.subTask.create({
      data: {
        title: payload.title,
        status: payload.status,
        task: {
          connect: {
            id: payload.taskId,
          },
        },
      },
    });
    return h.response(subTask).code(201);
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to create subTask');
  }
}

export async function updateSubTask(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;
  const subTaskId = request.params.subTaskId;
  const payload = request.payload as Partial<subTaskInput>;

  try {
    const subTask = await prisma.subTask.update({
      where: {
        id: subTaskId,
      },
      data: payload,
    });
    return h.response(subTask).code(200);
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to update subTask');
  }
}

export async function deleteSubTask(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;
  const subTaskId = request.params.subTaskId;

  try {
    await prisma.subTask.delete({
      where: {
        id: subTaskId,
      },
    });

    return h.response().code(204);
  } catch (err) {
    request.log('error', err);
    return Boom.badImplementation('failed to delete task');
  }
}
