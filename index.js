const express = require('express');
const  bbdcRouter = require('./api/bbdc')
const app = express();
app.get('/bbdc',bbdcRouter)
// if (process.env.NODE_ENV==='production') {
//     app.listen(80,'0.0.0.0',()=>{
//         console.log('srart');
//     });
// }else {
//     app.listen(8000,'localhost',()=>{
//         console.log('srart');
//     });
// }

app.listen(process.env.PORT || 8000, () => {
    console.log('srart');
});
