const express = require('express')
const db = require('../db-connect')
const globals = require('../globals')
const router = express.Router()
const hat = require('hat')
const bcrypt = require('bcrypt')

router.use(function isAdmin (req, res, next) {
    if (req.originalUrl == '/admin/login' || req.originalUrl == '/admin/register') next();
    else {
    console.log('<LOG> - POST /admin/* - Middleware')
        const incoming_token = JSON.parse(JSON.stringify(req.headers))['x-auth'];
        if (incoming_token) {
            db.query('SELECT * FROM user_sessions, users WHERE user_sessions.user_id = users.id AND user_sessions.session = ? AND user_type = ?', [incoming_token, globals.user_types.admin], function (err, result) {
                if (err) {
                    console.log('<LOG> - POST /admin/* - ERROR');
                    console.error(err);
                    res.statusCode = 400;
                    res.json(globals.messages.failure)
                }
                else if (result.length > 0) {
                    console.log('<LOG> - POST /admin/* - SUCCESS');
                    next()
                } else {
                    console.log('<LOG> - POST /admin/* - Unauthorized Access Attempt');
                    res.statusCode = 401;
                    res.json(globals.messages.failure)
                }
            })
        } else {
            console.log('<LOG> - POST /admin/* - Missing Credentials');
            res.statusCode = 401;
            res.json(globals.messages.failure)
        }
    }
});

router.use(globals.log_func);


//REGISTER REQUEST
router.post('/register', function(req, res) {
    console.log("<LOG> - POST /admin/register")
    bcrypt.hash(req.body.pass, 10, function (err, hash) {
        const values = {phone: req.body.phone, password: hash, user_type: 0}
        db.query('INSERT INTO users SET ?', values, function (err, result) {
            if (!err) {
                console.log("<LOG> - POST /admin/register - ERROR")
                res.json(globals.messages.success)
            }
            else {
                console.log("<LOG> - POST /admin/register - SUCCESS")
                res.json(globals.messages.success)
            }
        })
    })
});
//LOGIN REQUEST
router.post('/login', function (req, res) {
    console.log('<LOG> - POST /admin/login - Invoke');
    const phone = req.body.phone;
    db.query('SELECT * FROM users WHERE phone = ?', [phone], function (err, phone_query_result) {
        if (err) {
            console.log('<LOG> - POST /admin/login - ERROR');
            console.error(err);
            res.json(globals.messages.failure)
        } else {
            if (phone_query_result.length > 0) {
                const password = req.body.pass;
                bcrypt.compare(password, phone_query_result[0].password, function (err, pass_compare) {
                    if (err) {
                        console.error(err);
                        res.json(globals.messages.failure)
                    } else {
                        if (!pass_compare) {
                            console.log('<LOG> - POST /admin/login - Wrong Credentials pass');
                            res.statusCode = 401;
                            res.json(globals.messages.failure)
                        } else {
                            delete phone_query_result[0].password;
                            var token = hat();
                            db.query('INSERT INTO user_sessions(user_id,session) VALUES (?,?)',[phone_query_result[0].id,token],function (err, insert_query_result){
                                if (err) {
                                    console.log('<LOG> - POST /admin/login - Wrong Values inserted');
                                    console.error(err);
                                    res.statusCode = 400
                                    res.json(globals.messages.failure)
                                } else {
                                    console.log('<LOG> - POST /admin/login - SUCCESS');
                                    res.json({
                                        status: true,
                                        token: token,
                                        user: phone_query_result[0]
                                    })
                                }
                            });
                        }
                    }
                })
            } else {
                console.log('<LOG> - POST /admin/login - Wrong Credentials');
                res.statusCode = 401;
                res.json(globals.messages.failure)
            }
        }
    })
});
//ADMIN LOGIN
router.get('/login', function (req, res) {
    console.log('<LOG> - GET /admin/login - Invoke');
    const incoming_token = JSON.parse(JSON.stringify(req.headers))['x-auth']
    if (incoming_token) {
        db.query('SELECT * FROM user_sessions, users WHERE user_sessions.user_id = users.id AND user_sessions.session = ?', [incoming_token], function(err, result) {
            if (err) {
                console.log('<LOG> - GET /admin/login - ERROR');
                console.error(err);
                res.json(globals.messages.failure)
            } else {
                if (result.length > 0) {
                    delete result[0].password;
                    console.log('<LOG> - GET /admin/login - SUCCESS');
                    res.json({
                        status: true,
                        user: result[0]
                    })
                } else {
                    console.log('<LOG> - GET /admin/login - Unauthorized Credentials');
                    res.statusCode = 401;
                    res.json(globals.messages.failure)
                }
            }
        })
    } else {
        console.log('<LOG> - GET /admin/login - Credentials Missing');
        res.statusCode = 401;
        res.json(globals.messages.failure)
    }
});
//ADD PARK REQUEST
router.post('/dog_parks', function (req, res) {
    console.log('<LOG> - POST /admin/dog_parks/add - Invoke');

    if (!req.body.user_input) {
        console.log('<LOG> - POST /dog_parks/add - Wrong Payload Format');
        res.json(globals.messages.failure)
    } else {
        const {
            name,
            SHAPE_Leng,
            SHAPE_Area,
            street,
            house_number,
            neighborhood,
            operator,
            handicapped,
            condition
        } = req.body.user_input;

        if (name == undefined
            || SHAPE_Leng == undefined
            || SHAPE_Area == undefined
            || house_number == undefined
            || neighborhood == undefined
            || operator == undefined
            || handicapped == undefined
            || condition == undefined)
        {
            console.log('<LOG> - POST /dog_parks/add - At least 1 field is missing');
            res.statusCode = 400;
            res.json(globals.messages.failure)
        }
        else if (typeof(name) !== 'string'
            || typeof(SHAPE_Leng) !== 'string'
            || typeof(SHAPE_Area) !== 'string'
            || typeof(house_number) !== 'string'
            || typeof(neighborhood) !== 'string'
            || typeof(operator) !== 'string'
            || (typeof(handicapped) !== 'boolean' && typeof(handicapped) !== 'number')
            || typeof(condition) !== 'number')
        {
            console.log('<LOG> - POST /dog_parks/add - Error with type of at least 1 input field');
            res.statusCode = 400;
            res.json(globals.messages.failure)
        } else {
            var values = {type: globals.places_types.dog_park, name:name, SHAPE_Leng:SHAPE_Leng, SHAPE_Area:SHAPE_Area, house_number:house_number,neighborhood:neighborhood, operator:operator, handicapped:handicapped, condition:condition};
            if (street !== undefined)
                values.street = street;

            db.query('INSERT INTO places SET ?', values, function (err, insert_dog_park_result) {
                if (err) {
                    console.log('<LOG> - POST /admin/dog_parks/add - ERROR');
                    console.error(err)
                    res.json(globals.messages.failure)
                } else {
                    db.query('SELECT * FROM places WHERE id = (?)', [insert_dog_park_result.insertId], function (err, select_dog_park_result) {
                        if (err) {
                            console.log('<LOG> - POST /admin/dog_parks/add - ERROR');
                            console.error(err);
                            res.statusCode = 400;
                            res.json(globals.messages.failure)
                        } else {
                            console.log('<LOG> - POST /admin/dog_parks/add - SUCCESS');
                            res.json({
                                status: true,
                                places: select_dog_park_result
                            })
                        }
                    })
                }
            })
        }
    }

});
//GET PARK REQUEST -> based on id that comes from body request
router.get('/dog_parks' , function(req, res) {
    console.log('<LOG> - GET /admin/dog_parks/get - Invoke');
    //if the clint want specific park dog
    if (req.body.id) {
        var temp_id = req.body.id;
        db.query('SELECT * FROM places WHERE id = ? AND type = ?', [temp_id, globals.places_types.dog_park], function (err, result) {
            if (err) {
                console.log('<LOG> - GET /admin/dog_parks/get - ERROR');
                console.error(err);
                res.statusCode = 400;
                res.json(globals.messages.failure);
            } else {
                console.log('<LOG> - GET /admin/dog_parks/get - SUCCESS');
                res.json({
                    status: true,
                    places: result
                    })
                }
            })
        }
        //if the clint want all the park dog that at the db
        else {
            db.query('SELECT * FROM places WHERE deleted = 0 AND type = ?',[globals.places_types.dog_park], function (err, result) {
                if (err) {
                    console.log('<LOG> - GET /admin/dog_parks/get - ERROR');
                    console.error(err);
                    res.statusCode = 400;
                    res.json(globals.messages.failure);
                } else {
                    console.log('<LOG> - GET /admin/dog_parks/get - SUCCESS');
                    res.json({
                        status: true,
                        places: result
                    })
                }
            })
        }
    });
//DELETE PARK REQUEST
router.delete('/dog_parks',function (req,res) {
    console.log('<LOG> - DELETE /PARK DOG - Invoke');
    if(req.query.id)
    {
        var temp_id = req.query.id;
        db.query('UPDATE places SET deleted = 1 WHERE id = ? AND deleted = 0 ', [temp_id],function (err,result) {
            if (err) {
                console.log('<LOG> - DELETE /PARK DOG - ERROR');
                console.error(err);
                res.json(globals.messages.failure);
            } if (result.affectedRows > 0) {
                console.log("<LOG> - DELETE /PARK DOG - SUCCESS");
                res.json({

                    status: true,
                    message: "delete action has been done",
                })
            } else {
                console.log('<LOG> - DELETE /PARK DOG - Wrong Parameters');
                res.statusCode = 400;
                res.json(globals.messages.failure);
            }

        });
    }
    else{
        console.error("not ID has been send");
        res.json(globals.messages.failure);
    }
});
//UPDATE PARK DOG REQUEST
router.patch('/dog_parks',function (req,res) {
    console.log('<LOG> - UPDATE /dog_parks - Invoke');
    if (!req.body.user_input) {
        console.log('<LOG> - UPDATE /dog_parks - Wrong Payload Format');
        res.json(globals.messages.failure)
    } else {
        const {
            id,
            name,
            SHAPE_Leng,
            SHAPE_Area,
            street,
            house_number,
            neighborhood,
            operator,
            handicapped,
            condition
        } = req.body.user_input;

        if (name == undefined
            || SHAPE_Leng == undefined
            || SHAPE_Area == undefined
            || house_number == undefined
            || neighborhood == undefined
            || operator == undefined
            || handicapped == undefined
            || condition == undefined)
        {
            console.log('<LOG> - UPDATE /dog_parks - At least 1 field is missing');
            res.statusCode = 400;
            res.json(globals.messages.failure)
        }
        else if (typeof(name) !== 'string'
            || typeof(SHAPE_Leng) !== 'string'
            || typeof(SHAPE_Area) !== 'string'
            || typeof(house_number) !== 'string'
            || typeof(neighborhood) !== 'string'
            || typeof(operator) !== 'string'
            || (typeof(handicapped) !== 'boolean' && typeof(handicapped) !== 'number')
            || typeof(condition) !== 'number')
        {
            console.log('<LOG> - UPDATE /dog_parks - Error with type of at least 1 input field');
            res.statusCode = 400;
            res.json(globals.messages.failure)
        } else {
            var values = {id:id, name:name, SHAPE_Leng:SHAPE_Leng, SHAPE_Area:SHAPE_Area, house_number:house_number,neighborhood:neighborhood, operator:operator, handicapped:handicapped, condition:condition};
            if (street !== undefined)
                values.street = street;

            var temp_id = values.id;
            db.query('UPDATE places SET ? WHERE id = ?', [values, temp_id], function (err, result) {
                if (err) {
                    console.log('<LOG> - PATCH /admin/dog_parks - ERROR');
                    console.error(err);
                    res.statusCode = 400;
                        res.json(globals.messages.failure)
                } else {
                    console.log('<LOG> - PATCH /admin/dog_parks - SUCCESS');
                    res.json({
                        status: true,
                        places: result
                    })
                }


            })

        }
    }
});
// ADD REQUEST INTEREST POINT
router.post('/interesting_point', function (req, res) {
    console.log('<LOG> - POST /admin/interesting_point - Invoke');

    if (!req.body.user_input) {
        console.log('<LOG> - POST /interesting_point - Wrong Payload Format');
        res.json(globals.messages.failure)
    } else {
        const {
            type,
            name,
            SHAPE_Leng,
            SHAPE_Area,
            street,
            house_number,
            neighborhood,
            operator,
            handicapped,
            condition
        } = req.body.user_input;

        if (name == undefined
            || SHAPE_Leng == undefined
            || SHAPE_Area == undefined
            || house_number == undefined
            || neighborhood == undefined
            || operator == undefined
            || handicapped == undefined
            || condition == undefined)
        {
            console.log('<LOG> - POST /interesting_point - At least 1 field is missing');
            res.statusCode = 400;
            res.json(globals.messages.failure)
        }
        else if (typeof(name) !== 'string'
            || typeof(SHAPE_Leng) !== 'string'
            || typeof(SHAPE_Area) !== 'string'
            || typeof(house_number) !== 'string'
            || typeof(neighborhood) !== 'string'
            || typeof(operator) !== 'string'
            || (typeof(handicapped) !== 'boolean' && typeof(handicapped) !== 'number')
            || typeof(condition) !== 'number')
        {
            console.log('<LOG> - POST /interesting_point - Error with type of at least 1 input field');
            res.statusCode = 400;
            res.json(globals.messages.failure)
        } else {
            var values = {type: type, name:name, SHAPE_Leng:SHAPE_Leng, SHAPE_Area:SHAPE_Area, house_number:house_number,neighborhood:neighborhood, operator:operator, handicapped:handicapped, condition:condition};
            if (street !== undefined)
                values.street = street;

            db.query('INSERT INTO places SET ?', values, function (err, result) {
                if (err) {
                    console.log('<LOG> - POST /admin/interesting_point - ERROR');
                    console.error(err)
                    res.json(globals.messages.failure)
                } else {
                    db.query('SELECT * FROM places WHERE id = (?)', [result.insertId], function (err, result) {
                        if (err) {
                            console.log('<LOG> - POST /admin/interesting_point - ERROR');
                            console.error(err);
                            res.statusCode = 400;
                            res.json(globals.messages.failure)
                        } else {
                            console.log('<LOG> - POST /admin/interesting_point - SUCCESS');
                            res.json({
                                status: true,
                                places: result
                            })
                        }
                    })
                }
            })
        }
    }

});

//GET REQUEST INTEREST POINT
router.get('/interesting_point',function(req,res){
    console.log('<LOG> - GET /interestpoint - Invoke');
    if(req.body.id)
    {
        var temp_id = req.body.id;
        db.query('SELECT * FROM places WHERE id = ? AND type != ? AND deleted = 0',[temp_id,globals.places_types.dog_park],function(err,result){
           if(err){
               console.log('<LOG> - GET /interest point - ERROR');
               console.error(err);
               res.json(globals.messages.failure)
           } else {
               if(result.length>0){
                   console.log('<LOG> - GET /interest point - SUCCESS');
                   res.json({
                       status:true,
                       place: result[0]
                   })
               } else {
                   console.log('<LOG> - GET /interest point - Unauthorized Credentials');
                   res.statusCode = 401;
                   res.json(globals.messages.failure)
               }

           }
        });
    }
    //get all of the interest points
    else {
        db.query('SELECT * FROM places WHERE type != ? AND deleted =0',[globals.places_types.dog_park] , function (err,result) {
            if (err) {
                console.log('<LOG> - GET /interest point - ERROR');
                console.error(err);
                res.json(globals.messages.failure)
            } else {
                if(result.length > 0)
                {
                    console.log('<LOG> - GET /interest point - SUCCESS');
                    res.json({
                        status:true,
                        place: result
                    });
                }
                else{
                    console.log('<LOG> - GET /interest point - Unauthorized Credentials');
                    res.statusCode = 401;
                    res.json(globals.messages.failure)
                }
            }
        })
    }

});
//DELETE REQUEST INTEREST POINT   -> deleted only by ID!!!
router.delete('/interesting_point',function (req,res) {
    if(req.query.id) {
        var temp_id = req.query.id;
        console.log("id = ",temp_id);
        db.query('UPDATE places SET deleted = 1 WHERE deleted = 0 AND id = ?',[temp_id],function (err,result) {
        if(err){
            console.log('<LOG> - DELETE /interest point - ERROR');
            console.error(err);
            res.json(globals.messages.failure)
        } else {
            if (result.affectedRows > 0) {
                res.json({
                    status: true,
                    message: "delete action has been done",
                })
            } else {
                console.log('<LOG> - DELETE /interestpoint - Wrong Parameters');
                res.statusCode = 400;
                res.json(globals.messages.failure);
            }
        }
     })
    }
});
//todo update for interesting points
//UPDATE INTERESTING POINTS REQUEST
router.patch('/interesting_point',function (req,res) {
    console.log('<LOG> - UPDATE /interesting_point - Invoke');
    if (!req.body.user_input) {
        console.log('<LOG> - UPDATE /interesting_point - Wrong Payload Format');
        res.json(globals.messages.failure)
    } else {
        const {
            id,
            name,
            type,
            SHAPE_Leng,
            SHAPE_Area,
            street,
            house_number,
            neighborhood,
            operator,
            handicapped,
            condition
        } = req.body.user_input;

        if (name == undefined
            || SHAPE_Leng == undefined
            || SHAPE_Area == undefined
            || house_number == undefined
            || neighborhood == undefined
            || operator == undefined
            || handicapped == undefined
            || condition == undefined)
        {
            console.log('<LOG> - UPDATE /dog_parks - At least 1 field is missing');
            res.statusCode = 400;
            res.json(globals.messages.failure)
        }
        else if (typeof(name) !== 'string'
            || typeof(SHAPE_Leng) !== 'string'
            || typeof(SHAPE_Area) !== 'string'
            || typeof(house_number) !== 'string'
            || typeof(neighborhood) !== 'string'
            || typeof(operator) !== 'string'
            || (typeof(handicapped) !== 'boolean' && typeof(handicapped) !== 'number')
            || typeof(condition) !== 'number')
        {
            console.log('<LOG> - UPDATE /interesting_point - Error with type of at least 1 input field');
            res.statusCode = 400;
            res.json(globals.messages.failure)
        } else {
            var values = {id:id, name:name, SHAPE_Leng:SHAPE_Leng, SHAPE_Area:SHAPE_Area, house_number:house_number,
                    type:type,neighborhood:neighborhood, operator:operator, handicapped:handicapped, condition:condition};
            if (street !== undefined)
                values.street = street;

            var temp_id = values.id;
            db.query('UPDATE places SET ? WHERE id = ?', [values, temp_id], function (err, result) {
                if (err) {
                    console.log('<LOG> - PATCH /interesting_point - ERROR');
                    console.error(err);
                    res.statusCode = 400;
                    res.json(globals.messages.failure)
                } else {
                    console.log('<LOG> - PATCH /interesting_point - SUCCESS');
                    res.json({
                        status: true,
                        places: result
                    })
                }
            })
        }
    }
});
// export enum PlacesType {
//     Dog_garden = 0,
//     Historic_Parks = 1,
//     Cafewithdog = 2,
//     NationalParks = 3
// }
module.exports = router;