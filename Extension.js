/*
 * Copyright (c) 2012 Adobe Systems Incorporated. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/*jslint vars: true, plusplus: true, devel: true, browser: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, $ */

define(function (require, exports, module) {
	'use strict';

	var DATABASE_URL = "http://jdiehl.github.com/extensions.json";
	var INSTALLED_PATH = "extensions/disabled/";
	var ENABLED_PATH = "extensions/enabled/";

	var fs = brackets.getModule("file/NativeFileSystem").NativeFileSystem;

	var _extensions = [];

	// create an index from a directory
	function _dirIndex(path) {
		var r = $.Deferred();
		var dir = new fs.DirectoryEntry(path);
		dir.createReader().readEntries(function (entries) {
			var index = {};
			for (var i in entries) {
				index[entries[i].name] = true;
			}
			r.resolve(index);
		}, function (err) {
			r.reject(err)
		});
		return r.promise();
	}

	// Extensions Class
	function Extension(info) {
		this.description = info.description;
		this.name = info.name;
		this.repository = info.repository;
		this.title = info.title;
		this.url = info.url;
	}

	// Extensions Methods
	Extension.prototype = {

		enable: function () {

		},

		diable: function () {

		},

		install: function () {

		},

		uninstall: function () {

		}

	};

	function load(callback) {
		var get = $.get(DATABASE_URL);
		var installed = _dirIndex(INSTALLED_PATH);
		var enabled = _dirIndex(ENABLED_PATH);
		$.when(get, installed, enabled).then(function (info, installed, enabled) {
			_extensions = [];
			var index = {};
			for (var i in info) {
				var ext = new Extension(info[i]);
				if (enabled[ext.name]) ext.status = 2;
				else if (installed[ext.name]) ext.status = 1;
				_extensions.push(ext);
			}
			callback(_extensions);
		}).fail(console.error.bind(console));
	}

	exports.load = load;
	exports.Extension = Extension;
});
