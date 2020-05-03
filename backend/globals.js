module.exports = {
    user_types: {
        admin: 0,
    },
    server_port: process.env.PORT || 3000,
    DB: {
        HOST: '104.248.25.246',
        PORT: 3306,
        USER: 'admin',
        PASS: '588c9a1d776ecba6e99f97c8793f0552c2ffd7cd7fb469f0',
        NAME: 'pm2020_team16'
    },
    log_func: function Log (req, res, next) {
        console.log('<LOG> -', new Date().toUTCString());
        next();
    },
    places_types: {
        dog_park: 0,
        Historic_Parks: 1,
        Cafewithdog: 2,
        NationalParks: 3,
    },
    status_codes: {
        OK: 200,
        Created: 201,
        Accepted: 202,
        No_Content: 204,
        Bad_Request: 400,
        Unauthorized: 401,
        Forbidden: 403,
        Not_Found: 404,
        Server_Error: 500
    },
    aws: {

    }
}
