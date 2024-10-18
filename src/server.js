const express = require('express');
const registerRoutes = require('./routes/register.routes');
const phoneRoutes = require('./routes/phone.routes');

const app = express();

app.use(express.json());

app.use('/api', registerRoutes);
app.use('/api', phoneRoutes);

app.get("/", (request, response) => {
    response.json({
        message: "Api accessGo"
    })
})

module.exports = app;