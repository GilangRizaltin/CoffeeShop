module.exports = {
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPw: process.env.DB_PASSWORD,
    jwtKey: process.env.JWT_KEY,
    issuerWho: process.env.ISSUER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken : process.env.GOOGLE_REFRESH_TOKEN,
    mail_service : process.env.MAIL_SERVICES,
    mail_auth_type: process.env.MAIL_AUTH_TYPE,
    mail_user: process.env.MAIL_USER
}