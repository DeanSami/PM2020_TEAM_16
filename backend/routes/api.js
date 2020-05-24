const express = require('express');
const db = require('../db-connect');
const globals = require('../globals');
const router = express.Router();

const Admin = require('./Admin/Admin')
const Users = require('./User/Users')

router.use('/admin', Admin);
router.use('/user', Users);

router.get('/places' , function(req, res) {
    globals.log_msg('GET /places - Invoke');
    //if the clint want specific park dog
    if (req.body.id && !isNaN(req.body.id)) {
        let temp_id = req.body.id;
        db.query('SELECT * FROM places WHERE id = ?', [temp_id], function (err, return_row) {
            if (err) {
                globals.log_msg('GET /places/get - ERROR');
                console.error(err);
                res.status(globals.status_codes.Server_Error).json();
            } else {
                fillImages(return_row);
                globals.log_msg('GET /places/get - SUCCESS');
                res.status(globals.status_codes.OK).json(return_row)
            }
        })
    } else {
        let query = '';
        let query_array = [];
        if (req.body.type && !isNaN(req.body.type)) {
            query = 'AND type = ?'
            query_array.push(req.body.type);
        }
        db.query('SELECT * FROM places WHERE deleted = 0 ' + query, query_array, function (err, result) {
            if (err) {
                globals.log_msg('GET /places/get - ERROR');
                console.error(err);
                res.status(globals.status_codes.Server_Error).json();
            } else {
                fillImages(result);
                globals.log_msg('GET /places/get - SUCCESS');
                res.status(globals.status_codes.OK).json(result)
            }
        })
    }
});

router.get('/games' , function(req, res) {
    globals.log_msg('GET /games - Invoke');
    //if the clint want specific park dog
    if (req.query.id) { // get 1 game with id = req.query.id
        let id = req.query.id;
        db.query('SELECT * FROM games WHERE id = ? AND deleted = 0', [id], function (err, result) {
            if (err) {
                globals.log_msg('GET /games - id provided - ERROR');
                console.error(err);
                res.status(globals.status_codes.Server_Error).json();
            } else {
                if (result && result.length > 0) {
                    let game = result[0];
                    db.query('SELECT * FROM game_steps WHERE game_id = ?', [game.id], function (err, result) {
                        if (err) {
                            globals.log_msg('GET /games - game steps with id provided - ERROR');
                            console.error(err);
                            res.status(globals.status_codes.Server_Error).json();
                        } else {
                            game.steps = result;
                            db.query('SELECT name FROM users WHERE id = ?', [req.user_session.id], function(err, select_result) {
                                if (err) {
                                    globals.log_msg('GET /games - game steps with id provided - ERROR');
                                    console.error(err);
                                    res.status(globals.status_codes.Server_Error).json();
                                }
                                else {
                                    globals.log_msg('GET /games - id provided - SUCCESS');
                                    console.log(select_result);
                                    game.owner_name = select_result;
                                    res.status(globals.status_codes.OK).json(game);
                                }
                            });
                        }
                    });
                } else {
                    console.log('error to find game');
                    res.status(globals.status_codes.Server_Error).json();
                }
            }
        })
    } else { // get all games
        db.query('SELECT * FROM games WHERE deleted = 0',[], function (err, games_result) {
            if (err) {
                globals.log_msg('GET /games - no id was provided - ERROR');
                console.error(err);
                res.status(globals.status_codes.Server_Error).json();
            } else {
                let games = JSON.parse(JSON.stringify(games_result));
                if (Array.isArray(games) && games.length === 0) {
                    globals.log_msg('GET /games - SUCCESS');
                    res.status(globals.status_codes.OK).json(games)
                } else {
                    let query = `SELECT * FROM game_steps WHERE game_id = ?;`.repeat(games.length).slice(0, -1);
                    let ids = []
                    for (game of games)  {
                        ids.push(game.id);
                    }
                    
                    db.query(query, ids, function (err, steps_result) {
                        if (err) {
                            globals.log_msg('GET /games - owner id provided, steps - ERROR');
                            console.error(err);
                            res.status(globals.status_codes.Server_Error).json();
                        } else {
                            if (Array.isArray(steps_result) && steps_result.length >= 0 && !Array.isArray(steps_result[0])) {
                                games[0].steps = steps_result;
                                db.query('SELECT name FROM users WHERE id = ?', [games[0].owner_id], function(err, select_result) {
                                    if (err) {
                                        globals.log_msg('GET /games - game steps with id provided - ERROR');
                                        console.error(err);
                                        res.status(globals.status_codes.Server_Error).json();
                                    }
                                    else {
                                        globals.log_msg('GET /games - id provided - SUCCESS');
                                        game.owner_name = select_result.name;
                                        res.status(globals.status_codes.OK).json(game);
                                    }
                                });
                            } else {
                                for (let i = 0; i < games.length; i++) games[i].steps = steps_result[i];
                                let query = `SELECT name FROM users WHERE id = ?;`.repeat(games.length).slice(0, -1);
                                let ids = []
                                for (game of games)  {
                                    ids.push(game.owner_id);
                                }
                                
                                db.query(query, ids, function (err, names) {
                                    if (err) {
                                        globals.log_msg('GET /games - game steps with id provided - ERROR');
                                        console.error(err);
                                        res.status(globals.status_codes.Server_Error).json();
                                    } else {
                                        globals.log_msg('GET /games - SUCCESS');
                                        let format_names = JSON.parse(JSON.stringify(names));
                                        for (let i = 0; i < format_names.length; i++) games[i].owner_name = format_names[i][0].name;
                                        res.status(globals.status_codes.OK).json(games);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }
});


router.get('/business' , function(req, res) {
    globals.log_msg('GET /business - Invoke');
    if (req.body.id && !isNaN(req.body.id)) {
        let temp_id = req.body.id;
        db.query('SELECT * FROM businesses WHERE id = ?', [temp_id], function (err, return_row) {
            if (err) {
                globals.log_msg('GET /business - ERROR');
                console.error(err);
                res.status(globals.status_codes.Server_Error).json();
            } else {
                globals.log_msg('GET /business - SUCCESS');
                res.status(globals.status_codes.OK).json(return_row)
            }
        })
    } else {
        db.query('SELECT * FROM businesses', [], function (err, result) {
            if (err) {
                globals.log_msg('GET /business - ERROR');
                console.error(err);
                res.status(globals.status_codes.Server_Error).json();
            } else {
                globals.log_msg('GET /business - SUCCESS');
                res.status(globals.status_codes.OK).json(result)
            }
        })
    }
});



function fillImages(places) {
    if(places && places.length > 0) {
        places.forEach(place => {
            if (place.icon === '') {
                place.icon = 'https://s3-eu-west-1.amazonaws.com/files.doggiehunt/places/icon-default.png';
            } else {
                place.icon = 'https://s3-eu-west-1.amazonaws.com/files.doggiehunt/places/' + place.icon;
            }
            if (place.image === '') {
                place.image = 'https://s3-eu-west-1.amazonaws.com/files.doggiehunt/places/image-default.jpg';
            } else {
                place.image = 'https://s3-eu-west-1.amazonaws.com/files.doggiehunt/places/' + place.image;
            }
        });
    }
}

module.exports = router;