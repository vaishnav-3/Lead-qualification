const express = require('express');
const router = express.Router();

// Import controllers
const offerController = require('../controllers/offer.controller');
const leadController = require('../controllers/lead.controller');
const scoreController = require('../controllers/score.controller');

// Offer routes
router.post('/offer', offerController.createOffer);
router.get('/offer', offerController.getOffer);

// Lead routes
router.post('/leads/upload', leadController.uploadLeads);
router.get('/leads', leadController.getLeads);

// Scoring routes
router.post('/score', scoreController.scoreLeads);
router.get('/results', scoreController.getResults);
router.get('/export', scoreController.exportResults);

module.exports = router;