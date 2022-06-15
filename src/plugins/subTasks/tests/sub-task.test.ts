// server
import { createServer } from '../../../server';

// hapi
import Hapi from '@hapi/hapi';

// vitest
import { describe, beforeAll, afterAll, expect, test } from 'vitest';

// tests
describe('subTasks endpoints', () => {
  let server: Hapi.Server;

  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    await server.stop();
  });

  let taskId: string;

  let subTaskId: string;

  test('create task', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/tasks',
      payload: {
        title: 'fresh title',
        status: 'COMPLETED',
      },
    });

    expect(response.statusCode).equals(201);

    taskId = JSON.parse(response.payload)?.id;

    expect(typeof taskId === 'string').toBeTruthy();
  });

  test('create SubTask', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/sub-tasks',
      payload: {
        title: 'fresh title',
        status: 'COMPLETED',
        taskId: taskId,
      },
    });

    expect(response.statusCode).toEqual(201);

    subTaskId = JSON.parse(response.payload)?.id;

    expect(typeof subTaskId === 'string').toBeTruthy();
  });

  test('get subTask returns 404 for non existant task', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/sub-tasks/9999',
    });

    expect(response.statusCode).toEqual(404);
  });

  test('get subTask returns subtasks', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/sub-tasks/${subTaskId}`,
    });
    expect(response.statusCode).toEqual(200);
    const subTask = JSON.parse(response.payload);

    expect(subTask.id).toBe(subTaskId);
  });

  test('get subTasks returns tasks with their tests', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/sub-tasks`,
    });
    expect(response.statusCode).toEqual(200);
    const subTasks = JSON.parse(response.payload);

    expect(Array.isArray(subTasks)).toBeTruthy();
  });

  test('update subTask fails with invalid subTaskId parameter', async () => {
    const response = await server.inject({
      method: 'PUT',
      url: `/sub-tasks/aa22`,
    });
    expect(response.statusCode).toEqual(400);
  });

  test('update subTask', async () => {
    const updatedTitle = 'title-UPDATED';

    const response = await server.inject({
      method: 'PUT',
      url: `/sub-tasks/${subTaskId}`,

      payload: {
        title: updatedTitle,
      },
    });
    expect(response.statusCode).toEqual(200);
    const task = JSON.parse(response.payload);
    expect(task.title).toEqual(updatedTitle);
  });

  test('delete subTask fails with invalid subTaskId parameter', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/sub-tasks/a1231243a22`,
    });
    expect(response.statusCode).toEqual(500);
  });

  test('delete subTask', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/sub-tasks/${subTaskId}`,
    });
    expect(response.statusCode).toEqual(204);
  });

  test('delete task', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/tasks/${taskId}`,
    });
    expect(response.statusCode).toEqual(204);
  });
});
