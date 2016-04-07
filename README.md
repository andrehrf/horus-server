# Horus

Horus is a monitoring system in real-time changes to pages

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

## Outer installations

```bash
$ sudo npm install -g pm2
```

## Start Horus server

```bash
$ npm install
$ bower install
$ pm2 start ecosystem.json
```