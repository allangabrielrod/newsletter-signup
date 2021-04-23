const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us10.api.mailchimp.com/3.0/lists/bf9befebe7";
    const options = {
        method: "POST",
        auth: "agabriel:7d064982dd3b7350b590b30801eda81a-us10"
    };

    const request = https.request(url, options, function(response) {
        
        if(response.statusCode === 200) {
            response.on("data", function(data) {
                data = JSON.parse(data);
                console.log(data);
            });
            request.write(jsonData);
            request.end();
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

    });
});

app.listen(3000, function() {
    console.log("server is running on port 3000");
});

//API KEY
//List ID - bf9befebe7
//7d064982dd3b7350b590b30801eda81a-us10