# Introduction
- Todo list built using Hapi.js and Prisma ORM
- Postgres database is used and vitest for test

# To run TODO backend server in your computer
- clone it
- cd into main directory
- set node version greater 16.x
- install postgres db in your local machine
- after postgres running and adding DATABASE_URL to .env
- add environment=development to .env
- run command `yarn install` inside main directory in terminal
- run command `yarn migrate:dev` and `yarn migrate:deploy`
- run command `yarn dev` to start server `http://localhost:3000/tasks`
- run command `yarn prisma:studio` to view database in browser using prisma
  
# To run TODO backend server in your computer
- make sure you have run the app
- run command `yarn vitest` to test the app
- run command `yarn vitest:coverage` to test coverage of app

# TO run postgres using docker
- install first docker into your local machine
- And after installation, run command `docker-compose up -d`

# TO view swagger after server starts
- run command `http://localhost:3000/documentation?tags=api` to view swagger
