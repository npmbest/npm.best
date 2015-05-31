## Development

### Install

```bash
git clone https://github.com/npmbest/npm.best.git
cd npm.best
npm install
```

### Configure

```bash
cp config/default.js config/development.js
```

edit file `config/development.js`

### Run

```bash
./run_development web
```

### Run on server

```bash
./deploy
```

### Run tools

on development environment:

```bash
./run_development tool/xxx
```

on production environment:

```bash
./run_background tool/xxx
```
