const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring'); //기존노드방식의 url

const parseCookies = (cookie = '') => //cookie 디폴트값 설정, parseCookies()호출가능
  cookie
    .split(';') //name = ???, Expires = ??? HttpOnly, Path=/]이렇게 배열이 생김
    .map(v => v.split('='))//[name,???], [Expires,????],...
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});// {name,???},{Expires} -->배열을 객체식으로 한다.

http.createServer(async (req, res) => {
  const cookies = parseCookies(req.headers.cookie); // { mycookie: 'test' }
  // 주소가 /login으로 시작하는 경우
  if (req.url.startsWith('/login')) { //localhost:8084/login으로 요청했을 때
    // GET/login 요청 처리 부분
    const { query } = url.parse(req.url);
    const { name } = qs.parse(query);
    //요청문의 query문을 항목별로 나눈다. 
    const expires = new Date(); 
    expires.setMinutes(expires.getMinutes() + 5);
      // 쿠키 유효 시간을 현재시간 + 5분으로 설정
    res.writeHead(302, {
      Location: '/',
      'Set-Cookie': `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`, //name, Expires가 key값이 된다.
    });
    //쿠키를 보낸다. name은 url에서 날라온다. 그리고 expries.toGMTString()은 만료기간을 그리니티 표준시간으로 변환한다. 
    res.end();
  } else if (cookies.name) {  // name이라는 쿠키가 있는 경우
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`${cookies.name}님 안녕하세요`);
  } else { //localhost:8084/login이 아닐경우()
    try {
      const data = await fs.readFile('./cookie2.html');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(err.message);
    }
  }
})
  .listen(8084, () => {
    console.log('8084번 포트에서 서버 대기 중입니다!');
  });