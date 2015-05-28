```
================================================================================
                  _   _ ____  __  __   ____  _____ ____ _____             
                 | \ | |  _ \|  \/  | | __ )| ____/ ___|_   _|            
      _____      |  \| | |_) | |\/| | |  _ \|  _| \___ \ | |        _____ 
     |_____|     | |\  |  __/| |  | |_| |_) | |___ ___) || |       |_____|
                 |_| \_|_|   |_|  |_(_)____/|_____|____/ |_|              
                                                                          
      _____ ___ _   _ ____     _____ _   _ _____    ____  _____ ____ _____ 
     |  ___|_ _| \ | |  _ \   |_   _| | | | ____|  | __ )| ____/ ___|_   _|
     | |_   | ||  \| | | | |    | | | |_| |  _|    |  _ \|  _| \___ \ | |  
     |  _|  | || |\  | |_| |    | | |  _  | |___   | |_) | |___ ___) || |  
     |_|   |___|_| \_|____/     |_| |_| |_|_____|  |____/|_____|____/ |_|  
                                                                           
      _   _ ____  __  __   ____   _    ____ _  __    _    ____ _____ ____  
     | \ | |  _ \|  \/  | |  _ \ / \  / ___| |/ /   / \  / ___| ____/ ___| 
     |  \| | |_) | |\/| | | |_) / _ \| |   | ' /   / _ \| |  _|  _| \___ \ 
     | |\  |  __/| |  | | |  __/ ___ \ |___| . \  / ___ \ |_| | |___ ___) |
     |_| \_|_|   |_|  |_| |_| /_/   \_\____|_|\_\/_/   \_\____|_____|____/ 
                                                                           
================================================================================
```

https://npm.best


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


## License

```
The MIT License (MIT)

Copyright (c) 2015 Zongmin Lei <leizongmin@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
