## HabitHop - Description

This is the server for a responsive, full stack, habit tracker app. With Habit Hop users can set goals and connect them with habits they want to build or drop in order to achieve those goals. 

The app has a signup and a login page and users have to make an account in order to use it.

Users can add, edit and delete goals and habits. For each habit they will choose their preferred units of measurement. Stats showing progress in reducing or increasing the frequency of the tracked habits will be available. 

Users will be able to edit their user data and change a forgotten password. They will also be able toUsers will also see the time lapsed from the start of the goal until the chosen deadline.
 delete their account and all their information if they want. 

[The app's client side and demos can be checked here](https://github.com/alex-alina/habit-hop-client)

**Status: WIP**

Estimated deployment time: end of May.

## Tech stack
- Koa
- TS
- TypeORM
- PostgreSQL
- Jest
- Docker

## Implemented Features:

- Sign-up / Log-in endpoints
- Log out endpoint
- Goal entity and CRUD endpoints
- User entity and CRUD endpoints
- Validation

## Current work:
- Testing existing functionality
- Show / hide password functionality

## Future development and features

- Habit entity and CRUD endpoints
- Stats for each habit
- Forgotten password functionality
- Refreshing JWT
- Reload page on JWT expiration

## Setup

* You can access the client side repo [here](https://github.com/alex-alina/habit-hop-client).
* Fork / Clone the repository `https://github.com/alex-alina/server-habit-hop` 
* Requirements:
  * Postgres database and client application
  * Docker 
  * Postman
* Install the dependencies using `npm install`
* Create the images using `docker build`
* Start the server and DB using `docker compose up`
* You can now access endpoints with Postman on `localhost:3002`

## License

MIT Licence - Copyright &copy; 2023 - Alina Rusu.
