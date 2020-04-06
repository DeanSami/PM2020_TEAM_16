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
    }
}