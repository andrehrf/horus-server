<div align="center">
    <img width=710px src="http://i1.wp.com/nodedecode.com.br/wp-content/uploads/2016/04/horus_logo.jpg?resize=750%2C410">
    <br/>
    Horus is a monitoring system in real-time changes to pages
</div>

## Install Node.js

```bash
$ curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Install MongoDB

```bash
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
$ echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
$ sudo apt-get update
$ sudo apt-get install -y mongodb-org
```

## Install Horus Server

```bash
$ git clone https://github.com/andrehrf/horus-server
$ cd /horus-server
$ npm install
```

## Outer installations

```bash
$ sudo npm install -g pm2
```

## Start Horus server

```bash
$ pm2 start ecosystem.json
```

or

```bash
$ node app.js
```

## Usage Horus

```js
var Horus = require("horus-client");
var horus = new Horus("http://localhost:9007");

//Set links to watch
horus.set([
    "https://pt.wikipedia.org/wiki/Wikip%C3%A9dia:P%C3%A1gina_principal",
    "https://pt.wikipedia.org/wiki/Brasil"
], function(err){
    if(err)
        console.log(err);
    else
        console.log("Set OK");
});

//Get link status
horus.get("https://pt.wikipedia.org/wiki/Brasil", function(err, info){
    if(err)
        console.log(err);
    else
        console.log(info);
});

//Delete link
horus.delete("https://pt.wikipedia.org/wiki/Wikip%C3%A9dia:P%C3%A1gina_principal", function(err){
    if(err)
        console.log(err);
});
```

### License

  MIT
  
  Copyright (C) 2016 André Ferreira

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
