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
    log_func: function Log (req, res, next) {
        console.log('<LOG> -', new Date().toUTCString());
        next();
    },
    places_types:{
        dog_park: 0,
        Historic_Parks: 1,
        Cafewithdog: 2,
        NationalParks: 3,
    }
}