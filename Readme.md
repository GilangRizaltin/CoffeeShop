![Logo](https://res.cloudinary.com/doncmmfaa/image/upload/v1705476586/samples/Frame_13_ksk8wi.png)

# Coffee Shop Backend Project with Express JS

Welcome to the Coffee Shop Project – a web development endeavor that transcends the ordinary to craft a vibrant and dynamic website tailored exclusively for cafes. In this caffeinated journey, we harness the power of APIs for a symphony of operations, seamlessly orchestrating the dance of GET (fetching data), POST (sending data), PATCH (partially modifying data), and DELETE (bidding farewell to data). Picture this project as a canvas brought to life with the strokes of Javascript, where Node.js takes center stage as the maestro executing the symphony. Express.js steps in as the trusty assistant, deftly managing servers and routes, while PostgreSQL stands as the repository for our data treasures. And for the grand finale, enter Postman, the virtuoso crafting APIs with finesse. Join us on this journey where code meets coffee, and every API call is a sip of innovation in the ever-evolving world of web development!

## Features

- Express JS \
  Express JS is a minimalist and flexible Node.js web application framework. It simplifies the process of building robust and scalable web applications by providing a set of essential features and middleware for handling HTTP requests, routes, and views.

- JSON Web Token \
  JSON Web Token (JWT) is a compact, URL-safe means of representing claims between two parties. In web development, JWTs are commonly used for secure transmission of information between a server and a client. They are often employed for authentication and authorization purposes, enhancing the security of web applications.

- Cloudinary \
  Cloudinary is a cloud-based service for managing and optimizing media assets such as images and videos in web development. It simplifies tasks like image uploading, transformation, and delivery, offering a seamless solution for handling multimedia content in applications.

- Cors \
  CORS is a security feature implemented in web browsers that controls how web pages in one domain can request and interact with resources from another domain. In web development, CORS is crucial for managing and securing cross-origin HTTP requests, ensuring proper communication between different domains.

- PG \
  Node-Postgres, commonly abbreviated as pg, is a Node.js driver for PostgreSQL databases. This npm package facilitates seamless communication between a Node.js application and a PostgreSQL database, allowing developers to perform database operations with ease. By leveraging pg, developers can connect to PostgreSQL databases, execute queries, and handle data efficiently within their Node.js applications. This package is a vital bridge, empowering developers to harness the capabilities of PostgreSQL seamlessly in the Node.js environment.

## Installation

Install my-project with npm

```bash
  npm Install
```

## API Reference

#### Authentication & Authorization

```http
  /auth
```

| Method | Endpoint      | Description                        |
| :----- | :------------ | :--------------------------------- |
| `post` | `"/register"` | register user                      |
| `post` | `"/login"`    | get access and identity of user    |
| `post` | `"/logout"`   | delete access and identity of user |

#### Users

```http
  /user
```

| Method   | Endpoint | Description                     |
| :------- | :------- | :------------------------------ |
| `get`    | `"/"`    | Get all users (admin only)      |
| `post`   | `"/"`    | Add user (admin only)           |
| `patch`  | `"/"`    | Update users detail and profile |
| `delete` | `"/:id"` | Deleting user                   |

#### Products

```http
  /product
```

| Method   | Endpoint         | Description                                         |
| :------- | :--------------- | :-------------------------------------------------- |
| `get`    | `"/"`            | Get all product                                     |
| `get`    | `"/productstat"` | Get statistic for selled product (admin only)       |
| `get`    | `"/popular"`     | Get all popular and favourite product               |
| `get`    | `"/:id"`         | Get all product detail **Required** order_id        |
| `post`   | `"/"`            | Add a product (admin only)                          |
| `patch`  | `"/:id"`         | Edit a product **Required** order_id (admin only)   |
| `delete` | `"/:id"`         | Deleting product **Required** order_id (admin only) |

#### Promos

```http
  /promo
```

| Method   | Endpoint | Description      |
| :------- | :------- | :--------------- |
| `get`    | `"/"`    | Get all promos   |
| `post`   | `"/"`    | Post some promos |
| `patch`  | `"/:id"` | Edit some promo  |
| `delete` | `"/:id"` | Deleting promo   |

#### Orders

```http
  /order
```

| Method   | Endpoint | Description                  |
| :------- | :------- | :--------------------------- |
| `get`    | `"/"`    | Get all orders               |
| `post`   | `"/"`    | Create transaction           |
| `patch`  | `"/:id"` | Updating orders statuses     |
| `delete` | `"/:id"` | Deleting order (soft delete) |

## Documentation

[Postman Documentation](https://documenter.getpostman.com/view/29696636/2s9YC8vAtB)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DB_HOST`,
`DB_NAME`,
`DB_USER`,
`DB_PASSWORD`,
`JWT_KEY`,
`ISSUER`,
`CLOUDINARY_NAME`,
`CLOUDINARY_KEY`,
`CLOUDINARY_SECRET`,
`MAIL_SERVICES`,
`MAIL_AUTH_TYPE`,
`MAIL_USER`,
`MIDTRANS_ID_MERCHANT`,
`MIDTRANS_CLIENT_KEY`,
`MIDTRANS_SERVER_KEY`

## Run Locally

Clone the project

```bash
  git clone https://github.com/GilangRizaltin/CoffeeShop
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

## Front End Project

https://github.com/GilangRizaltin/Coffee-Shop-React

## Back End Project with Golang

https://github.com/GilangRizaltin/backend-golang

## Support

For support, email gilangzaltin@gmail.com or join our Slack channel.

## Authors

Authors By Me _as known as_ Gilang Muhamad Rizaltin \
**Github link**

- [@Gilang Muhamad Rizaltin](https://github.com/GilangRizaltin)
