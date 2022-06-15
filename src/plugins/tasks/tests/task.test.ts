// server
import { createServer } from '../../../server';
// hapi
import Hapi from '@hapi/hapi';
// citest
import { describe, beforeAll, afterAll, expect, test } from 'vitest';
describe('tasks endpoints', () => {
  let server: Hapi.Server;

  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    await server.stop();
  });

  let taskId: string;

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

  test('get task returns 404 for non existant task', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/tasks/9999',
    });

    expect(response.statusCode).toEqual(404);
  });

  test('get task returns tasks', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/tasks/${taskId}`,
    });
    expect(response.statusCode).toEqual(200);
    const task = JSON.parse(response.payload);

    expect(task.id).toBe(taskId);
  });

  test('get tasks returns tasks with their tests', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/tasks`,
    });
    expect(response.statusCode).toEqual(200);
    const tasks = JSON.parse(response.payload);

    expect(Array.isArray(tasks)).toBeTruthy();
  });

  test('update task fails with invalid taskId parameter', async () => {
    const response = await server.inject({
      method: 'PUT',
      url: `/tasks/aa22`,
    });
    expect(response.statusCode).toEqual(400);
  });

  test('update task', async () => {
    const updatedTitle = 'title-UPDATED';

    const response = await server.inject({
      method: 'PUT',
      url: `/tasks/${taskId}`,

      payload: {
        title: updatedTitle,
      },
    });
    expect(response.statusCode).toEqual(200);
    const task = JSON.parse(response.payload);
    expect(task.title).toEqual(updatedTitle);
  });

  test('delete task fails with invalid taskId parameter', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/tasks/a1231243a22`,
    });
    expect(response.statusCode).toEqual(500);
  });

  test('delete task', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/tasks/${taskId}`,
    });
    expect(response.statusCode).toEqual(204);
  });
});
