const globals = require('../../globals')
const express = require('express')
const db = require('../../db-connect')
const router = express.Router()

//ADD PARK REQUEST
router.post('/', function (req, res) {
    console.log('<LOG> - POST /admin/dog_parks/add - Invoke');

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
        } = req.body;

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
            res.status(globals.status_codes.Bad_Request).json()
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
            res.status(globals.status_codes.Bad_Request).json()
        } else {
            var values = {type: globals.places_types.dog_park, name:name, SHAPE_Leng:SHAPE_Leng, SHAPE_Area:SHAPE_Area, house_number:house_number,neighborhood:neighborhood, operator:operator, handicapped:handicapped, condition:condition};
            if (street !== undefined)
                values.street = street;

            db.query('INSERT INTO places SET ?', values, function (err, insert_dog_park_result) {
                if (err) {
                    console.log('<LOG> - POST /admin/dog_parks/add - ERROR');
                    console.error(err)
                    res.status(globals.status_codes.Server_Error).json()
                } else {
                    db.query('SELECT * FROM places WHERE id = (?)', [insert_dog_park_result.insertId], function (err, select_dog_park_result) {
                        if (err) {
                            console.log('<LOG> - POST /admin/dog_parks/add - ERROR');
                            console.error(err);
                            res.status(globals.status_codes.Server_Error).json()
                        } else {
                            console.log('<LOG> - POST /admin/dog_parks/add - SUCCESS');
                            res.status(globals.status_codes.OK).json(select_dog_park_result[0])
                        }
                    })
                }
            })
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
                res.status(globals.status_codes.Server_Error).json();
            } else {
                console.log('<LOG> - GET /admin/dog_parks/get - SUCCESS');
                res.status(globals.status_codes.OK).json(result)
                }
            })
        }
        //if the clint want all the park dog that at the db
        else {
            db.query('SELECT * FROM places WHERE deleted = 0 AND type = ?',[globals.places_types.dog_park], function (err, result) {
                if (err) {
                    console.log('<LOG> - GET /admin/dog_parks/get - ERROR');
                    console.error(err);
                    res.status(globals.status_codes.Server_Error).json();
                } else {
                    console.log('<LOG> - GET /admin/dog_parks/get - SUCCESS');
                    res.status(globals.status_codes.OK).json(result)
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
                res.status(globals.status_codes.Server_Error).json();
            } if (result.affectedRows > 0) {
                console.log("<LOG> - DELETE /PARK DOG - SUCCESS");
                res.status(globals.status_codes.OK).json()
            } else {
                console.log('<LOG> - DELETE /PARK DOG - Wrong Parameters');
                res.status(globals.status_codes.Bad_Request).json();
            }

        });
    }
    else{
        console.error("not ID has been send");
        res.status(globals.status_codes.Bad_Request).json();
    }
});
//UPDATE PARK DOG REQUEST
router.patch('/',function (req,res) {
    console.log('<LOG> - UPDATE /dog_parks - Invoke');
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
            condition,
            active,
            icon,
            image
        } = req.body;

        if (name == undefined
            || SHAPE_Leng == undefined
            || SHAPE_Area == undefined
            || house_number == undefined
            || neighborhood == undefined
            || operator == undefined
            || handicapped == undefined
            || condition == undefined
            || icon == undefined
            || image == undefined
            || active == undefined)
        {
            console.log('<LOG> - UPDATE /dog_parks - At least 1 field is missing');
            res.status(globals.status_codes.Bad_Request).json()
        }
        else if (typeof(name) !== 'string'
            || typeof(SHAPE_Leng) !== 'string'
            || typeof(SHAPE_Area) !== 'string'
            || typeof(house_number) !== 'string'
            || typeof(neighborhood) !== 'string'
            || typeof(operator) !== 'string'
            || typeof(icon) !== 'string'
            || typeof(image) !== 'string'
            || (typeof(handicapped) !== 'boolean' && typeof(handicapped) !== 'number')
            || typeof(condition) !== 'number'
            || (typeof(active) !== 'boolean' && typeof(active) !== 'number'))
        {
            console.log('<LOG> - UPDATE /dog_parks - Error with type of at least 1 input field');
            res.status(globals.status_codes.Bad_Request).json()
        } else {
            var values = {id:id, name:name, SHAPE_Leng:SHAPE_Leng, SHAPE_Area:SHAPE_Area, house_number:house_number,neighborhood:neighborhood, operator:operator, handicapped:handicapped, condition:condition, icon:icon, image:image, active:active};
            if (street !== undefined)
                values.street = street;

            var temp_id = values.id;
            db.query('UPDATE places SET ? WHERE id = ?', [values, temp_id], function (err, update_result) {
                if (err) {
                    console.log('<LOG> - PATCH /admin/dog_parks - ERROR');
                    console.error(err);
                    res.status(globals.status_codes.Server_Error).json()
                } else {
                    db.query('SELECT * FROM places WHERE id = ?', [temp_id], function (err, select_result) {
                        if (err) {
                            console.log('<LOG> - PATCH /admin/dog_parks - ERROR');
                    console.error(err);
                    res.status(globals.status_codes.Server_Error).json()
                        }
                        console.log('<LOG> - PATCH /admin/dog_parks - SUCCESS');
                        res.status(globals.status_codes.OK).json(select_result[0])
                    })
                }


            })

        }
});

module.exports = router;
