const eventUsecase = require('../usecases/event.usecases');

const createEvent = async (req, res) => {
    try {
        const newEvent = await eventUsecase.create(req.body);
        res.status(201).json({ success: true, data: newEvent });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getEventsByBusiness = async (req, res) => {
    try {
        const events = await eventUsecase.getByBusiness(req.params.businessId);
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getEventById = async (req, res) => {
    try {
        const event = await eventUsecase.getById(req.params.id);
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};

const updateEvent = async (req, res) => {
    try {
        const updatedEvent = await eventUsecase.update(req.params.id, req.body);
        res.status(200).json({ success: true, data: updatedEvent });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        await eventUsecase.deleteById(req.params.id);
        res.status(200).json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};

module.exports = { createEvent, getEventsByBusiness, getEventById, updateEvent, deleteEvent };
