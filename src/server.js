const express = require('express');
const { swaggerUi, specs } = require('./swaggerConfig');

//para aws
const uploadRouteUPP = require('./routes/uploadUPP.routes'); // Ruta de carga
const uploadRouteCPP = require('./routes/uploadCPP.routes'); //CPP significa CompanyProfilePicture
const uploadRouteACC = require('./routes/uploadACC.routes'); // para subir fotos de las companies
const getImagesRoute = require('./routes/getImages.routes'); //carrousel de imagenes de la companie

const companyRoutes = require('./routes/company.routes');
const phoneRoutes = require('./routes/phone.routes');
const verificationRouter = require('./routes/verification.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const commentRoutes = require('./routes/comment.routes');
const eventRoutes = require('./routes/event.routes');
const promoRoutes = require('./routes/promo.routes');
const rankingRoutes = require('./routes/ranking.routes');
const volunteerRoutes = require('./routes/volunteer.routes');
const path = require('path');
const  accessibilityRoutes = require("./routes/accesibility.routes")

require('dotenv').config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);


const cors = require('cors');

const app = express();

const corsOptions = {
    origin: ['http://localhost:3000', 'https://accessgo--two.vercel.app', 'https://access-go-dev.vercel.app'],
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(specs, { explorer: true }));
if (process.env.NODE_ENV === 'development') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
}

app.use('/api/accesibilidad', accessibilityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/rankings', rankingRoutes);
app.use('/api', phoneRoutes);
app.use('/api/verification', verificationRouter);
app.use('/api/events', eventRoutes);
app.use('/api/promos', promoRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//para aws
app.use('/api', uploadRouteUPP); //UPP significa UserProfilePicture
app.use('/api', uploadRouteCPP); //CPP significa CompanyProfilePicture
app.use('/api', uploadRouteACC); // AC es para subida de las imagenes de acccesibilidad de las compañias
app.use('/api', getImagesRoute) // recupera imagenes de la carpeta del bucket para las imagenes de la companie

app.use('/api/auth', authRoutes)


app.get("/", (request, response) => {
    response.json({

        message: "Api accessGo v1.4",

        success: "True"
    })
})

module.exports = app;
