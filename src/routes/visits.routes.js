const express = require('express');
const router = express.Router();
const Visit = require("../models/visits.model")

// Asegúrate de que la ruta al modelo sea correcta 
router.post('/', async (req, res) => {
     try { 
        const { page, companyId, profile } = req.body; // Añadí profile para verificar el tipo de usuario 
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
       
        if (!page || !companyId) {
             return res.status(400).json({ error: "Los campos 'page' y 'companyId' son obligatorios" }); 
            } 

        if (profile !== 'premium') {
     return res.status(200).json({ message: 'Solo se registran visitas de perfiles premium' }); 
    }
    
    const visit = await Visit.findOne({ page, companyId }); 
    
    // Verificar si la IP ya visitó recientemente 
    const recentVisit = visit?.recentVisitors.find(visitor =>
         visitor.ip === clientIp && new Date() - new Date(visitor.lastVisit) < 10 * 60 * 1000 // 10 minutos
     ); 

    if (recentVisit) { 
        return res.status(200).json({ 
            success: true, 
            message: 'Visita ya registrada recientemente.' 
        }); 
    } 

    // Registrar la nueva visita 
    const updatedVisit = await Visit.findOneAndUpdate(
         { page, companyId },
          { 
            $inc: { visits: 1 },
            $push: { visitDates: { date: new Date() } }, 
            $set: { 
                'recentVisitors.$[elem]': { 
                    ip: clientIp, 
                    lastVisit: new Date(), 
                },
            }, 
          }, 
         { upsert: true, 
            new: true, 
            arrayFilters: [{ 'elem.ip': clientIp }], 
        } 
    ); 

         // Si la IP no existía, agrégala
          if (!recentVisit) {
             await Visit.updateOne( 
                { page, companyId },
                { $push: { recentVisitors: { ip: clientIp, lastVisit: new Date() } } } 
            ); 
        } 

        res.status(200).json({
             success: true, 
             visit: updatedVisit, 
            }); 
        }catch (error) { 
            console.error('Error al registrar la visita:', error); 
            res.status(500).json( { error: 'Error al registrar la visita' });
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

        let startDate = new Date();
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
