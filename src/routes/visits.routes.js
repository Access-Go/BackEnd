const express = require('express');
const router = express.Router();
const Visit = require("../models/visits.model")
const mongoose = require('mongoose');

// Asegúrate de que la ruta al modelo sea correcta 
router.post('/', async (req, res) => {
    try {
        const { page, companyId, ip } = req.body;

        if (!page || !companyId) {
            return res.status(400).json({ error: "Los campos 'page' y 'companyId' son obligatorios" });
        }

        if (!ip) {
            return res.status(400).json({ error: "La IP del usuario es obligatoria" });
        }

          const visit = await Visit.findOne({ page, companyId });

        if (!visit) {
            // Si no existe, creamos una nueva visita
            const newVisit = await Visit.create({
                page,
                companyId,
                visits: 1,
                visitDates: [{ date: new Date() }], // Agregar la fecha
                ipAddresses: [{ ip, lastVisit: new Date() }],
            });
            return res.status(201).json({ success: true, visit: newVisit });
        }

        // Revisar si la IP ya está registrada
        const ipExists = visit.ipAddresses.some(entry => entry.ip === ip);

        if (ipExists) {
            console.log('Ya está registrada la visita de este IP.');
            return res.status(200).json({ success: true, message: 'Ya está registrada la visita de este IP.' });
        }

        // Si es una nueva IP, actualizamos la fecha de visita
        visit.visits += 1;
        visit.ipAddresses.push({ ip, lastVisit: new Date() });
        visit.visitDates.push({ date: new Date() }); 
        await visit.save();

        res.status(200).json({ success: true, visit });

    } catch (error) {
        console.error('Error al registrar la visita:', error);
        res.status(500).json({ error: 'Error al registrar la visita' });
    }
});


const calculateStartDate = (rango, now) => {
    switch (rango) {
        case "semana":
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - 7);
            weekStart.setHours(0, 0, 0, 0);
            return weekStart;

        case "mes":
            const monthStart = new Date(now);
            monthStart.setDate(now.getDate() - 30);
            monthStart.setHours(0, 0, 0, 0);
            return monthStart;

        case "año":
            return new Date(now.getFullYear(), 0, 1);

        case "día":
            const dayStart = new Date(now);
            dayStart.setHours(0, 0, 0, 0);
            return dayStart;

        default:
            throw new Error("Rango no válido");
    }
};

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rango } = req.query;

        if (!id) {
            console.error("Error: Falta el parámetro 'id'.");
            return res.status(400).json({ error: "El parámetro 'id' es obligatorio." });
        }

        if (!["día", "semana", "mes", "año"].includes(rango)) {
            console.error("Error: Parámetro 'rango' no válido:", rango);
            return res.status(400).json({ error: "El parámetro 'rango' debe ser 'día', 'semana', 'mes' o 'año'." });
        }

        const now = new Date();
        const startDate = calculateStartDate(rango, now);
       const visits = await Visit.aggregate([
            {
                $match: {
                    companyId: id,
                    $or: [
                        { "visitDates.date": { $gte: startDate } },
                        { "ipAddresses.lastVisit": { $gte: startDate } }
                    ]
                }
            },
            { $unwind: "$visitDates" },  
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: rango === "año" ? "%Y" :
                                    rango === "mes" ? "%Y-%m" : "%Y-%m-%d",
                            date: "$visitDates.date"
                        }
                    },
                    totalVisitas: { $sum: "$visits" } 
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const responseData = visits.map(visit => ({
            date: visit._id,
            totalVisits: visit.totalVisitas
        }));


        res.json({
            message: `Estadísticas de Visitas (${rango})`,
            success: true,
            data: responseData
        });

    } catch (error) {
        console.error('Error al obtener las visitas:', error);
        res.status(500).json({ error: 'Error al obtener las visitas' });
    }
});





module.exports = router;
