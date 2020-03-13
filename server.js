/*
http보다 개선된 express 모듈 이용한 서버 구축!!
express  모듈은 미들웨어가 많이 지원된다..
Node.js에서의 미들웨어는 함수로 정의되어 있다 
express framework 이 실무에서 많이 사용됨!! ( 다음 주..)
*/
var express = require("express"); //external
var app = express(); //객체 생성
var fs = require("fs");
var ejs = require("ejs");//서버에서 해석 및 실행되는 ejs파일 제어 모듈
                                    //php, asp, jsp 와 동일                                    
var bodyParser = require("body-parser");
var mysql = require("mysql");//external

var conStr={
    host:"localhost", 
    user:"root", 
    password:"1234",
    database:"ios"
}

//정적자원은 라우팅의 대상이 아니다. 따라서 정적자원의 위치를 지정하면 
//별도의 라우팅이 필요없다..(스프링의 경우엔 요청을 처리할 컨트롤러 지정필요없다..)
//__dirname : node.js의 전역변수 중 하나..(웹서버의 루트 경로를 반환)
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended:true}));

//게시판 글 등록 요청처리
app.post("/notice/regist", function(request, response){
    console.log("넘어온 파라미터는 ", request.body);

    var con = mysql.createConnection(conStr);
    con.connect();

    var sql ="insert into notice(title, writer, content) values(?,?,?)";
    con.query(sql, [request.body.title, request.body.writer, request.body.content] , function(error, result, fields){
        if(error){
            console.log(error);
        }else{
            console.log("등록성공", result);
            response.redirect("/notice/list"); //지정한 url로 재접속을 명령!!
        }
        con.end();        
    });

});

//게시판 목록 요청
app.get("/notice/list", function(request, response){
    console.log(request.query);

    fs.readFile("./notice/list.ejs", "utf8", function(error, data){
        response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
        response.end(ejs.render(data, {
            params:request.query
        }));
    });    

});

app.listen(7777, function(){
    console.log("The server is running at 7777 port...");
});











