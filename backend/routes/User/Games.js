const globals = require('../../globals')
const express = require('express')
const db = require('../../db-connect')
const router = express.Router()

router.get('/startgame/:game_id', function(req, res) {
    globals.log_msg('GET /user/games/startgame');
    db.query('SELECT * FROM games WHERE id = ?', [req.params.id], function(err, games) {
        if (err || games.length == 0) {
            globals.log_msg('GET /user/games/startgame/:id - ERROR');
            console.error(err);
            res.status(globals.status_codes.Server_Error).json();
        }
        let info = {
            game_id: req.params.game_id,
            user_id: req.user_session.id,
            step_id: games[0].start_location
        }
        db.query('INSERT INTO active_players SET ?', info, function(err, insert_res) {
            if (err) {
                globals.log_msg('GET /user/games/startgame/:id - ERROR');
                console.error(err);
                res.status(globals.status_codes.Server_Error).json();
            }
            res.status(globals.status_codes.OK).json();
        })
    });
});

router.patch('/endgame/:game_id', function (req, res) {
    globals.log_msg('PATCH /user/games/endgame/:id');
    db.query('UPDATE active_players SET finish_at = NOW() WHERE user_id = ? AND game_id = ?', [req.user_session.id, req.params.game_id], function(err, games) {
        if (err) {
            globals.log_msg('PATCH /user/games/endgame/:id - ERROR');
            console.error(err);
            res.status(globals.status_codes.Server_Error).json();
        }
        res.status(globals.status_codes.OK).json();
    })
});

//REQUEST to get Game list per user
router.get('/mygames' , function(req, res) {
    globals.log_msg('GET /user/myGames/get - Invoke');
    if (req.user_session.id !== req.body.id && !isNaN(req.body.id)) {
        globals.log_msg('POST /user/mygames - Unauthorized Access Attempt');
        res.status(globals.status_codes.Unauthorized).json();
    }
        db.query(`SELECT games.*, active_players.*, game_steps.*
        FROM users, games, active_players, game_steps WHERE users.id = ? AND 
        games.id = active_players.game_id AND 
        active_players.user_id = users.id AND
        game_steps.id = active_players.step_id`, [req.user_session.id], function (err, result) {
            if (err) {
                globals.log_msg('GET /user/myGames/get - ERROR');
                console.error(err);
                res.status(globals.status_codes.Server_Error).json();
            } else {
                globals.log_msg('GET /user/games/get - SUCCESS');
                res.status(globals.status_codes.OK).json(result)
            }
        })
});

// router.patch('/myGames', function (req,res) {
//     globals.log_msg('GET /user/myGames/patch - Invoke');
//     if(req.body.user_id && req.body.game_id)
//     {
//         let user_id = req.body.user_id;
//         let game_id = req.body.game_id;
//         let now_date = Date.now();
//         db.query('UPDATE active_players SET finish_at = ? WHERE user_id = ? AND game_id = ?', [now_date,user_id,game_id],function (err,result) {
//             if (err) {
//                 globals.log_msg('GET /user/myGames/patch - ERROR');
//                 console.error(err);
//                 res.status(globals.status_codes.Server_Error).json();
//         }else{
//                 globals.log_msg('GET /user/games/patch - SUCCESS');
//                 res.status(globals.status_codes.OK).json(result)
//             }
//         })
//     } else {
//         globals.log_msg('GET /user/myGames/patch - missing arguments');
//         res.status(globals.status_codes.Server_Error).json({message: 'missing arguments'});
//     }
// });

router.post('/create', function (req, res) {
    globals.log_msg('POST /user/games/add - Invoke');
    
    let checkDataResult = checkData(req.body);
    if (checkDataResult && checkDataResult.status) {
        res.status(checkDataResult.status).json({message: checkDataResult.message});
    }
    
    /* check for existing owner user */
    db.query('SELECT * FROM users WHERE id = ? AND user_type = ?', [req.body.owner_id, 2], function (err, result) {
        if (err || !result || !result.length) {
            globals.log_msg('POST /games/create - ERROR in search owner');
            console.error(err)
            res.status(globals.status_codes.Server_Error).json({message: 'can not find owner by owner_id'});
            return;
        }
        let game = {
            owner_id: req.body.owner_id,
            name: req.body.name,
            start: req.body.start,
            end: req.body.end,
            start_location: req.body.start_location,
            finish_location: req.body.finish_location,
            deleted: 0
        };
        
        /* Begin transaction */
        db.beginTransaction(function(err) {
            if (err) {
                globals.log_msg('POST /games/create - ERROR create transaction');
                console.error(err)
                res.status(globals.status_codes.Server_Error).json();
                return;
            }
            
            db.query('INSERT INTO games SET ?', game, function (err, result) {
                if (err) {
                    globals.log_msg('POST /games/create - ERROR insert game');
                    console.error(err)
                    res.status(globals.status_codes.Server_Error).json();
                    return;
                }
                let insertSteps = [];
                
                req.body.steps.forEach(step => {
                    insertSteps.push([
                        result.insertId,
                        step.step_num,
                        step.name,
                        step.secret_key,
                        step.start_location,
                        step.finish_location,
                        step.description ? step.description : ''
                    ]);
                });
                
                if (insertSteps.length > 0) {
                    let sql = "INSERT INTO game_steps " +
                    "(game_id, step_num, name, secret_key, start_location, finish_location, description) VALUES ?";
                    
                    db.query(sql, [insertSteps], function(err, insertion_res) {
                        if (err) {
                            globals.log_msg('POST /games/create - ERROR insert steps');
                            console.error(err)
                            db.rollback(function() {
                                console.log('rollback error', err);
                                
                            });
                            res.status(globals.status_codes.Server_Error).json();
                        } else {
                            db.commit(function(err, commit_res) {
                                if (err) {
                                    db.rollback(function() {
                                        throw err;
                                    });
                                }
                                res.status(globals.status_codes.OK).json({id: insertion_res.insertId});
                                globals.log_msg('Transaction Complete.');
                            });
                        }
                    });
                } else {
                    db.commit(function(err) {
                        if (err) {
                            db.rollback(function() {
                                throw err;
                            });
                        }
                        res.status(globals.status_codes.OK).json();
                        globals.log_msg('Transaction Complete.');
                    });
                }
            });
        });
        /* End transaction */
    });
});

router.patch('/edit', function (req, res) {
    globals.log_msg('POST /user/games/update - Invoke');
    if (!req.body.id) {
        res.status(globals.status_codes.Bad_Request).json({message: 'missing argument id'});
        return;
    }
    req.body.steps = []; //todo remove this
    let checkDataResult = checkData(req.body);
    if (checkDataResult && checkDataResult.status) {
        res.status(checkDataResult.status).json({message: checkDataResult.message});
        return;
    }
    
    /* check for existing owner user */
    db.query('SELECT * FROM users WHERE id = ? AND user_type = ?', [req.body.owner_id, globals.user_types.businessOwner], function (err, result) {
        if (err || !result || !result.length) {
            globals.log_msg('POST /games/create - ERROR in search owner');
            console.error(err)
            res.status(globals.status_codes.Server_Error).json({message: 'can not find owner by owner_id'});
            return;
        }
        let game = {
            owner_id: req.body.owner_id,
            name: req.body.name,
            start: req.body.start,
            end: req.body.end,
            start_location: req.body.start_location,
            finish_location: req.body.finish_location,
            deleted: 0
        };
        
        db.query('UPDATE games SET ? WHERE id = ?', [game, req.body.id], function (err, update_result) {
            if (err) {
                globals.log_msg('POST /games/create - ERROR insert game');
                console.error(err)
                res.status(globals.status_codes.Server_Error).json();
            } else {
                db.query('SELECT * FROM games WHERE id = ?', [req.body.id], function(err, select_result) {
                    if (err) {
                        globals.log_msg('POST /games/create - ERROR insert game');
                        console.error(err)
                        res.status(globals.status_codes.Server_Error).json();
                    }
                    res.status(globals.status_codes.OK).json(select_result[0]);
                    //todo update steps
                });
            }
        });
    });
});

router.get('/subscribed', function (req, res) {
    globals.log_msg('POST /user/games/subscribed - Invoke');
    if (req.body.game_id && !isNaN(req.body.game_id)) {
        db.query('SELECT * FROM games WHERE id = ? AND owner_id = ?', [req.body.game_id, req.body.owner_id], function (err, result) {
            if (err) {
                globals.log_msg('GET /user/games/played - ERROR');
                console.error(err);
                res.status(globals.status_codes.Server_Error).json()
            } else {
                if (result && result.length == 0)
                res.status(globals.status_codes.Unauthorized).json();
            }
        });
    } else {
        res.status(globals.status_codes.Unauthorized).json();
    }
    db.query('SELECT * FROM active_players, users WHERE users.id = active_players.user_id AND game_id = ?', [req.body.game_id], function (err, result) {
        if (err) {
            globals.log_msg('POST /games//played - ERROR find players');
            console.error(err)
            res.status(globals.status_codes.Bad_Request).json({message: 'cannot find players by game_id'});
            return;
        }
        if (result && result.length) {
            result.forEach(player => {
                delete player.password;
                delete player.user_type;
                delete player.hobbies;
                delete player.deleted;
            });
        }
        globals.log_msg('GET /user/games/played - SUCCESS');
        res.status(globals.status_codes.OK).json(result)
    });
});

function checkData(data) {
    const {
        owner_id,
        name,
        start,
        end,
        start_location,
        finish_location,
        steps
    } = data;
    
    if (!name || !owner_id || !start || !end || !start_location || !finish_location) {
        globals.log_msg('POST /games/create - At least 1 field is missing');
        return {status: globals.status_codes.Bad_Request, message: 'missing argument'};
    }
    if (typeof owner_id !== 'number' ||
    typeof name !== 'string' ||
    typeof start !== 'string' ||
    typeof end !== 'string' ||
    typeof start_location !== 'number' ||
    typeof finish_location !== 'number') {
        globals.log_msg('POST /games/create - Error with type of at least 1 input field');
        return {status: globals.status_codes.Bad_Request, message: 'type error in game field'};
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
        });
        if (error) {
            globals.log_msg('POST /games/create - Error with game step');
            return {status: globals.status_codes.Bad_Request, message: messageError};
        }
        return {};
    } else {
        if (!steps) {
            return {};
        }
        globals.log_msg('POST /games/create - Error with game steps');
        return {status: globals.status_codes.Bad_Request, message: 'error with game steps'};
    }
    return;
}


module.exports = router;
