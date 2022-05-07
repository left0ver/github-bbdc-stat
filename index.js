const express = require('express');
const  bbdcRouter = require('./router/bbdc')
const app = express();
app.use(bbdcRouter)
app.listen(process.env.PORT || 8000, () => {
    console.log('srart');
});
