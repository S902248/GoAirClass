const express = require('express');
const router = express.Router();
const { 
    createFlight, 
    getFlights, 
    searchFlights, 
    getFlightById, 
    updateFlight, 
    deleteFlight,
    createFlightSchedule 
} = require('../../controllers/flight/flight.controller');

router.post('/schedules', createFlightSchedule);
router.post('/', createFlight);
router.get('/search', searchFlights);
router.get('/', getFlights);
router.get('/:id', getFlightById);
router.put('/:id', updateFlight);
router.delete('/:id', deleteFlight);

module.exports = router;
