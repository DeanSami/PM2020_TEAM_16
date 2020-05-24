const globals = require('../../globals')
const express = require('express')
const db = require('../../db-connect')
const router = express.Router()

//ADD PARK REQUEST

router.delete('/',function (req,res){
    globals.log_msg('DELETE /user/places - Invoke');
    if(req.query.id && !isNaN(req.query.id)) {
        db.query('UPDATE places SET deleted = 1 WHERE id = ?', [req.query.id],function (err, result) {
            if (err) {
                globals.log_msg('DELETE /user/places - ERROR');
                console.error(err);
                res.status(globals.status_codes.Server_Error).json();
            } if (result.affectedRows > 0) {
                console.log("<LOG> - DELETE /users/places - SUCCESS");
                res.status(globals.status_codes.OK).json()
            } else {
                globals.log_msg('DELETE /users/places - query ERROR');
                res.status(globals.status_codes.Bad_Request).json();
            }

        });
    } else {
        console.error("missing arguments id");
        res.status(globals.status_codes.Bad_Request).json();
    }
});

router.post('/', function (req, res) {
    globals.log_msg('POST /user/places/add - Invoke');

    const {
        name,
        SHAPE_Leng,
        SHAPE_Area,
        street,
        house_number,
        neighborhood,
        operator,
        handicapped,
        condition,
        type
    } = req.body;

    if  (name === undefined ||
        SHAPE_Leng === undefined ||
        SHAPE_Area === undefined ||
        house_number === undefined ||
        neighborhood === undefined ||
        operator === undefined ||
        handicapped === undefined ||
        type === undefined ||
        condition === undefined)
    {
        globals.log_msg('POST /places/add - At least 1 field is missing');
        res.status(globals.status_codes.Bad_Request).json();
        return;
    }
    if (typeof(name) !== 'string' ||
        typeof(SHAPE_Leng) !== 'string' ||
        typeof(SHAPE_Area) !== 'string' ||
        typeof(house_number) !== 'string' ||
        typeof(neighborhood) !== 'string' ||
        typeof(operator) !== 'string' ||
        typeof(type) !== 'number' ||
        (typeof(handicapped) !== 'boolean' && typeof(handicapped) !== 'number') ||
        typeof(condition) !== 'number')
    {
            globals.log_msg('POST /places/add - Error with type of at least 1 input field');
            res.status(globals.status_codes.Bad_Request).json();
            return;
    }
    else {
        let place = {
            type: globals.places_types.dog_park,
            name: name,
            SHAPE_Leng: SHAPE_Leng,
            SHAPE_Area: SHAPE_Area,
            house_number: house_number,
            neighborhood: neighborhood,
            operator: operator,
            handicapped: handicapped,
            condition:condition
        };
        if (street !== undefined) {
            place.street = street;
        } else {
            place.street = '';
        }

        db.query('INSERT INTO places SET ?', place, function (err, inserted_row) {
            if (err) {
                globals.log_msg('POST /user/places/add - ERROR');
                console.error(err)
                res.status(globals.status_codes.Server_Error).json()
            } else {
                globals.log_msg('POST /user/places/add - SUCCESS');
                res.status(globals.status_codes.OK).json()
            }
        });
    }
});

router.patch('/',function (req,res) {
    globals.log_msg('UPDATE /user/places - Invoke');
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
        type
    } = req.body;

    if (name == undefined ||
        SHAPE_Leng == undefined ||
        SHAPE_Area == undefined ||
        street == undefined ||
        house_number == undefined ||
        neighborhood == undefined ||
        operator == undefined ||
        handicapped == undefined ||
        condition == undefined ||
        type == undefined ||
        active == undefined)
    {
        globals.log_msg('UPDATE /user/places - At least 1 field is missing');
        res.status(globals.status_codes.Bad_Request).json()
        return;
    }

     if (typeof(name) !== 'string' ||
         typeof(SHAPE_Leng) !== 'string' ||
         typeof(SHAPE_Area) !== 'string' ||
         typeof(street) !== 'string' ||
         typeof(house_number) !== 'string' ||
         typeof(neighborhood) !== 'string' ||
         typeof(operator) !== 'string' ||
         (typeof(handicapped) !== 'boolean' && typeof(handicapped) !== 'number') ||
         typeof(condition) !== 'number' ||
         typeof(type) !== 'number' ||
         (typeof(active) !== 'boolean' && typeof(active) !== 'number'))
    {
        globals.log_msg('UPDATE /user/places - Error with type of at least 1 input field');
        res.status(globals.status_codes.Bad_Request).json()
        return;
    }

    let place = {
        id: id,
        name: name,
        SHAPE_Leng: SHAPE_Leng,
        SHAPE_Area: SHAPE_Area,
        street: street,
        house_number: house_number,
        neighborhood: neighborhood,
        operator: operator,
        handicapped: handicapped,
        condition: condition,
        type: type,
        active: active
    };

    db.query('UPDATE places SET ? WHERE id = ?', [place, place.id], function (err, update_result) {
        if (err) {
            globals.log_msg('PATCH /user/places - ERROR');
            console.error(err);
            res.status(globals.status_codes.Server_Error).json()
        } else {
            globals.log_msg('PATCH /user/places - SUCCESS');
            res.status(globals.status_codes.OK).json()
        }
    })

});

module.exports = router;
