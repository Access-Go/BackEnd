const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    page: { type: String, required: true },
    companyId: { type: String, required: true },
    visits: { type: Number, default: 0 },
    visitDates: [{ date: { type: Date, default: Date.now } }] // Almacena las fechas de las visitas
});

const Visit = mongoose.model('Visit', visitSchema);

module.exports = Visit;
