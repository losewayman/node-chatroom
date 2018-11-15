var express = require('express');
var router = express.Router();
var superagent = require('superagent');

router.post('/search',(req,res,next)=>{
    superagent
    .get("https://www.doutula.com/api/search")
    .set({
    })
    .query({
        keyword:req.body.keyword,
        mime:0,
        page:req.body.page
    })
    .end((err, respon) => {
        if (err) {
            console.log(err);
        } else {
            obj=respon.text;
            res.send(obj);
        }
    })
})


module.exports = router;