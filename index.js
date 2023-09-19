require("dotenv").config();
//import express
const express = require("express"); // mengambil library express

//generate express aplication
const server = express();

//parser untuk json dan url encode
server.use(express.json());
server.use(express.urlencoded({extended: false}));

server.listen(9000, () => {
  console.log("Server is running at port 9000");
});

const mainRouter = require("./src/Routers/main.router");
server.use(mainRouter);


server.get(
    "/",
    (req, res, next) => {
      console.log("mid 1");
      next();
    },
    (req, res, next) => {
      console.log("mid 2");
      next();
    },
    (req, res) => {
      console.log("last mid");
      res.send("This Is My Website holla")}
  );
//Products
server.get("/products", async (req,res,next) => {
    try {
        const sql = `select p.id as "No.",
        p.product_name as "Product",
        c.category_name as "Categories",
        p.description as "Description",
        p.price_default as "Price"
        from products p
        join categories c on p.category = c.id`
        const result = await db.query(sql);
        res.status(200).json({
            msg: "Success",
            result: result.rows,
        })
    } catch (error) {
        res.status(500).json({
            msg: "Internal Server Error",
        })
    }
});

server.post("/products/create", (req, res) => {
  const {body} = req;
  const sql =
    "INSERT INTO products (product_name, category, description, price_default) VALUES ($1, $2, $3, $4) RETURNING product_name";
  const values = [
    body.product_name,
    body.category,
    body.description,
    body.price_default,
  ];
  db.query(sql, values)
    .then((data) => {
      res.status(201).json({
        msg: "Product berhasil ditambah",
        result: data.rows,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        msg: "Internal server error",
      });
    });
});

server.patch("/products/update/:id", async (req, res) => {
  try {
    const {body, params} = req;
    const sql = "UPDATE products SET product_name = $1, update_at = NOW() WHERE id = $2 returning id";
    const values = [
      body.product_name,
      params.id,
    ];
    const result = await db.query(sql, values);
    if (result.rowCount === 0) {
      return res.status(404).json({
        msg: `Produk dengan id ${params.id} tidak ditemukan`,
      });
    };
    res.status(201).json({
      msg: `Product dengan id ${params.id} berhasil diupdate menjadi ${body.product_name}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

server.delete("/products/delete/:id", (req,res) => {
  const {params} = req;
  const sql = "delete from products where id = $1 returning product_name;";
  const values = [params.id,];
  db.query(sql,values)
  .then((data) => {
      if (data.rowCount > 0) {
      res.status(201).json({
          msg: `Product ${data.rows[0].product_name} dengan id ${values[0]} berhasil dihapus.`,
      });
  } else {
      res.status(404).json({
        msg: `Product dengan id ${values[0]} tidak ditemukan.`,
      });
    }
  })
  .catch((err) => {
      res.status(500).json({
          msg: "Internal Server Error",
      });
  })
});

server.get("/products/search", async (req, res) => {
  try {
    const {query} = req;
    const sql = `select p.id as "No.",
    p.product_name as "Product",
    c.category_name as "Categories",
    p.description as "Description",
    p.price_default as "Price"
    from products p
    join categories c on p.category = c.id
    where p.product_name ilike $1`;
    const values = [`%${query.title}%`];
    const result = await db.query(sql,values);
    if (result.rows.length === 0) {
      return res.status(404).json({
        msg: "Product not found",
        result: []
      });
    } res.status(200).json({
      msg: "Success",
      result: result.rows
    });
  } catch {
    res.status(500).json({
      msg: "Internal Server Error",
    });
  };
});

server.get("/products/popular", async (req,res) => {
  try{
    const sql = `SELECT
    p.product_name as "Product",
    SUM(op.quantity) AS "Total Quantity"
FROM
    orders_products AS op
JOIN
    products AS p
ON
    op.product_id = p.id
GROUP BY
    p.id
HAVING
    SUM(op.quantity) IS NOT NULL
ORDER BY
    "Total Quantity" DESC;`;
    const result = await db.query(sql);
    res.status(200).json({
      msg: "Success",
      result: result.rows
    })
  } catch (error) {
    res.status(500).json({
      msg: "Internal Server Error"
    });
  };
});

//Users
server.get("/users", async (req,res,next) => {
    try {
        const sql = `select id as "No.",
        user_name as "Username",
        full_name as "Name",
        phone as "Phone Number",
        address as "Address",
        email as "E-Mail",
        user_type as "User Type"
        from users`
        const result = await db.query(sql);
        res.status(200).json({
            msg: "Success",
            result: result.rows,
        })
    } catch (error) {
        res.status(500).json({
            msg: "Internal Server Error",
        })
    }
});

server.post("/users/create", (req, res) => {
  const {body} = req;
  const sql =
  "insert into users(user_name, full_name, phone, address, email, user_type) VALUES ($1, $2, $3, $4, $5, $6) returning id, full_name";
  const values = [
    body.user_name,
    body.full_name,
    body.phone,
    body.address,
    body. email,
    body.user_type,
  ];
  db.query(sql, values)
    .then((data) => {
      const createdUser = data.rows[0];
      res.status(201).json({
        msg: `User berhasil dibuat. id anda = ${createdUser.id} dengan nama : ${createdUser.full_name}`,
        result: createdUser,
      });
    })
    .catch((error) => {
      if (error.code === "23505" && error.constraint === "users_user_name_key") {
        return res.status(400).json({
          msg: "Username sudah ada"
        });
      } res.status(500).json({
        msg: "Internal server error",
      });//console.log(error);
    });
});

server.patch("/users/update/:id", async (req,res) => {
  try {
    const {body, params} = req;
    const sql = "update users set email = $1 where id = $2 returning id, full_name"
    const values = [body.email, params.id];
    const result = await db.query(sql, values);
    if (result.rowCount === 0) {
      return res.status(404).json({
        msg: `Users dengan id ${params.id} tidak ditemukan.`,
      })
    } res.status(201).json({
      msg: `E-mail users dengan nama ${result.rows[0].full_name} berhasil diubah menjadi ${body.email}`
    })
  } catch (err){
      res.status(500).json({
        msg: 'Internal Server Error'
      });
  };
});

server.delete("/users/delete/:id", (req,res) => {
  const {params} = req;
  const sql = "delete from users where id = $1 returning full_name"
  const value = [params.id];
  db.query(sql, value)
  .then((data) => {
    if (data.rowCount === 0) {
      return res.status(404).json({
        msg: `Users dengan id ${value[0]} tidak ditemukan.`,
      })
    } res.status(201).json({
      msg: `Users dengan id ${params.id} bernama ${data.rows[0].full_name} berhasil dihapus.`,
      });
  }).catch((err) => {
    res.status(500).json({
      msg: "Internal Server Error"
    });
  });
});

//Promos
server.get("/promos", async (req,res,) => {
    try {
        const sql = `select pr.id as "No.",
        pr.promo_code as "Promos Code",
        pt.promo_type_name as "Type Promo",
        pr.flat_amount as "Flat Amount",
        pr.percent_amount as "Percent Amount",
        pr.created_at as "Date Start",
        pr.ended_at as "Date End"
        from promos pr
        join promos_type pt on pr.promo_type = pt.id`
        const result = await db.query(sql);
        res.status(200).json({
            msg: "Success",
            result: result.rows,
        })
    } catch (error) {
        res.status(500).json({
            msg: "Internal Server Error",
        })
    }
});

server.post("/promos/create", (req, res) => {
  const {body} = req;
  const sql =
    "INSERT INTO promos (promo_code, promo_type, flat_amount, percent_amount, ended_at) VALUES ($1, $2, $3, $4, $5) RETURNING promo_code, ended_at";
  const values = [
    body.promo_code,
    body.promo_type,
    body.flat_amount,
    body.percent_amount,
    body.ended_at,
  ];
  db.query(sql, values)
    .then((data) => {
      const detailsPromo = data.rows[0];
      res.status(201).json({
        msg: `Promo dengan kode ${detailsPromo.promo_code} telah berhasil dibuat`,
        result: detailsPromo,
      });
    })
    .catch((error) => {
      if (error.code === "23505") {
        return res.status(400).json({
          msg: "Kode promo sudah ada"
        });
      } res.status(500).json({
        msg: "Internal server error",
      });//console.log(error);
    });
});

server.patch("/promos/update/:id", async (req, res) => {
  try{
    const {body, params} = req;
    const sql = "update promos set ended_at = $1 where id = $2 returning promo_code"
    const values = [body.ended_at, params.id];
    const result = await db.query(sql,values);
    if (result.rowCount === 0) {
      return res.status(404).json({
        msg: `ID ${params.id} tidak ditemukan`,
      });
    };
    res.status(201).json({
      msg: `Data promo ${result.rows[0].promo_code} berhasil diupdate masa berlakunya menjadi ${body.ended_at}`,
    })
  } catch (error) {
    res.status(500).json({
      msg: "Internal Server Error"
    })
    console.log(error);
  };
});

server.delete("/promos/delete/:id", (req,res) => {
  const {params} = req;
  const sql = "delete from promos where id = $1 returning promo_code"
  const value = [params.id];
  db.query(sql,value)
  .then((result) => {
    if (result.rowCount === 0) {
      return res.status(404).json({
        msg: `Promo dengan id ${req.params.id} tidak ditemukan.`,
      })
    } res.status(201).json({
      msg: `Kode promo ${result.rows[0].promo_code} dengan id ${params.id} berhasil dihapus`
    })
  }) .catch((err) => {
    res.status(500).json({
      msg: "Internal Server Error"
    });
  });
});

//Orders

server.get("/orders", (req,res) => {
  const sql = `select o.id as "No.",
  u.full_name  as "User",
  o.subtotal as "Subtotal",
  p.promo_code as "Promo Code",
  o.percent_discount as "Discount Percentage",
  o.flat_discount as "Discount Flat",
  s.serve_type as "Serving Type",
  o.fee as "Serving Fee",
  o.tax as "Tax",
  o.total_transactions as "Total Transactions",
  py.payment_name as "Payment Type",
  o.status as "Status"
  from orders o
  join users u on o.user_id = u.id
  join promos p on o.promo_id = p.id
  join serve s on o.serve_id = s.id 
  join payment_type py on o.payment_type = py.id;`;
  db.query(sql)
  .then((result) => {
    res.status(201).json({
      msg: "Success",
      result: result.rows
    })
  }) .catch((err) => {
    res.status(500).json({
      msg: "Internal Server Error"
    });
  });
});

// server.post("/orders/create/:user_id", async(req,res) => {
//   try {
//     const {body, params} = req;
//     const sql = `INSERT INTO orders(user_id, promo_id, percent_discount,flat_discount, serve_id, fee, tax, payment_type, status)
//     VALUES (
//         $1,
//         $2,
//         (select percent_amount from promos where id = $2),
//         (select flat_amount from promos where id = $2),
//         $3,
//         (select fee from serve where id = $3),
//         0.1,
//         $4,
//         $5)`;
//       const values = [
//         params.user_id,
//         body.promo_id,
//         body.serve_id,
//         body.payment_type,
//         body.status
//       ];
//       const result = await db.query(sql,values);
//       res.status(200).json({
//         msg: "Order Berhasil Dimasukkan",
//     })
//   } catch (err) {
//     res.status(500).json({
//       msg: "Internal Server Error"
//     }); console.log(err)
//   };
// });

server.patch("/order/update/subtotal", async (req,res) => {
  try {
    const sql = `UPDATE orders AS o
    SET subtotal = (
        SELECT SUM(subtotal) 
        FROM orders_products AS op
        WHERE op.order_id = o.id
    )
    WHERE EXISTS (
        SELECT 1 
        FROM orders_products AS op2
        WHERE op2.order_id = o.id
    )`;
    const result = await db.query(sql);
    res.status(201).json({
      msg: "Subtotal berhasil diupdate",
      result: result.rows
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal Server Error"
    });
  };
});

server.patch("/order/update/total_transactions", async (req,res) => {
  try {
    const sql = `UPDATE orders AS o
    SET total_transactions = ((o.subtotal - flat_discount - (o.subtotal * percent_discount)) + o.fee + (o.subtotal * 0.1))
    WHERE EXISTS (
        SELECT 1 
        FROM orders
    )`;
    const result = await db.query(sql);
    res.status(201).json({
      msg: "Total Transaksi berhasil diupdate",
      result: result.rows
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal Server Error"
    });
  };
});

server.patch("/orders/delete", (req,res) => {
  const {body} = req;
  const sql = "update orders set deleted_at = now() where id = $1";
  const value = [body.order_id];
  db.query(sql, value)
  .then((result) => {
    if (result.rowCount === 0) {
      return res.status(404).json({
        msg: `Order dengan id ${body.order_id} tidak ditemukan.`,
      })
    } res.status(201).json({
      msg: `Order dengan id ${value[0]} berhasil dihapus`
    })
  }) .catch((err) => {
    res.status(500).json({
      msg: "Internal Server Error"
    }); console.log(err)
  });
});

//Orders Details
server.get("/orderproduct", async (req, res) => {
  try{
    const sql = `select op.id as "No.",
    o.id as "Order ID",
    p.product_name as "Product",
    s.size_name as "Size",
    op.price as "Price per product",
    op.quantity as "Quantity",
    op.subtotal as "Subtotal"
    from orders_products op
    join 
    orders o on op.order_id = o.id
    join 
    products p on op.product_id = p.id
    join
    sizes s on op.size_id = s.id`;
    const result = await db.query(sql);
    res.status(200).json({
      msg: "Success",
      result: result.rows
    });
  } catch (err) {
    res.status(500).json({
      msg: "Internal Server Error"
    });
  };
});

server.post("/orderproduct/create", (req,res) => {
  const {body} = req;
  const sql = `insert into orders_products (order_id, product_id, size_id,  hot_or_not, price, quantity, subtotal)
  values ($1,$2,$3, $5, (select price_default from products where id = $2) + (select additional_fee from sizes where id = $3), 
  $4,((select price_default from products where id = $2) + (select additional_fee from sizes where id = $3))* $4)`;
  const values = [
    body.order_id,
    body.product_id,
    body.size_id,
    body.quantity,
    body.hor_or_not
  ];
  db.query(sql,values)
  .then ((result) => {
    if (result.rowCount === 0) {
      return res.status(404).json({
        msg: `Order dengan id ${body.order_id} tidak ditemukan.`,
      })
    } res.status(201).json({
      msg: "Order Product berhasil dibuat",
      result: result.rows
    })
  }) .catch ((error) => {
    res.status(500).json({
      msg:"Internal Server Error"
    }); console.log(error);
  });
});

server.patch("/orderproduct/update", async (req, res) => {
  try{
    const {body} = req;
    const sql = "update orders_products set quantity = $1 where id = $2 returning id, quantity"
    const values = [body.quantity, body.id];
    const result = await db.query(sql,values);
    if (result.rowCount === 0) {
      return res.status(404).json({
        msg: `ID ${params.id} tidak ditemukan`,
      });
    };
    res.status(201).json({
      msg: `Data id ${result.rows[0].id} berhasil diupdate quantity menjadi ${body.quantity}`,
    })
  } catch (error) {
    res.status(500).json({
      msg: "Internal Server Error"
    })
    console.log(error);
  };
});

server.delete("/orderproduct/delete/:id", (req,res) => {
  const {params} = req;
  const sql = "delete from orders_products where id = $1 returning id, product_id"
  const value = [params.id];
  db.query(sql,value)
  .then((result) => {
    if (result.rowCount === 0) {
      return res.status(404).json({
        msg: `Order Product id ${req.params.id} tidak ditemukan.`,
      })
    } res.status(201).json({
      msg: `Order Produk ${result.rows[0].id} dengan id ${params.id} berhasil dihapus`
    })
  }) .catch((err) => {
    res.status(500).json({
      msg: "Internal Server Error"
    });
  });
});

//pagination
server.get("/products/page", async (req,res) => {
  try{
    const {body} = req;
    const sql = `select
    product_name
      from
    products p
      limit 3 offset ($1 * 3) - 3`;
      const value = [body.page];
    const result = await db.query(sql, value);
    res.status(200).json({
      msg: "Success",
      result: result.rows
    })
  } catch (error) {
    res.status(500).json({
      msg: "Internal Server Error"
    });
  };
});

// server.get("/products/orderby", (req,res) => {
//   const {body} = req;
//   const sql = `select p.id as "No.",
//   p.product_name as "Product",
//   c.category_name as "Categories",
//   p.description as "Description",
//   p.price_default as "Price",
//   p.created_at as "Created at"
//   from products p
//   join categories c on p.category = c.id
//   order by "Product" asc`
//   const values = [body.type, body.order_by];
//   db.query(sql, values)
//   .then ((result) => {
//     res.status(200).json({
//       msg: "Success",
//       result: result.rows
//     })
//   }) .catch ((err) => {
//     res.status(500).json({
//       msg:"Internal Server Error"
//     });
//   });
// });

// const db = require("./src/Configs/postgre");
// server.post("/orders/transaction/:user_id", async (req, res) => {
//   const client = await db.connect();
//   try {
//     const {body, params} = req;
//     const orderInsert = `INSERT INTO orders(user_id, subtotal, promo_id, percent_discount, flat_discount, serve_id, fee, tax, total_transactions, payment_type, status)
//     VALUES (
//         $1,
//         $2,
//         $3,
//         (SELECT percent_amount FROM promos WHERE id = $3),
//         (SELECT flat_amount FROM promos WHERE id = $3),
//         $4,
//         (SELECT fee FROM serve WHERE id = $4),
//         0.1,
//         $5,
//         $6,
//         $7
//     ) returning id`;
//     const valuesone = [params.user_id, body.subtotal, body.promo_id, body.serve_id, 
//       body.total_transactions, body.payment_type, body.status];
//     const orderProductInsert =`INSERT INTO orders_products (order_id, product_id, hot_or_not, size_id, price, quantity, subtotal)
//     VALUES (
//         $1,
//         $2,
//         $3,
//         $4,
//         (
//             (SELECT price_default FROM products WHERE id = $2) + 
//             (SELECT additional_fee FROM sizes WHERE id = $4)
//         ),
//         $5,
//         (
//             (
//                 (SELECT price_default FROM products WHERE id = $2) + 
//                 (SELECT additional_fee FROM sizes WHERE id = $4)
//             ) * $5
//         )
//     )`;
//     await client.query("begin");
//     const result = await db.query(orderInsert, valuesone);
//     const valuestwo = [result.rows[0].id, body.product_id, body.hot_or_not, body.size_id, body.quantity];
//     await db.query(orderProductInsert, valuestwo);
//     await client.query("commit");
//     res.status(201).json({
//       msg: "Transaksi Berhasil Dibuat",
//       result: result.rows
//     });
//   } catch (error) {
//     await client.query("rollback");
//     res.status(500).json({
//       msg: "Internal Server Error"
//     }); console.log(error);
//   } finally {
//     client.release();
//   }
// });

