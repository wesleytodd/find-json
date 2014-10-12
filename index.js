var fs = require('fs'),
	path = require('path');

var File = module.exports = function(opts) {
	opts = opts || {};

	// Setup defaults
	this.filename = opts.filename || 'package.json';
	this.base = opts.base ? path.resolve(opts.base) : process.cwd();
	this.path = null;
	this.contents = {};
	this.delim = opts.delim || ':';
};

File.prototype.get = function(key) {
	var p = key.split(this.delim),
		out = this.contents;

	for(var i = 0; i < p.length; i++) {
		if (typeof out[p[i]] === 'undefined') {
			return null;
		}
		out = out[p[i]];
	}
	return out;
};

File.prototype.find = function(done) {
	// If we have gotten all the way to the top,
	// just return undefined
	if (this.base === '/') {
		return done();
	}

	// Look in this dir
	var p = path.join(this.base, this.filename);
	fs.exists(p, function(exists) {
		// Found it!
		if (exists) {
			this.path = p;
			return done(this.path);
		}

		// Move up a directory and check again
		this.base = path.resolve(path.join(this.base, '..'));
		this.find(done);
	}.bind(this));
};

File.prototype.findSync = function() {
	// If we have gotten all the way to the top,
	// just return undefined
	if (this.base === '/') {
		return;
	}

	// Look in this dir
	var p = path.join(this.base, this.filename);
	if (fs.existsSync(p)) {
		this.path = p;
		return this.path;
	}

	// Move up a directory and check again
	this.base = path.resolve(path.join(this.base, '..'));
	return this.findSync();
};

File.prototype.read = function(done) {
	if (this.path) {
		// Read the file and parse as json
		try {
			fs.readFile(this.path, function(err, d) {
				// Return contents if there was an error
				if (err) {
					return done(this.contents);
				}

				// Try to parse as json
				try {
					this.contents = JSON.parse(j);
				} catch(e) {}

				// Return the contents
				done(this.contents);
			}.bind(this));
		} catch(e) {
			done(this.contents);
		}
	} else {
		// Havent found it yet, so find it then read it
		this.find(this.read.bind(this, done));
	}
};

File.prototype.readSync = function() {
	// Find it first
	if (!this.path) {
		this.findSync();
	}

	// Read the file and parse as json
	try {
		var j = fs.readFileSync(this.path);
		this.contents = JSON.parse(j);
	} catch(e) {}

	// Return the contents, even if it failed
	return this.contents;
};
