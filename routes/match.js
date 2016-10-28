var express = require('express');
var router = express.Router();

// controller
var capi = require('../controllers/common.js');
var ctrl = require('../controllers/match.js');

router.post('/kind',
    ctrl.kind.Create
);

router.get('/kind',
    ctrl.kind.List
);

router.put('/kind/:id',
    ctrl.kind.Update
);

router.delete('/kind/:id',
    ctrl.kind.Delete
);

router.post('/league',
    ctrl.league.Create
);

router.get('/league',
    ctrl.league.List
);

router.put('/league/:id',
    ctrl.league.Update
);

router.delete('/league/:id',
    ctrl.league.Delete
);

module.exports = router;
