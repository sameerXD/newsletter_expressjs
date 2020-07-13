//jshint esversion :6

const express = require("express");
const bodyParser = require("body-parser");
app = express();
app.use(bodyParser.urlencoded({extended:true}));
const request = require("request");
const https = require("https");

app.use(express.static("public"));

app.get("/",(req,res)=>{
  res.sendFile(__dirname+"/signup.html")
})

app.post("/",(req,res)=>{
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME: firstName,
          LASTNAME: lastName

        }
      }
    ]
  }
  var jsonData = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/309ae4f03c";
  const options = {
    method : "post",
    auth: "samxD:6fb55249c867eca7f26cd48dcd463b60-us10"
  }
  const request = https.request(url , options, function(response){
    if (response.statusCode === 200) {
      res.sendFile(__dirname +"/success.html")
    }else{
      res.sendFile(__dirname +"/failure.html")
    }
    response.on("data", (data)=>{
      console.log(JSON.parse(data));
    })

  })
  request.write(jsonData);
  request.end();
});


app.post("/failure", (req,res)=>{
  res.redirect("/")
})

const port = process.env.PORT;
app.listen(port || 3000, ()=>{
  console.log("server is up!!")
})
