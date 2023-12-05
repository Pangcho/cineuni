const express = require('express')
const app = express()
const port = 3000
const path = require('path');
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false}))

require('dotenv').config() // 환경변수 읽기 위함

const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL)
console.log('Connected to CineUniverse')

app.use(express.static(path.join(__dirname + "/public")));
app.use(express.static(path.join("./public")));
app.use(express.static(path.join(__dirname + "/")));
app.use(express.static(path.join("./")));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); 
})

app.use(bodyParser.json()); // JSON 데이터를 처리할 수 있도록 설정

app.post('/save_user', (req, res) => {
  const { email, nickname, profile_image } = req.body;

  const checkSql = 'SELECT * FROM users_test WHERE email = ?';
  const insertSql = 'INSERT INTO users_test (email, name, profile_img) VALUES (?, ?, ?)';

  connection.query(checkSql, [email], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error occurred while checking user data.');
    } else if (results.length === 0) {  // 이메일이 데이터베이스에 존재하지 않을 때
      connection.query(insertSql, [email, nickname, profile_image], (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error occurred while saving user data.');
        } else {
          console.log('User data saved.');
          res.redirect('/join.html');
        }
      });
    } else {  // 이메일이 데이터베이스에 존재할 때 home.html로 보내기
      console.log('User already exists.');
      res.redirect('/join.html');
    }
  });
});

app.post('/login', (req, res) => {
  const email = req.body.email;

  // 이메일을 사용하여 데이터베이스에서 사용자 찾기
  const query = `SELECT * FROM users_test WHERE email = ?`;
  connection.query(query, [email], (error, results) => {
      if (error) {
          console.error('쿼리 오류: ', error);
          res.send('서버 오류');
      } else {
          console.log('데이터베이스 결과:', results); // 결과를 console에 출력
          // 이메일에 해당하는 사용자가 있는지 확인
          if (results.length > 0) {
              // 결과가 존재하면 로그인 성공
              res.redirect('/home.html');
          } else {
              // 결과가 존재하지 않으면 이메일이 존재하지 않음 다시 index.html로 이동
              res.send('<script>alert("이메일이 유효하지 않습니다."); window.location.href = "/index.html;</script>');
          }
      }
  });
});

app.post('/join', (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  
  // 이메일 중복 확인
  const duplicateQuery = `SELECT * FROM users_test WHERE email = ?`;
  connection.query(duplicateQuery, [email], (error, results) => {
    if (error) {
      console.error('쿼리 오류: ', error);
      res.send('서버 오류');
    } else {
      if (results.length > 0) {
        // 이메일이 이미 존재하는 경우
        res.send('<script>alert("이메일이 중복되었습니다."); window.location.href = "/join.html;</script>');
      } else {
        // 이메일이 존재하지 않는 경우 회원가입 처리
        const insertQuery = `INSERT INTO users_test (email, name) VALUES (?, ?)`;
        connection.query(insertQuery, [email, name], (error, results) => {
          if (error) {
            console.error('쿼리 오류: ', error);
            res.send('서버 오류');
          } else {
            res.send('<script>alert("회원가입이 완료되었습니다."); window.location.href = "/index.html";</script>');
          }
        });
      }
    }
  });
});

app.listen(port, () => {
    console.log(`서버가 실행되었습니다. 접속주소: http://localhost:${port}`)
})
