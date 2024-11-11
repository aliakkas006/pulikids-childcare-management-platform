[![TypeScript Node](logo.svg?sanitize=true)](https://typestrong.org/ts-node)

# Pulikids Childcare Management Platfort

## About
Pulikids, a modern childcare management platform intended for nurseries, schools, and childcare providers across the UK. The platform aims to simplify childcare management by handling tasks from booking and activity tracking to compliance monitoring and parent communications.
 
## [Basic System Architecture (Notion Link)](https://ali-akkas.notion.site/Pulikids-Childcare-Management-System-130621b480b5809d9f26f122c5f8ca50?pvs=4)

## [API Documentation (Swagger)](https://app.swaggerhub.com/apis/aliakkas006/childcare_management_platform/1.0.0)

## Overview

- User Registration and Login (Users should be able to register with unique credentials like email and password).
- CRUD for Activities (Users with appropriate roles (Admin/Provider/Teacher) can create, update, delete, and view activities).
- Activity Attendance Tracking (Track attendance for each activity)
- Activity Reports (Generate detailed reports on attendance, activity participation, and milestones reached).
- Create and Manage Bookings (Booking data should include child details, service type, time, and payment status).
- Booking Confirmation (Email notifications to parents for successful booking confirmations).
- Redis caching optimizes performance by storing patient data and appointment schedules, reducing database load and latency.
- Rate limiting mechanisms manage system load and prevent overload, ensuring stability and responsiveness.
- A custom API gateway facilitates secure and efficient communication between services, providing features like authentication and request routing.

## Technologies Used

- [Node.js](https://nodejs.org/en/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Express.js](https://expressjs.com/) - Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- [Typescript](https://www.typescriptlang.org/) - TypeScript extends JavaScript by adding types to the language.
- [Zod](https://zod.dev/) - Zod is a TypeScript-first schema declaration and validation library.
- [MongoDB](https://www.mongodb.com/) - MongoDB is built on a scale-out architecture that has become popular with developers of all kinds for developing scalable applications with evolving data schemas. 
- [Mongoose](https://mongoosejs.com/) - Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node. js.
- [Redis](https://redis.io/) - Redis is a source-available, in-memory storage, used as a distributed, in-memory key–value database, cache and message broker, with optional durability.
- [Clerk](https://clerk.com/) - Clerk is an authentication and user management platform that provides tools to help developers build applications with authentication capabilities
- [Postman](https://www.postman.com/) - Postman is an application that allows the testing of web APIs.

## File Structure

```
Pulikids/
├── api-gateway/
            ├── src/
                  ├── config
                  ├── middlewares/
                            ├── cache.middleware.ts
                  ├── routes
                        ├── gateway.route.ts
                  ├── services/
                        ├── serviceRegistry.ts
                        ├── loadBalancer.ts
                        ├── cacheService.ts
                  ├── app.ts
                  ├── index.ts
            ├── package.json
            ├── tsconfig.json
└── services/
        ├── auth/
              ├── src/
                    ├── config
                    ├── middlewares
                    ├── types
                    ├── v1/
                         ├── controllers
                         ├── lib
                         ├── models
                         ├── routes
                    ├── app.ts
                    ├── index.ts
              ├── test
              ├── package.json
              ├── tsconfig.json

        ├── activity/
              ├── src/
                    ├── config
                    ├── middlewares
                    ├── types
                    ├── v1/
                         ├── controllers
                         ├── lib
                         ├── models
                         ├── routes
                    ├── app.ts
                    ├── index.ts
              ├── test
              ├── package.json
              ├── tsconfig.json

        ├── booking/
              ├── src/
                    ├── config
                    ├── middlewares
                    ├── types
                    ├── v1/
                         ├── controllers
                         ├── lib
                         ├── models
                         ├── routes
                    ├── app.ts
                    ├── index.ts
              ├── test
              ├── package.json
              ├── tsconfig.json
        
├── docker-compose.yaml
├── swagger.yaml
├── README.md
```

## Setup

follow .env.example file for setup environment variables

### Run APP Dependencies`

```bash
docker-compose up
```
### Run APP `

```bash
yarn dev
```

