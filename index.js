const express = require('express');

const router = express.Router();
//라우터는 4.2절 처럼 복잡하게 if문으로 response를 나누지 않기위함이다. 

//GET/라우터-->Hello,User라는 글자만 쏴준다. 메소드 방식과 주소를 한번에 처리했다. 
router.get('/',(req,res)=>{
    res.send('Hello,Express');
});

module.exports = router;
//이제 이 파일에서 만든 router를 사용할 수 있다. 


