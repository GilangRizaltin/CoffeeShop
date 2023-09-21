const authRouter = require("express").Router();

const argon = require("argon2");

// authRouter.post("/", async (req,res) => {
//     try {
//         const {body} = req;
//         const hashedPwd = await argon.hash(body.password)

//     } catch (error) {
//         res.status(500).json({
//             msg: "Error"
//         })
//     }
// })

module.exports = authRouter;