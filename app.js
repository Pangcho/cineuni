const express = require('express')
const ejs = require('ejs')
const app = express()
const port = 3000
var bodyParser = require('body-parser')

require('dotenv').config() // 환경변수 읽기 위함

const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL)
console.log('Connected to CineUniverse')

app.set('view engine', 'ejs' )
app.set('views', './views')
app.use(bodyParser.urlencoded({ extended: false}))
//라우터
app.get('/', (req, res) => {
    res.render('index') // ./views/index.ejs를 불러와서 출력
})

app.get('/community', (req, res) => {
    const sql = "SELECT * FROM community";
    connection.query(sql, function(err, posts) {
        if (err) throw err;
        res.render('community', { posts: posts });
    });
});

app.get('/community/note', (req, res) => {
    res.render('note') 
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
    res.render('mypage') 
})

app.listen(port, () => {
    console.log(`서버가 실행되었습니다. 접속주소: http://localhost:${port}`)
})