# Coffee Shop Project

Coffee shop project adalah project untuk membuat situs website dengan peruntukannya untuk cafe. Project ini menggunakan API untuk GET (mendapatkan data), POST (mengirimkan data), PATCH (mengubah data secara parsial) dan DELETE (menghapus data). Project ini dibuat dengan bantuan Javascript sebagai bahasa pemograman, nodeJs sebagai eksekutor Javascript, ExpressJs sebagai pembantu dalam mengelola server dan rute, PostgreSql sebagai tempat penyimpanan data, dan Postman untuk membuat API.

## API Reference

#### Product

```http
  /products
```

| Method   | Endpoint     | Description                |
| :------- | :----------- | :------------------------- |
| `get`    | `"/"`        | Get all products           |
| `post`   | `"/"`        | Insert a product           |
| `patch`  | `"/:id"`     | Update details for product |
| `delete` | `"/:id"`     | Deleting product           |
| `get`    | `"/popular"` | Get mmost popular products |

#### Users

```http
  /users
```

| Method   | Endpoint          | Description                               |
| :------- | :---------------- | :---------------------------------------- |
| `post`   | `"/"`             | Register                                  |
| `post`   | `"/login"`        | Log in user **Required** email & password |
| `get`    | `"/verification"` | verification for activating account       |
| `get`    | `"/logout"`       | Log out from application                  |
| `get`    | `"/"`             | Get all users (special for admin)         |
| `patch`  | `"/"`             | Update users detail and profile           |
| `patch`  | `"/username"`     | Update an username                        |
| `delete` | `"/:id"`          | Deleting user                             |

#### Promos

```http
  /promos
```

| Method   | Endpoint | Description      |
| :------- | :------- | :--------------- |
| `get`    | `"/"`    | Get all promos   |
| `post`   | `"/"`    | Post some promos |
| `patch`  | `"/:id"` | Edit some promo  |
| `delete` | `"/:id"` | Deleting promo   |

#### Orders

```http
  /orders
```

| Method   | Endpoint | Description                  |
| :------- | :------- | :--------------------------- |
| `get`    | `"/"`    | Get all orders               |
| `post`   | `"/"`    | Create transaction           |
| `patch`  | `"/:id"` | Updating orders statuses     |
| `delete` | `"/:id"` | Deleting order (soft delete) |

#### Order Products

```http
  /orderproduct
```

| Method   | Endpoint | Description                                  |
| :------- | :------- | :------------------------------------------- |
| `get`    | `"/:id"` | Get all order product **Required** order_id  |
| `patch`  | `"/:id"` | Edit an order product **Required** order_id  |
| `delete` | `"/:id"` | Deleting order product **Required** order_id |

## Authors

Authors By me Gilang Muhamad Rizaltin \
**Github link**

- [@GilangRizaltin](https://github.com/GilangRizaltin)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DB_HOST`,
`DB_NAME`,
`DB_USER`,
`DB_PASSWORD`,
`JWT_KEY`,
`ISSUER`,
`GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`,
`GOOGLE_REFRESH_TOKEN`,
`MAIL_SERVICES`,
`MAIL_AUTH_TYPE`,
`MAIL_USER`
