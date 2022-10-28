/*
const eat = {


eatshit: function() {
    for (var i=0;i<69;i++)
        console.log("FUCKFUCKFUCKFUCKFUCK");
}

}

module.exports = eat*/

const LoginHandler = function() {
    console.log("login handler running");
}
LoginHandler.prototype.registerUser = function(gamertag,email,password,response) {
      sqlcon.query("SELECT Gamer_Tag FROM users WHERE Gamer_Tag='"+gamertag+"';", function (err, result, fields) {
        if (result.length==0) {

           sqlcon.query("SELECT Email FROM users WHERE Email='"+email+"';", function (err, result2, fields) {
              if (result2.length==0) {
                 var qsql = "INSERT INTO users (Email, Password, Gamer_Tag) VALUES ('"+email+"', '"+password+"', '"+gamertag+"');";
                 sqlcon.query(qsql, function (err, result3) {
                   if (err) throw err;
                   console.log("new user record inserted for "+gamertag);
                   response.writeHeader(200, {"Content-Type": "text/html"});
                   response.write("registerok");
                   response.end();
                 });
              } else {
                  response.writeHeader(200, {"Content-Type": "text/html"});
                  response.write("emailalreadyexists");
                  response.end();
              }
           });

        } else {

          response.writeHeader(200, {"Content-Type": "text/html"});
          response.write("alreadyexists");
          response.end();
        }
      });
}


/*registerUser: function(gamertag,email,password,response) {
    sqlcon.query("SELECT Gamer_Tag FROM users WHERE Gamer_Tag='"+gamertag+"';", function (err, result, fields) {
      if (result.length==0) {

         sqlcon.query("SELECT Email FROM users WHERE Email='"+email+"';", function (err, result2, fields) {
            if (result2.length==0) {
               var qsql = "INSERT INTO users (Email, Password, Gamer_Tag) VALUES ('"+email+"', '"+password+"', '"+gamertag+"');";
               sqlcon.query(qsql, function (err, result3) {
                 if (err) throw err;
                 console.log("new user record inserted for "+gamertag);
                 response.writeHeader(200, {"Content-Type": "text/html"});
                 response.write("registerok");
                 response.end();
               });
            } else {
                response.writeHeader(200, {"Content-Type": "text/html"});
                response.write("emailalreadyexists");
                response.end();
            }
         });

      } else {

        response.writeHeader(200, {"Content-Type": "text/html"});
        response.write("alreadyexists");
        response.end();
      }
    });
}*/

LoginHandler.prototype.registerUser =  function(request,body,response) {
    var post = qs.parse(body);
    var email = post.email;
    var pass = post.password;
    console.log("attempting login check for "+email+":"+pass);
    var sessionKey = "zk";
    for (var i=0; i<10; i++) {
        var rnum = Math.ceil(Math.random()*100);
        sessionKey = sessionKey+""+rnum;
    }
    sqlcon.query("SELECT Password,Gamer_Tag FROM users WHERE Email='"+email+"';", function (err, result, fields) {
          if (result.length>0) {
            var pwshouldbe = result[0].Password;
            var gt = result[0].Gamer_Tag;
            if (pwshouldbe == pass) {
                //response.cookie("username","420");
                response.writeHeader(200, {'Set-Cookie': 'userSession='+sessionKey+'; Max-Age=3600',"Content-Type": "text/html"});
                response.write("loginok");
                response.end();
                sqlcon.query("UPDATE users SET Session_Key='"+sessionKey+"' WHERE Email='"+email+"';", function (err, result3) {
                     if (err) throw err;
                     console.log("stored session id "+sessionKey+" for user "+gt);
               });
            } else {
                response.writeHeader(200, {"Content-Type": "text/html"});
                response.write("invalid");
                response.end();
            }
          } else {
            response.writeHeader(200, {"Content-Type": "text/html"});
            response.write("nouser");
            response.end();
          }
    });
}


module.exports = new LoginHandler()