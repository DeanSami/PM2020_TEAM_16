const globals = require('../../globals')
const express = require('express')
const db = require('../../db-connect')
const router = express.Router()

router.post('/create', function (req, res) {
    console.log('<LOG> - POST /user/business/add - Invoke');
    checkPermission(req.body, req.headers, (result) => {
        if (result && result.status) {
            res.status(result.status).json(result.message)
        } else {
            db.query('INSERT INTO businesses SET ?', result, function (err, inserted_row) {
                if (err) {
                    console.log('<LOG> - POST /user/business/add - ERROR');
                    console.error(err)
                    res.status(globals.status_codes.Server_Error).json()
                } else {
                    console.log('<LOG> - POST /user/business/add - SUCCESS');
                    res.status(globals.status_codes.OK).json()
                }
            });
        }
    });
});

router.patch('/edit', function (req, res) {
    if (req.body && req.body.id && !isNaN(req.body.id)) {
        let id = req.body.id;
        delete req.body.id;
        checkPermission(req.body, req.headers, (result) => {
            if (result && result.status) {
                res.status(result.status).json(result.message)
            } else {
                db.query('UPDATE businesses SET ? WHERE id = ?', [result, id], function (err, inserted_row) {
                    if (err) {
                        console.log('<LOG> - POST /user/business/add - ERROR');
                        console.error(err)
                        res.status(globals.status_codes.Server_Error).json()
                    } else {
                        console.log('<LOG> - POST /user/business/add - SUCCESS');
                        res.status(globals.status_codes.OK).json()
                    }
                });
            }
        });
    }
});

router.get('/' , function(req, res) {
    console.log('<LOG> - GET /user/business - Invoke');
    if (req.body.id && !isNaN(req.body.id)) {
        let temp_id = req.body.id;
        db.query('SELECT * FROM businesses WHERE id = ?', [temp_id], function (err, return_row) {
            if (err) {
                console.log('<LOG> - GET /user/business - ERROR');
                console.error(err);
                res.status(globals.status_codes.Server_Error).json();
            } else {
                console.log('<LOG> - GET /user/business - SUCCESS');
                res.status(globals.status_codes.OK).json(return_row)
            }
        })
    } else {
        db.query('SELECT * FROM businesses', [], function (err, result) {
            if (err) {
                console.log('<LOG> - GET /user/business - ERROR');
                console.error(err);
                res.status(globals.status_codes.Server_Error).json();
            } else {
                console.log('<LOG> - GET /user/business - SUCCESS');
                res.status(globals.status_codes.OK).json(result)
            }
        })
    }
});

function checkPermission(data, headers, callback) {
    const {
        name,
        owner_id,
        dog_friendly,
        description,
        phone,
        image,
        address,
        type
    } = data;

    if (!name || !owner_id || !phone || isNaN(type))
    {
        console.log('<LOG> - POST /business/add - At least 1 field is missing');
        callback({status: globals.status_codes.Bad_Request, message: 'missing arguments'});
    }
    else {
        let business = {
            name: name,
            owner_id: owner_id,
            dog_friendly: dog_friendly ? dog_friendly : 0,
            description: description ? description : '' ,
            phone: phone,
            image: image ? image : '',
            address: address ? address : '',
            type: type
        };

        db.query('SELECT * FROM users WHERE id = ? AND user_type = ?', [owner_id, globals.user_types.businessOwner], function (err, result) {
            if (err) {
                console.log('<LOG> - POST /user/business/add - ERROR');
                console.error(err);
                callback({status: globals.status_codes.Server_Error});
            } else {
                if (result && result.length > 0) {
                    callback(business);
                } else {
                    console.log('<LOG> - POST /user/business/add - invalid owner_id');
                    console.error(err);
                    callback({status: globals.status_codes.Bad_Request, message: 'invalid owner_id'});
                }
            }
        });
    }
}
module.exports = router;


