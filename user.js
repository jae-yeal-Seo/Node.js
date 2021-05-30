const express = require('express');

const router = express.Router();

//GET/user라우터
router.get('/',(req,res)=>{
    res.send('Hello,User');
});

module.exports = router;
//이제 여기서 만든 router를 모듈로서 사용할 수 있다. 