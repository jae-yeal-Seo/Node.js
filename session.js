const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '') =>
  cookie
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});

const session = {}; //세션 정보 저장 변수

http.createServer(async (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  console.log(cookies);
  if (req.url.startsWith('/login')) {
    const { query } = url.parse(req.url);
    const { name } = qs.parse(query);
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);
    const uniqueInt = Date.now(); // 현재 날짜값 : 1970년.1.1일 이후 밀리초를 반환함
    session[uniqueInt] = {
      name,
      expires,
    }; //session.uniqueInt으로 세션정보에 접근가능
    res.writeHead(302, {
      Location: '/',
      'Set-Cookie': `session=${uniqueInt}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
    });//${uniqueInt}값을 읽음 (사람이름 안 읽음)
    res.end();
    //세션쿠키가 존재하고, 만료 기간이 지나지 않았다면
    //cookie.session : 브라우저에서 전달받은 uniqueInt 값
  } else if (cookies.session && session[cookies.session].expires > new Date()) {
    //cookies.session이 존재하고 현재 시간이 session[cookies.session].expires를 넘기지 않았을 때.
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`${session[cookies.session].name}님 안녕하세요`);
    //이제 받았을 때는 cookies에 session이 있다. 
  } else {
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
  .listen(8085, () => {
    console.log('8085번 포트에서 서버 대기 중입니다!');
  });