const express = require('express');
const globals = require('../../globals');
const db = require('../../db-connect');

const router = express.Router();

// ADD PARK REQUEST
router.post('/', (req, res) => {
  globals.log_msg('POST /admin/dog_parks/add - Invoke');

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
  } = req.body;

  if (name == undefined
            || SHAPE_Leng == undefined
            || SHAPE_Area == undefined
            || house_number == undefined
            || neighborhood == undefined
            || operator == undefined
            || handicapped == undefined
            || condition == undefined) {
    globals.log_msg('POST /dog_parks/add - At least 1 field is missing');
    res.status(globals.status_codes.Bad_Request).json();
  } else if (typeof (name) !== 'string'
            || typeof (SHAPE_Leng) !== 'string'
            || typeof (SHAPE_Area) !== 'string'
            || typeof (house_number) !== 'string'
            || typeof (neighborhood) !== 'string'
            || typeof (operator) !== 'string'
            || (typeof (handicapped) !== 'boolean' && typeof (handicapped) !== 'number')
            || typeof (condition) !== 'number') {
    globals.log_msg('POST /dog_parks/add - Error with type of at least 1 input field');
    res.status(globals.status_codes.Bad_Request).json();
  } else {
    const values = {
      type: globals.places_types.dog_park, name, SHAPE_Leng, SHAPE_Area, house_number, neighborhood, operator, handicapped, condition,
    };
    if (street !== undefined) { values.street = street; }

    db.query('INSERT INTO places SET ?', values, (err, insert_dog_park_result) => {
      if (err) {
        globals.log_msg('POST /admin/dog_parks/add - ERROR');
        console.error(err);
        res.status(globals.status_codes.Server_Error).json();
      } else {
        db.query('SELECT * FROM places WHERE id = (?)', [insert_dog_park_result.insertId], (err, select_dog_park_result) => {
          if (err) {
            globals.log_msg('POST /admin/dog_parks/add - ERROR');
            console.error(err);
            res.status(globals.status_codes.Server_Error).json();
          } else {
            globals.log_msg('POST /admin/dog_parks/add - SUCCESS');
            res.status(globals.status_codes.OK).json(select_dog_park_result[0]);
          }
        });
      }
    });
  }
});
// GET PARK REQUEST -> based on id that comes from body request
router.get('/', (req, res) => {
  globals.log_msg('GET /admin/dog_parks/get - Invoke');
  // if the clint want specific park dog
  if (req.body.id) {
    const temp_id = req.body.id;
    db.query('SELECT * FROM places WHERE id = ? AND type = ?', [temp_id, globals.places_types.dog_park], (err, result) => {
      if (err) {
        globals.log_msg('GET /admin/dog_parks/get - ERROR');
        console.error(err);
        res.status(globals.status_codes.Server_Error).json();
      } else {
        globals.log_msg('GET /admin/dog_parks/get - SUCCESS');
        res.status(globals.status_codes.OK).json(result);
      }
    });
  }
  // if the clint want all the park dog that at the db
  else {
    db.query('SELECT * FROM places WHERE deleted = 0 AND type = ?', [globals.places_types.dog_park], (err, result) => {
      if (err) {
        globals.log_msg('GET /admin/dog_parks/get - ERROR');
        console.error(err);
        res.status(globals.status_codes.Server_Error).json();
      } else {
        globals.log_msg('GET /admin/dog_parks/get - SUCCESS');
        res.status(globals.status_codes.OK).json(result);
      }
    });
  }
});
// DELETE PARK REQUEST
router.delete('/', (req, res) => {
  globals.log_msg('DELETE /PARK DOG - Invoke');
  if (req.query.id) {
    const temp_id = req.query.id;
    db.query('UPDATE places SET deleted = 1 WHERE id = ? AND deleted = 0 ', [temp_id], (err, result) => {
      if (err) {
        globals.log_msg('DELETE /PARK DOG - ERROR');
        console.error(err);
        res.status(globals.status_codes.Server_Error).json();
      } if (result.affectedRows > 0) {
        console.log('<LOG> - DELETE /PARK DOG - SUCCESS');
        res.status(globals.status_codes.OK).json();
      } else {
        globals.log_msg('DELETE /PARK DOG - Wrong Parameters');
        res.status(globals.status_codes.Bad_Request).json();
      }
    });
  } else {
    console.error('not ID has been send');
    res.status(globals.status_codes.Bad_Request).json();
  }
});
// UPDATE PARK DOG REQUEST
router.patch('/', (req, res) => {
  globals.log_msg('UPDATE /dog_parks - Invoke');
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
    image,
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
            || active == undefined) {
    globals.log_msg('UPDATE /dog_parks - At least 1 field is missing');
    res.status(globals.status_codes.Bad_Request).json();
  } else if (typeof (name) !== 'string'
            || typeof (SHAPE_Leng) !== 'string'
            || typeof (SHAPE_Area) !== 'string'
            || typeof (house_number) !== 'string'
            || typeof (neighborhood) !== 'string'
            || typeof (operator) !== 'string'
            || typeof (icon) !== 'string'
            || typeof (image) !== 'string'
            || (typeof (handicapped) !== 'boolean' && typeof (handicapped) !== 'number')
            || typeof (condition) !== 'number'
            || (typeof (active) !== 'boolean' && typeof (active) !== 'number')) {
    globals.log_msg('UPDATE /dog_parks - Error with type of at least 1 input field');
    res.status(globals.status_codes.Bad_Request).json();
  } else {
    const values = {
      id, name, SHAPE_Leng, SHAPE_Area, house_number, neighborhood, operator, handicapped, condition, icon, image, active,
    };
    if (street !== undefined) { values.street = street; }

    const temp_id = values.id;
    db.query('UPDATE places SET ? WHERE id = ?', [values, temp_id], (err, update_result) => {
      if (err) {
        globals.log_msg('PATCH /admin/dog_parks - ERROR');
        console.error(err);
        res.status(globals.status_codes.Server_Error).json();
      } else {
        db.query('SELECT * FROM places WHERE id = ?', [temp_id], (err, select_result) => {
          if (err) {
            globals.log_msg('PATCH /admin/dog_parks - ERROR');
            console.error(err);
            res.status(globals.status_codes.Server_Error).json();
          }
          globals.log_msg('PATCH /admin/dog_parks - SUCCESS');
          res.status(globals.status_codes.OK).json(select_result[0]);
        });
      }
    });
  }
});

module.exports = router;
