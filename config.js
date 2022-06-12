// exports.config = {
//     host: "tyke.db.elephantsql.com",
//     port: 5432,
//     user: "mpljrfas",
//     password: "cxQ-g8_lras9oveJSLLxgOOEk2kvXgx2",
//     database: "mpljrfas",
//     connection_limit: 100
// }

module.exports = {
    HOST: process.env.HOST||null,
    PORT: process.env.PORT||10888,
    DB_HOST: process.env.DB_HOST||"cluster0.8bmuf.mongodb.net",
    DB_PORT: process.env.DB_PORT||5432,
    DB_USER: process.env.DB_USER||"ikouhaha888",
    DB_PWD: process.env.DB_PWD||"ikouhaha765",
    DB_NAME: process.env.DB_NAME||"vt6002cem",
    connection_limit: 100,
    SECRET:process.env.SECRET||"123456",
    TOKEN_EXPIRED:process.env.TOKEN_EXPIRED||"365d",
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID||"767632957173-jfsm2778sgj278f8lf45jerj5uld3bv2.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET||"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",
    COR_ORIGINS:process.env.COR_ORIGINS||"http://localhost:3000",
    googleCallbackURL:"http://localhost:10888/api/v1/auth/google/callback",
    DEFAULT_IMAGE:process.env.DEFAULT_IMAGE||'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPMSkkxBgAD2QFnQD1bxwAAAABJRU5ErkJggg=='
}
    