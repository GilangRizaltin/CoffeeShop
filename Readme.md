# Coffee Shop Backend Project with Express JS

<div align="center">
  <img src="https://res.cloudinary.com/doncmmfaa/image/upload/v1705476586/samples/Frame_13_ksk8wi.png" alt="Logo" />
</div>

Welcome to the Coffee Shop Project – a web development endeavor that transcends the ordinary to craft a vibrant and dynamic website tailored exclusively for cafes. In this caffeinated journey, we harness the power of APIs for a symphony of operations, seamlessly orchestrating the dance of GET (fetching data), POST (sending data), PATCH (partially modifying data), and DELETE (bidding farewell to data). Picture this project as a canvas brought to life with the strokes of Javascript, where Node.js takes center stage as the maestro executing the symphony. Express.js steps in as the trusty assistant, deftly managing servers and routes, while PostgreSQL stands as the repository for our data treasures. And for the grand finale, enter Postman, the virtuoso crafting APIs with finesse. Join us on this journey where code meets coffee, and every API call is a sip of innovation in the ever-evolving world of web development!

## Technologies used in this project

- Express JS \
  Express JS is a minimalist and flexible Node.js web application framework. \
  [Express JS Documentation](https://pkg.go.dev/github.com/gin-gonic/gin#section-readme)

- JSON Web Token \
  JSON Web Token (JWT) is a compact, URL-safe means of representing claims between two parties. \
  [JSON Web Token Documentation](https://jwt.io/introduction)

- Cloudinary \
  Cloudinary is a cloud-based service for managing and optimizing media assets such as images and videos in web development. It simplifies tasks like image uploading, transformation, and delivery, offering a seamless solution for handling multimedia content in applications. \
  [Cloudinary Documentation](https://cloudinary.com/documentation)

- Cors \
  CORS is a security feature implemented in web browsers that controls how web pages in one domain can request and interact with resources from another domain. In web development, CORS is crucial for managing and securing cross-origin HTTP requests, ensuring proper communication between different domains. \
  [Cors Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

- PG \
  Node-Postgres, commonly abbreviated as pg, is a Node.js driver for PostgreSQL databases. \
  [PG Documentation](https://github.com/brianc/node-postgres)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```bash
  DB_HOST = YOUR DB_HOST
  DB_NAME = YOUR DB_NAME
  DB_USER = YOUR DB_USER
  DB_PASSWORD = YOUR DB_PASSWORD
  JWT_KEY = YOUR JWT_KEY
  ISSUER = YOUR ISSUER
  CLOUDINARY_NAME = YOUR CLOUDINARY_NAME
  CLOUDINARY_KEY = YOUR CLOUDINARY_KEY
  CLOUDINARY_SECRET = YOUR CLOUDINARY_SECRET
  MAIL_SERVICES = YOUR MAIL_SERVICES
  MAIL_AUTH_TYPE = YOUR MAIL_AUTH_TYPE
  MAIL_USER = YOUR MAIL_USER
  MIDTRANS_ID_MERCHANT = YOUR MIDTRANS_ID_MERCHANT
  MIDTRANS_CLIENT_KEY = YOUR MIDTRANS_CLIENT_KEY
  MIDTRANS_SERVER_KEY = YOUR MIDTRANS_SERVER_KEY
```

## Run Locally

Clone the project

```bash
  $ git clone https://github.com/GilangRizaltin/CoffeeShop
```

Go to the project directory

```bash
  $ cd CoffeeShop
```

Install dependencies

```bash
  $ npm install
```

Start the server

```bash
  $ npm run dev
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

| Method | Endpoint | Description                |
| :----- | :------- | :------------------------- |
| `get`  | `"/"`    | Get all users (admin only) |
| `post` | `"/"`    | Add user (admin only)      |

#### Products

```http
  /product
```

| Method | Endpoint     | Description                                  |
| :----- | :----------- | :------------------------------------------- |
| `get`  | `"/"`        | Get all product                              |
| `get`  | `"/popular"` | Get all popular and favourite product        |
| `get`  | `"/:id"`     | Get all product detail **Required** order_id |

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

| Method | Endpoint | Description        |
| :----- | :------- | :----------------- |
| `get`  | `"/"`    | Get all orders     |
| `post` | `"/"`    | Create transaction |

## Documentation

[Postman Documentation](https://documenter.getpostman.com/view/29696636/2s9YC8vAtB)

## Related Project

[Front End (React JS)](https://github.com/GilangRizaltin/Coffee-Shop-React)

[Backend (Golang)](https://github.com/GilangRizaltin/backend-golang)

## Support

For support, email gilangzaltin@gmail.com
