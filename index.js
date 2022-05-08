const express = require('express');
const bbdcRouter = require('./router/bbdc')
const { Error404 } = require('./error_pages')
const app = express();
app.use(bbdcRouter)
app.use('/', (req, res) => {
    res.status(404).send(new Error404().render())
})
app.listen(process.env.PORT || 8000);
