# Coffee Shop Backend with Express JS

<br>
<br>
<div align="center">
  <img src="https://res.cloudinary.com/doncmmfaa/image/upload/v1705476586/samples/Frame_13_ksk8wi.png" alt="Logo"  width="340" height="100"/>
</div>
<br>
<br>
It is a cafe business management website with several main features including menu display, menu ordering and order history. There are 2 roles, namely Consumer and Admin.
This project took 8 weeks to be carried out individually and based on specified requirements.

## Technologies used in this project

- [Express JS](https://pkg.go.dev/github.com/gin-gonic/gin#section-readme) \
  Express JS is a minimalist and flexible Node.js web application framework. \

- [JSON Web Token](https://jwt.io/introduction) \
  JSON Web Token (JWT) is a compact, URL-safe means of representing claims between two parties. \

- [Cloudinary](https://cloudinary.com/documentation) \
  Cloudinary is a cloud-based service for managing and optimizing media assets such as images and videos in web development. It simplifies tasks like image uploading, transformation, and delivery, offering a seamless solution for handling multimedia content in applications. \

- [PG](https://github.com/brianc/node-postgres) \
  Node-Postgres, commonly abbreviated as pg, is a Node.js driver for PostgreSQL databases. \

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in your root directory

```bash
  DB_HOST = "YOUR DB_HOST"
  DB_NAME = "YOUR DB_NAME"
  DB_USER = "YOUR DB_USER"
  DB_PASSWORD = "YOUR DB_PASSWORD"
  JWT_KEY = "YOUR JWT_KEY"
  ISSUER = "YOUR ISSUER"
  CLOUDINARY_NAME = "YOUR CLOUDINARY_NAME"
  CLOUDINARY_KEY = "YOUR CLOUDINARY_KEY"
  CLOUDINARY_SECRET = "YOUR CLOUDINARY_SECRET"
  MAIL_SERVICES = "YOUR MAIL_SERVICES"
  MAIL_AUTH_TYPE = "YOUR MAIL_AUTH_TYPE"
  MAIL_USER = "YOUR MAIL_USER"
  MIDTRANS_ID_MERCHANT = "YOUR MIDTRANS_ID_MERCHANT"
  MIDTRANS_CLIENT_KEY = "YOUR MIDTRANS_CLIENT_KEY"
  MIDTRANS_SERVER_KEY = "YOUR MIDTRANS_SERVER_KEY"
```

## Run Locally

1. Clone the project

```bash
  $ git clone https://github.com/GilangRizaltin/CoffeeShop
```

2. Go to the project directory

```bash
  $ cd CoffeeShop
```

3. Install dependencies

```bash
  $ npm install
```

4. Start the server

```bash
  $ npm run dev
```

## API Reference

#### Authentication & Authorization

| Method | Endpoint           | Description                        |
| :----- | :----------------- | :--------------------------------- |
| `post` | `"/auth/register"` | register user                      |
| `post` | `"/auth/login"`    | get access and identity of user    |
| `post` | `"/auth/logout"`   | delete access and identity of user |

#### Users

| Method | Endpoint  | Description                |
| :----- | :-------- | :------------------------- |
| `get`  | `"/user"` | Get all users (admin only) |
| `post` | `"/user"` | Add user (admin only)      |

#### Products

| Method | Endpoint             | Description                                  |
| :----- | :------------------- | :------------------------------------------- |
| `get`  | `"/product"`         | Get all product                              |
| `get`  | `"/product/popular"` | Get all popular and favourite product        |
| `get`  | `"/product/:id"`     | Get all product detail **Required** order_id |

#### Promos

| Method | Endpoint   | Description    |
| :----- | :--------- | :------------- |
| `get`  | `"/promo"` | Get all promos |

#### Orders

| Method | Endpoint   | Description        |
| :----- | :--------- | :----------------- |
| `get`  | `"/order"` | Get all orders     |
| `post` | `"/order"` | Create transaction |

## Documentation

[Postman Documentation](https://documenter.getpostman.com/view/29696636/2s9YC8vAtB)

## Related Project

[Front End (React JS)](https://github.com/GilangRizaltin/Coffee-Shop-React)

[Backend (Golang)](https://github.com/GilangRizaltin/backend-golang)

## Support

For support, email gilangzaltin@gmail.com
