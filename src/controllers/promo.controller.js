const promoUsecase = require('../usecases/promo.usecases');
const Company = require('../models/company.model');
const Promo = require('../models/promo.model')
// Importar el modelo Promo
 // Ajusta la ruta según tu estructura de proyecto
 async function createPromo(req, res) {
    try {
        console.log("Request body:", req.body); // Verificar qué datos llegan
        const { businessId, name, description, startDate, endDate } = req.body;

        if (!businessId || !name || !description || !startDate || !endDate) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }

        // Crear la nueva promoción
        const newPromo = new Promo({ businessId, name, description, startDate, endDate });
        await newPromo.save();

        // Respuesta con success: true
        res.status(200).json({
            success: true,
            message: 'Promoción creada exitosamente.',
            promo: newPromo
        });
    } catch (error) {
        console.error("Error al crear promoción:", error); // Log del error
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
}




const getPromosByBusiness = async (req, res) => {
    try {
        // Log para inspeccionar los parámetros recibidos
        console.log("Parámetros recibidos:", req.params);

        const promos = await promoUsecase.getByBusiness(req.params.businessId);
        
        // Log para inspeccionar el resultado de la consulta
        console.log("Promociones obtenidas:", promos);

        res.status(200).json({ success: true, data: promos });
    } catch (error) {
        // Log del error en caso de fallo
        console.error("Error al obtener promociones:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};


const getPromoById = async (req, res) => {
    try {
        const promo = await promoUsecase.getById(req.params.id);
        res.status(200).json({ success: true, data: promo });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};

const updatePromo = async (req, res) => {
    try {
        const updatedPromo = await promoUsecase.update(req.params.id, req.body);
        res.status(200).json({ success: true, data: updatedPromo });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};

const deletePromo = async (req, res) => {
    try {
        await promoUsecase.deleteById(req.params.id);
        res.status(200).json({ success: true, message: 'Promo deleted successfully' });
    } catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};

module.exports = { createPromo, getPromosByBusiness, getPromoById, updatePromo, deletePromo };
