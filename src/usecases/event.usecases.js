const Event = require('../models/event.model');

/**
 * Crea un nuevo evento
 * @param {Object} eventData - Datos del evento a crear
 * @returns {Object} - Evento creado
 */
const create = async (eventData) => {
    const newEvent = new Event(eventData);
    await newEvent.save();
    return newEvent;
};


/**
 * Obtiene un evento por su ID
 * @param {string} id - ID del evento
 * @returns {Object} - Evento encontrado
 */
const getById = async (id) => {
    const event = await Event.findById(id);
    if (!event) throw new Error('Event not found');
    return event;
};

/**
 * Obtiene todos los eventos de un negocio específico
 * @param {string} businessId - ID del negocio
 * @returns {Array} - Lista de eventos del negocio
 */
const getByBusiness = async (businessId) => {
    const events = await Event.find({ businessId });
    return events;
};

/**
 * Actualiza un evento por su ID
 * @param {string} id - ID del evento
 * @param {Object} updateData - Datos a actualizar
 * @returns {Object} - Evento actualizado
 */
const update = async (id, updateData) => {
    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedEvent) throw new Error('Event not found');
    return updatedEvent;
};

/**
 * Elimina un evento por su ID
 * @param {string} id - ID del evento
 */
const deleteById = async (id) => {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) throw new Error('Event not found');
    return deletedEvent;
};

module.exports = { create, getById, getByBusiness, update, deleteById };
