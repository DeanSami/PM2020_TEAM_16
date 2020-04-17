module.exports = {
    messages: {
        failure: {
            status: false
        },
        success: {
            status: true
        }
    },
    user_types: {
        admin: 0,
    },
    server_port: process.env.PORT || 3000,
    log_func: function Log (req, res, next) {
        console.log('<LOG> -', new Date().toUTCString());
        next();
    },
    places_types:{
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
    }
}