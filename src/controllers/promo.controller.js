const promoUsecase = require('../usecases/promo.usecases');

const createPromo = async (req, res) => {
    try {
        const newPromo = await promoUsecase.create(req.body);
        res.status(201).json({ success: true, data: newPromo });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getPromosByBusiness = async (req, res) => {
    try {
        const promos = await promoUsecase.getByBusiness(req.params.businessId);
        res.status(200).json({ success: true, data: promos });
    } catch (error) {
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
