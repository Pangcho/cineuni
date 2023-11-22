const express = require('express')
const app = express()
const port = 3000
const path = require('path');
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false}))

app.use(express.static('views'));
app.use(express.static('js'));
app.use(express.static('css'));

app.use(express.static(path.join(__dirname + "/public")));
app.use(express.static(path.join("./public")));

require('dotenv').config() // 환경변수 읽기 위함

const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL)
console.log('Connected to CineUniverse')

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/views/index.html'); 
})

app.get('/community', (req, res) => {
    res.sendFile(__dirname + '/public/views/community.html'); 
})

app.get('/api/posts', function(req, res) {
    connection.query('SELECT * FROM community', function (err, results) {
      if (err) throw err;
      res.json(results);
    });
  });  

app.get('/community/note', (req, res) => {
    res.sendFile(__dirname + '/public/views/note.html'); 
})

app.get('/community/popularnote', (req, res) => {
    res.sendFile(__dirname + '/public/views/popularnote.html'); 
})

app.get('/test', (req, res) => {
    res.sendFile(__dirname + '/public/views/test.html'); 
})

app.post('/communityProc', (req, res) => {
    const title = req.body.title;
    const memo = req.body.memo;
    const discussion = req.body.discussion ? 1 : 0;   // MySQL에서는 Boolean 타입이 실제로는 TINYINT(1)로 처리, 토론 체크하면 1 아니면 0의 값으로 db에 저장 

    var sql = `insert into community(title,memo,regdate,discussion)
    values('${title}','${memo}',now(),'${discussion}')`
    
    connection.query(sql, function(err, result) {
        if(err) throw err;
        console.log('자료 1개를 삽입하였습니다.');
        res.send("<script> alert('게시글이 등록되었습니다.'); location.href='/community'</script>");
    })
})

app.get('/mypage', (req, res) => {
    res.sendFile(__dirname + '/public/views/mypage.html'); 
})


app.listen(port, () => {
    console.log(`서버가 실행되었습니다. 접속주소: http://localhost:${port}`)
})
