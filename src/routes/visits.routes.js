const express = require('express');
const router = express.Router();
const Visit = require("../models/visits.model")

// Endpoint para registrar visitas
router.post('/', async (req, res) => {
    try {
        const { page, id } = req.body;

        // Validación de los campos 'page' e 'id'
        if (!page || !id) {
            return res.status(400).json({ error: "Los campos 'page' e 'id' son obligatorios" });
        }

        // Actualización o creación de la visita
        const visit = await Visit.findOneAndUpdate(
            { page, companyId: id }, // Filtramos por la página y el ID de la empresa
            { 
                $inc: { visits: 1 }, // Incrementamos el contador de visitas
                $push: { visitDates: { date: new Date() } } // Agregamos la fecha de la visita
            },
            { upsert: true, new: true } // Si no existe el documento, lo crea
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

// Endpoint para obtener estadísticas de visitas filtradas por un rango de tiempo
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params; // Obtenemos el 'id' desde los parámetros de la ruta
        const { rango } = req.query; // Obtenemos el parámetro 'rango' desde la query string

        console.log("ID recibido:", id);
        console.log("Rango recibido:", rango);

        const now = new Date();
        now.setUTCHours(23, 59, 59, 999); // Fin del día actual
        
        startDate = new Date();
        startDate.setUTCDate(startDate.getUTCDate() - 7);
        startDate.setUTCHours(0, 0, 0, 0); // Inicio del día hace 7 días
        
        const testData = await Visit.find({
            page: id,
            "visitDates.date": { $gte: new Date("2024-11-14T00:00:00.000Z") }
        });
        console.log("Datos sin agrupar:", testData);
        const allVisits = await Visit.find({ page: id });
        console.log("Registros de visitas para esta página:", allVisits);
        // Determinar el inicio del rango de tiempo según el valor de 'rango'
        switch (rango) {
            case "semana":
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 7); // Últimos 7 días
                startDate.setHours(0, 0, 0, 0);
                break;

            case "mes":
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 30); // Últimos 30 días
                startDate.setHours(0, 0, 0, 0);
                break;

            case "año":
                startDate = new Date(now.getFullYear(), 0, 1); // Inicio del año
                break;

            case "día":
                startDate = new Date(now);
                startDate.setHours(0, 0, 0, 0); // Inicio del día actual
                break;

            default:
                return res.status(400).json({ error: "Rango no válido" });
        }

        console.log("Fecha de inicio calculada:", startDate);

        // Usar agregación para agrupar visitas por rango seleccionado
        const visits = await Visit.aggregate([
            { 
                $match: { 
                    page: id,
                    visitedAt: { $gte: startDate } // Filtrar por la fecha de visita
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: rango === "año" ? "%Y" : 
                                   rango === "mes" ? "%Y-%m" : "%Y-%m-%d", 
                            date: "$visitedAt"
                        }
                    },
                    totalVisitas: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        console.log("Visitas agrupadas:", visits);
        
        
        console.log("Visitas agrupadas (depuración):", visits);
        

        // Mapear los resultados al formato deseado
        const visitsData = visits.map(visit => ({
            date: visit._id, // Fecha agrupada
            totalVisits: visit.totalVisitas // Total de visitas en esa fecha
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
