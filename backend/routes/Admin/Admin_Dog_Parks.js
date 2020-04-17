const globals = require('../../globals')
const express = require('express')
const db = require('../../db-connect')
const router = express.Router()

router.use(globals.log_func);

//ADD PARK REQUEST
router.post('/', function (req, res) {
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
router.get('/' , function(req, res) {
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
router.delete('/',function (req,res) {
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
router.patch('/',function (req,res) {
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

module.exports = router;