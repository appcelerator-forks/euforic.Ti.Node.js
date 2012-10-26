![ti.node.js](https://raw.github.com/euforic/Ti.Node.js/master/Resources/iphone/appicon@2x.png)
# Ti.Node.js
Experimenting trying to port node.js core modules to titanium.

## Goal
Drop in usage of node.js core library with zero modification to core JS files

## Ports
You can find many other node.js scripts ported to Titanium using [tipm](http://tipm.co)

## Contributing
  - Add missing globals to `Resources/node/index.js`
  - Create missing Node Native module wrappers in the `Resources/node/src` directory make sure to use the same name as the real one
  - Create Tests in `Resources/test/MODULE_NAME/TEST_NAME.js`
  - Add non Titanium code needed for testing to the  `Resources/test/MODULE_NAME/TEST_NAME.js`
  - Only comment out code in Node Core module files.
  - If you add code put `// #TINODE_START` before and `// #TINODE_END` after so others know.
  - Add Completed module to `REAME.md`

## API

### node.require
Use this to require node core modules. Located in `Resources/node/src`, Use module name only no directory path needed.

```js
var net = node.require('net');
```

### process.bind
Use this to require fake node native module. Located in `Resources/node/src`, Use module name only no directory path.

```js
var TCP = process.bind('tcp_wrap').TCP;
```

### $NODE_PATH
Global constant for the node directory. Defaults to `node/`
```js
$NODE_PATH = 'mylib/node/';
```

### Node API
see [Node.js API](http://nodejs.org/api/)

### Modules
Create issues for errors

  - domain
  - events
  - utils
  - assert
  - net

## License

(The MIT License)

Copyright (c) 2012 Christian Sullivan &lt;cs@euforic.co&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.