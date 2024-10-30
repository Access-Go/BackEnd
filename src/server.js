const express = require('express');

const companyRoutes = require('./routes/company.routes');
const phoneRoutes = require('./routes/phone.routes');
const verificationRouter = require('./routes/verification.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const commentRoutes = require('./routes/comment.routes');

const cors = require('cors');

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api', phoneRoutes);
app.use('/api/verification', verificationRouter);

app.use('/api/auth', authRoutes)

app.get("/", (request, response) => {
    response.json({
        message: "Api accessGo",
        success: "True"
    })
})

module.exports = app;
