//nodemailer setup
const {createTransport} = require("nodemailer");
const mustache = require("mustache");
const oauthclient = require("../Configs/oauth");
const fs = require("fs");
const path = require("path")


const {mail_service: service, mail_auth_type: type, mail_user: user,
        clientId, clientSecret, refreshToken} = require("../Configs/environtment")


const resetPwdMail = ({to, subject, data}) => {
        const accessToken = oauthclient.getAccessToken;
        const transporter = createTransport({
        service,
        auth: {
            type,
            user,
            clientId, clientSecret, refreshToken,
            accessToken
        },
    });
    const fileDir = path.join(__dirname, "../Template/html/resetPwd.html");
    const template = fs.readFileSync(fileDir, "utf8");
    const mailOption = {
        from: '"Gilang Rizaltin " <gilangzaltin@gmail.com>',
        to,
        subject,
        html: mustache.render(template, {...data}),
    }
    return transporter.resetPwdMail(mailOption)
};

module.exports = {resetPwdMail}