const globals = require('../../globals')
const express = require('express')
const db = require('../../db-connect')
const router = express.Router()

//GET Games
router.get('/' , function(req, res) {
    console.log('<LOG> - GET /user/games/get - Invoke');
    //if the clint want specific park dog
    if (req.body.id) {
        let id = req.body.id;
        db.query('SELECT * FROM games WHERE id = ? AND deleted = 0', [id], function (err, result) {
            if (err) {
                console.log('<LOG> - GET /user/games/get - ERROR');
                console.error(err);
                res.status(globals.status_codes.Server_Error).json();
            } else {
                if (result && result.length > 0) {
                    let game = result[0];
                    console.log(game);
                    db.query('SELECT * FROM game_steps WHERE game_id = ?', [game.id], function (err, result) {
                        if (err) {
                            console.log('<LOG> - GET /user/games/get - ERROR');
                            console.error(err);
                            res.status(globals.status_codes.Server_Error).json();
                        } else {
                            game.steps = result;
                            console.log('<LOG> - GET /user/games/get - SUCCESS');
                            res.status(globals.status_codes.OK).json(game)
                        }
                    });
                } else {
                    console.log('error to find game');
                    res.status(globals.status_codes.Server_Error).json();
                }
            }
        })
    } else {
        db.query('SELECT * FROM games WHERE deleted = 0',[], function (err, result) {
            if (err) {
                console.log('<LOG> - GET /user/games/get - ERROR');
                console.error(err);
                res.status(globals.status_codes.Server_Error).json();
            } else {
                console.log('<LOG> - GET /user/games/get - SUCCESS');
                res.status(globals.status_codes.OK).json(result)
            }
        })
    }
});

router.post('/create', function (req, res) {
    console.log('<LOG> - POST /user/places/add - Invoke');

    const {
        owner_id,
        name,
        start,
        end,
        start_location,
        finish_location,
        steps
    } = req.body;

    if (!name || !owner_id || !start || !end || !start_location || !finish_location || !steps) {
            console.log('<LOG> - POST /games/create - At least 1 field is missing');
            res.status(globals.status_codes.Bad_Request).json({message: 'missing argument'});
            return;
    }
    if (typeof owner_id !== 'number' ||
        typeof name !== 'string' ||
        typeof start !== 'string' ||
        typeof end !== 'string' ||
        typeof start_location !== 'number' ||
        typeof finish_location !== 'number') {
            console.log('<LOG> - POST /games/create - Error with type of at least 1 input field');
            res.status(globals.status_codes.Bad_Request).json({message: 'type error in game field'});
            return;
    }
    if (steps && Array.isArray(steps)) {
        let error = false;
        let messageError = '';
        steps.forEach(step => {
            if (!step.name || !step.secret_key || !step.start_location || !step.finish_location || !step.step_num) {
                error = true;
                messageError = 'missing argument'
            } else {
                if (typeof step.name !== 'string' || typeof step.secret_key !== 'string' ||
                    typeof step.start_location !== 'number' || typeof  step.finish_location !== 'number') {
                    error = true;
                    messageError = 'type error in game step'
                }
            }
            step.description = step.description ? step.description : '';
        });
        if (error) {
            console.log('<LOG> - POST /games/create - Error with game step');
            res.status(globals.status_codes.Bad_Request).json({message: messageError});
            return;
        }
    } else {
        console.log('<LOG> - POST /games/create - Error with game steps');
        res.status(globals.status_codes.Bad_Request).json();
        return;
    }

    /* check for existing owner user */
    db.query('SELECT * FROM users WHERE id = ? AND user_type = ?', [owner_id, 2], function (err, result) {
        console.log('test result user : ', result);
        if (err || !result || !result.length && false) {
            console.log('<LOG> - POST /games/create - ERROR in search owner');
            console.error(err)
            res.status(globals.status_codes.Server_Error).json({message: 'can not find owner by owner_id'});
            return;
        }
        let game = {
            owner_id,
            name,
            start,
            end,
            start_location,
            finish_location,
            deleted: 0
        };

        /* Begin transaction */
        db.beginTransaction(function(err) {
            if (err) {
                console.log('<LOG> - POST /games/create - ERROR create transaction');
                console.error(err)
                res.status(globals.status_codes.Server_Error).json();
                return;
            }

            db.query('INSERT INTO games SET ?', game, function (err, result) {
                if (err) {
                    console.log('<LOG> - POST /games/create - ERROR insert game');
                    console.error(err)
                    res.status(globals.status_codes.Server_Error).json();
                    return;
                }

                // db.rollback(err => {
                //     console.log('rollback error', err);
                //
                // });
                // res.status(globals.status_codes.Server_Error).json({a: 'test'});
                // return;

                let insertSteps = [];

                steps.forEach(step => {
                    insertSteps.push([
                        result.insertId,
                        step.step_num,
                        step.name,
                        step.secret_key,
                        step.start_location,
                        step.finish_location,
                        step.description
                    ]);
                });

                if (insertSteps.length > 0) {
                    let sql = "INSERT INTO game_steps " +
                        "(game_id, step_num, name, secret_key, start_location, finish_location, description) VALUES ?";

                    db.query(sql, [insertSteps], function(err) {
                        if (err) {
                            console.log('<LOG> - POST /games/create - ERROR insert steps');
                            console.error(err)
                            db.rollback(function() {
                                console.log('rollback error', err);

                            });
                            res.status(globals.status_codes.Server_Error).json();
                            return;
                        } else {
                            db.commit(function(err) {
                                if (err) {
                                    db.rollback(function() {
                                        throw err;
                                    });
                                }
                                res.status(globals.status_codes.OK).json();
                                console.log('Transaction Complete.');
                            });
                        }
                    });
                } else {

                }
            });
        });
        /* End transaction */

    });

});


module.exports = router;
