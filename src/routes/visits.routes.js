const express = require('express');
const router = express.Router();
const Visit = require("../models/visits.model")

router.post('/', async (req, res) => {
    try {
        const { page, id } = req.body;
        if (!page || !id) {
            return res.status(400).json({ error: "Los campos 'page' e 'id' son obligatorios" });
        }
        const visit = await Visit.findOneAndUpdate(
            { page, companyId: id }, 
            { 
                $inc: { visits: 1 }, 
                $push: { visitDates: { date: new Date() } } 
            },
            { upsert: true, new: true } 
        );

        res.status(200).json({
            success: true,
            visit
        });

    } catch (error) {
        console.error('Error al registrar la visita:', error);
        res.status(500).json({ error: 'Error al registrar la visita' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rango } = req.query; 

        console.log("ID recibido:", id);
        console.log("Rango recibido:", rango);

        const now = new Date();
        now.setUTCHours(23, 59, 59, 999); 

        let startDate;

        // Cálculo de la fecha de inicio según el rango
        switch (rango) {
            case "día":
                startDate = new Date(now);
                startDate.setUTCHours(0, 0, 0, 0);
                break;

            case "semana":
                startDate = new Date(now);
                startDate.setUTCDate(now.getUTCDate() - 7);
                startDate.setUTCHours(0, 0, 0, 0);
                break;

            case "mes":
                startDate = new Date(now);
                startDate.setUTCDate(now.getUTCDate() - 30);
                startDate.setUTCHours(0, 0, 0, 0);
                break;

            case "año":
                startDate = new Date(now.getUTCFullYear(), 0, 1); // Inicio del año
                break;

            default:
                return res.status(400).json({ error: "Rango no válido" });
        }

        console.log("Fecha de inicio calculada:", startDate);

        // Pipeline de agregación
        const visits = await Visit.aggregate([
            { 
                $match: { 
                    page: id,
                    "visitDates.date": { $gte: startDate, $lte: now } // Filtra fechas dentro del rango
                }
            },
            { 
                $unwind: "$visitDates" // Descompone visitDates en documentos individuales
            },
            {
                $match: {
                    "visitDates.date": { $gte: startDate, $lte: now } // Filtrar nuevamente las fechas descompuestas
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: rango === "año" ? "%Y" : 
                                   rango === "mes" ? "%Y-%m" : 
                                   rango === "semana" ? "%Y-%m-%d" : "%Y-%m-%d", // Formato por rango
                            date: "$visitDates.date"
                        }
                    },
                    totalVisitas: { $sum: 1 } // Suma las visitas
                }
            },
            { $sort: { _id: 1 } } // Ordenar por fecha
        ]);

        // Mapeo del resultado
        const visitsData = visits.map(visit => ({
            date: visit._id, 
            totalVisits: visit.totalVisitas 
        }));

        res.json({
            message: `Estadísticas de Visitas (${rango})`,
            success: true,
            data: visitsData
        });

    } catch (error) {
        console.error('Error al obtener las visitas:', error);
        res.status(500).json({ error: 'Error al obtener las visitas' });
    }
});


module.exports = router;
