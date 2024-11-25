const express = require('express');
const router = express.Router();
const Visit = require("../models/visits.model")

router.post('/', async (req, res) => {
    try {
        const { page } = req.body;
        if (!page) {
            return res.status(400).json({ error: "Los campos 'page' es obligatorio" });
        }
        const visit = await Visit.findOneAndUpdate(
            { page },
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

        startDate = new Date();
        startDate.setUTCDate(startDate.getUTCDate() - 7);
        startDate.setUTCHours(0, 0, 0, 0);

        const testData = await Visit.find({
            page: id,
            "visitDates.date": { $gte: new Date("2024-11-14T00:00:00.000Z") }
        });
        console.log("Datos sin agrupar:", testData);

        const allVisits = await Visit.find({ page: id });
        console.log("Registros de visitas para esta página:", allVisits);
        switch (rango) {
            case "semana":
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 7);
                startDate.setHours(0, 0, 0, 0);
                break;

            case "mes":
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 30);
                startDate.setHours(0, 0, 0, 0);
                break;

            case "año":
                startDate = new Date(now.getFullYear(), 0, 1);
                break;

            case "día":
                startDate = new Date(now);
                startDate.setHours(0, 0, 0, 0);
                break;

            default:
                return res.status(400).json({ error: "Rango no válido" });
        }

        console.log("Fecha de inicio calculada:", startDate);
        const visits = await Visit.aggregate([
            {
                $match: {
                    page: id,
                    "visitDates.date": { $gte: startDate } // Asegúrate de que la fecha esté dentro de visitDates.date
                }
            },
            { $unwind: "$visitDates" }, // Desestructura el array visitDates
            {
                $match: {
                    "visitDates.date": { $gte: startDate } // Filtra solo las fechas dentro de visitDates
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: rango === "año" ? "%Y" :
                                rango === "mes" ? "%Y-%m" : "%Y-%m-%d",
                            date: "$visitDates.date" // Usa la fecha dentro de visitDates
                        }
                    },
                    totalVisitas: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Log para ver el resultado de la agregación
        console.log("Resultado de la agregación (visitas agrupadas):", visits);

        // Mapear los datos para la respuesta
        const visitsData = visits.map(visit => ({
            date: visit._id,
            totalVisits: visit.totalVisitas
        }));

        // Log para verificar cómo queda la estructura final de los datos
        console.log("Datos finales de visitas:", visitsData);


        res.json({
            message: (`Estadísticas de Visitas (${rango})`),
            success: true,
            data: visitsData
        });
    } catch (error) {
        console.error('Error al obtener las visitas:', error);
        res.status(500).json({ error: 'Error al obtener las visitas' });
    }
});

module.exports = router;
