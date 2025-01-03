/**
 * -----------------------------------------------------------------
 * Controladores para las funciones de registro
 * -----------------------------------------------------------------
 */
const Ranking = require('../models/ranking.model');
const Company = require('../models/company.model');


/**
 * Crea una nueva calificación y actualiza la calificación promedio de la compañía
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.createRanking = async (req, res) => {
  try {
    const { businessId, userId, stars } = req.body;
    const newRanking = new Ranking({ businessId, userId, stars });
    await newRanking.save();

    // Actualizar el promedio de calificación de la compañía
    await updateAverageRating(businessId);

    res.status(201).json({ success: true, data: newRanking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Obtiene todas las calificaciones de un negocio
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.getRankingsByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    const rankings = await Ranking.find({ businessId }).populate('userId', 'firstName lastName');
    res.status(200).json({ success: true, data: rankings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Obtiene el promedio de calificación de un negocio
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.getAverageRankingByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;
    const company = await Company.findById(businessId).select('averageRating');
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    res.status(200).json({ success: true, data: { averageRating: company.averageRating } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Función auxiliar para actualizar el promedio de calificación
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
async function updateAverageRating(businessId) {
  const ratings = await Ranking.find({ businessId });
  const totalRatings = ratings.length;
  const sumOfRatings = ratings.reduce((sum, rating) => sum + rating.stars, 0);
  const averageRating = totalRatings > 0 ? (sumOfRatings / totalRatings).toFixed(2) : 0;
  await Company.findByIdAndUpdate(businessId, { averageRating });
}


/**
 * Obtiene un ranking por su ID
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
exports.getRankingById = async (req, res) => {
  try {
    const { id } = req.params;
    const ranking = await Ranking.findById(id);

    if (!ranking) {
      return res.status(404).json({ success: false, message: 'Ranking no encontrado' });
    }

    res.status(200).json({ success: true, data: ranking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};