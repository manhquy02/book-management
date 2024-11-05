const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.send('day la trang chu')
})

module.exports = router