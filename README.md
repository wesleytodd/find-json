# Find and Query agains a JSON file

This module is used to traverse up a directory structure looking for a json file.  It can find and read in the file, then provide a simple query method agains the data.  By default it will look for a `package.json`.

Examples:

```javascript
var File = require('find-json');

var f = new File();
f.read(function() {
	f.get('version'); // '0.0.1'
	f.get('repository:url'); // 'https://github.com/wesleytodd/find-json.git'
}):
```

```javascript
// Directory Structure:
// - config.json
// - foo/
// | - other.js
// 
// Run from in foo:
// $ node ./other.js
// 
// File: config.json
{
	"db": {
		"host": "localhost"
	}
}

// File: other.js
var File = require('find-json');

var f = new File({
	filename: 'config.json',
	delim: '.'
});
f.readSync();

f.get('db'); // {host: 'localhost'}
f.get('db.host'); // 'localhost'
```
