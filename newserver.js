const http = require("http");
const fs = require("fs");
const qs = require("querystring");

const port = 3000;
const ip = "127.0.0.1";

const sendResponse = (filename, statusCode, response) => {
  fs.readFile(`./html/${filename}`, (error, data) => {
    if (error) {
      response.statusCode = 500;
      response.setHeader("Content-Type", "text/plain");
      response.end("Sorry, internal error");
    } else {
      response.statusCode = statusCode;
      response.setHeader("Content-Type", "text/html");
      response.end(data);
    }
  });
};

const server = http.createServer((request, response) => {
  const method = request.method;
  let url = request.url;

  if (method === "GET") {
    const requestUrl = new URL(url, `http://${ip}:${port}`);
    url = requestUrl.pathname;
    const lang = requestUrl.searchParams.get("lang");
  
  if (url === "/page1.html") {
      sendResponse(`page1.html`, 200, response);
    } else if (url === "/page2.html") {
      sendResponse(`page2.html`, 200, response);
    } else if (url === "/login-fail.html") {
      sendResponse(`login-fail.html`, 200, response);
    } else {
      sendResponse(`404.html`, 404, response);
    }
  } else {
    if (url === "/process-login") {
      let body = [];

      request.on("data", (chunk) => {
        body.push(chunk);
      });

      request.on("end", () => {
        body = Buffer.concat(body).toString();
        body = qs.parse(body);
        console.log(body);

        if (body.username === "john" && body.password === "john123") {
          response.statusCode = 301;
          response.setHeader("Location", "/page2.html");
        } else {
          response.statusCode = 301;
          response.setHeader("Location", "/login-fail.html");
        }

        response.end();
      });
    }
  }
});

server.listen(port, ip, () => {
  console.log(`Server is running at http://${ip}:${port}`);
});