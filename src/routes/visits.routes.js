const express = require('express');
const router = express.Router();
const Visit = require("../models/visits.model")
const mongoose = require('mongoose');

// Registrar una visita
router.post('/', async (req, res) => {
    try {
        const { page, companyId, ip } = req.body;

        if (!page || !companyId || !ip) {
            return res.status(400).json({ error: "Los campos 'page', 'companyId' e 'ip' son obligatorios" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Para comparar solo la fecha

        let visit = await Visit.findOne({ page, companyId });

        if (!visit) {
            // Si no existe, creamos un nuevo registro
            visit = await Visit.create({
                page,
                companyId,
                visits: 1,
                visitDates: [{ date: today }],
                ipAddresses: [{ ip, lastVisit: today }],
            });
            return res.status(201).json({ success: true, visit });
        }

        // Verificar si la IP ya tiene una visita registrada HOY
        const ipEntry = visit.ipAddresses.find(entry => entry.ip === ip);

        if (ipEntry && new Date(ipEntry.lastVisit).getTime() === today.getTime()) {
            return res.status(200).json({ success: true, message: "Ya se registró una visita de esta IP hoy." });
        }

        // Si es una nueva visita del día, actualizar el registro
        visit.visits += 1;

        if (ipEntry) {
            ipEntry.lastVisit = today; // Actualiza la fecha de la IP existente
        } else {
            visit.ipAddresses.push({ ip, lastVisit: today }); // Agrega la nueva IP
        }

        // Registrar la visita en el array de fechas
        visit.visitDates.push({ date: today });

        await visit.save();

        res.status(200).json({ success: true, visit });

    } catch (error) {
        console.error("Error al registrar la visita:", error);
        res.status(500).json({ error: "Error al registrar la visita" });
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
                        { "visitDates.date": { $gte: startDate } }, // Antes solo contabas esto
                        { "ipAddresses.lastVisit": { $gte: startDate } } // Ahora también cuentas la última visita por IP
                    ]
                }
            },
            { $unwind: "$ipAddresses" }, // Agregamos esto para contar cada IP
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: rango === "año" ? "%Y" :
                                    rango === "mes" ? "%Y-%m" : "%Y-%m-%d",
                            date: "$ipAddresses.lastVisit" // Contamos la última visita
                        }
                    },
                    totalVisitas: { $sum: 1 } // Sumamos correctamente todas las visitas
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
