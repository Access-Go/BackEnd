const express = require('express');
const router = express.Router();
const Visit = require("../models/visits.model")
const mongoose = require('mongoose');

// Asegúrate de que la ruta al modelo sea correcta 
router.post('/', async (req, res) => {
    try {
        const { page, companyId } = req.body;
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        if (!page || !companyId) {
            return res.status(400).json({ error: "Los campos 'page' y 'companyId' son obligatorios" });
        }

        console.log('Datos recibidos:', { page, companyId, clientIp });

        const visit = await Visit.findOne({ page, companyId });

        console.log('Visita encontrada:', visit);

        if (!visit) {
            // Si no se encuentra la visita, se crea
            console.log('No se encontró la visita, creando...');
            const newVisit = await Visit.create({
                page,
                companyId,
                visitDates: [{ date: new Date(), _id: new mongoose.Types.ObjectId() }],
                recentVisitors: [],
                visits: 1,
                ipAddresses: []
            });
            return res.status(201).json({ success: true, visit: newVisit });
        } else {
            // Si ya existe, mostrar un mensaje y no actualizar
            console.log('Ya tiene visita registrada.');
            return res.status(200).json({ success: true, message: 'Ya tiene visita registrada.', visit });
        }

        console.log('Realizando la actualización de la visita...');
        const updatedVisit = await Visit.findOneAndUpdate(
            { page, companyId },
            {
                $inc: { visits: 1 },
                $push: { visitDates: { date: new Date(), _id: new mongoose.Types.ObjectId() } },
                $addToSet: {
                    recentVisitors: {
                        ip: clientIp,
                        lastVisit: new Date(),
                        _id: new mongoose.Types.ObjectId()  // Generar correctamente el ID
                    },
                },
            },
            {
                upsert: true,
                new: true,
                arrayFilters: [{ 'elem.ip': clientIp }]
            }
        );

        console.log('Visita actualizada:', updatedVisit);

        res.status(200).json({
            success: true,
            visit: updatedVisit,
        });
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
            return res.status(400).json({ error: "El parámetro 'id' es obligatorio." });
        }

        if (!["día", "semana", "mes", "año"].includes(rango)) {
            return res.status(400).json({ error: "El parámetro 'rango' debe ser 'día', 'semana', 'mes' o 'año'." });
        }

        const now = new Date();
        const startDate = calculateStartDate(rango, now);

        const visits = await Visit.aggregate([
            {
                $match: {
                    page: id,
                    "visitDates.date": { $gte: startDate },
                }
            },
            { $unwind: "$visitDates" },
            {
                $match: {
                    "visitDates.date": { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: rango === "año" ? "%Y" :
                                rango === "mes" ? "%Y-%m" : "%Y-%m-%d",
                            date: "$visitDates.date"
                        }
                    },
                    totalVisitas: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

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
