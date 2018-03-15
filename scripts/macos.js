(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/base64-js/lib/b64.js","/../../node_modules/base64-js/lib")
},{"buffer":3,"rH1JPG":19}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
  * Bowser - a browser detector
  * https://github.com/ded/bowser
  * MIT License | (c) Dustin Diaz 2014
  */

!function (name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports['browser'] = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else this[name] = definition()
}('bowser', function () {
  /**
    * See useragents.js for examples of navigator.userAgent
    */

  var t = true

  function detect(ua) {

    function getFirstMatch(regex) {
      var match = ua.match(regex);
      return (match && match.length > 1 && match[1]) || '';
    }

    function getSecondMatch(regex) {
      var match = ua.match(regex);
      return (match && match.length > 1 && match[2]) || '';
    }

    var iosdevice = getFirstMatch(/(ipod|iphone|ipad)/i).toLowerCase()
      , likeAndroid = /like android/i.test(ua)
      , android = !likeAndroid && /android/i.test(ua)
      , edgeVersion = getFirstMatch(/edge\/(\d+(\.\d+)?)/i)
      , versionIdentifier = getFirstMatch(/version\/(\d+(\.\d+)?)/i)
      , tablet = /tablet/i.test(ua)
      , mobile = !tablet && /[^-]mobi/i.test(ua)
      , result

    if (/opera|opr/i.test(ua)) {
      result = {
        name: 'Opera'
      , opera: t
      , version: versionIdentifier || getFirstMatch(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)
      }
    }
    else if (/windows phone/i.test(ua)) {
      result = {
        name: 'Windows Phone'
      , windowsphone: t
      }
      if (edgeVersion) {
        result.msedge = t
        result.version = edgeVersion
      }
      else {
        result.msie = t
        result.version = getFirstMatch(/iemobile\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/msie|trident/i.test(ua)) {
      result = {
        name: 'Internet Explorer'
      , msie: t
      , version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
      }
    }
    else if (/chrome.+? edge/i.test(ua)) {
      result = {
        name: 'Microsoft Edge'
      , msedge: t
      , version: edgeVersion
      }
    }
    else if (/chrome|crios|crmo/i.test(ua)) {
      result = {
        name: 'Chrome'
      , chrome: t
      , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
      }
    }
    else if (iosdevice) {
      result = {
        name : iosdevice == 'iphone' ? 'iPhone' : iosdevice == 'ipad' ? 'iPad' : 'iPod'
      }
      // WTF: version is not part of user agent in web apps
      if (versionIdentifier) {
        result.version = versionIdentifier
      }
    }
    else if (/sailfish/i.test(ua)) {
      result = {
        name: 'Sailfish'
      , sailfish: t
      , version: getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/seamonkey\//i.test(ua)) {
      result = {
        name: 'SeaMonkey'
      , seamonkey: t
      , version: getFirstMatch(/seamonkey\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/firefox|iceweasel/i.test(ua)) {
      result = {
        name: 'Firefox'
      , firefox: t
      , version: getFirstMatch(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i)
      }
      if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(ua)) {
        result.firefoxos = t
      }
    }
    else if (/silk/i.test(ua)) {
      result =  {
        name: 'Amazon Silk'
      , silk: t
      , version : getFirstMatch(/silk\/(\d+(\.\d+)?)/i)
      }
    }
    else if (android) {
      result = {
        name: 'Android'
      , version: versionIdentifier
      }
    }
    else if (/phantom/i.test(ua)) {
      result = {
        name: 'PhantomJS'
      , phantom: t
      , version: getFirstMatch(/phantomjs\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/blackberry|\bbb\d+/i.test(ua) || /rim\stablet/i.test(ua)) {
      result = {
        name: 'BlackBerry'
      , blackberry: t
      , version: versionIdentifier || getFirstMatch(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
      }
    }
    else if (/(web|hpw)os/i.test(ua)) {
      result = {
        name: 'WebOS'
      , webos: t
      , version: versionIdentifier || getFirstMatch(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
      };
      /touchpad\//i.test(ua) && (result.touchpad = t)
    }
    else if (/bada/i.test(ua)) {
      result = {
        name: 'Bada'
      , bada: t
      , version: getFirstMatch(/dolfin\/(\d+(\.\d+)?)/i)
      };
    }
    else if (/tizen/i.test(ua)) {
      result = {
        name: 'Tizen'
      , tizen: t
      , version: getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || versionIdentifier
      };
    }
    else if (/safari/i.test(ua)) {
      result = {
        name: 'Safari'
      , safari: t
      , version: versionIdentifier
      }
    }
    else {
      result = {
        name: getFirstMatch(/^(.*)\/(.*) /),
        version: getSecondMatch(/^(.*)\/(.*) /)
     };
   }

    // set webkit or gecko flag for browsers based on these engines
    if (!result.msedge && /(apple)?webkit/i.test(ua)) {
      result.name = result.name || "Webkit"
      result.webkit = t
      if (!result.version && versionIdentifier) {
        result.version = versionIdentifier
      }
    } else if (!result.opera && /gecko\//i.test(ua)) {
      result.name = result.name || "Gecko"
      result.gecko = t
      result.version = result.version || getFirstMatch(/gecko\/(\d+(\.\d+)?)/i)
    }

    // set OS flags for platforms that have multiple browsers
    if (!result.msedge && (android || result.silk)) {
      result.android = t
    } else if (iosdevice) {
      result[iosdevice] = t
      result.ios = t
    }

    // OS version extraction
    var osVersion = '';
    if (result.windowsphone) {
      osVersion = getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i);
    } else if (iosdevice) {
      osVersion = getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i);
      osVersion = osVersion.replace(/[_\s]/g, '.');
    } else if (android) {
      osVersion = getFirstMatch(/android[ \/-](\d+(\.\d+)*)/i);
    } else if (result.webos) {
      osVersion = getFirstMatch(/(?:web|hpw)os\/(\d+(\.\d+)*)/i);
    } else if (result.blackberry) {
      osVersion = getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i);
    } else if (result.bada) {
      osVersion = getFirstMatch(/bada\/(\d+(\.\d+)*)/i);
    } else if (result.tizen) {
      osVersion = getFirstMatch(/tizen[\/\s](\d+(\.\d+)*)/i);
    }
    if (osVersion) {
      result.osversion = osVersion;
    }

    // device type extraction
    var osMajorVersion = osVersion.split('.')[0];
    if (tablet || iosdevice == 'ipad' || (android && (osMajorVersion == 3 || (osMajorVersion == 4 && !mobile))) || result.silk) {
      result.tablet = t
    } else if (mobile || iosdevice == 'iphone' || iosdevice == 'ipod' || android || result.blackberry || result.webos || result.bada) {
      result.mobile = t
    }

    // Graded Browser Support
    // http://developer.yahoo.com/yui/articles/gbs
    if (result.msedge ||
        (result.msie && result.version >= 10) ||
        (result.chrome && result.version >= 20) ||
        (result.firefox && result.version >= 20.0) ||
        (result.safari && result.version >= 6) ||
        (result.opera && result.version >= 10.0) ||
        (result.ios && result.osversion && result.osversion.split(".")[0] >= 6) ||
        (result.blackberry && result.version >= 10.1)
        ) {
      result.a = t;
    }
    else if ((result.msie && result.version < 10) ||
        (result.chrome && result.version < 20) ||
        (result.firefox && result.version < 20.0) ||
        (result.safari && result.version < 6) ||
        (result.opera && result.version < 10.0) ||
        (result.ios && result.osversion && result.osversion.split(".")[0] < 6)
        ) {
      result.c = t
    } else result.x = t

    return result
  }

  var bowser = detect(typeof navigator !== 'undefined' ? navigator.userAgent : '')

  bowser.test = function (browserList) {
    for (var i = 0; i < browserList.length; ++i) {
      var browserItem = browserList[i];
      if (typeof browserItem=== 'string') {
        if (browserItem in bowser) {
          return true;
        }
      }
    }
    return false;
  }

  /*
   * Set our detect method to the main bowser object so we can
   * reuse it to test other user agents.
   * This is needed to implement future tests.
   */
  bowser._detect = detect;

  return bowser
});

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/bowser/bowser.js","/../../node_modules/bowser")
},{"buffer":3,"rH1JPG":19}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/buffer/index.js","/../../node_modules/buffer")
},{"base64-js":1,"buffer":3,"ieee754":4,"rH1JPG":19}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/ieee754/index.js","/../../node_modules/ieee754")
},{"buffer":3,"rH1JPG":19}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/ms/index.js","/../../node_modules/ms")
},{"buffer":3,"rH1JPG":19}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Dependencies.
 */
var Util = require('./lib/util');
var Keys = require('./lib/keys');
var KbdUtil = require('./lib/kbdutil');
var Input = require('./lib/input');
var Websock = require('./lib/websock');
var Base64 = require('./lib/base64');
var DES = require('./lib/des');
var TINF = require('./lib/tinf');
var Display = require('./lib/display');
var RFB = require('./lib/rfb');



var noVNC = {
	Util: Util,
	Keys: Keys,
	KbdUtil: KbdUtil,
	Input: Input,
	Websock: Websock,
	Base64: Base64,
	DES: DES,
	TINF: TINF,
	Display: Display,
	RFB: RFB
};


module.exports = noVNC;

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/novnc-node/index.js","/../../node_modules/novnc-node")
},{"./lib/base64":7,"./lib/des":8,"./lib/display":9,"./lib/input":10,"./lib/kbdutil":11,"./lib/keys":12,"./lib/rfb":13,"./lib/tinf":14,"./lib/util":15,"./lib/websock":16,"buffer":3,"rH1JPG":19}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Dependencies.
 */
var debugerror = require('debug')('noVNC:ERROR:Base64');
debugerror.log = console.warn.bind(console);


/**
 * Local variables.
 */
var toBase64Table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.split('');
var base64Pad = '=';
var toBinaryTable = [
	-1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1,
	-1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,-1,
	-1,-1,-1,-1, -1,-1,-1,-1, -1,-1,-1,62, -1,-1,-1,63,
	52,53,54,55, 56,57,58,59, 60,61,-1,-1, -1, 0,-1,-1,
	-1, 0, 1, 2,  3, 4, 5, 6,  7, 8, 9,10, 11,12,13,14,
	15,16,17,18, 19,20,21,22, 23,24,25,-1, -1,-1,-1,-1,
	-1,26,27,28, 29,30,31,32, 33,34,35,36, 37,38,39,40,
	41,42,43,44, 45,46,47,48, 49,50,51,-1, -1,-1,-1,-1
];


/**
 * Expose the Base64 Object.
 */
module.exports = {
	encode: function (data) {
		var result = '';
		var length = data.length;
		var lengthpad = (length % 3);

		// Convert every three bytes to 4 ascii characters.
		for (var i = 0; i < (length - 2); i += 3) {
			result += toBase64Table[data[i] >> 2];
			result += toBase64Table[((data[i] & 0x03) << 4) + (data[i + 1] >> 4)];
			result += toBase64Table[((data[i + 1] & 0x0f) << 2) + (data[i + 2] >> 6)];
			result += toBase64Table[data[i + 2] & 0x3f];
		}

		// Convert the remaining 1 or 2 bytes, pad out to 4 characters.
		var j = 0;
		if (lengthpad === 2) {
			j = length - lengthpad;
			result += toBase64Table[data[j] >> 2];
			result += toBase64Table[((data[j] & 0x03) << 4) + (data[j + 1] >> 4)];
			result += toBase64Table[(data[j + 1] & 0x0f) << 2];
			result += toBase64Table[64];
		} else if (lengthpad === 1) {
			j = length - lengthpad;
			result += toBase64Table[data[j] >> 2];
			result += toBase64Table[(data[j] & 0x03) << 4];
			result += toBase64Table[64];
			result += toBase64Table[64];
		}

		return result;
	},

	decode: function (data, offset) {
		offset = typeof(offset) !== 'undefined' ? offset : 0;
		var result, result_length;
		var leftbits = 0; // number of bits decoded, but yet to be appended
		var leftdata = 0; // bits decoded, but yet to be appended
		var data_length = data.indexOf('=') - offset;

		if (data_length < 0) { data_length = data.length - offset; }

		/* Every four characters is 3 resulting numbers */
		result_length = (data_length >> 2) * 3 + Math.floor((data_length % 4) / 1.5);
		result = new Array(result_length);

		// Convert one by one.
		for (var idx = 0, i = offset; i < data.length; i++) {
			var c = toBinaryTable[data.charCodeAt(i) & 0x7f];
			var padding = (data.charAt(i) === base64Pad);
			// Skip illegal characters and whitespace
			if (c === -1) {
				debugerror('decode() | illegal character code ' + data.charCodeAt(i) + ' at position ' + i);
				continue;
			}

			// Collect data into leftdata, update bitcount
			leftdata = (leftdata << 6) | c;
			leftbits += 6;

			// If we have 8 or more bits, append 8 bits to the result
			if (leftbits >= 8) {
				leftbits -= 8;
				// Append if not padding.
				if (!padding) {
					result[idx++] = (leftdata >> leftbits) & 0xff;
				}
				leftdata &= (1 << leftbits) - 1;
			}
		}

		// If there are any bits left, the base64 string was corrupted
		if (leftbits) {
			debugerror('decode() | corrupted Base64 string');
			var err = new Error('Corrupted Base64 string');
			err.name = 'Base64-Error';
			throw err;
		}

		return result;
	}
};

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/novnc-node/lib/base64.js","/../../node_modules/novnc-node/lib")
},{"buffer":3,"debug":17,"rH1JPG":19}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*
 * Ported from Flashlight VNC ActionScript implementation:
 *     http://www.wizhelp.com/flashlight-vnc/
 *
 * Full attribution follows:
 *
 * -------------------------------------------------------------------------
 *
 * This DES class has been extracted from package Acme.Crypto for use in VNC.
 * The unnecessary odd parity code has been removed.
 *
 * These changes are:
 *  Copyright (C) 1999 AT&T Laboratories Cambridge.  All Rights Reserved.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *

 * DesCipher - the DES encryption method
 *
 * The meat of this code is by Dave Zimmerman <dzimm@widget.com>, and is:
 *
 * Copyright (c) 1996 Widget Workshop, Inc. All Rights Reserved.
 *
 * Permission to use, copy, modify, and distribute this software
 * and its documentation for NON-COMMERCIAL or COMMERCIAL purposes and
 * without fee is hereby granted, provided that this copyright notice is kept
 * intact.
 *
 * WIDGET WORKSHOP MAKES NO REPRESENTATIONS OR WARRANTIES ABOUT THE SUITABILITY
 * OF THE SOFTWARE, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WIDGET WORKSHOP SHALL NOT BE LIABLE
 * FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING, MODIFYING OR
 * DISTRIBUTING THIS SOFTWARE OR ITS DERIVATIVES.
 *
 * THIS SOFTWARE IS NOT DESIGNED OR INTENDED FOR USE OR RESALE AS ON-LINE
 * CONTROL EQUIPMENT IN HAZARDOUS ENVIRONMENTS REQUIRING FAIL-SAFE
 * PERFORMANCE, SUCH AS IN THE OPERATION OF NUCLEAR FACILITIES, AIRCRAFT
 * NAVIGATION OR COMMUNICATION SYSTEMS, AIR TRAFFIC CONTROL, DIRECT LIFE
 * SUPPORT MACHINES, OR WEAPONS SYSTEMS, IN WHICH THE FAILURE OF THE
 * SOFTWARE COULD LEAD DIRECTLY TO DEATH, PERSONAL INJURY, OR SEVERE
 * PHYSICAL OR ENVIRONMENTAL DAMAGE ("HIGH RISK ACTIVITIES").  WIDGET WORKSHOP
 * SPECIFICALLY DISCLAIMS ANY EXPRESS OR IMPLIED WARRANTY OF FITNESS FOR
 * HIGH RISK ACTIVITIES.
 *
 *
 * The rest is:
 *
 * Copyright (C) 1996 by Jef Poskanzer <jef@acme.com>.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS ``AS IS'' AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 *
 * Visit the ACME Labs Java page for up-to-date versions of this and other
 * fine Java utilities: http://www.acme.com/java/
 */


// Tables, permutations, S-boxes, etc.
var PC2 = [13,16,10,23, 0, 4, 2,27,14, 5,20, 9,22,18,11, 3,
		   25, 7,15, 6,26,19,12, 1,40,51,30,36,46,54,29,39,
		   50,44,32,47,43,48,38,55,33,52,45,41,49,35,28,31 ],
	totrot = [ 1, 2, 4, 6, 8,10,12,14,15,17,19,21,23,25,27,28],
	z = 0x0, a,b,c,d,e,f, SP1,SP2,SP3,SP4,SP5,SP6,SP7,SP8,
	keys = [];

a=1<<16; b=1<<24; c=a|b; d=1<<2; e=1<<10; f=d|e;
SP1 = [c|e,z|z,a|z,c|f,c|d,a|f,z|d,a|z,z|e,c|e,c|f,z|e,b|f,c|d,b|z,z|d,
	   z|f,b|e,b|e,a|e,a|e,c|z,c|z,b|f,a|d,b|d,b|d,a|d,z|z,z|f,a|f,b|z,
	   a|z,c|f,z|d,c|z,c|e,b|z,b|z,z|e,c|d,a|z,a|e,b|d,z|e,z|d,b|f,a|f,
	   c|f,a|d,c|z,b|f,b|d,z|f,a|f,c|e,z|f,b|e,b|e,z|z,a|d,a|e,z|z,c|d];

a=1<<20; b=1<<31; c=a|b; d=1<<5; e=1<<15; f=d|e;
SP2 = [c|f,b|e,z|e,a|f,a|z,z|d,c|d,b|f,b|d,c|f,c|e,b|z,b|e,a|z,z|d,c|d,
	   a|e,a|d,b|f,z|z,b|z,z|e,a|f,c|z,a|d,b|d,z|z,a|e,z|f,c|e,c|z,z|f,
	   z|z,a|f,c|d,a|z,b|f,c|z,c|e,z|e,c|z,b|e,z|d,c|f,a|f,z|d,z|e,b|z,
	   z|f,c|e,a|z,b|d,a|d,b|f,b|d,a|d,a|e,z|z,b|e,z|f,b|z,c|d,c|f,a|e];

a=1<<17; b=1<<27; c=a|b; d=1<<3; e=1<<9; f=d|e;
SP3 = [z|f,c|e,z|z,c|d,b|e,z|z,a|f,b|e,a|d,b|d,b|d,a|z,c|f,a|d,c|z,z|f,
	   b|z,z|d,c|e,z|e,a|e,c|z,c|d,a|f,b|f,a|e,a|z,b|f,z|d,c|f,z|e,b|z,
	   c|e,b|z,a|d,z|f,a|z,c|e,b|e,z|z,z|e,a|d,c|f,b|e,b|d,z|e,z|z,c|d,
	   b|f,a|z,b|z,c|f,z|d,a|f,a|e,b|d,c|z,b|f,z|f,c|z,a|f,z|d,c|d,a|e];

a=1<<13; b=1<<23; c=a|b; d=1<<0; e=1<<7; f=d|e;
SP4 = [c|d,a|f,a|f,z|e,c|e,b|f,b|d,a|d,z|z,c|z,c|z,c|f,z|f,z|z,b|e,b|d,
	   z|d,a|z,b|z,c|d,z|e,b|z,a|d,a|e,b|f,z|d,a|e,b|e,a|z,c|e,c|f,z|f,
	   b|e,b|d,c|z,c|f,z|f,z|z,z|z,c|z,a|e,b|e,b|f,z|d,c|d,a|f,a|f,z|e,
	   c|f,z|f,z|d,a|z,b|d,a|d,c|e,b|f,a|d,a|e,b|z,c|d,z|e,b|z,a|z,c|e];

a=1<<25; b=1<<30; c=a|b; d=1<<8; e=1<<19; f=d|e;
SP5 = [z|d,a|f,a|e,c|d,z|e,z|d,b|z,a|e,b|f,z|e,a|d,b|f,c|d,c|e,z|f,b|z,
	   a|z,b|e,b|e,z|z,b|d,c|f,c|f,a|d,c|e,b|d,z|z,c|z,a|f,a|z,c|z,z|f,
	   z|e,c|d,z|d,a|z,b|z,a|e,c|d,b|f,a|d,b|z,c|e,a|f,b|f,z|d,a|z,c|e,
	   c|f,z|f,c|z,c|f,a|e,z|z,b|e,c|z,z|f,a|d,b|d,z|e,z|z,b|e,a|f,b|d];

a=1<<22; b=1<<29; c=a|b; d=1<<4; e=1<<14; f=d|e;
SP6 = [b|d,c|z,z|e,c|f,c|z,z|d,c|f,a|z,b|e,a|f,a|z,b|d,a|d,b|e,b|z,z|f,
	   z|z,a|d,b|f,z|e,a|e,b|f,z|d,c|d,c|d,z|z,a|f,c|e,z|f,a|e,c|e,b|z,
	   b|e,z|d,c|d,a|e,c|f,a|z,z|f,b|d,a|z,b|e,b|z,z|f,b|d,c|f,a|e,c|z,
	   a|f,c|e,z|z,c|d,z|d,z|e,c|z,a|f,z|e,a|d,b|f,z|z,c|e,b|z,a|d,b|f];

a=1<<21; b=1<<26; c=a|b; d=1<<1; e=1<<11; f=d|e;
SP7 = [a|z,c|d,b|f,z|z,z|e,b|f,a|f,c|e,c|f,a|z,z|z,b|d,z|d,b|z,c|d,z|f,
	   b|e,a|f,a|d,b|e,b|d,c|z,c|e,a|d,c|z,z|e,z|f,c|f,a|e,z|d,b|z,a|e,
	   b|z,a|e,a|z,b|f,b|f,c|d,c|d,z|d,a|d,b|z,b|e,a|z,c|e,z|f,a|f,c|e,
	   z|f,b|d,c|f,c|z,a|e,z|z,z|d,c|f,z|z,a|f,c|z,z|e,b|d,b|e,z|e,a|d];

a=1<<18; b=1<<28; c=a|b; d=1<<6; e=1<<12; f=d|e;
SP8 = [b|f,z|e,a|z,c|f,b|z,b|f,z|d,b|z,a|d,c|z,c|f,a|e,c|e,a|f,z|e,z|d,
	   c|z,b|d,b|e,z|f,a|e,a|d,c|d,c|e,z|f,z|z,z|z,c|d,b|d,b|e,a|f,a|z,
	   a|f,a|z,c|e,z|e,z|d,c|d,z|e,a|f,b|e,z|d,b|d,c|z,c|d,b|z,a|z,b|f,
	   z|z,c|f,a|d,b|d,c|z,b|e,b|f,z|z,c|f,a|e,a|e,z|f,z|f,a|d,b|z,c|e];


/**
 * Expose the DES function.
 */
module.exports = function (passwd) {
	setKeys(passwd);             // Setup keys
	return {'encrypt': encrypt}; // Public interface
};


/**
 * Private API.
 */


// Set the key.
function setKeys(keyBlock) {
	var i, j, l, m, n, o, pc1m = [], pcr = [], kn = [],
		raw0, raw1, rawi, KnLi;

	for (j = 0, l = 56; j < 56; ++j, l -= 8) {
		l += l < -5 ? 65 : l < -3 ? 31 : l < -1 ? 63 : l === 27 ? 35 : 0; // PC1
		m = l & 0x7;
		pc1m[j] = ((keyBlock[l >>> 3] & (1<<m)) !== 0) ? 1: 0;
	}

	for (i = 0; i < 16; ++i) {
		m = i << 1;
		n = m + 1;
		kn[m] = kn[n] = 0;
		for (o = 28; o < 59; o += 28) {
			for (j = o - 28; j < o; ++j) {
				l = j + totrot[i];
				if (l < o) {
					pcr[j] = pc1m[l];
				} else {
					pcr[j] = pc1m[l - 28];
				}
			}
		}
		for (j = 0; j < 24; ++j) {
			if (pcr[PC2[j]] !== 0) {
				kn[m] |= 1 << (23 - j);
			}
			if (pcr[PC2[j + 24]] !== 0) {
				kn[n] |= 1 << (23 - j);
			}
		}
	}

	// cookey
	for (i = 0, rawi = 0, KnLi = 0; i < 16; ++i) {
		raw0 = kn[rawi++];
		raw1 = kn[rawi++];
		keys[KnLi] = (raw0 & 0x00fc0000) << 6;
		keys[KnLi] |= (raw0 & 0x00000fc0) << 10;
		keys[KnLi] |= (raw1 & 0x00fc0000) >>> 10;
		keys[KnLi] |= (raw1 & 0x00000fc0) >>> 6;
		++KnLi;
		keys[KnLi] = (raw0 & 0x0003f000) << 12;
		keys[KnLi] |= (raw0 & 0x0000003f) << 16;
		keys[KnLi] |= (raw1 & 0x0003f000) >>> 4;
		keys[KnLi] |= (raw1 & 0x0000003f);
		++KnLi;
	}
}


// Encrypt 8 bytes of text
function enc8(text) {
	var i = 0, b = text.slice(), fval, keysi = 0,
		l, r, x; // left, right, accumulator

	// Squash 8 bytes to 2 ints
	l = b[i++]<<24 | b[i++]<<16 | b[i++]<<8 | b[i++];
	r = b[i++]<<24 | b[i++]<<16 | b[i++]<<8 | b[i++];

	x = ((l >>> 4) ^ r) & 0x0f0f0f0f;
	r ^= x;
	l ^= (x << 4);
	x = ((l >>> 16) ^ r) & 0x0000ffff;
	r ^= x;
	l ^= (x << 16);
	x = ((r >>> 2) ^ l) & 0x33333333;
	l ^= x;
	r ^= (x << 2);
	x = ((r >>> 8) ^ l) & 0x00ff00ff;
	l ^= x;
	r ^= (x << 8);
	r = (r << 1) | ((r >>> 31) & 1);
	x = (l ^ r) & 0xaaaaaaaa;
	l ^= x;
	r ^= x;
	l = (l << 1) | ((l >>> 31) & 1);

	for (i = 0; i < 8; ++i) {
		x = (r << 28) | (r >>> 4);
		x ^= keys[keysi++];
		fval =  SP7[x & 0x3f];
		fval |= SP5[(x >>> 8) & 0x3f];
		fval |= SP3[(x >>> 16) & 0x3f];
		fval |= SP1[(x >>> 24) & 0x3f];
		x = r ^ keys[keysi++];
		fval |= SP8[x & 0x3f];
		fval |= SP6[(x >>> 8) & 0x3f];
		fval |= SP4[(x >>> 16) & 0x3f];
		fval |= SP2[(x >>> 24) & 0x3f];
		l ^= fval;
		x = (l << 28) | (l >>> 4);
		x ^= keys[keysi++];
		fval =  SP7[x & 0x3f];
		fval |= SP5[(x >>> 8) & 0x3f];
		fval |= SP3[(x >>> 16) & 0x3f];
		fval |= SP1[(x >>> 24) & 0x3f];
		x = l ^ keys[keysi++];
		fval |= SP8[x & 0x0000003f];
		fval |= SP6[(x >>> 8) & 0x3f];
		fval |= SP4[(x >>> 16) & 0x3f];
		fval |= SP2[(x >>> 24) & 0x3f];
		r ^= fval;
	}

	r = (r << 31) | (r >>> 1);
	x = (l ^ r) & 0xaaaaaaaa;
	l ^= x;
	r ^= x;
	l = (l << 31) | (l >>> 1);
	x = ((l >>> 8) ^ r) & 0x00ff00ff;
	r ^= x;
	l ^= (x << 8);
	x = ((l >>> 2) ^ r) & 0x33333333;
	r ^= x;
	l ^= (x << 2);
	x = ((r >>> 16) ^ l) & 0x0000ffff;
	l ^= x;
	r ^= (x << 16);
	x = ((r >>> 4) ^ l) & 0x0f0f0f0f;
	l ^= x;
	r ^= (x << 4);

	// Spread ints to bytes
	x = [r, l];
	for (i = 0; i < 8; i++) {
		b[i] = (x[i>>>2] >>> (8 * (3 - (i % 4)))) % 256;
		if (b[i] < 0) { b[i] += 256; } // unsigned
	}
	return b;
}


// Encrypt 16 bytes of text using passwd as key
function encrypt(t) {
	return enc8(t.slice(0, 8)).concat(enc8(t.slice(8, 16)));
}

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/novnc-node/lib/des.js","/../../node_modules/novnc-node/lib")
},{"buffer":3,"rH1JPG":19}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*
 * noVNC: HTML5 VNC client
 * Copyright (C) 2012 Joel Martin
 * Copyright (C) 2015 Samuel Mannehed for Cendio AB
 * Licensed under MPL 2.0 (see LICENSE.txt)
 */


/**
 * Expose the Display class.
 */
module.exports = Display;


/**
 * Dependencies.
 */
var debug = require('debug')('noVNC:Display');
var debugerror = require('debug')('noVNC:ERROR:Display');
debugerror.log = console.warn.bind(console);
var browser = require('bowser').browser;
var Util = require('./util');
var Base64 = require('./base64');


function Display (defaults) {
	debug('new()');

	this._drawCtx = null;
	this._c_forceCanvas = false;

	this._renderQ = [];  // queue drawing actions for in-oder rendering

	// the full frame buffer (logical canvas) size
	this._fb_width = 0;
	this._fb_height = 0;

	// the size limit of the viewport (start disabled)
	this._maxWidth = 0;
	this._maxHeight = 0;

	// the visible 'physical canvas' viewport
	this._viewportLoc = { 'x': 0, 'y': 0, 'w': 0, 'h': 0 };
	this._cleanRect = { 'x1': 0, 'y1': 0, 'x2': -1, 'y2': -1 };

	this._prevDrawStyle = '';
	this._tile = null;
	this._tile16x16 = null;
	this._tile_x = 0;
	this._tile_y = 0;

	Util.set_defaults(this, defaults, {
		'true_color': true,
		'colourMap': [],
		'scale': 1.0,
		'viewport': false,
		'render_mode': ''
	});

	if (!this._target) {
		throw new Error('Target must be set');
	}

	if (typeof this._target === 'string') {
		throw new Error('target must be a DOM element');
	}

	if (!this._target.getContext) {
		throw new Error('no getContext method');
	}

	if (!this._drawCtx) {
		this._drawCtx = this._target.getContext('2d');
	}

	this.clear();

	// Check canvas features
	if ('createImageData' in this._drawCtx) {
		this._render_mode = 'canvas rendering';
	} else {
		throw new Error('Canvas does not support createImageData');
	}

	if (this._prefer_js === null) {
		this._prefer_js = true;
	}

	// Determine browser support for setting the cursor via data URI scheme
	if (this._cursor_uri || this._cursor_uri === null ||
	  this._cursor_uri === undefined) {
	  this._cursor_uri = Util.browserSupportsCursorURIs();
	}
}


Display.prototype = {
	// Public methods
	viewportChangePos: function (deltaX, deltaY) {
		var vp = this._viewportLoc;

		if (!this._viewport) {
			deltaX = -vp.w;  // clamped later of out of bounds
			deltaY = -vp.h;
		}

		var vx2 = vp.x + vp.w - 1;
		var vy2 = vp.y + vp.h - 1;

		// Position change

		if (deltaX < 0 && vp.x + deltaX < 0) {
			deltaX = -vp.x;
		}
		if (vx2 + deltaX >= this._fb_width) {
			deltaX -= vx2 + deltaX - this._fb_width + 1;
		}

		if (vp.y + deltaY < 0) {
			deltaY = -vp.y;
		}
		if (vy2 + deltaY >= this._fb_height) {
			deltaY -= (vy2 + deltaY - this._fb_height + 1);
		}

		if (deltaX === 0 && deltaY === 0) {
			return;
		}
		debug('viewportChangePos() | deltaX: ' + deltaX + ', deltaY: ' + deltaY);

		vp.x += deltaX;
		vx2 += deltaX;
		vp.y += deltaY;
		vy2 += deltaY;

		// Update the clean rectangle
		var cr = this._cleanRect;
		if (vp.x > cr.x1) {
			cr.x1 = vp.x;
		}
		if (vx2 < cr.x2) {
			cr.x2 = vx2;
		}
		if (vp.y > cr.y1) {
			cr.y1 = vp.y;
		}
		if (vy2 < cr.y2) {
			cr.y2 = vy2;
		}

		var x1, w;
		if (deltaX < 0) {
			// Shift viewport left, redraw left section
			x1 = 0;
			w = -deltaX;
		} else {
			// Shift viewport right, redraw right section
			x1 = vp.w - deltaX;
			w = deltaX;
		}

		var y1, h;
		if (deltaY < 0) {
			// Shift viewport up, redraw top section
			y1 = 0;
			h = -deltaY;
		} else {
			// Shift viewport down, redraw bottom section
			y1 = vp.h - deltaY;
			h = deltaY;
		}

		// Copy the valid part of the viewport to the shifted location
		var saveStyle = this._drawCtx.fillStyle;
		var canvas = this._target;
		this._drawCtx.fillStyle = 'rgb(255,255,255)';
		if (deltaX !== 0) {
			this._drawCtx.drawImage(canvas, 0, 0, vp.w, vp.h, -deltaX, 0, vp.w, vp.h);
			this._drawCtx.fillRect(x1, 0, w, vp.h);
		}
		if (deltaY !== 0) {
			this._drawCtx.drawImage(canvas, 0, 0, vp.w, vp.h, 0, -deltaY, vp.w, vp.h);
			this._drawCtx.fillRect(0, y1, vp.w, h);
		}
		this._drawCtx.fillStyle = saveStyle;
	},

	viewportChangeSize: function(width, height) {
		if (typeof(width) === 'undefined' || typeof(height) === 'undefined') {
			debug('viewportChangeSize() | setting viewport to full display region');
			width = this._fb_width;
			height = this._fb_height;
		}

		var vp = this._viewportLoc;

		if (vp.w !== width || vp.h !== height) {
			if (this._viewport) {
				if (this._maxWidth !== 0 && width > this._maxWidth) {
					width = this._maxWidth;
				}
				if (this._maxHeight !== 0 && height > this._maxHeight) {
					height = this._maxHeight;
				}
			}

			var cr = this._cleanRect;

			if (width < vp.w &&  cr.x2 > vp.x + width - 1) {
				cr.x2 = vp.x + width - 1;
			}

			if (height < vp.h &&  cr.y2 > vp.y + height - 1) {
				cr.y2 = vp.y + height - 1;
			}

			vp.w = width;
			vp.h = height;

			var canvas = this._target;

			if (canvas.width !== width || canvas.height !== height) {
				// We have to save the canvas data since changing the size will clear it
				var saveImg = null;

				if (vp.w > 0 && vp.h > 0 && canvas.width > 0 && canvas.height > 0) {
					var img_width = canvas.width < vp.w ? canvas.width : vp.w;
					var img_height = canvas.height < vp.h ? canvas.height : vp.h;
					saveImg = this._drawCtx.getImageData(0, 0, img_width, img_height);
				}

				if (canvas.width !== width) {
					canvas.width = width;
					canvas.style.width = width + 'px';
				}
				if (canvas.height !== height) {
					canvas.height = height;
					canvas.style.height = height + 'px';
				}

				if (saveImg) {
					this._drawCtx.putImageData(saveImg, 0, 0);
				}
			}
		}
	},

	// Return a map of clean and dirty areas of the viewport and reset the
	// tracking of clean and dirty areas
	//
	// Returns: { 'cleanBox': { 'x': x, 'y': y, 'w': w, 'h': h},
	//            'dirtyBoxes': [{ 'x': x, 'y': y, 'w': w, 'h': h }, ...] }
	getCleanDirtyReset: function () {
		var vp = this._viewportLoc;
		var cr = this._cleanRect;

		var cleanBox = { 'x': cr.x1, 'y': cr.y1,
						 'w': cr.x2 - cr.x1 + 1, 'h': cr.y2 - cr.y1 + 1 };

		var dirtyBoxes = [];
		if (cr.x1 >= cr.x2 || cr.y1 >= cr.y2) {
			// Whole viewport is dirty
			dirtyBoxes.push({ 'x': vp.x, 'y': vp.y, 'w': vp.w, 'h': vp.h });
		} else {
			// Redraw dirty regions
			var vx2 = vp.x + vp.w - 1;
			var vy2 = vp.y + vp.h - 1;

			if (vp.x < cr.x1) {
				// left side dirty region
				dirtyBoxes.push({'x': vp.x, 'y': vp.y,
								 'w': cr.x1 - vp.x + 1, 'h': vp.h});
			}
			if (vx2 > cr.x2) {
				// right side dirty region
				dirtyBoxes.push({'x': cr.x2 + 1, 'y': vp.y,
								 'w': vx2 - cr.x2, 'h': vp.h});
			}
			if(vp.y < cr.y1) {
				// top/middle dirty region
				dirtyBoxes.push({'x': cr.x1, 'y': vp.y,
								 'w': cr.x2 - cr.x1 + 1, 'h': cr.y1 - vp.y});
			}
			if (vy2 > cr.y2) {
				// bottom/middle dirty region
				dirtyBoxes.push({'x': cr.x1, 'y': cr.y2 + 1,
								 'w': cr.x2 - cr.x1 + 1, 'h': vy2 - cr.y2});
			}
		}

		this._cleanRect = {'x1': vp.x, 'y1': vp.y,
							 'x2': vp.x + vp.w - 1, 'y2': vp.y + vp.h - 1};

		return {'cleanBox': cleanBox, 'dirtyBoxes': dirtyBoxes};
	},

	absX: function (x) {
		return x + this._viewportLoc.x;
	},

	absY: function (y) {
		return y + this._viewportLoc.y;
	},

	resize: function (width, height) {
		this._prevDrawStyle = '';

		this._fb_width = width;
		this._fb_height = height;

		this._rescale(this._scale);

		this.viewportChangeSize();
	},

	clear: function () {
		if (this._logo) {
			this.resize(this._logo.width, this._logo.height);
			this.blitStringImage(this._logo.data, 0, 0);
		} else {
			if (browser.msie && parseInt(browser.version) === 10) {
				// NB(directxman12): there's a bug in IE10 where we can fail to actually
				//                   clear the canvas here because of the resize.
				//                   Clearing the current viewport first fixes the issue
				this._drawCtx.clearRect(0, 0, this._viewportLoc.w, this._viewportLoc.h);
			}
			this.resize(240, 20);
			this._drawCtx.clearRect(0, 0, this._viewportLoc.w, this._viewportLoc.h);
		}

		this._renderQ = [];
	},

	fillRect: function (x, y, width, height, color) {
		this._setFillColor(color);
		this._drawCtx.fillRect(x - this._viewportLoc.x, y - this._viewportLoc.y, width, height);
	},

	copyImage: function (old_x, old_y, new_x, new_y, w, h) {
		var x1 = old_x - this._viewportLoc.x;
		var y1 = old_y - this._viewportLoc.y;
		var x2 = new_x - this._viewportLoc.x;
		var y2 = new_y - this._viewportLoc.y;

		this._drawCtx.drawImage(this._target, x1, y1, w, h, x2, y2, w, h);
	},

	// start updating a tile
	startTile: function (x, y, width, height, color) {
		this._tile_x = x;
		this._tile_y = y;
		if (width === 16 && height === 16) {
			this._tile = this._tile16x16;
		} else {
			this._tile = this._drawCtx.createImageData(width, height);
		}

		if (this._prefer_js) {
			var bgr;
			if (this._true_color) {
				bgr = color;
			} else {
				bgr = this._colourMap[color[0]];
			}
			var red = bgr[2];
			var green = bgr[1];
			var blue = bgr[0];

			var data = this._tile.data;
			for (var i = 0; i < width * height * 4; i += 4) {
				data[i] = red;
				data[i + 1] = green;
				data[i + 2] = blue;
				data[i + 3] = 255;
			}
		} else {
			this.fillRect(x, y, width, height, color);
		}
	},

	// update sub-rectangle of the current tile
	subTile: function (x, y, w, h, color) {
		if (this._prefer_js) {
			var bgr;
			if (this._true_color) {
				bgr = color;
			} else {
				bgr = this._colourMap[color[0]];
			}
			var red = bgr[2];
			var green = bgr[1];
			var blue = bgr[0];
			var xend = x + w;
			var yend = y + h;

			var data = this._tile.data;
			var width = this._tile.width;
			for (var j = y; j < yend; j++) {
				for (var i = x; i < xend; i++) {
					var p = (i + (j * width)) * 4;
					data[p] = red;
					data[p + 1] = green;
					data[p + 2] = blue;
					data[p + 3] = 255;
				}
			}
		} else {
			this.fillRect(this._tile_x + x, this._tile_y + y, w, h, color);
		}
	},

	// draw the current tile to the screen
	finishTile: function () {
		if (this._prefer_js) {
			this._drawCtx.putImageData(this._tile, this._tile_x - this._viewportLoc.x,
										 this._tile_y - this._viewportLoc.y);
		}
		// else: No-op -- already done by setSubTile
	},

	blitImage: function (x, y, width, height, arr, offset) {
		if (this._true_color) {
			this._bgrxImageData(x, y, this._viewportLoc.x, this._viewportLoc.y, width, height, arr, offset);
		} else {
			this._cmapImageData(x, y, this._viewportLoc.x, this._viewportLoc.y, width, height, arr, offset);
		}
	},

	blitRgbImage: function (x, y , width, height, arr, offset) {
		if (this._true_color) {
			this._rgbImageData(x, y, this._viewportLoc.x, this._viewportLoc.y, width, height, arr, offset);
		} else {
			// probably wrong?
			this._cmapImageData(x, y, this._viewportLoc.x, this._viewportLoc.y, width, height, arr, offset);
		}
	},

	blitStringImage: function (str, x, y) {
		var img = new Image();
		img.onload = function () {
			this._drawCtx.drawImage(img, x - this._viewportLoc.x, y - this._viewportLoc.y);
		}.bind(this);
		img.src = str;
		return img; // for debugging purposes
	},

	// wrap ctx.drawImage but relative to viewport
	drawImage: function (img, x, y) {
		this._drawCtx.drawImage(img, x - this._viewportLoc.x, y - this._viewportLoc.y);
	},

	renderQ_push: function (action) {
		this._renderQ.push(action);
		if (this._renderQ.length === 1) {
			// If this can be rendered immediately it will be, otherwise
			// the scanner will start polling the queue (every
			// requestAnimationFrame interval)
			this._scan_renderQ();
		}
	},

	changeCursor: function (pixels, mask, hotx, hoty, w, h) {
		if (this._cursor_uri === false) {
			debugerror('changeCursor() | called but no cursor data URI support');
			return;
		}

		if (this._true_color) {
			Display.changeCursor(this._target, pixels, mask, hotx, hoty, w, h);
		} else {
			Display.changeCursor(this._target, pixels, mask, hotx, hoty, w, h, this._colourMap);
		}
	},

	defaultCursor: function () {
		this._target.style.cursor = 'default';
	},

	disableLocalCursor: function () {
		this._target.style.cursor = 'none';
	},

	clippingDisplay: function () {
		var vp = this._viewportLoc;

		var fbClip = this._fb_width > vp.w || this._fb_height > vp.h;
		var limitedVp = this._maxWidth !== 0 && this._maxHeight !== 0;
		var clipping = false;

		if (limitedVp) {
			clipping = vp.w > this._maxWidth || vp.h > this._maxHeight;
		}

		return fbClip || (limitedVp && clipping);
	},

	// Overridden getters/setters
	get_context: function () {
		return this._drawCtx;
	},

	set_scale: function (scale) {
		this._rescale(scale);
	},

	set_width: function (w) {
		this._fb_width = w;
	},

	get_width: function () {
		return this._fb_width;
	},

	set_height: function (h) {
		this._fb_height =  h;
	},

	get_height: function () {
		return this._fb_height;
	},

	autoscale: function (containerWidth, containerHeight, downscaleOnly) {
		var targetAspectRatio = containerWidth / containerHeight;
		var fbAspectRatio = this._fb_width / this._fb_height;

		var scaleRatio;
		if (fbAspectRatio >= targetAspectRatio) {
				scaleRatio = containerWidth / this._fb_width;
		} else {
				scaleRatio = containerHeight / this._fb_height;
		}

		var targetW, targetH;
		if (scaleRatio > 1.0 && downscaleOnly) {
				targetW = this._fb_width;
				targetH = this._fb_height;
				scaleRatio = 1.0;
		} else if (fbAspectRatio >= targetAspectRatio) {
				targetW = containerWidth;
				targetH = Math.round(containerWidth / fbAspectRatio);
		} else {
				targetW = Math.round(containerHeight * fbAspectRatio);
				targetH = containerHeight;
		}

		// NB(directxman12): If you set the width directly, or set the
		//                   style width to a number, the canvas is cleared.
		//                   However, if you set the style width to a string
		//                   ('NNNpx'), the canvas is scaled without clearing.
		this._target.style.width = targetW + 'px';
		this._target.style.height = targetH + 'px';

		this._scale = scaleRatio;

		return scaleRatio;  // so that the mouse, etc scale can be set
	},

	// Private Methods

	_rescale: function (factor) {
		this._scale = factor;

		var w;
		var h;

		if (this._viewport &&
			this._maxWidth !== 0 && this._maxHeight !== 0) {
			w = Math.min(this._fb_width, this._maxWidth);
			h = Math.min(this._fb_height, this._maxHeight);
		} else {
			w = this._fb_width;
			h = this._fb_height;
		}

		this._target.style.width = Math.round(factor * w) + 'px';
		this._target.style.height = Math.round(factor * h) + 'px';
	},

	_setFillColor: function (color) {
		var bgr;
		if (this._true_color) {
			bgr = color;
		} else {
			bgr = this._colourMap[color[0]];
		}

		var newStyle = 'rgb(' + bgr[2] + ',' + bgr[1] + ',' + bgr[0] + ')';
		if (newStyle !== this._prevDrawStyle) {
			this._drawCtx.fillStyle = newStyle;
			this._prevDrawStyle = newStyle;
		}
	},

	_rgbImageData: function (x, y, vx, vy, width, height, arr, offset) {
		var img = this._drawCtx.createImageData(width, height);
		var data = img.data;

		for (var i = 0, j = offset; i < width * height * 4; i += 4, j += 3) {
			data[i]     = arr[j];
			data[i + 1] = arr[j + 1];
			data[i + 2] = arr[j + 2];
			data[i + 3] = 255;  // Alpha
		}
		this._drawCtx.putImageData(img, x - vx, y - vy);
	},

	_bgrxImageData: function (x, y, vx, vy, width, height, arr, offset) {
		var img = this._drawCtx.createImageData(width, height);
		var data = img.data;
		for (var i = 0, j = offset; i < width * height * 4; i += 4, j += 4) {
			data[i]     = arr[j + 2];
			data[i + 1] = arr[j + 1];
			data[i + 2] = arr[j];
			data[i + 3] = 255;  // Alpha
		}
		this._drawCtx.putImageData(img, x - vx, y - vy);
	},

	_cmapImageData: function (x, y, vx, vy, width, height, arr, offset) {
		var img = this._drawCtx.createImageData(width, height);
		var data = img.data;
		var cmap = this._colourMap;
		for (var i = 0, j = offset; i < width * height * 4; i += 4, j++) {
			var bgr = cmap[arr[j]];
			data[i]     = bgr[2];
			data[i + 1] = bgr[1];
			data[i + 2] = bgr[0];
			data[i + 3] = 255;  // Alpha
		}
		this._drawCtx.putImageData(img, x - vx, y - vy);
	},

	_scan_renderQ: function () {
		var ready = true;
		while (ready && this._renderQ.length > 0) {
			var a = this._renderQ[0];
			switch (a.type) {
				case 'copy':
					this.copyImage(a.old_x, a.old_y, a.x, a.y, a.width, a.height);
					break;
				case 'fill':
					this.fillRect(a.x, a.y, a.width, a.height, a.color);
					break;
				case 'blit':
					this.blitImage(a.x, a.y, a.width, a.height, a.data, 0);
					break;
				case 'blitRgb':
					this.blitRgbImage(a.x, a.y, a.width, a.height, a.data, 0);
					break;
				case 'img':
					if (a.img.complete) {
						this.drawImage(a.img, a.x, a.y);
					} else {
						// We need to wait for this image to 'load'
						// to keep things in-order
						ready = false;
					}
					break;
			}

			if (ready) {
				this._renderQ.shift();
			}
		}

		if (this._renderQ.length > 0) {
			Util.requestAnimationFrame(this._scan_renderQ.bind(this));
		}
	},
};


Util.make_properties(Display, [
	['target', 'wo', 'dom'],       // Canvas element for rendering
	['context', 'ro', 'raw'],      // Canvas 2D context for rendering (read-only)
	['logo', 'rw', 'raw'],         // Logo to display when cleared: {'width': w, 'height': h, 'data': data}
	['true_color', 'rw', 'bool'],  // Use true-color pixel data
	['colourMap', 'rw', 'arr'],    // Colour map array (when not true-color)
	['scale', 'rw', 'float'],      // Display area scale factor 0.0 - 1.0
	['viewport', 'rw', 'bool'],    // Use viewport clipping
	['width', 'rw', 'int'],        // Display area width
	['height', 'rw', 'int'],       // Display area height
	['maxWidth', 'rw', 'int'],     // Viewport max width (0 if disabled)
	['maxHeight', 'rw', 'int'],    // Viewport max height (0 if disabled)

	['render_mode', 'ro', 'str'],  // Canvas rendering mode (read-only)

	['prefer_js', 'rw', 'str'],    // Prefer Javascript over canvas methods
	['cursor_uri', 'rw', 'raw']    // Can we render cursor using data URI
]);


// Class Methods
Display.changeCursor = function (target, pixels, mask, hotx, hoty, w0, h0, cmap) {
	var w = w0;
	var h = h0;
	if (h < w) {
		h = w;  // increase h to make it square
	} else {
		w = h;  // increase w to make it square
	}

	var cur = [];

	// Push multi-byte little-endian values
	cur.push16le = function (num) {
		this.push(num & 0xFF, (num >> 8) & 0xFF);
	};
	cur.push32le = function (num) {
		this.push(num & 0xFF,
					(num >> 8) & 0xFF,
					(num >> 16) & 0xFF,
					(num >> 24) & 0xFF);
	};

	var IHDRsz = 40;
	var RGBsz = w * h * 4;
	var XORsz = Math.ceil((w * h) / 8.0);
	var ANDsz = Math.ceil((w * h) / 8.0);

	cur.push16le(0);        // 0: Reserved
	cur.push16le(2);        // 2: .CUR type
	cur.push16le(1);        // 4: Number of images, 1 for non-animated ico

	// Cursor #1 header (ICONDIRENTRY)
	cur.push(w);            // 6: width
	cur.push(h);            // 7: height
	cur.push(0);            // 8: colors, 0 -> true-color
	cur.push(0);            // 9: reserved
	cur.push16le(hotx);     // 10: hotspot x coordinate
	cur.push16le(hoty);     // 12: hotspot y coordinate
	cur.push32le(IHDRsz + RGBsz + XORsz + ANDsz);
							// 14: cursor data byte size
	cur.push32le(22);       // 18: offset of cursor data in the file

	// Cursor #1 InfoHeader (ICONIMAGE/BITMAPINFO)
	cur.push32le(IHDRsz);   // 22: InfoHeader size
	cur.push32le(w);        // 26: Cursor width
	cur.push32le(h * 2);    // 30: XOR+AND height
	cur.push16le(1);        // 34: number of planes
	cur.push16le(32);       // 36: bits per pixel
	cur.push32le(0);        // 38: Type of compression

	cur.push32le(XORsz + ANDsz);
							// 42: Size of Image
	cur.push32le(0);        // 46: reserved
	cur.push32le(0);        // 50: reserved
	cur.push32le(0);        // 54: reserved
	cur.push32le(0);        // 58: reserved

	// 62: color data (RGBQUAD icColors[])
	var y, x;
	for (y = h - 1; y >= 0; y--) {
		for (x = 0; x < w; x++) {
			if (x >= w0 || y >= h0) {
				cur.push(0);  // blue
				cur.push(0);  // green
				cur.push(0);  // red
				cur.push(0);  // alpha
			} else {
				var idx = y * Math.ceil(w0 / 8) + Math.floor(x / 8);
				var alpha = (mask[idx] << (x % 8)) & 0x80 ? 255 : 0;
				if (cmap) {
					idx = (w0 * y) + x;
					var rgb = cmap[pixels[idx]];
					cur.push(rgb[2]);  // blue
					cur.push(rgb[1]);  // green
					cur.push(rgb[0]);  // red
					cur.push(alpha);   // alpha
				} else {
					idx = ((w0 * y) + x) * 4;
					cur.push(pixels[idx + 2]); // blue
					cur.push(pixels[idx + 1]); // green
					cur.push(pixels[idx]);     // red
					cur.push(alpha);           // alpha
				}
			}
		}
	}

	// XOR/bitmask data (BYTE icXOR[])
	// (ignored, just needs to be the right size)
	for (y = 0; y < h; y++) {
		for (x = 0; x < Math.ceil(w / 8); x++) {
			cur.push(0);
		}
	}

	// AND/bitmask data (BYTE icAND[])
	// (ignored, just needs to be the right size)
	for (y = 0; y < h; y++) {
		for (x = 0; x < Math.ceil(w / 8); x++) {
			cur.push(0);
		}
	}

	var url = 'data:image/x-icon;base64,' + Base64.encode(cur);
	target.style.cursor = 'url(' + url + ')' + hotx + ' ' + hoty + ', default';
};

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/novnc-node/lib/display.js","/../../node_modules/novnc-node/lib")
},{"./base64":7,"./util":15,"bowser":2,"buffer":3,"debug":17,"rH1JPG":19}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*
 * noVNC: HTML5 VNC client
 * Copyright (C) 2012 Joel Martin
 * Copyright (C) 2013 Samuel Mannehed for Cendio AB
 * Licensed under MPL 2.0 or any later version (see LICENSE.txt)
 */


/**
 * Expose the Input Object.
 */
var Input = module.exports = {};


/**
 * Dependencies.
 */
var debugkeyboard = require('debug')('noVNC:Input:Keybord');
var debugmouse = require('debug')('noVNC:Input:Mouse');
var browser = require('bowser').browser;
var Util = require('./util');
var kbdUtil = require('./kbdutil');


function Keyboard (defaults) {
	this._keyDownList = [];  // List of depressed keys
									         // (even if they are happy)

	Util.set_defaults(this, defaults, {
		'target': document,
		'focused': true
	});

	// create the keyboard handler
	this._handler = new kbdUtil.KeyEventDecoder(kbdUtil.ModifierSync(),
		kbdUtil.VerifyCharModifier(
			kbdUtil.TrackKeyState(
				kbdUtil.EscapeModifiers(this._handleRfbEvent.bind(this))
			)
		)
	); /* jshint newcap: true */

	// keep these here so we can refer to them later
	this._eventHandlers = {
		'keyup': this._handleKeyUp.bind(this),
		'keydown': this._handleKeyDown.bind(this),
		'keypress': this._handleKeyPress.bind(this),
		'blur': this._allKeysUp.bind(this)
	};
}


Keyboard.prototype = {
	_handleRfbEvent: function (e) {
		if (this._onKeyPress) {
			debugkeyboard('onKeyPress: ' + (e.type === 'keydown' ? 'down' : 'up') +
					   ', keysym: ' + e.keysym.keysym + '(' + e.keysym.keyname + ')');
			this._onKeyPress(e.keysym.keysym, e.type === 'keydown');
		}
	},

	_handleKeyDown: function (e) {
		if (!this._focused) { return true; }

		if (this._handler.keydown(e)) {
			// Suppress bubbling/default actions
			Util.stopEvent(e);
			return false;
		} else {
			// Allow the event to bubble and become a keyPress event which
			// will have the character code translated
			return true;
		}
	},

	_handleKeyPress: function (e) {
		if (!this._focused) { return true; }

		if (this._handler.keypress(e)) {
			// Suppress bubbling/default actions
			Util.stopEvent(e);
			return false;
		} else {
			// Allow the event to bubble and become a keyPress event which
			// will have the character code translated
			return true;
		}
	},

	_handleKeyUp: function (e) {
		if (!this._focused) { return true; }

		if (this._handler.keyup(e)) {
			// Suppress bubbling/default actions
			Util.stopEvent(e);
			return false;
		} else {
			// Allow the event to bubble and become a keyUp event which
			// will have the character code translated
			return true;
		}
	},

	_allKeysUp: function () {
		debugkeyboard('allKeysUp');
		this._handler.releaseAll();
	},

	// Public methods

	grab: function () {
		debugkeyboard('grab()');

		var c = this._target;

		Util.addEvent(c, 'keydown', this._eventHandlers.keydown);
		Util.addEvent(c, 'keyup', this._eventHandlers.keyup);
		Util.addEvent(c, 'keypress', this._eventHandlers.keypress);

		// Release (key up) if global loses focus
		Util.addEvent(global, 'blur', this._eventHandlers.blur);
	},

	ungrab: function () {
		debugkeyboard('ungrab()');

		var c = this._target;

		Util.removeEvent(c, 'keydown', this._eventHandlers.keydown);
		Util.removeEvent(c, 'keyup', this._eventHandlers.keyup);
		Util.removeEvent(c, 'keypress', this._eventHandlers.keypress);
		Util.removeEvent(global, 'blur', this._eventHandlers.blur);

		// Release (key up) all keys that are in a down state
		this._allKeysUp();
	},

	sync: function (e) {
		this._handler.syncModifiers(e);
	}
};


Util.make_properties(Keyboard, [
	['target',     'wo', 'dom'],  // DOM element that captures keyboard input
	['focused',    'rw', 'bool'], // Capture and send key events
	['onKeyPress', 'rw', 'func'] // Handler for key press/release
]);


function Mouse (defaults) {
	this._mouseCaptured  = false;

	this._doubleClickTimer = null;
	this._lastTouchPos = null;

	// Configuration attributes
	Util.set_defaults(this, defaults, {
		'target': document,
		'focused': true,
		'scale': 1.0,
		'zoom': 1.0,
		'touchButton': 1
	});

	this._eventHandlers = {
		'mousedown': this._handleMouseDown.bind(this),
		'mouseup': this._handleMouseUp.bind(this),
		'mousemove': this._handleMouseMove.bind(this),
		'mousewheel': this._handleMouseWheel.bind(this),
		'mousedisable': this._handleMouseDisable.bind(this)
	};
}


Mouse.prototype = {
	_captureMouse: function () {
		// capturing the mouse ensures we get the mouseup event
		if (this._target.setCapture) {
			this._target.setCapture();
		}

		// some browsers give us mouseup events regardless,
		// so if we never captured the mouse, we can disregard the event
		this._mouseCaptured = true;
	},

	_releaseMouse: function () {
		if (this._target.releaseCapture) {
			this._target.releaseCapture();
		}
		this._mouseCaptured = false;
	},

	_resetDoubleClickTimer: function () {
		this._doubleClickTimer = null;
	},

	_handleMouseButton: function (e, down) {
		if (!this._focused) { return true; }

		if (this._notify) {
			this._notify(e);
		}

		var evt = (e ? e : global.event);
		var pos = Util.getEventPosition(e, this._target, this._scale, this._zoom);

		var bmask;
		if (e.touches || e.changedTouches) {
			// Touch device

			// When two touches occur within 500 ms of each other and are
			// closer than 20 pixels together a double click is triggered.
			if (down === 1) {
				if (this._doubleClickTimer === null) {
					this._lastTouchPos = pos;
				} else {
					clearTimeout(this._doubleClickTimer);

					// When the distance between the two touches is small enough
					// force the position of the latter touch to the position of
					// the first.

					var xs = this._lastTouchPos.x - pos.x;
					var ys = this._lastTouchPos.y - pos.y;
					var d = Math.sqrt((xs * xs) + (ys * ys));

					// The goal is to trigger on a certain physical width, the
					// devicePixelRatio brings us a bit closer but is not optimal.
					if (d < 20 * global.devicePixelRatio) {
						pos = this._lastTouchPos;
					}
				}
				this._doubleClickTimer = setTimeout(this._resetDoubleClickTimer.bind(this), 500);
			}
			bmask = this._touchButton;
			// If bmask is set
		} else if (evt.which) {
			/* everything except IE */
			bmask = 1 << evt.button;
		} else {
			/* IE including 9 */
			bmask = (evt.button & 0x1) +      // Left
					(evt.button & 0x2) * 2 +  // Right
					(evt.button & 0x4) / 2;   // Middle
		}

		if (this._onMouseButton) {
			debugmouse('onMouseButton: ' + (down ? 'down' : 'up') +
					   ', x: ' + pos.x + ', y: ' + pos.y + ', bmask: ' + bmask);
			this._onMouseButton(pos.x, pos.y, down, bmask);
		}

		Util.stopEvent(e);
		return false;
	},

	_handleMouseDown: function (e) {
		this._captureMouse();
		this._handleMouseButton(e, 1);
	},

	_handleMouseUp: function (e) {
		if (!this._mouseCaptured) { return; }

		this._handleMouseButton(e, 0);
		this._releaseMouse();
	},

	_handleMouseWheel: function (e) {
		if (!this._focused) { return true; }

		if (this._notify) {
			this._notify(e);
		}

		var evt = (e ? e : global.event);
		var pos = Util.getEventPosition(e, this._target, this._scale, this._zoom);
		var wheelData = evt.detail ? evt.detail * -1 : evt.wheelDelta / 40;
		var bmask;
		if (wheelData > 0) {
			bmask = 1 << 3;
		} else {
			bmask = 1 << 4;
		}

		if (this._onMouseButton) {
			this._onMouseButton(pos.x, pos.y, 1, bmask);
			this._onMouseButton(pos.x, pos.y, 0, bmask);
		}

		Util.stopEvent(e);
		return false;
	},

	_handleMouseMove: function (e) {
		if (!this._focused) { return true; }

		if (this._notify) {
			this._notify(e);
		}

		var pos = Util.getEventPosition(e, this._target, this._scale, this._zoom);
		if (this._onMouseMove) {
			this._onMouseMove(pos.x, pos.y);
		}

		Util.stopEvent(e);
		return false;
	},

	_handleMouseDisable: function (e) {
		if (!this._focused) { return true; }

		var pos = Util.getEventPosition(e, this._target, this._scale, this._zoom);

		/* Stop propagation if inside canvas area */
		if ((pos.realx >= 0) && (pos.realy >= 0) &&
			(pos.realx < this._target.offsetWidth) &&
			(pos.realy < this._target.offsetHeight)) {

			Util.stopEvent(e);
			return false;
		}

		return true;
	},

	// Public methods

	grab: function () {
		debugmouse('grab()');

		var c = this._target;
		var isTouch = 'ontouchstart' in document.documentElement;

		if (isTouch) {
			Util.addEvent(c, 'touchstart', this._eventHandlers.mousedown);
			Util.addEvent(global, 'touchend', this._eventHandlers.mouseup);
			Util.addEvent(c, 'touchend', this._eventHandlers.mouseup);
			Util.addEvent(c, 'touchmove', this._eventHandlers.mousemove);
		}

		if (!isTouch || this._enableMouseAndTouch) {
			Util.addEvent(c, 'mousedown', this._eventHandlers.mousedown);
			Util.addEvent(global, 'mouseup', this._eventHandlers.mouseup);
			Util.addEvent(c, 'mouseup', this._eventHandlers.mouseup);
			Util.addEvent(c, 'mousemove', this._eventHandlers.mousemove);
			Util.addEvent(c, (browser.gecko) ? 'DOMMouseScroll' : 'mousewheel',
						  this._eventHandlers.mousewheel);
		}

		/* Work around right and middle click browser behaviors */
		Util.addEvent(document, 'click', this._eventHandlers.mousedisable);
		Util.addEvent(document.body, 'contextmenu', this._eventHandlers.mousedisable);
	},

	ungrab: function () {
		debugmouse('ungrab()');

		var c = this._target;
		var isTouch = 'ontouchstart' in document.documentElement;

		if (isTouch) {
			Util.removeEvent(c, 'touchstart', this._eventHandlers.mousedown);
			Util.removeEvent(global, 'touchend', this._eventHandlers.mouseup);
			Util.removeEvent(c, 'touchend', this._eventHandlers.mouseup);
			Util.removeEvent(c, 'touchmove', this._eventHandlers.mousemove);
		}

		if (!isTouch || this._enableMouseAndTouch) {
			Util.removeEvent(c, 'mousedown', this._eventHandlers.mousedown);
			Util.removeEvent(global, 'mouseup', this._eventHandlers.mouseup);
			Util.removeEvent(c, 'mouseup', this._eventHandlers.mouseup);
			Util.removeEvent(c, 'mousemove', this._eventHandlers.mousemove);
			Util.removeEvent(c, (browser.gecko) ? 'DOMMouseScroll' : 'mousewheel',
							 this._eventHandlers.mousewheel);
		}

		/* Work around right and middle click browser behaviors */
		Util.removeEvent(document, 'click', this._eventHandlers.mousedisable);
		Util.removeEvent(document.body, 'contextmenu', this._eventHandlers.mousedisable);

	}
};


Util.make_properties(Mouse, [
	['target',         'ro', 'dom'],   // DOM element that captures mouse input
	['notify',         'ro', 'func'],  // Function to call to notify whenever a mouse event is received
	['focused',        'rw', 'bool'],  // Capture and send mouse clicks/movement
	['scale',          'rw', 'float'], // Viewport scale factor 0.0 - 1.0
	['zoom',           'rw', 'float'], // CSS zoom applied to the DOM element that captures mouse input
	['enableMouseAndTouch', 'rw', 'bool'],  // Whether also enable mouse events when touch screen is detected

	['onMouseButton',  'rw', 'func'],  // Handler for mouse button click/release
	['onMouseMove',    'rw', 'func'],  // Handler for mouse movement
	['touchButton',    'rw', 'int']    // Button mask (1, 2, 4) for touch devices (0 means ignore clicks)
]);


/**
 * Add Keyboard and Mouse in the exposed Object.
 */
Input.Keyboard = Keyboard;
Input.Mouse = Mouse;

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/novnc-node/lib/input.js","/../../node_modules/novnc-node/lib")
},{"./kbdutil":11,"./util":15,"bowser":2,"buffer":3,"debug":17,"rH1JPG":19}],11:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Dependencies.
 */
var debugerror = require('debug')('noVNC:ERROR:KbdUtil');
debugerror.log = console.warn.bind(console);
var Keys = require('./keys');


var KbdUtil = module.exports = {
	/**
	 * Return true if a modifier which is not the specified char modifier (and
	 * is not shift) is down.
	 */
	hasShortcutModifier: function (charModifier, currentModifiers) {
		var mods = {};
		for (var key in currentModifiers) {
			if (parseInt(key) !== Keys.XK_Shift_L) {
				mods[key] = currentModifiers[key];
			}
		}

		var sum = 0;
		for (var k in currentModifiers) {
			if (mods[k]) {
				++sum;
			}
		}

		if (KbdUtil.hasCharModifier(charModifier, mods)) {
			return sum > charModifier.length;
		}
		else {
			return sum > 0;
		}
	},

	/**
	 * Return true if the specified char modifier is currently down.
	 */
	hasCharModifier: function (charModifier, currentModifiers) {
		if (charModifier.length === 0) { return false; }

		for (var i = 0; i < charModifier.length; ++i) {
			if (!currentModifiers[charModifier[i]]) {
				return false;
			}
		}
		return true;
	},

	/**
	 * Helper object tracking modifier key state and generates fake key events
	 * to compensate if it gets out of sync.
	 */
	ModifierSync: function (charModifier) {
		if (!charModifier) {
			if (isMac()) {
				// on Mac, Option (AKA Alt) is used as a char modifier
				charModifier = [Keys.XK_Alt_L];
			}
			else if (isWindows()) {
				// on Windows, Ctrl+Alt is used as a char modifier
				charModifier = [Keys.XK_Alt_L, Keys.XK_Control_L];
			}
			else if (isLinux()) {
				// on Linux, ISO Level 3 Shift (AltGr) is used as a char modifier
				charModifier = [Keys.XK_ISO_Level3_Shift];
			}
			else {
				charModifier = [];
			}
		}

		var state = {};

		state[Keys.XK_Control_L] = false;
		state[Keys.XK_Alt_L] = false;
		state[Keys.XK_ISO_Level3_Shift] = false;
		state[Keys.XK_Shift_L] = false;
		state[Keys.XK_Meta_L] = false;

		function sync(evt, keysym) {
			var result = [];

			function syncKey(keysym) {
				return {keysym: Keys.lookup(keysym), type: state[keysym] ? 'keydown' : 'keyup'};
			}

			if (evt.ctrlKey !== undefined &&
				evt.ctrlKey !== state[Keys.XK_Control_L] && keysym !== Keys.XK_Control_L) {
				state[Keys.XK_Control_L] = evt.ctrlKey;
				result.push(syncKey(Keys.XK_Control_L));
			}
			if (evt.altKey !== undefined &&
				evt.altKey !== state[Keys.XK_Alt_L] && keysym !== Keys.XK_Alt_L) {
				state[Keys.XK_Alt_L] = evt.altKey;
				result.push(syncKey(Keys.XK_Alt_L));
			}
			if (evt.altGraphKey !== undefined &&
				evt.altGraphKey !== state[Keys.XK_ISO_Level3_Shift] && keysym !== Keys.XK_ISO_Level3_Shift) {
				state[Keys.XK_ISO_Level3_Shift] = evt.altGraphKey;
				result.push(syncKey(Keys.XK_ISO_Level3_Shift));
			}
			if (evt.shiftKey !== undefined &&
				evt.shiftKey !== state[Keys.XK_Shift_L] && keysym !== Keys.XK_Shift_L) {
				state[Keys.XK_Shift_L] = evt.shiftKey;
				result.push(syncKey(Keys.XK_Shift_L));
			}
			if (evt.metaKey !== undefined &&
				evt.metaKey !== state[Keys.XK_Meta_L] && keysym !== Keys.XK_Meta_L) {
				state[Keys.XK_Meta_L] = evt.metaKey;
				result.push(syncKey(Keys.XK_Meta_L));
			}
			return result;
		}

		function syncKeyEvent(evt, down) {
			var obj = KbdUtil.getKeysym(evt);
			var keysym = obj ? obj.keysym : null;

			// first, apply the event itself, if relevant
			if (keysym !== null && state[keysym] !== undefined) {
				state[keysym] = down;
			}
			return sync(evt, keysym);
		}

		return {
			// sync on the appropriate keyboard event
			keydown: function(evt) { return syncKeyEvent(evt, true); },
			keyup: function(evt) { return syncKeyEvent(evt, false); },
			// Call this with a non-keyboard event (such as mouse events) to use its modifier state to synchronize anyway
			syncAny: function(evt) { return sync(evt); },

			// is a shortcut modifier down?
			hasShortcutModifier: function() {
				return KbdUtil.hasShortcutModifier(charModifier, state);
			},
			// if a char modifier is down, return the keys it consists of, otherwise return null
			activeCharModifier: function() {
				return KbdUtil.hasCharModifier(charModifier, state) ? charModifier : null;
			}
		};
	},

	/**
	 * Get a key ID from a keyboard event.
	 * May be a string or an integer depending on the available properties.
	 */
	getKey: function (evt) {
		if ('keyCode' in evt && 'key' in evt) {
			return evt.key + ':' + evt.keyCode;
		}
		else if ('keyCode' in evt) {
			return evt.keyCode;
		}
		else {
			return evt.key;
		}
	},

	/**
	 * Get the most reliable keysym value we can get from a key event.
	 * If char/charCode is available, prefer those, otherwise fall back to
	 * key/keyCode/which.
	 */
	getKeysym: function (evt) {
		var codepoint;

		if (evt.char && evt.char.length === 1) {
			codepoint = evt.char.charCodeAt();
		}
		else if (evt.charCode) {
			codepoint = evt.charCode;
		}
		else if (evt.keyCode && evt.type === 'keypress') {
			// IE10 stores the char code as keyCode, and has no other useful properties
			codepoint = evt.keyCode;
		}

		if (codepoint) {
			var res = Keys.fromUnicode(KbdUtil.substituteCodepoint(codepoint));
			if (res) {
				return res;
			}
		}

		// we could check evt.key here.
		// Legal values are defined in http://www.w3.org/TR/DOM-Level-3-Events/#key-values-list,
		// so we "just" need to map them to keysym, but AFAIK this is only available in IE10,
		// which also provides evt.key so we don't *need* it yet.
		if (evt.keyCode) {
			return Keys.lookup(KbdUtil.keysymFromKeyCode(evt.keyCode, evt.shiftKey));
		}
		if (evt.which) {
			return Keys.lookup(KbdUtil.keysymFromKeyCode(evt.which, evt.shiftKey));
		}
		return null;
	},

	/**
	 * Given a keycode, try to predict which keysym it might be.
	 * If the keycode is unknown, null is returned.
	 */
	keysymFromKeyCode: function (keycode, shiftPressed) {
		if (typeof(keycode) !== 'number') {
			return null;
		}
		// won't be accurate for azerty
		if (keycode >= 0x30 && keycode <= 0x39) {
			return keycode; // digit
		}
		if (keycode >= 0x41 && keycode <= 0x5a) {
			// remap to lowercase unless shift is down
			return shiftPressed ? keycode : keycode + 32; // A-Z
		}
		if (keycode >= 0x60 && keycode <= 0x69) {
			return Keys.XK_KP_0 + (keycode - 0x60); // numpad 0-9
		}

		switch(keycode) {
			case 0x20: return Keys.XK_space;
			case 0x6a: return Keys.XK_KP_Multiply;
			case 0x6b: return Keys.XK_KP_Add;
			case 0x6c: return Keys.XK_KP_Separator;
			case 0x6d: return Keys.XK_KP_Subtract;
			case 0x6e: return Keys.XK_KP_Decimal;
			case 0x6f: return Keys.XK_KP_Divide;
			case 0xbb: return Keys.XK_plus;
			case 0xbc: return Keys.XK_comma;
			case 0xbd: return Keys.XK_minus;
			case 0xbe: return Keys.XK_period;
		}

		return KbdUtil.nonCharacterKey({keyCode: keycode});
	},

	/**
	 * If the key is a known non-character key (any key which doesn't generate
	 * character data) return its keysym value. Otherwise return null.
	 */
	nonCharacterKey: function (evt) {
		// evt.key not implemented yet
		if (!evt.keyCode) { return null; }

		var keycode = evt.keyCode;

		if (keycode >= 0x70 && keycode <= 0x87) {
			return Keys.XK_F1 + keycode - 0x70; // F1-F24
		}

		switch (keycode) {
			case 8 : return Keys.XK_BackSpace;
			case 13 : return Keys.XK_Return;

			case 9 : return Keys.XK_Tab;

			case 27 : return Keys.XK_Escape;
			case 46 : return Keys.XK_Delete;

			case 36 : return Keys.XK_Home;
			case 35 : return Keys.XK_End;
			case 33 : return Keys.XK_Page_Up;
			case 34 : return Keys.XK_Page_Down;
			case 45 : return Keys.XK_Insert;

			case 37 : return Keys.XK_Left;
			case 38 : return Keys.XK_Up;
			case 39 : return Keys.XK_Right;
			case 40 : return Keys.XK_Down;

			case 16 : return Keys.XK_Shift_L;
			case 17 : return Keys.XK_Control_L;
			case 18 : return Keys.XK_Alt_L; // also: Option-key on Mac

			case 224 : return Keys.XK_Meta_L;
			case 225 : return Keys.XK_ISO_Level3_Shift; // AltGr
			case 91 : return Keys.XK_Super_L; // also: Windows-key
			case 92 : return Keys.XK_Super_R; // also: Windows-key
			case 93 : return Keys.XK_Menu; // also: Windows-Menu, Command on Mac

			default: return null;
		}
	},

	substituteCodepoint: function(cp) {
		// Any Unicode code points which do not have corresponding keysym entries
		// can be swapped out for another code point by adding them to this table.
		var substitutions = {
			// {S,s} with comma below -> {S,s} with cedilla
			0x218 : 0x15e,
			0x219 : 0x15f,
			// {T,t} with comma below -> {T,t} with cedilla
			0x21a : 0x162,
			0x21b : 0x163
		};

		var sub = substitutions[cp];
		return sub ? sub : cp;
	},

	/**
	 * Takes a DOM keyboard event and:
	 * - determines which keysym it represents.
	 * - determines a keyId  identifying the key that was pressed (corresponding
	 *   to the key/keyCode properties on the DOM event).
	 * - synthesizes events to synchronize modifier key state between which
	 *   modifiers are actually down, and which we thought were down.
	 * - marks each event with an 'escape' property if a modifier was down which
	 *   should be "escaped".
	 * - generates a "stall" event in cases where it might be necessary to wait
	 *   and see if a keypress event follows a keydown.
	 *
	 * This information is collected into an object which is passed to the next()
	 * function (one call per event).
	 */
	KeyEventDecoder: function (modifierState, next) {
		function sendAll(evts) {
			for (var i = 0; i < evts.length; ++i) {
				next(evts[i]);
			}
		}

		function process(evt, type) {
			var result = {type: type};
			var keyId = KbdUtil.getKey(evt);

			if (keyId) {
				result.keyId = keyId;
			}

			var keysym = KbdUtil.getKeysym(evt);

			var hasModifier = modifierState.hasShortcutModifier() || !!modifierState.activeCharModifier();

			// Is this a case where we have to decide on the keysym right away, rather than waiting for the keypress?
			// "special" keys like enter, tab or backspace don't send keypress events,
			// and some browsers don't send keypresses at all if a modifier is down
			if (keysym && (type !== 'keydown' || KbdUtil.nonCharacterKey(evt) || hasModifier)) {
				result.keysym = keysym;
			}

			var isShift = evt.keyCode === 0x10 || evt.key === 'Shift';

			// Should we prevent the browser from handling the event?
			// Doing so on a keydown (in most browsers) prevents keypress from being generated
			// so only do that if we have to.
			var suppress = !isShift && (type !== 'keydown' || modifierState.hasShortcutModifier() || !!KbdUtil.nonCharacterKey(evt));

			// If a char modifier is down on a keydown, we need to insert a stall,
			// so VerifyCharModifier knows to wait and see if a keypress is comnig
			var stall = type === 'keydown' && modifierState.activeCharModifier() && !KbdUtil.nonCharacterKey(evt);

			// if a char modifier is pressed, get the keys it consists of (on Windows, AltGr is equivalent to Ctrl+Alt)
			var active = modifierState.activeCharModifier();

			// If we have a char modifier down, and we're able to determine a keysym reliably
			// then (a) we know to treat the modifier as a char modifier,
			// and (b) we'll have to "escape" the modifier to undo the modifier when sending the char.
			if (active && keysym) {
				var isCharModifier = false;
				for (var i  = 0; i < active.length; ++i) {
					if (active[i] === keysym.keysym) {
						isCharModifier = true;
					}
				}
				if (type === 'keypress' && !isCharModifier) {
					result.escape = modifierState.activeCharModifier();
				}
			}

			if (stall) {
				// insert a fake "stall" event
				next({type: 'stall'});
			}
			next(result);

			return suppress;
		}

		return {
			keydown: function(evt) {
				sendAll(modifierState.keydown(evt));
				return process(evt, 'keydown');
			},
			keypress: function(evt) {
				return process(evt, 'keypress');
			},
			keyup: function(evt) {
				sendAll(modifierState.keyup(evt));
				return process(evt, 'keyup');
			},
			syncModifiers: function(evt) {
				sendAll(modifierState.syncAny(evt));
			},
			releaseAll: function() { next({type: 'releaseall'}); }
		};
	},

	/**
	 * Combines keydown and keypress events where necessary to handle char modifiers.
	 * On some OS'es, a char modifier is sometimes used as a shortcut modifier.
	 * For example, on Windows, AltGr is synonymous with Ctrl-Alt. On a Danish keyboard
	 * layout, AltGr-2 yields a @, but Ctrl-Alt-D does nothing so when used with the
	 * '2' key, Ctrl-Alt counts as a char modifier (and should be escaped), but when
	 * used with 'D', it does not.
	 * The only way we can distinguish these cases is to wait and see if a keypress
	 * event arrives. When we receive a "stall" event, wait a few ms before processing
	 * the next keydown. If a keypress has also arrived, merge the two.
	 */
	VerifyCharModifier: function (next) {
		var queue = [];
		var timer = null;

		function process() {
			if (timer) {
				return;
			}

			function delayProcess () {
				clearTimeout(timer);
				timer = null;
				process();
			}

			while (queue.length !== 0) {
				var cur = queue[0];
				queue = queue.splice(1);

				switch (cur.type) {
					case 'stall':
						// insert a delay before processing available events.
						/* jshint loopfunc: true */
						timer = setTimeout(delayProcess, 5);
						/* jshint loopfunc: false */
						return;
					case 'keydown':
						// is the next element a keypress? Then we should merge the two
						if (queue.length !== 0 && queue[0].type === 'keypress') {
							// Firefox sends keypress even when no char is generated.
							// so, if keypress keysym is the same as we'd have guessed from keydown,
							// the modifier didn't have any effect, and should not be escaped
							if (queue[0].escape && (!cur.keysym || cur.keysym.keysym !== queue[0].keysym.keysym)) {
								cur.escape = queue[0].escape;
							}
							cur.keysym = queue[0].keysym;
							queue = queue.splice(1);
						}
						break;
				}

				// swallow stall events, and pass all others to the next stage
				if (cur.type !== 'stall') {
					next(cur);
				}
			}
		}

		return function(evt) {
			queue.push(evt);
			process();
		};
	},

	/**
	 * Keeps track of which keys we (and the server) believe are down.
	 * When a keyup is received, match it against this list, to determine the
	 * corresponding keysym(s) in some cases, a single key may produce multiple
	 * keysyms, so the corresponding keyup event must release all of these chars
	 * key repeat events should be merged into a single entry.
	 * Because we can't always identify which entry a keydown or keyup event
	 * corresponds to, we sometimes have to guess.
	 */
	TrackKeyState: function (next) {
		var state = [];

		return function (evt) {
			var last = state.length !== 0 ? state[state.length-1] : null;

			switch (evt.type) {
				case 'keydown':
					// insert a new entry if last seen key was different.
					if (!last || !evt.keyId || last.keyId !== evt.keyId) {
						last = {keyId: evt.keyId, keysyms: {}};
						state.push(last);
					}
					if (evt.keysym) {
						// make sure last event contains this keysym (a single "logical" keyevent
						// can cause multiple key events to be sent to the VNC server)
						last.keysyms[evt.keysym.keysym] = evt.keysym;
						last.ignoreKeyPress = true;
						next(evt);
					}
					break;
				case 'keypress':
					if (!last) {
						last = {keyId: evt.keyId, keysyms: {}};
						state.push(last);
					}
					if (!evt.keysym) {
						debugerror('TrackKeyState() | keypress with no keysym:', evt);
					}

					// If we didn't expect a keypress, and already sent a keydown to the VNC server
					// based on the keydown, make sure to skip this event.
					if (evt.keysym && !last.ignoreKeyPress) {
						last.keysyms[evt.keysym.keysym] = evt.keysym;
						evt.type = 'keydown';
						next(evt);
					}
					break;
				case 'keyup':
					if (state.length === 0) {
						return;
					}
					var idx = null;
					// do we have a matching key tracked as being down?
					for (var i = 0; i !== state.length; ++i) {
						if (state[i].keyId === evt.keyId) {
							idx = i;
							break;
						}
					}
					// if we couldn't find a match (it happens), assume it was the last key pressed
					if (idx === null) {
						idx = state.length - 1;
					}

					var item = state.splice(idx, 1)[0];
					// for each keysym tracked by this key entry, clone the current event and override the keysym
					var clone = (function(){
						function Clone(){}
						return function (obj) { Clone.prototype=obj; return new Clone(); };
					}());
					for (var key in item.keysyms) {
						var out = clone(evt);
						out.keysym = item.keysyms[key];
						next(out);
					}
					break;
				case 'releaseall':
					/* jshint shadow: true */
					for (var i = 0; i < state.length; ++i) {
						for (var key in state[i].keysyms) {
							var keysym = state[i].keysyms[key];
							next({keyId: 0, keysym: keysym, type: 'keyup'});
						}
					}
					/* jshint shadow: false */
					state = [];
					break;
			}
		};
	},

	/**
	 * Handles "escaping" of modifiers: if a char modifier is used to produce a
	 * keysym (such as AltGr-2 to generate an @), then the modifier must be
	 * "undone" before sending the @, and "redone" afterwards.
	 */
	EscapeModifiers: function (next) {
		return function(evt) {
			var i;

			if (evt.type !== 'keydown' || evt.escape === undefined) {
				next(evt);
				return;
			}

			// undo modifiers
			for (i = 0; i < evt.escape.length; ++i) {
				next({type: 'keyup', keyId: 0, keysym: Keys.lookup(evt.escape[i])});
			}

			// send the character event
			next(evt);

			// redo modifiers
			for (i = 0; i < evt.escape.length; ++i) {
				next({type: 'keydown', keyId: 0, keysym: Keys.lookup(evt.escape[i])});
			}
		};
	}
};


/**
 * Private API.
 */


function isMac() {
	return navigator && !!(/mac/i).exec(navigator.platform);
}

function isWindows() {
	return navigator && !!(/win/i).exec(navigator.platform);
}

function isLinux() {
	return navigator && !!(/linux/i).exec(navigator.platform);
}

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/novnc-node/lib/kbdutil.js","/../../node_modules/novnc-node/lib")
},{"./keys":12,"buffer":3,"debug":17,"rH1JPG":19}],12:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * The Object to be exposed.
 */
var Keys = {
	XK_VoidSymbol:                  0xffffff, /* Void symbol */

	XK_BackSpace:                   0xff08, /* Back space, back char */
	XK_Tab:                         0xff09,
	XK_Linefeed:                    0xff0a, /* Linefeed, LF */
	XK_Clear:                       0xff0b,
	XK_Return:                      0xff0d, /* Return, enter */
	XK_Pause:                       0xff13, /* Pause, hold */
	XK_Scroll_Lock:                 0xff14,
	XK_Sys_Req:                     0xff15,
	XK_Escape:                      0xff1b,
	XK_Delete:                      0xffff, /* Delete, rubout */

	/* Cursor control & motion */

	XK_Home:                        0xff50,
	XK_Left:                        0xff51, /* Move left, left arrow */
	XK_Up:                          0xff52, /* Move up, up arrow */
	XK_Right:                       0xff53, /* Move right, right arrow */
	XK_Down:                        0xff54, /* Move down, down arrow */
	XK_Prior:                       0xff55, /* Prior, previous */
	XK_Page_Up:                     0xff55,
	XK_Next:                        0xff56, /* Next */
	XK_Page_Down:                   0xff56,
	XK_End:                         0xff57, /* EOL */
	XK_Begin:                       0xff58, /* BOL */

	/* Misc functions */

	XK_Select:                      0xff60, /* Select, mark */
	XK_Print:                       0xff61,
	XK_Execute:                     0xff62, /* Execute, run, do */
	XK_Insert:                      0xff63, /* Insert, insert here */
	XK_Undo:                        0xff65,
	XK_Redo:                        0xff66, /* Redo, again */
	XK_Menu:                        0xff67,
	XK_Find:                        0xff68, /* Find, search */
	XK_Cancel:                      0xff69, /* Cancel, stop, abort, exit */
	XK_Help:                        0xff6a, /* Help */
	XK_Break:                       0xff6b,
	XK_Mode_switch:                 0xff7e, /* Character set switch */
	XK_script_switch:               0xff7e, /* Alias for mode_switch */
	XK_Num_Lock:                    0xff7f,

	/* Keypad functions, keypad numbers cleverly chosen to map to ASCII */

	XK_KP_Space:                    0xff80, /* Space */
	XK_KP_Tab:                      0xff89,
	XK_KP_Enter:                    0xff8d, /* Enter */
	XK_KP_F1:                       0xff91, /* PF1, KP_A, ... */
	XK_KP_F2:                       0xff92,
	XK_KP_F3:                       0xff93,
	XK_KP_F4:                       0xff94,
	XK_KP_Home:                     0xff95,
	XK_KP_Left:                     0xff96,
	XK_KP_Up:                       0xff97,
	XK_KP_Right:                    0xff98,
	XK_KP_Down:                     0xff99,
	XK_KP_Prior:                    0xff9a,
	XK_KP_Page_Up:                  0xff9a,  // NOTE: ibc fix (comma was missing)
	XK_KP_Next:                     0xff9b,
	XK_KP_Page_Down:                0xff9b,
	XK_KP_End:                      0xff9c,
	XK_KP_Begin:                    0xff9d,
	XK_KP_Insert:                   0xff9e,
	XK_KP_Delete:                   0xff9f,
	XK_KP_Equal:                    0xffbd, /* Equals */
	XK_KP_Multiply:                 0xffaa,
	XK_KP_Add:                      0xffab,
	XK_KP_Separator:                0xffac, /* Separator, often comma */
	XK_KP_Subtract:                 0xffad,
	XK_KP_Decimal:                  0xffae,
	XK_KP_Divide:                   0xffaf,

	XK_KP_0:                        0xffb0,
	XK_KP_1:                        0xffb1,
	XK_KP_2:                        0xffb2,
	XK_KP_3:                        0xffb3,
	XK_KP_4:                        0xffb4,
	XK_KP_5:                        0xffb5,
	XK_KP_6:                        0xffb6,
	XK_KP_7:                        0xffb7,
	XK_KP_8:                        0xffb8,
	XK_KP_9:                        0xffb9,

	/*
	 * Auxiliary functions; note the duplicate definitions for left and right
	 * function keys;  Sun keyboards and a few other manufacturers have such
	 * function key groups on the left and/or right sides of the keyboard.
	 * We've not found a keyboard with more than 35 function keys total.
	 */

	XK_F1:                          0xffbe,
	XK_F2:                          0xffbf,
	XK_F3:                          0xffc0,
	XK_F4:                          0xffc1,
	XK_F5:                          0xffc2,
	XK_F6:                          0xffc3,
	XK_F7:                          0xffc4,
	XK_F8:                          0xffc5,
	XK_F9:                          0xffc6,
	XK_F10:                         0xffc7,
	XK_F11:                         0xffc8,
	XK_L1:                          0xffc8,
	XK_F12:                         0xffc9,
	XK_L2:                          0xffc9,
	XK_F13:                         0xffca,
	XK_L3:                          0xffca,
	XK_F14:                         0xffcb,
	XK_L4:                          0xffcb,
	XK_F15:                         0xffcc,
	XK_L5:                          0xffcc,
	XK_F16:                         0xffcd,
	XK_L6:                          0xffcd,
	XK_F17:                         0xffce,
	XK_L7:                          0xffce,
	XK_F18:                         0xffcf,
	XK_L8:                          0xffcf,
	XK_F19:                         0xffd0,
	XK_L9:                          0xffd0,
	XK_F20:                         0xffd1,
	XK_L10:                         0xffd1,
	XK_F21:                         0xffd2,
	XK_R1:                          0xffd2,
	XK_F22:                         0xffd3,
	XK_R2:                          0xffd3,
	XK_F23:                         0xffd4,
	XK_R3:                          0xffd4,
	XK_F24:                         0xffd5,
	XK_R4:                          0xffd5,
	XK_F25:                         0xffd6,
	XK_R5:                          0xffd6,
	XK_F26:                         0xffd7,
	XK_R6:                          0xffd7,
	XK_F27:                         0xffd8,
	XK_R7:                          0xffd8,
	XK_F28:                         0xffd9,
	XK_R8:                          0xffd9,
	XK_F29:                         0xffda,
	XK_R9:                          0xffda,
	XK_F30:                         0xffdb,
	XK_R10:                         0xffdb,
	XK_F31:                         0xffdc,
	XK_R11:                         0xffdc,
	XK_F32:                         0xffdd,
	XK_R12:                         0xffdd,
	XK_F33:                         0xffde,
	XK_R13:                         0xffde,
	XK_F34:                         0xffdf,
	XK_R14:                         0xffdf,
	XK_F35:                         0xffe0,
	XK_R15:                         0xffe0,

	/* Modifiers */

	XK_Shift_L:                     0xffe1, /* Left shift */
	XK_Shift_R:                     0xffe2, /* Right shift */
	XK_Control_L:                   0xffe3, /* Left control */
	XK_Control_R:                   0xffe4, /* Right control */
	XK_Caps_Lock:                   0xffe5, /* Caps lock */
	XK_Shift_Lock:                  0xffe6, /* Shift lock */

	XK_Meta_L:                      0xffe7, /* Left meta */
	XK_Meta_R:                      0xffe8, /* Right meta */
	XK_Alt_L:                       0xffe9, /* Left alt */
	XK_Alt_R:                       0xffea, /* Right alt */
	XK_Super_L:                     0xffeb, /* Left super */
	XK_Super_R:                     0xffec, /* Right super */
	XK_Hyper_L:                     0xffed, /* Left hyper */
	XK_Hyper_R:                     0xffee, /* Right hyper */

	XK_ISO_Level3_Shift:            0xfe03, /* AltGr */

	/*
	 * Latin 1
	 * (ISO/IEC 8859-1: Unicode U+0020..U+00FF)
	 * Byte 3 = 0
	 */

	XK_space:                       0x0020, /* U+0020 SPACE */
	XK_exclam:                      0x0021, /* U+0021 EXCLAMATION MARK */
	XK_quotedbl:                    0x0022, /* U+0022 QUOTATION MARK */
	XK_numbersign:                  0x0023, /* U+0023 NUMBER SIGN */
	XK_dollar:                      0x0024, /* U+0024 DOLLAR SIGN */
	XK_percent:                     0x0025, /* U+0025 PERCENT SIGN */
	XK_ampersand:                   0x0026, /* U+0026 AMPERSAND */
	XK_apostrophe:                  0x0027, /* U+0027 APOSTROPHE */
	XK_quoteright:                  0x0027, /* deprecated */
	XK_parenleft:                   0x0028, /* U+0028 LEFT PARENTHESIS */
	XK_parenright:                  0x0029, /* U+0029 RIGHT PARENTHESIS */
	XK_asterisk:                    0x002a, /* U+002A ASTERISK */
	XK_plus:                        0x002b, /* U+002B PLUS SIGN */
	XK_comma:                       0x002c, /* U+002C COMMA */
	XK_minus:                       0x002d, /* U+002D HYPHEN-MINUS */
	XK_period:                      0x002e, /* U+002E FULL STOP */
	XK_slash:                       0x002f, /* U+002F SOLIDUS */
	XK_0:                           0x0030, /* U+0030 DIGIT ZERO */
	XK_1:                           0x0031, /* U+0031 DIGIT ONE */
	XK_2:                           0x0032, /* U+0032 DIGIT TWO */
	XK_3:                           0x0033, /* U+0033 DIGIT THREE */
	XK_4:                           0x0034, /* U+0034 DIGIT FOUR */
	XK_5:                           0x0035, /* U+0035 DIGIT FIVE */
	XK_6:                           0x0036, /* U+0036 DIGIT SIX */
	XK_7:                           0x0037, /* U+0037 DIGIT SEVEN */
	XK_8:                           0x0038, /* U+0038 DIGIT EIGHT */
	XK_9:                           0x0039, /* U+0039 DIGIT NINE */
	XK_colon:                       0x003a, /* U+003A COLON */
	XK_semicolon:                   0x003b, /* U+003B SEMICOLON */
	XK_less:                        0x003c, /* U+003C LESS-THAN SIGN */
	XK_equal:                       0x003d, /* U+003D EQUALS SIGN */
	XK_greater:                     0x003e, /* U+003E GREATER-THAN SIGN */
	XK_question:                    0x003f, /* U+003F QUESTION MARK */
	XK_at:                          0x0040, /* U+0040 COMMERCIAL AT */
	XK_A:                           0x0041, /* U+0041 LATIN CAPITAL LETTER A */
	XK_B:                           0x0042, /* U+0042 LATIN CAPITAL LETTER B */
	XK_C:                           0x0043, /* U+0043 LATIN CAPITAL LETTER C */
	XK_D:                           0x0044, /* U+0044 LATIN CAPITAL LETTER D */
	XK_E:                           0x0045, /* U+0045 LATIN CAPITAL LETTER E */
	XK_F:                           0x0046, /* U+0046 LATIN CAPITAL LETTER F */
	XK_G:                           0x0047, /* U+0047 LATIN CAPITAL LETTER G */
	XK_H:                           0x0048, /* U+0048 LATIN CAPITAL LETTER H */
	XK_I:                           0x0049, /* U+0049 LATIN CAPITAL LETTER I */
	XK_J:                           0x004a, /* U+004A LATIN CAPITAL LETTER J */
	XK_K:                           0x004b, /* U+004B LATIN CAPITAL LETTER K */
	XK_L:                           0x004c, /* U+004C LATIN CAPITAL LETTER L */
	XK_M:                           0x004d, /* U+004D LATIN CAPITAL LETTER M */
	XK_N:                           0x004e, /* U+004E LATIN CAPITAL LETTER N */
	XK_O:                           0x004f, /* U+004F LATIN CAPITAL LETTER O */
	XK_P:                           0x0050, /* U+0050 LATIN CAPITAL LETTER P */
	XK_Q:                           0x0051, /* U+0051 LATIN CAPITAL LETTER Q */
	XK_R:                           0x0052, /* U+0052 LATIN CAPITAL LETTER R */
	XK_S:                           0x0053, /* U+0053 LATIN CAPITAL LETTER S */
	XK_T:                           0x0054, /* U+0054 LATIN CAPITAL LETTER T */
	XK_U:                           0x0055, /* U+0055 LATIN CAPITAL LETTER U */
	XK_V:                           0x0056, /* U+0056 LATIN CAPITAL LETTER V */
	XK_W:                           0x0057, /* U+0057 LATIN CAPITAL LETTER W */
	XK_X:                           0x0058, /* U+0058 LATIN CAPITAL LETTER X */
	XK_Y:                           0x0059, /* U+0059 LATIN CAPITAL LETTER Y */
	XK_Z:                           0x005a, /* U+005A LATIN CAPITAL LETTER Z */
	XK_bracketleft:                 0x005b, /* U+005B LEFT SQUARE BRACKET */
	XK_backslash:                   0x005c, /* U+005C REVERSE SOLIDUS */
	XK_bracketright:                0x005d, /* U+005D RIGHT SQUARE BRACKET */
	XK_asciicircum:                 0x005e, /* U+005E CIRCUMFLEX ACCENT */
	XK_underscore:                  0x005f, /* U+005F LOW LINE */
	XK_grave:                       0x0060, /* U+0060 GRAVE ACCENT */
	XK_quoteleft:                   0x0060, /* deprecated */
	XK_a:                           0x0061, /* U+0061 LATIN SMALL LETTER A */
	XK_b:                           0x0062, /* U+0062 LATIN SMALL LETTER B */
	XK_c:                           0x0063, /* U+0063 LATIN SMALL LETTER C */
	XK_d:                           0x0064, /* U+0064 LATIN SMALL LETTER D */
	XK_e:                           0x0065, /* U+0065 LATIN SMALL LETTER E */
	XK_f:                           0x0066, /* U+0066 LATIN SMALL LETTER F */
	XK_g:                           0x0067, /* U+0067 LATIN SMALL LETTER G */
	XK_h:                           0x0068, /* U+0068 LATIN SMALL LETTER H */
	XK_i:                           0x0069, /* U+0069 LATIN SMALL LETTER I */
	XK_j:                           0x006a, /* U+006A LATIN SMALL LETTER J */
	XK_k:                           0x006b, /* U+006B LATIN SMALL LETTER K */
	XK_l:                           0x006c, /* U+006C LATIN SMALL LETTER L */
	XK_m:                           0x006d, /* U+006D LATIN SMALL LETTER M */
	XK_n:                           0x006e, /* U+006E LATIN SMALL LETTER N */
	XK_o:                           0x006f, /* U+006F LATIN SMALL LETTER O */
	XK_p:                           0x0070, /* U+0070 LATIN SMALL LETTER P */
	XK_q:                           0x0071, /* U+0071 LATIN SMALL LETTER Q */
	XK_r:                           0x0072, /* U+0072 LATIN SMALL LETTER R */
	XK_s:                           0x0073, /* U+0073 LATIN SMALL LETTER S */
	XK_t:                           0x0074, /* U+0074 LATIN SMALL LETTER T */
	XK_u:                           0x0075, /* U+0075 LATIN SMALL LETTER U */
	XK_v:                           0x0076, /* U+0076 LATIN SMALL LETTER V */
	XK_w:                           0x0077, /* U+0077 LATIN SMALL LETTER W */
	XK_x:                           0x0078, /* U+0078 LATIN SMALL LETTER X */
	XK_y:                           0x0079, /* U+0079 LATIN SMALL LETTER Y */
	XK_z:                           0x007a, /* U+007A LATIN SMALL LETTER Z */
	XK_braceleft:                   0x007b, /* U+007B LEFT CURLY BRACKET */
	XK_bar:                         0x007c, /* U+007C VERTICAL LINE */
	XK_braceright:                  0x007d, /* U+007D RIGHT CURLY BRACKET */
	XK_asciitilde:                  0x007e, /* U+007E TILDE */

	XK_nobreakspace:                0x00a0, /* U+00A0 NO-BREAK SPACE */
	XK_exclamdown:                  0x00a1, /* U+00A1 INVERTED EXCLAMATION MARK */
	XK_cent:                        0x00a2, /* U+00A2 CENT SIGN */
	XK_sterling:                    0x00a3, /* U+00A3 POUND SIGN */
	XK_currency:                    0x00a4, /* U+00A4 CURRENCY SIGN */
	XK_yen:                         0x00a5, /* U+00A5 YEN SIGN */
	XK_brokenbar:                   0x00a6, /* U+00A6 BROKEN BAR */
	XK_section:                     0x00a7, /* U+00A7 SECTION SIGN */
	XK_diaeresis:                   0x00a8, /* U+00A8 DIAERESIS */
	XK_copyright:                   0x00a9, /* U+00A9 COPYRIGHT SIGN */
	XK_ordfeminine:                 0x00aa, /* U+00AA FEMININE ORDINAL INDICATOR */
	XK_guillemotleft:               0x00ab, /* U+00AB LEFT-POINTING DOUBLE ANGLE QUOTATION MARK */
	XK_notsign:                     0x00ac, /* U+00AC NOT SIGN */
	XK_hyphen:                      0x00ad, /* U+00AD SOFT HYPHEN */
	XK_registered:                  0x00ae, /* U+00AE REGISTERED SIGN */
	XK_macron:                      0x00af, /* U+00AF MACRON */
	XK_degree:                      0x00b0, /* U+00B0 DEGREE SIGN */
	XK_plusminus:                   0x00b1, /* U+00B1 PLUS-MINUS SIGN */
	XK_twosuperior:                 0x00b2, /* U+00B2 SUPERSCRIPT TWO */
	XK_threesuperior:               0x00b3, /* U+00B3 SUPERSCRIPT THREE */
	XK_acute:                       0x00b4, /* U+00B4 ACUTE ACCENT */
	XK_mu:                          0x00b5, /* U+00B5 MICRO SIGN */
	XK_paragraph:                   0x00b6, /* U+00B6 PILCROW SIGN */
	XK_periodcentered:              0x00b7, /* U+00B7 MIDDLE DOT */
	XK_cedilla:                     0x00b8, /* U+00B8 CEDILLA */
	XK_onesuperior:                 0x00b9, /* U+00B9 SUPERSCRIPT ONE */
	XK_masculine:                   0x00ba, /* U+00BA MASCULINE ORDINAL INDICATOR */
	XK_guillemotright:              0x00bb, /* U+00BB RIGHT-POINTING DOUBLE ANGLE QUOTATION MARK */
	XK_onequarter:                  0x00bc, /* U+00BC VULGAR FRACTION ONE QUARTER */
	XK_onehalf:                     0x00bd, /* U+00BD VULGAR FRACTION ONE HALF */
	XK_threequarters:               0x00be, /* U+00BE VULGAR FRACTION THREE QUARTERS */
	XK_questiondown:                0x00bf, /* U+00BF INVERTED QUESTION MARK */
	XK_Agrave:                      0x00c0, /* U+00C0 LATIN CAPITAL LETTER A WITH GRAVE */
	XK_Aacute:                      0x00c1, /* U+00C1 LATIN CAPITAL LETTER A WITH ACUTE */
	XK_Acircumflex:                 0x00c2, /* U+00C2 LATIN CAPITAL LETTER A WITH CIRCUMFLEX */
	XK_Atilde:                      0x00c3, /* U+00C3 LATIN CAPITAL LETTER A WITH TILDE */
	XK_Adiaeresis:                  0x00c4, /* U+00C4 LATIN CAPITAL LETTER A WITH DIAERESIS */
	XK_Aring:                       0x00c5, /* U+00C5 LATIN CAPITAL LETTER A WITH RING ABOVE */
	XK_AE:                          0x00c6, /* U+00C6 LATIN CAPITAL LETTER AE */
	XK_Ccedilla:                    0x00c7, /* U+00C7 LATIN CAPITAL LETTER C WITH CEDILLA */
	XK_Egrave:                      0x00c8, /* U+00C8 LATIN CAPITAL LETTER E WITH GRAVE */
	XK_Eacute:                      0x00c9, /* U+00C9 LATIN CAPITAL LETTER E WITH ACUTE */
	XK_Ecircumflex:                 0x00ca, /* U+00CA LATIN CAPITAL LETTER E WITH CIRCUMFLEX */
	XK_Ediaeresis:                  0x00cb, /* U+00CB LATIN CAPITAL LETTER E WITH DIAERESIS */
	XK_Igrave:                      0x00cc, /* U+00CC LATIN CAPITAL LETTER I WITH GRAVE */
	XK_Iacute:                      0x00cd, /* U+00CD LATIN CAPITAL LETTER I WITH ACUTE */
	XK_Icircumflex:                 0x00ce, /* U+00CE LATIN CAPITAL LETTER I WITH CIRCUMFLEX */
	XK_Idiaeresis:                  0x00cf, /* U+00CF LATIN CAPITAL LETTER I WITH DIAERESIS */
	XK_ETH:                         0x00d0, /* U+00D0 LATIN CAPITAL LETTER ETH */
	XK_Eth:                         0x00d0, /* deprecated */
	XK_Ntilde:                      0x00d1, /* U+00D1 LATIN CAPITAL LETTER N WITH TILDE */
	XK_Ograve:                      0x00d2, /* U+00D2 LATIN CAPITAL LETTER O WITH GRAVE */
	XK_Oacute:                      0x00d3, /* U+00D3 LATIN CAPITAL LETTER O WITH ACUTE */
	XK_Ocircumflex:                 0x00d4, /* U+00D4 LATIN CAPITAL LETTER O WITH CIRCUMFLEX */
	XK_Otilde:                      0x00d5, /* U+00D5 LATIN CAPITAL LETTER O WITH TILDE */
	XK_Odiaeresis:                  0x00d6, /* U+00D6 LATIN CAPITAL LETTER O WITH DIAERESIS */
	XK_multiply:                    0x00d7, /* U+00D7 MULTIPLICATION SIGN */
	XK_Oslash:                      0x00d8, /* U+00D8 LATIN CAPITAL LETTER O WITH STROKE */
	XK_Ooblique:                    0x00d8, /* U+00D8 LATIN CAPITAL LETTER O WITH STROKE */
	XK_Ugrave:                      0x00d9, /* U+00D9 LATIN CAPITAL LETTER U WITH GRAVE */
	XK_Uacute:                      0x00da, /* U+00DA LATIN CAPITAL LETTER U WITH ACUTE */
	XK_Ucircumflex:                 0x00db, /* U+00DB LATIN CAPITAL LETTER U WITH CIRCUMFLEX */
	XK_Udiaeresis:                  0x00dc, /* U+00DC LATIN CAPITAL LETTER U WITH DIAERESIS */
	XK_Yacute:                      0x00dd, /* U+00DD LATIN CAPITAL LETTER Y WITH ACUTE */
	XK_THORN:                       0x00de, /* U+00DE LATIN CAPITAL LETTER THORN */
	XK_Thorn:                       0x00de, /* deprecated */
	XK_ssharp:                      0x00df, /* U+00DF LATIN SMALL LETTER SHARP S */
	XK_agrave:                      0x00e0, /* U+00E0 LATIN SMALL LETTER A WITH GRAVE */
	XK_aacute:                      0x00e1, /* U+00E1 LATIN SMALL LETTER A WITH ACUTE */
	XK_acircumflex:                 0x00e2, /* U+00E2 LATIN SMALL LETTER A WITH CIRCUMFLEX */
	XK_atilde:                      0x00e3, /* U+00E3 LATIN SMALL LETTER A WITH TILDE */
	XK_adiaeresis:                  0x00e4, /* U+00E4 LATIN SMALL LETTER A WITH DIAERESIS */
	XK_aring:                       0x00e5, /* U+00E5 LATIN SMALL LETTER A WITH RING ABOVE */
	XK_ae:                          0x00e6, /* U+00E6 LATIN SMALL LETTER AE */
	XK_ccedilla:                    0x00e7, /* U+00E7 LATIN SMALL LETTER C WITH CEDILLA */
	XK_egrave:                      0x00e8, /* U+00E8 LATIN SMALL LETTER E WITH GRAVE */
	XK_eacute:                      0x00e9, /* U+00E9 LATIN SMALL LETTER E WITH ACUTE */
	XK_ecircumflex:                 0x00ea, /* U+00EA LATIN SMALL LETTER E WITH CIRCUMFLEX */
	XK_ediaeresis:                  0x00eb, /* U+00EB LATIN SMALL LETTER E WITH DIAERESIS */
	XK_igrave:                      0x00ec, /* U+00EC LATIN SMALL LETTER I WITH GRAVE */
	XK_iacute:                      0x00ed, /* U+00ED LATIN SMALL LETTER I WITH ACUTE */
	XK_icircumflex:                 0x00ee, /* U+00EE LATIN SMALL LETTER I WITH CIRCUMFLEX */
	XK_idiaeresis:                  0x00ef, /* U+00EF LATIN SMALL LETTER I WITH DIAERESIS */
	XK_eth:                         0x00f0, /* U+00F0 LATIN SMALL LETTER ETH */
	XK_ntilde:                      0x00f1, /* U+00F1 LATIN SMALL LETTER N WITH TILDE */
	XK_ograve:                      0x00f2, /* U+00F2 LATIN SMALL LETTER O WITH GRAVE */
	XK_oacute:                      0x00f3, /* U+00F3 LATIN SMALL LETTER O WITH ACUTE */
	XK_ocircumflex:                 0x00f4, /* U+00F4 LATIN SMALL LETTER O WITH CIRCUMFLEX */
	XK_otilde:                      0x00f5, /* U+00F5 LATIN SMALL LETTER O WITH TILDE */
	XK_odiaeresis:                  0x00f6, /* U+00F6 LATIN SMALL LETTER O WITH DIAERESIS */
	XK_division:                    0x00f7, /* U+00F7 DIVISION SIGN */
	XK_oslash:                      0x00f8, /* U+00F8 LATIN SMALL LETTER O WITH STROKE */
	XK_ooblique:                    0x00f8, /* U+00F8 LATIN SMALL LETTER O WITH STROKE */
	XK_ugrave:                      0x00f9, /* U+00F9 LATIN SMALL LETTER U WITH GRAVE */
	XK_uacute:                      0x00fa, /* U+00FA LATIN SMALL LETTER U WITH ACUTE */
	XK_ucircumflex:                 0x00fb, /* U+00FB LATIN SMALL LETTER U WITH CIRCUMFLEX */
	XK_udiaeresis:                  0x00fc, /* U+00FC LATIN SMALL LETTER U WITH DIAERESIS */
	XK_yacute:                      0x00fd, /* U+00FD LATIN SMALL LETTER Y WITH ACUTE */
	XK_thorn:                       0x00fe, /* U+00FE LATIN SMALL LETTER THORN */
	XK_ydiaeresis:                  0x00ff  /* U+00FF LATIN SMALL LETTER Y WITH DIAERESIS */
};


/**
 * Mappings from Unicode codepoints to the keysym values (and optionally, key
 * names) expected by the RFB protocol.
 */
var keynames = null;
var codepoints = {'32':32,'33':33,'34':34,'35':35,'36':36,'37':37,'38':38,'39':39,'40':40,'41':41,'42':42,'43':43,'44':44,'45':45,'46':46,'47':47,'48':48,'49':49,'50':50,'51':51,'52':52,'53':53,'54':54,'55':55,'56':56,'57':57,'58':58,'59':59,'60':60,'61':61,'62':62,'63':63,'64':64,'65':65,'66':66,'67':67,'68':68,'69':69,'70':70,'71':71,'72':72,'73':73,'74':74,'75':75,'76':76,'77':77,'78':78,'79':79,'80':80,'81':81,'82':82,'83':83,'84':84,'85':85,'86':86,'87':87,'88':88,'89':89,'90':90,'91':91,'92':92,'93':93,'94':94,'95':95,'96':96,'97':97,'98':98,'99':99,'100':100,'101':101,'102':102,'103':103,'104':104,'105':105,'106':106,'107':107,'108':108,'109':109,'110':110,'111':111,'112':112,'113':113,'114':114,'115':115,'116':116,'117':117,'118':118,'119':119,'120':120,'121':121,'122':122,'123':123,'124':124,'125':125,'126':126,'160':160,'161':161,'162':162,'163':163,'164':164,'165':165,'166':166,'167':167,'168':168,'169':169,'170':170,'171':171,'172':172,'173':173,'174':174,'175':175,'176':176,'177':177,'178':178,'179':179,'180':180,'181':181,'182':182,'183':183,'184':184,'185':185,'186':186,'187':187,'188':188,'189':189,'190':190,'191':191,'192':192,'193':193,'194':194,'195':195,'196':196,'197':197,'198':198,'199':199,'200':200,'201':201,'202':202,'203':203,'204':204,'205':205,'206':206,'207':207,'208':208,'209':209,'210':210,'211':211,'212':212,'213':213,'214':214,'215':215,'216':216,'217':217,'218':218,'219':219,'220':220,'221':221,'222':222,'223':223,'224':224,'225':225,'226':226,'227':227,'228':228,'229':229,'230':230,'231':231,'232':232,'233':233,'234':234,'235':235,'236':236,'237':237,'238':238,'239':239,'240':240,'241':241,'242':242,'243':243,'244':244,'245':245,'246':246,'247':247,'248':248,'249':249,'250':250,'251':251,'252':252,'253':253,'254':254,'255':255,'256':960,'257':992,'258':451,'259':483,'260':417,'261':433,'262':454,'263':486,'264':710,'265':742,'266':709,'267':741,'268':456,'269':488,'270':463,'271':495,'272':464,'273':496,'274':938,'275':954,'278':972,'279':1004,'280':458,'281':490,'282':460,'283':492,'284':728,'285':760,'286':683,'287':699,'288':725,'289':757,'290':939,'291':955,'292':678,'293':694,'294':673,'295':689,'296':933,'297':949,'298':975,'299':1007,'300':16777516,'301':16777517,'302':967,'303':999,'304':681,'305':697,'308':684,'309':700,'310':979,'311':1011,'312':930,'313':453,'314':485,'315':934,'316':950,'317':421,'318':437,'321':419,'322':435,'323':465,'324':497,'325':977,'326':1009,'327':466,'328':498,'330':957,'331':959,'332':978,'333':1010,'336':469,'337':501,'338':5052,'339':5053,'340':448,'341':480,'342':931,'343':947,'344':472,'345':504,'346':422,'347':438,'348':734,'349':766,'350':426,'351':442,'352':425,'353':441,'354':478,'355':510,'356':427,'357':443,'358':940,'359':956,'360':989,'361':1021,'362':990,'363':1022,'364':733,'365':765,'366':473,'367':505,'368':475,'369':507,'370':985,'371':1017,'372':16777588,'373':16777589,'374':16777590,'375':16777591,'376':5054,'377':428,'378':444,'379':431,'380':447,'381':430,'382':446,'399':16777615,'402':2294,'415':16777631,'416':16777632,'417':16777633,'431':16777647,'432':16777648,'437':16777653,'438':16777654,'439':16777655,'466':16777681,'486':16777702,'487':16777703,'601':16777817,'629':16777845,'658':16777874,'711':439,'728':418,'729':511,'731':434,'733':445,'901':1966,'902':1953,'904':1954,'905':1955,'906':1956,'908':1959,'910':1960,'911':1963,'912':1974,'913':1985,'914':1986,'915':1987,'916':1988,'917':1989,'918':1990,'919':1991,'920':1992,'921':1993,'922':1994,'923':1995,'924':1996,'925':1997,'926':1998,'927':1999,'928':2000,'929':2001,'931':2002,'932':2004,'933':2005,'934':2006,'935':2007,'936':2008,'937':2009,'938':1957,'939':1961,'940':1969,'941':1970,'942':1971,'943':1972,'944':1978,'945':2017,'946':2018,'947':2019,'948':2020,'949':2021,'950':2022,'951':2023,'952':2024,'953':2025,'954':2026,'955':2027,'956':2028,'957':2029,'958':2030,'959':2031,'960':2032,'961':2033,'962':2035,'963':2034,'964':2036,'965':2037,'966':2038,'967':2039,'968':2040,'969':2041,'970':1973,'971':1977,'972':1975,'973':1976,'974':1979,'1025':1715,'1026':1713,'1027':1714,'1028':1716,'1029':1717,'1030':1718,'1031':1719,'1032':1720,'1033':1721,'1034':1722,'1035':1723,'1036':1724,'1038':1726,'1039':1727,'1040':1761,'1041':1762,'1042':1783,'1043':1767,'1044':1764,'1045':1765,'1046':1782,'1047':1786,'1048':1769,'1049':1770,'1050':1771,'1051':1772,'1052':1773,'1053':1774,'1054':1775,'1055':1776,'1056':1778,'1057':1779,'1058':1780,'1059':1781,'1060':1766,'1061':1768,'1062':1763,'1063':1790,'1064':1787,'1065':1789,'1066':1791,'1067':1785,'1068':1784,'1069':1788,'1070':1760,'1071':1777,'1072':1729,'1073':1730,'1074':1751,'1075':1735,'1076':1732,'1077':1733,'1078':1750,'1079':1754,'1080':1737,'1081':1738,'1082':1739,'1083':1740,'1084':1741,'1085':1742,'1086':1743,'1087':1744,'1088':1746,'1089':1747,'1090':1748,'1091':1749,'1092':1734,'1093':1736,'1094':1731,'1095':1758,'1096':1755,'1097':1757,'1098':1759,'1099':1753,'1100':1752,'1101':1756,'1102':1728,'1103':1745,'1105':1699,'1106':1697,'1107':1698,'1108':1700,'1109':1701,'1110':1702,'1111':1703,'1112':1704,'1113':1705,'1114':1706,'1115':1707,'1116':1708,'1118':1710,'1119':1711,'1168':1725,'1169':1709,'1170':16778386,'1171':16778387,'1174':16778390,'1175':16778391,'1178':16778394,'1179':16778395,'1180':16778396,'1181':16778397,'1186':16778402,'1187':16778403,'1198':16778414,'1199':16778415,'1200':16778416,'1201':16778417,'1202':16778418,'1203':16778419,'1206':16778422,'1207':16778423,'1208':16778424,'1209':16778425,'1210':16778426,'1211':16778427,'1240':16778456,'1241':16778457,'1250':16778466,'1251':16778467,'1256':16778472,'1257':16778473,'1262':16778478,'1263':16778479,'1329':16778545,'1330':16778546,'1331':16778547,'1332':16778548,'1333':16778549,'1334':16778550,'1335':16778551,'1336':16778552,'1337':16778553,'1338':16778554,'1339':16778555,'1340':16778556,'1341':16778557,'1342':16778558,'1343':16778559,'1344':16778560,'1345':16778561,'1346':16778562,'1347':16778563,'1348':16778564,'1349':16778565,'1350':16778566,'1351':16778567,'1352':16778568,'1353':16778569,'1354':16778570,'1355':16778571,'1356':16778572,'1357':16778573,'1358':16778574,'1359':16778575,'1360':16778576,'1361':16778577,'1362':16778578,'1363':16778579,'1364':16778580,'1365':16778581,'1366':16778582,'1370':16778586,'1371':16778587,'1372':16778588,'1373':16778589,'1374':16778590,'1377':16778593,'1378':16778594,'1379':16778595,'1380':16778596,'1381':16778597,'1382':16778598,'1383':16778599,'1384':16778600,'1385':16778601,'1386':16778602,'1387':16778603,'1388':16778604,'1389':16778605,'1390':16778606,'1391':16778607,'1392':16778608,'1393':16778609,'1394':16778610,'1395':16778611,'1396':16778612,'1397':16778613,'1398':16778614,'1399':16778615,'1400':16778616,'1401':16778617,'1402':16778618,'1403':16778619,'1404':16778620,'1405':16778621,'1406':16778622,'1407':16778623,'1408':16778624,'1409':16778625,'1410':16778626,'1411':16778627,'1412':16778628,'1413':16778629,'1414':16778630,'1415':16778631,'1417':16778633,'1418':16778634,'1488':3296,'1489':3297,'1490':3298,'1491':3299,'1492':3300,'1493':3301,'1494':3302,'1495':3303,'1496':3304,'1497':3305,'1498':3306,'1499':3307,'1500':3308,'1501':3309,'1502':3310,'1503':3311,'1504':3312,'1505':3313,'1506':3314,'1507':3315,'1508':3316,'1509':3317,'1510':3318,'1511':3319,'1512':3320,'1513':3321,'1514':3322,'1548':1452,'1563':1467,'1567':1471,'1569':1473,'1570':1474,'1571':1475,'1572':1476,'1573':1477,'1574':1478,'1575':1479,'1576':1480,'1577':1481,'1578':1482,'1579':1483,'1580':1484,'1581':1485,'1582':1486,'1583':1487,'1584':1488,'1585':1489,'1586':1490,'1587':1491,'1588':1492,'1589':1493,'1590':1494,'1591':1495,'1592':1496,'1593':1497,'1594':1498,'1600':1504,'1601':1505,'1602':1506,'1603':1507,'1604':1508,'1605':1509,'1606':1510,'1607':1511,'1608':1512,'1609':1513,'1610':1514,'1611':1515,'1612':1516,'1613':1517,'1614':1518,'1615':1519,'1616':1520,'1617':1521,'1618':1522,'1619':16778835,'1620':16778836,'1621':16778837,'1632':16778848,'1633':16778849,'1634':16778850,'1635':16778851,'1636':16778852,'1637':16778853,'1638':16778854,'1639':16778855,'1640':16778856,'1641':16778857,'1642':16778858,'1648':16778864,'1657':16778873,'1662':16778878,'1670':16778886,'1672':16778888,'1681':16778897,'1688':16778904,'1700':16778916,'1705':16778921,'1711':16778927,'1722':16778938,'1726':16778942,'1729':16778945,'1740':16778956,'1746':16778962,'1748':16778964,'1776':16778992,'1777':16778993,'1778':16778994,'1779':16778995,'1780':16778996,'1781':16778997,'1782':16778998,'1783':16778999,'1784':16779000,'1785':16779001,'3458':16780674,'3459':16780675,'3461':16780677,'3462':16780678,'3463':16780679,'3464':16780680,'3465':16780681,'3466':16780682,'3467':16780683,'3468':16780684,'3469':16780685,'3470':16780686,'3471':16780687,'3472':16780688,'3473':16780689,'3474':16780690,'3475':16780691,'3476':16780692,'3477':16780693,'3478':16780694,'3482':16780698,'3483':16780699,'3484':16780700,'3485':16780701,'3486':16780702,'3487':16780703,'3488':16780704,'3489':16780705,'3490':16780706,'3491':16780707,'3492':16780708,'3493':16780709,'3494':16780710,'3495':16780711,'3496':16780712,'3497':16780713,'3498':16780714,'3499':16780715,'3500':16780716,'3501':16780717,'3502':16780718,'3503':16780719,'3504':16780720,'3505':16780721,'3507':16780723,'3508':16780724,'3509':16780725,'3510':16780726,'3511':16780727,'3512':16780728,'3513':16780729,'3514':16780730,'3515':16780731,'3517':16780733,'3520':16780736,'3521':16780737,'3522':16780738,'3523':16780739,'3524':16780740,'3525':16780741,'3526':16780742,'3530':16780746,'3535':16780751,'3536':16780752,'3537':16780753,'3538':16780754,'3539':16780755,'3540':16780756,'3542':16780758,'3544':16780760,'3545':16780761,'3546':16780762,'3547':16780763,'3548':16780764,'3549':16780765,'3550':16780766,'3551':16780767,'3570':16780786,'3571':16780787,'3572':16780788,'3585':3489,'3586':3490,'3587':3491,'3588':3492,'3589':3493,'3590':3494,'3591':3495,'3592':3496,'3593':3497,'3594':3498,'3595':3499,'3596':3500,'3597':3501,'3598':3502,'3599':3503,'3600':3504,'3601':3505,'3602':3506,'3603':3507,'3604':3508,'3605':3509,'3606':3510,'3607':3511,'3608':3512,'3609':3513,'3610':3514,'3611':3515,'3612':3516,'3613':3517,'3614':3518,'3615':3519,'3616':3520,'3617':3521,'3618':3522,'3619':3523,'3620':3524,'3621':3525,'3622':3526,'3623':3527,'3624':3528,'3625':3529,'3626':3530,'3627':3531,'3628':3532,'3629':3533,'3630':3534,'3631':3535,'3632':3536,'3633':3537,'3634':3538,'3635':3539,'3636':3540,'3637':3541,'3638':3542,'3639':3543,'3640':3544,'3641':3545,'3642':3546,'3647':3551,'3648':3552,'3649':3553,'3650':3554,'3651':3555,'3652':3556,'3653':3557,'3654':3558,'3655':3559,'3656':3560,'3657':3561,'3658':3562,'3659':3563,'3660':3564,'3661':3565,'3664':3568,'3665':3569,'3666':3570,'3667':3571,'3668':3572,'3669':3573,'3670':3574,'3671':3575,'3672':3576,'3673':3577,'4304':16781520,'4305':16781521,'4306':16781522,'4307':16781523,'4308':16781524,'4309':16781525,'4310':16781526,'4311':16781527,'4312':16781528,'4313':16781529,'4314':16781530,'4315':16781531,'4316':16781532,'4317':16781533,'4318':16781534,'4319':16781535,'4320':16781536,'4321':16781537,'4322':16781538,'4323':16781539,'4324':16781540,'4325':16781541,'4326':16781542,'4327':16781543,'4328':16781544,'4329':16781545,'4330':16781546,'4331':16781547,'4332':16781548,'4333':16781549,'4334':16781550,'4335':16781551,'4336':16781552,'4337':16781553,'4338':16781554,'4339':16781555,'4340':16781556,'4341':16781557,'4342':16781558,'7682':16784898,'7683':16784899,'7690':16784906,'7691':16784907,'7710':16784926,'7711':16784927,'7734':16784950,'7735':16784951,'7744':16784960,'7745':16784961,'7766':16784982,'7767':16784983,'7776':16784992,'7777':16784993,'7786':16785002,'7787':16785003,'7808':16785024,'7809':16785025,'7810':16785026,'7811':16785027,'7812':16785028,'7813':16785029,'7818':16785034,'7819':16785035,'7840':16785056,'7841':16785057,'7842':16785058,'7843':16785059,'7844':16785060,'7845':16785061,'7846':16785062,'7847':16785063,'7848':16785064,'7849':16785065,'7850':16785066,'7851':16785067,'7852':16785068,'7853':16785069,'7854':16785070,'7855':16785071,'7856':16785072,'7857':16785073,'7858':16785074,'7859':16785075,'7860':16785076,'7861':16785077,'7862':16785078,'7863':16785079,'7864':16785080,'7865':16785081,'7866':16785082,'7867':16785083,'7868':16785084,'7869':16785085,'7870':16785086,'7871':16785087,'7872':16785088,'7873':16785089,'7874':16785090,'7875':16785091,'7876':16785092,'7877':16785093,'7878':16785094,'7879':16785095,'7880':16785096,'7881':16785097,'7882':16785098,'7883':16785099,'7884':16785100,'7885':16785101,'7886':16785102,'7887':16785103,'7888':16785104,'7889':16785105,'7890':16785106,'7891':16785107,'7892':16785108,'7893':16785109,'7894':16785110,'7895':16785111,'7896':16785112,'7897':16785113,'7898':16785114,'7899':16785115,'7900':16785116,'7901':16785117,'7902':16785118,'7903':16785119,'7904':16785120,'7905':16785121,'7906':16785122,'7907':16785123,'7908':16785124,'7909':16785125,'7910':16785126,'7911':16785127,'7912':16785128,'7913':16785129,'7914':16785130,'7915':16785131,'7916':16785132,'7917':16785133,'7918':16785134,'7919':16785135,'7920':16785136,'7921':16785137,'7922':16785138,'7923':16785139,'7924':16785140,'7925':16785141,'7926':16785142,'7927':16785143,'7928':16785144,'7929':16785145,'8194':2722,'8195':2721,'8196':2723,'8197':2724,'8199':2725,'8200':2726,'8201':2727,'8202':2728,'8210':2747,'8211':2730,'8212':2729,'8213':1967,'8215':3295,'8216':2768,'8217':2769,'8218':2813,'8220':2770,'8221':2771,'8222':2814,'8224':2801,'8225':2802,'8226':2790,'8229':2735,'8230':2734,'8240':2773,'8242':2774,'8243':2775,'8248':2812,'8254':1150,'8304':16785520,'8308':16785524,'8309':16785525,'8310':16785526,'8311':16785527,'8312':16785528,'8313':16785529,'8320':16785536,'8321':16785537,'8322':16785538,'8323':16785539,'8324':16785540,'8325':16785541,'8326':16785542,'8327':16785543,'8328':16785544,'8329':16785545,'8352':16785568,'8353':16785569,'8354':16785570,'8355':16785571,'8356':16785572,'8357':16785573,'8358':16785574,'8359':16785575,'8360':16785576,'8361':3839,'8362':16785578,'8363':16785579,'8364':8364,'8453':2744,'8470':1712,'8471':2811,'8478':2772,'8482':2761,'8531':2736,'8532':2737,'8533':2738,'8534':2739,'8535':2740,'8536':2741,'8537':2742,'8538':2743,'8539':2755,'8540':2756,'8541':2757,'8542':2758,'8592':2299,'8593':2300,'8594':2301,'8595':2302,'8658':2254,'8660':2253,'8706':2287,'8709':16785925,'8711':2245,'8712':16785928,'8713':16785929,'8715':16785931,'8728':3018,'8730':2262,'8731':16785947,'8732':16785948,'8733':2241,'8734':2242,'8743':2270,'8744':2271,'8745':2268,'8746':2269,'8747':2239,'8748':16785964,'8749':16785965,'8756':2240,'8757':16785973,'8764':2248,'8771':2249,'8773':16785992,'8775':16785991,'8800':2237,'8801':2255,'8802':16786018,'8803':16786019,'8804':2236,'8805':2238,'8834':2266,'8835':2267,'8866':3068,'8867':3036,'8868':3010,'8869':3022,'8968':3027,'8970':3012,'8981':2810,'8992':2212,'8993':2213,'9109':3020,'9115':2219,'9117':2220,'9118':2221,'9120':2222,'9121':2215,'9123':2216,'9124':2217,'9126':2218,'9128':2223,'9132':2224,'9143':2209,'9146':2543,'9147':2544,'9148':2546,'9149':2547,'9225':2530,'9226':2533,'9227':2537,'9228':2531,'9229':2532,'9251':2732,'9252':2536,'9472':2211,'9474':2214,'9484':2210,'9488':2539,'9492':2541,'9496':2538,'9500':2548,'9508':2549,'9516':2551,'9524':2550,'9532':2542,'9618':2529,'9642':2791,'9643':2785,'9644':2779,'9645':2786,'9646':2783,'9647':2767,'9650':2792,'9651':2787,'9654':2781,'9655':2765,'9660':2793,'9661':2788,'9664':2780,'9665':2764,'9670':2528,'9675':2766,'9679':2782,'9702':2784,'9734':2789,'9742':2809,'9747':2762,'9756':2794,'9758':2795,'9792':2808,'9794':2807,'9827':2796,'9829':2798,'9830':2797,'9837':2806,'9839':2805,'10003':2803,'10007':2804,'10013':2777,'10016':2800,'10216':2748,'10217':2750,'10240':16787456,'10241':16787457,'10242':16787458,'10243':16787459,'10244':16787460,'10245':16787461,'10246':16787462,'10247':16787463,'10248':16787464,'10249':16787465,'10250':16787466,'10251':16787467,'10252':16787468,'10253':16787469,'10254':16787470,'10255':16787471,'10256':16787472,'10257':16787473,'10258':16787474,'10259':16787475,'10260':16787476,'10261':16787477,'10262':16787478,'10263':16787479,'10264':16787480,'10265':16787481,'10266':16787482,'10267':16787483,'10268':16787484,'10269':16787485,'10270':16787486,'10271':16787487,'10272':16787488,'10273':16787489,'10274':16787490,'10275':16787491,'10276':16787492,'10277':16787493,'10278':16787494,'10279':16787495,'10280':16787496,'10281':16787497,'10282':16787498,'10283':16787499,'10284':16787500,'10285':16787501,'10286':16787502,'10287':16787503,'10288':16787504,'10289':16787505,'10290':16787506,'10291':16787507,'10292':16787508,'10293':16787509,'10294':16787510,'10295':16787511,'10296':16787512,'10297':16787513,'10298':16787514,'10299':16787515,'10300':16787516,'10301':16787517,'10302':16787518,'10303':16787519,'10304':16787520,'10305':16787521,'10306':16787522,'10307':16787523,'10308':16787524,'10309':16787525,'10310':16787526,'10311':16787527,'10312':16787528,'10313':16787529,'10314':16787530,'10315':16787531,'10316':16787532,'10317':16787533,'10318':16787534,'10319':16787535,'10320':16787536,'10321':16787537,'10322':16787538,'10323':16787539,'10324':16787540,'10325':16787541,'10326':16787542,'10327':16787543,'10328':16787544,'10329':16787545,'10330':16787546,'10331':16787547,'10332':16787548,'10333':16787549,'10334':16787550,'10335':16787551,'10336':16787552,'10337':16787553,'10338':16787554,'10339':16787555,'10340':16787556,'10341':16787557,'10342':16787558,'10343':16787559,'10344':16787560,'10345':16787561,'10346':16787562,'10347':16787563,'10348':16787564,'10349':16787565,'10350':16787566,'10351':16787567,'10352':16787568,'10353':16787569,'10354':16787570,'10355':16787571,'10356':16787572,'10357':16787573,'10358':16787574,'10359':16787575,'10360':16787576,'10361':16787577,'10362':16787578,'10363':16787579,'10364':16787580,'10365':16787581,'10366':16787582,'10367':16787583,'10368':16787584,'10369':16787585,'10370':16787586,'10371':16787587,'10372':16787588,'10373':16787589,'10374':16787590,'10375':16787591,'10376':16787592,'10377':16787593,'10378':16787594,'10379':16787595,'10380':16787596,'10381':16787597,'10382':16787598,'10383':16787599,'10384':16787600,'10385':16787601,'10386':16787602,'10387':16787603,'10388':16787604,'10389':16787605,'10390':16787606,'10391':16787607,'10392':16787608,'10393':16787609,'10394':16787610,'10395':16787611,'10396':16787612,'10397':16787613,'10398':16787614,'10399':16787615,'10400':16787616,'10401':16787617,'10402':16787618,'10403':16787619,'10404':16787620,'10405':16787621,'10406':16787622,'10407':16787623,'10408':16787624,'10409':16787625,'10410':16787626,'10411':16787627,'10412':16787628,'10413':16787629,'10414':16787630,'10415':16787631,'10416':16787632,'10417':16787633,'10418':16787634,'10419':16787635,'10420':16787636,'10421':16787637,'10422':16787638,'10423':16787639,'10424':16787640,'10425':16787641,'10426':16787642,'10427':16787643,'10428':16787644,'10429':16787645,'10430':16787646,'10431':16787647,'10432':16787648,'10433':16787649,'10434':16787650,'10435':16787651,'10436':16787652,'10437':16787653,'10438':16787654,'10439':16787655,'10440':16787656,'10441':16787657,'10442':16787658,'10443':16787659,'10444':16787660,'10445':16787661,'10446':16787662,'10447':16787663,'10448':16787664,'10449':16787665,'10450':16787666,'10451':16787667,'10452':16787668,'10453':16787669,'10454':16787670,'10455':16787671,'10456':16787672,'10457':16787673,'10458':16787674,'10459':16787675,'10460':16787676,'10461':16787677,'10462':16787678,'10463':16787679,'10464':16787680,'10465':16787681,'10466':16787682,'10467':16787683,'10468':16787684,'10469':16787685,'10470':16787686,'10471':16787687,'10472':16787688,'10473':16787689,'10474':16787690,'10475':16787691,'10476':16787692,'10477':16787693,'10478':16787694,'10479':16787695,'10480':16787696,'10481':16787697,'10482':16787698,'10483':16787699,'10484':16787700,'10485':16787701,'10486':16787702,'10487':16787703,'10488':16787704,'10489':16787705,'10490':16787706,'10491':16787707,'10492':16787708,'10493':16787709,'10494':16787710,'10495':16787711,'12289':1188,'12290':1185,'12300':1186,'12301':1187,'12443':1246,'12444':1247,'12449':1191,'12450':1201,'12451':1192,'12452':1202,'12453':1193,'12454':1203,'12455':1194,'12456':1204,'12457':1195,'12458':1205,'12459':1206,'12461':1207,'12463':1208,'12465':1209,'12467':1210,'12469':1211,'12471':1212,'12473':1213,'12475':1214,'12477':1215,'12479':1216,'12481':1217,'12483':1199,'12484':1218,'12486':1219,'12488':1220,'12490':1221,'12491':1222,'12492':1223,'12493':1224,'12494':1225,'12495':1226,'12498':1227,'12501':1228,'12504':1229,'12507':1230,'12510':1231,'12511':1232,'12512':1233,'12513':1234,'12514':1235,'12515':1196,'12516':1236,'12517':1197,'12518':1237,'12519':1198,'12520':1238,'12521':1239,'12522':1240,'12523':1241,'12524':1242,'12525':1243,'12527':1244,'12530':1190,'12531':1245,'12539':1189,'12540':1200};


function lookup(k) {
	return k ? {keysym: k, keyname: keynames ? keynames[k] : k} : undefined;
}


function fromUnicode(u) {
	return lookup(codepoints[u]);
}


/**
 * Expose lookup() and fromUnicode() functions.
 */
Keys.lookup = lookup;
Keys.fromUnicode = fromUnicode;


/**
 * Expose Keys Object.
 */
module.exports = Keys;

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/novnc-node/lib/keys.js","/../../node_modules/novnc-node/lib")
},{"buffer":3,"rH1JPG":19}],13:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*
 * noVNC: HTML5 VNC client
 * Copyright (C) 2012 Joel Martin
 * Copyright (C) 2013 Samuel Mannehed for Cendio AB
 * Licensed under MPL 2.0 (see LICENSE.txt)
 *
 * TIGHT decoder portion:
 * (c) 2012 Michael Tinglof, Joe Balaz, Les Piech (Mercuri.ca)
 */


/**
 * Expose the RFB class.
 */
module.exports = RFB;


/**
 * Dependencies.
 */
var debug = require('debug')('noVNC:RFB');
var debugerror = require('debug')('noVNC:ERROR:RFB');
debugerror.log = console.warn.bind(console);
var Util = require('./util');
var Websock = require('./websock');
var Keys = require('./keys');
var Input = require('./input');
var Keyboard = Input.Keyboard;
var Mouse = Input.Mouse;
var Display = require('./display');
var Base64 = require('./base64');
var DES = require('./des');
var TINF = require('./tinf');


function RFB (defaults) {
	debug('new()');

	defaults = defaults || {};

	this._rfb_url = null;
	this._rfb_password = '';

	this._rfb_state = 'disconnected';
	this._rfb_version = 0;
	this._rfb_max_version = 3.8;
	this._rfb_auth_scheme = '';

	this._rfb_tightvnc = false;
	this._rfb_xvp_ver = 0;

	// In preference order
	this._encodings = [
		['COPYRECT',         0x01 ],
		['TIGHT',            0x07 ],
		['TIGHT_PNG',        -260 ],
		['HEXTILE',          0x05 ],
		['RRE',              0x02 ],
		['RAW',              0x00 ],
		['DesktopSize',      -223 ],
		['Cursor',           -239 ],

		// Psuedo-encoding settings
		//['JPEG_quality_lo',    -32 ],
		['JPEG_quality_med',     -26 ],
		//['JPEG_quality_hi',    -23 ],
		//['compress_lo',       -255 ],
		['compress_hi',         -247 ],
		['last_rect',           -224 ],
		['xvp',                 -309 ],
		['ExtendedDesktopSize', -308 ]
	];

	this._encHandlers = {};
	this._encNames = {};
	this._encStats = {};

	this._sock = null;              // Websock object
	this._display = null;           // Display object
	this._keyboard = null;          // Keyboard input handler object
	this._mouse = null;             // Mouse input handler object
	this._sendTimer = null;         // Send Queue check timer
	this._disconnTimer = null;      // disconnection timer
	this._msgTimer = null;          // queued handle_msg timer

	// Frame buffer update state
	this._FBU = {
		rects: 0,
		subrects: 0,            // RRE
		lines: 0,               // RAW
		tiles: 0,               // HEXTILE
		bytes: 0,
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		encoding: 0,
		subencoding: -1,
		background: null,
		zlib: []                // TIGHT zlib streams
	};

	this._fb_Bpp = 4;
	this._fb_depth = 3;
	this._fb_width = 0;
	this._fb_height = 0;
	this._fb_name = '';

	this._rre_chunk_sz = 100;

	this._timing = {
		last_fbu: 0,
		fbu_total: 0,
		fbu_total_cnt: 0,
		full_fbu_total: 0,
		full_fbu_cnt: 0,

		fbu_rt_start: 0,
		fbu_rt_total: 0,
		fbu_rt_cnt: 0,
		pixels: 0
	};

	this._supportsSetDesktopSize = false;
	this._screen_id = 0;
	this._screen_flags = 0;

	// Mouse state
	this._mouse_buttonMask = 0;
	this._mouse_arr = [];
	this._viewportDragging = false;
	this._viewportDragPos = {};

	// set the default value on user-facing properties
	Util.set_defaults(this, defaults, {
		'target': 'null',                       // VNC display rendering Canvas object
		'focusContainer': document,             // DOM element that captures keyboard input
		'encrypt': false,                       // Use TLS/SSL/wss encryption
		'true_color': true,                     // Request true color pixel data
		'local_cursor': false,                  // Request locally rendered cursor
		'shared': true,                         // Request shared mode
		'view_only': false,                     // Disable client mouse/keyboard
		'xvp_password_sep': '@',                // Separator for XVP password fields
		'disconnectTimeout': 3,                 // Time (s) to wait for disconnection
		'wsProtocols': ['binary', 'base64'],    // Protocols to use in the WebSocket connection
		'repeaterID': '',                       // [UltraVNC] RepeaterID to connect to
		'viewportDrag': false,                  // Move the viewport on mouse drags
		'forceAuthScheme': 0,                   // Force auth scheme (0 means no)
		'enableMouseAndTouch': false,           // Whether also enable mouse events when touch screen is detected

		// Callback functions
		'onUpdateState': function () { },       // onUpdateState(rfb, state, oldstate, statusMsg): state update/change
		'onPasswordRequired': function () { },  // onPasswordRequired(rfb): VNC password is required
		'onClipboard': function () { },         // onClipboard(rfb, text): RFB clipboard contents received
		'onBell': function () { },              // onBell(rfb): RFB Bell message received
		'onFBUReceive': function () { },        // onFBUReceive(rfb, fbu): RFB FBU received but not yet processed
		'onFBUComplete': function () { },       // onFBUComplete(rfb, fbu): RFB FBU received and processed
		'onFBResize': function () { },          // onFBResize(rfb, width, height): frame buffer resized
		'onDesktopName': function () { },       // onDesktopName(rfb, name): desktop name received
		'onXvpInit': function () { },           // onXvpInit(version): XVP extensions active for this connection
		'onUnknownMessageType': null            // Handler for unknown VNC message types. If
												                    // null failure is emitted and the RFB closed.
	});

	// populate encHandlers with bound versions
	Object.keys(RFB.encodingHandlers).forEach(function (encName) {
		this._encHandlers[encName] = RFB.encodingHandlers[encName].bind(this);
	}.bind(this));

	// Create lookup tables based on encoding number
	for (var i = 0; i < this._encodings.length; i++) {
		this._encHandlers[this._encodings[i][1]] = this._encHandlers[this._encodings[i][0]];
		this._encNames[this._encodings[i][1]] = this._encodings[i][0];
		this._encStats[this._encodings[i][1]] = [0, 0];
	}

	try {
		this._display = new Display({target: this._target});
	} catch(error) {
		debugerror('Display exception: ' + error);
		// Don't continue. Avoid ugly errors in "fatal" state.
		throw(error);
	}

	this._keyboard = new Keyboard({
		target: this._focusContainer,
		onKeyPress: this._handleKeyPress.bind(this)
	});

	this._mouse = new Mouse({
		target: this._target,
		onMouseButton: this._handleMouseButton.bind(this),
		onMouseMove: this._handleMouseMove.bind(this),
		notify: this._keyboard.sync.bind(this._keyboard),
		enableMouseAndTouch: this._enableMouseAndTouch
	});

	this._sock = new Websock();

	this._sock.on('message', this._handle_message.bind(this));

	this._sock.on('open', function () {
		if (this._rfb_state === 'connect') {
			this._updateState('ProtocolVersion', 'Starting VNC handshake');
		} else {
			this._fail('Got unexpected WebSocket connection');
		}
	}.bind(this));

	this._sock.on('close', function (e) {
		debug('WebSocket closed');

		var msg = '';
		if (e.code) {
			msg = ' (code: ' + e.code;
			if (e.reason) {
				msg += ', reason: ' + e.reason;
			}
			msg += ')';
		}
		if (this._rfb_state === 'disconnect') {
			this._updateState('disconnected', 'VNC disconnected' + msg);
		} else if (this._rfb_state === 'ProtocolVersion') {
			this._fail('Failed to connect to server' + msg);
		} else if (this._rfb_state in {'failed': 1, 'disconnected': 1}) {
			debug('Received onclose while disconnected' + msg);
		} else {
			this._fail('Server disconnected' + msg);
		}
		this._sock.off('close');
	}.bind(this));

	this._sock.on('error', function () {
		debugerror('WebSocket error');
	});

	this._init_vars();

	var rmode = this._display.get_render_mode();

	this._updateState('loaded', 'noVNC ready: ' + rmode);
}


RFB.prototype = {
	// Public methods
	connect: function (url, password) {
		this._rfb_url = url;
		this._rfb_password = (password !== undefined) ? password : '';

		this._updateState('connect', 'Connecting');
	},

	disconnect: function () {
		this._updateState('disconnect', 'Disconnecting');
		this._sock.off('error');
		this._sock.off('message');
		this._sock.off('open');
	},

	sendPassword: function (passwd) {
		this._rfb_password = passwd;
		this._rfb_state = 'Authentication';
		setTimeout(this._init_msg.bind(this), 1);
	},

	sendCtrlAltDel: function () {
		if (this._rfb_state !== 'normal' || this._view_only) { return false; }

		var arr = [];
		arr = arr.concat(RFB.messages.keyEvent(Keys.XK_Control_L, 1));
		arr = arr.concat(RFB.messages.keyEvent(Keys.XK_Alt_L, 1));
		arr = arr.concat(RFB.messages.keyEvent(Keys.XK_Delete, 1));
		arr = arr.concat(RFB.messages.keyEvent(Keys.XK_Delete, 0));
		arr = arr.concat(RFB.messages.keyEvent(Keys.XK_Alt_L, 0));
		arr = arr.concat(RFB.messages.keyEvent(Keys.XK_Control_L, 0));
		this._sock.send(arr);
	},

	xvpOp: function (ver, op) {
		if (this._rfb_xvp_ver < ver) { return false; }
		debug('xvpOp() | sending XVP operation ' + op + ' (version ' + ver + ')');
		this._sock.send_string('\xFA\x00' + String.fromCharCode(ver) + String.fromCharCode(op));
		return true;
	},

	xvpShutdown: function () {
		return this.xvpOp(1, 2);
	},

	xvpReboot: function () {
		return this.xvpOp(1, 3);
	},

	xvpReset: function () {
		return this.xvpOp(1, 4);
	},

	// Send a key press. If 'down' is not specified then send a down key
	// followed by an up key.
	sendKey: function (code, down) {
		if (this._rfb_state !== 'normal' || this._view_only) { return false; }
		var arr = [];
		if (typeof down !== 'undefined') {
			debug('sendKey() | sending key code (' + (down ? 'down' : 'up') + '): ' + code);
			arr = arr.concat(RFB.messages.keyEvent(code, down ? 1 : 0));
		} else {
			debug('sendKey() | sending key code (down + up): ' + code);
			arr = arr.concat(RFB.messages.keyEvent(code, 1));
			arr = arr.concat(RFB.messages.keyEvent(code, 0));
		}
		this._sock.send(arr);
	},

	clipboardPasteFrom: function (text) {
		if (this._rfb_state !== 'normal') { return; }
		this._sock.send(RFB.messages.clientCutText(text));
	},

	setDesktopSize: function (width, height) {
		if (this._rfb_state !== 'normal') { return; }

		if (this._supportsSetDesktopSize) {

			var arr = [251];    // msg-type
			Util.push8(arr, 0);       // padding
			Util.push16(arr, width);  // width
			Util.push16(arr, height); // height

			Util.push8(arr, 1);       // number-of-screens
			Util.push8(arr, 0);       // padding

			// screen array
			Util.push32(arr, this._screen_id);    // id
			Util.push16(arr, 0);                  // x-position
			Util.push16(arr, 0);                  // y-position
			Util.push16(arr, width);              // width
			Util.push16(arr, height);             // height
			Util.push32(arr, this._screen_flags); // flags

			this._sock.send(arr);
		}
	},

	// Private methods
	_connect: function () {
		debug('_connect() | connecting to ' + this._rfb_url);
		this._sock.open(this._rfb_url, this._wsProtocols);
	},

	_init_vars: function () {
		// reset state
		this._sock.init();

		this._FBU.rects        = 0;
		this._FBU.subrects     = 0;  // RRE and HEXTILE
		this._FBU.lines        = 0;  // RAW
		this._FBU.tiles        = 0;  // HEXTILE
		this._FBU.zlibs        = []; // TIGHT zlib encoders
		this._mouse_buttonMask = 0;
		this._mouse_arr        = [];
		this._rfb_tightvnc     = false;

		// Clear the per connection encoding stats
		var i;
		for (i = 0; i < this._encodings.length; i++) {
			this._encStats[this._encodings[i][1]][0] = 0;
		}

		for (i = 0; i < 4; i++) {
			this._FBU.zlibs[i] = new TINF();
			this._FBU.zlibs[i].init();
		}
	},

	_print_stats: function () {
		debug('_print_stats() | encoding stats for this connection:');

		var i, s;
		for (i = 0; i < this._encodings.length; i++) {
			s = this._encStats[this._encodings[i][1]];
			if (s[0] + s[1] > 0) {
				debug('_print_stats() | ' + this._encodings[i][0] + ': ' + s[0] + ' rects');
			}
		}

		debug('_print_stats() | encoding stats since page load:');

		for (i = 0; i < this._encodings.length; i++) {
			s = this._encStats[this._encodings[i][1]];
			debug('_print_stats() | ' + this._encodings[i][0] + ': ' + s[1] + ' rects');
		}
	},

	_cleanupSocket: function (state) {
		if (this._sendTimer) {
			clearInterval(this._sendTimer);
			this._sendTimer = null;
		}
		if (this._msgTimer) {
			clearInterval(this._msgTimer);
			this._msgTimer = null;
		}
		if (this._display && this._display.get_context()) {
			this._keyboard.ungrab();
			this._mouse.ungrab();
			if (state !== 'connect' && state !== 'loaded') {
				this._display.defaultCursor();
			}
			this._display.clear();
		}

		this._sock.close();
	},


	/*
	 * Page states:
	 *   loaded       - page load, equivalent to disconnected
	 *   disconnected - idle state
	 *   connect      - starting to connect (to ProtocolVersion)
	 *   normal       - connected
	 *   disconnect   - starting to disconnect
	 *   failed       - abnormal disconnect
	 *   fatal        - failed to load page, or fatal error
	 *
	 * RFB protocol initialization states:
	 *   ProtocolVersion
	 *   Security
	 *   Authentication
	 *   password     - waiting for password, not part of RFB
	 *   SecurityResult
	 *   ClientInitialization - not triggered by server message
	 *   ServerInitialization (to normal)
	 */
	_updateState: function (state, statusMsg) {
		debug('_updateState() | [state:%s, msg:"%s"]', state, statusMsg);

		var oldstate = this._rfb_state;

		if (state === oldstate) {
			// Already here, ignore
			debug('_updateState() | already in state "' + state + '", ignoring');
			return;
		}

		/*
		 * These are disconnected states. A previous connect may
		 * asynchronously cause a connection so make sure we are closed.
		 */
		if (state in {'disconnected': 1, 'loaded': 1, 'connect': 1,
			'disconnect': 1, 'failed': 1, 'fatal': 1}) {
			this._cleanupSocket(state);
		}

		if (oldstate === 'fatal') {
			debugerror('_updateState() | fatal error, cannot continue');
		}

		if (statusMsg && (state === 'failed' || state === 'fatal')) {
			debugerror('_updateState() | %s: %s', state, statusMsg);
		}

		if (oldstate === 'failed' && state === 'disconnected') {
			// do disconnect action, but stay in failed state
			this._rfb_state = 'failed';
		} else {
			this._rfb_state = state;
		}

		if (this._disconnTimer && this._rfb_state !== 'disconnect') {
			debug('_updateState() | clearing disconnect timer');
			clearTimeout(this._disconnTimer);
			this._disconnTimer = null;
			this._sock.off('close');  // make sure we don't get a double event
		}

		switch (state) {
			case 'normal':
				if (oldstate === 'disconnected' || oldstate === 'failed') {
					debugerror('_updateState() | invalid transition from "disconnected" or "failed" to "normal"');
				}
				break;

			case 'connect':
				this._init_vars();
				this._connect();
				// WebSocket.onopen transitions to 'ProtocolVersion'
				break;

			case 'disconnect':
				this._disconnTimer = setTimeout(function () {
					this._fail('Disconnect timeout');
				}.bind(this), this._disconnectTimeout * 1000);

				this._print_stats();

				// WebSocket.onclose transitions to 'disconnected'
				break;

			case 'failed':
				if (oldstate === 'disconnected') {
					debugerror('_updateState() | invalid transition from "disconnected" to "failed"');
				} else if (oldstate === 'normal') {
					debugerror('_updateState() | error while connected');
				} else if (oldstate === 'init') {
					debugerror('_updateState() | error while initializing');
				}

				// Make sure we transition to disconnected
				setTimeout(function () {
					this._updateState('disconnected');
				}.bind(this), 50);

				break;

			default:
				// No state change action to take
		}

		if (oldstate === 'failed' && state === 'disconnected') {
			this._onUpdateState(this, state, oldstate);
		} else {
			this._onUpdateState(this, state, oldstate, statusMsg);
		}
	},

	_fail: function (msg) {
		this._updateState('failed', msg);
		return false;
	},

	_handle_message: function () {
		if (this._sock.rQlen() === 0) {
			debugerror('_handle_message() | called on an empty receive queue');
			return;
		}

		switch (this._rfb_state) {
			case 'disconnected':
			case 'failed':
				debugerror('_handle_message() | got data while disconnected');
				break;
			case 'normal':
				if (this._normal_msg() && this._sock.rQlen() > 0) {
					// true means we can continue processing
					// Give other events a chance to run
					if (this._msgTimer === null) {
						debug('_handle_message() | more data to process, creating timer');
						this._msgTimer = setTimeout(function () {
							this._msgTimer = null;
							this._handle_message();
						}.bind(this), 10);
					} else {
						debug('_handle_message() | more data to process, existing timer');
					}
				}
				break;
			default:
				this._init_msg();
				break;
		}
	},

	_checkEvents: function () {
		if (this._rfb_state === 'normal' && !this._viewportDragging && this._mouse_arr.length > 0) {
			this._sock.send(this._mouse_arr);
			this._mouse_arr = [];
		}
	},

	_handleKeyPress: function (keysym, down) {
		if (this._view_only) { return; } // View only, skip keyboard, events
		this._sock.send(RFB.messages.keyEvent(keysym, down));
	},

	_handleMouseButton: function (x, y, down, bmask) {
		if (down) {
			this._mouse_buttonMask |= bmask;
		} else {
			this._mouse_buttonMask ^= bmask;
		}

		if (this._viewportDrag) {
			if (down && !this._viewportDragging) {
				this._viewportDragging = true;
				this._viewportDragPos = {'x': x, 'y': y};

				// Skip sending mouse events
				return;
			} else {
				this._viewportDragging = false;
			}
		}

		if (this._view_only) { return; } // View only, skip mouse events

		this._mouse_arr = this._mouse_arr.concat(
				RFB.messages.pointerEvent(this._display.absX(x), this._display.absY(y), this._mouse_buttonMask));
		this._sock.send(this._mouse_arr);
		this._mouse_arr = [];
	},

	_handleMouseMove: function (x, y) {
		if (this._viewportDragging) {
			var deltaX = this._viewportDragPos.x - x;
			var deltaY = this._viewportDragPos.y - y;
			this._viewportDragPos = {'x': x, 'y': y};

			this._display.viewportChangePos(deltaX, deltaY);

			// Skip sending mouse events
			return;
		}

		if (this._view_only) { return; } // View only, skip mouse events

		this._mouse_arr = this._mouse_arr.concat(
				RFB.messages.pointerEvent(this._display.absX(x), this._display.absY(y), this._mouse_buttonMask));

		this._checkEvents();
	},

	// Message Handlers

	_negotiate_protocol_version: function () {
		if (this._sock.rQlen() < 12) {
			return this._fail('Incomplete protocol version');
		}

		var sversion = this._sock.rQshiftStr(12).substr(4, 7);
		debug('_negotiate_protocol_version() | server ProtocolVersion: ' + sversion);
		var is_repeater = 0;

		switch (sversion) {
			case '000.000':  // UltraVNC repeater
				is_repeater = 1;
				break;
			case '003.003':
			case '003.006':  // UltraVNC
			case '003.889':  // Apple Remote Desktop
				this._rfb_version = 3.3;
				break;
			case '003.007':
				this._rfb_version = 3.7;
				break;
			case '003.008':
			case '004.000':  // Intel AMT KVM
			case '004.001':  // RealVNC 4.6
				this._rfb_version = 3.8;
				break;
			default:
				return this._fail('Invalid server version ' + sversion);
		}

		if (is_repeater) {
			var repeaterID = this._repeaterID;
			while (repeaterID.length < 250) {
				repeaterID += '\0';
			}
			this._sock.send_string(repeaterID);
			return true;
		}

		if (this._rfb_version > this._rfb_max_version) {
			this._rfb_version = this._rfb_max_version;
		}

		// Send updates either at a rate of 1 update per 50ms, or
		// whatever slower rate the network can handle
		this._sendTimer = setInterval(this._sock.flush.bind(this._sock), 50);

		var cversion = '00' + parseInt(this._rfb_version, 10) +
						 '.00' + ((this._rfb_version * 10) % 10);
		this._sock.send_string('RFB ' + cversion + '\n');
		this._updateState('Security', 'Sent ProtocolVersion: ' + cversion);
	},

	_negotiate_security: function () {
		if (this._rfb_version >= 3.7) {
			// Server sends supported list, client decides
			var num_types = this._sock.rQshift8();
			if (this._sock.rQwait('security type', num_types, 1)) { return false; }

			if (num_types === 0) {
				var strlen = this._sock.rQshift32();
				var reason = this._sock.rQshiftStr(strlen);
				return this._fail('Security failure: ' + reason);
			}

			this._rfb_auth_scheme = 0;
			var types = this._sock.rQshiftBytes(num_types);
			debug('_negotiate_security() | server security types: ' + types);

			if (! this._forceAuthScheme) {
				for (var i = 0; i < types.length; i++) {
					if (types[i] > this._rfb_auth_scheme && (types[i] <= 16 || types[i] === 22)) {
						this._rfb_auth_scheme = types[i];
					}
				}
			}
			else {
				this._rfb_auth_scheme = this._forceAuthScheme;
			}

			if (this._rfb_auth_scheme === 0) {
				return this._fail('Unsupported security types: ' + types);
			}

			this._sock.send([this._rfb_auth_scheme]);
		} else {
			// Server decides
			if (this._sock.rQwait('security scheme', 4)) { return false; }
			this._rfb_auth_scheme = this._sock.rQshift32();
		}

		this._updateState('Authentication', 'Authenticating using scheme: ' + this._rfb_auth_scheme);
		return this._init_msg(); // jump to authentication
	},

	// authentication
	_negotiate_xvp_auth: function () {
		var xvp_sep = this._xvp_password_sep;
		var xvp_auth = this._rfb_password.split(xvp_sep);
		if (xvp_auth.length < 3) {
			this._updateState('password', 'XVP credentials required (user' + xvp_sep +
								'target' + xvp_sep + 'password) -- got only ' + this._rfb_password);
			this._onPasswordRequired(this);
			return false;
		}

		var xvp_auth_str = String.fromCharCode(xvp_auth[0].length) +
							 String.fromCharCode(xvp_auth[1].length) +
							 xvp_auth[0] +
							 xvp_auth[1];
		this._sock.send_string(xvp_auth_str);
		this._rfb_password = xvp_auth.slice(2).join(xvp_sep);
		this._rfb_auth_scheme = 2;
		return this._negotiate_authentication();
	},

	_negotiate_std_vnc_auth: function () {
		if (this._rfb_password.length === 0) {
			// Notify via both callbacks since it's kind of
			// an RFB state change and a UI interface issue
			this._updateState('password', 'Password Required');
			this._onPasswordRequired(this);
		}

		if (this._sock.rQwait('auth challenge', 16)) { return false; }

		var challenge = this._sock.rQshiftBytes(16);
		var response = RFB.genDES(this._rfb_password, challenge);
		this._sock.send(response);
		this._updateState('SecurityResult');
		return true;
	},

	_negotiate_tight_tunnels: function (numTunnels) {
		var clientSupportedTunnelTypes = {
			0: { vendor: 'TGHT', signature: 'NOTUNNEL' }
		};
		var serverSupportedTunnelTypes = {};
		// receive tunnel capabilities
		for (var i = 0; i < numTunnels; i++) {
			var cap_code = this._sock.rQshift32();
			var cap_vendor = this._sock.rQshiftStr(4);
			var cap_signature = this._sock.rQshiftStr(8);
			serverSupportedTunnelTypes[cap_code] = { vendor: cap_vendor, signature: cap_signature };
		}

		// choose the notunnel type
		if (serverSupportedTunnelTypes[0]) {
			if (serverSupportedTunnelTypes[0].vendor !== clientSupportedTunnelTypes[0].vendor ||
				serverSupportedTunnelTypes[0].signature !== clientSupportedTunnelTypes[0].signature) {
				return this._fail('Client\'s tunnel type had the incorrect vendor or signature');
			}
			this._sock.send([0, 0, 0, 0]);  // use NOTUNNEL
			return false; // wait until we receive the sub auth count to continue
		} else {
			return this._fail('Server wanted tunnels, but doesn\'t support the notunnel type');
		}
	},

	_negotiate_tight_auth: function () {
		if (!this._rfb_tightvnc) {  // first pass, do the tunnel negotiation
			if (this._sock.rQwait('num tunnels', 4)) { return false; }
			var numTunnels = this._sock.rQshift32();
			if (numTunnels > 0 && this._sock.rQwait('tunnel capabilities', 16 * numTunnels, 4)) { return false; }

			this._rfb_tightvnc = true;

			if (numTunnels > 0) {
				this._negotiate_tight_tunnels(numTunnels);
				return false;  // wait until we receive the sub auth to continue
			}
		}

		// second pass, do the sub-auth negotiation
		if (this._sock.rQwait('sub auth count', 4)) { return false; }
		var subAuthCount = this._sock.rQshift32();
		if (this._sock.rQwait('sub auth capabilities', 16 * subAuthCount, 4)) { return false; }

		var clientSupportedTypes = {
			'STDVNOAUTH__': 1,
			'STDVVNCAUTH_': 2
		};

		var serverSupportedTypes = [];

		for (var i = 0; i < subAuthCount; i++) {
			var capabilities = this._sock.rQshiftStr(12);
			serverSupportedTypes.push(capabilities);
		}

		debug('_negotiate_tight_auth() | clientSupportedTypes: %o', clientSupportedTypes);
		debug('_negotiate_tight_auth() | serverSupportedTypes: %o', serverSupportedTypes);

		for (var authType in clientSupportedTypes) {
			if (serverSupportedTypes.indexOf(authType) !== -1) {
				this._sock.send([0, 0, 0, clientSupportedTypes[authType]]);

				switch (authType) {
					case 'STDVNOAUTH__':  // no auth
						this._updateState('SecurityResult');
						return true;
					case 'STDVVNCAUTH_': // VNC auth
						this._rfb_auth_scheme = 2;
						return this._init_msg();
					default:
						return this._fail('Unsupported tiny auth scheme: ' + authType);
				}
			}
		}

		this._fail('No supported sub-auth types!');
	},

	_negotiate_authentication: function () {
		switch (this._rfb_auth_scheme) {
			case 0:  // connection failed
				if (this._sock.rQwait('auth reason', 4)) { return false; }
				var strlen = this._sock.rQshift32();
				var reason = this._sock.rQshiftStr(strlen);
				return this._fail('Auth failure: ' + reason);

			case 1:  // no auth
				if (this._rfb_version >= 3.8) {
					this._updateState('SecurityResult');
					return true;
				}
				this._updateState('ClientInitialisation', 'No auth required');
				return this._init_msg();

			case 22:  // XVP auth
				return this._negotiate_xvp_auth();

			case 2:  // VNC authentication
				return this._negotiate_std_vnc_auth();

			case 16:  // TightVNC Security Type
				return this._negotiate_tight_auth();

			default:
				return this._fail('Unsupported auth scheme: ' + this._rfb_auth_scheme);
		}
	},

	_handle_security_result: function () {
		if (this._sock.rQwait('VNC auth response ', 4)) { return false; }
		switch (this._sock.rQshift32()) {
			case 0:  // OK
				this._updateState('ClientInitialisation', 'Authentication OK');
				return this._init_msg();
			case 1:  // failed
				if (this._rfb_version >= 3.8) {
					var length = this._sock.rQshift32();
					if (this._sock.rQwait('SecurityResult reason', length, 8)) { return false; }
					var reason = this._sock.rQshiftStr(length);
					return this._fail(reason);
				} else {
					return this._fail('Authentication failure');
				}
				return false;
			case 2:
				return this._fail('Too many auth attempts');
		}
	},

	_negotiate_server_init: function () {
		if (this._sock.rQwait('server initialization', 24)) { return false; }

		/* Screen size */
		this._fb_width  = this._sock.rQshift16();
		this._fb_height = this._sock.rQshift16();

		/* PIXEL_FORMAT */
		var bpp         = this._sock.rQshift8();
		var depth       = this._sock.rQshift8();
		var big_endian  = this._sock.rQshift8();
		var true_color  = this._sock.rQshift8();

		var red_max     = this._sock.rQshift16();
		var green_max   = this._sock.rQshift16();
		var blue_max    = this._sock.rQshift16();
		var red_shift   = this._sock.rQshift8();
		var green_shift = this._sock.rQshift8();
		var blue_shift  = this._sock.rQshift8();
		this._sock.rQskipBytes(3);  // padding

		// NB(directxman12): we don't want to call any callbacks or print messages until
		//                   *after* we're past the point where we could backtrack

		/* Connection name/title */
		var name_length = this._sock.rQshift32();
		if (this._sock.rQwait('server init name', name_length, 24)) { return false; }
		this._fb_name = Util.decodeUTF8(this._sock.rQshiftStr(name_length));

		if (this._rfb_tightvnc) {
			if (this._sock.rQwait('TightVNC extended server init header', 8, 24 + name_length)) { return false; }
			// In TightVNC mode, ServerInit message is extended
			var numServerMessages = this._sock.rQshift16();
			var numClientMessages = this._sock.rQshift16();
			var numEncodings = this._sock.rQshift16();
			this._sock.rQskipBytes(2);  // padding

			var totalMessagesLength = (numServerMessages + numClientMessages + numEncodings) * 16;
			if (this._sock.rQwait('TightVNC extended server init header', totalMessagesLength, 32 + name_length)) {
				return false;
			}

			var i;
			for (i = 0; i < numServerMessages; i++) {
				// TODO: https://github.com/kanaka/noVNC/issues/440
				this._sock.rQshiftStr(16);
			}

			for (i = 0; i < numClientMessages; i++) {
				this._sock.rQshiftStr(16);
			}

			for (i = 0; i < numEncodings; i++) {
				this._sock.rQshiftStr(16);
			}
		}

		// NB(directxman12): these are down here so that we don't run them multiple times
		//                   if we backtrack
		debug('_negotiate_server_init() | screen: ' + this._fb_width + 'x' + this._fb_height +
					', bpp: ' + bpp + ', depth: ' + depth +
					', big_endian: ' + big_endian +
					', true_color: ' + true_color +
					', red_max: ' + red_max +
					', green_max: ' + green_max +
					', blue_max: ' + blue_max +
					', red_shift: ' + red_shift +
					', green_shift: ' + green_shift +
					', blue_shift: ' + blue_shift);

		if (big_endian !== 0) {
			debugerror('_negotiate_server_init() | server native endian is not little endian');
		}

		if (red_shift !== 16) {
			debugerror('_negotiate_server_init() | server native red-shift is not 16');
		}

		if (blue_shift !== 0) {
			debugerror('_negotiate_server_init() | server native blue-shift is not 0');
		}

		// we're past the point where we could backtrack, so it's safe to call this
		this._onDesktopName(this, this._fb_name);

		if (this._true_color && this._fb_name === 'Intel(r) AMT KVM') {
			debugerror('_negotiate_server_init() | Intel AMT KVM only supports 8/16 bit depths, disabling true color');
			this._true_color = false;
		}

		this._display.set_true_color(this._true_color);
		this._display.resize(this._fb_width, this._fb_height);
		this._onFBResize(this, this._fb_width, this._fb_height);
		this._keyboard.grab();
		this._mouse.grab();

		if (this._true_color) {
			this._fb_Bpp = 4;
			this._fb_depth = 3;
		} else {
			this._fb_Bpp = 1;
			this._fb_depth = 1;
		}

		var response = RFB.messages.pixelFormat(this._fb_Bpp, this._fb_depth, this._true_color);
		response = response.concat(
						RFB.messages.clientEncodings(this._encodings, this._local_cursor, this._true_color));
		response = response.concat(
						RFB.messages.fbUpdateRequests(this._display.getCleanDirtyReset(),
														this._fb_width, this._fb_height));

		this._timing.fbu_rt_start = (new Date()).getTime();
		this._timing.pixels = 0;
		this._sock.send(response);

		this._checkEvents();

		this._updateState('normal', 'Connected to: ' + this._fb_name);
	},

	_init_msg: function () {
		switch (this._rfb_state) {
			case 'ProtocolVersion':
				return this._negotiate_protocol_version();

			case 'Security':
				return this._negotiate_security();

			case 'Authentication':
				return this._negotiate_authentication();

			case 'SecurityResult':
				return this._handle_security_result();

			case 'ClientInitialisation':
				this._sock.send([this._shared ? 1 : 0]); // ClientInitialisation
				this._updateState('ServerInitialisation', 'Authentication OK');
				return true;

			case 'ServerInitialisation':
				return this._negotiate_server_init();
		}
	},

	_handle_set_colour_map_msg: function () {
		debug('_handle_set_colour_map_msg()');

		this._sock.rQskip8();  // Padding

		var first_colour = this._sock.rQshift16();
		var num_colours = this._sock.rQshift16();
		if (this._sock.rQwait('SetColorMapEntries', num_colours * 6, 6)) { return false; }

		for (var c = 0; c < num_colours; c++) {
			var red = parseInt(this._sock.rQshift16() / 256, 10);
			var green = parseInt(this._sock.rQshift16() / 256, 10);
			var blue = parseInt(this._sock.rQshift16() / 256, 10);
			this._display.set_colourMap([blue, green, red], first_colour + c);
		}
		debug('_handle_set_colour_map_msg() | colourMap: ' + this._display.get_colourMap());
		debug('_handle_set_colour_map_msg() | registered ' + num_colours + ' colourMap entries');

		return true;
	},

	_handle_server_cut_text: function () {
		debug('_handle_server_cut_text()');

		if (this._sock.rQwait('ServerCutText header', 7, 1)) { return false; }
		this._sock.rQskipBytes(3);  // Padding
		var length = this._sock.rQshift32();
		if (this._sock.rQwait('ServerCutText', length, 8)) { return false; }

		var text = this._sock.rQshiftStr(length);
		this._onClipboard(this, text);

		return true;
	},

	_handle_xvp_msg: function () {
		if (this._sock.rQwait('XVP version and message', 3, 1)) { return false; }
		this._sock.rQskip8();  // Padding
		var xvp_ver = this._sock.rQshift8();
		var xvp_msg = this._sock.rQshift8();

		switch (xvp_msg) {
			case 0:  // XVP_FAIL
				this._updateState(this._rfb_state, 'Operation Failed');
				break;
			case 1:  // XVP_INIT
				this._rfb_xvp_ver = xvp_ver;
				debug('_handle_xvp_msg() | XVP extensions enabled (version ' + this._rfb_xvp_ver + ')');
				this._onXvpInit(this._rfb_xvp_ver);
				break;
			default:
				this._fail('Disconnected: illegal server XVP message ' + xvp_msg);
				break;
		}

		return true;
	},

	_normal_msg: function () {
		var msg_type;

		if (this._FBU.rects > 0) {
			msg_type = 0;
		} else {
			msg_type = this._sock.rQshift8();
		}

		switch (msg_type) {
			case 0:  // FramebufferUpdate
				var ret = this._framebufferUpdate();
				if (ret) {
					this._sock.send(RFB.messages.fbUpdateRequests(
						this._display.getCleanDirtyReset(),
						this._fb_width,
						this._fb_height
					));
				}
				return ret;

			case 1:  // SetColorMapEntries
				return this._handle_set_colour_map_msg();

			case 2:  // Bell
				debug('_normal_msg() | bell');
				this._onBell(this);
				return true;

			case 3:  // ServerCutText
				return this._handle_server_cut_text();

			case 250:  // XVP
				return this._handle_xvp_msg();

			default:
				// If onUnknownMessageType is not set then just fail.
				if (! this._onUnknownMessageType) {
					this._fail('Disconnected: illegal server message type ' + msg_type);
					debugerror('_normal_msg() | sock.rQslice(0, 30): ' + this._sock.rQslice(0, 30));
					return true;
				}
				// If onUnknownMessageType is set then call it. If the app does not accept
				// the unknown message type it must throw an error.
				// The listener must return false if more bytes are needed,
				// true otherwise.
				else {
					debug('_normal_msg() | passing unknown message type ' + msg_type + ' to the onUnknownMessageType listener');
					try {
						return this._onUnknownMessageType(msg_type, this._sock);
					}
					catch(error) {
						debugerror('_normal_msg() | error catched during onUnknownMessageType: %o', error);
						this._fail('Disconnected: invalid custom server message type ' + msg_type);
						debugerror('_normal_msg() | sock.rQslice(0, 30): ' + this._sock.rQslice(0, 30));
						return true;
					}
				}
		}
	},

	_framebufferUpdate: function () {
		var ret = true;
		var now;

		if (this._FBU.rects === 0) {
			if (this._sock.rQwait('FBU header', 3, 1)) { return false; }
			this._sock.rQskip8();  // Padding
			this._FBU.rects = this._sock.rQshift16();
			this._FBU.bytes = 0;
			this._timing.cur_fbu = 0;
			if (this._timing.fbu_rt_start > 0) {
				now = (new Date()).getTime();
				debug('_framebufferUpdate() | first FBU latency: ' + (now - this._timing.fbu_rt_start));
			}
		}

		while (this._FBU.rects > 0) {
			if (this._rfb_state !== 'normal') { return false; }

			if (this._sock.rQwait('FBU', this._FBU.bytes)) { return false; }
			if (this._FBU.bytes === 0) {
				if (this._sock.rQwait('rect header', 12)) { return false; }
				/* New FramebufferUpdate */

				var hdr = this._sock.rQshiftBytes(12);
				this._FBU.x        = (hdr[0] << 8) + hdr[1];
				this._FBU.y        = (hdr[2] << 8) + hdr[3];
				this._FBU.width    = (hdr[4] << 8) + hdr[5];
				this._FBU.height   = (hdr[6] << 8) + hdr[7];
				this._FBU.encoding = parseInt((hdr[8] << 24) + (hdr[9] << 16) +
												(hdr[10] << 8) + hdr[11], 10);

				this._onFBUReceive(this,
					{'x': this._FBU.x, 'y': this._FBU.y,
					 'width': this._FBU.width, 'height': this._FBU.height,
					 'encoding': this._FBU.encoding,
					 'encodingName': this._encNames[this._FBU.encoding]});

				if (!this._encNames[this._FBU.encoding]) {
					this._fail('Disconnected: unsupported encoding ' +
								 this._FBU.encoding);
					return false;
				}
			}

			this._timing.last_fbu = (new Date()).getTime();

			ret = this._encHandlers[this._FBU.encoding]();

			now = (new Date()).getTime();
			this._timing.cur_fbu += (now - this._timing.last_fbu);

			if (ret) {
				this._encStats[this._FBU.encoding][0]++;
				this._encStats[this._FBU.encoding][1]++;
				this._timing.pixels += this._FBU.width * this._FBU.height;
			}

			if (this._timing.pixels >= (this._fb_width * this._fb_height)) {
				if ((this._FBU.width === this._fb_width && this._FBU.height === this._fb_height) ||
					this._timing.fbu_rt_start > 0) {
					this._timing.full_fbu_total += this._timing.cur_fbu;
					this._timing.full_fbu_cnt++;
					debug('_framebufferUpdate() | timing of full FBU, curr: ' +
								this._timing.cur_fbu + ', total: ' +
								this._timing.full_fbu_total + ', cnt: ' +
								this._timing.full_fbu_cnt + ', avg: ' +
								(this._timing.full_fbu_total / this._timing.full_fbu_cnt));
				}

				if (this._timing.fbu_rt_start > 0) {
					var fbu_rt_diff = now - this._timing.fbu_rt_start;
					this._timing.fbu_rt_total += fbu_rt_diff;
					this._timing.fbu_rt_cnt++;
					debug('_framebufferUpdate() | full FBU round-trip, cur: ' +
						 fbu_rt_diff + ', total: ' +
						 this._timing.fbu_rt_total + ', cnt: ' +
						 this._timing.fbu_rt_cnt + ', avg: ' +
						 (this._timing.fbu_rt_total / this._timing.fbu_rt_cnt));
					this._timing.fbu_rt_start = 0;
				}
			}

			if (!ret) { return ret; }  // need more data
		}

		this._onFBUComplete(this,
				{'x': this._FBU.x, 'y': this._FBU.y,
				 'width': this._FBU.width, 'height': this._FBU.height,
				 'encoding': this._FBU.encoding,
				 'encodingName': this._encNames[this._FBU.encoding]});

		return true;  // We finished this FBU
	},
};


Util.make_properties(RFB, [
	['target', 'wo', 'dom'],                // VNC display rendering Canvas object
	['focusContainer', 'wo', 'dom'],        // DOM element that captures keyboard input
	['encrypt', 'rw', 'bool'],              // Use TLS/SSL/wss encryption
	['true_color', 'rw', 'bool'],           // Request true color pixel data
	['local_cursor', 'rw', 'bool'],         // Request locally rendered cursor
	['shared', 'rw', 'bool'],               // Request shared mode
	['view_only', 'rw', 'bool'],            // Disable client mouse/keyboard
	['xvp_password_sep', 'rw', 'str'],      // Separator for XVP password fields
	['disconnectTimeout', 'rw', 'int'],     // Time (s) to wait for disconnection
	['wsProtocols', 'rw', 'arr'],           // Protocols to use in the WebSocket connection
	['repeaterID', 'rw', 'str'],            // [UltraVNC] RepeaterID to connect to
	['viewportDrag', 'rw', 'bool'],         // Move the viewport on mouse drags
	['forceAuthScheme', 'rw', 'int'],       // Force auth scheme (0 means no)
	['enableMouseAndTouch', 'rw', 'bool'],  // Whether also enable mouse events when touch screen is detected

	// Callback functions
	['onUpdateState', 'rw', 'func'],        // onUpdateState(rfb, state, oldstate, statusMsg): RFB state update/change
	['onPasswordRequired', 'rw', 'func'],   // onPasswordRequired(rfb): VNC password is required
	['onClipboard', 'rw', 'func'],          // onClipboard(rfb, text): RFB clipboard contents received
	['onBell', 'rw', 'func'],               // onBell(rfb): RFB Bell message received
	['onFBUReceive', 'rw', 'func'],         // onFBUReceive(rfb, fbu): RFB FBU received but not yet processed
	['onFBUComplete', 'rw', 'func'],        // onFBUComplete(rfb, fbu): RFB FBU received and processed
	['onFBResize', 'rw', 'func'],           // onFBResize(rfb, width, height): frame buffer resized
	['onDesktopName', 'rw', 'func'],        // onDesktopName(rfb, name): desktop name received
	['onXvpInit', 'rw', 'func'],            // onXvpInit(version): XVP extensions active for this connection
	['onUnknownMessageType', 'rw', 'func']  // Handler for unknown VNC message types. If
											                    // null failure is emitted and the RFB closed.
]);


RFB.prototype.set_local_cursor = function (cursor) {
	if (!cursor || (cursor in {'0': 1, 'no': 1, 'false': 1})) {
		this._local_cursor = false;
		this._display.disableLocalCursor(); // Only show server-side cursor
	} else {
		if (this._display.get_cursor_uri()) {
			this._local_cursor = true;
		} else {
			debug('browser does not support local cursor');
			this._display.disableLocalCursor();
		}
	}
};

RFB.prototype.get_display = function () { return this._display; };
RFB.prototype.get_keyboard = function () { return this._keyboard; };
RFB.prototype.get_mouse = function () { return this._mouse; };


// Class Methods
RFB.messages = {
	keyEvent: function (keysym, down) {
		var arr = [4];
		Util.push8(arr, down);
		Util.push16(arr, 0);
		Util.push32(arr, keysym);
		return arr;
	},

	pointerEvent: function (x, y, mask) {
		var arr = [5];  // msg-type
		Util.push8(arr, mask);
		Util.push16(arr, x);
		Util.push16(arr, y);
		return arr;
	},

	// TODO(directxman12): make this unicode compatible?
	clientCutText: function (text) {
		var arr = [6];  // msg-type
		Util.push8(arr, 0);   // padding
		Util.push8(arr, 0);   // padding
		Util.push8(arr, 0);   // padding
		Util.push32(arr, text.length);
		var n = text.length;
		for (var i = 0; i < n; i++) {
			arr.push(text.charCodeAt(i));
		}

		return arr;
	},

	pixelFormat: function (bpp, depth, true_color) {
		var arr = [0]; // msg-type
		Util.push8(arr, 0);  // padding
		Util.push8(arr, 0);  // padding
		Util.push8(arr, 0);  // padding

		Util.push8(arr, bpp * 8); // bits-per-pixel
		Util.push8(arr, depth * 8); // depth
		Util.push8(arr, 0);  // little-endian
		Util.push8(arr, true_color ? 1 : 0);  // true-color

		Util.push16(arr, 255);  // red-max
		Util.push16(arr, 255);  // green-max
		Util.push16(arr, 255);  // blue-max
		Util.push8(arr, 16);    // red-shift
		Util.push8(arr, 8);     // green-shift
		Util.push8(arr, 0);     // blue-shift

		Util.push8(arr, 0);     // padding
		Util.push8(arr, 0);     // padding
		Util.push8(arr, 0);     // padding
		return arr;
	},

	clientEncodings: function (encodings, local_cursor, true_color) {
		var i, encList = [];

		for (i = 0; i < encodings.length; i++) {
			if (encodings[i][0] === 'Cursor' && !local_cursor) {
				debug('clientEncodings() | skipping Cursor pseudo-encoding');
			} else if (encodings[i][0] === 'TIGHT' && !true_color) {
				// TODO: remove this when we have tight+non-true-color
				debug('clientEncodings() | skipping tight as it is only supported with true color');
			} else {
				encList.push(encodings[i][1]);
			}
		}

		var arr = [2];  // msg-type
		Util.push8(arr, 0);   // padding

		Util.push16(arr, encList.length);  // encoding count
		for (i = 0; i < encList.length; i++) {
			Util.push32(arr, encList[i]);
		}

		return arr;
	},

	fbUpdateRequests: function (cleanDirty, fb_width, fb_height) {
		var arr = [];

		var cb = cleanDirty.cleanBox;
		var w, h;
		if (cb.w > 0 && cb.h > 0) {
			w = typeof cb.w === 'undefined' ? fb_width : cb.w;
			h = typeof cb.h === 'undefined' ? fb_height : cb.h;
			// Request incremental for clean box
			arr = arr.concat(RFB.messages.fbUpdateRequest(1, cb.x, cb.y, w, h));
		}

		for (var i = 0; i < cleanDirty.dirtyBoxes.length; i++) {
			var db = cleanDirty.dirtyBoxes[i];
			// Force all (non-incremental) for dirty box
			w = typeof db.w === 'undefined' ? fb_width : db.w;
			h = typeof db.h === 'undefined' ? fb_height : db.h;
			arr = arr.concat(RFB.messages.fbUpdateRequest(0, db.x, db.y, w, h));
		}

		return arr;
	},

	fbUpdateRequest: function (incremental, x, y, w, h) {
		if (typeof(x) === 'undefined') { x = 0; }
		if (typeof(y) === 'undefined') { y = 0; }

		var arr = [3];  // msg-type
		Util.push8(arr, incremental);
		Util.push16(arr, x);
		Util.push16(arr, y);
		Util.push16(arr, w);
		Util.push16(arr, h);

		return arr;
	}
};

RFB.genDES = function (password, challenge) {
	var passwd = [];
	for (var i = 0; i < password.length; i++) {
		passwd.push(password.charCodeAt(i));
	}
	return (new DES(passwd)).encrypt(challenge);
};

RFB.encodingHandlers = {
	RAW: function () {
		if (this._FBU.lines === 0) {
			this._FBU.lines = this._FBU.height;
		}

		this._FBU.bytes = this._FBU.width * this._fb_Bpp;  // at least a line
		if (this._sock.rQwait('RAW', this._FBU.bytes)) { return false; }
		var cur_y = this._FBU.y + (this._FBU.height - this._FBU.lines);
		var curr_height = Math.min(this._FBU.lines,
									 Math.floor(this._sock.rQlen() / (this._FBU.width * this._fb_Bpp)));
		this._display.blitImage(this._FBU.x, cur_y, this._FBU.width,
								curr_height, this._sock.get_rQ(),
								this._sock.get_rQi());
		this._sock.rQskipBytes(this._FBU.width * curr_height * this._fb_Bpp);
		this._FBU.lines -= curr_height;

		if (this._FBU.lines > 0) {
			this._FBU.bytes = this._FBU.width * this._fb_Bpp;  // At least another line
		} else {
			this._FBU.rects--;
			this._FBU.bytes = 0;
		}

		return true;
	},

	COPYRECT: function () {
		this._FBU.bytes = 4;
		if (this._sock.rQwait('COPYRECT', 4)) { return false; }
		this._display.renderQ_push({
			'type': 'copy',
			'old_x': this._sock.rQshift16(),
			'old_y': this._sock.rQshift16(),
			'x': this._FBU.x,
			'y': this._FBU.y,
			'width': this._FBU.width,
			'height': this._FBU.height
		});
		this._FBU.rects--;
		this._FBU.bytes = 0;
		return true;
	},

	RRE: function () {
		var color;
		if (this._FBU.subrects === 0) {
			this._FBU.bytes = 4 + this._fb_Bpp;
			if (this._sock.rQwait('RRE', 4 + this._fb_Bpp)) { return false; }
			this._FBU.subrects = this._sock.rQshift32();
			color = this._sock.rQshiftBytes(this._fb_Bpp);  // Background
			this._display.fillRect(this._FBU.x, this._FBU.y, this._FBU.width, this._FBU.height, color);
		}

		while (this._FBU.subrects > 0 && this._sock.rQlen() >= (this._fb_Bpp + 8)) {
			color = this._sock.rQshiftBytes(this._fb_Bpp);
			var x = this._sock.rQshift16();
			var y = this._sock.rQshift16();
			var width = this._sock.rQshift16();
			var height = this._sock.rQshift16();
			this._display.fillRect(this._FBU.x + x, this._FBU.y + y, width, height, color);
			this._FBU.subrects--;
		}

		if (this._FBU.subrects > 0) {
			var chunk = Math.min(this._rre_chunk_sz, this._FBU.subrects);
			this._FBU.bytes = (this._fb_Bpp + 8) * chunk;
		} else {
			this._FBU.rects--;
			this._FBU.bytes = 0;
		}

		return true;
	},

	HEXTILE: function () {
		var rQ = this._sock.get_rQ();
		var rQi = this._sock.get_rQi();

		if (this._FBU.tiles === 0) {
			this._FBU.tiles_x = Math.ceil(this._FBU.width / 16);
			this._FBU.tiles_y = Math.ceil(this._FBU.height / 16);
			this._FBU.total_tiles = this._FBU.tiles_x * this._FBU.tiles_y;
			this._FBU.tiles = this._FBU.total_tiles;
		}

		while (this._FBU.tiles > 0) {
			this._FBU.bytes = 1;
			if (this._sock.rQwait('HEXTILE subencoding', this._FBU.bytes)) { return false; }
			var subencoding = rQ[rQi];  // Peek
			if (subencoding > 30) {  // Raw
				this._fail('Disconnected: illegal hextile subencoding ' + subencoding);
				return false;
			}

			var subrects = 0;
			var curr_tile = this._FBU.total_tiles - this._FBU.tiles;
			var tile_x = curr_tile % this._FBU.tiles_x;
			var tile_y = Math.floor(curr_tile / this._FBU.tiles_x);
			var x = this._FBU.x + tile_x * 16;
			var y = this._FBU.y + tile_y * 16;
			var w = Math.min(16, (this._FBU.x + this._FBU.width) - x);
			var h = Math.min(16, (this._FBU.y + this._FBU.height) - y);

			// Figure out how much we are expecting
			if (subencoding & 0x01) {  // Raw
				this._FBU.bytes += w * h * this._fb_Bpp;
			} else {
				if (subencoding & 0x02) {  // Background
					this._FBU.bytes += this._fb_Bpp;
				}
				if (subencoding & 0x04) {  // Foreground
					this._FBU.bytes += this._fb_Bpp;
				}
				if (subencoding & 0x08) {  // AnySubrects
					this._FBU.bytes++;  // Since we aren't shifting it off
					if (this._sock.rQwait('hextile subrects header', this._FBU.bytes)) { return false; }
					subrects = rQ[rQi + this._FBU.bytes - 1];  // Peek
					if (subencoding & 0x10) {  // SubrectsColoured
						this._FBU.bytes += subrects * (this._fb_Bpp + 2);
					} else {
						this._FBU.bytes += subrects * 2;
					}
				}
			}

			if (this._sock.rQwait('hextile', this._FBU.bytes)) { return false; }

			// We know the encoding and have a whole tile
			this._FBU.subencoding = rQ[rQi];
			rQi++;
			if (this._FBU.subencoding === 0) {
				if (this._FBU.lastsubencoding & 0x01) {
					// Weird: ignore blanks are RAW
					debug('HEXTILE() | ignoring blank after RAW');
				} else {
					this._display.fillRect(x, y, w, h, this._FBU.background);
				}
			} else if (this._FBU.subencoding & 0x01) {  // Raw
				this._display.blitImage(x, y, w, h, rQ, rQi);
				rQi += this._FBU.bytes - 1;
			} else {
				if (this._FBU.subencoding & 0x02) {  // Background
					this._FBU.background = rQ.slice(rQi, rQi + this._fb_Bpp);
					rQi += this._fb_Bpp;
				}
				if (this._FBU.subencoding & 0x04) {  // Foreground
					this._FBU.foreground = rQ.slice(rQi, rQi + this._fb_Bpp);
					rQi += this._fb_Bpp;
				}

				this._display.startTile(x, y, w, h, this._FBU.background);
				if (this._FBU.subencoding & 0x08) {  // AnySubrects
					subrects = rQ[rQi];
					rQi++;

					for (var s = 0; s < subrects; s++) {
						var color;
						if (this._FBU.subencoding & 0x10) {  // SubrectsColoured
							color = rQ.slice(rQi, rQi + this._fb_Bpp);
							rQi += this._fb_Bpp;
						} else {
							color = this._FBU.foreground;
						}
						var xy = rQ[rQi];
						rQi++;
						var sx = (xy >> 4);
						var sy = (xy & 0x0f);

						var wh = rQ[rQi];
						rQi++;
						var sw = (wh >> 4) + 1;
						var sh = (wh & 0x0f) + 1;

						this._display.subTile(sx, sy, sw, sh, color);
					}
				}
				this._display.finishTile();
			}
			this._sock.set_rQi(rQi);
			this._FBU.lastsubencoding = this._FBU.subencoding;
			this._FBU.bytes = 0;
			this._FBU.tiles--;
		}

		if (this._FBU.tiles === 0) {
			this._FBU.rects--;
		}

		return true;
	},

	getTightCLength: function (arr) {
		var header = 1, data = 0;
		data += arr[0] & 0x7f;
		if (arr[0] & 0x80) {
			header++;
			data += (arr[1] & 0x7f) << 7;
			if (arr[1] & 0x80) {
				header++;
				data += arr[2] << 14;
			}
		}
		return [header, data];
	},

	display_tight: function (isTightPNG) {
		if (this._fb_depth === 1) {
			this._fail('Tight protocol handler only implements true color mode');
		}

		this._FBU.bytes = 1;  // compression-control byte
		if (this._sock.rQwait('TIGHT compression-control', this._FBU.bytes)) { return false; }

		// var checksum = function (data) {
		// 	var sum = 0;
		// 	for (var i = 0; i < data.length; i++) {
		// 		sum += data[i];
		// 		if (sum > 65536) { sum -= 65536; }
		// 	}
		// 	return sum;
		// };

		var resetStreams = 0;
		var streamId = -1;
		var decompress = function (data) {
			for (var i = 0; i < 4; i++) {
				if ((resetStreams >> i) & 1) {
					this._FBU.zlibs[i].reset();
					debug('display_tight() | reset zlib stream ' + i);
				}
			}

			var uncompressed = this._FBU.zlibs[streamId].uncompress(data, 0);
			if (uncompressed.status !== 0) {
				debugerror('display_tight() | invalid data in zlib stream');
			}

			return uncompressed.data;
		}.bind(this);

		var indexedToRGB = function (data, numColors, palette, width, height) {
			// Convert indexed (palette based) image data to RGB
			// TODO: reduce number of calculations inside loop
			var dest = [];
			var x, y, dp, sp;
			if (numColors === 2) {
				var w = Math.floor((width + 7) / 8);
				var w1 = Math.floor(width / 8);

				for (y = 0; y < height; y++) {
					var b;
					for (x = 0; x < w1; x++) {
						for (b = 7; b >= 0; b--) {
							dp = (y * width + x * 8 + 7 - b) * 3;
							sp = (data[y * w + x] >> b & 1) * 3;
							dest[dp] = palette[sp];
							dest[dp + 1] = palette[sp + 1];
							dest[dp + 2] = palette[sp + 2];
						}
					}

					for (b = 7; b >= 8 - width % 8; b--) {
						dp = (y * width + x * 8 + 7 - b) * 3;
						sp = (data[y * w + x] >> b & 1) * 3;
						dest[dp] = palette[sp];
						dest[dp + 1] = palette[sp + 1];
						dest[dp + 2] = palette[sp + 2];
					}
				}
			} else {
				for (y = 0; y < height; y++) {
					for (x = 0; x < width; x++) {
						dp = (y * width + x) * 3;
						sp = data[y * width + x] * 3;
						dest[dp] = palette[sp];
						dest[dp + 1] = palette[sp + 1];
						dest[dp + 2] = palette[sp + 2];
					}
				}
			}

			return dest;
		}.bind(this);

		var rQ = this._sock.get_rQ();
		var rQi = this._sock.get_rQi();
		var cmode, clength, data;

		var handlePalette = function () {
			var numColors = rQ[rQi + 2] + 1;
			var paletteSize = numColors * this._fb_depth;
			this._FBU.bytes += paletteSize;
			if (this._sock.rQwait('TIGHT palette ' + cmode, this._FBU.bytes)) { return false; }

			var bpp = (numColors <= 2) ? 1 : 8;
			var rowSize = Math.floor((this._FBU.width * bpp + 7) / 8);
			var raw = false;
			if (rowSize * this._FBU.height < 12) {
				raw = true;
				clength = [0, rowSize * this._FBU.height];
			} else {
				clength = RFB.encodingHandlers.getTightCLength(
					this._sock.rQslice(3 + paletteSize, 3 + paletteSize + 3
				));
			}

			this._FBU.bytes += clength[0] + clength[1];
			if (this._sock.rQwait('TIGHT ' + cmode, this._FBU.bytes)) { return false; }

			// Shift ctl, filter id, num colors, palette entries, and clength off
			this._sock.rQskipBytes(3);
			var palette = this._sock.rQshiftBytes(paletteSize);
			this._sock.rQskipBytes(clength[0]);

			if (raw) {
				data = this._sock.rQshiftBytes(clength[1]);
			} else {
				data = decompress(this._sock.rQshiftBytes(clength[1]));
			}

			// Convert indexed (palette based) image data to RGB
			var rgb = indexedToRGB(data, numColors, palette, this._FBU.width, this._FBU.height);

			this._display.renderQ_push({
				'type': 'blitRgb',
				'data': rgb,
				'x': this._FBU.x,
				'y': this._FBU.y,
				'width': this._FBU.width,
				'height': this._FBU.height
			});

			return true;
		}.bind(this);

		var handleCopy = function () {
			var raw = false;
			var uncompressedSize = this._FBU.width * this._FBU.height * this._fb_depth;
			if (uncompressedSize < 12) {
				raw = true;
				clength = [0, uncompressedSize];
			} else {
				clength = RFB.encodingHandlers.getTightCLength(this._sock.rQslice(1, 4));
			}
			this._FBU.bytes = 1 + clength[0] + clength[1];
			if (this._sock.rQwait('TIGHT ' + cmode, this._FBU.bytes)) { return false; }

			// Shift ctl, clength off
			this._sock.rQshiftBytes(1 + clength[0]);

			if (raw) {
				data = this._sock.rQshiftBytes(clength[1]);
			} else {
				data = decompress(this._sock.rQshiftBytes(clength[1]));
			}

			this._display.renderQ_push({
				'type': 'blitRgb',
				'data': data,
				'x': this._FBU.x,
				'y': this._FBU.y,
				'width': this._FBU.width,
				'height': this._FBU.height
			});

			return true;
		}.bind(this);

		var ctl = this._sock.rQpeek8();

		// Keep tight reset bits
		resetStreams = ctl & 0xF;

		// Figure out filter
		ctl = ctl >> 4;
		streamId = ctl & 0x3;

		if (ctl === 0x08)      { cmode = 'fill'; }
		else if (ctl === 0x09) { cmode = 'jpeg'; }
		else if (ctl === 0x0A) { cmode = 'png'; }
		else if (ctl & 0x04)   { cmode = 'filter'; }
		else if (ctl < 0x04)   { cmode = 'copy'; }
		else {
			return this._fail('Illegal tight compression received, ctl: ' + ctl);
		}

		if (isTightPNG && (cmode === 'filter' || cmode === 'copy')) {
			return this._fail('filter/copy received in tightPNG mode');
		}

		switch (cmode) {
			// fill use fb_depth because TPIXELs drop the padding byte
			case 'fill':  // TPIXEL
				this._FBU.bytes += this._fb_depth;
				break;
			case 'jpeg':  // max clength
				this._FBU.bytes += 3;
				break;
			case 'png':  // max clength
				this._FBU.bytes += 3;
				break;
			case 'filter':  // filter id + num colors if palette
				this._FBU.bytes += 2;
				break;
			case 'copy':
				break;
		}

		if (this._sock.rQwait('TIGHT ' + cmode, this._FBU.bytes)) { return false; }

		// Determine FBU.bytes
		switch (cmode) {
			case 'fill':
				this._sock.rQskip8();  // shift off ctl
				var color = this._sock.rQshiftBytes(this._fb_depth);
				this._display.renderQ_push({
					'type': 'fill',
					'x': this._FBU.x,
					'y': this._FBU.y,
					'width': this._FBU.width,
					'height': this._FBU.height,
					'color': [color[2], color[1], color[0]]
				});
				break;
			case 'png':
			case 'jpeg':
				clength = RFB.encodingHandlers.getTightCLength(this._sock.rQslice(1, 4));
				this._FBU.bytes = 1 + clength[0] + clength[1];  // ctl + clength size + jpeg-data
				if (this._sock.rQwait('TIGHT ' + cmode, this._FBU.bytes)) { return false; }

				// We have everything, render it
				this._sock.rQskipBytes(1 + clength[0]);  // shift off clt + compact length
				var img = new Image();
				img.src = 'data: image/' + cmode +
					extract_data_uri(this._sock.rQshiftBytes(clength[1]));
				this._display.renderQ_push({
					'type': 'img',
					'img': img,
					'x': this._FBU.x,
					'y': this._FBU.y
				});
				img = null;
				break;
			case 'filter':
				var filterId = rQ[rQi + 1];
				if (filterId === 1) {
					if (!handlePalette()) { return false; }
				} else {
					// Filter 0, Copy could be valid here, but servers don't send it as an explicit filter
					// Filter 2, Gradient is valid but not use if jpeg is enabled
					// TODO(directxman12): why aren't we just calling '_fail' here
					throw new Error('Unsupported tight subencoding received, filter: ' + filterId);
				}
				break;
			case 'copy':
				if (!handleCopy()) { return false; }
				break;
		}


		this._FBU.bytes = 0;
		this._FBU.rects--;

		return true;
	},

	TIGHT: function () { return this._encHandlers.display_tight(false); },
	TIGHT_PNG: function () { return this._encHandlers.display_tight(true); },

	last_rect: function () {
		this._FBU.rects = 0;
		return true;
	},

	handle_FB_resize: function () {
		this._fb_width = this._FBU.width;
		this._fb_height = this._FBU.height;
		this._display.resize(this._fb_width, this._fb_height);
		this._onFBResize(this, this._fb_width, this._fb_height);
		this._timing.fbu_rt_start = (new Date()).getTime();

		this._FBU.bytes = 0;
		this._FBU.rects -= 1;
		return true;
	},

	ExtendedDesktopSize: function () {
		this._FBU.bytes = 1;
		if (this._sock.rQwait('ExtendedDesktopSize', this._FBU.bytes)) { return false; }

		this._supportsSetDesktopSize = true;
		var number_of_screens = this._sock.rQpeek8();

		this._FBU.bytes = 4 + (number_of_screens * 16);
		if (this._sock.rQwait('ExtendedDesktopSize', this._FBU.bytes)) { return false; }

		this._sock.rQskipBytes(1);  // number-of-screens
		this._sock.rQskipBytes(3);  // padding

		for (var i=0; i<number_of_screens; i += 1) {
			// Save the id and flags of the first screen
			if (i === 0) {
				this._screen_id = this._sock.rQshiftBytes(4);    // id
				this._sock.rQskipBytes(2);                       // x-position
				this._sock.rQskipBytes(2);                       // y-position
				this._sock.rQskipBytes(2);                       // width
				this._sock.rQskipBytes(2);                       // height
				this._screen_flags = this._sock.rQshiftBytes(4); // flags
			} else {
				this._sock.rQskipBytes(16);
			}
		}

		/*
		 * The x-position indicates the reason for the change:
		 *
		 *  0 - server resized on its own
		 *  1 - this client requested the resize
		 *  2 - another client requested the resize
		 */

		// We need to handle errors when we requested the resize.
		if (this._FBU.x === 1 && this._FBU.y !== 0) {
			var msg = '';
			// The y-position indicates the status code from the server
			switch (this._FBU.y) {
			case 1:
					msg = 'resize is administratively prohibited';
					break;
			case 2:
					msg = 'out of resources';
					break;
			case 3:
					msg = 'invalid screen layout';
					break;
			default:
					msg = 'unknown reason';
					break;
			}
			debug('ExtendedDesktopSize() | server did not accept the resize request: %s', msg);
			return true;
		}

		this._encHandlers.handle_FB_resize();
		return true;
	},

	DesktopSize: function () {
		debug('DesktopSize()');

		this._encHandlers.handle_FB_resize();
		return true;
	},

	Cursor: function () {
		debug('Cursor()');

		var x = this._FBU.x;  // hotspot-x
		var y = this._FBU.y;  // hotspot-y
		var w = this._FBU.width;
		var h = this._FBU.height;

		var pixelslength = w * h * this._fb_Bpp;
		var masklength = Math.floor((w + 7) / 8) * h;

		this._FBU.bytes = pixelslength + masklength;
		if (this._sock.rQwait('cursor encoding', this._FBU.bytes)) { return false; }

		this._display.changeCursor(this._sock.rQshiftBytes(pixelslength),
									 this._sock.rQshiftBytes(masklength),
									 x, y, w, h);

		this._FBU.bytes = 0;
		this._FBU.rects--;

		return true;
	},

	JPEG_quality_lo: function () {
		debugerror('JPEG_quality_lo() | server sent jpeg_quality pseudo-encoding');
	},

	compress_lo: function () {
		debugerror('compress_lo() | server sent compress level pseudo-encoding');
	}
};


/**
 * Private API.
 */


function extract_data_uri (arr) {
	return ';base64,' + Base64.encode(arr);
}

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/novnc-node/lib/rfb.js","/../../node_modules/novnc-node/lib")
},{"./base64":7,"./des":8,"./display":9,"./input":10,"./keys":12,"./tinf":14,"./util":15,"./websock":16,"buffer":3,"debug":17,"rH1JPG":19}],14:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*
 * tinflate  -  tiny inflate
 *
 * Copyright (c) 2003 by Joergen Ibsen / Jibz
 * All Rights Reserved
 *
 * http://www.ibsensoftware.com/
 *
 * This software is provided 'as-is', without any express
 * or implied warranty.  In no event will the authors be
 * held liable for any damages arising from the use of
 * this software.
 *
 * Permission is granted to anyone to use this software
 * for any purpose, including commercial applications,
 * and to alter it and redistribute it freely, subject to
 * the following restrictions:
 *
 * 1. The origin of this software must not be
 *    misrepresented; you must not claim that you
 *    wrote the original software. If you use this
 *    software in a product, an acknowledgment in
 *    the product documentation would be appreciated
 *    but is not required.
 *
 * 2. Altered source versions must be plainly marked
 *    as such, and must not be misrepresented as
 *    being the original software.
 *
 * 3. This notice may not be removed or altered from
 *    any source distribution.
 */

/*
 * tinflate javascript port by Erik Moller in May 2011.
 * emoller@opera.com
 *
 * read_bits() patched by mike@imidio.com to allow
 * reading more then 8 bits (needed in some zlib streams)
 */


/**
 * Expose the TINF class.
 */
module.exports = TINF;


function TINF() {
	this.OK = 0;
	this.DATA_ERROR = (-3);
	this.WINDOW_SIZE = 32768;

	/* ------------------------------ *
	 * -- internal data structures -- *
	 * ------------------------------ */

	this.TREE = function() {
		this.table = new Array(16);  /* table of code length counts */
		this.trans = new Array(288); /* code -> symbol translation table */
	};

	this.DATA = function(that) {
		this.source = '';
		this.sourceIndex = 0;
		this.tag = 0;
		this.bitcount = 0;

		this.dest = [];

		this.history = [];

		this.ltree = new that.TREE(); /* dynamic length/symbol tree */
		this.dtree = new that.TREE(); /* dynamic distance tree */
	};

	/* --------------------------------------------------- *
	 * -- uninitialized global data (static structures) -- *
	 * --------------------------------------------------- */

	this.sltree = new this.TREE(); /* fixed length/symbol tree */
	this.sdtree = new this.TREE(); /* fixed distance tree */

	/* extra bits and base tables for length codes */
	this.length_bits = new Array(30);
	this.length_base = new Array(30);

	/* extra bits and base tables for distance codes */
	this.dist_bits = new Array(30);
	this.dist_base = new Array(30);

	/* special ordering of code length codes */
	this.clcidx = [
		16, 17, 18, 0, 8, 7, 9, 6,
		10, 5, 11, 4, 12, 3, 13, 2,
		14, 1, 15
	];

	/* ----------------------- *
	 * -- utility functions -- *
	 * ----------------------- */

	/* build extra bits and base tables */
	this.build_bits_base = function(bits, base, delta, first) {
		var i, sum;

		/* build bits table */
		for (i = 0; i < delta; ++i) {
			bits[i] = 0;
		}
		for (i = 0; i < 30 - delta; ++i) {
			bits[i + delta] = Math.floor(i / delta);
		}

		/* build base table */
		for (sum = first, i = 0; i < 30; ++i) {
			base[i] = sum;
			sum += 1 << bits[i];
		}
	};

	/* build the fixed huffman trees */
	this.build_fixed_trees = function(lt, dt) {
		var i;

		/* build fixed length tree */
		for (i = 0; i < 7; ++i) { lt.table[i] = 0; }

		lt.table[7] = 24;
		lt.table[8] = 152;
		lt.table[9] = 112;

		for (i = 0; i < 24; ++i) { lt.trans[i] = 256 + i; }
		for (i = 0; i < 144; ++i) { lt.trans[24 + i] = i; }
		for (i = 0; i < 8; ++i) { lt.trans[24 + 144 + i] = 280 + i; }
		for (i = 0; i < 112; ++i) { lt.trans[24 + 144 + 8 + i] = 144 + i; }

		/* build fixed distance tree */
		for (i = 0; i < 5; ++i) { dt.table[i] = 0; }

		dt.table[5] = 32;

		for (i = 0; i < 32; ++i) { dt.trans[i] = i; }
	};

	/* given an array of code lengths, build a tree */
	this.build_tree = function(t, lengths, loffset, num) {
		var offs = new Array(16);
		var i, sum;

		/* clear code length count table */
		for (i = 0; i < 16; ++i) { t.table[i] = 0; }

		/* scan symbol lengths, and sum code length counts */
		for (i = 0; i < num; ++i) {
			t.table[lengths[loffset + i]]++;
		}

		t.table[0] = 0;

		/* compute offset table for distribution sort */
		for (sum = 0, i = 0; i < 16; ++i) {
			offs[i] = sum;
			sum += t.table[i];
		}

		/* create code->symbol translation table (symbols sorted by code) */
		for (i = 0; i < num; ++i) {
			if (lengths[loffset + i]) {
				t.trans[offs[lengths[loffset + i]]++] = i;
			}
		}
	};

	/* ---------------------- *
	 * -- decode functions -- *
	 * ---------------------- */

	/* get one bit from source stream */
	this.getbit = function(d) {
		var bit;

		/* check if tag is empty */
		if (!(d.bitcount--)) {
			/* load next tag */
			d.tag = d.source[d.sourceIndex++] & 0xff;
			d.bitcount = 7;
		}

		/* shift bit out of tag */
		bit = d.tag & 0x01;
		d.tag >>= 1;

		return bit;
	};

	this.read_bits = function(d, num, base) {
		if (!num) {
			return base;
		}

		var ret = read_bits_direct(d.source, d.bitcount, d.tag, d.sourceIndex, num);
		d.bitcount = ret[0];
		d.tag = ret[1];
		d.sourceIndex = ret[2];
		return ret[3] + base;
	};

	/* given a data stream and a tree, decode a symbol */
	this.decode_symbol = function(d, t) {
		while (d.bitcount < 16) {
			d.tag = d.tag | (d.source[d.sourceIndex++] & 0xff) << d.bitcount;
			d.bitcount += 8;
		}

		var sum = 0, cur = 0, len = 0;
		do {
			cur = 2 * cur + ((d.tag & (1 << len)) >> len);

			++len;

			sum += t.table[len];
			cur -= t.table[len];
		} while (cur >= 0);

		d.tag >>= len;
		d.bitcount -= len;

		return t.trans[sum + cur];
	};

	/* given a data stream, decode dynamic trees from it */
	this.decode_trees = function(d, lt, dt) {
		var code_tree = new this.TREE();
		var lengths = new Array(288+32);
		var hlit, hdist, hclen;
		var i, num, length;

		/* get 5 bits HLIT (257-286) */
		hlit = this.read_bits(d, 5, 257);

		/* get 5 bits HDIST (1-32) */
		hdist = this.read_bits(d, 5, 1);

		/* get 4 bits HCLEN (4-19) */
		hclen = this.read_bits(d, 4, 4);

		for (i = 0; i < 19; ++i) { lengths[i] = 0; }

		/* read code lengths for code length alphabet */
		for (i = 0; i < hclen; ++i) {
			/* get 3 bits code length (0-7) */
			var clen = this.read_bits(d, 3, 0);

			lengths[this.clcidx[i]] = clen;
		}

		/* build code length tree */
		this.build_tree(code_tree, lengths, 0, 19);

		/* decode code lengths for the dynamic trees */
		for (num = 0; num < hlit + hdist;) {
			var sym = this.decode_symbol(d, code_tree);

			switch (sym) {
			case 16:
				/* copy previous code length 3-6 times (read 2 bits) */
				{
					var prev = lengths[num - 1];
					for (length = this.read_bits(d, 2, 3); length; --length) {
						lengths[num++] = prev;
					}
				}
				break;
			case 17:
				/* repeat code length 0 for 3-10 times (read 3 bits) */
				for (length = this.read_bits(d, 3, 3); length; --length) {
					lengths[num++] = 0;
				}
				break;
			case 18:
				/* repeat code length 0 for 11-138 times (read 7 bits) */
				for (length = this.read_bits(d, 7, 11); length; --length) {
					lengths[num++] = 0;
				}
				break;
			default:
				/* values 0-15 represent the actual code lengths */
				lengths[num++] = sym;
				break;
			}
		}

		/* build dynamic trees */
		this.build_tree(lt, lengths, 0, hlit);
		this.build_tree(dt, lengths, hlit, hdist);
	};

	/* ----------------------------- *
	 * -- block inflate functions -- *
	 * ----------------------------- */

	/* given a stream and two trees, inflate a block of data */
	this.inflate_block_data = function(d, lt, dt) {
		// js optimization.
		var ddest = d.dest;
		var ddestlength = ddest.length;

		while (1) {
			var sym = this.decode_symbol(d, lt);

			/* check for end of block */
			if (sym === 256) {
				return this.OK;
			}

			if (sym < 256) {
				ddest[ddestlength++] = sym; // ? String.fromCharCode(sym);
				d.history.push(sym);
			} else {
				var length, dist, offs;
				var i;

				sym -= 257;

				/* possibly get more bits from length code */
				length = this.read_bits(d, this.length_bits[sym], this.length_base[sym]);

				dist = this.decode_symbol(d, dt);

				/* possibly get more bits from distance code */
				offs = d.history.length - this.read_bits(d, this.dist_bits[dist], this.dist_base[dist]);

				if (offs < 0) {
					throw new Error('Invalid zlib offset ' + offs);
				}

				/* copy match */
				for (i = offs; i < offs + length; ++i) {
					//ddest[ddestlength++] = ddest[i];
					ddest[ddestlength++] = d.history[i];
					d.history.push(d.history[i]);
				}
			}
		}
	};

	/* inflate an uncompressed block of data */
	this.inflate_uncompressed_block = function(d) {
		var length, invlength;
		var i;

		if (d.bitcount > 7) {
			 var overflow = Math.floor(d.bitcount / 8);
			 d.sourceIndex -= overflow;
			 d.bitcount = 0;
			 d.tag = 0;
		}

		/* get length */
		length = d.source[d.sourceIndex+1];
		length = 256*length + d.source[d.sourceIndex];

		/* get one's complement of length */
		invlength = d.source[d.sourceIndex+3];
		invlength = 256*invlength + d.source[d.sourceIndex+2];

		/* check length */
		if (length !== (~invlength & 0x0000ffff)) {
			return this.DATA_ERROR;
		}

		d.sourceIndex += 4;

		/* copy block */
		for (i = length; i; --i) {
			 d.history.push(d.source[d.sourceIndex]);
			 d.dest[d.dest.length] = d.source[d.sourceIndex++];
		}

		/* make sure we start next block on a byte boundary */
		d.bitcount = 0;

		return this.OK;
	};

	/* inflate a block of data compressed with fixed huffman trees */
	this.inflate_fixed_block = function(d) {
		/* decode block using fixed trees */
		return this.inflate_block_data(d, this.sltree, this.sdtree);
	};

	/* inflate a block of data compressed with dynamic huffman trees */
	this.inflate_dynamic_block = function(d) {
		/* decode trees from stream */
		this.decode_trees(d, d.ltree, d.dtree);

		/* decode block using decoded trees */
		return this.inflate_block_data(d, d.ltree, d.dtree);
	};

	/* ---------------------- *
	 * -- public functions -- *
	 * ---------------------- */

	/* initialize global (static) data */
	this.init = function() {
		/* build fixed huffman trees */
		this.build_fixed_trees(this.sltree, this.sdtree);

		/* build extra bits and base tables */
		this.build_bits_base(this.length_bits, this.length_base, 4, 3);
		this.build_bits_base(this.dist_bits, this.dist_base, 2, 1);

		/* fix a special case */
		this.length_bits[28] = 0;
		this.length_base[28] = 258;

		this.reset();
	};

	this.reset = function() {
		this.d = new this.DATA(this);
		delete this.header;
	};

	/* inflate stream from source to dest */
	this.uncompress = function(source, offset) {
		var d = this.d;
		var bfinal;

		/* initialise data */
		d.source = source;
		d.sourceIndex = offset;
		d.bitcount = 0;

		d.dest = [];

		// Skip zlib header at start of stream
		if (typeof this.header === 'undefined') {
			this.header = this.read_bits(d, 16, 0);
			/* byte 0: 0x78, 7 = 32k window size, 8 = deflate */
			/* byte 1: check bits for header and other flags */
		}

		var blocks = 0;

		do {
			var btype;
			var res;

			/* read final block flag */
			bfinal = this.getbit(d);

			/* read block type (2 bits) */
			btype = this.read_bits(d, 2, 0);

			/* decompress block */
			switch (btype) {
			case 0:
				/* decompress uncompressed block */
				res = this.inflate_uncompressed_block(d);
				break;
			case 1:
				/* decompress block with fixed huffman trees */
				res = this.inflate_fixed_block(d);
				break;
			case 2:
				/* decompress block with dynamic huffman trees */
				res = this.inflate_dynamic_block(d);
				break;
			default:
				return { 'status' : this.DATA_ERROR };
			}

			if (res !== this.OK) {
				return { 'status' : this.DATA_ERROR };
			}
			blocks++;

		} while (!bfinal && d.sourceIndex < d.source.length);

		d.history = d.history.slice(-this.WINDOW_SIZE);

		return { 'status' : this.OK, 'data' : d.dest };
	};
}


/**
 * Private API.
 */


/* read a num bit value from a stream and add base */
function read_bits_direct(source, bitcount, tag, idx, num) {
	var val = 0;

	while (bitcount < 24) {
		tag = tag | (source[idx++] & 0xff) << bitcount;
		bitcount += 8;
	}

	val = tag & (0xffff >> (16 - num));
	tag >>= num;
	bitcount -= num;
	return [bitcount, tag, idx, val];
}

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/novnc-node/lib/tinf.js","/../../node_modules/novnc-node/lib")
},{"buffer":3,"rH1JPG":19}],15:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*
 * noVNC: HTML5 VNC client
 * Copyright (C) 2012 Joel Martin
 * Licensed under MPL 2.0 (see LICENSE.txt)
 */


/**
 * Dependencies.
 */
var debug = require('debug')('noVNC:Util');
var debugerror = require('debug')('noVNC:ERROR:Util');
debugerror.log = console.warn.bind(console);


/**
 * Local variables.
 */
var cursor_uris_supported = null;


var Util = module.exports = {
	push8: function (array, num) {
		array.push(num & 0xFF);
	},

	push16: function (array, num) {
		array.push((num >> 8) & 0xFF,
						num & 0xFF);
	},

	push32: function (array, num) {
		array.push((num >> 24) & 0xFF,
					 (num >> 16) & 0xFF,
					 (num >> 8) & 0xFF,
					 num & 0xFF);
	},

	requestAnimationFrame: (function () {
		if (global.requestAnimationFrame) {
			return global.requestAnimationFrame.bind(global);
		}
		else if (global.webkitRequestAnimationFrame) {
			return global.webkitRequestAnimationFrame.bind(global);
		}
		else if (global.mozRequestAnimationFrame) {
			return global.mozRequestAnimationFrame.bind(global);
		}
		else if (global.oRequestAnimationFrame) {
			return global.oRequestAnimationFrame.bind(global);
		}
		else if (global.msRequestAnimationFrame) {
			return global.msRequestAnimationFrame.bind(global);
		}
		else {
			return function(callback) {
				setTimeout(callback, 1000 / 60);
			};
		}
	})(),

	make_properties: function (constructor, arr) {
		for (var i = 0; i < arr.length; i++) {
			make_property(constructor.prototype, arr[i][0], arr[i][1], arr[i][2]);
		}
	},

	set_defaults: function (obj, conf, defaults) {
		var defaults_keys = Object.keys(defaults);
		var conf_keys = Object.keys(conf);
		var keys_obj = {};
		var i;

		for (i = 0; i < defaults_keys.length; i++) { keys_obj[defaults_keys[i]] = 1; }
		for (i = 0; i < conf_keys.length; i++) { keys_obj[conf_keys[i]] = 1; }

		var keys = Object.keys(keys_obj);

		for (i = 0; i < keys.length; i++) {
			var setter = obj['_raw_set_' + keys[i]];

			if (!setter) {
				debugerror('invalid property: %s', keys[i]);
				continue;
			}

			if (keys[i] in conf) {
				setter.call(obj, conf[keys[i]]);
			} else {
				setter.call(obj, defaults[keys[i]]);
			}
		}
	},

	decodeUTF8: function (utf8string) {
		return decodeURIComponent(escape(utf8string));
	},

	/**
	 * Get DOM element position on page.
	 */
	getPosition: function (obj) {
		// NB(sross): the Mozilla developer reference seems to indicate that
		// getBoundingClientRect includes border and padding, so the canvas
		// style should NOT include either.
		var objPosition = obj.getBoundingClientRect();

		return {'x': objPosition.left + window.pageXOffset, 'y': objPosition.top + window.pageYOffset,
						'width': objPosition.width, 'height': objPosition.height};
	},

	/**
	 * Get mouse event position in DOM element
	 */
	getEventPosition: function (e, obj, scale, zoom) {
		var evt, docX, docY, pos;

		if (typeof zoom === 'undefined') {
			zoom = 1.0;
		}
		evt = (e ? e : global.event);
		evt = (evt.changedTouches ? evt.changedTouches[0] : evt.touches ? evt.touches[0] : evt);
		if (evt.pageX || evt.pageY) {
			docX = evt.pageX;
			docY = evt.pageY;
			docX = evt.pageX/zoom;
			docY = evt.pageY/zoom;
		} else if (evt.clientX || evt.clientY) {
			docX = evt.clientX + document.body.scrollLeft +
				document.documentElement.scrollLeft;
			docY = evt.clientY + document.body.scrollTop +
				document.documentElement.scrollTop;
		}
		pos = Util.getPosition(obj);
		if (typeof scale === 'undefined') {
			scale = 1;
		}

		var realx = docX - pos.x;
		var realy = docY - pos.y;
		var x = Math.max(Math.min(realx, pos.width - 1), 0);
		var y = Math.max(Math.min(realy, pos.height - 1), 0);

		return {'x': x / scale, 'y': y / scale, 'realx': realx / scale, 'realy': realy / scale};
	},

	addEvent: function (obj, evType, fn) {
		if (obj.attachEvent) {
			var r = obj.attachEvent('on' + evType, fn);
			return r;
		} else if (obj.addEventListener) {
			obj.addEventListener(evType, fn, false);
			return true;
		} else {
			throw new Error('handler could not be attached');
		}
	},

	removeEvent: function (obj, evType, fn) {
		if (obj.detachEvent) {
			var r = obj.detachEvent('on' + evType, fn);
			return r;
		} else if (obj.removeEventListener) {
			obj.removeEventListener(evType, fn, false);
			return true;
		} else {
			throw new Error('handler could not be removed');
		}
	},

	stopEvent: function (e) {
		if (e.stopPropagation) { e.stopPropagation(); }
		else                   { e.cancelBubble = true; }

		if (e.preventDefault)  { e.preventDefault(); }
		else                   { e.returnValue = false; }
	},

	browserSupportsCursorURIs: function () {
		if (cursor_uris_supported === null) {
			try {
				var target = document.createElement('canvas');

				target.style.cursor = 'url("data:image/x-icon;base64,AAACAAEACAgAAAIAAgA4AQAAFgAAACgAAAAIAAAAEAAAAAEAIAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAD/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAA==") 2 2, default';

				if (target.style.cursor) {
					debug('data URI scheme cursor supported');
					cursor_uris_supported = true;
				} else {
					debugerror('data URI scheme cursor not supported');
					cursor_uris_supported = false;
				}
			} catch (exc) {
				debugerror('data URI scheme cursor test exception: ' + exc);
				cursor_uris_supported = false;
			}
		}

		return cursor_uris_supported;
	}
};


/**
 * Private API.
 */


function make_property (proto, name, mode, type) {
	var getter;

	if (type === 'arr') {
		getter = function (idx) {
			if (typeof idx !== 'undefined') {
				return this['_' + name][idx];
			} else {
				return this['_' + name];
			}
		};
	} else {
		getter = function() {
			return this['_' + name];
		};
	}

	function make_setter (process_val) {
		if (process_val) {
			return function (val, idx) {
				if (typeof idx !== 'undefined') {
					this['_' + name][idx] = process_val(val);
				} else {
					this['_' + name] = process_val(val);
				}
			};
		} else {
			return function (val, idx) {
				if (typeof idx !== 'undefined') {
					this['_' + name][idx] = val;
				} else {
					this['_' + name] = val;
				}
			};
		}
	}

	var setter;

	if (type === 'bool') {
		setter = make_setter(function (val) {
			if (!val || (val in {'0': 1, 'no': 1, 'false': 1})) {
				return false;
			} else {
				return true;
			}
		});
	} else if (type === 'int') {
		setter = make_setter(function (val) { return parseInt(val, 10); });
	} else if (type === 'float') {
		setter = make_setter(parseFloat);
	} else if (type === 'str') {
		setter = make_setter(String);
	} else if (type === 'func') {
		setter = make_setter(function (val) {
			if (!val) {
				return function () {};
			} else {
				return val;
			}
		});
	} else if (type === 'arr' || type === 'dom' || type === 'raw') {
		setter = make_setter();
	} else {
		throw new Error('unknown property type ' + type);  // some sanity checking
	}

	// set the getter
	if (typeof proto['get_' + name] === 'undefined') {
		proto['get_' + name] = getter;
	}

	// set the setter if needed
	if (typeof proto['set_' + name] === 'undefined') {
		if (mode === 'rw') {
			proto['set_' + name] = setter;
		} else if (mode === 'wo') {
			proto['set_' + name] = function (val, idx) {
				if (typeof this['_' + name] !== 'undefined') {
					throw new Error(name + ' can only be set once');
				}
				setter.call(this, val, idx);
			};
		}
	}

	// make a special setter that we can use in set defaults
	proto['_raw_set_' + name] = function (val, idx) {
		setter.call(this, val, idx);
		//delete this['_init_set_' + name];  // remove it after use
	};
}

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/novnc-node/lib/util.js","/../../node_modules/novnc-node/lib")
},{"buffer":3,"debug":17,"rH1JPG":19}],16:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*
 * Websock: high-performance binary WebSockets
 * Copyright (C) 2012 Joel Martin
 * Licensed under MPL 2.0 (see LICENSE.txt)
 *
 * Websock is similar to the standard WebSocket object but Websock
 * enables communication with raw TCP sockets (i.e. the binary stream)
 * via websockify. This is accomplished by base64 encoding the data
 * stream between Websock and websockify.
 *
 * Websock has built-in receive queue buffering; the message event
 * does not contain actual data but is simply a notification that
 * there is new data available. Several rQ* methods are available to
 * read binary data off of the receive queue.
 */


/**
 * Dependencies.
 */
var debug = require('debug')('noVNC:Websock');
var debugerror = require('debug')('noVNC:ERROR:Websock');
debugerror.log = console.warn.bind(console);
var browser = require('bowser').browser;
var Base64 = require('./base64');


/**
 * Expose Websock class.
 */
module.exports = Websock;


function Websock() {
	this._websocket = null;  // WebSocket object
	this._rQ = [];           // Receive queue
	this._rQi = 0;           // Receive queue index
	this._rQmax = 10000;     // Max receive queue size before compacting
	this._sQ = [];           // Send queue

	this._mode = 'base64';    // Current WebSocket mode: 'binary', 'base64'
	this.maxBufferedAmount = 200;

	this._eventHandlers = {
		'message': function () {},
		'open': function () {},
		'close': function () {},
		'error': function () {}
	};
}


Websock.prototype = {
	// Getters and Setters
	get_sQ: function () {
		return this._sQ;
	},

	get_rQ: function () {
		return this._rQ;
	},

	get_rQi: function () {
		return this._rQi;
	},

	set_rQi: function (val) {
		this._rQi = val;
	},

	// Receive Queue
	rQlen: function () {
		return this._rQ.length - this._rQi;
	},

	rQpeek8: function () {
		return this._rQ[this._rQi];
	},

	rQshift8: function () {
		return this._rQ[this._rQi++];
	},

	rQskip8: function () {
		this._rQi++;
	},

	rQskipBytes: function (num) {
		this._rQi += num;
	},

	rQunshift8: function (num) {
		if (this._rQi === 0) {
			this._rQ.unshift(num);
		} else {
			this._rQi--;
			this._rQ[this._rQi] = num;
		}
	},

	rQshift16: function () {
		return (this._rQ[this._rQi++] << 8) +
			   this._rQ[this._rQi++];
	},

	rQshift32: function () {
		return (this._rQ[this._rQi++] << 24) +
			   (this._rQ[this._rQi++] << 16) +
			   (this._rQ[this._rQi++] << 8) +
			   this._rQ[this._rQi++];
	},

	rQshiftStr: function (len) {
		if (typeof(len) === 'undefined') { len = this.rQlen(); }
		var arr = this._rQ.slice(this._rQi, this._rQi + len);
		this._rQi += len;
		return String.fromCharCode.apply(null, arr);
	},

	rQshiftBytes: function (len) {
		if (typeof(len) === 'undefined') { len = this.rQlen(); }
		this._rQi += len;
		return this._rQ.slice(this._rQi - len, this._rQi);
	},

	rQslice: function (start, end) {
		if (end) {
			return this._rQ.slice(this._rQi + start, this._rQi + end);
		} else {
			return this._rQ.slice(this._rQi + start);
		}
	},

	// Check to see if we must wait for 'num' bytes (default to FBU.bytes)
	// to be available in the receive queue. Return true if we need to
	// wait (and possibly print a debug message), otherwise false.
	rQwait: function (msg, num, goback) {
		var rQlen = this._rQ.length - this._rQi; // Skip rQlen() function call
		if (rQlen < num) {
			if (goback) {
				if (this._rQi < goback) {
					throw new Error('rQwait cannot backup ' + goback + ' bytes');
				}
				this._rQi -= goback;
			}
			return true; // true means need more data
		}
		return false;
	},

	// Send Queue

	flush: function () {
		if (this._websocket.bufferedAmount !== 0) {
			debug('flush() | bufferedAmount: %d', this._websocket.bufferedAmount);
		}

		if (this._websocket.bufferedAmount < this.maxBufferedAmount) {
			if (this._sQ.length > 0) {
				this._websocket.send(this._encode_message());
				this._sQ = [];
			}

			return true;
		} else {
			debug('flush() | delaying send');
			return false;
		}
	},

	send: function (arr) {
	   this._sQ = this._sQ.concat(arr);
	   return this.flush();
	},

	send_string: function (str) {
		this.send(str.split('').map(function (chr) {
			return chr.charCodeAt(0);
		}));
	},

	// Event Handlers
	on: function (evt, handler) {
		this._eventHandlers[evt] = handler;
	},

	off: function (evt) {
		this._eventHandlers[evt] = function() {};
	},

	init: function (protocols) {
		this._rQ = [];
		this._rQi = 0;
		this._sQ = [];
		this._websocket = null;

		// Check for full typed array support
		var bt = false;
		if (('Uint8Array' in global) && ('set' in Uint8Array.prototype)) {
			bt = true;
		}

		var wsbt = false;
		if (global.WebSocket) {
			// Safari < 7 does not support binary WS.
			if (browser.safari && Number(browser.version) > 0 && Number(browser.version) < 7) {
				debug('init() | Safari %d does not support binary WebSocket', Number(browser.version));
			}
			else {
				wsbt = true;
			}
		}

		// Default protocols if not specified
		if (typeof(protocols) === 'undefined') {
			if (wsbt) {
				protocols = ['binary', 'base64'];
			} else {
				protocols = 'base64';
			}
		}

		if (!wsbt) {
			if (protocols === 'binary') {
				throw new Error('WebSocket binary sub-protocol requested but not supported');
			}

			if (typeof(protocols) === 'object') {
				var new_protocols = [];

				for (var i = 0; i < protocols.length; i++) {
					if (protocols[i] === 'binary') {
						debugerror('init() | skipping unsupported WebSocket binary sub-protocol');
					} else {
						new_protocols.push(protocols[i]);
					}
				}

				if (new_protocols.length > 0) {
					protocols = new_protocols;
				} else {
					throw new Error('only WebSocket binary sub-protocol was requested and is not supported');
				}
			}
		}

		return protocols;
	},

	open: function (uri, protocols) {
		var self = this;

		protocols = this.init(protocols);

		// this._websocket = new WebSocket(uri, protocols);
		// TODO: Add API or settings for passing the W3C WebSocket class.
		if (global.NativeWebSocket) {
			debug('open() | using NativeWebSocket');
			this._websocket = new global.NativeWebSocket(uri, protocols);
		} else {
			debug('open() | not using NativeWebSocket');
			this._websocket = new WebSocket(uri, protocols);
		}

		if (protocols.indexOf('binary') >= 0) {
			this._websocket.binaryType = 'arraybuffer';
		}

		this._websocket.onmessage = function (e) {
			self._recv_message(e);
		};

		this._websocket.onopen = function() {
			if (self._websocket.protocol) {
				debug('onopen: server choose "%s" sub-protocol', self._websocket.protocol);
				self._mode = self._websocket.protocol;
				self._eventHandlers.open();
			}
			else {
				debugerror('onopen: server choose no sub-protocol, using "base64"');
				self._mode = 'base64';
				self._eventHandlers.open();
			}
		};

		this._websocket.onclose = function (e) {
			debug('onclose: %o', e);
			self._eventHandlers.close(e);
		};

		this._websocket.onerror = function (e) {
			debugerror('onerror: %o', e);
			self._eventHandlers.error(e);
		};
	},

	close: function () {
		if (this._websocket) {
			if ((this._websocket.readyState === this._websocket.OPEN) ||
					(this._websocket.readyState === this._websocket.CONNECTING)) {
				debug('close()');
				this._websocket.close();
			}

			this._websocket.onmessage = function () { return; };
		}
	},

	// private methods

	_encode_message: function () {
		if (this._mode === 'binary') {
			// Put in a binary arraybuffer
			return (new Uint8Array(this._sQ)).buffer;
		} else {
			// base64 encode
			return Base64.encode(this._sQ);
		}
	},

	_decode_message: function (data) {
		if (this._mode === 'binary') {
			// push arraybuffer values onto the end
			var u8 = new Uint8Array(data);
			for (var i = 0; i < u8.length; i++) {
				this._rQ.push(u8[i]);
			}
		} else {
			// base64 decode and concat to end
			this._rQ = this._rQ.concat(Base64.decode(data, 0));
		}
	},

	_recv_message: function (e) {
		try {
			this._decode_message(e.data);
			if (this.rQlen() > 0) {
				this._eventHandlers.message();
				// Compact the receive queue
				if (this._rQ.length > this._rQmax) {
					this._rQ = this._rQ.slice(this._rQi);
					this._rQi = 0;
				}
			} else {
				debug('_recv_message() | ignoring empty message');
			}
		} catch (error) {
			debugerror('_recv_message() | error: %o', error);

			if (typeof error.name !== 'undefined') {
				this._eventHandlers.error(error.name + ': ' + error.message);
			} else {
				this._eventHandlers.error(error);
			}
		}
	}
};

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/novnc-node/lib/websock.js","/../../node_modules/novnc-node/lib")
},{"./base64":7,"bowser":2,"buffer":3,"debug":17,"rH1JPG":19}],17:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/novnc-node/node_modules/debug/src/browser.js","/../../node_modules/novnc-node/node_modules/debug/src")
},{"./debug":18,"buffer":3,"rH1JPG":19}],18:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/novnc-node/node_modules/debug/src/debug.js","/../../node_modules/novnc-node/node_modules/debug/src")
},{"buffer":3,"ms":5,"rH1JPG":19}],19:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/process/browser.js","/../../node_modules/process")
},{"buffer":3,"rH1JPG":19}],20:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var noVNC, onFBUComplete, onUpdateState, onVNCCopyCut, rfb, socket;

noVNC = require('novnc-node');

fetch('http://35.194.80.84/session').then(function(res) {
  return console.log(res);
});

socket = new WebSocket('ws://35.194.80.84/socket');

onVNCCopyCut = function(rfb, text) {};

onUpdateState = function(rfb, state, oldstate, msg) {
  console.log(rfb, state, oldstate, msg);
};

onFBUComplete = function(rfb, fbu) {
  rfb.setDesktopSize(680, 480);
  return rfb.set_onFBUComplete(function() {
    return {};
  });
};

rfb = new noVNC.RFB({
  'target': document.getElementById('noVNC_canvas'),
  'encrypt': true,
  'repeaterID': '',
  'true_color': true,
  'local_cursor': true,
  'shared': true,
  'view_only': false,
  'onUpdateState': onUpdateState,
  'onClipboard': onVNCCopyCut,
  'onFBUComplete': onFBUComplete
});

rfb.sendPassword("secret");

rfb.connect("ws://35.194.80.84/websockify", "secret");

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_4fb45376.js","/")
},{"buffer":3,"novnc-node":6,"rH1JPG":19}]},{},[20])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYW4vUHJvamVjdHMvZG9yZGlsbGUuZ2l0aHViLmlvL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZGFuL1Byb2plY3RzL2RvcmRpbGxlLmdpdGh1Yi5pby9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanMiLCIvVXNlcnMvZGFuL1Byb2plY3RzL2RvcmRpbGxlLmdpdGh1Yi5pby9ub2RlX21vZHVsZXMvYm93c2VyL2Jvd3Nlci5qcyIsIi9Vc2Vycy9kYW4vUHJvamVjdHMvZG9yZGlsbGUuZ2l0aHViLmlvL25vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCIvVXNlcnMvZGFuL1Byb2plY3RzL2RvcmRpbGxlLmdpdGh1Yi5pby9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIi9Vc2Vycy9kYW4vUHJvamVjdHMvZG9yZGlsbGUuZ2l0aHViLmlvL25vZGVfbW9kdWxlcy9tcy9pbmRleC5qcyIsIi9Vc2Vycy9kYW4vUHJvamVjdHMvZG9yZGlsbGUuZ2l0aHViLmlvL25vZGVfbW9kdWxlcy9ub3ZuYy1ub2RlL2luZGV4LmpzIiwiL1VzZXJzL2Rhbi9Qcm9qZWN0cy9kb3JkaWxsZS5naXRodWIuaW8vbm9kZV9tb2R1bGVzL25vdm5jLW5vZGUvbGliL2Jhc2U2NC5qcyIsIi9Vc2Vycy9kYW4vUHJvamVjdHMvZG9yZGlsbGUuZ2l0aHViLmlvL25vZGVfbW9kdWxlcy9ub3ZuYy1ub2RlL2xpYi9kZXMuanMiLCIvVXNlcnMvZGFuL1Byb2plY3RzL2RvcmRpbGxlLmdpdGh1Yi5pby9ub2RlX21vZHVsZXMvbm92bmMtbm9kZS9saWIvZGlzcGxheS5qcyIsIi9Vc2Vycy9kYW4vUHJvamVjdHMvZG9yZGlsbGUuZ2l0aHViLmlvL25vZGVfbW9kdWxlcy9ub3ZuYy1ub2RlL2xpYi9pbnB1dC5qcyIsIi9Vc2Vycy9kYW4vUHJvamVjdHMvZG9yZGlsbGUuZ2l0aHViLmlvL25vZGVfbW9kdWxlcy9ub3ZuYy1ub2RlL2xpYi9rYmR1dGlsLmpzIiwiL1VzZXJzL2Rhbi9Qcm9qZWN0cy9kb3JkaWxsZS5naXRodWIuaW8vbm9kZV9tb2R1bGVzL25vdm5jLW5vZGUvbGliL2tleXMuanMiLCIvVXNlcnMvZGFuL1Byb2plY3RzL2RvcmRpbGxlLmdpdGh1Yi5pby9ub2RlX21vZHVsZXMvbm92bmMtbm9kZS9saWIvcmZiLmpzIiwiL1VzZXJzL2Rhbi9Qcm9qZWN0cy9kb3JkaWxsZS5naXRodWIuaW8vbm9kZV9tb2R1bGVzL25vdm5jLW5vZGUvbGliL3RpbmYuanMiLCIvVXNlcnMvZGFuL1Byb2plY3RzL2RvcmRpbGxlLmdpdGh1Yi5pby9ub2RlX21vZHVsZXMvbm92bmMtbm9kZS9saWIvdXRpbC5qcyIsIi9Vc2Vycy9kYW4vUHJvamVjdHMvZG9yZGlsbGUuZ2l0aHViLmlvL25vZGVfbW9kdWxlcy9ub3ZuYy1ub2RlL2xpYi93ZWJzb2NrLmpzIiwiL1VzZXJzL2Rhbi9Qcm9qZWN0cy9kb3JkaWxsZS5naXRodWIuaW8vbm9kZV9tb2R1bGVzL25vdm5jLW5vZGUvbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9icm93c2VyLmpzIiwiL1VzZXJzL2Rhbi9Qcm9qZWN0cy9kb3JkaWxsZS5naXRodWIuaW8vbm9kZV9tb2R1bGVzL25vdm5jLW5vZGUvbm9kZV9tb2R1bGVzL2RlYnVnL3NyYy9kZWJ1Zy5qcyIsIi9Vc2Vycy9kYW4vUHJvamVjdHMvZG9yZGlsbGUuZ2l0aHViLmlvL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCIvVXNlcnMvZGFuL1Byb2plY3RzL2RvcmRpbGxlLmdpdGh1Yi5pby9zcmMvc2NyaXB0cy9mYWtlXzRmYjQ1Mzc2LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2bENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDanlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3paQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxK0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbjsoZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG4gIHZhciBBcnIgPSAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKVxuICAgID8gVWludDhBcnJheVxuICAgIDogQXJyYXlcblxuXHR2YXIgUExVUyAgID0gJysnLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIICA9ICcvJy5jaGFyQ29kZUF0KDApXG5cdHZhciBOVU1CRVIgPSAnMCcuY2hhckNvZGVBdCgwKVxuXHR2YXIgTE9XRVIgID0gJ2EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFVQUEVSICA9ICdBJy5jaGFyQ29kZUF0KDApXG5cdHZhciBQTFVTX1VSTF9TQUZFID0gJy0nLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIX1VSTF9TQUZFID0gJ18nLmNoYXJDb2RlQXQoMClcblxuXHRmdW5jdGlvbiBkZWNvZGUgKGVsdCkge1xuXHRcdHZhciBjb2RlID0gZWx0LmNoYXJDb2RlQXQoMClcblx0XHRpZiAoY29kZSA9PT0gUExVUyB8fFxuXHRcdCAgICBjb2RlID09PSBQTFVTX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYyIC8vICcrJ1xuXHRcdGlmIChjb2RlID09PSBTTEFTSCB8fFxuXHRcdCAgICBjb2RlID09PSBTTEFTSF9VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MyAvLyAnLydcblx0XHRpZiAoY29kZSA8IE5VTUJFUilcblx0XHRcdHJldHVybiAtMSAvL25vIG1hdGNoXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIgKyAxMClcblx0XHRcdHJldHVybiBjb2RlIC0gTlVNQkVSICsgMjYgKyAyNlxuXHRcdGlmIChjb2RlIDwgVVBQRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gVVBQRVJcblx0XHRpZiAoY29kZSA8IExPV0VSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIExPV0VSICsgMjZcblx0fVxuXG5cdGZ1bmN0aW9uIGI2NFRvQnl0ZUFycmF5IChiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuXG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0Jylcblx0XHR9XG5cblx0XHQvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuXHRcdC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcblx0XHQvLyByZXByZXNlbnQgb25lIGJ5dGVcblx0XHQvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcblx0XHQvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG5cdFx0dmFyIGxlbiA9IGI2NC5sZW5ndGhcblx0XHRwbGFjZUhvbGRlcnMgPSAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMikgPyAyIDogJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDEpID8gMSA6IDBcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IG5ldyBBcnIoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuXHRcdGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIDQgOiBiNjQubGVuZ3RoXG5cblx0XHR2YXIgTCA9IDBcblxuXHRcdGZ1bmN0aW9uIHB1c2ggKHYpIHtcblx0XHRcdGFycltMKytdID0gdlxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTgpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgMTIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPDwgNikgfCBkZWNvZGUoYjY0LmNoYXJBdChpICsgMykpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDApID4+IDgpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0aWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpID4+IDQpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTApIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgNCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA+PiAyKVxuXHRcdFx0cHVzaCgodG1wID4+IDgpICYgMHhGRilcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyXG5cdH1cblxuXHRmdW5jdGlvbiB1aW50OFRvQmFzZTY0ICh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoXG5cblx0XHRmdW5jdGlvbiBlbmNvZGUgKG51bSkge1xuXHRcdFx0cmV0dXJuIGxvb2t1cC5jaGFyQXQobnVtKVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKG51bSA+PiAxOCAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiAxMiAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiA2ICYgMHgzRikgKyBlbmNvZGUobnVtICYgMHgzRilcblx0XHR9XG5cblx0XHQvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG5cdFx0Zm9yIChpID0gMCwgbGVuZ3RoID0gdWludDgubGVuZ3RoIC0gZXh0cmFCeXRlczsgaSA8IGxlbmd0aDsgaSArPSAzKSB7XG5cdFx0XHR0ZW1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuXHRcdFx0b3V0cHV0ICs9IHRyaXBsZXRUb0Jhc2U2NCh0ZW1wKVxuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAyKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSdcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dGVtcCA9ICh1aW50OFt1aW50OC5sZW5ndGggLSAyXSA8PCA4KSArICh1aW50OFt1aW50OC5sZW5ndGggLSAxXSlcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDEwKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wID4+IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCAyKSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPSdcblx0XHRcdFx0YnJlYWtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0XG5cdH1cblxuXHRleHBvcnRzLnRvQnl0ZUFycmF5ID0gYjY0VG9CeXRlQXJyYXlcblx0ZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NFxufSh0eXBlb2YgZXhwb3J0cyA9PT0gJ3VuZGVmaW5lZCcgPyAodGhpcy5iYXNlNjRqcyA9IHt9KSA6IGV4cG9ydHMpKVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyohXG4gICogQm93c2VyIC0gYSBicm93c2VyIGRldGVjdG9yXG4gICogaHR0cHM6Ly9naXRodWIuY29tL2RlZC9ib3dzZXJcbiAgKiBNSVQgTGljZW5zZSB8IChjKSBEdXN0aW4gRGlheiAyMDE0XG4gICovXG5cbiFmdW5jdGlvbiAobmFtZSwgZGVmaW5pdGlvbikge1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykgbW9kdWxlLmV4cG9ydHNbJ2Jyb3dzZXInXSA9IGRlZmluaXRpb24oKVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGRlZmluaXRpb24pXG4gIGVsc2UgdGhpc1tuYW1lXSA9IGRlZmluaXRpb24oKVxufSgnYm93c2VyJywgZnVuY3Rpb24gKCkge1xuICAvKipcbiAgICAqIFNlZSB1c2VyYWdlbnRzLmpzIGZvciBleGFtcGxlcyBvZiBuYXZpZ2F0b3IudXNlckFnZW50XG4gICAgKi9cblxuICB2YXIgdCA9IHRydWVcblxuICBmdW5jdGlvbiBkZXRlY3QodWEpIHtcblxuICAgIGZ1bmN0aW9uIGdldEZpcnN0TWF0Y2gocmVnZXgpIHtcbiAgICAgIHZhciBtYXRjaCA9IHVhLm1hdGNoKHJlZ2V4KTtcbiAgICAgIHJldHVybiAobWF0Y2ggJiYgbWF0Y2gubGVuZ3RoID4gMSAmJiBtYXRjaFsxXSkgfHwgJyc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2Vjb25kTWF0Y2gocmVnZXgpIHtcbiAgICAgIHZhciBtYXRjaCA9IHVhLm1hdGNoKHJlZ2V4KTtcbiAgICAgIHJldHVybiAobWF0Y2ggJiYgbWF0Y2gubGVuZ3RoID4gMSAmJiBtYXRjaFsyXSkgfHwgJyc7XG4gICAgfVxuXG4gICAgdmFyIGlvc2RldmljZSA9IGdldEZpcnN0TWF0Y2goLyhpcG9kfGlwaG9uZXxpcGFkKS9pKS50b0xvd2VyQ2FzZSgpXG4gICAgICAsIGxpa2VBbmRyb2lkID0gL2xpa2UgYW5kcm9pZC9pLnRlc3QodWEpXG4gICAgICAsIGFuZHJvaWQgPSAhbGlrZUFuZHJvaWQgJiYgL2FuZHJvaWQvaS50ZXN0KHVhKVxuICAgICAgLCBlZGdlVmVyc2lvbiA9IGdldEZpcnN0TWF0Y2goL2VkZ2VcXC8oXFxkKyhcXC5cXGQrKT8pL2kpXG4gICAgICAsIHZlcnNpb25JZGVudGlmaWVyID0gZ2V0Rmlyc3RNYXRjaCgvdmVyc2lvblxcLyhcXGQrKFxcLlxcZCspPykvaSlcbiAgICAgICwgdGFibGV0ID0gL3RhYmxldC9pLnRlc3QodWEpXG4gICAgICAsIG1vYmlsZSA9ICF0YWJsZXQgJiYgL1teLV1tb2JpL2kudGVzdCh1YSlcbiAgICAgICwgcmVzdWx0XG5cbiAgICBpZiAoL29wZXJhfG9wci9pLnRlc3QodWEpKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdPcGVyYSdcbiAgICAgICwgb3BlcmE6IHRcbiAgICAgICwgdmVyc2lvbjogdmVyc2lvbklkZW50aWZpZXIgfHwgZ2V0Rmlyc3RNYXRjaCgvKD86b3BlcmF8b3ByKVtcXHNcXC9dKFxcZCsoXFwuXFxkKyk/KS9pKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICgvd2luZG93cyBwaG9uZS9pLnRlc3QodWEpKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdXaW5kb3dzIFBob25lJ1xuICAgICAgLCB3aW5kb3dzcGhvbmU6IHRcbiAgICAgIH1cbiAgICAgIGlmIChlZGdlVmVyc2lvbikge1xuICAgICAgICByZXN1bHQubXNlZGdlID0gdFxuICAgICAgICByZXN1bHQudmVyc2lvbiA9IGVkZ2VWZXJzaW9uXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVzdWx0Lm1zaWUgPSB0XG4gICAgICAgIHJlc3VsdC52ZXJzaW9uID0gZ2V0Rmlyc3RNYXRjaCgvaWVtb2JpbGVcXC8oXFxkKyhcXC5cXGQrKT8pL2kpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKC9tc2llfHRyaWRlbnQvaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnSW50ZXJuZXQgRXhwbG9yZXInXG4gICAgICAsIG1zaWU6IHRcbiAgICAgICwgdmVyc2lvbjogZ2V0Rmlyc3RNYXRjaCgvKD86bXNpZSB8cnY6KShcXGQrKFxcLlxcZCspPykvaSlcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoL2Nocm9tZS4rPyBlZGdlL2kudGVzdCh1YSkpIHtcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgbmFtZTogJ01pY3Jvc29mdCBFZGdlJ1xuICAgICAgLCBtc2VkZ2U6IHRcbiAgICAgICwgdmVyc2lvbjogZWRnZVZlcnNpb25cbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoL2Nocm9tZXxjcmlvc3xjcm1vL2kudGVzdCh1YSkpIHtcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgbmFtZTogJ0Nocm9tZSdcbiAgICAgICwgY2hyb21lOiB0XG4gICAgICAsIHZlcnNpb246IGdldEZpcnN0TWF0Y2goLyg/OmNocm9tZXxjcmlvc3xjcm1vKVxcLyhcXGQrKFxcLlxcZCspPykvaSlcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoaW9zZGV2aWNlKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWUgOiBpb3NkZXZpY2UgPT0gJ2lwaG9uZScgPyAnaVBob25lJyA6IGlvc2RldmljZSA9PSAnaXBhZCcgPyAnaVBhZCcgOiAnaVBvZCdcbiAgICAgIH1cbiAgICAgIC8vIFdURjogdmVyc2lvbiBpcyBub3QgcGFydCBvZiB1c2VyIGFnZW50IGluIHdlYiBhcHBzXG4gICAgICBpZiAodmVyc2lvbklkZW50aWZpZXIpIHtcbiAgICAgICAgcmVzdWx0LnZlcnNpb24gPSB2ZXJzaW9uSWRlbnRpZmllclxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICgvc2FpbGZpc2gvaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnU2FpbGZpc2gnXG4gICAgICAsIHNhaWxmaXNoOiB0XG4gICAgICAsIHZlcnNpb246IGdldEZpcnN0TWF0Y2goL3NhaWxmaXNoXFxzP2Jyb3dzZXJcXC8oXFxkKyhcXC5cXGQrKT8pL2kpXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKC9zZWFtb25rZXlcXC8vaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnU2VhTW9ua2V5J1xuICAgICAgLCBzZWFtb25rZXk6IHRcbiAgICAgICwgdmVyc2lvbjogZ2V0Rmlyc3RNYXRjaCgvc2VhbW9ua2V5XFwvKFxcZCsoXFwuXFxkKyk/KS9pKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICgvZmlyZWZveHxpY2V3ZWFzZWwvaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnRmlyZWZveCdcbiAgICAgICwgZmlyZWZveDogdFxuICAgICAgLCB2ZXJzaW9uOiBnZXRGaXJzdE1hdGNoKC8oPzpmaXJlZm94fGljZXdlYXNlbClbIFxcL10oXFxkKyhcXC5cXGQrKT8pL2kpXG4gICAgICB9XG4gICAgICBpZiAoL1xcKChtb2JpbGV8dGFibGV0KTtbXlxcKV0qcnY6W1xcZFxcLl0rXFwpL2kudGVzdCh1YSkpIHtcbiAgICAgICAgcmVzdWx0LmZpcmVmb3hvcyA9IHRcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoL3NpbGsvaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0gIHtcbiAgICAgICAgbmFtZTogJ0FtYXpvbiBTaWxrJ1xuICAgICAgLCBzaWxrOiB0XG4gICAgICAsIHZlcnNpb24gOiBnZXRGaXJzdE1hdGNoKC9zaWxrXFwvKFxcZCsoXFwuXFxkKyk/KS9pKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChhbmRyb2lkKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdBbmRyb2lkJ1xuICAgICAgLCB2ZXJzaW9uOiB2ZXJzaW9uSWRlbnRpZmllclxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICgvcGhhbnRvbS9pLnRlc3QodWEpKSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6ICdQaGFudG9tSlMnXG4gICAgICAsIHBoYW50b206IHRcbiAgICAgICwgdmVyc2lvbjogZ2V0Rmlyc3RNYXRjaCgvcGhhbnRvbWpzXFwvKFxcZCsoXFwuXFxkKyk/KS9pKVxuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICgvYmxhY2tiZXJyeXxcXGJiYlxcZCsvaS50ZXN0KHVhKSB8fCAvcmltXFxzdGFibGV0L2kudGVzdCh1YSkpIHtcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgbmFtZTogJ0JsYWNrQmVycnknXG4gICAgICAsIGJsYWNrYmVycnk6IHRcbiAgICAgICwgdmVyc2lvbjogdmVyc2lvbklkZW50aWZpZXIgfHwgZ2V0Rmlyc3RNYXRjaCgvYmxhY2tiZXJyeVtcXGRdK1xcLyhcXGQrKFxcLlxcZCspPykvaSlcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoLyh3ZWJ8aHB3KW9zL2kudGVzdCh1YSkpIHtcbiAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgbmFtZTogJ1dlYk9TJ1xuICAgICAgLCB3ZWJvczogdFxuICAgICAgLCB2ZXJzaW9uOiB2ZXJzaW9uSWRlbnRpZmllciB8fCBnZXRGaXJzdE1hdGNoKC93KD86ZWIpP29zYnJvd3NlclxcLyhcXGQrKFxcLlxcZCspPykvaSlcbiAgICAgIH07XG4gICAgICAvdG91Y2hwYWRcXC8vaS50ZXN0KHVhKSAmJiAocmVzdWx0LnRvdWNocGFkID0gdClcbiAgICB9XG4gICAgZWxzZSBpZiAoL2JhZGEvaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnQmFkYSdcbiAgICAgICwgYmFkYTogdFxuICAgICAgLCB2ZXJzaW9uOiBnZXRGaXJzdE1hdGNoKC9kb2xmaW5cXC8oXFxkKyhcXC5cXGQrKT8pL2kpXG4gICAgICB9O1xuICAgIH1cbiAgICBlbHNlIGlmICgvdGl6ZW4vaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnVGl6ZW4nXG4gICAgICAsIHRpemVuOiB0XG4gICAgICAsIHZlcnNpb246IGdldEZpcnN0TWF0Y2goLyg/OnRpemVuXFxzPyk/YnJvd3NlclxcLyhcXGQrKFxcLlxcZCspPykvaSkgfHwgdmVyc2lvbklkZW50aWZpZXJcbiAgICAgIH07XG4gICAgfVxuICAgIGVsc2UgaWYgKC9zYWZhcmkvaS50ZXN0KHVhKSkge1xuICAgICAgcmVzdWx0ID0ge1xuICAgICAgICBuYW1lOiAnU2FmYXJpJ1xuICAgICAgLCBzYWZhcmk6IHRcbiAgICAgICwgdmVyc2lvbjogdmVyc2lvbklkZW50aWZpZXJcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXN1bHQgPSB7XG4gICAgICAgIG5hbWU6IGdldEZpcnN0TWF0Y2goL14oLiopXFwvKC4qKSAvKSxcbiAgICAgICAgdmVyc2lvbjogZ2V0U2Vjb25kTWF0Y2goL14oLiopXFwvKC4qKSAvKVxuICAgICB9O1xuICAgfVxuXG4gICAgLy8gc2V0IHdlYmtpdCBvciBnZWNrbyBmbGFnIGZvciBicm93c2VycyBiYXNlZCBvbiB0aGVzZSBlbmdpbmVzXG4gICAgaWYgKCFyZXN1bHQubXNlZGdlICYmIC8oYXBwbGUpP3dlYmtpdC9pLnRlc3QodWEpKSB7XG4gICAgICByZXN1bHQubmFtZSA9IHJlc3VsdC5uYW1lIHx8IFwiV2Via2l0XCJcbiAgICAgIHJlc3VsdC53ZWJraXQgPSB0XG4gICAgICBpZiAoIXJlc3VsdC52ZXJzaW9uICYmIHZlcnNpb25JZGVudGlmaWVyKSB7XG4gICAgICAgIHJlc3VsdC52ZXJzaW9uID0gdmVyc2lvbklkZW50aWZpZXJcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCFyZXN1bHQub3BlcmEgJiYgL2dlY2tvXFwvL2kudGVzdCh1YSkpIHtcbiAgICAgIHJlc3VsdC5uYW1lID0gcmVzdWx0Lm5hbWUgfHwgXCJHZWNrb1wiXG4gICAgICByZXN1bHQuZ2Vja28gPSB0XG4gICAgICByZXN1bHQudmVyc2lvbiA9IHJlc3VsdC52ZXJzaW9uIHx8IGdldEZpcnN0TWF0Y2goL2dlY2tvXFwvKFxcZCsoXFwuXFxkKyk/KS9pKVxuICAgIH1cblxuICAgIC8vIHNldCBPUyBmbGFncyBmb3IgcGxhdGZvcm1zIHRoYXQgaGF2ZSBtdWx0aXBsZSBicm93c2Vyc1xuICAgIGlmICghcmVzdWx0Lm1zZWRnZSAmJiAoYW5kcm9pZCB8fCByZXN1bHQuc2lsaykpIHtcbiAgICAgIHJlc3VsdC5hbmRyb2lkID0gdFxuICAgIH0gZWxzZSBpZiAoaW9zZGV2aWNlKSB7XG4gICAgICByZXN1bHRbaW9zZGV2aWNlXSA9IHRcbiAgICAgIHJlc3VsdC5pb3MgPSB0XG4gICAgfVxuXG4gICAgLy8gT1MgdmVyc2lvbiBleHRyYWN0aW9uXG4gICAgdmFyIG9zVmVyc2lvbiA9ICcnO1xuICAgIGlmIChyZXN1bHQud2luZG93c3Bob25lKSB7XG4gICAgICBvc1ZlcnNpb24gPSBnZXRGaXJzdE1hdGNoKC93aW5kb3dzIHBob25lICg/Om9zKT9cXHM/KFxcZCsoXFwuXFxkKykqKS9pKTtcbiAgICB9IGVsc2UgaWYgKGlvc2RldmljZSkge1xuICAgICAgb3NWZXJzaW9uID0gZ2V0Rmlyc3RNYXRjaCgvb3MgKFxcZCsoW19cXHNdXFxkKykqKSBsaWtlIG1hYyBvcyB4L2kpO1xuICAgICAgb3NWZXJzaW9uID0gb3NWZXJzaW9uLnJlcGxhY2UoL1tfXFxzXS9nLCAnLicpO1xuICAgIH0gZWxzZSBpZiAoYW5kcm9pZCkge1xuICAgICAgb3NWZXJzaW9uID0gZ2V0Rmlyc3RNYXRjaCgvYW5kcm9pZFsgXFwvLV0oXFxkKyhcXC5cXGQrKSopL2kpO1xuICAgIH0gZWxzZSBpZiAocmVzdWx0LndlYm9zKSB7XG4gICAgICBvc1ZlcnNpb24gPSBnZXRGaXJzdE1hdGNoKC8oPzp3ZWJ8aHB3KW9zXFwvKFxcZCsoXFwuXFxkKykqKS9pKTtcbiAgICB9IGVsc2UgaWYgKHJlc3VsdC5ibGFja2JlcnJ5KSB7XG4gICAgICBvc1ZlcnNpb24gPSBnZXRGaXJzdE1hdGNoKC9yaW1cXHN0YWJsZXRcXHNvc1xccyhcXGQrKFxcLlxcZCspKikvaSk7XG4gICAgfSBlbHNlIGlmIChyZXN1bHQuYmFkYSkge1xuICAgICAgb3NWZXJzaW9uID0gZ2V0Rmlyc3RNYXRjaCgvYmFkYVxcLyhcXGQrKFxcLlxcZCspKikvaSk7XG4gICAgfSBlbHNlIGlmIChyZXN1bHQudGl6ZW4pIHtcbiAgICAgIG9zVmVyc2lvbiA9IGdldEZpcnN0TWF0Y2goL3RpemVuW1xcL1xcc10oXFxkKyhcXC5cXGQrKSopL2kpO1xuICAgIH1cbiAgICBpZiAob3NWZXJzaW9uKSB7XG4gICAgICByZXN1bHQub3N2ZXJzaW9uID0gb3NWZXJzaW9uO1xuICAgIH1cblxuICAgIC8vIGRldmljZSB0eXBlIGV4dHJhY3Rpb25cbiAgICB2YXIgb3NNYWpvclZlcnNpb24gPSBvc1ZlcnNpb24uc3BsaXQoJy4nKVswXTtcbiAgICBpZiAodGFibGV0IHx8IGlvc2RldmljZSA9PSAnaXBhZCcgfHwgKGFuZHJvaWQgJiYgKG9zTWFqb3JWZXJzaW9uID09IDMgfHwgKG9zTWFqb3JWZXJzaW9uID09IDQgJiYgIW1vYmlsZSkpKSB8fCByZXN1bHQuc2lsaykge1xuICAgICAgcmVzdWx0LnRhYmxldCA9IHRcbiAgICB9IGVsc2UgaWYgKG1vYmlsZSB8fCBpb3NkZXZpY2UgPT0gJ2lwaG9uZScgfHwgaW9zZGV2aWNlID09ICdpcG9kJyB8fCBhbmRyb2lkIHx8IHJlc3VsdC5ibGFja2JlcnJ5IHx8IHJlc3VsdC53ZWJvcyB8fCByZXN1bHQuYmFkYSkge1xuICAgICAgcmVzdWx0Lm1vYmlsZSA9IHRcbiAgICB9XG5cbiAgICAvLyBHcmFkZWQgQnJvd3NlciBTdXBwb3J0XG4gICAgLy8gaHR0cDovL2RldmVsb3Blci55YWhvby5jb20veXVpL2FydGljbGVzL2dic1xuICAgIGlmIChyZXN1bHQubXNlZGdlIHx8XG4gICAgICAgIChyZXN1bHQubXNpZSAmJiByZXN1bHQudmVyc2lvbiA+PSAxMCkgfHxcbiAgICAgICAgKHJlc3VsdC5jaHJvbWUgJiYgcmVzdWx0LnZlcnNpb24gPj0gMjApIHx8XG4gICAgICAgIChyZXN1bHQuZmlyZWZveCAmJiByZXN1bHQudmVyc2lvbiA+PSAyMC4wKSB8fFxuICAgICAgICAocmVzdWx0LnNhZmFyaSAmJiByZXN1bHQudmVyc2lvbiA+PSA2KSB8fFxuICAgICAgICAocmVzdWx0Lm9wZXJhICYmIHJlc3VsdC52ZXJzaW9uID49IDEwLjApIHx8XG4gICAgICAgIChyZXN1bHQuaW9zICYmIHJlc3VsdC5vc3ZlcnNpb24gJiYgcmVzdWx0Lm9zdmVyc2lvbi5zcGxpdChcIi5cIilbMF0gPj0gNikgfHxcbiAgICAgICAgKHJlc3VsdC5ibGFja2JlcnJ5ICYmIHJlc3VsdC52ZXJzaW9uID49IDEwLjEpXG4gICAgICAgICkge1xuICAgICAgcmVzdWx0LmEgPSB0O1xuICAgIH1cbiAgICBlbHNlIGlmICgocmVzdWx0Lm1zaWUgJiYgcmVzdWx0LnZlcnNpb24gPCAxMCkgfHxcbiAgICAgICAgKHJlc3VsdC5jaHJvbWUgJiYgcmVzdWx0LnZlcnNpb24gPCAyMCkgfHxcbiAgICAgICAgKHJlc3VsdC5maXJlZm94ICYmIHJlc3VsdC52ZXJzaW9uIDwgMjAuMCkgfHxcbiAgICAgICAgKHJlc3VsdC5zYWZhcmkgJiYgcmVzdWx0LnZlcnNpb24gPCA2KSB8fFxuICAgICAgICAocmVzdWx0Lm9wZXJhICYmIHJlc3VsdC52ZXJzaW9uIDwgMTAuMCkgfHxcbiAgICAgICAgKHJlc3VsdC5pb3MgJiYgcmVzdWx0Lm9zdmVyc2lvbiAmJiByZXN1bHQub3N2ZXJzaW9uLnNwbGl0KFwiLlwiKVswXSA8IDYpXG4gICAgICAgICkge1xuICAgICAgcmVzdWx0LmMgPSB0XG4gICAgfSBlbHNlIHJlc3VsdC54ID0gdFxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgdmFyIGJvd3NlciA9IGRldGVjdCh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyA/IG5hdmlnYXRvci51c2VyQWdlbnQgOiAnJylcblxuICBib3dzZXIudGVzdCA9IGZ1bmN0aW9uIChicm93c2VyTGlzdCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnJvd3Nlckxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBicm93c2VySXRlbSA9IGJyb3dzZXJMaXN0W2ldO1xuICAgICAgaWYgKHR5cGVvZiBicm93c2VySXRlbT09PSAnc3RyaW5nJykge1xuICAgICAgICBpZiAoYnJvd3Nlckl0ZW0gaW4gYm93c2VyKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLypcbiAgICogU2V0IG91ciBkZXRlY3QgbWV0aG9kIHRvIHRoZSBtYWluIGJvd3NlciBvYmplY3Qgc28gd2UgY2FuXG4gICAqIHJldXNlIGl0IHRvIHRlc3Qgb3RoZXIgdXNlciBhZ2VudHMuXG4gICAqIFRoaXMgaXMgbmVlZGVkIHRvIGltcGxlbWVudCBmdXR1cmUgdGVzdHMuXG4gICAqL1xuICBib3dzZXIuX2RldGVjdCA9IGRldGVjdDtcblxuICByZXR1cm4gYm93c2VyXG59KTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ub2RlX21vZHVsZXMvYm93c2VyL2Jvd3Nlci5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ib3dzZXJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5fdXNlVHlwZWRBcnJheXNgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgVXNlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiAoY29tcGF0aWJsZSBkb3duIHRvIElFNilcbiAqL1xuQnVmZmVyLl91c2VUeXBlZEFycmF5cyA9IChmdW5jdGlvbiAoKSB7XG4gIC8vIERldGVjdCBpZiBicm93c2VyIHN1cHBvcnRzIFR5cGVkIEFycmF5cy4gU3VwcG9ydGVkIGJyb3dzZXJzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssXG4gIC8vIENocm9tZSA3KywgU2FmYXJpIDUuMSssIE9wZXJhIDExLjYrLCBpT1MgNC4yKy4gSWYgdGhlIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBhZGRpbmdcbiAgLy8gcHJvcGVydGllcyB0byBgVWludDhBcnJheWAgaW5zdGFuY2VzLCB0aGVuIHRoYXQncyB0aGUgc2FtZSBhcyBubyBgVWludDhBcnJheWAgc3VwcG9ydFxuICAvLyBiZWNhdXNlIHdlIG5lZWQgdG8gYmUgYWJsZSB0byBhZGQgYWxsIHRoZSBub2RlIEJ1ZmZlciBBUEkgbWV0aG9kcy4gVGhpcyBpcyBhbiBpc3N1ZVxuICAvLyBpbiBGaXJlZm94IDQtMjkuIE5vdyBmaXhlZDogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4XG4gIHRyeSB7XG4gICAgdmFyIGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcigwKVxuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheShidWYpXG4gICAgYXJyLmZvbyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH1cbiAgICByZXR1cm4gNDIgPT09IGFyci5mb28oKSAmJlxuICAgICAgICB0eXBlb2YgYXJyLnN1YmFycmF5ID09PSAnZnVuY3Rpb24nIC8vIENocm9tZSA5LTEwIGxhY2sgYHN1YmFycmF5YFxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn0pKClcblxuLyoqXG4gKiBDbGFzczogQnVmZmVyXG4gKiA9PT09PT09PT09PT09XG4gKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBhcmUgYXVnbWVudGVkXG4gKiB3aXRoIGZ1bmN0aW9uIHByb3BlcnRpZXMgZm9yIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBBUEkgZnVuY3Rpb25zLiBXZSB1c2VcbiAqIGBVaW50OEFycmF5YCBzbyB0aGF0IHNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0IHJldHVybnNcbiAqIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIEJ5IGF1Z21lbnRpbmcgdGhlIGluc3RhbmNlcywgd2UgY2FuIGF2b2lkIG1vZGlmeWluZyB0aGUgYFVpbnQ4QXJyYXlgXG4gKiBwcm90b3R5cGUuXG4gKi9cbmZ1bmN0aW9uIEJ1ZmZlciAoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSlcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKVxuXG4gIHZhciB0eXBlID0gdHlwZW9mIHN1YmplY3RcblxuICAvLyBXb3JrYXJvdW5kOiBub2RlJ3MgYmFzZTY0IGltcGxlbWVudGF0aW9uIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBzdHJpbmdzXG4gIC8vIHdoaWxlIGJhc2U2NC1qcyBkb2VzIG5vdC5cbiAgaWYgKGVuY29kaW5nID09PSAnYmFzZTY0JyAmJiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHN1YmplY3QgPSBzdHJpbmd0cmltKHN1YmplY3QpXG4gICAgd2hpbGUgKHN1YmplY3QubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgICAgc3ViamVjdCA9IHN1YmplY3QgKyAnPSdcbiAgICB9XG4gIH1cblxuICAvLyBGaW5kIHRoZSBsZW5ndGhcbiAgdmFyIGxlbmd0aFxuICBpZiAodHlwZSA9PT0gJ251bWJlcicpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKVxuICAgIGxlbmd0aCA9IEJ1ZmZlci5ieXRlTGVuZ3RoKHN1YmplY3QsIGVuY29kaW5nKVxuICBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0JylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdC5sZW5ndGgpIC8vIGFzc3VtZSB0aGF0IG9iamVjdCBpcyBhcnJheS1saWtlXG4gIGVsc2VcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG5lZWRzIHRvIGJlIGEgbnVtYmVyLCBhcnJheSBvciBzdHJpbmcuJylcblxuICB2YXIgYnVmXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgLy8gUHJlZmVycmVkOiBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIGJ1ZiA9IEJ1ZmZlci5fYXVnbWVudChuZXcgVWludDhBcnJheShsZW5ndGgpKVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gVEhJUyBpbnN0YW5jZSBvZiBCdWZmZXIgKGNyZWF0ZWQgYnkgYG5ld2ApXG4gICAgYnVmID0gdGhpc1xuICAgIGJ1Zi5sZW5ndGggPSBsZW5ndGhcbiAgICBidWYuX2lzQnVmZmVyID0gdHJ1ZVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgdHlwZW9mIHN1YmplY3QuYnl0ZUxlbmd0aCA9PT0gJ251bWJlcicpIHtcbiAgICAvLyBTcGVlZCBvcHRpbWl6YXRpb24gLS0gdXNlIHNldCBpZiB3ZSdyZSBjb3B5aW5nIGZyb20gYSB0eXBlZCBhcnJheVxuICAgIGJ1Zi5fc2V0KHN1YmplY3QpXG4gIH0gZWxzZSBpZiAoaXNBcnJheWlzaChzdWJqZWN0KSkge1xuICAgIC8vIFRyZWF0IGFycmF5LWlzaCBvYmplY3RzIGFzIGEgYnl0ZSBhcnJheVxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSlcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdC5yZWFkVUludDgoaSlcbiAgICAgIGVsc2VcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdFtpXVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgIGJ1Zi53cml0ZShzdWJqZWN0LCAwLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiAhQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiAhbm9aZXJvKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBidWZbaV0gPSAwXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBTVEFUSUMgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIChiKSB7XG4gIHJldHVybiAhIShiICE9PSBudWxsICYmIGIgIT09IHVuZGVmaW5lZCAmJiBiLl9pc0J1ZmZlcilcbn1cblxuQnVmZmVyLmJ5dGVMZW5ndGggPSBmdW5jdGlvbiAoc3RyLCBlbmNvZGluZykge1xuICB2YXIgcmV0XG4gIHN0ciA9IHN0ciArICcnXG4gIHN3aXRjaCAoZW5jb2RpbmcgfHwgJ3V0ZjgnKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggLyAyXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IHV0ZjhUb0J5dGVzKHN0cikubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBiYXNlNjRUb0J5dGVzKHN0cikubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoICogMlxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiAobGlzdCwgdG90YWxMZW5ndGgpIHtcbiAgYXNzZXJ0KGlzQXJyYXkobGlzdCksICdVc2FnZTogQnVmZmVyLmNvbmNhdChsaXN0LCBbdG90YWxMZW5ndGhdKVxcbicgK1xuICAgICAgJ2xpc3Qgc2hvdWxkIGJlIGFuIEFycmF5LicpXG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoMClcbiAgfSBlbHNlIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBsaXN0WzBdXG4gIH1cblxuICB2YXIgaVxuICBpZiAodHlwZW9mIHRvdGFsTGVuZ3RoICE9PSAnbnVtYmVyJykge1xuICAgIHRvdGFsTGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB0b3RhbExlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWYgPSBuZXcgQnVmZmVyKHRvdGFsTGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXVxuICAgIGl0ZW0uY29weShidWYsIHBvcylcbiAgICBwb3MgKz0gaXRlbS5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmXG59XG5cbi8vIEJVRkZFUiBJTlNUQU5DRSBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBfaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuICBhc3NlcnQoc3RyTGVuICUgMiA9PT0gMCwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBieXRlID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGFzc2VydCghaXNOYU4oYnl0ZSksICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IGJ5dGVcbiAgfVxuICBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9IGkgKiAyXG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIF91dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfYmluYXJ5V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gX2FzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBfYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIFN1cHBvcnQgYm90aCAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpXG4gIC8vIGFuZCB0aGUgbGVnYWN5IChzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBpZiAoIWlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIH0gZWxzZSB7ICAvLyBsZWdhY3lcbiAgICB2YXIgc3dhcCA9IGVuY29kaW5nXG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBvZmZzZXQgPSBsZW5ndGhcbiAgICBsZW5ndGggPSBzd2FwXG4gIH1cblxuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuXG4gIHZhciByZXRcbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBfaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gX3V0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSBfYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0ID0gX2JpbmFyeVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBfYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IF91dGYxNmxlV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuXG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuICBzdGFydCA9IE51bWJlcihzdGFydCkgfHwgMFxuICBlbmQgPSAoZW5kICE9PSB1bmRlZmluZWQpXG4gICAgPyBOdW1iZXIoZW5kKVxuICAgIDogZW5kID0gc2VsZi5sZW5ndGhcblxuICAvLyBGYXN0cGF0aCBlbXB0eSBzdHJpbmdzXG4gIGlmIChlbmQgPT09IHN0YXJ0KVxuICAgIHJldHVybiAnJ1xuXG4gIHZhciByZXRcbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBfaGV4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gX3V0ZjhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSBfYXNjaWlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0ID0gX2JpbmFyeVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBfYmFzZTY0U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IF91dGYxNmxlU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAodGFyZ2V0LCB0YXJnZXRfc3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNvdXJjZSA9IHRoaXNcblxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAoIXRhcmdldF9zdGFydCkgdGFyZ2V0X3N0YXJ0ID0gMFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHNvdXJjZS5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ3NvdXJjZUVuZCA8IHNvdXJjZVN0YXJ0JylcbiAgYXNzZXJ0KHRhcmdldF9zdGFydCA+PSAwICYmIHRhcmdldF9zdGFydCA8IHRhcmdldC5sZW5ndGgsXG4gICAgICAndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgc291cmNlLmxlbmd0aCwgJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoZW5kID49IDAgJiYgZW5kIDw9IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKVxuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0IDwgZW5kIC0gc3RhcnQpXG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCArIHN0YXJ0XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG5cbiAgaWYgKGxlbiA8IDEwMCB8fCAhQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICB0YXJnZXRbaSArIHRhcmdldF9zdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQuX3NldCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksIHRhcmdldF9zdGFydClcbiAgfVxufVxuXG5mdW5jdGlvbiBfYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIF91dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmVzID0gJydcbiAgdmFyIHRtcCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIGlmIChidWZbaV0gPD0gMHg3Rikge1xuICAgICAgcmVzICs9IGRlY29kZVV0ZjhDaGFyKHRtcCkgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgICAgIHRtcCA9ICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIHRtcCArPSAnJScgKyBidWZbaV0udG9TdHJpbmcoMTYpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcyArIGRlY29kZVV0ZjhDaGFyKHRtcClcbn1cblxuZnVuY3Rpb24gX2FzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKVxuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBfYmluYXJ5U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICByZXR1cm4gX2FzY2lpU2xpY2UoYnVmLCBzdGFydCwgZW5kKVxufVxuXG5mdW5jdGlvbiBfaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpKzFdICogMjU2KVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IGNsYW1wKHN0YXJ0LCBsZW4sIDApXG4gIGVuZCA9IGNsYW1wKGVuZCwgbGVuLCBsZW4pXG5cbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICByZXR1cm4gQnVmZmVyLl9hdWdtZW50KHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZCkpXG4gIH0gZWxzZSB7XG4gICAgdmFyIHNsaWNlTGVuID0gZW5kIC0gc3RhcnRcbiAgICB2YXIgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkLCB0cnVlKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47IGkrKykge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICAgIHJldHVybiBuZXdCdWZcbiAgfVxufVxuXG4vLyBgZ2V0YCB3aWxsIGJlIHJlbW92ZWQgaW4gTm9kZSAwLjEzK1xuQnVmZmVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAob2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuZ2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy5yZWFkVUludDgob2Zmc2V0KVxufVxuXG4vLyBgc2V0YCB3aWxsIGJlIHJlbW92ZWQgaW4gTm9kZSAwLjEzK1xuQnVmZmVyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAodiwgb2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuc2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy53cml0ZVVJbnQ4KHYsIG9mZnNldClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XVxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gIH0gZWxzZSB7XG4gICAgdmFsID0gYnVmW29mZnNldF0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMl0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICAgIHZhbCB8PSBidWZbb2Zmc2V0XVxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsID0gdmFsICsgKGJ1ZltvZmZzZXQgKyAzXSA8PCAyNCA+Pj4gMClcbiAgfSBlbHNlIHtcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAxXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAyXSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDNdXG4gICAgdmFsID0gdmFsICsgKGJ1ZltvZmZzZXRdIDw8IDI0ID4+PiAwKVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHZhciBuZWcgPSB0aGlzW29mZnNldF0gJiAweDgwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDE2KGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZiAtIHZhbCArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQzMihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwMDAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmZmZmZiAtIHZhbCArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRGbG9hdCAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gaWVlZTc1NC5yZWFkKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZERvdWJsZSAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gaWVlZTc1NC5yZWFkKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmYpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKSByZXR1cm5cblxuICB0aGlzW29mZnNldF0gPSB2YWx1ZVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDIpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlICYgKDB4ZmYgPDwgKDggKiAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSkpKSA+Pj5cbiAgICAgICAgICAgIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpICogOFxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCA0KTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSA+Pj4gKGxpdHRsZUVuZGlhbiA/IGkgOiAzIC0gaSkgKiA4KSAmIDB4ZmZcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZiwgLTB4ODApXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIHRoaXMud3JpdGVVSW50OCh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydClcbiAgZWxzZVxuICAgIHRoaXMud3JpdGVVSW50OCgweGZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmYsIC0weDgwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MTYoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgMHhmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQzMihidWYsIDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGZpbGwodmFsdWUsIHN0YXJ0PTAsIGVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gKHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gIGlmICghdmFsdWUpIHZhbHVlID0gMFxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQpIGVuZCA9IHRoaXMubGVuZ3RoXG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IHZhbHVlLmNoYXJDb2RlQXQoMClcbiAgfVxuXG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSksICd2YWx1ZSBpcyBub3QgYSBudW1iZXInKVxuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnZW5kIDwgc3RhcnQnKVxuXG4gIC8vIEZpbGwgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCB0aGlzLmxlbmd0aCwgJ3N0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoZW5kID49IDAgJiYgZW5kIDw9IHRoaXMubGVuZ3RoLCAnZW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgdGhpc1tpXSA9IHZhbHVlXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgb3V0ID0gW11cbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBvdXRbaV0gPSB0b0hleCh0aGlzW2ldKVxuICAgIGlmIChpID09PSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTKSB7XG4gICAgICBvdXRbaSArIDFdID0gJy4uLidcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgb3V0LmpvaW4oJyAnKSArICc+J1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgYEFycmF5QnVmZmVyYCB3aXRoIHRoZSAqY29waWVkKiBtZW1vcnkgb2YgdGhlIGJ1ZmZlciBpbnN0YW5jZS5cbiAqIEFkZGVkIGluIE5vZGUgMC4xMi4gT25seSBhdmFpbGFibGUgaW4gYnJvd3NlcnMgdGhhdCBzdXBwb3J0IEFycmF5QnVmZmVyLlxuICovXG5CdWZmZXIucHJvdG90eXBlLnRvQXJyYXlCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgICAgcmV0dXJuIChuZXcgQnVmZmVyKHRoaXMpKS5idWZmZXJcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJ1ZiA9IG5ldyBVaW50OEFycmF5KHRoaXMubGVuZ3RoKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGJ1Zi5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSlcbiAgICAgICAgYnVmW2ldID0gdGhpc1tpXVxuICAgICAgcmV0dXJuIGJ1Zi5idWZmZXJcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdCdWZmZXIudG9BcnJheUJ1ZmZlciBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlcicpXG4gIH1cbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBzdHJpbmd0cmltIChzdHIpIHtcbiAgaWYgKHN0ci50cmltKSByZXR1cm4gc3RyLnRyaW0oKVxuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKVxufVxuXG52YXIgQlAgPSBCdWZmZXIucHJvdG90eXBlXG5cbi8qKlxuICogQXVnbWVudCBhIFVpbnQ4QXJyYXkgKmluc3RhbmNlKiAobm90IHRoZSBVaW50OEFycmF5IGNsYXNzISkgd2l0aCBCdWZmZXIgbWV0aG9kc1xuICovXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGFyci5faXNCdWZmZXIgPSB0cnVlXG5cbiAgLy8gc2F2ZSByZWZlcmVuY2UgdG8gb3JpZ2luYWwgVWludDhBcnJheSBnZXQvc2V0IG1ldGhvZHMgYmVmb3JlIG92ZXJ3cml0aW5nXG4gIGFyci5fZ2V0ID0gYXJyLmdldFxuICBhcnIuX3NldCA9IGFyci5zZXRcblxuICAvLyBkZXByZWNhdGVkLCB3aWxsIGJlIHJlbW92ZWQgaW4gbm9kZSAwLjEzK1xuICBhcnIuZ2V0ID0gQlAuZ2V0XG4gIGFyci5zZXQgPSBCUC5zZXRcblxuICBhcnIud3JpdGUgPSBCUC53cml0ZVxuICBhcnIudG9TdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9Mb2NhbGVTdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9KU09OID0gQlAudG9KU09OXG4gIGFyci5jb3B5ID0gQlAuY29weVxuICBhcnIuc2xpY2UgPSBCUC5zbGljZVxuICBhcnIucmVhZFVJbnQ4ID0gQlAucmVhZFVJbnQ4XG4gIGFyci5yZWFkVUludDE2TEUgPSBCUC5yZWFkVUludDE2TEVcbiAgYXJyLnJlYWRVSW50MTZCRSA9IEJQLnJlYWRVSW50MTZCRVxuICBhcnIucmVhZFVJbnQzMkxFID0gQlAucmVhZFVJbnQzMkxFXG4gIGFyci5yZWFkVUludDMyQkUgPSBCUC5yZWFkVUludDMyQkVcbiAgYXJyLnJlYWRJbnQ4ID0gQlAucmVhZEludDhcbiAgYXJyLnJlYWRJbnQxNkxFID0gQlAucmVhZEludDE2TEVcbiAgYXJyLnJlYWRJbnQxNkJFID0gQlAucmVhZEludDE2QkVcbiAgYXJyLnJlYWRJbnQzMkxFID0gQlAucmVhZEludDMyTEVcbiAgYXJyLnJlYWRJbnQzMkJFID0gQlAucmVhZEludDMyQkVcbiAgYXJyLnJlYWRGbG9hdExFID0gQlAucmVhZEZsb2F0TEVcbiAgYXJyLnJlYWRGbG9hdEJFID0gQlAucmVhZEZsb2F0QkVcbiAgYXJyLnJlYWREb3VibGVMRSA9IEJQLnJlYWREb3VibGVMRVxuICBhcnIucmVhZERvdWJsZUJFID0gQlAucmVhZERvdWJsZUJFXG4gIGFyci53cml0ZVVJbnQ4ID0gQlAud3JpdGVVSW50OFxuICBhcnIud3JpdGVVSW50MTZMRSA9IEJQLndyaXRlVUludDE2TEVcbiAgYXJyLndyaXRlVUludDE2QkUgPSBCUC53cml0ZVVJbnQxNkJFXG4gIGFyci53cml0ZVVJbnQzMkxFID0gQlAud3JpdGVVSW50MzJMRVxuICBhcnIud3JpdGVVSW50MzJCRSA9IEJQLndyaXRlVUludDMyQkVcbiAgYXJyLndyaXRlSW50OCA9IEJQLndyaXRlSW50OFxuICBhcnIud3JpdGVJbnQxNkxFID0gQlAud3JpdGVJbnQxNkxFXG4gIGFyci53cml0ZUludDE2QkUgPSBCUC53cml0ZUludDE2QkVcbiAgYXJyLndyaXRlSW50MzJMRSA9IEJQLndyaXRlSW50MzJMRVxuICBhcnIud3JpdGVJbnQzMkJFID0gQlAud3JpdGVJbnQzMkJFXG4gIGFyci53cml0ZUZsb2F0TEUgPSBCUC53cml0ZUZsb2F0TEVcbiAgYXJyLndyaXRlRmxvYXRCRSA9IEJQLndyaXRlRmxvYXRCRVxuICBhcnIud3JpdGVEb3VibGVMRSA9IEJQLndyaXRlRG91YmxlTEVcbiAgYXJyLndyaXRlRG91YmxlQkUgPSBCUC53cml0ZURvdWJsZUJFXG4gIGFyci5maWxsID0gQlAuZmlsbFxuICBhcnIuaW5zcGVjdCA9IEJQLmluc3BlY3RcbiAgYXJyLnRvQXJyYXlCdWZmZXIgPSBCUC50b0FycmF5QnVmZmVyXG5cbiAgcmV0dXJuIGFyclxufVxuXG4vLyBzbGljZShzdGFydCwgZW5kKVxuZnVuY3Rpb24gY2xhbXAgKGluZGV4LCBsZW4sIGRlZmF1bHRWYWx1ZSkge1xuICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykgcmV0dXJuIGRlZmF1bHRWYWx1ZVxuICBpbmRleCA9IH5+aW5kZXg7ICAvLyBDb2VyY2UgdG8gaW50ZWdlci5cbiAgaWYgKGluZGV4ID49IGxlbikgcmV0dXJuIGxlblxuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIGluZGV4XG4gIGluZGV4ICs9IGxlblxuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIGluZGV4XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGNvZXJjZSAobGVuZ3RoKSB7XG4gIC8vIENvZXJjZSBsZW5ndGggdG8gYSBudW1iZXIgKHBvc3NpYmx5IE5hTiksIHJvdW5kIHVwXG4gIC8vIGluIGNhc2UgaXQncyBmcmFjdGlvbmFsIChlLmcuIDEyMy40NTYpIHRoZW4gZG8gYVxuICAvLyBkb3VibGUgbmVnYXRlIHRvIGNvZXJjZSBhIE5hTiB0byAwLiBFYXN5LCByaWdodD9cbiAgbGVuZ3RoID0gfn5NYXRoLmNlaWwoK2xlbmd0aClcbiAgcmV0dXJuIGxlbmd0aCA8IDAgPyAwIDogbGVuZ3RoXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkgKHN1YmplY3QpIHtcbiAgcmV0dXJuIChBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChzdWJqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzdWJqZWN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xuICB9KShzdWJqZWN0KVxufVxuXG5mdW5jdGlvbiBpc0FycmF5aXNoIChzdWJqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5KHN1YmplY3QpIHx8IEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSB8fFxuICAgICAgc3ViamVjdCAmJiB0eXBlb2Ygc3ViamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgIHR5cGVvZiBzdWJqZWN0Lmxlbmd0aCA9PT0gJ251bWJlcidcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIHZhciBiID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBpZiAoYiA8PSAweDdGKVxuICAgICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkpXG4gICAgZWxzZSB7XG4gICAgICB2YXIgc3RhcnQgPSBpXG4gICAgICBpZiAoYiA+PSAweEQ4MDAgJiYgYiA8PSAweERGRkYpIGkrK1xuICAgICAgdmFyIGggPSBlbmNvZGVVUklDb21wb25lbnQoc3RyLnNsaWNlKHN0YXJ0LCBpKzEpKS5zdWJzdHIoMSkuc3BsaXQoJyUnKVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBoLmxlbmd0aDsgaisrKVxuICAgICAgICBieXRlQXJyYXkucHVzaChwYXJzZUludChoW2pdLCAxNikpXG4gICAgfVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KHN0cilcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBwb3NcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSlcbiAgICAgIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gZGVjb2RlVXRmOENoYXIgKHN0cikge1xuICB0cnkge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgweEZGRkQpIC8vIFVURiA4IGludmFsaWQgY2hhclxuICB9XG59XG5cbi8qXG4gKiBXZSBoYXZlIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSB2YWx1ZSBpcyBhIHZhbGlkIGludGVnZXIuIFRoaXMgbWVhbnMgdGhhdCBpdFxuICogaXMgbm9uLW5lZ2F0aXZlLiBJdCBoYXMgbm8gZnJhY3Rpb25hbCBjb21wb25lbnQgYW5kIHRoYXQgaXQgZG9lcyBub3RcbiAqIGV4Y2VlZCB0aGUgbWF4aW11bSBhbGxvd2VkIHZhbHVlLlxuICovXG5mdW5jdGlvbiB2ZXJpZnVpbnQgKHZhbHVlLCBtYXgpIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlID49IDAsICdzcGVjaWZpZWQgYSBuZWdhdGl2ZSB2YWx1ZSBmb3Igd3JpdGluZyBhbiB1bnNpZ25lZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBpcyBsYXJnZXIgdGhhbiBtYXhpbXVtIHZhbHVlIGZvciB0eXBlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gdmVyaWZzaW50ICh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gdmVyaWZJRUVFNzU0ICh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJylcbn1cblxuZnVuY3Rpb24gYXNzZXJ0ICh0ZXN0LCBtZXNzYWdlKSB7XG4gIGlmICghdGVzdCkgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UgfHwgJ0ZhaWxlZCBhc3NlcnRpb24nKVxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvYnVmZmVyXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBuQml0cyA9IC03XG4gIHZhciBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDBcbiAgdmFyIGQgPSBpc0xFID8gLTEgOiAxXG4gIHZhciBzID0gYnVmZmVyW29mZnNldCArIGldXG5cbiAgaSArPSBkXG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgcyA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gZUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gZSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IG0gKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApXG4gIHZhciBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSlcbiAgdmFyIGQgPSBpc0xFID8gMSA6IC0xXG4gIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwXG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSlcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMFxuICAgIGUgPSBlTWF4XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpXG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tXG4gICAgICBjICo9IDJcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpXG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrXG4gICAgICBjIC89IDJcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwXG4gICAgICBlID0gZU1heFxuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAodmFsdWUgKiBjIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvaWVlZTc1NFwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxuICogSGVscGVycy5cbiAqL1xuXG52YXIgcyA9IDEwMDA7XG52YXIgbSA9IHMgKiA2MDtcbnZhciBoID0gbSAqIDYwO1xudmFyIGQgPSBoICogMjQ7XG52YXIgeSA9IGQgKiAzNjUuMjU7XG5cbi8qKlxuICogUGFyc2Ugb3IgZm9ybWF0IHRoZSBnaXZlbiBgdmFsYC5cbiAqXG4gKiBPcHRpb25zOlxuICpcbiAqICAtIGBsb25nYCB2ZXJib3NlIGZvcm1hdHRpbmcgW2ZhbHNlXVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gdmFsXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAdGhyb3dzIHtFcnJvcn0gdGhyb3cgYW4gZXJyb3IgaWYgdmFsIGlzIG5vdCBhIG5vbi1lbXB0eSBzdHJpbmcgb3IgYSBudW1iZXJcbiAqIEByZXR1cm4ge1N0cmluZ3xOdW1iZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odmFsLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWw7XG4gIGlmICh0eXBlID09PSAnc3RyaW5nJyAmJiB2YWwubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBwYXJzZSh2YWwpO1xuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdudW1iZXInICYmIGlzTmFOKHZhbCkgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMubG9uZyA/IGZtdExvbmcodmFsKSA6IGZtdFNob3J0KHZhbCk7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgICd2YWwgaXMgbm90IGEgbm9uLWVtcHR5IHN0cmluZyBvciBhIHZhbGlkIG51bWJlci4gdmFsPScgK1xuICAgICAgSlNPTi5zdHJpbmdpZnkodmFsKVxuICApO1xufTtcblxuLyoqXG4gKiBQYXJzZSB0aGUgZ2l2ZW4gYHN0cmAgYW5kIHJldHVybiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2Uoc3RyKSB7XG4gIHN0ciA9IFN0cmluZyhzdHIpO1xuICBpZiAoc3RyLmxlbmd0aCA+IDEwMCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbWF0Y2ggPSAvXigoPzpcXGQrKT9cXC4/XFxkKykgKihtaWxsaXNlY29uZHM/fG1zZWNzP3xtc3xzZWNvbmRzP3xzZWNzP3xzfG1pbnV0ZXM/fG1pbnM/fG18aG91cnM/fGhycz98aHxkYXlzP3xkfHllYXJzP3x5cnM/fHkpPyQvaS5leGVjKFxuICAgIHN0clxuICApO1xuICBpZiAoIW1hdGNoKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuID0gcGFyc2VGbG9hdChtYXRjaFsxXSk7XG4gIHZhciB0eXBlID0gKG1hdGNoWzJdIHx8ICdtcycpLnRvTG93ZXJDYXNlKCk7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3llYXJzJzpcbiAgICBjYXNlICd5ZWFyJzpcbiAgICBjYXNlICd5cnMnOlxuICAgIGNhc2UgJ3lyJzpcbiAgICBjYXNlICd5JzpcbiAgICAgIHJldHVybiBuICogeTtcbiAgICBjYXNlICdkYXlzJzpcbiAgICBjYXNlICdkYXknOlxuICAgIGNhc2UgJ2QnOlxuICAgICAgcmV0dXJuIG4gKiBkO1xuICAgIGNhc2UgJ2hvdXJzJzpcbiAgICBjYXNlICdob3VyJzpcbiAgICBjYXNlICdocnMnOlxuICAgIGNhc2UgJ2hyJzpcbiAgICBjYXNlICdoJzpcbiAgICAgIHJldHVybiBuICogaDtcbiAgICBjYXNlICdtaW51dGVzJzpcbiAgICBjYXNlICdtaW51dGUnOlxuICAgIGNhc2UgJ21pbnMnOlxuICAgIGNhc2UgJ21pbic6XG4gICAgY2FzZSAnbSc6XG4gICAgICByZXR1cm4gbiAqIG07XG4gICAgY2FzZSAnc2Vjb25kcyc6XG4gICAgY2FzZSAnc2Vjb25kJzpcbiAgICBjYXNlICdzZWNzJzpcbiAgICBjYXNlICdzZWMnOlxuICAgIGNhc2UgJ3MnOlxuICAgICAgcmV0dXJuIG4gKiBzO1xuICAgIGNhc2UgJ21pbGxpc2Vjb25kcyc6XG4gICAgY2FzZSAnbWlsbGlzZWNvbmQnOlxuICAgIGNhc2UgJ21zZWNzJzpcbiAgICBjYXNlICdtc2VjJzpcbiAgICBjYXNlICdtcyc6XG4gICAgICByZXR1cm4gbjtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG4vKipcbiAqIFNob3J0IGZvcm1hdCBmb3IgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGZtdFNob3J0KG1zKSB7XG4gIGlmIChtcyA+PSBkKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBkKSArICdkJztcbiAgfVxuICBpZiAobXMgPj0gaCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gaCkgKyAnaCc7XG4gIH1cbiAgaWYgKG1zID49IG0pIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChtcyAvIG0pICsgJ20nO1xuICB9XG4gIGlmIChtcyA+PSBzKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobXMgLyBzKSArICdzJztcbiAgfVxuICByZXR1cm4gbXMgKyAnbXMnO1xufVxuXG4vKipcbiAqIExvbmcgZm9ybWF0IGZvciBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZm10TG9uZyhtcykge1xuICByZXR1cm4gcGx1cmFsKG1zLCBkLCAnZGF5JykgfHxcbiAgICBwbHVyYWwobXMsIGgsICdob3VyJykgfHxcbiAgICBwbHVyYWwobXMsIG0sICdtaW51dGUnKSB8fFxuICAgIHBsdXJhbChtcywgcywgJ3NlY29uZCcpIHx8XG4gICAgbXMgKyAnIG1zJztcbn1cblxuLyoqXG4gKiBQbHVyYWxpemF0aW9uIGhlbHBlci5cbiAqL1xuXG5mdW5jdGlvbiBwbHVyYWwobXMsIG4sIG5hbWUpIHtcbiAgaWYgKG1zIDwgbikge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAobXMgPCBuICogMS41KSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IobXMgLyBuKSArICcgJyArIG5hbWU7XG4gIH1cbiAgcmV0dXJuIE1hdGguY2VpbChtcyAvIG4pICsgJyAnICsgbmFtZSArICdzJztcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ub2RlX21vZHVsZXMvbXMvaW5kZXguanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvbXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcbiAqIERlcGVuZGVuY2llcy5cbiAqL1xudmFyIFV0aWwgPSByZXF1aXJlKCcuL2xpYi91dGlsJyk7XG52YXIgS2V5cyA9IHJlcXVpcmUoJy4vbGliL2tleXMnKTtcbnZhciBLYmRVdGlsID0gcmVxdWlyZSgnLi9saWIva2JkdXRpbCcpO1xudmFyIElucHV0ID0gcmVxdWlyZSgnLi9saWIvaW5wdXQnKTtcbnZhciBXZWJzb2NrID0gcmVxdWlyZSgnLi9saWIvd2Vic29jaycpO1xudmFyIEJhc2U2NCA9IHJlcXVpcmUoJy4vbGliL2Jhc2U2NCcpO1xudmFyIERFUyA9IHJlcXVpcmUoJy4vbGliL2RlcycpO1xudmFyIFRJTkYgPSByZXF1aXJlKCcuL2xpYi90aW5mJyk7XG52YXIgRGlzcGxheSA9IHJlcXVpcmUoJy4vbGliL2Rpc3BsYXknKTtcbnZhciBSRkIgPSByZXF1aXJlKCcuL2xpYi9yZmInKTtcblxuXG5cbnZhciBub1ZOQyA9IHtcblx0VXRpbDogVXRpbCxcblx0S2V5czogS2V5cyxcblx0S2JkVXRpbDogS2JkVXRpbCxcblx0SW5wdXQ6IElucHV0LFxuXHRXZWJzb2NrOiBXZWJzb2NrLFxuXHRCYXNlNjQ6IEJhc2U2NCxcblx0REVTOiBERVMsXG5cdFRJTkY6IFRJTkYsXG5cdERpc3BsYXk6IERpc3BsYXksXG5cdFJGQjogUkZCXG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gbm9WTkM7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vbm9kZV9tb2R1bGVzL25vdm5jLW5vZGUvaW5kZXguanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvbm92bmMtbm9kZVwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qIFRoaXMgU291cmNlIENvZGUgRm9ybSBpcyBzdWJqZWN0IHRvIHRoZSB0ZXJtcyBvZiB0aGUgTW96aWxsYSBQdWJsaWNcbiAqIExpY2Vuc2UsIHYuIDIuMC4gSWYgYSBjb3B5IG9mIHRoZSBNUEwgd2FzIG5vdCBkaXN0cmlidXRlZCB3aXRoIHRoaXNcbiAqIGZpbGUsIFlvdSBjYW4gb2J0YWluIG9uZSBhdCBodHRwOi8vbW96aWxsYS5vcmcvTVBMLzIuMC8uICovXG5cbi8qKlxuICogRGVwZW5kZW5jaWVzLlxuICovXG52YXIgZGVidWdlcnJvciA9IHJlcXVpcmUoJ2RlYnVnJykoJ25vVk5DOkVSUk9SOkJhc2U2NCcpO1xuZGVidWdlcnJvci5sb2cgPSBjb25zb2xlLndhcm4uYmluZChjb25zb2xlKTtcblxuXG4vKipcbiAqIExvY2FsIHZhcmlhYmxlcy5cbiAqL1xudmFyIHRvQmFzZTY0VGFibGUgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz0nLnNwbGl0KCcnKTtcbnZhciBiYXNlNjRQYWQgPSAnPSc7XG52YXIgdG9CaW5hcnlUYWJsZSA9IFtcblx0LTEsLTEsLTEsLTEsIC0xLC0xLC0xLC0xLCAtMSwtMSwtMSwtMSwgLTEsLTEsLTEsLTEsXG5cdC0xLC0xLC0xLC0xLCAtMSwtMSwtMSwtMSwgLTEsLTEsLTEsLTEsIC0xLC0xLC0xLC0xLFxuXHQtMSwtMSwtMSwtMSwgLTEsLTEsLTEsLTEsIC0xLC0xLC0xLDYyLCAtMSwtMSwtMSw2Myxcblx0NTIsNTMsNTQsNTUsIDU2LDU3LDU4LDU5LCA2MCw2MSwtMSwtMSwgLTEsIDAsLTEsLTEsXG5cdC0xLCAwLCAxLCAyLCAgMywgNCwgNSwgNiwgIDcsIDgsIDksMTAsIDExLDEyLDEzLDE0LFxuXHQxNSwxNiwxNywxOCwgMTksMjAsMjEsMjIsIDIzLDI0LDI1LC0xLCAtMSwtMSwtMSwtMSxcblx0LTEsMjYsMjcsMjgsIDI5LDMwLDMxLDMyLCAzMywzNCwzNSwzNiwgMzcsMzgsMzksNDAsXG5cdDQxLDQyLDQzLDQ0LCA0NSw0Niw0Nyw0OCwgNDksNTAsNTEsLTEsIC0xLC0xLC0xLC0xXG5dO1xuXG5cbi8qKlxuICogRXhwb3NlIHRoZSBCYXNlNjQgT2JqZWN0LlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0ZW5jb2RlOiBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdHZhciByZXN1bHQgPSAnJztcblx0XHR2YXIgbGVuZ3RoID0gZGF0YS5sZW5ndGg7XG5cdFx0dmFyIGxlbmd0aHBhZCA9IChsZW5ndGggJSAzKTtcblxuXHRcdC8vIENvbnZlcnQgZXZlcnkgdGhyZWUgYnl0ZXMgdG8gNCBhc2NpaSBjaGFyYWN0ZXJzLlxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgKGxlbmd0aCAtIDIpOyBpICs9IDMpIHtcblx0XHRcdHJlc3VsdCArPSB0b0Jhc2U2NFRhYmxlW2RhdGFbaV0gPj4gMl07XG5cdFx0XHRyZXN1bHQgKz0gdG9CYXNlNjRUYWJsZVsoKGRhdGFbaV0gJiAweDAzKSA8PCA0KSArIChkYXRhW2kgKyAxXSA+PiA0KV07XG5cdFx0XHRyZXN1bHQgKz0gdG9CYXNlNjRUYWJsZVsoKGRhdGFbaSArIDFdICYgMHgwZikgPDwgMikgKyAoZGF0YVtpICsgMl0gPj4gNildO1xuXHRcdFx0cmVzdWx0ICs9IHRvQmFzZTY0VGFibGVbZGF0YVtpICsgMl0gJiAweDNmXTtcblx0XHR9XG5cblx0XHQvLyBDb252ZXJ0IHRoZSByZW1haW5pbmcgMSBvciAyIGJ5dGVzLCBwYWQgb3V0IHRvIDQgY2hhcmFjdGVycy5cblx0XHR2YXIgaiA9IDA7XG5cdFx0aWYgKGxlbmd0aHBhZCA9PT0gMikge1xuXHRcdFx0aiA9IGxlbmd0aCAtIGxlbmd0aHBhZDtcblx0XHRcdHJlc3VsdCArPSB0b0Jhc2U2NFRhYmxlW2RhdGFbal0gPj4gMl07XG5cdFx0XHRyZXN1bHQgKz0gdG9CYXNlNjRUYWJsZVsoKGRhdGFbal0gJiAweDAzKSA8PCA0KSArIChkYXRhW2ogKyAxXSA+PiA0KV07XG5cdFx0XHRyZXN1bHQgKz0gdG9CYXNlNjRUYWJsZVsoZGF0YVtqICsgMV0gJiAweDBmKSA8PCAyXTtcblx0XHRcdHJlc3VsdCArPSB0b0Jhc2U2NFRhYmxlWzY0XTtcblx0XHR9IGVsc2UgaWYgKGxlbmd0aHBhZCA9PT0gMSkge1xuXHRcdFx0aiA9IGxlbmd0aCAtIGxlbmd0aHBhZDtcblx0XHRcdHJlc3VsdCArPSB0b0Jhc2U2NFRhYmxlW2RhdGFbal0gPj4gMl07XG5cdFx0XHRyZXN1bHQgKz0gdG9CYXNlNjRUYWJsZVsoZGF0YVtqXSAmIDB4MDMpIDw8IDRdO1xuXHRcdFx0cmVzdWx0ICs9IHRvQmFzZTY0VGFibGVbNjRdO1xuXHRcdFx0cmVzdWx0ICs9IHRvQmFzZTY0VGFibGVbNjRdO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0sXG5cblx0ZGVjb2RlOiBmdW5jdGlvbiAoZGF0YSwgb2Zmc2V0KSB7XG5cdFx0b2Zmc2V0ID0gdHlwZW9mKG9mZnNldCkgIT09ICd1bmRlZmluZWQnID8gb2Zmc2V0IDogMDtcblx0XHR2YXIgcmVzdWx0LCByZXN1bHRfbGVuZ3RoO1xuXHRcdHZhciBsZWZ0Yml0cyA9IDA7IC8vIG51bWJlciBvZiBiaXRzIGRlY29kZWQsIGJ1dCB5ZXQgdG8gYmUgYXBwZW5kZWRcblx0XHR2YXIgbGVmdGRhdGEgPSAwOyAvLyBiaXRzIGRlY29kZWQsIGJ1dCB5ZXQgdG8gYmUgYXBwZW5kZWRcblx0XHR2YXIgZGF0YV9sZW5ndGggPSBkYXRhLmluZGV4T2YoJz0nKSAtIG9mZnNldDtcblxuXHRcdGlmIChkYXRhX2xlbmd0aCA8IDApIHsgZGF0YV9sZW5ndGggPSBkYXRhLmxlbmd0aCAtIG9mZnNldDsgfVxuXG5cdFx0LyogRXZlcnkgZm91ciBjaGFyYWN0ZXJzIGlzIDMgcmVzdWx0aW5nIG51bWJlcnMgKi9cblx0XHRyZXN1bHRfbGVuZ3RoID0gKGRhdGFfbGVuZ3RoID4+IDIpICogMyArIE1hdGguZmxvb3IoKGRhdGFfbGVuZ3RoICUgNCkgLyAxLjUpO1xuXHRcdHJlc3VsdCA9IG5ldyBBcnJheShyZXN1bHRfbGVuZ3RoKTtcblxuXHRcdC8vIENvbnZlcnQgb25lIGJ5IG9uZS5cblx0XHRmb3IgKHZhciBpZHggPSAwLCBpID0gb2Zmc2V0OyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGMgPSB0b0JpbmFyeVRhYmxlW2RhdGEuY2hhckNvZGVBdChpKSAmIDB4N2ZdO1xuXHRcdFx0dmFyIHBhZGRpbmcgPSAoZGF0YS5jaGFyQXQoaSkgPT09IGJhc2U2NFBhZCk7XG5cdFx0XHQvLyBTa2lwIGlsbGVnYWwgY2hhcmFjdGVycyBhbmQgd2hpdGVzcGFjZVxuXHRcdFx0aWYgKGMgPT09IC0xKSB7XG5cdFx0XHRcdGRlYnVnZXJyb3IoJ2RlY29kZSgpIHwgaWxsZWdhbCBjaGFyYWN0ZXIgY29kZSAnICsgZGF0YS5jaGFyQ29kZUF0KGkpICsgJyBhdCBwb3NpdGlvbiAnICsgaSk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDb2xsZWN0IGRhdGEgaW50byBsZWZ0ZGF0YSwgdXBkYXRlIGJpdGNvdW50XG5cdFx0XHRsZWZ0ZGF0YSA9IChsZWZ0ZGF0YSA8PCA2KSB8IGM7XG5cdFx0XHRsZWZ0Yml0cyArPSA2O1xuXG5cdFx0XHQvLyBJZiB3ZSBoYXZlIDggb3IgbW9yZSBiaXRzLCBhcHBlbmQgOCBiaXRzIHRvIHRoZSByZXN1bHRcblx0XHRcdGlmIChsZWZ0Yml0cyA+PSA4KSB7XG5cdFx0XHRcdGxlZnRiaXRzIC09IDg7XG5cdFx0XHRcdC8vIEFwcGVuZCBpZiBub3QgcGFkZGluZy5cblx0XHRcdFx0aWYgKCFwYWRkaW5nKSB7XG5cdFx0XHRcdFx0cmVzdWx0W2lkeCsrXSA9IChsZWZ0ZGF0YSA+PiBsZWZ0Yml0cykgJiAweGZmO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxlZnRkYXRhICY9ICgxIDw8IGxlZnRiaXRzKSAtIDE7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gSWYgdGhlcmUgYXJlIGFueSBiaXRzIGxlZnQsIHRoZSBiYXNlNjQgc3RyaW5nIHdhcyBjb3JydXB0ZWRcblx0XHRpZiAobGVmdGJpdHMpIHtcblx0XHRcdGRlYnVnZXJyb3IoJ2RlY29kZSgpIHwgY29ycnVwdGVkIEJhc2U2NCBzdHJpbmcnKTtcblx0XHRcdHZhciBlcnIgPSBuZXcgRXJyb3IoJ0NvcnJ1cHRlZCBCYXNlNjQgc3RyaW5nJyk7XG5cdFx0XHRlcnIubmFtZSA9ICdCYXNlNjQtRXJyb3InO1xuXHRcdFx0dGhyb3cgZXJyO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vbm9kZV9tb2R1bGVzL25vdm5jLW5vZGUvbGliL2Jhc2U2NC5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ub3ZuYy1ub2RlL2xpYlwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qXG4gKiBQb3J0ZWQgZnJvbSBGbGFzaGxpZ2h0IFZOQyBBY3Rpb25TY3JpcHQgaW1wbGVtZW50YXRpb246XG4gKiAgICAgaHR0cDovL3d3dy53aXpoZWxwLmNvbS9mbGFzaGxpZ2h0LXZuYy9cbiAqXG4gKiBGdWxsIGF0dHJpYnV0aW9uIGZvbGxvd3M6XG4gKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICpcbiAqIFRoaXMgREVTIGNsYXNzIGhhcyBiZWVuIGV4dHJhY3RlZCBmcm9tIHBhY2thZ2UgQWNtZS5DcnlwdG8gZm9yIHVzZSBpbiBWTkMuXG4gKiBUaGUgdW5uZWNlc3Nhcnkgb2RkIHBhcml0eSBjb2RlIGhhcyBiZWVuIHJlbW92ZWQuXG4gKlxuICogVGhlc2UgY2hhbmdlcyBhcmU6XG4gKiAgQ29weXJpZ2h0IChDKSAxOTk5IEFUJlQgTGFib3JhdG9yaWVzIENhbWJyaWRnZS4gIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb2Z0d2FyZSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS5cbiAqXG5cbiAqIERlc0NpcGhlciAtIHRoZSBERVMgZW5jcnlwdGlvbiBtZXRob2RcbiAqXG4gKiBUaGUgbWVhdCBvZiB0aGlzIGNvZGUgaXMgYnkgRGF2ZSBaaW1tZXJtYW4gPGR6aW1tQHdpZGdldC5jb20+LCBhbmQgaXM6XG4gKlxuICogQ29weXJpZ2h0IChjKSAxOTk2IFdpZGdldCBXb3Jrc2hvcCwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZCBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmVcbiAqIGFuZCBpdHMgZG9jdW1lbnRhdGlvbiBmb3IgTk9OLUNPTU1FUkNJQUwgb3IgQ09NTUVSQ0lBTCBwdXJwb3NlcyBhbmRcbiAqIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLCBwcm92aWRlZCB0aGF0IHRoaXMgY29weXJpZ2h0IG5vdGljZSBpcyBrZXB0XG4gKiBpbnRhY3QuXG4gKlxuICogV0lER0VUIFdPUktTSE9QIE1BS0VTIE5PIFJFUFJFU0VOVEFUSU9OUyBPUiBXQVJSQU5USUVTIEFCT1VUIFRIRSBTVUlUQUJJTElUWVxuICogT0YgVEhFIFNPRlRXQVJFLCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEXG4gKiBUTyBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQVxuICogUEFSVElDVUxBUiBQVVJQT1NFLCBPUiBOT04tSU5GUklOR0VNRU5ULiBXSURHRVQgV09SS1NIT1AgU0hBTEwgTk9UIEJFIExJQUJMRVxuICogRk9SIEFOWSBEQU1BR0VTIFNVRkZFUkVEIEJZIExJQ0VOU0VFIEFTIEEgUkVTVUxUIE9GIFVTSU5HLCBNT0RJRllJTkcgT1JcbiAqIERJU1RSSUJVVElORyBUSElTIFNPRlRXQVJFIE9SIElUUyBERVJJVkFUSVZFUy5cbiAqXG4gKiBUSElTIFNPRlRXQVJFIElTIE5PVCBERVNJR05FRCBPUiBJTlRFTkRFRCBGT1IgVVNFIE9SIFJFU0FMRSBBUyBPTi1MSU5FXG4gKiBDT05UUk9MIEVRVUlQTUVOVCBJTiBIQVpBUkRPVVMgRU5WSVJPTk1FTlRTIFJFUVVJUklORyBGQUlMLVNBRkVcbiAqIFBFUkZPUk1BTkNFLCBTVUNIIEFTIElOIFRIRSBPUEVSQVRJT04gT0YgTlVDTEVBUiBGQUNJTElUSUVTLCBBSVJDUkFGVFxuICogTkFWSUdBVElPTiBPUiBDT01NVU5JQ0FUSU9OIFNZU1RFTVMsIEFJUiBUUkFGRklDIENPTlRST0wsIERJUkVDVCBMSUZFXG4gKiBTVVBQT1JUIE1BQ0hJTkVTLCBPUiBXRUFQT05TIFNZU1RFTVMsIElOIFdISUNIIFRIRSBGQUlMVVJFIE9GIFRIRVxuICogU09GVFdBUkUgQ09VTEQgTEVBRCBESVJFQ1RMWSBUTyBERUFUSCwgUEVSU09OQUwgSU5KVVJZLCBPUiBTRVZFUkVcbiAqIFBIWVNJQ0FMIE9SIEVOVklST05NRU5UQUwgREFNQUdFIChcIkhJR0ggUklTSyBBQ1RJVklUSUVTXCIpLiAgV0lER0VUIFdPUktTSE9QXG4gKiBTUEVDSUZJQ0FMTFkgRElTQ0xBSU1TIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVFkgT0YgRklUTkVTUyBGT1JcbiAqIEhJR0ggUklTSyBBQ1RJVklUSUVTLlxuICpcbiAqXG4gKiBUaGUgcmVzdCBpczpcbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDE5OTYgYnkgSmVmIFBvc2thbnplciA8amVmQGFjbWUuY29tPi4gIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0XG4gKiBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnNcbiAqIGFyZSBtZXQ6XG4gKiAxLiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxuICogICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICogMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAqICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGVcbiAqICAgIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4gKlxuICogVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQVVUSE9SIEFORCBDT05UUklCVVRPUlMgYGBBUyBJUycnIEFORFxuICogQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFXG4gKiBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRVxuICogQVJFIERJU0NMQUlNRUQuICBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEVcbiAqIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCwgRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMXG4gKiBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EU1xuICogT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pXG4gKiBIT1dFVkVSIENBVVNFRCBBTkQgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQ09OVFJBQ1QsIFNUUklDVFxuICogTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWVxuICogT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRlxuICogU1VDSCBEQU1BR0UuXG4gKlxuICogVmlzaXQgdGhlIEFDTUUgTGFicyBKYXZhIHBhZ2UgZm9yIHVwLXRvLWRhdGUgdmVyc2lvbnMgb2YgdGhpcyBhbmQgb3RoZXJcbiAqIGZpbmUgSmF2YSB1dGlsaXRpZXM6IGh0dHA6Ly93d3cuYWNtZS5jb20vamF2YS9cbiAqL1xuXG5cbi8vIFRhYmxlcywgcGVybXV0YXRpb25zLCBTLWJveGVzLCBldGMuXG52YXIgUEMyID0gWzEzLDE2LDEwLDIzLCAwLCA0LCAyLDI3LDE0LCA1LDIwLCA5LDIyLDE4LDExLCAzLFxuXHRcdCAgIDI1LCA3LDE1LCA2LDI2LDE5LDEyLCAxLDQwLDUxLDMwLDM2LDQ2LDU0LDI5LDM5LFxuXHRcdCAgIDUwLDQ0LDMyLDQ3LDQzLDQ4LDM4LDU1LDMzLDUyLDQ1LDQxLDQ5LDM1LDI4LDMxIF0sXG5cdHRvdHJvdCA9IFsgMSwgMiwgNCwgNiwgOCwxMCwxMiwxNCwxNSwxNywxOSwyMSwyMywyNSwyNywyOF0sXG5cdHogPSAweDAsIGEsYixjLGQsZSxmLCBTUDEsU1AyLFNQMyxTUDQsU1A1LFNQNixTUDcsU1A4LFxuXHRrZXlzID0gW107XG5cbmE9MTw8MTY7IGI9MTw8MjQ7IGM9YXxiOyBkPTE8PDI7IGU9MTw8MTA7IGY9ZHxlO1xuU1AxID0gW2N8ZSx6fHosYXx6LGN8ZixjfGQsYXxmLHp8ZCxhfHosenxlLGN8ZSxjfGYsenxlLGJ8ZixjfGQsYnx6LHp8ZCxcblx0ICAgenxmLGJ8ZSxifGUsYXxlLGF8ZSxjfHosY3x6LGJ8ZixhfGQsYnxkLGJ8ZCxhfGQsenx6LHp8ZixhfGYsYnx6LFxuXHQgICBhfHosY3xmLHp8ZCxjfHosY3xlLGJ8eixifHosenxlLGN8ZCxhfHosYXxlLGJ8ZCx6fGUsenxkLGJ8ZixhfGYsXG5cdCAgIGN8ZixhfGQsY3x6LGJ8ZixifGQsenxmLGF8ZixjfGUsenxmLGJ8ZSxifGUsenx6LGF8ZCxhfGUsenx6LGN8ZF07XG5cbmE9MTw8MjA7IGI9MTw8MzE7IGM9YXxiOyBkPTE8PDU7IGU9MTw8MTU7IGY9ZHxlO1xuU1AyID0gW2N8ZixifGUsenxlLGF8ZixhfHosenxkLGN8ZCxifGYsYnxkLGN8ZixjfGUsYnx6LGJ8ZSxhfHosenxkLGN8ZCxcblx0ICAgYXxlLGF8ZCxifGYsenx6LGJ8eix6fGUsYXxmLGN8eixhfGQsYnxkLHp8eixhfGUsenxmLGN8ZSxjfHosenxmLFxuXHQgICB6fHosYXxmLGN8ZCxhfHosYnxmLGN8eixjfGUsenxlLGN8eixifGUsenxkLGN8ZixhfGYsenxkLHp8ZSxifHosXG5cdCAgIHp8ZixjfGUsYXx6LGJ8ZCxhfGQsYnxmLGJ8ZCxhfGQsYXxlLHp8eixifGUsenxmLGJ8eixjfGQsY3xmLGF8ZV07XG5cbmE9MTw8MTc7IGI9MTw8Mjc7IGM9YXxiOyBkPTE8PDM7IGU9MTw8OTsgZj1kfGU7XG5TUDMgPSBbenxmLGN8ZSx6fHosY3xkLGJ8ZSx6fHosYXxmLGJ8ZSxhfGQsYnxkLGJ8ZCxhfHosY3xmLGF8ZCxjfHosenxmLFxuXHQgICBifHosenxkLGN8ZSx6fGUsYXxlLGN8eixjfGQsYXxmLGJ8ZixhfGUsYXx6LGJ8Zix6fGQsY3xmLHp8ZSxifHosXG5cdCAgIGN8ZSxifHosYXxkLHp8ZixhfHosY3xlLGJ8ZSx6fHosenxlLGF8ZCxjfGYsYnxlLGJ8ZCx6fGUsenx6LGN8ZCxcblx0ICAgYnxmLGF8eixifHosY3xmLHp8ZCxhfGYsYXxlLGJ8ZCxjfHosYnxmLHp8ZixjfHosYXxmLHp8ZCxjfGQsYXxlXTtcblxuYT0xPDwxMzsgYj0xPDwyMzsgYz1hfGI7IGQ9MTw8MDsgZT0xPDw3OyBmPWR8ZTtcblNQNCA9IFtjfGQsYXxmLGF8Zix6fGUsY3xlLGJ8ZixifGQsYXxkLHp8eixjfHosY3x6LGN8Zix6fGYsenx6LGJ8ZSxifGQsXG5cdCAgIHp8ZCxhfHosYnx6LGN8ZCx6fGUsYnx6LGF8ZCxhfGUsYnxmLHp8ZCxhfGUsYnxlLGF8eixjfGUsY3xmLHp8Zixcblx0ICAgYnxlLGJ8ZCxjfHosY3xmLHp8Zix6fHosenx6LGN8eixhfGUsYnxlLGJ8Zix6fGQsY3xkLGF8ZixhfGYsenxlLFxuXHQgICBjfGYsenxmLHp8ZCxhfHosYnxkLGF8ZCxjfGUsYnxmLGF8ZCxhfGUsYnx6LGN8ZCx6fGUsYnx6LGF8eixjfGVdO1xuXG5hPTE8PDI1OyBiPTE8PDMwOyBjPWF8YjsgZD0xPDw4OyBlPTE8PDE5OyBmPWR8ZTtcblNQNSA9IFt6fGQsYXxmLGF8ZSxjfGQsenxlLHp8ZCxifHosYXxlLGJ8Zix6fGUsYXxkLGJ8ZixjfGQsY3xlLHp8ZixifHosXG5cdCAgIGF8eixifGUsYnxlLHp8eixifGQsY3xmLGN8ZixhfGQsY3xlLGJ8ZCx6fHosY3x6LGF8ZixhfHosY3x6LHp8Zixcblx0ICAgenxlLGN8ZCx6fGQsYXx6LGJ8eixhfGUsY3xkLGJ8ZixhfGQsYnx6LGN8ZSxhfGYsYnxmLHp8ZCxhfHosY3xlLFxuXHQgICBjfGYsenxmLGN8eixjfGYsYXxlLHp8eixifGUsY3x6LHp8ZixhfGQsYnxkLHp8ZSx6fHosYnxlLGF8ZixifGRdO1xuXG5hPTE8PDIyOyBiPTE8PDI5OyBjPWF8YjsgZD0xPDw0OyBlPTE8PDE0OyBmPWR8ZTtcblNQNiA9IFtifGQsY3x6LHp8ZSxjfGYsY3x6LHp8ZCxjfGYsYXx6LGJ8ZSxhfGYsYXx6LGJ8ZCxhfGQsYnxlLGJ8eix6fGYsXG5cdCAgIHp8eixhfGQsYnxmLHp8ZSxhfGUsYnxmLHp8ZCxjfGQsY3xkLHp8eixhfGYsY3xlLHp8ZixhfGUsY3xlLGJ8eixcblx0ICAgYnxlLHp8ZCxjfGQsYXxlLGN8ZixhfHosenxmLGJ8ZCxhfHosYnxlLGJ8eix6fGYsYnxkLGN8ZixhfGUsY3x6LFxuXHQgICBhfGYsY3xlLHp8eixjfGQsenxkLHp8ZSxjfHosYXxmLHp8ZSxhfGQsYnxmLHp8eixjfGUsYnx6LGF8ZCxifGZdO1xuXG5hPTE8PDIxOyBiPTE8PDI2OyBjPWF8YjsgZD0xPDwxOyBlPTE8PDExOyBmPWR8ZTtcblNQNyA9IFthfHosY3xkLGJ8Zix6fHosenxlLGJ8ZixhfGYsY3xlLGN8ZixhfHosenx6LGJ8ZCx6fGQsYnx6LGN8ZCx6fGYsXG5cdCAgIGJ8ZSxhfGYsYXxkLGJ8ZSxifGQsY3x6LGN8ZSxhfGQsY3x6LHp8ZSx6fGYsY3xmLGF8ZSx6fGQsYnx6LGF8ZSxcblx0ICAgYnx6LGF8ZSxhfHosYnxmLGJ8ZixjfGQsY3xkLHp8ZCxhfGQsYnx6LGJ8ZSxhfHosY3xlLHp8ZixhfGYsY3xlLFxuXHQgICB6fGYsYnxkLGN8ZixjfHosYXxlLHp8eix6fGQsY3xmLHp8eixhfGYsY3x6LHp8ZSxifGQsYnxlLHp8ZSxhfGRdO1xuXG5hPTE8PDE4OyBiPTE8PDI4OyBjPWF8YjsgZD0xPDw2OyBlPTE8PDEyOyBmPWR8ZTtcblNQOCA9IFtifGYsenxlLGF8eixjfGYsYnx6LGJ8Zix6fGQsYnx6LGF8ZCxjfHosY3xmLGF8ZSxjfGUsYXxmLHp8ZSx6fGQsXG5cdCAgIGN8eixifGQsYnxlLHp8ZixhfGUsYXxkLGN8ZCxjfGUsenxmLHp8eix6fHosY3xkLGJ8ZCxifGUsYXxmLGF8eixcblx0ICAgYXxmLGF8eixjfGUsenxlLHp8ZCxjfGQsenxlLGF8ZixifGUsenxkLGJ8ZCxjfHosY3xkLGJ8eixhfHosYnxmLFxuXHQgICB6fHosY3xmLGF8ZCxifGQsY3x6LGJ8ZSxifGYsenx6LGN8ZixhfGUsYXxlLHp8Zix6fGYsYXxkLGJ8eixjfGVdO1xuXG5cbi8qKlxuICogRXhwb3NlIHRoZSBERVMgZnVuY3Rpb24uXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHBhc3N3ZCkge1xuXHRzZXRLZXlzKHBhc3N3ZCk7ICAgICAgICAgICAgIC8vIFNldHVwIGtleXNcblx0cmV0dXJuIHsnZW5jcnlwdCc6IGVuY3J5cHR9OyAvLyBQdWJsaWMgaW50ZXJmYWNlXG59O1xuXG5cbi8qKlxuICogUHJpdmF0ZSBBUEkuXG4gKi9cblxuXG4vLyBTZXQgdGhlIGtleS5cbmZ1bmN0aW9uIHNldEtleXMoa2V5QmxvY2spIHtcblx0dmFyIGksIGosIGwsIG0sIG4sIG8sIHBjMW0gPSBbXSwgcGNyID0gW10sIGtuID0gW10sXG5cdFx0cmF3MCwgcmF3MSwgcmF3aSwgS25MaTtcblxuXHRmb3IgKGogPSAwLCBsID0gNTY7IGogPCA1NjsgKytqLCBsIC09IDgpIHtcblx0XHRsICs9IGwgPCAtNSA/IDY1IDogbCA8IC0zID8gMzEgOiBsIDwgLTEgPyA2MyA6IGwgPT09IDI3ID8gMzUgOiAwOyAvLyBQQzFcblx0XHRtID0gbCAmIDB4Nztcblx0XHRwYzFtW2pdID0gKChrZXlCbG9ja1tsID4+PiAzXSAmICgxPDxtKSkgIT09IDApID8gMTogMDtcblx0fVxuXG5cdGZvciAoaSA9IDA7IGkgPCAxNjsgKytpKSB7XG5cdFx0bSA9IGkgPDwgMTtcblx0XHRuID0gbSArIDE7XG5cdFx0a25bbV0gPSBrbltuXSA9IDA7XG5cdFx0Zm9yIChvID0gMjg7IG8gPCA1OTsgbyArPSAyOCkge1xuXHRcdFx0Zm9yIChqID0gbyAtIDI4OyBqIDwgbzsgKytqKSB7XG5cdFx0XHRcdGwgPSBqICsgdG90cm90W2ldO1xuXHRcdFx0XHRpZiAobCA8IG8pIHtcblx0XHRcdFx0XHRwY3Jbal0gPSBwYzFtW2xdO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBjcltqXSA9IHBjMW1bbCAtIDI4XTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRmb3IgKGogPSAwOyBqIDwgMjQ7ICsraikge1xuXHRcdFx0aWYgKHBjcltQQzJbal1dICE9PSAwKSB7XG5cdFx0XHRcdGtuW21dIHw9IDEgPDwgKDIzIC0gaik7XG5cdFx0XHR9XG5cdFx0XHRpZiAocGNyW1BDMltqICsgMjRdXSAhPT0gMCkge1xuXHRcdFx0XHRrbltuXSB8PSAxIDw8ICgyMyAtIGopO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdC8vIGNvb2tleVxuXHRmb3IgKGkgPSAwLCByYXdpID0gMCwgS25MaSA9IDA7IGkgPCAxNjsgKytpKSB7XG5cdFx0cmF3MCA9IGtuW3Jhd2krK107XG5cdFx0cmF3MSA9IGtuW3Jhd2krK107XG5cdFx0a2V5c1tLbkxpXSA9IChyYXcwICYgMHgwMGZjMDAwMCkgPDwgNjtcblx0XHRrZXlzW0tuTGldIHw9IChyYXcwICYgMHgwMDAwMGZjMCkgPDwgMTA7XG5cdFx0a2V5c1tLbkxpXSB8PSAocmF3MSAmIDB4MDBmYzAwMDApID4+PiAxMDtcblx0XHRrZXlzW0tuTGldIHw9IChyYXcxICYgMHgwMDAwMGZjMCkgPj4+IDY7XG5cdFx0KytLbkxpO1xuXHRcdGtleXNbS25MaV0gPSAocmF3MCAmIDB4MDAwM2YwMDApIDw8IDEyO1xuXHRcdGtleXNbS25MaV0gfD0gKHJhdzAgJiAweDAwMDAwMDNmKSA8PCAxNjtcblx0XHRrZXlzW0tuTGldIHw9IChyYXcxICYgMHgwMDAzZjAwMCkgPj4+IDQ7XG5cdFx0a2V5c1tLbkxpXSB8PSAocmF3MSAmIDB4MDAwMDAwM2YpO1xuXHRcdCsrS25MaTtcblx0fVxufVxuXG5cbi8vIEVuY3J5cHQgOCBieXRlcyBvZiB0ZXh0XG5mdW5jdGlvbiBlbmM4KHRleHQpIHtcblx0dmFyIGkgPSAwLCBiID0gdGV4dC5zbGljZSgpLCBmdmFsLCBrZXlzaSA9IDAsXG5cdFx0bCwgciwgeDsgLy8gbGVmdCwgcmlnaHQsIGFjY3VtdWxhdG9yXG5cblx0Ly8gU3F1YXNoIDggYnl0ZXMgdG8gMiBpbnRzXG5cdGwgPSBiW2krK108PDI0IHwgYltpKytdPDwxNiB8IGJbaSsrXTw8OCB8IGJbaSsrXTtcblx0ciA9IGJbaSsrXTw8MjQgfCBiW2krK108PDE2IHwgYltpKytdPDw4IHwgYltpKytdO1xuXG5cdHggPSAoKGwgPj4+IDQpIF4gcikgJiAweDBmMGYwZjBmO1xuXHRyIF49IHg7XG5cdGwgXj0gKHggPDwgNCk7XG5cdHggPSAoKGwgPj4+IDE2KSBeIHIpICYgMHgwMDAwZmZmZjtcblx0ciBePSB4O1xuXHRsIF49ICh4IDw8IDE2KTtcblx0eCA9ICgociA+Pj4gMikgXiBsKSAmIDB4MzMzMzMzMzM7XG5cdGwgXj0geDtcblx0ciBePSAoeCA8PCAyKTtcblx0eCA9ICgociA+Pj4gOCkgXiBsKSAmIDB4MDBmZjAwZmY7XG5cdGwgXj0geDtcblx0ciBePSAoeCA8PCA4KTtcblx0ciA9IChyIDw8IDEpIHwgKChyID4+PiAzMSkgJiAxKTtcblx0eCA9IChsIF4gcikgJiAweGFhYWFhYWFhO1xuXHRsIF49IHg7XG5cdHIgXj0geDtcblx0bCA9IChsIDw8IDEpIHwgKChsID4+PiAzMSkgJiAxKTtcblxuXHRmb3IgKGkgPSAwOyBpIDwgODsgKytpKSB7XG5cdFx0eCA9IChyIDw8IDI4KSB8IChyID4+PiA0KTtcblx0XHR4IF49IGtleXNba2V5c2krK107XG5cdFx0ZnZhbCA9ICBTUDdbeCAmIDB4M2ZdO1xuXHRcdGZ2YWwgfD0gU1A1Wyh4ID4+PiA4KSAmIDB4M2ZdO1xuXHRcdGZ2YWwgfD0gU1AzWyh4ID4+PiAxNikgJiAweDNmXTtcblx0XHRmdmFsIHw9IFNQMVsoeCA+Pj4gMjQpICYgMHgzZl07XG5cdFx0eCA9IHIgXiBrZXlzW2tleXNpKytdO1xuXHRcdGZ2YWwgfD0gU1A4W3ggJiAweDNmXTtcblx0XHRmdmFsIHw9IFNQNlsoeCA+Pj4gOCkgJiAweDNmXTtcblx0XHRmdmFsIHw9IFNQNFsoeCA+Pj4gMTYpICYgMHgzZl07XG5cdFx0ZnZhbCB8PSBTUDJbKHggPj4+IDI0KSAmIDB4M2ZdO1xuXHRcdGwgXj0gZnZhbDtcblx0XHR4ID0gKGwgPDwgMjgpIHwgKGwgPj4+IDQpO1xuXHRcdHggXj0ga2V5c1trZXlzaSsrXTtcblx0XHRmdmFsID0gIFNQN1t4ICYgMHgzZl07XG5cdFx0ZnZhbCB8PSBTUDVbKHggPj4+IDgpICYgMHgzZl07XG5cdFx0ZnZhbCB8PSBTUDNbKHggPj4+IDE2KSAmIDB4M2ZdO1xuXHRcdGZ2YWwgfD0gU1AxWyh4ID4+PiAyNCkgJiAweDNmXTtcblx0XHR4ID0gbCBeIGtleXNba2V5c2krK107XG5cdFx0ZnZhbCB8PSBTUDhbeCAmIDB4MDAwMDAwM2ZdO1xuXHRcdGZ2YWwgfD0gU1A2Wyh4ID4+PiA4KSAmIDB4M2ZdO1xuXHRcdGZ2YWwgfD0gU1A0Wyh4ID4+PiAxNikgJiAweDNmXTtcblx0XHRmdmFsIHw9IFNQMlsoeCA+Pj4gMjQpICYgMHgzZl07XG5cdFx0ciBePSBmdmFsO1xuXHR9XG5cblx0ciA9IChyIDw8IDMxKSB8IChyID4+PiAxKTtcblx0eCA9IChsIF4gcikgJiAweGFhYWFhYWFhO1xuXHRsIF49IHg7XG5cdHIgXj0geDtcblx0bCA9IChsIDw8IDMxKSB8IChsID4+PiAxKTtcblx0eCA9ICgobCA+Pj4gOCkgXiByKSAmIDB4MDBmZjAwZmY7XG5cdHIgXj0geDtcblx0bCBePSAoeCA8PCA4KTtcblx0eCA9ICgobCA+Pj4gMikgXiByKSAmIDB4MzMzMzMzMzM7XG5cdHIgXj0geDtcblx0bCBePSAoeCA8PCAyKTtcblx0eCA9ICgociA+Pj4gMTYpIF4gbCkgJiAweDAwMDBmZmZmO1xuXHRsIF49IHg7XG5cdHIgXj0gKHggPDwgMTYpO1xuXHR4ID0gKChyID4+PiA0KSBeIGwpICYgMHgwZjBmMGYwZjtcblx0bCBePSB4O1xuXHRyIF49ICh4IDw8IDQpO1xuXG5cdC8vIFNwcmVhZCBpbnRzIHRvIGJ5dGVzXG5cdHggPSBbciwgbF07XG5cdGZvciAoaSA9IDA7IGkgPCA4OyBpKyspIHtcblx0XHRiW2ldID0gKHhbaT4+PjJdID4+PiAoOCAqICgzIC0gKGkgJSA0KSkpKSAlIDI1Njtcblx0XHRpZiAoYltpXSA8IDApIHsgYltpXSArPSAyNTY7IH0gLy8gdW5zaWduZWRcblx0fVxuXHRyZXR1cm4gYjtcbn1cblxuXG4vLyBFbmNyeXB0IDE2IGJ5dGVzIG9mIHRleHQgdXNpbmcgcGFzc3dkIGFzIGtleVxuZnVuY3Rpb24gZW5jcnlwdCh0KSB7XG5cdHJldHVybiBlbmM4KHQuc2xpY2UoMCwgOCkpLmNvbmNhdChlbmM4KHQuc2xpY2UoOCwgMTYpKSk7XG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vbm9kZV9tb2R1bGVzL25vdm5jLW5vZGUvbGliL2Rlcy5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ub3ZuYy1ub2RlL2xpYlwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qXG4gKiBub1ZOQzogSFRNTDUgVk5DIGNsaWVudFxuICogQ29weXJpZ2h0IChDKSAyMDEyIEpvZWwgTWFydGluXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTUgU2FtdWVsIE1hbm5laGVkIGZvciBDZW5kaW8gQUJcbiAqIExpY2Vuc2VkIHVuZGVyIE1QTCAyLjAgKHNlZSBMSUNFTlNFLnR4dClcbiAqL1xuXG5cbi8qKlxuICogRXhwb3NlIHRoZSBEaXNwbGF5IGNsYXNzLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IERpc3BsYXk7XG5cblxuLyoqXG4gKiBEZXBlbmRlbmNpZXMuXG4gKi9cbnZhciBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ25vVk5DOkRpc3BsYXknKTtcbnZhciBkZWJ1Z2Vycm9yID0gcmVxdWlyZSgnZGVidWcnKSgnbm9WTkM6RVJST1I6RGlzcGxheScpO1xuZGVidWdlcnJvci5sb2cgPSBjb25zb2xlLndhcm4uYmluZChjb25zb2xlKTtcbnZhciBicm93c2VyID0gcmVxdWlyZSgnYm93c2VyJykuYnJvd3NlcjtcbnZhciBVdGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgQmFzZTY0ID0gcmVxdWlyZSgnLi9iYXNlNjQnKTtcblxuXG5mdW5jdGlvbiBEaXNwbGF5IChkZWZhdWx0cykge1xuXHRkZWJ1ZygnbmV3KCknKTtcblxuXHR0aGlzLl9kcmF3Q3R4ID0gbnVsbDtcblx0dGhpcy5fY19mb3JjZUNhbnZhcyA9IGZhbHNlO1xuXG5cdHRoaXMuX3JlbmRlclEgPSBbXTsgIC8vIHF1ZXVlIGRyYXdpbmcgYWN0aW9ucyBmb3IgaW4tb2RlciByZW5kZXJpbmdcblxuXHQvLyB0aGUgZnVsbCBmcmFtZSBidWZmZXIgKGxvZ2ljYWwgY2FudmFzKSBzaXplXG5cdHRoaXMuX2ZiX3dpZHRoID0gMDtcblx0dGhpcy5fZmJfaGVpZ2h0ID0gMDtcblxuXHQvLyB0aGUgc2l6ZSBsaW1pdCBvZiB0aGUgdmlld3BvcnQgKHN0YXJ0IGRpc2FibGVkKVxuXHR0aGlzLl9tYXhXaWR0aCA9IDA7XG5cdHRoaXMuX21heEhlaWdodCA9IDA7XG5cblx0Ly8gdGhlIHZpc2libGUgJ3BoeXNpY2FsIGNhbnZhcycgdmlld3BvcnRcblx0dGhpcy5fdmlld3BvcnRMb2MgPSB7ICd4JzogMCwgJ3knOiAwLCAndyc6IDAsICdoJzogMCB9O1xuXHR0aGlzLl9jbGVhblJlY3QgPSB7ICd4MSc6IDAsICd5MSc6IDAsICd4Mic6IC0xLCAneTInOiAtMSB9O1xuXG5cdHRoaXMuX3ByZXZEcmF3U3R5bGUgPSAnJztcblx0dGhpcy5fdGlsZSA9IG51bGw7XG5cdHRoaXMuX3RpbGUxNngxNiA9IG51bGw7XG5cdHRoaXMuX3RpbGVfeCA9IDA7XG5cdHRoaXMuX3RpbGVfeSA9IDA7XG5cblx0VXRpbC5zZXRfZGVmYXVsdHModGhpcywgZGVmYXVsdHMsIHtcblx0XHQndHJ1ZV9jb2xvcic6IHRydWUsXG5cdFx0J2NvbG91ck1hcCc6IFtdLFxuXHRcdCdzY2FsZSc6IDEuMCxcblx0XHQndmlld3BvcnQnOiBmYWxzZSxcblx0XHQncmVuZGVyX21vZGUnOiAnJ1xuXHR9KTtcblxuXHRpZiAoIXRoaXMuX3RhcmdldCkge1xuXHRcdHRocm93IG5ldyBFcnJvcignVGFyZ2V0IG11c3QgYmUgc2V0Jyk7XG5cdH1cblxuXHRpZiAodHlwZW9mIHRoaXMuX3RhcmdldCA9PT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ3RhcmdldCBtdXN0IGJlIGEgRE9NIGVsZW1lbnQnKTtcblx0fVxuXG5cdGlmICghdGhpcy5fdGFyZ2V0LmdldENvbnRleHQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ25vIGdldENvbnRleHQgbWV0aG9kJyk7XG5cdH1cblxuXHRpZiAoIXRoaXMuX2RyYXdDdHgpIHtcblx0XHR0aGlzLl9kcmF3Q3R4ID0gdGhpcy5fdGFyZ2V0LmdldENvbnRleHQoJzJkJyk7XG5cdH1cblxuXHR0aGlzLmNsZWFyKCk7XG5cblx0Ly8gQ2hlY2sgY2FudmFzIGZlYXR1cmVzXG5cdGlmICgnY3JlYXRlSW1hZ2VEYXRhJyBpbiB0aGlzLl9kcmF3Q3R4KSB7XG5cdFx0dGhpcy5fcmVuZGVyX21vZGUgPSAnY2FudmFzIHJlbmRlcmluZyc7XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdDYW52YXMgZG9lcyBub3Qgc3VwcG9ydCBjcmVhdGVJbWFnZURhdGEnKTtcblx0fVxuXG5cdGlmICh0aGlzLl9wcmVmZXJfanMgPT09IG51bGwpIHtcblx0XHR0aGlzLl9wcmVmZXJfanMgPSB0cnVlO1xuXHR9XG5cblx0Ly8gRGV0ZXJtaW5lIGJyb3dzZXIgc3VwcG9ydCBmb3Igc2V0dGluZyB0aGUgY3Vyc29yIHZpYSBkYXRhIFVSSSBzY2hlbWVcblx0aWYgKHRoaXMuX2N1cnNvcl91cmkgfHwgdGhpcy5fY3Vyc29yX3VyaSA9PT0gbnVsbCB8fFxuXHQgIHRoaXMuX2N1cnNvcl91cmkgPT09IHVuZGVmaW5lZCkge1xuXHQgIHRoaXMuX2N1cnNvcl91cmkgPSBVdGlsLmJyb3dzZXJTdXBwb3J0c0N1cnNvclVSSXMoKTtcblx0fVxufVxuXG5cbkRpc3BsYXkucHJvdG90eXBlID0ge1xuXHQvLyBQdWJsaWMgbWV0aG9kc1xuXHR2aWV3cG9ydENoYW5nZVBvczogZnVuY3Rpb24gKGRlbHRhWCwgZGVsdGFZKSB7XG5cdFx0dmFyIHZwID0gdGhpcy5fdmlld3BvcnRMb2M7XG5cblx0XHRpZiAoIXRoaXMuX3ZpZXdwb3J0KSB7XG5cdFx0XHRkZWx0YVggPSAtdnAudzsgIC8vIGNsYW1wZWQgbGF0ZXIgb2Ygb3V0IG9mIGJvdW5kc1xuXHRcdFx0ZGVsdGFZID0gLXZwLmg7XG5cdFx0fVxuXG5cdFx0dmFyIHZ4MiA9IHZwLnggKyB2cC53IC0gMTtcblx0XHR2YXIgdnkyID0gdnAueSArIHZwLmggLSAxO1xuXG5cdFx0Ly8gUG9zaXRpb24gY2hhbmdlXG5cblx0XHRpZiAoZGVsdGFYIDwgMCAmJiB2cC54ICsgZGVsdGFYIDwgMCkge1xuXHRcdFx0ZGVsdGFYID0gLXZwLng7XG5cdFx0fVxuXHRcdGlmICh2eDIgKyBkZWx0YVggPj0gdGhpcy5fZmJfd2lkdGgpIHtcblx0XHRcdGRlbHRhWCAtPSB2eDIgKyBkZWx0YVggLSB0aGlzLl9mYl93aWR0aCArIDE7XG5cdFx0fVxuXG5cdFx0aWYgKHZwLnkgKyBkZWx0YVkgPCAwKSB7XG5cdFx0XHRkZWx0YVkgPSAtdnAueTtcblx0XHR9XG5cdFx0aWYgKHZ5MiArIGRlbHRhWSA+PSB0aGlzLl9mYl9oZWlnaHQpIHtcblx0XHRcdGRlbHRhWSAtPSAodnkyICsgZGVsdGFZIC0gdGhpcy5fZmJfaGVpZ2h0ICsgMSk7XG5cdFx0fVxuXG5cdFx0aWYgKGRlbHRhWCA9PT0gMCAmJiBkZWx0YVkgPT09IDApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0ZGVidWcoJ3ZpZXdwb3J0Q2hhbmdlUG9zKCkgfCBkZWx0YVg6ICcgKyBkZWx0YVggKyAnLCBkZWx0YVk6ICcgKyBkZWx0YVkpO1xuXG5cdFx0dnAueCArPSBkZWx0YVg7XG5cdFx0dngyICs9IGRlbHRhWDtcblx0XHR2cC55ICs9IGRlbHRhWTtcblx0XHR2eTIgKz0gZGVsdGFZO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBjbGVhbiByZWN0YW5nbGVcblx0XHR2YXIgY3IgPSB0aGlzLl9jbGVhblJlY3Q7XG5cdFx0aWYgKHZwLnggPiBjci54MSkge1xuXHRcdFx0Y3IueDEgPSB2cC54O1xuXHRcdH1cblx0XHRpZiAodngyIDwgY3IueDIpIHtcblx0XHRcdGNyLngyID0gdngyO1xuXHRcdH1cblx0XHRpZiAodnAueSA+IGNyLnkxKSB7XG5cdFx0XHRjci55MSA9IHZwLnk7XG5cdFx0fVxuXHRcdGlmICh2eTIgPCBjci55Mikge1xuXHRcdFx0Y3IueTIgPSB2eTI7XG5cdFx0fVxuXG5cdFx0dmFyIHgxLCB3O1xuXHRcdGlmIChkZWx0YVggPCAwKSB7XG5cdFx0XHQvLyBTaGlmdCB2aWV3cG9ydCBsZWZ0LCByZWRyYXcgbGVmdCBzZWN0aW9uXG5cdFx0XHR4MSA9IDA7XG5cdFx0XHR3ID0gLWRlbHRhWDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gU2hpZnQgdmlld3BvcnQgcmlnaHQsIHJlZHJhdyByaWdodCBzZWN0aW9uXG5cdFx0XHR4MSA9IHZwLncgLSBkZWx0YVg7XG5cdFx0XHR3ID0gZGVsdGFYO1xuXHRcdH1cblxuXHRcdHZhciB5MSwgaDtcblx0XHRpZiAoZGVsdGFZIDwgMCkge1xuXHRcdFx0Ly8gU2hpZnQgdmlld3BvcnQgdXAsIHJlZHJhdyB0b3Agc2VjdGlvblxuXHRcdFx0eTEgPSAwO1xuXHRcdFx0aCA9IC1kZWx0YVk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIFNoaWZ0IHZpZXdwb3J0IGRvd24sIHJlZHJhdyBib3R0b20gc2VjdGlvblxuXHRcdFx0eTEgPSB2cC5oIC0gZGVsdGFZO1xuXHRcdFx0aCA9IGRlbHRhWTtcblx0XHR9XG5cblx0XHQvLyBDb3B5IHRoZSB2YWxpZCBwYXJ0IG9mIHRoZSB2aWV3cG9ydCB0byB0aGUgc2hpZnRlZCBsb2NhdGlvblxuXHRcdHZhciBzYXZlU3R5bGUgPSB0aGlzLl9kcmF3Q3R4LmZpbGxTdHlsZTtcblx0XHR2YXIgY2FudmFzID0gdGhpcy5fdGFyZ2V0O1xuXHRcdHRoaXMuX2RyYXdDdHguZmlsbFN0eWxlID0gJ3JnYigyNTUsMjU1LDI1NSknO1xuXHRcdGlmIChkZWx0YVggIT09IDApIHtcblx0XHRcdHRoaXMuX2RyYXdDdHguZHJhd0ltYWdlKGNhbnZhcywgMCwgMCwgdnAudywgdnAuaCwgLWRlbHRhWCwgMCwgdnAudywgdnAuaCk7XG5cdFx0XHR0aGlzLl9kcmF3Q3R4LmZpbGxSZWN0KHgxLCAwLCB3LCB2cC5oKTtcblx0XHR9XG5cdFx0aWYgKGRlbHRhWSAhPT0gMCkge1xuXHRcdFx0dGhpcy5fZHJhd0N0eC5kcmF3SW1hZ2UoY2FudmFzLCAwLCAwLCB2cC53LCB2cC5oLCAwLCAtZGVsdGFZLCB2cC53LCB2cC5oKTtcblx0XHRcdHRoaXMuX2RyYXdDdHguZmlsbFJlY3QoMCwgeTEsIHZwLncsIGgpO1xuXHRcdH1cblx0XHR0aGlzLl9kcmF3Q3R4LmZpbGxTdHlsZSA9IHNhdmVTdHlsZTtcblx0fSxcblxuXHR2aWV3cG9ydENoYW5nZVNpemU6IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcblx0XHRpZiAodHlwZW9mKHdpZHRoKSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mKGhlaWdodCkgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRkZWJ1Zygndmlld3BvcnRDaGFuZ2VTaXplKCkgfCBzZXR0aW5nIHZpZXdwb3J0IHRvIGZ1bGwgZGlzcGxheSByZWdpb24nKTtcblx0XHRcdHdpZHRoID0gdGhpcy5fZmJfd2lkdGg7XG5cdFx0XHRoZWlnaHQgPSB0aGlzLl9mYl9oZWlnaHQ7XG5cdFx0fVxuXG5cdFx0dmFyIHZwID0gdGhpcy5fdmlld3BvcnRMb2M7XG5cblx0XHRpZiAodnAudyAhPT0gd2lkdGggfHwgdnAuaCAhPT0gaGVpZ2h0KSB7XG5cdFx0XHRpZiAodGhpcy5fdmlld3BvcnQpIHtcblx0XHRcdFx0aWYgKHRoaXMuX21heFdpZHRoICE9PSAwICYmIHdpZHRoID4gdGhpcy5fbWF4V2lkdGgpIHtcblx0XHRcdFx0XHR3aWR0aCA9IHRoaXMuX21heFdpZHRoO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLl9tYXhIZWlnaHQgIT09IDAgJiYgaGVpZ2h0ID4gdGhpcy5fbWF4SGVpZ2h0KSB7XG5cdFx0XHRcdFx0aGVpZ2h0ID0gdGhpcy5fbWF4SGVpZ2h0O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHZhciBjciA9IHRoaXMuX2NsZWFuUmVjdDtcblxuXHRcdFx0aWYgKHdpZHRoIDwgdnAudyAmJiAgY3IueDIgPiB2cC54ICsgd2lkdGggLSAxKSB7XG5cdFx0XHRcdGNyLngyID0gdnAueCArIHdpZHRoIC0gMTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGhlaWdodCA8IHZwLmggJiYgIGNyLnkyID4gdnAueSArIGhlaWdodCAtIDEpIHtcblx0XHRcdFx0Y3IueTIgPSB2cC55ICsgaGVpZ2h0IC0gMTtcblx0XHRcdH1cblxuXHRcdFx0dnAudyA9IHdpZHRoO1xuXHRcdFx0dnAuaCA9IGhlaWdodDtcblxuXHRcdFx0dmFyIGNhbnZhcyA9IHRoaXMuX3RhcmdldDtcblxuXHRcdFx0aWYgKGNhbnZhcy53aWR0aCAhPT0gd2lkdGggfHwgY2FudmFzLmhlaWdodCAhPT0gaGVpZ2h0KSB7XG5cdFx0XHRcdC8vIFdlIGhhdmUgdG8gc2F2ZSB0aGUgY2FudmFzIGRhdGEgc2luY2UgY2hhbmdpbmcgdGhlIHNpemUgd2lsbCBjbGVhciBpdFxuXHRcdFx0XHR2YXIgc2F2ZUltZyA9IG51bGw7XG5cblx0XHRcdFx0aWYgKHZwLncgPiAwICYmIHZwLmggPiAwICYmIGNhbnZhcy53aWR0aCA+IDAgJiYgY2FudmFzLmhlaWdodCA+IDApIHtcblx0XHRcdFx0XHR2YXIgaW1nX3dpZHRoID0gY2FudmFzLndpZHRoIDwgdnAudyA/IGNhbnZhcy53aWR0aCA6IHZwLnc7XG5cdFx0XHRcdFx0dmFyIGltZ19oZWlnaHQgPSBjYW52YXMuaGVpZ2h0IDwgdnAuaCA/IGNhbnZhcy5oZWlnaHQgOiB2cC5oO1xuXHRcdFx0XHRcdHNhdmVJbWcgPSB0aGlzLl9kcmF3Q3R4LmdldEltYWdlRGF0YSgwLCAwLCBpbWdfd2lkdGgsIGltZ19oZWlnaHQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGNhbnZhcy53aWR0aCAhPT0gd2lkdGgpIHtcblx0XHRcdFx0XHRjYW52YXMud2lkdGggPSB3aWR0aDtcblx0XHRcdFx0XHRjYW52YXMuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKGNhbnZhcy5oZWlnaHQgIT09IGhlaWdodCkge1xuXHRcdFx0XHRcdGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cdFx0XHRcdFx0Y2FudmFzLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoc2F2ZUltZykge1xuXHRcdFx0XHRcdHRoaXMuX2RyYXdDdHgucHV0SW1hZ2VEYXRhKHNhdmVJbWcsIDAsIDApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdC8vIFJldHVybiBhIG1hcCBvZiBjbGVhbiBhbmQgZGlydHkgYXJlYXMgb2YgdGhlIHZpZXdwb3J0IGFuZCByZXNldCB0aGVcblx0Ly8gdHJhY2tpbmcgb2YgY2xlYW4gYW5kIGRpcnR5IGFyZWFzXG5cdC8vXG5cdC8vIFJldHVybnM6IHsgJ2NsZWFuQm94JzogeyAneCc6IHgsICd5JzogeSwgJ3cnOiB3LCAnaCc6IGh9LFxuXHQvLyAgICAgICAgICAgICdkaXJ0eUJveGVzJzogW3sgJ3gnOiB4LCAneSc6IHksICd3JzogdywgJ2gnOiBoIH0sIC4uLl0gfVxuXHRnZXRDbGVhbkRpcnR5UmVzZXQ6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgdnAgPSB0aGlzLl92aWV3cG9ydExvYztcblx0XHR2YXIgY3IgPSB0aGlzLl9jbGVhblJlY3Q7XG5cblx0XHR2YXIgY2xlYW5Cb3ggPSB7ICd4JzogY3IueDEsICd5JzogY3IueTEsXG5cdFx0XHRcdFx0XHQgJ3cnOiBjci54MiAtIGNyLngxICsgMSwgJ2gnOiBjci55MiAtIGNyLnkxICsgMSB9O1xuXG5cdFx0dmFyIGRpcnR5Qm94ZXMgPSBbXTtcblx0XHRpZiAoY3IueDEgPj0gY3IueDIgfHwgY3IueTEgPj0gY3IueTIpIHtcblx0XHRcdC8vIFdob2xlIHZpZXdwb3J0IGlzIGRpcnR5XG5cdFx0XHRkaXJ0eUJveGVzLnB1c2goeyAneCc6IHZwLngsICd5JzogdnAueSwgJ3cnOiB2cC53LCAnaCc6IHZwLmggfSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIFJlZHJhdyBkaXJ0eSByZWdpb25zXG5cdFx0XHR2YXIgdngyID0gdnAueCArIHZwLncgLSAxO1xuXHRcdFx0dmFyIHZ5MiA9IHZwLnkgKyB2cC5oIC0gMTtcblxuXHRcdFx0aWYgKHZwLnggPCBjci54MSkge1xuXHRcdFx0XHQvLyBsZWZ0IHNpZGUgZGlydHkgcmVnaW9uXG5cdFx0XHRcdGRpcnR5Qm94ZXMucHVzaCh7J3gnOiB2cC54LCAneSc6IHZwLnksXG5cdFx0XHRcdFx0XHRcdFx0ICd3JzogY3IueDEgLSB2cC54ICsgMSwgJ2gnOiB2cC5ofSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodngyID4gY3IueDIpIHtcblx0XHRcdFx0Ly8gcmlnaHQgc2lkZSBkaXJ0eSByZWdpb25cblx0XHRcdFx0ZGlydHlCb3hlcy5wdXNoKHsneCc6IGNyLngyICsgMSwgJ3knOiB2cC55LFxuXHRcdFx0XHRcdFx0XHRcdCAndyc6IHZ4MiAtIGNyLngyLCAnaCc6IHZwLmh9KTtcblx0XHRcdH1cblx0XHRcdGlmKHZwLnkgPCBjci55MSkge1xuXHRcdFx0XHQvLyB0b3AvbWlkZGxlIGRpcnR5IHJlZ2lvblxuXHRcdFx0XHRkaXJ0eUJveGVzLnB1c2goeyd4JzogY3IueDEsICd5JzogdnAueSxcblx0XHRcdFx0XHRcdFx0XHQgJ3cnOiBjci54MiAtIGNyLngxICsgMSwgJ2gnOiBjci55MSAtIHZwLnl9KTtcblx0XHRcdH1cblx0XHRcdGlmICh2eTIgPiBjci55Mikge1xuXHRcdFx0XHQvLyBib3R0b20vbWlkZGxlIGRpcnR5IHJlZ2lvblxuXHRcdFx0XHRkaXJ0eUJveGVzLnB1c2goeyd4JzogY3IueDEsICd5JzogY3IueTIgKyAxLFxuXHRcdFx0XHRcdFx0XHRcdCAndyc6IGNyLngyIC0gY3IueDEgKyAxLCAnaCc6IHZ5MiAtIGNyLnkyfSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fY2xlYW5SZWN0ID0geyd4MSc6IHZwLngsICd5MSc6IHZwLnksXG5cdFx0XHRcdFx0XHRcdCAneDInOiB2cC54ICsgdnAudyAtIDEsICd5Mic6IHZwLnkgKyB2cC5oIC0gMX07XG5cblx0XHRyZXR1cm4geydjbGVhbkJveCc6IGNsZWFuQm94LCAnZGlydHlCb3hlcyc6IGRpcnR5Qm94ZXN9O1xuXHR9LFxuXG5cdGFic1g6IGZ1bmN0aW9uICh4KSB7XG5cdFx0cmV0dXJuIHggKyB0aGlzLl92aWV3cG9ydExvYy54O1xuXHR9LFxuXG5cdGFic1k6IGZ1bmN0aW9uICh5KSB7XG5cdFx0cmV0dXJuIHkgKyB0aGlzLl92aWV3cG9ydExvYy55O1xuXHR9LFxuXG5cdHJlc2l6ZTogZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQpIHtcblx0XHR0aGlzLl9wcmV2RHJhd1N0eWxlID0gJyc7XG5cblx0XHR0aGlzLl9mYl93aWR0aCA9IHdpZHRoO1xuXHRcdHRoaXMuX2ZiX2hlaWdodCA9IGhlaWdodDtcblxuXHRcdHRoaXMuX3Jlc2NhbGUodGhpcy5fc2NhbGUpO1xuXG5cdFx0dGhpcy52aWV3cG9ydENoYW5nZVNpemUoKTtcblx0fSxcblxuXHRjbGVhcjogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLl9sb2dvKSB7XG5cdFx0XHR0aGlzLnJlc2l6ZSh0aGlzLl9sb2dvLndpZHRoLCB0aGlzLl9sb2dvLmhlaWdodCk7XG5cdFx0XHR0aGlzLmJsaXRTdHJpbmdJbWFnZSh0aGlzLl9sb2dvLmRhdGEsIDAsIDApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoYnJvd3Nlci5tc2llICYmIHBhcnNlSW50KGJyb3dzZXIudmVyc2lvbikgPT09IDEwKSB7XG5cdFx0XHRcdC8vIE5CKGRpcmVjdHhtYW4xMik6IHRoZXJlJ3MgYSBidWcgaW4gSUUxMCB3aGVyZSB3ZSBjYW4gZmFpbCB0byBhY3R1YWxseVxuXHRcdFx0XHQvLyAgICAgICAgICAgICAgICAgICBjbGVhciB0aGUgY2FudmFzIGhlcmUgYmVjYXVzZSBvZiB0aGUgcmVzaXplLlxuXHRcdFx0XHQvLyAgICAgICAgICAgICAgICAgICBDbGVhcmluZyB0aGUgY3VycmVudCB2aWV3cG9ydCBmaXJzdCBmaXhlcyB0aGUgaXNzdWVcblx0XHRcdFx0dGhpcy5fZHJhd0N0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5fdmlld3BvcnRMb2MudywgdGhpcy5fdmlld3BvcnRMb2MuaCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnJlc2l6ZSgyNDAsIDIwKTtcblx0XHRcdHRoaXMuX2RyYXdDdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuX3ZpZXdwb3J0TG9jLncsIHRoaXMuX3ZpZXdwb3J0TG9jLmgpO1xuXHRcdH1cblxuXHRcdHRoaXMuX3JlbmRlclEgPSBbXTtcblx0fSxcblxuXHRmaWxsUmVjdDogZnVuY3Rpb24gKHgsIHksIHdpZHRoLCBoZWlnaHQsIGNvbG9yKSB7XG5cdFx0dGhpcy5fc2V0RmlsbENvbG9yKGNvbG9yKTtcblx0XHR0aGlzLl9kcmF3Q3R4LmZpbGxSZWN0KHggLSB0aGlzLl92aWV3cG9ydExvYy54LCB5IC0gdGhpcy5fdmlld3BvcnRMb2MueSwgd2lkdGgsIGhlaWdodCk7XG5cdH0sXG5cblx0Y29weUltYWdlOiBmdW5jdGlvbiAob2xkX3gsIG9sZF95LCBuZXdfeCwgbmV3X3ksIHcsIGgpIHtcblx0XHR2YXIgeDEgPSBvbGRfeCAtIHRoaXMuX3ZpZXdwb3J0TG9jLng7XG5cdFx0dmFyIHkxID0gb2xkX3kgLSB0aGlzLl92aWV3cG9ydExvYy55O1xuXHRcdHZhciB4MiA9IG5ld194IC0gdGhpcy5fdmlld3BvcnRMb2MueDtcblx0XHR2YXIgeTIgPSBuZXdfeSAtIHRoaXMuX3ZpZXdwb3J0TG9jLnk7XG5cblx0XHR0aGlzLl9kcmF3Q3R4LmRyYXdJbWFnZSh0aGlzLl90YXJnZXQsIHgxLCB5MSwgdywgaCwgeDIsIHkyLCB3LCBoKTtcblx0fSxcblxuXHQvLyBzdGFydCB1cGRhdGluZyBhIHRpbGVcblx0c3RhcnRUaWxlOiBmdW5jdGlvbiAoeCwgeSwgd2lkdGgsIGhlaWdodCwgY29sb3IpIHtcblx0XHR0aGlzLl90aWxlX3ggPSB4O1xuXHRcdHRoaXMuX3RpbGVfeSA9IHk7XG5cdFx0aWYgKHdpZHRoID09PSAxNiAmJiBoZWlnaHQgPT09IDE2KSB7XG5cdFx0XHR0aGlzLl90aWxlID0gdGhpcy5fdGlsZTE2eDE2O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl90aWxlID0gdGhpcy5fZHJhd0N0eC5jcmVhdGVJbWFnZURhdGEod2lkdGgsIGhlaWdodCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX3ByZWZlcl9qcykge1xuXHRcdFx0dmFyIGJncjtcblx0XHRcdGlmICh0aGlzLl90cnVlX2NvbG9yKSB7XG5cdFx0XHRcdGJnciA9IGNvbG9yO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YmdyID0gdGhpcy5fY29sb3VyTWFwW2NvbG9yWzBdXTtcblx0XHRcdH1cblx0XHRcdHZhciByZWQgPSBiZ3JbMl07XG5cdFx0XHR2YXIgZ3JlZW4gPSBiZ3JbMV07XG5cdFx0XHR2YXIgYmx1ZSA9IGJnclswXTtcblxuXHRcdFx0dmFyIGRhdGEgPSB0aGlzLl90aWxlLmRhdGE7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHdpZHRoICogaGVpZ2h0ICogNDsgaSArPSA0KSB7XG5cdFx0XHRcdGRhdGFbaV0gPSByZWQ7XG5cdFx0XHRcdGRhdGFbaSArIDFdID0gZ3JlZW47XG5cdFx0XHRcdGRhdGFbaSArIDJdID0gYmx1ZTtcblx0XHRcdFx0ZGF0YVtpICsgM10gPSAyNTU7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCwgY29sb3IpO1xuXHRcdH1cblx0fSxcblxuXHQvLyB1cGRhdGUgc3ViLXJlY3RhbmdsZSBvZiB0aGUgY3VycmVudCB0aWxlXG5cdHN1YlRpbGU6IGZ1bmN0aW9uICh4LCB5LCB3LCBoLCBjb2xvcikge1xuXHRcdGlmICh0aGlzLl9wcmVmZXJfanMpIHtcblx0XHRcdHZhciBiZ3I7XG5cdFx0XHRpZiAodGhpcy5fdHJ1ZV9jb2xvcikge1xuXHRcdFx0XHRiZ3IgPSBjb2xvcjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGJnciA9IHRoaXMuX2NvbG91ck1hcFtjb2xvclswXV07XG5cdFx0XHR9XG5cdFx0XHR2YXIgcmVkID0gYmdyWzJdO1xuXHRcdFx0dmFyIGdyZWVuID0gYmdyWzFdO1xuXHRcdFx0dmFyIGJsdWUgPSBiZ3JbMF07XG5cdFx0XHR2YXIgeGVuZCA9IHggKyB3O1xuXHRcdFx0dmFyIHllbmQgPSB5ICsgaDtcblxuXHRcdFx0dmFyIGRhdGEgPSB0aGlzLl90aWxlLmRhdGE7XG5cdFx0XHR2YXIgd2lkdGggPSB0aGlzLl90aWxlLndpZHRoO1xuXHRcdFx0Zm9yICh2YXIgaiA9IHk7IGogPCB5ZW5kOyBqKyspIHtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IHg7IGkgPCB4ZW5kOyBpKyspIHtcblx0XHRcdFx0XHR2YXIgcCA9IChpICsgKGogKiB3aWR0aCkpICogNDtcblx0XHRcdFx0XHRkYXRhW3BdID0gcmVkO1xuXHRcdFx0XHRcdGRhdGFbcCArIDFdID0gZ3JlZW47XG5cdFx0XHRcdFx0ZGF0YVtwICsgMl0gPSBibHVlO1xuXHRcdFx0XHRcdGRhdGFbcCArIDNdID0gMjU1O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuZmlsbFJlY3QodGhpcy5fdGlsZV94ICsgeCwgdGhpcy5fdGlsZV95ICsgeSwgdywgaCwgY29sb3IpO1xuXHRcdH1cblx0fSxcblxuXHQvLyBkcmF3IHRoZSBjdXJyZW50IHRpbGUgdG8gdGhlIHNjcmVlblxuXHRmaW5pc2hUaWxlOiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHRoaXMuX3ByZWZlcl9qcykge1xuXHRcdFx0dGhpcy5fZHJhd0N0eC5wdXRJbWFnZURhdGEodGhpcy5fdGlsZSwgdGhpcy5fdGlsZV94IC0gdGhpcy5fdmlld3BvcnRMb2MueCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0IHRoaXMuX3RpbGVfeSAtIHRoaXMuX3ZpZXdwb3J0TG9jLnkpO1xuXHRcdH1cblx0XHQvLyBlbHNlOiBOby1vcCAtLSBhbHJlYWR5IGRvbmUgYnkgc2V0U3ViVGlsZVxuXHR9LFxuXG5cdGJsaXRJbWFnZTogZnVuY3Rpb24gKHgsIHksIHdpZHRoLCBoZWlnaHQsIGFyciwgb2Zmc2V0KSB7XG5cdFx0aWYgKHRoaXMuX3RydWVfY29sb3IpIHtcblx0XHRcdHRoaXMuX2JncnhJbWFnZURhdGEoeCwgeSwgdGhpcy5fdmlld3BvcnRMb2MueCwgdGhpcy5fdmlld3BvcnRMb2MueSwgd2lkdGgsIGhlaWdodCwgYXJyLCBvZmZzZXQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9jbWFwSW1hZ2VEYXRhKHgsIHksIHRoaXMuX3ZpZXdwb3J0TG9jLngsIHRoaXMuX3ZpZXdwb3J0TG9jLnksIHdpZHRoLCBoZWlnaHQsIGFyciwgb2Zmc2V0KTtcblx0XHR9XG5cdH0sXG5cblx0YmxpdFJnYkltYWdlOiBmdW5jdGlvbiAoeCwgeSAsIHdpZHRoLCBoZWlnaHQsIGFyciwgb2Zmc2V0KSB7XG5cdFx0aWYgKHRoaXMuX3RydWVfY29sb3IpIHtcblx0XHRcdHRoaXMuX3JnYkltYWdlRGF0YSh4LCB5LCB0aGlzLl92aWV3cG9ydExvYy54LCB0aGlzLl92aWV3cG9ydExvYy55LCB3aWR0aCwgaGVpZ2h0LCBhcnIsIG9mZnNldCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHByb2JhYmx5IHdyb25nP1xuXHRcdFx0dGhpcy5fY21hcEltYWdlRGF0YSh4LCB5LCB0aGlzLl92aWV3cG9ydExvYy54LCB0aGlzLl92aWV3cG9ydExvYy55LCB3aWR0aCwgaGVpZ2h0LCBhcnIsIG9mZnNldCk7XG5cdFx0fVxuXHR9LFxuXG5cdGJsaXRTdHJpbmdJbWFnZTogZnVuY3Rpb24gKHN0ciwgeCwgeSkge1xuXHRcdHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcblx0XHRpbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhpcy5fZHJhd0N0eC5kcmF3SW1hZ2UoaW1nLCB4IC0gdGhpcy5fdmlld3BvcnRMb2MueCwgeSAtIHRoaXMuX3ZpZXdwb3J0TG9jLnkpO1xuXHRcdH0uYmluZCh0aGlzKTtcblx0XHRpbWcuc3JjID0gc3RyO1xuXHRcdHJldHVybiBpbWc7IC8vIGZvciBkZWJ1Z2dpbmcgcHVycG9zZXNcblx0fSxcblxuXHQvLyB3cmFwIGN0eC5kcmF3SW1hZ2UgYnV0IHJlbGF0aXZlIHRvIHZpZXdwb3J0XG5cdGRyYXdJbWFnZTogZnVuY3Rpb24gKGltZywgeCwgeSkge1xuXHRcdHRoaXMuX2RyYXdDdHguZHJhd0ltYWdlKGltZywgeCAtIHRoaXMuX3ZpZXdwb3J0TG9jLngsIHkgLSB0aGlzLl92aWV3cG9ydExvYy55KTtcblx0fSxcblxuXHRyZW5kZXJRX3B1c2g6IGZ1bmN0aW9uIChhY3Rpb24pIHtcblx0XHR0aGlzLl9yZW5kZXJRLnB1c2goYWN0aW9uKTtcblx0XHRpZiAodGhpcy5fcmVuZGVyUS5sZW5ndGggPT09IDEpIHtcblx0XHRcdC8vIElmIHRoaXMgY2FuIGJlIHJlbmRlcmVkIGltbWVkaWF0ZWx5IGl0IHdpbGwgYmUsIG90aGVyd2lzZVxuXHRcdFx0Ly8gdGhlIHNjYW5uZXIgd2lsbCBzdGFydCBwb2xsaW5nIHRoZSBxdWV1ZSAoZXZlcnlcblx0XHRcdC8vIHJlcXVlc3RBbmltYXRpb25GcmFtZSBpbnRlcnZhbClcblx0XHRcdHRoaXMuX3NjYW5fcmVuZGVyUSgpO1xuXHRcdH1cblx0fSxcblxuXHRjaGFuZ2VDdXJzb3I6IGZ1bmN0aW9uIChwaXhlbHMsIG1hc2ssIGhvdHgsIGhvdHksIHcsIGgpIHtcblx0XHRpZiAodGhpcy5fY3Vyc29yX3VyaSA9PT0gZmFsc2UpIHtcblx0XHRcdGRlYnVnZXJyb3IoJ2NoYW5nZUN1cnNvcigpIHwgY2FsbGVkIGJ1dCBubyBjdXJzb3IgZGF0YSBVUkkgc3VwcG9ydCcpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl90cnVlX2NvbG9yKSB7XG5cdFx0XHREaXNwbGF5LmNoYW5nZUN1cnNvcih0aGlzLl90YXJnZXQsIHBpeGVscywgbWFzaywgaG90eCwgaG90eSwgdywgaCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdERpc3BsYXkuY2hhbmdlQ3Vyc29yKHRoaXMuX3RhcmdldCwgcGl4ZWxzLCBtYXNrLCBob3R4LCBob3R5LCB3LCBoLCB0aGlzLl9jb2xvdXJNYXApO1xuXHRcdH1cblx0fSxcblxuXHRkZWZhdWx0Q3Vyc29yOiBmdW5jdGlvbiAoKSB7XG5cdFx0dGhpcy5fdGFyZ2V0LnN0eWxlLmN1cnNvciA9ICdkZWZhdWx0Jztcblx0fSxcblxuXHRkaXNhYmxlTG9jYWxDdXJzb3I6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLl90YXJnZXQuc3R5bGUuY3Vyc29yID0gJ25vbmUnO1xuXHR9LFxuXG5cdGNsaXBwaW5nRGlzcGxheTogZnVuY3Rpb24gKCkge1xuXHRcdHZhciB2cCA9IHRoaXMuX3ZpZXdwb3J0TG9jO1xuXG5cdFx0dmFyIGZiQ2xpcCA9IHRoaXMuX2ZiX3dpZHRoID4gdnAudyB8fCB0aGlzLl9mYl9oZWlnaHQgPiB2cC5oO1xuXHRcdHZhciBsaW1pdGVkVnAgPSB0aGlzLl9tYXhXaWR0aCAhPT0gMCAmJiB0aGlzLl9tYXhIZWlnaHQgIT09IDA7XG5cdFx0dmFyIGNsaXBwaW5nID0gZmFsc2U7XG5cblx0XHRpZiAobGltaXRlZFZwKSB7XG5cdFx0XHRjbGlwcGluZyA9IHZwLncgPiB0aGlzLl9tYXhXaWR0aCB8fCB2cC5oID4gdGhpcy5fbWF4SGVpZ2h0O1xuXHRcdH1cblxuXHRcdHJldHVybiBmYkNsaXAgfHwgKGxpbWl0ZWRWcCAmJiBjbGlwcGluZyk7XG5cdH0sXG5cblx0Ly8gT3ZlcnJpZGRlbiBnZXR0ZXJzL3NldHRlcnNcblx0Z2V0X2NvbnRleHQ6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gdGhpcy5fZHJhd0N0eDtcblx0fSxcblxuXHRzZXRfc2NhbGU6IGZ1bmN0aW9uIChzY2FsZSkge1xuXHRcdHRoaXMuX3Jlc2NhbGUoc2NhbGUpO1xuXHR9LFxuXG5cdHNldF93aWR0aDogZnVuY3Rpb24gKHcpIHtcblx0XHR0aGlzLl9mYl93aWR0aCA9IHc7XG5cdH0sXG5cblx0Z2V0X3dpZHRoOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2ZiX3dpZHRoO1xuXHR9LFxuXG5cdHNldF9oZWlnaHQ6IGZ1bmN0aW9uIChoKSB7XG5cdFx0dGhpcy5fZmJfaGVpZ2h0ID0gIGg7XG5cdH0sXG5cblx0Z2V0X2hlaWdodDogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLl9mYl9oZWlnaHQ7XG5cdH0sXG5cblx0YXV0b3NjYWxlOiBmdW5jdGlvbiAoY29udGFpbmVyV2lkdGgsIGNvbnRhaW5lckhlaWdodCwgZG93bnNjYWxlT25seSkge1xuXHRcdHZhciB0YXJnZXRBc3BlY3RSYXRpbyA9IGNvbnRhaW5lcldpZHRoIC8gY29udGFpbmVySGVpZ2h0O1xuXHRcdHZhciBmYkFzcGVjdFJhdGlvID0gdGhpcy5fZmJfd2lkdGggLyB0aGlzLl9mYl9oZWlnaHQ7XG5cblx0XHR2YXIgc2NhbGVSYXRpbztcblx0XHRpZiAoZmJBc3BlY3RSYXRpbyA+PSB0YXJnZXRBc3BlY3RSYXRpbykge1xuXHRcdFx0XHRzY2FsZVJhdGlvID0gY29udGFpbmVyV2lkdGggLyB0aGlzLl9mYl93aWR0aDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzY2FsZVJhdGlvID0gY29udGFpbmVySGVpZ2h0IC8gdGhpcy5fZmJfaGVpZ2h0O1xuXHRcdH1cblxuXHRcdHZhciB0YXJnZXRXLCB0YXJnZXRIO1xuXHRcdGlmIChzY2FsZVJhdGlvID4gMS4wICYmIGRvd25zY2FsZU9ubHkpIHtcblx0XHRcdFx0dGFyZ2V0VyA9IHRoaXMuX2ZiX3dpZHRoO1xuXHRcdFx0XHR0YXJnZXRIID0gdGhpcy5fZmJfaGVpZ2h0O1xuXHRcdFx0XHRzY2FsZVJhdGlvID0gMS4wO1xuXHRcdH0gZWxzZSBpZiAoZmJBc3BlY3RSYXRpbyA+PSB0YXJnZXRBc3BlY3RSYXRpbykge1xuXHRcdFx0XHR0YXJnZXRXID0gY29udGFpbmVyV2lkdGg7XG5cdFx0XHRcdHRhcmdldEggPSBNYXRoLnJvdW5kKGNvbnRhaW5lcldpZHRoIC8gZmJBc3BlY3RSYXRpbyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdFx0dGFyZ2V0VyA9IE1hdGgucm91bmQoY29udGFpbmVySGVpZ2h0ICogZmJBc3BlY3RSYXRpbyk7XG5cdFx0XHRcdHRhcmdldEggPSBjb250YWluZXJIZWlnaHQ7XG5cdFx0fVxuXG5cdFx0Ly8gTkIoZGlyZWN0eG1hbjEyKTogSWYgeW91IHNldCB0aGUgd2lkdGggZGlyZWN0bHksIG9yIHNldCB0aGVcblx0XHQvLyAgICAgICAgICAgICAgICAgICBzdHlsZSB3aWR0aCB0byBhIG51bWJlciwgdGhlIGNhbnZhcyBpcyBjbGVhcmVkLlxuXHRcdC8vICAgICAgICAgICAgICAgICAgIEhvd2V2ZXIsIGlmIHlvdSBzZXQgdGhlIHN0eWxlIHdpZHRoIHRvIGEgc3RyaW5nXG5cdFx0Ly8gICAgICAgICAgICAgICAgICAgKCdOTk5weCcpLCB0aGUgY2FudmFzIGlzIHNjYWxlZCB3aXRob3V0IGNsZWFyaW5nLlxuXHRcdHRoaXMuX3RhcmdldC5zdHlsZS53aWR0aCA9IHRhcmdldFcgKyAncHgnO1xuXHRcdHRoaXMuX3RhcmdldC5zdHlsZS5oZWlnaHQgPSB0YXJnZXRIICsgJ3B4JztcblxuXHRcdHRoaXMuX3NjYWxlID0gc2NhbGVSYXRpbztcblxuXHRcdHJldHVybiBzY2FsZVJhdGlvOyAgLy8gc28gdGhhdCB0aGUgbW91c2UsIGV0YyBzY2FsZSBjYW4gYmUgc2V0XG5cdH0sXG5cblx0Ly8gUHJpdmF0ZSBNZXRob2RzXG5cblx0X3Jlc2NhbGU6IGZ1bmN0aW9uIChmYWN0b3IpIHtcblx0XHR0aGlzLl9zY2FsZSA9IGZhY3RvcjtcblxuXHRcdHZhciB3O1xuXHRcdHZhciBoO1xuXG5cdFx0aWYgKHRoaXMuX3ZpZXdwb3J0ICYmXG5cdFx0XHR0aGlzLl9tYXhXaWR0aCAhPT0gMCAmJiB0aGlzLl9tYXhIZWlnaHQgIT09IDApIHtcblx0XHRcdHcgPSBNYXRoLm1pbih0aGlzLl9mYl93aWR0aCwgdGhpcy5fbWF4V2lkdGgpO1xuXHRcdFx0aCA9IE1hdGgubWluKHRoaXMuX2ZiX2hlaWdodCwgdGhpcy5fbWF4SGVpZ2h0KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dyA9IHRoaXMuX2ZiX3dpZHRoO1xuXHRcdFx0aCA9IHRoaXMuX2ZiX2hlaWdodDtcblx0XHR9XG5cblx0XHR0aGlzLl90YXJnZXQuc3R5bGUud2lkdGggPSBNYXRoLnJvdW5kKGZhY3RvciAqIHcpICsgJ3B4Jztcblx0XHR0aGlzLl90YXJnZXQuc3R5bGUuaGVpZ2h0ID0gTWF0aC5yb3VuZChmYWN0b3IgKiBoKSArICdweCc7XG5cdH0sXG5cblx0X3NldEZpbGxDb2xvcjogZnVuY3Rpb24gKGNvbG9yKSB7XG5cdFx0dmFyIGJncjtcblx0XHRpZiAodGhpcy5fdHJ1ZV9jb2xvcikge1xuXHRcdFx0YmdyID0gY29sb3I7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGJnciA9IHRoaXMuX2NvbG91ck1hcFtjb2xvclswXV07XG5cdFx0fVxuXG5cdFx0dmFyIG5ld1N0eWxlID0gJ3JnYignICsgYmdyWzJdICsgJywnICsgYmdyWzFdICsgJywnICsgYmdyWzBdICsgJyknO1xuXHRcdGlmIChuZXdTdHlsZSAhPT0gdGhpcy5fcHJldkRyYXdTdHlsZSkge1xuXHRcdFx0dGhpcy5fZHJhd0N0eC5maWxsU3R5bGUgPSBuZXdTdHlsZTtcblx0XHRcdHRoaXMuX3ByZXZEcmF3U3R5bGUgPSBuZXdTdHlsZTtcblx0XHR9XG5cdH0sXG5cblx0X3JnYkltYWdlRGF0YTogZnVuY3Rpb24gKHgsIHksIHZ4LCB2eSwgd2lkdGgsIGhlaWdodCwgYXJyLCBvZmZzZXQpIHtcblx0XHR2YXIgaW1nID0gdGhpcy5fZHJhd0N0eC5jcmVhdGVJbWFnZURhdGEod2lkdGgsIGhlaWdodCk7XG5cdFx0dmFyIGRhdGEgPSBpbWcuZGF0YTtcblxuXHRcdGZvciAodmFyIGkgPSAwLCBqID0gb2Zmc2V0OyBpIDwgd2lkdGggKiBoZWlnaHQgKiA0OyBpICs9IDQsIGogKz0gMykge1xuXHRcdFx0ZGF0YVtpXSAgICAgPSBhcnJbal07XG5cdFx0XHRkYXRhW2kgKyAxXSA9IGFycltqICsgMV07XG5cdFx0XHRkYXRhW2kgKyAyXSA9IGFycltqICsgMl07XG5cdFx0XHRkYXRhW2kgKyAzXSA9IDI1NTsgIC8vIEFscGhhXG5cdFx0fVxuXHRcdHRoaXMuX2RyYXdDdHgucHV0SW1hZ2VEYXRhKGltZywgeCAtIHZ4LCB5IC0gdnkpO1xuXHR9LFxuXG5cdF9iZ3J4SW1hZ2VEYXRhOiBmdW5jdGlvbiAoeCwgeSwgdngsIHZ5LCB3aWR0aCwgaGVpZ2h0LCBhcnIsIG9mZnNldCkge1xuXHRcdHZhciBpbWcgPSB0aGlzLl9kcmF3Q3R4LmNyZWF0ZUltYWdlRGF0YSh3aWR0aCwgaGVpZ2h0KTtcblx0XHR2YXIgZGF0YSA9IGltZy5kYXRhO1xuXHRcdGZvciAodmFyIGkgPSAwLCBqID0gb2Zmc2V0OyBpIDwgd2lkdGggKiBoZWlnaHQgKiA0OyBpICs9IDQsIGogKz0gNCkge1xuXHRcdFx0ZGF0YVtpXSAgICAgPSBhcnJbaiArIDJdO1xuXHRcdFx0ZGF0YVtpICsgMV0gPSBhcnJbaiArIDFdO1xuXHRcdFx0ZGF0YVtpICsgMl0gPSBhcnJbal07XG5cdFx0XHRkYXRhW2kgKyAzXSA9IDI1NTsgIC8vIEFscGhhXG5cdFx0fVxuXHRcdHRoaXMuX2RyYXdDdHgucHV0SW1hZ2VEYXRhKGltZywgeCAtIHZ4LCB5IC0gdnkpO1xuXHR9LFxuXG5cdF9jbWFwSW1hZ2VEYXRhOiBmdW5jdGlvbiAoeCwgeSwgdngsIHZ5LCB3aWR0aCwgaGVpZ2h0LCBhcnIsIG9mZnNldCkge1xuXHRcdHZhciBpbWcgPSB0aGlzLl9kcmF3Q3R4LmNyZWF0ZUltYWdlRGF0YSh3aWR0aCwgaGVpZ2h0KTtcblx0XHR2YXIgZGF0YSA9IGltZy5kYXRhO1xuXHRcdHZhciBjbWFwID0gdGhpcy5fY29sb3VyTWFwO1xuXHRcdGZvciAodmFyIGkgPSAwLCBqID0gb2Zmc2V0OyBpIDwgd2lkdGggKiBoZWlnaHQgKiA0OyBpICs9IDQsIGorKykge1xuXHRcdFx0dmFyIGJnciA9IGNtYXBbYXJyW2pdXTtcblx0XHRcdGRhdGFbaV0gICAgID0gYmdyWzJdO1xuXHRcdFx0ZGF0YVtpICsgMV0gPSBiZ3JbMV07XG5cdFx0XHRkYXRhW2kgKyAyXSA9IGJnclswXTtcblx0XHRcdGRhdGFbaSArIDNdID0gMjU1OyAgLy8gQWxwaGFcblx0XHR9XG5cdFx0dGhpcy5fZHJhd0N0eC5wdXRJbWFnZURhdGEoaW1nLCB4IC0gdngsIHkgLSB2eSk7XG5cdH0sXG5cblx0X3NjYW5fcmVuZGVyUTogZnVuY3Rpb24gKCkge1xuXHRcdHZhciByZWFkeSA9IHRydWU7XG5cdFx0d2hpbGUgKHJlYWR5ICYmIHRoaXMuX3JlbmRlclEubGVuZ3RoID4gMCkge1xuXHRcdFx0dmFyIGEgPSB0aGlzLl9yZW5kZXJRWzBdO1xuXHRcdFx0c3dpdGNoIChhLnR5cGUpIHtcblx0XHRcdFx0Y2FzZSAnY29weSc6XG5cdFx0XHRcdFx0dGhpcy5jb3B5SW1hZ2UoYS5vbGRfeCwgYS5vbGRfeSwgYS54LCBhLnksIGEud2lkdGgsIGEuaGVpZ2h0KTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnZmlsbCc6XG5cdFx0XHRcdFx0dGhpcy5maWxsUmVjdChhLngsIGEueSwgYS53aWR0aCwgYS5oZWlnaHQsIGEuY29sb3IpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdibGl0Jzpcblx0XHRcdFx0XHR0aGlzLmJsaXRJbWFnZShhLngsIGEueSwgYS53aWR0aCwgYS5oZWlnaHQsIGEuZGF0YSwgMCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ2JsaXRSZ2InOlxuXHRcdFx0XHRcdHRoaXMuYmxpdFJnYkltYWdlKGEueCwgYS55LCBhLndpZHRoLCBhLmhlaWdodCwgYS5kYXRhLCAwKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnaW1nJzpcblx0XHRcdFx0XHRpZiAoYS5pbWcuY29tcGxldGUpIHtcblx0XHRcdFx0XHRcdHRoaXMuZHJhd0ltYWdlKGEuaW1nLCBhLngsIGEueSk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIFdlIG5lZWQgdG8gd2FpdCBmb3IgdGhpcyBpbWFnZSB0byAnbG9hZCdcblx0XHRcdFx0XHRcdC8vIHRvIGtlZXAgdGhpbmdzIGluLW9yZGVyXG5cdFx0XHRcdFx0XHRyZWFkeSA9IGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0aWYgKHJlYWR5KSB7XG5cdFx0XHRcdHRoaXMuX3JlbmRlclEuc2hpZnQoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5fcmVuZGVyUS5sZW5ndGggPiAwKSB7XG5cdFx0XHRVdGlsLnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9zY2FuX3JlbmRlclEuYmluZCh0aGlzKSk7XG5cdFx0fVxuXHR9LFxufTtcblxuXG5VdGlsLm1ha2VfcHJvcGVydGllcyhEaXNwbGF5LCBbXG5cdFsndGFyZ2V0JywgJ3dvJywgJ2RvbSddLCAgICAgICAvLyBDYW52YXMgZWxlbWVudCBmb3IgcmVuZGVyaW5nXG5cdFsnY29udGV4dCcsICdybycsICdyYXcnXSwgICAgICAvLyBDYW52YXMgMkQgY29udGV4dCBmb3IgcmVuZGVyaW5nIChyZWFkLW9ubHkpXG5cdFsnbG9nbycsICdydycsICdyYXcnXSwgICAgICAgICAvLyBMb2dvIHRvIGRpc3BsYXkgd2hlbiBjbGVhcmVkOiB7J3dpZHRoJzogdywgJ2hlaWdodCc6IGgsICdkYXRhJzogZGF0YX1cblx0Wyd0cnVlX2NvbG9yJywgJ3J3JywgJ2Jvb2wnXSwgIC8vIFVzZSB0cnVlLWNvbG9yIHBpeGVsIGRhdGFcblx0Wydjb2xvdXJNYXAnLCAncncnLCAnYXJyJ10sICAgIC8vIENvbG91ciBtYXAgYXJyYXkgKHdoZW4gbm90IHRydWUtY29sb3IpXG5cdFsnc2NhbGUnLCAncncnLCAnZmxvYXQnXSwgICAgICAvLyBEaXNwbGF5IGFyZWEgc2NhbGUgZmFjdG9yIDAuMCAtIDEuMFxuXHRbJ3ZpZXdwb3J0JywgJ3J3JywgJ2Jvb2wnXSwgICAgLy8gVXNlIHZpZXdwb3J0IGNsaXBwaW5nXG5cdFsnd2lkdGgnLCAncncnLCAnaW50J10sICAgICAgICAvLyBEaXNwbGF5IGFyZWEgd2lkdGhcblx0WydoZWlnaHQnLCAncncnLCAnaW50J10sICAgICAgIC8vIERpc3BsYXkgYXJlYSBoZWlnaHRcblx0WydtYXhXaWR0aCcsICdydycsICdpbnQnXSwgICAgIC8vIFZpZXdwb3J0IG1heCB3aWR0aCAoMCBpZiBkaXNhYmxlZClcblx0WydtYXhIZWlnaHQnLCAncncnLCAnaW50J10sICAgIC8vIFZpZXdwb3J0IG1heCBoZWlnaHQgKDAgaWYgZGlzYWJsZWQpXG5cblx0WydyZW5kZXJfbW9kZScsICdybycsICdzdHInXSwgIC8vIENhbnZhcyByZW5kZXJpbmcgbW9kZSAocmVhZC1vbmx5KVxuXG5cdFsncHJlZmVyX2pzJywgJ3J3JywgJ3N0ciddLCAgICAvLyBQcmVmZXIgSmF2YXNjcmlwdCBvdmVyIGNhbnZhcyBtZXRob2RzXG5cdFsnY3Vyc29yX3VyaScsICdydycsICdyYXcnXSAgICAvLyBDYW4gd2UgcmVuZGVyIGN1cnNvciB1c2luZyBkYXRhIFVSSVxuXSk7XG5cblxuLy8gQ2xhc3MgTWV0aG9kc1xuRGlzcGxheS5jaGFuZ2VDdXJzb3IgPSBmdW5jdGlvbiAodGFyZ2V0LCBwaXhlbHMsIG1hc2ssIGhvdHgsIGhvdHksIHcwLCBoMCwgY21hcCkge1xuXHR2YXIgdyA9IHcwO1xuXHR2YXIgaCA9IGgwO1xuXHRpZiAoaCA8IHcpIHtcblx0XHRoID0gdzsgIC8vIGluY3JlYXNlIGggdG8gbWFrZSBpdCBzcXVhcmVcblx0fSBlbHNlIHtcblx0XHR3ID0gaDsgIC8vIGluY3JlYXNlIHcgdG8gbWFrZSBpdCBzcXVhcmVcblx0fVxuXG5cdHZhciBjdXIgPSBbXTtcblxuXHQvLyBQdXNoIG11bHRpLWJ5dGUgbGl0dGxlLWVuZGlhbiB2YWx1ZXNcblx0Y3VyLnB1c2gxNmxlID0gZnVuY3Rpb24gKG51bSkge1xuXHRcdHRoaXMucHVzaChudW0gJiAweEZGLCAobnVtID4+IDgpICYgMHhGRik7XG5cdH07XG5cdGN1ci5wdXNoMzJsZSA9IGZ1bmN0aW9uIChudW0pIHtcblx0XHR0aGlzLnB1c2gobnVtICYgMHhGRixcblx0XHRcdFx0XHQobnVtID4+IDgpICYgMHhGRixcblx0XHRcdFx0XHQobnVtID4+IDE2KSAmIDB4RkYsXG5cdFx0XHRcdFx0KG51bSA+PiAyNCkgJiAweEZGKTtcblx0fTtcblxuXHR2YXIgSUhEUnN6ID0gNDA7XG5cdHZhciBSR0JzeiA9IHcgKiBoICogNDtcblx0dmFyIFhPUnN6ID0gTWF0aC5jZWlsKCh3ICogaCkgLyA4LjApO1xuXHR2YXIgQU5Ec3ogPSBNYXRoLmNlaWwoKHcgKiBoKSAvIDguMCk7XG5cblx0Y3VyLnB1c2gxNmxlKDApOyAgICAgICAgLy8gMDogUmVzZXJ2ZWRcblx0Y3VyLnB1c2gxNmxlKDIpOyAgICAgICAgLy8gMjogLkNVUiB0eXBlXG5cdGN1ci5wdXNoMTZsZSgxKTsgICAgICAgIC8vIDQ6IE51bWJlciBvZiBpbWFnZXMsIDEgZm9yIG5vbi1hbmltYXRlZCBpY29cblxuXHQvLyBDdXJzb3IgIzEgaGVhZGVyIChJQ09ORElSRU5UUlkpXG5cdGN1ci5wdXNoKHcpOyAgICAgICAgICAgIC8vIDY6IHdpZHRoXG5cdGN1ci5wdXNoKGgpOyAgICAgICAgICAgIC8vIDc6IGhlaWdodFxuXHRjdXIucHVzaCgwKTsgICAgICAgICAgICAvLyA4OiBjb2xvcnMsIDAgLT4gdHJ1ZS1jb2xvclxuXHRjdXIucHVzaCgwKTsgICAgICAgICAgICAvLyA5OiByZXNlcnZlZFxuXHRjdXIucHVzaDE2bGUoaG90eCk7ICAgICAvLyAxMDogaG90c3BvdCB4IGNvb3JkaW5hdGVcblx0Y3VyLnB1c2gxNmxlKGhvdHkpOyAgICAgLy8gMTI6IGhvdHNwb3QgeSBjb29yZGluYXRlXG5cdGN1ci5wdXNoMzJsZShJSERSc3ogKyBSR0JzeiArIFhPUnN6ICsgQU5Ec3opO1xuXHRcdFx0XHRcdFx0XHQvLyAxNDogY3Vyc29yIGRhdGEgYnl0ZSBzaXplXG5cdGN1ci5wdXNoMzJsZSgyMik7ICAgICAgIC8vIDE4OiBvZmZzZXQgb2YgY3Vyc29yIGRhdGEgaW4gdGhlIGZpbGVcblxuXHQvLyBDdXJzb3IgIzEgSW5mb0hlYWRlciAoSUNPTklNQUdFL0JJVE1BUElORk8pXG5cdGN1ci5wdXNoMzJsZShJSERSc3opOyAgIC8vIDIyOiBJbmZvSGVhZGVyIHNpemVcblx0Y3VyLnB1c2gzMmxlKHcpOyAgICAgICAgLy8gMjY6IEN1cnNvciB3aWR0aFxuXHRjdXIucHVzaDMybGUoaCAqIDIpOyAgICAvLyAzMDogWE9SK0FORCBoZWlnaHRcblx0Y3VyLnB1c2gxNmxlKDEpOyAgICAgICAgLy8gMzQ6IG51bWJlciBvZiBwbGFuZXNcblx0Y3VyLnB1c2gxNmxlKDMyKTsgICAgICAgLy8gMzY6IGJpdHMgcGVyIHBpeGVsXG5cdGN1ci5wdXNoMzJsZSgwKTsgICAgICAgIC8vIDM4OiBUeXBlIG9mIGNvbXByZXNzaW9uXG5cblx0Y3VyLnB1c2gzMmxlKFhPUnN6ICsgQU5Ec3opO1xuXHRcdFx0XHRcdFx0XHQvLyA0MjogU2l6ZSBvZiBJbWFnZVxuXHRjdXIucHVzaDMybGUoMCk7ICAgICAgICAvLyA0NjogcmVzZXJ2ZWRcblx0Y3VyLnB1c2gzMmxlKDApOyAgICAgICAgLy8gNTA6IHJlc2VydmVkXG5cdGN1ci5wdXNoMzJsZSgwKTsgICAgICAgIC8vIDU0OiByZXNlcnZlZFxuXHRjdXIucHVzaDMybGUoMCk7ICAgICAgICAvLyA1ODogcmVzZXJ2ZWRcblxuXHQvLyA2MjogY29sb3IgZGF0YSAoUkdCUVVBRCBpY0NvbG9yc1tdKVxuXHR2YXIgeSwgeDtcblx0Zm9yICh5ID0gaCAtIDE7IHkgPj0gMDsgeS0tKSB7XG5cdFx0Zm9yICh4ID0gMDsgeCA8IHc7IHgrKykge1xuXHRcdFx0aWYgKHggPj0gdzAgfHwgeSA+PSBoMCkge1xuXHRcdFx0XHRjdXIucHVzaCgwKTsgIC8vIGJsdWVcblx0XHRcdFx0Y3VyLnB1c2goMCk7ICAvLyBncmVlblxuXHRcdFx0XHRjdXIucHVzaCgwKTsgIC8vIHJlZFxuXHRcdFx0XHRjdXIucHVzaCgwKTsgIC8vIGFscGhhXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgaWR4ID0geSAqIE1hdGguY2VpbCh3MCAvIDgpICsgTWF0aC5mbG9vcih4IC8gOCk7XG5cdFx0XHRcdHZhciBhbHBoYSA9IChtYXNrW2lkeF0gPDwgKHggJSA4KSkgJiAweDgwID8gMjU1IDogMDtcblx0XHRcdFx0aWYgKGNtYXApIHtcblx0XHRcdFx0XHRpZHggPSAodzAgKiB5KSArIHg7XG5cdFx0XHRcdFx0dmFyIHJnYiA9IGNtYXBbcGl4ZWxzW2lkeF1dO1xuXHRcdFx0XHRcdGN1ci5wdXNoKHJnYlsyXSk7ICAvLyBibHVlXG5cdFx0XHRcdFx0Y3VyLnB1c2gocmdiWzFdKTsgIC8vIGdyZWVuXG5cdFx0XHRcdFx0Y3VyLnB1c2gocmdiWzBdKTsgIC8vIHJlZFxuXHRcdFx0XHRcdGN1ci5wdXNoKGFscGhhKTsgICAvLyBhbHBoYVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlkeCA9ICgodzAgKiB5KSArIHgpICogNDtcblx0XHRcdFx0XHRjdXIucHVzaChwaXhlbHNbaWR4ICsgMl0pOyAvLyBibHVlXG5cdFx0XHRcdFx0Y3VyLnB1c2gocGl4ZWxzW2lkeCArIDFdKTsgLy8gZ3JlZW5cblx0XHRcdFx0XHRjdXIucHVzaChwaXhlbHNbaWR4XSk7ICAgICAvLyByZWRcblx0XHRcdFx0XHRjdXIucHVzaChhbHBoYSk7ICAgICAgICAgICAvLyBhbHBoYVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Ly8gWE9SL2JpdG1hc2sgZGF0YSAoQllURSBpY1hPUltdKVxuXHQvLyAoaWdub3JlZCwganVzdCBuZWVkcyB0byBiZSB0aGUgcmlnaHQgc2l6ZSlcblx0Zm9yICh5ID0gMDsgeSA8IGg7IHkrKykge1xuXHRcdGZvciAoeCA9IDA7IHggPCBNYXRoLmNlaWwodyAvIDgpOyB4KyspIHtcblx0XHRcdGN1ci5wdXNoKDApO1xuXHRcdH1cblx0fVxuXG5cdC8vIEFORC9iaXRtYXNrIGRhdGEgKEJZVEUgaWNBTkRbXSlcblx0Ly8gKGlnbm9yZWQsIGp1c3QgbmVlZHMgdG8gYmUgdGhlIHJpZ2h0IHNpemUpXG5cdGZvciAoeSA9IDA7IHkgPCBoOyB5KyspIHtcblx0XHRmb3IgKHggPSAwOyB4IDwgTWF0aC5jZWlsKHcgLyA4KTsgeCsrKSB7XG5cdFx0XHRjdXIucHVzaCgwKTtcblx0XHR9XG5cdH1cblxuXHR2YXIgdXJsID0gJ2RhdGE6aW1hZ2UveC1pY29uO2Jhc2U2NCwnICsgQmFzZTY0LmVuY29kZShjdXIpO1xuXHR0YXJnZXQuc3R5bGUuY3Vyc29yID0gJ3VybCgnICsgdXJsICsgJyknICsgaG90eCArICcgJyArIGhvdHkgKyAnLCBkZWZhdWx0Jztcbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vbm9kZV9tb2R1bGVzL25vdm5jLW5vZGUvbGliL2Rpc3BsYXkuanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvbm92bmMtbm9kZS9saWJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKlxuICogbm9WTkM6IEhUTUw1IFZOQyBjbGllbnRcbiAqIENvcHlyaWdodCAoQykgMjAxMiBKb2VsIE1hcnRpblxuICogQ29weXJpZ2h0IChDKSAyMDEzIFNhbXVlbCBNYW5uZWhlZCBmb3IgQ2VuZGlvIEFCXG4gKiBMaWNlbnNlZCB1bmRlciBNUEwgMi4wIG9yIGFueSBsYXRlciB2ZXJzaW9uIChzZWUgTElDRU5TRS50eHQpXG4gKi9cblxuXG4vKipcbiAqIEV4cG9zZSB0aGUgSW5wdXQgT2JqZWN0LlxuICovXG52YXIgSW5wdXQgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5cbi8qKlxuICogRGVwZW5kZW5jaWVzLlxuICovXG52YXIgZGVidWdrZXlib2FyZCA9IHJlcXVpcmUoJ2RlYnVnJykoJ25vVk5DOklucHV0OktleWJvcmQnKTtcbnZhciBkZWJ1Z21vdXNlID0gcmVxdWlyZSgnZGVidWcnKSgnbm9WTkM6SW5wdXQ6TW91c2UnKTtcbnZhciBicm93c2VyID0gcmVxdWlyZSgnYm93c2VyJykuYnJvd3NlcjtcbnZhciBVdGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIga2JkVXRpbCA9IHJlcXVpcmUoJy4va2JkdXRpbCcpO1xuXG5cbmZ1bmN0aW9uIEtleWJvYXJkIChkZWZhdWx0cykge1xuXHR0aGlzLl9rZXlEb3duTGlzdCA9IFtdOyAgLy8gTGlzdCBvZiBkZXByZXNzZWQga2V5c1xuXHRcdFx0XHRcdFx0XHRcdFx0ICAgICAgICAgLy8gKGV2ZW4gaWYgdGhleSBhcmUgaGFwcHkpXG5cblx0VXRpbC5zZXRfZGVmYXVsdHModGhpcywgZGVmYXVsdHMsIHtcblx0XHQndGFyZ2V0JzogZG9jdW1lbnQsXG5cdFx0J2ZvY3VzZWQnOiB0cnVlXG5cdH0pO1xuXG5cdC8vIGNyZWF0ZSB0aGUga2V5Ym9hcmQgaGFuZGxlclxuXHR0aGlzLl9oYW5kbGVyID0gbmV3IGtiZFV0aWwuS2V5RXZlbnREZWNvZGVyKGtiZFV0aWwuTW9kaWZpZXJTeW5jKCksXG5cdFx0a2JkVXRpbC5WZXJpZnlDaGFyTW9kaWZpZXIoXG5cdFx0XHRrYmRVdGlsLlRyYWNrS2V5U3RhdGUoXG5cdFx0XHRcdGtiZFV0aWwuRXNjYXBlTW9kaWZpZXJzKHRoaXMuX2hhbmRsZVJmYkV2ZW50LmJpbmQodGhpcykpXG5cdFx0XHQpXG5cdFx0KVxuXHQpOyAvKiBqc2hpbnQgbmV3Y2FwOiB0cnVlICovXG5cblx0Ly8ga2VlcCB0aGVzZSBoZXJlIHNvIHdlIGNhbiByZWZlciB0byB0aGVtIGxhdGVyXG5cdHRoaXMuX2V2ZW50SGFuZGxlcnMgPSB7XG5cdFx0J2tleXVwJzogdGhpcy5faGFuZGxlS2V5VXAuYmluZCh0aGlzKSxcblx0XHQna2V5ZG93bic6IHRoaXMuX2hhbmRsZUtleURvd24uYmluZCh0aGlzKSxcblx0XHQna2V5cHJlc3MnOiB0aGlzLl9oYW5kbGVLZXlQcmVzcy5iaW5kKHRoaXMpLFxuXHRcdCdibHVyJzogdGhpcy5fYWxsS2V5c1VwLmJpbmQodGhpcylcblx0fTtcbn1cblxuXG5LZXlib2FyZC5wcm90b3R5cGUgPSB7XG5cdF9oYW5kbGVSZmJFdmVudDogZnVuY3Rpb24gKGUpIHtcblx0XHRpZiAodGhpcy5fb25LZXlQcmVzcykge1xuXHRcdFx0ZGVidWdrZXlib2FyZCgnb25LZXlQcmVzczogJyArIChlLnR5cGUgPT09ICdrZXlkb3duJyA/ICdkb3duJyA6ICd1cCcpICtcblx0XHRcdFx0XHQgICAnLCBrZXlzeW06ICcgKyBlLmtleXN5bS5rZXlzeW0gKyAnKCcgKyBlLmtleXN5bS5rZXluYW1lICsgJyknKTtcblx0XHRcdHRoaXMuX29uS2V5UHJlc3MoZS5rZXlzeW0ua2V5c3ltLCBlLnR5cGUgPT09ICdrZXlkb3duJyk7XG5cdFx0fVxuXHR9LFxuXG5cdF9oYW5kbGVLZXlEb3duOiBmdW5jdGlvbiAoZSkge1xuXHRcdGlmICghdGhpcy5fZm9jdXNlZCkgeyByZXR1cm4gdHJ1ZTsgfVxuXG5cdFx0aWYgKHRoaXMuX2hhbmRsZXIua2V5ZG93bihlKSkge1xuXHRcdFx0Ly8gU3VwcHJlc3MgYnViYmxpbmcvZGVmYXVsdCBhY3Rpb25zXG5cdFx0XHRVdGlsLnN0b3BFdmVudChlKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gQWxsb3cgdGhlIGV2ZW50IHRvIGJ1YmJsZSBhbmQgYmVjb21lIGEga2V5UHJlc3MgZXZlbnQgd2hpY2hcblx0XHRcdC8vIHdpbGwgaGF2ZSB0aGUgY2hhcmFjdGVyIGNvZGUgdHJhbnNsYXRlZFxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9LFxuXG5cdF9oYW5kbGVLZXlQcmVzczogZnVuY3Rpb24gKGUpIHtcblx0XHRpZiAoIXRoaXMuX2ZvY3VzZWQpIHsgcmV0dXJuIHRydWU7IH1cblxuXHRcdGlmICh0aGlzLl9oYW5kbGVyLmtleXByZXNzKGUpKSB7XG5cdFx0XHQvLyBTdXBwcmVzcyBidWJibGluZy9kZWZhdWx0IGFjdGlvbnNcblx0XHRcdFV0aWwuc3RvcEV2ZW50KGUpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBBbGxvdyB0aGUgZXZlbnQgdG8gYnViYmxlIGFuZCBiZWNvbWUgYSBrZXlQcmVzcyBldmVudCB3aGljaFxuXHRcdFx0Ly8gd2lsbCBoYXZlIHRoZSBjaGFyYWN0ZXIgY29kZSB0cmFuc2xhdGVkXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH0sXG5cblx0X2hhbmRsZUtleVVwOiBmdW5jdGlvbiAoZSkge1xuXHRcdGlmICghdGhpcy5fZm9jdXNlZCkgeyByZXR1cm4gdHJ1ZTsgfVxuXG5cdFx0aWYgKHRoaXMuX2hhbmRsZXIua2V5dXAoZSkpIHtcblx0XHRcdC8vIFN1cHByZXNzIGJ1YmJsaW5nL2RlZmF1bHQgYWN0aW9uc1xuXHRcdFx0VXRpbC5zdG9wRXZlbnQoZSk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIEFsbG93IHRoZSBldmVudCB0byBidWJibGUgYW5kIGJlY29tZSBhIGtleVVwIGV2ZW50IHdoaWNoXG5cdFx0XHQvLyB3aWxsIGhhdmUgdGhlIGNoYXJhY3RlciBjb2RlIHRyYW5zbGF0ZWRcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fSxcblxuXHRfYWxsS2V5c1VwOiBmdW5jdGlvbiAoKSB7XG5cdFx0ZGVidWdrZXlib2FyZCgnYWxsS2V5c1VwJyk7XG5cdFx0dGhpcy5faGFuZGxlci5yZWxlYXNlQWxsKCk7XG5cdH0sXG5cblx0Ly8gUHVibGljIG1ldGhvZHNcblxuXHRncmFiOiBmdW5jdGlvbiAoKSB7XG5cdFx0ZGVidWdrZXlib2FyZCgnZ3JhYigpJyk7XG5cblx0XHR2YXIgYyA9IHRoaXMuX3RhcmdldDtcblxuXHRcdFV0aWwuYWRkRXZlbnQoYywgJ2tleWRvd24nLCB0aGlzLl9ldmVudEhhbmRsZXJzLmtleWRvd24pO1xuXHRcdFV0aWwuYWRkRXZlbnQoYywgJ2tleXVwJywgdGhpcy5fZXZlbnRIYW5kbGVycy5rZXl1cCk7XG5cdFx0VXRpbC5hZGRFdmVudChjLCAna2V5cHJlc3MnLCB0aGlzLl9ldmVudEhhbmRsZXJzLmtleXByZXNzKTtcblxuXHRcdC8vIFJlbGVhc2UgKGtleSB1cCkgaWYgZ2xvYmFsIGxvc2VzIGZvY3VzXG5cdFx0VXRpbC5hZGRFdmVudChnbG9iYWwsICdibHVyJywgdGhpcy5fZXZlbnRIYW5kbGVycy5ibHVyKTtcblx0fSxcblxuXHR1bmdyYWI6IGZ1bmN0aW9uICgpIHtcblx0XHRkZWJ1Z2tleWJvYXJkKCd1bmdyYWIoKScpO1xuXG5cdFx0dmFyIGMgPSB0aGlzLl90YXJnZXQ7XG5cblx0XHRVdGlsLnJlbW92ZUV2ZW50KGMsICdrZXlkb3duJywgdGhpcy5fZXZlbnRIYW5kbGVycy5rZXlkb3duKTtcblx0XHRVdGlsLnJlbW92ZUV2ZW50KGMsICdrZXl1cCcsIHRoaXMuX2V2ZW50SGFuZGxlcnMua2V5dXApO1xuXHRcdFV0aWwucmVtb3ZlRXZlbnQoYywgJ2tleXByZXNzJywgdGhpcy5fZXZlbnRIYW5kbGVycy5rZXlwcmVzcyk7XG5cdFx0VXRpbC5yZW1vdmVFdmVudChnbG9iYWwsICdibHVyJywgdGhpcy5fZXZlbnRIYW5kbGVycy5ibHVyKTtcblxuXHRcdC8vIFJlbGVhc2UgKGtleSB1cCkgYWxsIGtleXMgdGhhdCBhcmUgaW4gYSBkb3duIHN0YXRlXG5cdFx0dGhpcy5fYWxsS2V5c1VwKCk7XG5cdH0sXG5cblx0c3luYzogZnVuY3Rpb24gKGUpIHtcblx0XHR0aGlzLl9oYW5kbGVyLnN5bmNNb2RpZmllcnMoZSk7XG5cdH1cbn07XG5cblxuVXRpbC5tYWtlX3Byb3BlcnRpZXMoS2V5Ym9hcmQsIFtcblx0Wyd0YXJnZXQnLCAgICAgJ3dvJywgJ2RvbSddLCAgLy8gRE9NIGVsZW1lbnQgdGhhdCBjYXB0dXJlcyBrZXlib2FyZCBpbnB1dFxuXHRbJ2ZvY3VzZWQnLCAgICAncncnLCAnYm9vbCddLCAvLyBDYXB0dXJlIGFuZCBzZW5kIGtleSBldmVudHNcblx0WydvbktleVByZXNzJywgJ3J3JywgJ2Z1bmMnXSAvLyBIYW5kbGVyIGZvciBrZXkgcHJlc3MvcmVsZWFzZVxuXSk7XG5cblxuZnVuY3Rpb24gTW91c2UgKGRlZmF1bHRzKSB7XG5cdHRoaXMuX21vdXNlQ2FwdHVyZWQgID0gZmFsc2U7XG5cblx0dGhpcy5fZG91YmxlQ2xpY2tUaW1lciA9IG51bGw7XG5cdHRoaXMuX2xhc3RUb3VjaFBvcyA9IG51bGw7XG5cblx0Ly8gQ29uZmlndXJhdGlvbiBhdHRyaWJ1dGVzXG5cdFV0aWwuc2V0X2RlZmF1bHRzKHRoaXMsIGRlZmF1bHRzLCB7XG5cdFx0J3RhcmdldCc6IGRvY3VtZW50LFxuXHRcdCdmb2N1c2VkJzogdHJ1ZSxcblx0XHQnc2NhbGUnOiAxLjAsXG5cdFx0J3pvb20nOiAxLjAsXG5cdFx0J3RvdWNoQnV0dG9uJzogMVxuXHR9KTtcblxuXHR0aGlzLl9ldmVudEhhbmRsZXJzID0ge1xuXHRcdCdtb3VzZWRvd24nOiB0aGlzLl9oYW5kbGVNb3VzZURvd24uYmluZCh0aGlzKSxcblx0XHQnbW91c2V1cCc6IHRoaXMuX2hhbmRsZU1vdXNlVXAuYmluZCh0aGlzKSxcblx0XHQnbW91c2Vtb3ZlJzogdGhpcy5faGFuZGxlTW91c2VNb3ZlLmJpbmQodGhpcyksXG5cdFx0J21vdXNld2hlZWwnOiB0aGlzLl9oYW5kbGVNb3VzZVdoZWVsLmJpbmQodGhpcyksXG5cdFx0J21vdXNlZGlzYWJsZSc6IHRoaXMuX2hhbmRsZU1vdXNlRGlzYWJsZS5iaW5kKHRoaXMpXG5cdH07XG59XG5cblxuTW91c2UucHJvdG90eXBlID0ge1xuXHRfY2FwdHVyZU1vdXNlOiBmdW5jdGlvbiAoKSB7XG5cdFx0Ly8gY2FwdHVyaW5nIHRoZSBtb3VzZSBlbnN1cmVzIHdlIGdldCB0aGUgbW91c2V1cCBldmVudFxuXHRcdGlmICh0aGlzLl90YXJnZXQuc2V0Q2FwdHVyZSkge1xuXHRcdFx0dGhpcy5fdGFyZ2V0LnNldENhcHR1cmUoKTtcblx0XHR9XG5cblx0XHQvLyBzb21lIGJyb3dzZXJzIGdpdmUgdXMgbW91c2V1cCBldmVudHMgcmVnYXJkbGVzcyxcblx0XHQvLyBzbyBpZiB3ZSBuZXZlciBjYXB0dXJlZCB0aGUgbW91c2UsIHdlIGNhbiBkaXNyZWdhcmQgdGhlIGV2ZW50XG5cdFx0dGhpcy5fbW91c2VDYXB0dXJlZCA9IHRydWU7XG5cdH0sXG5cblx0X3JlbGVhc2VNb3VzZTogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLl90YXJnZXQucmVsZWFzZUNhcHR1cmUpIHtcblx0XHRcdHRoaXMuX3RhcmdldC5yZWxlYXNlQ2FwdHVyZSgpO1xuXHRcdH1cblx0XHR0aGlzLl9tb3VzZUNhcHR1cmVkID0gZmFsc2U7XG5cdH0sXG5cblx0X3Jlc2V0RG91YmxlQ2xpY2tUaW1lcjogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuX2RvdWJsZUNsaWNrVGltZXIgPSBudWxsO1xuXHR9LFxuXG5cdF9oYW5kbGVNb3VzZUJ1dHRvbjogZnVuY3Rpb24gKGUsIGRvd24pIHtcblx0XHRpZiAoIXRoaXMuX2ZvY3VzZWQpIHsgcmV0dXJuIHRydWU7IH1cblxuXHRcdGlmICh0aGlzLl9ub3RpZnkpIHtcblx0XHRcdHRoaXMuX25vdGlmeShlKTtcblx0XHR9XG5cblx0XHR2YXIgZXZ0ID0gKGUgPyBlIDogZ2xvYmFsLmV2ZW50KTtcblx0XHR2YXIgcG9zID0gVXRpbC5nZXRFdmVudFBvc2l0aW9uKGUsIHRoaXMuX3RhcmdldCwgdGhpcy5fc2NhbGUsIHRoaXMuX3pvb20pO1xuXG5cdFx0dmFyIGJtYXNrO1xuXHRcdGlmIChlLnRvdWNoZXMgfHwgZS5jaGFuZ2VkVG91Y2hlcykge1xuXHRcdFx0Ly8gVG91Y2ggZGV2aWNlXG5cblx0XHRcdC8vIFdoZW4gdHdvIHRvdWNoZXMgb2NjdXIgd2l0aGluIDUwMCBtcyBvZiBlYWNoIG90aGVyIGFuZCBhcmVcblx0XHRcdC8vIGNsb3NlciB0aGFuIDIwIHBpeGVscyB0b2dldGhlciBhIGRvdWJsZSBjbGljayBpcyB0cmlnZ2VyZWQuXG5cdFx0XHRpZiAoZG93biA9PT0gMSkge1xuXHRcdFx0XHRpZiAodGhpcy5fZG91YmxlQ2xpY2tUaW1lciA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHRoaXMuX2xhc3RUb3VjaFBvcyA9IHBvcztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQodGhpcy5fZG91YmxlQ2xpY2tUaW1lcik7XG5cblx0XHRcdFx0XHQvLyBXaGVuIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSB0d28gdG91Y2hlcyBpcyBzbWFsbCBlbm91Z2hcblx0XHRcdFx0XHQvLyBmb3JjZSB0aGUgcG9zaXRpb24gb2YgdGhlIGxhdHRlciB0b3VjaCB0byB0aGUgcG9zaXRpb24gb2Zcblx0XHRcdFx0XHQvLyB0aGUgZmlyc3QuXG5cblx0XHRcdFx0XHR2YXIgeHMgPSB0aGlzLl9sYXN0VG91Y2hQb3MueCAtIHBvcy54O1xuXHRcdFx0XHRcdHZhciB5cyA9IHRoaXMuX2xhc3RUb3VjaFBvcy55IC0gcG9zLnk7XG5cdFx0XHRcdFx0dmFyIGQgPSBNYXRoLnNxcnQoKHhzICogeHMpICsgKHlzICogeXMpKTtcblxuXHRcdFx0XHRcdC8vIFRoZSBnb2FsIGlzIHRvIHRyaWdnZXIgb24gYSBjZXJ0YWluIHBoeXNpY2FsIHdpZHRoLCB0aGVcblx0XHRcdFx0XHQvLyBkZXZpY2VQaXhlbFJhdGlvIGJyaW5ncyB1cyBhIGJpdCBjbG9zZXIgYnV0IGlzIG5vdCBvcHRpbWFsLlxuXHRcdFx0XHRcdGlmIChkIDwgMjAgKiBnbG9iYWwuZGV2aWNlUGl4ZWxSYXRpbykge1xuXHRcdFx0XHRcdFx0cG9zID0gdGhpcy5fbGFzdFRvdWNoUG9zO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl9kb3VibGVDbGlja1RpbWVyID0gc2V0VGltZW91dCh0aGlzLl9yZXNldERvdWJsZUNsaWNrVGltZXIuYmluZCh0aGlzKSwgNTAwKTtcblx0XHRcdH1cblx0XHRcdGJtYXNrID0gdGhpcy5fdG91Y2hCdXR0b247XG5cdFx0XHQvLyBJZiBibWFzayBpcyBzZXRcblx0XHR9IGVsc2UgaWYgKGV2dC53aGljaCkge1xuXHRcdFx0LyogZXZlcnl0aGluZyBleGNlcHQgSUUgKi9cblx0XHRcdGJtYXNrID0gMSA8PCBldnQuYnV0dG9uO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvKiBJRSBpbmNsdWRpbmcgOSAqL1xuXHRcdFx0Ym1hc2sgPSAoZXZ0LmJ1dHRvbiAmIDB4MSkgKyAgICAgIC8vIExlZnRcblx0XHRcdFx0XHQoZXZ0LmJ1dHRvbiAmIDB4MikgKiAyICsgIC8vIFJpZ2h0XG5cdFx0XHRcdFx0KGV2dC5idXR0b24gJiAweDQpIC8gMjsgICAvLyBNaWRkbGVcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fb25Nb3VzZUJ1dHRvbikge1xuXHRcdFx0ZGVidWdtb3VzZSgnb25Nb3VzZUJ1dHRvbjogJyArIChkb3duID8gJ2Rvd24nIDogJ3VwJykgK1xuXHRcdFx0XHRcdCAgICcsIHg6ICcgKyBwb3MueCArICcsIHk6ICcgKyBwb3MueSArICcsIGJtYXNrOiAnICsgYm1hc2spO1xuXHRcdFx0dGhpcy5fb25Nb3VzZUJ1dHRvbihwb3MueCwgcG9zLnksIGRvd24sIGJtYXNrKTtcblx0XHR9XG5cblx0XHRVdGlsLnN0b3BFdmVudChlKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cblx0X2hhbmRsZU1vdXNlRG93bjogZnVuY3Rpb24gKGUpIHtcblx0XHR0aGlzLl9jYXB0dXJlTW91c2UoKTtcblx0XHR0aGlzLl9oYW5kbGVNb3VzZUJ1dHRvbihlLCAxKTtcblx0fSxcblxuXHRfaGFuZGxlTW91c2VVcDogZnVuY3Rpb24gKGUpIHtcblx0XHRpZiAoIXRoaXMuX21vdXNlQ2FwdHVyZWQpIHsgcmV0dXJuOyB9XG5cblx0XHR0aGlzLl9oYW5kbGVNb3VzZUJ1dHRvbihlLCAwKTtcblx0XHR0aGlzLl9yZWxlYXNlTW91c2UoKTtcblx0fSxcblxuXHRfaGFuZGxlTW91c2VXaGVlbDogZnVuY3Rpb24gKGUpIHtcblx0XHRpZiAoIXRoaXMuX2ZvY3VzZWQpIHsgcmV0dXJuIHRydWU7IH1cblxuXHRcdGlmICh0aGlzLl9ub3RpZnkpIHtcblx0XHRcdHRoaXMuX25vdGlmeShlKTtcblx0XHR9XG5cblx0XHR2YXIgZXZ0ID0gKGUgPyBlIDogZ2xvYmFsLmV2ZW50KTtcblx0XHR2YXIgcG9zID0gVXRpbC5nZXRFdmVudFBvc2l0aW9uKGUsIHRoaXMuX3RhcmdldCwgdGhpcy5fc2NhbGUsIHRoaXMuX3pvb20pO1xuXHRcdHZhciB3aGVlbERhdGEgPSBldnQuZGV0YWlsID8gZXZ0LmRldGFpbCAqIC0xIDogZXZ0LndoZWVsRGVsdGEgLyA0MDtcblx0XHR2YXIgYm1hc2s7XG5cdFx0aWYgKHdoZWVsRGF0YSA+IDApIHtcblx0XHRcdGJtYXNrID0gMSA8PCAzO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRibWFzayA9IDEgPDwgNDtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fb25Nb3VzZUJ1dHRvbikge1xuXHRcdFx0dGhpcy5fb25Nb3VzZUJ1dHRvbihwb3MueCwgcG9zLnksIDEsIGJtYXNrKTtcblx0XHRcdHRoaXMuX29uTW91c2VCdXR0b24ocG9zLngsIHBvcy55LCAwLCBibWFzayk7XG5cdFx0fVxuXG5cdFx0VXRpbC5zdG9wRXZlbnQoZSk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXG5cdF9oYW5kbGVNb3VzZU1vdmU6IGZ1bmN0aW9uIChlKSB7XG5cdFx0aWYgKCF0aGlzLl9mb2N1c2VkKSB7IHJldHVybiB0cnVlOyB9XG5cblx0XHRpZiAodGhpcy5fbm90aWZ5KSB7XG5cdFx0XHR0aGlzLl9ub3RpZnkoZSk7XG5cdFx0fVxuXG5cdFx0dmFyIHBvcyA9IFV0aWwuZ2V0RXZlbnRQb3NpdGlvbihlLCB0aGlzLl90YXJnZXQsIHRoaXMuX3NjYWxlLCB0aGlzLl96b29tKTtcblx0XHRpZiAodGhpcy5fb25Nb3VzZU1vdmUpIHtcblx0XHRcdHRoaXMuX29uTW91c2VNb3ZlKHBvcy54LCBwb3MueSk7XG5cdFx0fVxuXG5cdFx0VXRpbC5zdG9wRXZlbnQoZSk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXG5cdF9oYW5kbGVNb3VzZURpc2FibGU6IGZ1bmN0aW9uIChlKSB7XG5cdFx0aWYgKCF0aGlzLl9mb2N1c2VkKSB7IHJldHVybiB0cnVlOyB9XG5cblx0XHR2YXIgcG9zID0gVXRpbC5nZXRFdmVudFBvc2l0aW9uKGUsIHRoaXMuX3RhcmdldCwgdGhpcy5fc2NhbGUsIHRoaXMuX3pvb20pO1xuXG5cdFx0LyogU3RvcCBwcm9wYWdhdGlvbiBpZiBpbnNpZGUgY2FudmFzIGFyZWEgKi9cblx0XHRpZiAoKHBvcy5yZWFseCA+PSAwKSAmJiAocG9zLnJlYWx5ID49IDApICYmXG5cdFx0XHQocG9zLnJlYWx4IDwgdGhpcy5fdGFyZ2V0Lm9mZnNldFdpZHRoKSAmJlxuXHRcdFx0KHBvcy5yZWFseSA8IHRoaXMuX3RhcmdldC5vZmZzZXRIZWlnaHQpKSB7XG5cblx0XHRcdFV0aWwuc3RvcEV2ZW50KGUpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9LFxuXG5cdC8vIFB1YmxpYyBtZXRob2RzXG5cblx0Z3JhYjogZnVuY3Rpb24gKCkge1xuXHRcdGRlYnVnbW91c2UoJ2dyYWIoKScpO1xuXG5cdFx0dmFyIGMgPSB0aGlzLl90YXJnZXQ7XG5cdFx0dmFyIGlzVG91Y2ggPSAnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cblx0XHRpZiAoaXNUb3VjaCkge1xuXHRcdFx0VXRpbC5hZGRFdmVudChjLCAndG91Y2hzdGFydCcsIHRoaXMuX2V2ZW50SGFuZGxlcnMubW91c2Vkb3duKTtcblx0XHRcdFV0aWwuYWRkRXZlbnQoZ2xvYmFsLCAndG91Y2hlbmQnLCB0aGlzLl9ldmVudEhhbmRsZXJzLm1vdXNldXApO1xuXHRcdFx0VXRpbC5hZGRFdmVudChjLCAndG91Y2hlbmQnLCB0aGlzLl9ldmVudEhhbmRsZXJzLm1vdXNldXApO1xuXHRcdFx0VXRpbC5hZGRFdmVudChjLCAndG91Y2htb3ZlJywgdGhpcy5fZXZlbnRIYW5kbGVycy5tb3VzZW1vdmUpO1xuXHRcdH1cblxuXHRcdGlmICghaXNUb3VjaCB8fCB0aGlzLl9lbmFibGVNb3VzZUFuZFRvdWNoKSB7XG5cdFx0XHRVdGlsLmFkZEV2ZW50KGMsICdtb3VzZWRvd24nLCB0aGlzLl9ldmVudEhhbmRsZXJzLm1vdXNlZG93bik7XG5cdFx0XHRVdGlsLmFkZEV2ZW50KGdsb2JhbCwgJ21vdXNldXAnLCB0aGlzLl9ldmVudEhhbmRsZXJzLm1vdXNldXApO1xuXHRcdFx0VXRpbC5hZGRFdmVudChjLCAnbW91c2V1cCcsIHRoaXMuX2V2ZW50SGFuZGxlcnMubW91c2V1cCk7XG5cdFx0XHRVdGlsLmFkZEV2ZW50KGMsICdtb3VzZW1vdmUnLCB0aGlzLl9ldmVudEhhbmRsZXJzLm1vdXNlbW92ZSk7XG5cdFx0XHRVdGlsLmFkZEV2ZW50KGMsIChicm93c2VyLmdlY2tvKSA/ICdET01Nb3VzZVNjcm9sbCcgOiAnbW91c2V3aGVlbCcsXG5cdFx0XHRcdFx0XHQgIHRoaXMuX2V2ZW50SGFuZGxlcnMubW91c2V3aGVlbCk7XG5cdFx0fVxuXG5cdFx0LyogV29yayBhcm91bmQgcmlnaHQgYW5kIG1pZGRsZSBjbGljayBicm93c2VyIGJlaGF2aW9ycyAqL1xuXHRcdFV0aWwuYWRkRXZlbnQoZG9jdW1lbnQsICdjbGljaycsIHRoaXMuX2V2ZW50SGFuZGxlcnMubW91c2VkaXNhYmxlKTtcblx0XHRVdGlsLmFkZEV2ZW50KGRvY3VtZW50LmJvZHksICdjb250ZXh0bWVudScsIHRoaXMuX2V2ZW50SGFuZGxlcnMubW91c2VkaXNhYmxlKTtcblx0fSxcblxuXHR1bmdyYWI6IGZ1bmN0aW9uICgpIHtcblx0XHRkZWJ1Z21vdXNlKCd1bmdyYWIoKScpO1xuXG5cdFx0dmFyIGMgPSB0aGlzLl90YXJnZXQ7XG5cdFx0dmFyIGlzVG91Y2ggPSAnb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cblx0XHRpZiAoaXNUb3VjaCkge1xuXHRcdFx0VXRpbC5yZW1vdmVFdmVudChjLCAndG91Y2hzdGFydCcsIHRoaXMuX2V2ZW50SGFuZGxlcnMubW91c2Vkb3duKTtcblx0XHRcdFV0aWwucmVtb3ZlRXZlbnQoZ2xvYmFsLCAndG91Y2hlbmQnLCB0aGlzLl9ldmVudEhhbmRsZXJzLm1vdXNldXApO1xuXHRcdFx0VXRpbC5yZW1vdmVFdmVudChjLCAndG91Y2hlbmQnLCB0aGlzLl9ldmVudEhhbmRsZXJzLm1vdXNldXApO1xuXHRcdFx0VXRpbC5yZW1vdmVFdmVudChjLCAndG91Y2htb3ZlJywgdGhpcy5fZXZlbnRIYW5kbGVycy5tb3VzZW1vdmUpO1xuXHRcdH1cblxuXHRcdGlmICghaXNUb3VjaCB8fCB0aGlzLl9lbmFibGVNb3VzZUFuZFRvdWNoKSB7XG5cdFx0XHRVdGlsLnJlbW92ZUV2ZW50KGMsICdtb3VzZWRvd24nLCB0aGlzLl9ldmVudEhhbmRsZXJzLm1vdXNlZG93bik7XG5cdFx0XHRVdGlsLnJlbW92ZUV2ZW50KGdsb2JhbCwgJ21vdXNldXAnLCB0aGlzLl9ldmVudEhhbmRsZXJzLm1vdXNldXApO1xuXHRcdFx0VXRpbC5yZW1vdmVFdmVudChjLCAnbW91c2V1cCcsIHRoaXMuX2V2ZW50SGFuZGxlcnMubW91c2V1cCk7XG5cdFx0XHRVdGlsLnJlbW92ZUV2ZW50KGMsICdtb3VzZW1vdmUnLCB0aGlzLl9ldmVudEhhbmRsZXJzLm1vdXNlbW92ZSk7XG5cdFx0XHRVdGlsLnJlbW92ZUV2ZW50KGMsIChicm93c2VyLmdlY2tvKSA/ICdET01Nb3VzZVNjcm9sbCcgOiAnbW91c2V3aGVlbCcsXG5cdFx0XHRcdFx0XHRcdCB0aGlzLl9ldmVudEhhbmRsZXJzLm1vdXNld2hlZWwpO1xuXHRcdH1cblxuXHRcdC8qIFdvcmsgYXJvdW5kIHJpZ2h0IGFuZCBtaWRkbGUgY2xpY2sgYnJvd3NlciBiZWhhdmlvcnMgKi9cblx0XHRVdGlsLnJlbW92ZUV2ZW50KGRvY3VtZW50LCAnY2xpY2snLCB0aGlzLl9ldmVudEhhbmRsZXJzLm1vdXNlZGlzYWJsZSk7XG5cdFx0VXRpbC5yZW1vdmVFdmVudChkb2N1bWVudC5ib2R5LCAnY29udGV4dG1lbnUnLCB0aGlzLl9ldmVudEhhbmRsZXJzLm1vdXNlZGlzYWJsZSk7XG5cblx0fVxufTtcblxuXG5VdGlsLm1ha2VfcHJvcGVydGllcyhNb3VzZSwgW1xuXHRbJ3RhcmdldCcsICAgICAgICAgJ3JvJywgJ2RvbSddLCAgIC8vIERPTSBlbGVtZW50IHRoYXQgY2FwdHVyZXMgbW91c2UgaW5wdXRcblx0Wydub3RpZnknLCAgICAgICAgICdybycsICdmdW5jJ10sICAvLyBGdW5jdGlvbiB0byBjYWxsIHRvIG5vdGlmeSB3aGVuZXZlciBhIG1vdXNlIGV2ZW50IGlzIHJlY2VpdmVkXG5cdFsnZm9jdXNlZCcsICAgICAgICAncncnLCAnYm9vbCddLCAgLy8gQ2FwdHVyZSBhbmQgc2VuZCBtb3VzZSBjbGlja3MvbW92ZW1lbnRcblx0WydzY2FsZScsICAgICAgICAgICdydycsICdmbG9hdCddLCAvLyBWaWV3cG9ydCBzY2FsZSBmYWN0b3IgMC4wIC0gMS4wXG5cdFsnem9vbScsICAgICAgICAgICAncncnLCAnZmxvYXQnXSwgLy8gQ1NTIHpvb20gYXBwbGllZCB0byB0aGUgRE9NIGVsZW1lbnQgdGhhdCBjYXB0dXJlcyBtb3VzZSBpbnB1dFxuXHRbJ2VuYWJsZU1vdXNlQW5kVG91Y2gnLCAncncnLCAnYm9vbCddLCAgLy8gV2hldGhlciBhbHNvIGVuYWJsZSBtb3VzZSBldmVudHMgd2hlbiB0b3VjaCBzY3JlZW4gaXMgZGV0ZWN0ZWRcblxuXHRbJ29uTW91c2VCdXR0b24nLCAgJ3J3JywgJ2Z1bmMnXSwgIC8vIEhhbmRsZXIgZm9yIG1vdXNlIGJ1dHRvbiBjbGljay9yZWxlYXNlXG5cdFsnb25Nb3VzZU1vdmUnLCAgICAncncnLCAnZnVuYyddLCAgLy8gSGFuZGxlciBmb3IgbW91c2UgbW92ZW1lbnRcblx0Wyd0b3VjaEJ1dHRvbicsICAgICdydycsICdpbnQnXSAgICAvLyBCdXR0b24gbWFzayAoMSwgMiwgNCkgZm9yIHRvdWNoIGRldmljZXMgKDAgbWVhbnMgaWdub3JlIGNsaWNrcylcbl0pO1xuXG5cbi8qKlxuICogQWRkIEtleWJvYXJkIGFuZCBNb3VzZSBpbiB0aGUgZXhwb3NlZCBPYmplY3QuXG4gKi9cbklucHV0LktleWJvYXJkID0gS2V5Ym9hcmQ7XG5JbnB1dC5Nb3VzZSA9IE1vdXNlO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ub3ZuYy1ub2RlL2xpYi9pbnB1dC5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ub3ZuYy1ub2RlL2xpYlwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxuICogRGVwZW5kZW5jaWVzLlxuICovXG52YXIgZGVidWdlcnJvciA9IHJlcXVpcmUoJ2RlYnVnJykoJ25vVk5DOkVSUk9SOktiZFV0aWwnKTtcbmRlYnVnZXJyb3IubG9nID0gY29uc29sZS53YXJuLmJpbmQoY29uc29sZSk7XG52YXIgS2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG5cbnZhciBLYmRVdGlsID0gbW9kdWxlLmV4cG9ydHMgPSB7XG5cdC8qKlxuXHQgKiBSZXR1cm4gdHJ1ZSBpZiBhIG1vZGlmaWVyIHdoaWNoIGlzIG5vdCB0aGUgc3BlY2lmaWVkIGNoYXIgbW9kaWZpZXIgKGFuZFxuXHQgKiBpcyBub3Qgc2hpZnQpIGlzIGRvd24uXG5cdCAqL1xuXHRoYXNTaG9ydGN1dE1vZGlmaWVyOiBmdW5jdGlvbiAoY2hhck1vZGlmaWVyLCBjdXJyZW50TW9kaWZpZXJzKSB7XG5cdFx0dmFyIG1vZHMgPSB7fTtcblx0XHRmb3IgKHZhciBrZXkgaW4gY3VycmVudE1vZGlmaWVycykge1xuXHRcdFx0aWYgKHBhcnNlSW50KGtleSkgIT09IEtleXMuWEtfU2hpZnRfTCkge1xuXHRcdFx0XHRtb2RzW2tleV0gPSBjdXJyZW50TW9kaWZpZXJzW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dmFyIHN1bSA9IDA7XG5cdFx0Zm9yICh2YXIgayBpbiBjdXJyZW50TW9kaWZpZXJzKSB7XG5cdFx0XHRpZiAobW9kc1trXSkge1xuXHRcdFx0XHQrK3N1bTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoS2JkVXRpbC5oYXNDaGFyTW9kaWZpZXIoY2hhck1vZGlmaWVyLCBtb2RzKSkge1xuXHRcdFx0cmV0dXJuIHN1bSA+IGNoYXJNb2RpZmllci5sZW5ndGg7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0cmV0dXJuIHN1bSA+IDA7XG5cdFx0fVxuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIGNoYXIgbW9kaWZpZXIgaXMgY3VycmVudGx5IGRvd24uXG5cdCAqL1xuXHRoYXNDaGFyTW9kaWZpZXI6IGZ1bmN0aW9uIChjaGFyTW9kaWZpZXIsIGN1cnJlbnRNb2RpZmllcnMpIHtcblx0XHRpZiAoY2hhck1vZGlmaWVyLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY2hhck1vZGlmaWVyLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRpZiAoIWN1cnJlbnRNb2RpZmllcnNbY2hhck1vZGlmaWVyW2ldXSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBIZWxwZXIgb2JqZWN0IHRyYWNraW5nIG1vZGlmaWVyIGtleSBzdGF0ZSBhbmQgZ2VuZXJhdGVzIGZha2Uga2V5IGV2ZW50c1xuXHQgKiB0byBjb21wZW5zYXRlIGlmIGl0IGdldHMgb3V0IG9mIHN5bmMuXG5cdCAqL1xuXHRNb2RpZmllclN5bmM6IGZ1bmN0aW9uIChjaGFyTW9kaWZpZXIpIHtcblx0XHRpZiAoIWNoYXJNb2RpZmllcikge1xuXHRcdFx0aWYgKGlzTWFjKCkpIHtcblx0XHRcdFx0Ly8gb24gTWFjLCBPcHRpb24gKEFLQSBBbHQpIGlzIHVzZWQgYXMgYSBjaGFyIG1vZGlmaWVyXG5cdFx0XHRcdGNoYXJNb2RpZmllciA9IFtLZXlzLlhLX0FsdF9MXTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKGlzV2luZG93cygpKSB7XG5cdFx0XHRcdC8vIG9uIFdpbmRvd3MsIEN0cmwrQWx0IGlzIHVzZWQgYXMgYSBjaGFyIG1vZGlmaWVyXG5cdFx0XHRcdGNoYXJNb2RpZmllciA9IFtLZXlzLlhLX0FsdF9MLCBLZXlzLlhLX0NvbnRyb2xfTF07XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChpc0xpbnV4KCkpIHtcblx0XHRcdFx0Ly8gb24gTGludXgsIElTTyBMZXZlbCAzIFNoaWZ0IChBbHRHcikgaXMgdXNlZCBhcyBhIGNoYXIgbW9kaWZpZXJcblx0XHRcdFx0Y2hhck1vZGlmaWVyID0gW0tleXMuWEtfSVNPX0xldmVsM19TaGlmdF07XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Y2hhck1vZGlmaWVyID0gW107XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dmFyIHN0YXRlID0ge307XG5cblx0XHRzdGF0ZVtLZXlzLlhLX0NvbnRyb2xfTF0gPSBmYWxzZTtcblx0XHRzdGF0ZVtLZXlzLlhLX0FsdF9MXSA9IGZhbHNlO1xuXHRcdHN0YXRlW0tleXMuWEtfSVNPX0xldmVsM19TaGlmdF0gPSBmYWxzZTtcblx0XHRzdGF0ZVtLZXlzLlhLX1NoaWZ0X0xdID0gZmFsc2U7XG5cdFx0c3RhdGVbS2V5cy5YS19NZXRhX0xdID0gZmFsc2U7XG5cblx0XHRmdW5jdGlvbiBzeW5jKGV2dCwga2V5c3ltKSB7XG5cdFx0XHR2YXIgcmVzdWx0ID0gW107XG5cblx0XHRcdGZ1bmN0aW9uIHN5bmNLZXkoa2V5c3ltKSB7XG5cdFx0XHRcdHJldHVybiB7a2V5c3ltOiBLZXlzLmxvb2t1cChrZXlzeW0pLCB0eXBlOiBzdGF0ZVtrZXlzeW1dID8gJ2tleWRvd24nIDogJ2tleXVwJ307XG5cdFx0XHR9XG5cblx0XHRcdGlmIChldnQuY3RybEtleSAhPT0gdW5kZWZpbmVkICYmXG5cdFx0XHRcdGV2dC5jdHJsS2V5ICE9PSBzdGF0ZVtLZXlzLlhLX0NvbnRyb2xfTF0gJiYga2V5c3ltICE9PSBLZXlzLlhLX0NvbnRyb2xfTCkge1xuXHRcdFx0XHRzdGF0ZVtLZXlzLlhLX0NvbnRyb2xfTF0gPSBldnQuY3RybEtleTtcblx0XHRcdFx0cmVzdWx0LnB1c2goc3luY0tleShLZXlzLlhLX0NvbnRyb2xfTCkpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGV2dC5hbHRLZXkgIT09IHVuZGVmaW5lZCAmJlxuXHRcdFx0XHRldnQuYWx0S2V5ICE9PSBzdGF0ZVtLZXlzLlhLX0FsdF9MXSAmJiBrZXlzeW0gIT09IEtleXMuWEtfQWx0X0wpIHtcblx0XHRcdFx0c3RhdGVbS2V5cy5YS19BbHRfTF0gPSBldnQuYWx0S2V5O1xuXHRcdFx0XHRyZXN1bHQucHVzaChzeW5jS2V5KEtleXMuWEtfQWx0X0wpKTtcblx0XHRcdH1cblx0XHRcdGlmIChldnQuYWx0R3JhcGhLZXkgIT09IHVuZGVmaW5lZCAmJlxuXHRcdFx0XHRldnQuYWx0R3JhcGhLZXkgIT09IHN0YXRlW0tleXMuWEtfSVNPX0xldmVsM19TaGlmdF0gJiYga2V5c3ltICE9PSBLZXlzLlhLX0lTT19MZXZlbDNfU2hpZnQpIHtcblx0XHRcdFx0c3RhdGVbS2V5cy5YS19JU09fTGV2ZWwzX1NoaWZ0XSA9IGV2dC5hbHRHcmFwaEtleTtcblx0XHRcdFx0cmVzdWx0LnB1c2goc3luY0tleShLZXlzLlhLX0lTT19MZXZlbDNfU2hpZnQpKTtcblx0XHRcdH1cblx0XHRcdGlmIChldnQuc2hpZnRLZXkgIT09IHVuZGVmaW5lZCAmJlxuXHRcdFx0XHRldnQuc2hpZnRLZXkgIT09IHN0YXRlW0tleXMuWEtfU2hpZnRfTF0gJiYga2V5c3ltICE9PSBLZXlzLlhLX1NoaWZ0X0wpIHtcblx0XHRcdFx0c3RhdGVbS2V5cy5YS19TaGlmdF9MXSA9IGV2dC5zaGlmdEtleTtcblx0XHRcdFx0cmVzdWx0LnB1c2goc3luY0tleShLZXlzLlhLX1NoaWZ0X0wpKTtcblx0XHRcdH1cblx0XHRcdGlmIChldnQubWV0YUtleSAhPT0gdW5kZWZpbmVkICYmXG5cdFx0XHRcdGV2dC5tZXRhS2V5ICE9PSBzdGF0ZVtLZXlzLlhLX01ldGFfTF0gJiYga2V5c3ltICE9PSBLZXlzLlhLX01ldGFfTCkge1xuXHRcdFx0XHRzdGF0ZVtLZXlzLlhLX01ldGFfTF0gPSBldnQubWV0YUtleTtcblx0XHRcdFx0cmVzdWx0LnB1c2goc3luY0tleShLZXlzLlhLX01ldGFfTCkpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBzeW5jS2V5RXZlbnQoZXZ0LCBkb3duKSB7XG5cdFx0XHR2YXIgb2JqID0gS2JkVXRpbC5nZXRLZXlzeW0oZXZ0KTtcblx0XHRcdHZhciBrZXlzeW0gPSBvYmogPyBvYmoua2V5c3ltIDogbnVsbDtcblxuXHRcdFx0Ly8gZmlyc3QsIGFwcGx5IHRoZSBldmVudCBpdHNlbGYsIGlmIHJlbGV2YW50XG5cdFx0XHRpZiAoa2V5c3ltICE9PSBudWxsICYmIHN0YXRlW2tleXN5bV0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRzdGF0ZVtrZXlzeW1dID0gZG93bjtcblx0XHRcdH1cblx0XHRcdHJldHVybiBzeW5jKGV2dCwga2V5c3ltKTtcblx0XHR9XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0Ly8gc3luYyBvbiB0aGUgYXBwcm9wcmlhdGUga2V5Ym9hcmQgZXZlbnRcblx0XHRcdGtleWRvd246IGZ1bmN0aW9uKGV2dCkgeyByZXR1cm4gc3luY0tleUV2ZW50KGV2dCwgdHJ1ZSk7IH0sXG5cdFx0XHRrZXl1cDogZnVuY3Rpb24oZXZ0KSB7IHJldHVybiBzeW5jS2V5RXZlbnQoZXZ0LCBmYWxzZSk7IH0sXG5cdFx0XHQvLyBDYWxsIHRoaXMgd2l0aCBhIG5vbi1rZXlib2FyZCBldmVudCAoc3VjaCBhcyBtb3VzZSBldmVudHMpIHRvIHVzZSBpdHMgbW9kaWZpZXIgc3RhdGUgdG8gc3luY2hyb25pemUgYW55d2F5XG5cdFx0XHRzeW5jQW55OiBmdW5jdGlvbihldnQpIHsgcmV0dXJuIHN5bmMoZXZ0KTsgfSxcblxuXHRcdFx0Ly8gaXMgYSBzaG9ydGN1dCBtb2RpZmllciBkb3duP1xuXHRcdFx0aGFzU2hvcnRjdXRNb2RpZmllcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBLYmRVdGlsLmhhc1Nob3J0Y3V0TW9kaWZpZXIoY2hhck1vZGlmaWVyLCBzdGF0ZSk7XG5cdFx0XHR9LFxuXHRcdFx0Ly8gaWYgYSBjaGFyIG1vZGlmaWVyIGlzIGRvd24sIHJldHVybiB0aGUga2V5cyBpdCBjb25zaXN0cyBvZiwgb3RoZXJ3aXNlIHJldHVybiBudWxsXG5cdFx0XHRhY3RpdmVDaGFyTW9kaWZpZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gS2JkVXRpbC5oYXNDaGFyTW9kaWZpZXIoY2hhck1vZGlmaWVyLCBzdGF0ZSkgPyBjaGFyTW9kaWZpZXIgOiBudWxsO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0sXG5cblx0LyoqXG5cdCAqIEdldCBhIGtleSBJRCBmcm9tIGEga2V5Ym9hcmQgZXZlbnQuXG5cdCAqIE1heSBiZSBhIHN0cmluZyBvciBhbiBpbnRlZ2VyIGRlcGVuZGluZyBvbiB0aGUgYXZhaWxhYmxlIHByb3BlcnRpZXMuXG5cdCAqL1xuXHRnZXRLZXk6IGZ1bmN0aW9uIChldnQpIHtcblx0XHRpZiAoJ2tleUNvZGUnIGluIGV2dCAmJiAna2V5JyBpbiBldnQpIHtcblx0XHRcdHJldHVybiBldnQua2V5ICsgJzonICsgZXZ0LmtleUNvZGU7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCdrZXlDb2RlJyBpbiBldnQpIHtcblx0XHRcdHJldHVybiBldnQua2V5Q29kZTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZXR1cm4gZXZ0LmtleTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIEdldCB0aGUgbW9zdCByZWxpYWJsZSBrZXlzeW0gdmFsdWUgd2UgY2FuIGdldCBmcm9tIGEga2V5IGV2ZW50LlxuXHQgKiBJZiBjaGFyL2NoYXJDb2RlIGlzIGF2YWlsYWJsZSwgcHJlZmVyIHRob3NlLCBvdGhlcndpc2UgZmFsbCBiYWNrIHRvXG5cdCAqIGtleS9rZXlDb2RlL3doaWNoLlxuXHQgKi9cblx0Z2V0S2V5c3ltOiBmdW5jdGlvbiAoZXZ0KSB7XG5cdFx0dmFyIGNvZGVwb2ludDtcblxuXHRcdGlmIChldnQuY2hhciAmJiBldnQuY2hhci5sZW5ndGggPT09IDEpIHtcblx0XHRcdGNvZGVwb2ludCA9IGV2dC5jaGFyLmNoYXJDb2RlQXQoKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoZXZ0LmNoYXJDb2RlKSB7XG5cdFx0XHRjb2RlcG9pbnQgPSBldnQuY2hhckNvZGU7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGV2dC5rZXlDb2RlICYmIGV2dC50eXBlID09PSAna2V5cHJlc3MnKSB7XG5cdFx0XHQvLyBJRTEwIHN0b3JlcyB0aGUgY2hhciBjb2RlIGFzIGtleUNvZGUsIGFuZCBoYXMgbm8gb3RoZXIgdXNlZnVsIHByb3BlcnRpZXNcblx0XHRcdGNvZGVwb2ludCA9IGV2dC5rZXlDb2RlO1xuXHRcdH1cblxuXHRcdGlmIChjb2RlcG9pbnQpIHtcblx0XHRcdHZhciByZXMgPSBLZXlzLmZyb21Vbmljb2RlKEtiZFV0aWwuc3Vic3RpdHV0ZUNvZGVwb2ludChjb2RlcG9pbnQpKTtcblx0XHRcdGlmIChyZXMpIHtcblx0XHRcdFx0cmV0dXJuIHJlcztcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyB3ZSBjb3VsZCBjaGVjayBldnQua2V5IGhlcmUuXG5cdFx0Ly8gTGVnYWwgdmFsdWVzIGFyZSBkZWZpbmVkIGluIGh0dHA6Ly93d3cudzMub3JnL1RSL0RPTS1MZXZlbC0zLUV2ZW50cy8ja2V5LXZhbHVlcy1saXN0LFxuXHRcdC8vIHNvIHdlIFwianVzdFwiIG5lZWQgdG8gbWFwIHRoZW0gdG8ga2V5c3ltLCBidXQgQUZBSUsgdGhpcyBpcyBvbmx5IGF2YWlsYWJsZSBpbiBJRTEwLFxuXHRcdC8vIHdoaWNoIGFsc28gcHJvdmlkZXMgZXZ0LmtleSBzbyB3ZSBkb24ndCAqbmVlZCogaXQgeWV0LlxuXHRcdGlmIChldnQua2V5Q29kZSkge1xuXHRcdFx0cmV0dXJuIEtleXMubG9va3VwKEtiZFV0aWwua2V5c3ltRnJvbUtleUNvZGUoZXZ0LmtleUNvZGUsIGV2dC5zaGlmdEtleSkpO1xuXHRcdH1cblx0XHRpZiAoZXZ0LndoaWNoKSB7XG5cdFx0XHRyZXR1cm4gS2V5cy5sb29rdXAoS2JkVXRpbC5rZXlzeW1Gcm9tS2V5Q29kZShldnQud2hpY2gsIGV2dC5zaGlmdEtleSkpO1xuXHRcdH1cblx0XHRyZXR1cm4gbnVsbDtcblx0fSxcblxuXHQvKipcblx0ICogR2l2ZW4gYSBrZXljb2RlLCB0cnkgdG8gcHJlZGljdCB3aGljaCBrZXlzeW0gaXQgbWlnaHQgYmUuXG5cdCAqIElmIHRoZSBrZXljb2RlIGlzIHVua25vd24sIG51bGwgaXMgcmV0dXJuZWQuXG5cdCAqL1xuXHRrZXlzeW1Gcm9tS2V5Q29kZTogZnVuY3Rpb24gKGtleWNvZGUsIHNoaWZ0UHJlc3NlZCkge1xuXHRcdGlmICh0eXBlb2Yoa2V5Y29kZSkgIT09ICdudW1iZXInKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdFx0Ly8gd29uJ3QgYmUgYWNjdXJhdGUgZm9yIGF6ZXJ0eVxuXHRcdGlmIChrZXljb2RlID49IDB4MzAgJiYga2V5Y29kZSA8PSAweDM5KSB7XG5cdFx0XHRyZXR1cm4ga2V5Y29kZTsgLy8gZGlnaXRcblx0XHR9XG5cdFx0aWYgKGtleWNvZGUgPj0gMHg0MSAmJiBrZXljb2RlIDw9IDB4NWEpIHtcblx0XHRcdC8vIHJlbWFwIHRvIGxvd2VyY2FzZSB1bmxlc3Mgc2hpZnQgaXMgZG93blxuXHRcdFx0cmV0dXJuIHNoaWZ0UHJlc3NlZCA/IGtleWNvZGUgOiBrZXljb2RlICsgMzI7IC8vIEEtWlxuXHRcdH1cblx0XHRpZiAoa2V5Y29kZSA+PSAweDYwICYmIGtleWNvZGUgPD0gMHg2OSkge1xuXHRcdFx0cmV0dXJuIEtleXMuWEtfS1BfMCArIChrZXljb2RlIC0gMHg2MCk7IC8vIG51bXBhZCAwLTlcblx0XHR9XG5cblx0XHRzd2l0Y2goa2V5Y29kZSkge1xuXHRcdFx0Y2FzZSAweDIwOiByZXR1cm4gS2V5cy5YS19zcGFjZTtcblx0XHRcdGNhc2UgMHg2YTogcmV0dXJuIEtleXMuWEtfS1BfTXVsdGlwbHk7XG5cdFx0XHRjYXNlIDB4NmI6IHJldHVybiBLZXlzLlhLX0tQX0FkZDtcblx0XHRcdGNhc2UgMHg2YzogcmV0dXJuIEtleXMuWEtfS1BfU2VwYXJhdG9yO1xuXHRcdFx0Y2FzZSAweDZkOiByZXR1cm4gS2V5cy5YS19LUF9TdWJ0cmFjdDtcblx0XHRcdGNhc2UgMHg2ZTogcmV0dXJuIEtleXMuWEtfS1BfRGVjaW1hbDtcblx0XHRcdGNhc2UgMHg2ZjogcmV0dXJuIEtleXMuWEtfS1BfRGl2aWRlO1xuXHRcdFx0Y2FzZSAweGJiOiByZXR1cm4gS2V5cy5YS19wbHVzO1xuXHRcdFx0Y2FzZSAweGJjOiByZXR1cm4gS2V5cy5YS19jb21tYTtcblx0XHRcdGNhc2UgMHhiZDogcmV0dXJuIEtleXMuWEtfbWludXM7XG5cdFx0XHRjYXNlIDB4YmU6IHJldHVybiBLZXlzLlhLX3BlcmlvZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gS2JkVXRpbC5ub25DaGFyYWN0ZXJLZXkoe2tleUNvZGU6IGtleWNvZGV9KTtcblx0fSxcblxuXHQvKipcblx0ICogSWYgdGhlIGtleSBpcyBhIGtub3duIG5vbi1jaGFyYWN0ZXIga2V5IChhbnkga2V5IHdoaWNoIGRvZXNuJ3QgZ2VuZXJhdGVcblx0ICogY2hhcmFjdGVyIGRhdGEpIHJldHVybiBpdHMga2V5c3ltIHZhbHVlLiBPdGhlcndpc2UgcmV0dXJuIG51bGwuXG5cdCAqL1xuXHRub25DaGFyYWN0ZXJLZXk6IGZ1bmN0aW9uIChldnQpIHtcblx0XHQvLyBldnQua2V5IG5vdCBpbXBsZW1lbnRlZCB5ZXRcblx0XHRpZiAoIWV2dC5rZXlDb2RlKSB7IHJldHVybiBudWxsOyB9XG5cblx0XHR2YXIga2V5Y29kZSA9IGV2dC5rZXlDb2RlO1xuXG5cdFx0aWYgKGtleWNvZGUgPj0gMHg3MCAmJiBrZXljb2RlIDw9IDB4ODcpIHtcblx0XHRcdHJldHVybiBLZXlzLlhLX0YxICsga2V5Y29kZSAtIDB4NzA7IC8vIEYxLUYyNFxuXHRcdH1cblxuXHRcdHN3aXRjaCAoa2V5Y29kZSkge1xuXHRcdFx0Y2FzZSA4IDogcmV0dXJuIEtleXMuWEtfQmFja1NwYWNlO1xuXHRcdFx0Y2FzZSAxMyA6IHJldHVybiBLZXlzLlhLX1JldHVybjtcblxuXHRcdFx0Y2FzZSA5IDogcmV0dXJuIEtleXMuWEtfVGFiO1xuXG5cdFx0XHRjYXNlIDI3IDogcmV0dXJuIEtleXMuWEtfRXNjYXBlO1xuXHRcdFx0Y2FzZSA0NiA6IHJldHVybiBLZXlzLlhLX0RlbGV0ZTtcblxuXHRcdFx0Y2FzZSAzNiA6IHJldHVybiBLZXlzLlhLX0hvbWU7XG5cdFx0XHRjYXNlIDM1IDogcmV0dXJuIEtleXMuWEtfRW5kO1xuXHRcdFx0Y2FzZSAzMyA6IHJldHVybiBLZXlzLlhLX1BhZ2VfVXA7XG5cdFx0XHRjYXNlIDM0IDogcmV0dXJuIEtleXMuWEtfUGFnZV9Eb3duO1xuXHRcdFx0Y2FzZSA0NSA6IHJldHVybiBLZXlzLlhLX0luc2VydDtcblxuXHRcdFx0Y2FzZSAzNyA6IHJldHVybiBLZXlzLlhLX0xlZnQ7XG5cdFx0XHRjYXNlIDM4IDogcmV0dXJuIEtleXMuWEtfVXA7XG5cdFx0XHRjYXNlIDM5IDogcmV0dXJuIEtleXMuWEtfUmlnaHQ7XG5cdFx0XHRjYXNlIDQwIDogcmV0dXJuIEtleXMuWEtfRG93bjtcblxuXHRcdFx0Y2FzZSAxNiA6IHJldHVybiBLZXlzLlhLX1NoaWZ0X0w7XG5cdFx0XHRjYXNlIDE3IDogcmV0dXJuIEtleXMuWEtfQ29udHJvbF9MO1xuXHRcdFx0Y2FzZSAxOCA6IHJldHVybiBLZXlzLlhLX0FsdF9MOyAvLyBhbHNvOiBPcHRpb24ta2V5IG9uIE1hY1xuXG5cdFx0XHRjYXNlIDIyNCA6IHJldHVybiBLZXlzLlhLX01ldGFfTDtcblx0XHRcdGNhc2UgMjI1IDogcmV0dXJuIEtleXMuWEtfSVNPX0xldmVsM19TaGlmdDsgLy8gQWx0R3Jcblx0XHRcdGNhc2UgOTEgOiByZXR1cm4gS2V5cy5YS19TdXBlcl9MOyAvLyBhbHNvOiBXaW5kb3dzLWtleVxuXHRcdFx0Y2FzZSA5MiA6IHJldHVybiBLZXlzLlhLX1N1cGVyX1I7IC8vIGFsc286IFdpbmRvd3Mta2V5XG5cdFx0XHRjYXNlIDkzIDogcmV0dXJuIEtleXMuWEtfTWVudTsgLy8gYWxzbzogV2luZG93cy1NZW51LCBDb21tYW5kIG9uIE1hY1xuXG5cdFx0XHRkZWZhdWx0OiByZXR1cm4gbnVsbDtcblx0XHR9XG5cdH0sXG5cblx0c3Vic3RpdHV0ZUNvZGVwb2ludDogZnVuY3Rpb24oY3ApIHtcblx0XHQvLyBBbnkgVW5pY29kZSBjb2RlIHBvaW50cyB3aGljaCBkbyBub3QgaGF2ZSBjb3JyZXNwb25kaW5nIGtleXN5bSBlbnRyaWVzXG5cdFx0Ly8gY2FuIGJlIHN3YXBwZWQgb3V0IGZvciBhbm90aGVyIGNvZGUgcG9pbnQgYnkgYWRkaW5nIHRoZW0gdG8gdGhpcyB0YWJsZS5cblx0XHR2YXIgc3Vic3RpdHV0aW9ucyA9IHtcblx0XHRcdC8vIHtTLHN9IHdpdGggY29tbWEgYmVsb3cgLT4ge1Msc30gd2l0aCBjZWRpbGxhXG5cdFx0XHQweDIxOCA6IDB4MTVlLFxuXHRcdFx0MHgyMTkgOiAweDE1Zixcblx0XHRcdC8vIHtULHR9IHdpdGggY29tbWEgYmVsb3cgLT4ge1QsdH0gd2l0aCBjZWRpbGxhXG5cdFx0XHQweDIxYSA6IDB4MTYyLFxuXHRcdFx0MHgyMWIgOiAweDE2M1xuXHRcdH07XG5cblx0XHR2YXIgc3ViID0gc3Vic3RpdHV0aW9uc1tjcF07XG5cdFx0cmV0dXJuIHN1YiA/IHN1YiA6IGNwO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBUYWtlcyBhIERPTSBrZXlib2FyZCBldmVudCBhbmQ6XG5cdCAqIC0gZGV0ZXJtaW5lcyB3aGljaCBrZXlzeW0gaXQgcmVwcmVzZW50cy5cblx0ICogLSBkZXRlcm1pbmVzIGEga2V5SWQgIGlkZW50aWZ5aW5nIHRoZSBrZXkgdGhhdCB3YXMgcHJlc3NlZCAoY29ycmVzcG9uZGluZ1xuXHQgKiAgIHRvIHRoZSBrZXkva2V5Q29kZSBwcm9wZXJ0aWVzIG9uIHRoZSBET00gZXZlbnQpLlxuXHQgKiAtIHN5bnRoZXNpemVzIGV2ZW50cyB0byBzeW5jaHJvbml6ZSBtb2RpZmllciBrZXkgc3RhdGUgYmV0d2VlbiB3aGljaFxuXHQgKiAgIG1vZGlmaWVycyBhcmUgYWN0dWFsbHkgZG93biwgYW5kIHdoaWNoIHdlIHRob3VnaHQgd2VyZSBkb3duLlxuXHQgKiAtIG1hcmtzIGVhY2ggZXZlbnQgd2l0aCBhbiAnZXNjYXBlJyBwcm9wZXJ0eSBpZiBhIG1vZGlmaWVyIHdhcyBkb3duIHdoaWNoXG5cdCAqICAgc2hvdWxkIGJlIFwiZXNjYXBlZFwiLlxuXHQgKiAtIGdlbmVyYXRlcyBhIFwic3RhbGxcIiBldmVudCBpbiBjYXNlcyB3aGVyZSBpdCBtaWdodCBiZSBuZWNlc3NhcnkgdG8gd2FpdFxuXHQgKiAgIGFuZCBzZWUgaWYgYSBrZXlwcmVzcyBldmVudCBmb2xsb3dzIGEga2V5ZG93bi5cblx0ICpcblx0ICogVGhpcyBpbmZvcm1hdGlvbiBpcyBjb2xsZWN0ZWQgaW50byBhbiBvYmplY3Qgd2hpY2ggaXMgcGFzc2VkIHRvIHRoZSBuZXh0KClcblx0ICogZnVuY3Rpb24gKG9uZSBjYWxsIHBlciBldmVudCkuXG5cdCAqL1xuXHRLZXlFdmVudERlY29kZXI6IGZ1bmN0aW9uIChtb2RpZmllclN0YXRlLCBuZXh0KSB7XG5cdFx0ZnVuY3Rpb24gc2VuZEFsbChldnRzKSB7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGV2dHMubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0bmV4dChldnRzW2ldKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBwcm9jZXNzKGV2dCwgdHlwZSkge1xuXHRcdFx0dmFyIHJlc3VsdCA9IHt0eXBlOiB0eXBlfTtcblx0XHRcdHZhciBrZXlJZCA9IEtiZFV0aWwuZ2V0S2V5KGV2dCk7XG5cblx0XHRcdGlmIChrZXlJZCkge1xuXHRcdFx0XHRyZXN1bHQua2V5SWQgPSBrZXlJZDtcblx0XHRcdH1cblxuXHRcdFx0dmFyIGtleXN5bSA9IEtiZFV0aWwuZ2V0S2V5c3ltKGV2dCk7XG5cblx0XHRcdHZhciBoYXNNb2RpZmllciA9IG1vZGlmaWVyU3RhdGUuaGFzU2hvcnRjdXRNb2RpZmllcigpIHx8ICEhbW9kaWZpZXJTdGF0ZS5hY3RpdmVDaGFyTW9kaWZpZXIoKTtcblxuXHRcdFx0Ly8gSXMgdGhpcyBhIGNhc2Ugd2hlcmUgd2UgaGF2ZSB0byBkZWNpZGUgb24gdGhlIGtleXN5bSByaWdodCBhd2F5LCByYXRoZXIgdGhhbiB3YWl0aW5nIGZvciB0aGUga2V5cHJlc3M/XG5cdFx0XHQvLyBcInNwZWNpYWxcIiBrZXlzIGxpa2UgZW50ZXIsIHRhYiBvciBiYWNrc3BhY2UgZG9uJ3Qgc2VuZCBrZXlwcmVzcyBldmVudHMsXG5cdFx0XHQvLyBhbmQgc29tZSBicm93c2VycyBkb24ndCBzZW5kIGtleXByZXNzZXMgYXQgYWxsIGlmIGEgbW9kaWZpZXIgaXMgZG93blxuXHRcdFx0aWYgKGtleXN5bSAmJiAodHlwZSAhPT0gJ2tleWRvd24nIHx8IEtiZFV0aWwubm9uQ2hhcmFjdGVyS2V5KGV2dCkgfHwgaGFzTW9kaWZpZXIpKSB7XG5cdFx0XHRcdHJlc3VsdC5rZXlzeW0gPSBrZXlzeW07XG5cdFx0XHR9XG5cblx0XHRcdHZhciBpc1NoaWZ0ID0gZXZ0LmtleUNvZGUgPT09IDB4MTAgfHwgZXZ0LmtleSA9PT0gJ1NoaWZ0JztcblxuXHRcdFx0Ly8gU2hvdWxkIHdlIHByZXZlbnQgdGhlIGJyb3dzZXIgZnJvbSBoYW5kbGluZyB0aGUgZXZlbnQ/XG5cdFx0XHQvLyBEb2luZyBzbyBvbiBhIGtleWRvd24gKGluIG1vc3QgYnJvd3NlcnMpIHByZXZlbnRzIGtleXByZXNzIGZyb20gYmVpbmcgZ2VuZXJhdGVkXG5cdFx0XHQvLyBzbyBvbmx5IGRvIHRoYXQgaWYgd2UgaGF2ZSB0by5cblx0XHRcdHZhciBzdXBwcmVzcyA9ICFpc1NoaWZ0ICYmICh0eXBlICE9PSAna2V5ZG93bicgfHwgbW9kaWZpZXJTdGF0ZS5oYXNTaG9ydGN1dE1vZGlmaWVyKCkgfHwgISFLYmRVdGlsLm5vbkNoYXJhY3RlcktleShldnQpKTtcblxuXHRcdFx0Ly8gSWYgYSBjaGFyIG1vZGlmaWVyIGlzIGRvd24gb24gYSBrZXlkb3duLCB3ZSBuZWVkIHRvIGluc2VydCBhIHN0YWxsLFxuXHRcdFx0Ly8gc28gVmVyaWZ5Q2hhck1vZGlmaWVyIGtub3dzIHRvIHdhaXQgYW5kIHNlZSBpZiBhIGtleXByZXNzIGlzIGNvbW5pZ1xuXHRcdFx0dmFyIHN0YWxsID0gdHlwZSA9PT0gJ2tleWRvd24nICYmIG1vZGlmaWVyU3RhdGUuYWN0aXZlQ2hhck1vZGlmaWVyKCkgJiYgIUtiZFV0aWwubm9uQ2hhcmFjdGVyS2V5KGV2dCk7XG5cblx0XHRcdC8vIGlmIGEgY2hhciBtb2RpZmllciBpcyBwcmVzc2VkLCBnZXQgdGhlIGtleXMgaXQgY29uc2lzdHMgb2YgKG9uIFdpbmRvd3MsIEFsdEdyIGlzIGVxdWl2YWxlbnQgdG8gQ3RybCtBbHQpXG5cdFx0XHR2YXIgYWN0aXZlID0gbW9kaWZpZXJTdGF0ZS5hY3RpdmVDaGFyTW9kaWZpZXIoKTtcblxuXHRcdFx0Ly8gSWYgd2UgaGF2ZSBhIGNoYXIgbW9kaWZpZXIgZG93biwgYW5kIHdlJ3JlIGFibGUgdG8gZGV0ZXJtaW5lIGEga2V5c3ltIHJlbGlhYmx5XG5cdFx0XHQvLyB0aGVuIChhKSB3ZSBrbm93IHRvIHRyZWF0IHRoZSBtb2RpZmllciBhcyBhIGNoYXIgbW9kaWZpZXIsXG5cdFx0XHQvLyBhbmQgKGIpIHdlJ2xsIGhhdmUgdG8gXCJlc2NhcGVcIiB0aGUgbW9kaWZpZXIgdG8gdW5kbyB0aGUgbW9kaWZpZXIgd2hlbiBzZW5kaW5nIHRoZSBjaGFyLlxuXHRcdFx0aWYgKGFjdGl2ZSAmJiBrZXlzeW0pIHtcblx0XHRcdFx0dmFyIGlzQ2hhck1vZGlmaWVyID0gZmFsc2U7XG5cdFx0XHRcdGZvciAodmFyIGkgID0gMDsgaSA8IGFjdGl2ZS5sZW5ndGg7ICsraSkge1xuXHRcdFx0XHRcdGlmIChhY3RpdmVbaV0gPT09IGtleXN5bS5rZXlzeW0pIHtcblx0XHRcdFx0XHRcdGlzQ2hhck1vZGlmaWVyID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHR5cGUgPT09ICdrZXlwcmVzcycgJiYgIWlzQ2hhck1vZGlmaWVyKSB7XG5cdFx0XHRcdFx0cmVzdWx0LmVzY2FwZSA9IG1vZGlmaWVyU3RhdGUuYWN0aXZlQ2hhck1vZGlmaWVyKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKHN0YWxsKSB7XG5cdFx0XHRcdC8vIGluc2VydCBhIGZha2UgXCJzdGFsbFwiIGV2ZW50XG5cdFx0XHRcdG5leHQoe3R5cGU6ICdzdGFsbCd9KTtcblx0XHRcdH1cblx0XHRcdG5leHQocmVzdWx0KTtcblxuXHRcdFx0cmV0dXJuIHN1cHByZXNzO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRrZXlkb3duOiBmdW5jdGlvbihldnQpIHtcblx0XHRcdFx0c2VuZEFsbChtb2RpZmllclN0YXRlLmtleWRvd24oZXZ0KSk7XG5cdFx0XHRcdHJldHVybiBwcm9jZXNzKGV2dCwgJ2tleWRvd24nKTtcblx0XHRcdH0sXG5cdFx0XHRrZXlwcmVzczogZnVuY3Rpb24oZXZ0KSB7XG5cdFx0XHRcdHJldHVybiBwcm9jZXNzKGV2dCwgJ2tleXByZXNzJyk7XG5cdFx0XHR9LFxuXHRcdFx0a2V5dXA6IGZ1bmN0aW9uKGV2dCkge1xuXHRcdFx0XHRzZW5kQWxsKG1vZGlmaWVyU3RhdGUua2V5dXAoZXZ0KSk7XG5cdFx0XHRcdHJldHVybiBwcm9jZXNzKGV2dCwgJ2tleXVwJyk7XG5cdFx0XHR9LFxuXHRcdFx0c3luY01vZGlmaWVyczogZnVuY3Rpb24oZXZ0KSB7XG5cdFx0XHRcdHNlbmRBbGwobW9kaWZpZXJTdGF0ZS5zeW5jQW55KGV2dCkpO1xuXHRcdFx0fSxcblx0XHRcdHJlbGVhc2VBbGw6IGZ1bmN0aW9uKCkgeyBuZXh0KHt0eXBlOiAncmVsZWFzZWFsbCd9KTsgfVxuXHRcdH07XG5cdH0sXG5cblx0LyoqXG5cdCAqIENvbWJpbmVzIGtleWRvd24gYW5kIGtleXByZXNzIGV2ZW50cyB3aGVyZSBuZWNlc3NhcnkgdG8gaGFuZGxlIGNoYXIgbW9kaWZpZXJzLlxuXHQgKiBPbiBzb21lIE9TJ2VzLCBhIGNoYXIgbW9kaWZpZXIgaXMgc29tZXRpbWVzIHVzZWQgYXMgYSBzaG9ydGN1dCBtb2RpZmllci5cblx0ICogRm9yIGV4YW1wbGUsIG9uIFdpbmRvd3MsIEFsdEdyIGlzIHN5bm9ueW1vdXMgd2l0aCBDdHJsLUFsdC4gT24gYSBEYW5pc2gga2V5Ym9hcmRcblx0ICogbGF5b3V0LCBBbHRHci0yIHlpZWxkcyBhIEAsIGJ1dCBDdHJsLUFsdC1EIGRvZXMgbm90aGluZyBzbyB3aGVuIHVzZWQgd2l0aCB0aGVcblx0ICogJzInIGtleSwgQ3RybC1BbHQgY291bnRzIGFzIGEgY2hhciBtb2RpZmllciAoYW5kIHNob3VsZCBiZSBlc2NhcGVkKSwgYnV0IHdoZW5cblx0ICogdXNlZCB3aXRoICdEJywgaXQgZG9lcyBub3QuXG5cdCAqIFRoZSBvbmx5IHdheSB3ZSBjYW4gZGlzdGluZ3Vpc2ggdGhlc2UgY2FzZXMgaXMgdG8gd2FpdCBhbmQgc2VlIGlmIGEga2V5cHJlc3Ncblx0ICogZXZlbnQgYXJyaXZlcy4gV2hlbiB3ZSByZWNlaXZlIGEgXCJzdGFsbFwiIGV2ZW50LCB3YWl0IGEgZmV3IG1zIGJlZm9yZSBwcm9jZXNzaW5nXG5cdCAqIHRoZSBuZXh0IGtleWRvd24uIElmIGEga2V5cHJlc3MgaGFzIGFsc28gYXJyaXZlZCwgbWVyZ2UgdGhlIHR3by5cblx0ICovXG5cdFZlcmlmeUNoYXJNb2RpZmllcjogZnVuY3Rpb24gKG5leHQpIHtcblx0XHR2YXIgcXVldWUgPSBbXTtcblx0XHR2YXIgdGltZXIgPSBudWxsO1xuXG5cdFx0ZnVuY3Rpb24gcHJvY2VzcygpIHtcblx0XHRcdGlmICh0aW1lcikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIGRlbGF5UHJvY2VzcyAoKSB7XG5cdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lcik7XG5cdFx0XHRcdHRpbWVyID0gbnVsbDtcblx0XHRcdFx0cHJvY2VzcygpO1xuXHRcdFx0fVxuXG5cdFx0XHR3aGlsZSAocXVldWUubGVuZ3RoICE9PSAwKSB7XG5cdFx0XHRcdHZhciBjdXIgPSBxdWV1ZVswXTtcblx0XHRcdFx0cXVldWUgPSBxdWV1ZS5zcGxpY2UoMSk7XG5cblx0XHRcdFx0c3dpdGNoIChjdXIudHlwZSkge1xuXHRcdFx0XHRcdGNhc2UgJ3N0YWxsJzpcblx0XHRcdFx0XHRcdC8vIGluc2VydCBhIGRlbGF5IGJlZm9yZSBwcm9jZXNzaW5nIGF2YWlsYWJsZSBldmVudHMuXG5cdFx0XHRcdFx0XHQvKiBqc2hpbnQgbG9vcGZ1bmM6IHRydWUgKi9cblx0XHRcdFx0XHRcdHRpbWVyID0gc2V0VGltZW91dChkZWxheVByb2Nlc3MsIDUpO1xuXHRcdFx0XHRcdFx0LyoganNoaW50IGxvb3BmdW5jOiBmYWxzZSAqL1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdGNhc2UgJ2tleWRvd24nOlxuXHRcdFx0XHRcdFx0Ly8gaXMgdGhlIG5leHQgZWxlbWVudCBhIGtleXByZXNzPyBUaGVuIHdlIHNob3VsZCBtZXJnZSB0aGUgdHdvXG5cdFx0XHRcdFx0XHRpZiAocXVldWUubGVuZ3RoICE9PSAwICYmIHF1ZXVlWzBdLnR5cGUgPT09ICdrZXlwcmVzcycpIHtcblx0XHRcdFx0XHRcdFx0Ly8gRmlyZWZveCBzZW5kcyBrZXlwcmVzcyBldmVuIHdoZW4gbm8gY2hhciBpcyBnZW5lcmF0ZWQuXG5cdFx0XHRcdFx0XHRcdC8vIHNvLCBpZiBrZXlwcmVzcyBrZXlzeW0gaXMgdGhlIHNhbWUgYXMgd2UnZCBoYXZlIGd1ZXNzZWQgZnJvbSBrZXlkb3duLFxuXHRcdFx0XHRcdFx0XHQvLyB0aGUgbW9kaWZpZXIgZGlkbid0IGhhdmUgYW55IGVmZmVjdCwgYW5kIHNob3VsZCBub3QgYmUgZXNjYXBlZFxuXHRcdFx0XHRcdFx0XHRpZiAocXVldWVbMF0uZXNjYXBlICYmICghY3VyLmtleXN5bSB8fCBjdXIua2V5c3ltLmtleXN5bSAhPT0gcXVldWVbMF0ua2V5c3ltLmtleXN5bSkpIHtcblx0XHRcdFx0XHRcdFx0XHRjdXIuZXNjYXBlID0gcXVldWVbMF0uZXNjYXBlO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGN1ci5rZXlzeW0gPSBxdWV1ZVswXS5rZXlzeW07XG5cdFx0XHRcdFx0XHRcdHF1ZXVlID0gcXVldWUuc3BsaWNlKDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBzd2FsbG93IHN0YWxsIGV2ZW50cywgYW5kIHBhc3MgYWxsIG90aGVycyB0byB0aGUgbmV4dCBzdGFnZVxuXHRcdFx0XHRpZiAoY3VyLnR5cGUgIT09ICdzdGFsbCcpIHtcblx0XHRcdFx0XHRuZXh0KGN1cik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24oZXZ0KSB7XG5cdFx0XHRxdWV1ZS5wdXNoKGV2dCk7XG5cdFx0XHRwcm9jZXNzKCk7XG5cdFx0fTtcblx0fSxcblxuXHQvKipcblx0ICogS2VlcHMgdHJhY2sgb2Ygd2hpY2gga2V5cyB3ZSAoYW5kIHRoZSBzZXJ2ZXIpIGJlbGlldmUgYXJlIGRvd24uXG5cdCAqIFdoZW4gYSBrZXl1cCBpcyByZWNlaXZlZCwgbWF0Y2ggaXQgYWdhaW5zdCB0aGlzIGxpc3QsIHRvIGRldGVybWluZSB0aGVcblx0ICogY29ycmVzcG9uZGluZyBrZXlzeW0ocykgaW4gc29tZSBjYXNlcywgYSBzaW5nbGUga2V5IG1heSBwcm9kdWNlIG11bHRpcGxlXG5cdCAqIGtleXN5bXMsIHNvIHRoZSBjb3JyZXNwb25kaW5nIGtleXVwIGV2ZW50IG11c3QgcmVsZWFzZSBhbGwgb2YgdGhlc2UgY2hhcnNcblx0ICoga2V5IHJlcGVhdCBldmVudHMgc2hvdWxkIGJlIG1lcmdlZCBpbnRvIGEgc2luZ2xlIGVudHJ5LlxuXHQgKiBCZWNhdXNlIHdlIGNhbid0IGFsd2F5cyBpZGVudGlmeSB3aGljaCBlbnRyeSBhIGtleWRvd24gb3Iga2V5dXAgZXZlbnRcblx0ICogY29ycmVzcG9uZHMgdG8sIHdlIHNvbWV0aW1lcyBoYXZlIHRvIGd1ZXNzLlxuXHQgKi9cblx0VHJhY2tLZXlTdGF0ZTogZnVuY3Rpb24gKG5leHQpIHtcblx0XHR2YXIgc3RhdGUgPSBbXTtcblxuXHRcdHJldHVybiBmdW5jdGlvbiAoZXZ0KSB7XG5cdFx0XHR2YXIgbGFzdCA9IHN0YXRlLmxlbmd0aCAhPT0gMCA/IHN0YXRlW3N0YXRlLmxlbmd0aC0xXSA6IG51bGw7XG5cblx0XHRcdHN3aXRjaCAoZXZ0LnR5cGUpIHtcblx0XHRcdFx0Y2FzZSAna2V5ZG93bic6XG5cdFx0XHRcdFx0Ly8gaW5zZXJ0IGEgbmV3IGVudHJ5IGlmIGxhc3Qgc2VlbiBrZXkgd2FzIGRpZmZlcmVudC5cblx0XHRcdFx0XHRpZiAoIWxhc3QgfHwgIWV2dC5rZXlJZCB8fCBsYXN0LmtleUlkICE9PSBldnQua2V5SWQpIHtcblx0XHRcdFx0XHRcdGxhc3QgPSB7a2V5SWQ6IGV2dC5rZXlJZCwga2V5c3ltczoge319O1xuXHRcdFx0XHRcdFx0c3RhdGUucHVzaChsYXN0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGV2dC5rZXlzeW0pIHtcblx0XHRcdFx0XHRcdC8vIG1ha2Ugc3VyZSBsYXN0IGV2ZW50IGNvbnRhaW5zIHRoaXMga2V5c3ltIChhIHNpbmdsZSBcImxvZ2ljYWxcIiBrZXlldmVudFxuXHRcdFx0XHRcdFx0Ly8gY2FuIGNhdXNlIG11bHRpcGxlIGtleSBldmVudHMgdG8gYmUgc2VudCB0byB0aGUgVk5DIHNlcnZlcilcblx0XHRcdFx0XHRcdGxhc3Qua2V5c3ltc1tldnQua2V5c3ltLmtleXN5bV0gPSBldnQua2V5c3ltO1xuXHRcdFx0XHRcdFx0bGFzdC5pZ25vcmVLZXlQcmVzcyA9IHRydWU7XG5cdFx0XHRcdFx0XHRuZXh0KGV2dCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdrZXlwcmVzcyc6XG5cdFx0XHRcdFx0aWYgKCFsYXN0KSB7XG5cdFx0XHRcdFx0XHRsYXN0ID0ge2tleUlkOiBldnQua2V5SWQsIGtleXN5bXM6IHt9fTtcblx0XHRcdFx0XHRcdHN0YXRlLnB1c2gobGFzdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmICghZXZ0LmtleXN5bSkge1xuXHRcdFx0XHRcdFx0ZGVidWdlcnJvcignVHJhY2tLZXlTdGF0ZSgpIHwga2V5cHJlc3Mgd2l0aCBubyBrZXlzeW06JywgZXZ0KTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBJZiB3ZSBkaWRuJ3QgZXhwZWN0IGEga2V5cHJlc3MsIGFuZCBhbHJlYWR5IHNlbnQgYSBrZXlkb3duIHRvIHRoZSBWTkMgc2VydmVyXG5cdFx0XHRcdFx0Ly8gYmFzZWQgb24gdGhlIGtleWRvd24sIG1ha2Ugc3VyZSB0byBza2lwIHRoaXMgZXZlbnQuXG5cdFx0XHRcdFx0aWYgKGV2dC5rZXlzeW0gJiYgIWxhc3QuaWdub3JlS2V5UHJlc3MpIHtcblx0XHRcdFx0XHRcdGxhc3Qua2V5c3ltc1tldnQua2V5c3ltLmtleXN5bV0gPSBldnQua2V5c3ltO1xuXHRcdFx0XHRcdFx0ZXZ0LnR5cGUgPSAna2V5ZG93bic7XG5cdFx0XHRcdFx0XHRuZXh0KGV2dCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdrZXl1cCc6XG5cdFx0XHRcdFx0aWYgKHN0YXRlLmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YXIgaWR4ID0gbnVsbDtcblx0XHRcdFx0XHQvLyBkbyB3ZSBoYXZlIGEgbWF0Y2hpbmcga2V5IHRyYWNrZWQgYXMgYmVpbmcgZG93bj9cblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSAhPT0gc3RhdGUubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0XHRcdGlmIChzdGF0ZVtpXS5rZXlJZCA9PT0gZXZ0LmtleUlkKSB7XG5cdFx0XHRcdFx0XHRcdGlkeCA9IGk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyBpZiB3ZSBjb3VsZG4ndCBmaW5kIGEgbWF0Y2ggKGl0IGhhcHBlbnMpLCBhc3N1bWUgaXQgd2FzIHRoZSBsYXN0IGtleSBwcmVzc2VkXG5cdFx0XHRcdFx0aWYgKGlkeCA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0aWR4ID0gc3RhdGUubGVuZ3RoIC0gMTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR2YXIgaXRlbSA9IHN0YXRlLnNwbGljZShpZHgsIDEpWzBdO1xuXHRcdFx0XHRcdC8vIGZvciBlYWNoIGtleXN5bSB0cmFja2VkIGJ5IHRoaXMga2V5IGVudHJ5LCBjbG9uZSB0aGUgY3VycmVudCBldmVudCBhbmQgb3ZlcnJpZGUgdGhlIGtleXN5bVxuXHRcdFx0XHRcdHZhciBjbG9uZSA9IChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0ZnVuY3Rpb24gQ2xvbmUoKXt9XG5cdFx0XHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKG9iaikgeyBDbG9uZS5wcm90b3R5cGU9b2JqOyByZXR1cm4gbmV3IENsb25lKCk7IH07XG5cdFx0XHRcdFx0fSgpKTtcblx0XHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gaXRlbS5rZXlzeW1zKSB7XG5cdFx0XHRcdFx0XHR2YXIgb3V0ID0gY2xvbmUoZXZ0KTtcblx0XHRcdFx0XHRcdG91dC5rZXlzeW0gPSBpdGVtLmtleXN5bXNba2V5XTtcblx0XHRcdFx0XHRcdG5leHQob3V0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ3JlbGVhc2VhbGwnOlxuXHRcdFx0XHRcdC8qIGpzaGludCBzaGFkb3c6IHRydWUgKi9cblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN0YXRlLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gc3RhdGVbaV0ua2V5c3ltcykge1xuXHRcdFx0XHRcdFx0XHR2YXIga2V5c3ltID0gc3RhdGVbaV0ua2V5c3ltc1trZXldO1xuXHRcdFx0XHRcdFx0XHRuZXh0KHtrZXlJZDogMCwga2V5c3ltOiBrZXlzeW0sIHR5cGU6ICdrZXl1cCd9KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0LyoganNoaW50IHNoYWRvdzogZmFsc2UgKi9cblx0XHRcdFx0XHRzdGF0ZSA9IFtdO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH07XG5cdH0sXG5cblx0LyoqXG5cdCAqIEhhbmRsZXMgXCJlc2NhcGluZ1wiIG9mIG1vZGlmaWVyczogaWYgYSBjaGFyIG1vZGlmaWVyIGlzIHVzZWQgdG8gcHJvZHVjZSBhXG5cdCAqIGtleXN5bSAoc3VjaCBhcyBBbHRHci0yIHRvIGdlbmVyYXRlIGFuIEApLCB0aGVuIHRoZSBtb2RpZmllciBtdXN0IGJlXG5cdCAqIFwidW5kb25lXCIgYmVmb3JlIHNlbmRpbmcgdGhlIEAsIGFuZCBcInJlZG9uZVwiIGFmdGVyd2FyZHMuXG5cdCAqL1xuXHRFc2NhcGVNb2RpZmllcnM6IGZ1bmN0aW9uIChuZXh0KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGV2dCkge1xuXHRcdFx0dmFyIGk7XG5cblx0XHRcdGlmIChldnQudHlwZSAhPT0gJ2tleWRvd24nIHx8IGV2dC5lc2NhcGUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRuZXh0KGV2dCk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gdW5kbyBtb2RpZmllcnNcblx0XHRcdGZvciAoaSA9IDA7IGkgPCBldnQuZXNjYXBlLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdG5leHQoe3R5cGU6ICdrZXl1cCcsIGtleUlkOiAwLCBrZXlzeW06IEtleXMubG9va3VwKGV2dC5lc2NhcGVbaV0pfSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIHNlbmQgdGhlIGNoYXJhY3RlciBldmVudFxuXHRcdFx0bmV4dChldnQpO1xuXG5cdFx0XHQvLyByZWRvIG1vZGlmaWVyc1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8IGV2dC5lc2NhcGUubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0bmV4dCh7dHlwZTogJ2tleWRvd24nLCBrZXlJZDogMCwga2V5c3ltOiBLZXlzLmxvb2t1cChldnQuZXNjYXBlW2ldKX0pO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cbn07XG5cblxuLyoqXG4gKiBQcml2YXRlIEFQSS5cbiAqL1xuXG5cbmZ1bmN0aW9uIGlzTWFjKCkge1xuXHRyZXR1cm4gbmF2aWdhdG9yICYmICEhKC9tYWMvaSkuZXhlYyhuYXZpZ2F0b3IucGxhdGZvcm0pO1xufVxuXG5mdW5jdGlvbiBpc1dpbmRvd3MoKSB7XG5cdHJldHVybiBuYXZpZ2F0b3IgJiYgISEoL3dpbi9pKS5leGVjKG5hdmlnYXRvci5wbGF0Zm9ybSk7XG59XG5cbmZ1bmN0aW9uIGlzTGludXgoKSB7XG5cdHJldHVybiBuYXZpZ2F0b3IgJiYgISEoL2xpbnV4L2kpLmV4ZWMobmF2aWdhdG9yLnBsYXRmb3JtKTtcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ub2RlX21vZHVsZXMvbm92bmMtbm9kZS9saWIva2JkdXRpbC5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ub3ZuYy1ub2RlL2xpYlwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxuICogVGhlIE9iamVjdCB0byBiZSBleHBvc2VkLlxuICovXG52YXIgS2V5cyA9IHtcblx0WEtfVm9pZFN5bWJvbDogICAgICAgICAgICAgICAgICAweGZmZmZmZiwgLyogVm9pZCBzeW1ib2wgKi9cblxuXHRYS19CYWNrU3BhY2U6ICAgICAgICAgICAgICAgICAgIDB4ZmYwOCwgLyogQmFjayBzcGFjZSwgYmFjayBjaGFyICovXG5cdFhLX1RhYjogICAgICAgICAgICAgICAgICAgICAgICAgMHhmZjA5LFxuXHRYS19MaW5lZmVlZDogICAgICAgICAgICAgICAgICAgIDB4ZmYwYSwgLyogTGluZWZlZWQsIExGICovXG5cdFhLX0NsZWFyOiAgICAgICAgICAgICAgICAgICAgICAgMHhmZjBiLFxuXHRYS19SZXR1cm46ICAgICAgICAgICAgICAgICAgICAgIDB4ZmYwZCwgLyogUmV0dXJuLCBlbnRlciAqL1xuXHRYS19QYXVzZTogICAgICAgICAgICAgICAgICAgICAgIDB4ZmYxMywgLyogUGF1c2UsIGhvbGQgKi9cblx0WEtfU2Nyb2xsX0xvY2s6ICAgICAgICAgICAgICAgICAweGZmMTQsXG5cdFhLX1N5c19SZXE6ICAgICAgICAgICAgICAgICAgICAgMHhmZjE1LFxuXHRYS19Fc2NhcGU6ICAgICAgICAgICAgICAgICAgICAgIDB4ZmYxYixcblx0WEtfRGVsZXRlOiAgICAgICAgICAgICAgICAgICAgICAweGZmZmYsIC8qIERlbGV0ZSwgcnVib3V0ICovXG5cblx0LyogQ3Vyc29yIGNvbnRyb2wgJiBtb3Rpb24gKi9cblxuXHRYS19Ib21lOiAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmY1MCxcblx0WEtfTGVmdDogICAgICAgICAgICAgICAgICAgICAgICAweGZmNTEsIC8qIE1vdmUgbGVmdCwgbGVmdCBhcnJvdyAqL1xuXHRYS19VcDogICAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmY1MiwgLyogTW92ZSB1cCwgdXAgYXJyb3cgKi9cblx0WEtfUmlnaHQ6ICAgICAgICAgICAgICAgICAgICAgICAweGZmNTMsIC8qIE1vdmUgcmlnaHQsIHJpZ2h0IGFycm93ICovXG5cdFhLX0Rvd246ICAgICAgICAgICAgICAgICAgICAgICAgMHhmZjU0LCAvKiBNb3ZlIGRvd24sIGRvd24gYXJyb3cgKi9cblx0WEtfUHJpb3I6ICAgICAgICAgICAgICAgICAgICAgICAweGZmNTUsIC8qIFByaW9yLCBwcmV2aW91cyAqL1xuXHRYS19QYWdlX1VwOiAgICAgICAgICAgICAgICAgICAgIDB4ZmY1NSxcblx0WEtfTmV4dDogICAgICAgICAgICAgICAgICAgICAgICAweGZmNTYsIC8qIE5leHQgKi9cblx0WEtfUGFnZV9Eb3duOiAgICAgICAgICAgICAgICAgICAweGZmNTYsXG5cdFhLX0VuZDogICAgICAgICAgICAgICAgICAgICAgICAgMHhmZjU3LCAvKiBFT0wgKi9cblx0WEtfQmVnaW46ICAgICAgICAgICAgICAgICAgICAgICAweGZmNTgsIC8qIEJPTCAqL1xuXG5cdC8qIE1pc2MgZnVuY3Rpb25zICovXG5cblx0WEtfU2VsZWN0OiAgICAgICAgICAgICAgICAgICAgICAweGZmNjAsIC8qIFNlbGVjdCwgbWFyayAqL1xuXHRYS19QcmludDogICAgICAgICAgICAgICAgICAgICAgIDB4ZmY2MSxcblx0WEtfRXhlY3V0ZTogICAgICAgICAgICAgICAgICAgICAweGZmNjIsIC8qIEV4ZWN1dGUsIHJ1biwgZG8gKi9cblx0WEtfSW5zZXJ0OiAgICAgICAgICAgICAgICAgICAgICAweGZmNjMsIC8qIEluc2VydCwgaW5zZXJ0IGhlcmUgKi9cblx0WEtfVW5kbzogICAgICAgICAgICAgICAgICAgICAgICAweGZmNjUsXG5cdFhLX1JlZG86ICAgICAgICAgICAgICAgICAgICAgICAgMHhmZjY2LCAvKiBSZWRvLCBhZ2FpbiAqL1xuXHRYS19NZW51OiAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmY2Nyxcblx0WEtfRmluZDogICAgICAgICAgICAgICAgICAgICAgICAweGZmNjgsIC8qIEZpbmQsIHNlYXJjaCAqL1xuXHRYS19DYW5jZWw6ICAgICAgICAgICAgICAgICAgICAgIDB4ZmY2OSwgLyogQ2FuY2VsLCBzdG9wLCBhYm9ydCwgZXhpdCAqL1xuXHRYS19IZWxwOiAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmY2YSwgLyogSGVscCAqL1xuXHRYS19CcmVhazogICAgICAgICAgICAgICAgICAgICAgIDB4ZmY2Yixcblx0WEtfTW9kZV9zd2l0Y2g6ICAgICAgICAgICAgICAgICAweGZmN2UsIC8qIENoYXJhY3RlciBzZXQgc3dpdGNoICovXG5cdFhLX3NjcmlwdF9zd2l0Y2g6ICAgICAgICAgICAgICAgMHhmZjdlLCAvKiBBbGlhcyBmb3IgbW9kZV9zd2l0Y2ggKi9cblx0WEtfTnVtX0xvY2s6ICAgICAgICAgICAgICAgICAgICAweGZmN2YsXG5cblx0LyogS2V5cGFkIGZ1bmN0aW9ucywga2V5cGFkIG51bWJlcnMgY2xldmVybHkgY2hvc2VuIHRvIG1hcCB0byBBU0NJSSAqL1xuXG5cdFhLX0tQX1NwYWNlOiAgICAgICAgICAgICAgICAgICAgMHhmZjgwLCAvKiBTcGFjZSAqL1xuXHRYS19LUF9UYWI6ICAgICAgICAgICAgICAgICAgICAgIDB4ZmY4OSxcblx0WEtfS1BfRW50ZXI6ICAgICAgICAgICAgICAgICAgICAweGZmOGQsIC8qIEVudGVyICovXG5cdFhLX0tQX0YxOiAgICAgICAgICAgICAgICAgICAgICAgMHhmZjkxLCAvKiBQRjEsIEtQX0EsIC4uLiAqL1xuXHRYS19LUF9GMjogICAgICAgICAgICAgICAgICAgICAgIDB4ZmY5Mixcblx0WEtfS1BfRjM6ICAgICAgICAgICAgICAgICAgICAgICAweGZmOTMsXG5cdFhLX0tQX0Y0OiAgICAgICAgICAgICAgICAgICAgICAgMHhmZjk0LFxuXHRYS19LUF9Ib21lOiAgICAgICAgICAgICAgICAgICAgIDB4ZmY5NSxcblx0WEtfS1BfTGVmdDogICAgICAgICAgICAgICAgICAgICAweGZmOTYsXG5cdFhLX0tQX1VwOiAgICAgICAgICAgICAgICAgICAgICAgMHhmZjk3LFxuXHRYS19LUF9SaWdodDogICAgICAgICAgICAgICAgICAgIDB4ZmY5OCxcblx0WEtfS1BfRG93bjogICAgICAgICAgICAgICAgICAgICAweGZmOTksXG5cdFhLX0tQX1ByaW9yOiAgICAgICAgICAgICAgICAgICAgMHhmZjlhLFxuXHRYS19LUF9QYWdlX1VwOiAgICAgICAgICAgICAgICAgIDB4ZmY5YSwgIC8vIE5PVEU6IGliYyBmaXggKGNvbW1hIHdhcyBtaXNzaW5nKVxuXHRYS19LUF9OZXh0OiAgICAgICAgICAgICAgICAgICAgIDB4ZmY5Yixcblx0WEtfS1BfUGFnZV9Eb3duOiAgICAgICAgICAgICAgICAweGZmOWIsXG5cdFhLX0tQX0VuZDogICAgICAgICAgICAgICAgICAgICAgMHhmZjljLFxuXHRYS19LUF9CZWdpbjogICAgICAgICAgICAgICAgICAgIDB4ZmY5ZCxcblx0WEtfS1BfSW5zZXJ0OiAgICAgICAgICAgICAgICAgICAweGZmOWUsXG5cdFhLX0tQX0RlbGV0ZTogICAgICAgICAgICAgICAgICAgMHhmZjlmLFxuXHRYS19LUF9FcXVhbDogICAgICAgICAgICAgICAgICAgIDB4ZmZiZCwgLyogRXF1YWxzICovXG5cdFhLX0tQX011bHRpcGx5OiAgICAgICAgICAgICAgICAgMHhmZmFhLFxuXHRYS19LUF9BZGQ6ICAgICAgICAgICAgICAgICAgICAgIDB4ZmZhYixcblx0WEtfS1BfU2VwYXJhdG9yOiAgICAgICAgICAgICAgICAweGZmYWMsIC8qIFNlcGFyYXRvciwgb2Z0ZW4gY29tbWEgKi9cblx0WEtfS1BfU3VidHJhY3Q6ICAgICAgICAgICAgICAgICAweGZmYWQsXG5cdFhLX0tQX0RlY2ltYWw6ICAgICAgICAgICAgICAgICAgMHhmZmFlLFxuXHRYS19LUF9EaXZpZGU6ICAgICAgICAgICAgICAgICAgIDB4ZmZhZixcblxuXHRYS19LUF8wOiAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZiMCxcblx0WEtfS1BfMTogICAgICAgICAgICAgICAgICAgICAgICAweGZmYjEsXG5cdFhLX0tQXzI6ICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmIyLFxuXHRYS19LUF8zOiAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZiMyxcblx0WEtfS1BfNDogICAgICAgICAgICAgICAgICAgICAgICAweGZmYjQsXG5cdFhLX0tQXzU6ICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmI1LFxuXHRYS19LUF82OiAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZiNixcblx0WEtfS1BfNzogICAgICAgICAgICAgICAgICAgICAgICAweGZmYjcsXG5cdFhLX0tQXzg6ICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmI4LFxuXHRYS19LUF85OiAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZiOSxcblxuXHQvKlxuXHQgKiBBdXhpbGlhcnkgZnVuY3Rpb25zOyBub3RlIHRoZSBkdXBsaWNhdGUgZGVmaW5pdGlvbnMgZm9yIGxlZnQgYW5kIHJpZ2h0XG5cdCAqIGZ1bmN0aW9uIGtleXM7ICBTdW4ga2V5Ym9hcmRzIGFuZCBhIGZldyBvdGhlciBtYW51ZmFjdHVyZXJzIGhhdmUgc3VjaFxuXHQgKiBmdW5jdGlvbiBrZXkgZ3JvdXBzIG9uIHRoZSBsZWZ0IGFuZC9vciByaWdodCBzaWRlcyBvZiB0aGUga2V5Ym9hcmQuXG5cdCAqIFdlJ3ZlIG5vdCBmb3VuZCBhIGtleWJvYXJkIHdpdGggbW9yZSB0aGFuIDM1IGZ1bmN0aW9uIGtleXMgdG90YWwuXG5cdCAqL1xuXG5cdFhLX0YxOiAgICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmJlLFxuXHRYS19GMjogICAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZiZixcblx0WEtfRjM6ICAgICAgICAgICAgICAgICAgICAgICAgICAweGZmYzAsXG5cdFhLX0Y0OiAgICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmMxLFxuXHRYS19GNTogICAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZjMixcblx0WEtfRjY6ICAgICAgICAgICAgICAgICAgICAgICAgICAweGZmYzMsXG5cdFhLX0Y3OiAgICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmM0LFxuXHRYS19GODogICAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZjNSxcblx0WEtfRjk6ICAgICAgICAgICAgICAgICAgICAgICAgICAweGZmYzYsXG5cdFhLX0YxMDogICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmM3LFxuXHRYS19GMTE6ICAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZjOCxcblx0WEtfTDE6ICAgICAgICAgICAgICAgICAgICAgICAgICAweGZmYzgsXG5cdFhLX0YxMjogICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmM5LFxuXHRYS19MMjogICAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZjOSxcblx0WEtfRjEzOiAgICAgICAgICAgICAgICAgICAgICAgICAweGZmY2EsXG5cdFhLX0wzOiAgICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmNhLFxuXHRYS19GMTQ6ICAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZjYixcblx0WEtfTDQ6ICAgICAgICAgICAgICAgICAgICAgICAgICAweGZmY2IsXG5cdFhLX0YxNTogICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmNjLFxuXHRYS19MNTogICAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZjYyxcblx0WEtfRjE2OiAgICAgICAgICAgICAgICAgICAgICAgICAweGZmY2QsXG5cdFhLX0w2OiAgICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmNkLFxuXHRYS19GMTc6ICAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZjZSxcblx0WEtfTDc6ICAgICAgICAgICAgICAgICAgICAgICAgICAweGZmY2UsXG5cdFhLX0YxODogICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmNmLFxuXHRYS19MODogICAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZjZixcblx0WEtfRjE5OiAgICAgICAgICAgICAgICAgICAgICAgICAweGZmZDAsXG5cdFhLX0w5OiAgICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmQwLFxuXHRYS19GMjA6ICAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZkMSxcblx0WEtfTDEwOiAgICAgICAgICAgICAgICAgICAgICAgICAweGZmZDEsXG5cdFhLX0YyMTogICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmQyLFxuXHRYS19SMTogICAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZkMixcblx0WEtfRjIyOiAgICAgICAgICAgICAgICAgICAgICAgICAweGZmZDMsXG5cdFhLX1IyOiAgICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmQzLFxuXHRYS19GMjM6ICAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZkNCxcblx0WEtfUjM6ICAgICAgICAgICAgICAgICAgICAgICAgICAweGZmZDQsXG5cdFhLX0YyNDogICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmQ1LFxuXHRYS19SNDogICAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZkNSxcblx0WEtfRjI1OiAgICAgICAgICAgICAgICAgICAgICAgICAweGZmZDYsXG5cdFhLX1I1OiAgICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmQ2LFxuXHRYS19GMjY6ICAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZkNyxcblx0WEtfUjY6ICAgICAgICAgICAgICAgICAgICAgICAgICAweGZmZDcsXG5cdFhLX0YyNzogICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmQ4LFxuXHRYS19SNzogICAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZkOCxcblx0WEtfRjI4OiAgICAgICAgICAgICAgICAgICAgICAgICAweGZmZDksXG5cdFhLX1I4OiAgICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmQ5LFxuXHRYS19GMjk6ICAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZkYSxcblx0WEtfUjk6ICAgICAgICAgICAgICAgICAgICAgICAgICAweGZmZGEsXG5cdFhLX0YzMDogICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmRiLFxuXHRYS19SMTA6ICAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZkYixcblx0WEtfRjMxOiAgICAgICAgICAgICAgICAgICAgICAgICAweGZmZGMsXG5cdFhLX1IxMTogICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmRjLFxuXHRYS19GMzI6ICAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZkZCxcblx0WEtfUjEyOiAgICAgICAgICAgICAgICAgICAgICAgICAweGZmZGQsXG5cdFhLX0YzMzogICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmRlLFxuXHRYS19SMTM6ICAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZkZSxcblx0WEtfRjM0OiAgICAgICAgICAgICAgICAgICAgICAgICAweGZmZGYsXG5cdFhLX1IxNDogICAgICAgICAgICAgICAgICAgICAgICAgMHhmZmRmLFxuXHRYS19GMzU6ICAgICAgICAgICAgICAgICAgICAgICAgIDB4ZmZlMCxcblx0WEtfUjE1OiAgICAgICAgICAgICAgICAgICAgICAgICAweGZmZTAsXG5cblx0LyogTW9kaWZpZXJzICovXG5cblx0WEtfU2hpZnRfTDogICAgICAgICAgICAgICAgICAgICAweGZmZTEsIC8qIExlZnQgc2hpZnQgKi9cblx0WEtfU2hpZnRfUjogICAgICAgICAgICAgICAgICAgICAweGZmZTIsIC8qIFJpZ2h0IHNoaWZ0ICovXG5cdFhLX0NvbnRyb2xfTDogICAgICAgICAgICAgICAgICAgMHhmZmUzLCAvKiBMZWZ0IGNvbnRyb2wgKi9cblx0WEtfQ29udHJvbF9SOiAgICAgICAgICAgICAgICAgICAweGZmZTQsIC8qIFJpZ2h0IGNvbnRyb2wgKi9cblx0WEtfQ2Fwc19Mb2NrOiAgICAgICAgICAgICAgICAgICAweGZmZTUsIC8qIENhcHMgbG9jayAqL1xuXHRYS19TaGlmdF9Mb2NrOiAgICAgICAgICAgICAgICAgIDB4ZmZlNiwgLyogU2hpZnQgbG9jayAqL1xuXG5cdFhLX01ldGFfTDogICAgICAgICAgICAgICAgICAgICAgMHhmZmU3LCAvKiBMZWZ0IG1ldGEgKi9cblx0WEtfTWV0YV9SOiAgICAgICAgICAgICAgICAgICAgICAweGZmZTgsIC8qIFJpZ2h0IG1ldGEgKi9cblx0WEtfQWx0X0w6ICAgICAgICAgICAgICAgICAgICAgICAweGZmZTksIC8qIExlZnQgYWx0ICovXG5cdFhLX0FsdF9SOiAgICAgICAgICAgICAgICAgICAgICAgMHhmZmVhLCAvKiBSaWdodCBhbHQgKi9cblx0WEtfU3VwZXJfTDogICAgICAgICAgICAgICAgICAgICAweGZmZWIsIC8qIExlZnQgc3VwZXIgKi9cblx0WEtfU3VwZXJfUjogICAgICAgICAgICAgICAgICAgICAweGZmZWMsIC8qIFJpZ2h0IHN1cGVyICovXG5cdFhLX0h5cGVyX0w6ICAgICAgICAgICAgICAgICAgICAgMHhmZmVkLCAvKiBMZWZ0IGh5cGVyICovXG5cdFhLX0h5cGVyX1I6ICAgICAgICAgICAgICAgICAgICAgMHhmZmVlLCAvKiBSaWdodCBoeXBlciAqL1xuXG5cdFhLX0lTT19MZXZlbDNfU2hpZnQ6ICAgICAgICAgICAgMHhmZTAzLCAvKiBBbHRHciAqL1xuXG5cdC8qXG5cdCAqIExhdGluIDFcblx0ICogKElTTy9JRUMgODg1OS0xOiBVbmljb2RlIFUrMDAyMC4uVSswMEZGKVxuXHQgKiBCeXRlIDMgPSAwXG5cdCAqL1xuXG5cdFhLX3NwYWNlOiAgICAgICAgICAgICAgICAgICAgICAgMHgwMDIwLCAvKiBVKzAwMjAgU1BBQ0UgKi9cblx0WEtfZXhjbGFtOiAgICAgICAgICAgICAgICAgICAgICAweDAwMjEsIC8qIFUrMDAyMSBFWENMQU1BVElPTiBNQVJLICovXG5cdFhLX3F1b3RlZGJsOiAgICAgICAgICAgICAgICAgICAgMHgwMDIyLCAvKiBVKzAwMjIgUVVPVEFUSU9OIE1BUksgKi9cblx0WEtfbnVtYmVyc2lnbjogICAgICAgICAgICAgICAgICAweDAwMjMsIC8qIFUrMDAyMyBOVU1CRVIgU0lHTiAqL1xuXHRYS19kb2xsYXI6ICAgICAgICAgICAgICAgICAgICAgIDB4MDAyNCwgLyogVSswMDI0IERPTExBUiBTSUdOICovXG5cdFhLX3BlcmNlbnQ6ICAgICAgICAgICAgICAgICAgICAgMHgwMDI1LCAvKiBVKzAwMjUgUEVSQ0VOVCBTSUdOICovXG5cdFhLX2FtcGVyc2FuZDogICAgICAgICAgICAgICAgICAgMHgwMDI2LCAvKiBVKzAwMjYgQU1QRVJTQU5EICovXG5cdFhLX2Fwb3N0cm9waGU6ICAgICAgICAgICAgICAgICAgMHgwMDI3LCAvKiBVKzAwMjcgQVBPU1RST1BIRSAqL1xuXHRYS19xdW90ZXJpZ2h0OiAgICAgICAgICAgICAgICAgIDB4MDAyNywgLyogZGVwcmVjYXRlZCAqL1xuXHRYS19wYXJlbmxlZnQ6ICAgICAgICAgICAgICAgICAgIDB4MDAyOCwgLyogVSswMDI4IExFRlQgUEFSRU5USEVTSVMgKi9cblx0WEtfcGFyZW5yaWdodDogICAgICAgICAgICAgICAgICAweDAwMjksIC8qIFUrMDAyOSBSSUdIVCBQQVJFTlRIRVNJUyAqL1xuXHRYS19hc3RlcmlzazogICAgICAgICAgICAgICAgICAgIDB4MDAyYSwgLyogVSswMDJBIEFTVEVSSVNLICovXG5cdFhLX3BsdXM6ICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDJiLCAvKiBVKzAwMkIgUExVUyBTSUdOICovXG5cdFhLX2NvbW1hOiAgICAgICAgICAgICAgICAgICAgICAgMHgwMDJjLCAvKiBVKzAwMkMgQ09NTUEgKi9cblx0WEtfbWludXM6ICAgICAgICAgICAgICAgICAgICAgICAweDAwMmQsIC8qIFUrMDAyRCBIWVBIRU4tTUlOVVMgKi9cblx0WEtfcGVyaW9kOiAgICAgICAgICAgICAgICAgICAgICAweDAwMmUsIC8qIFUrMDAyRSBGVUxMIFNUT1AgKi9cblx0WEtfc2xhc2g6ICAgICAgICAgICAgICAgICAgICAgICAweDAwMmYsIC8qIFUrMDAyRiBTT0xJRFVTICovXG5cdFhLXzA6ICAgICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDMwLCAvKiBVKzAwMzAgRElHSVQgWkVSTyAqL1xuXHRYS18xOiAgICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDAzMSwgLyogVSswMDMxIERJR0lUIE9ORSAqL1xuXHRYS18yOiAgICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDAzMiwgLyogVSswMDMyIERJR0lUIFRXTyAqL1xuXHRYS18zOiAgICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDAzMywgLyogVSswMDMzIERJR0lUIFRIUkVFICovXG5cdFhLXzQ6ICAgICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDM0LCAvKiBVKzAwMzQgRElHSVQgRk9VUiAqL1xuXHRYS181OiAgICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDAzNSwgLyogVSswMDM1IERJR0lUIEZJVkUgKi9cblx0WEtfNjogICAgICAgICAgICAgICAgICAgICAgICAgICAweDAwMzYsIC8qIFUrMDAzNiBESUdJVCBTSVggKi9cblx0WEtfNzogICAgICAgICAgICAgICAgICAgICAgICAgICAweDAwMzcsIC8qIFUrMDAzNyBESUdJVCBTRVZFTiAqL1xuXHRYS184OiAgICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDAzOCwgLyogVSswMDM4IERJR0lUIEVJR0hUICovXG5cdFhLXzk6ICAgICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDM5LCAvKiBVKzAwMzkgRElHSVQgTklORSAqL1xuXHRYS19jb2xvbjogICAgICAgICAgICAgICAgICAgICAgIDB4MDAzYSwgLyogVSswMDNBIENPTE9OICovXG5cdFhLX3NlbWljb2xvbjogICAgICAgICAgICAgICAgICAgMHgwMDNiLCAvKiBVKzAwM0IgU0VNSUNPTE9OICovXG5cdFhLX2xlc3M6ICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDNjLCAvKiBVKzAwM0MgTEVTUy1USEFOIFNJR04gKi9cblx0WEtfZXF1YWw6ICAgICAgICAgICAgICAgICAgICAgICAweDAwM2QsIC8qIFUrMDAzRCBFUVVBTFMgU0lHTiAqL1xuXHRYS19ncmVhdGVyOiAgICAgICAgICAgICAgICAgICAgIDB4MDAzZSwgLyogVSswMDNFIEdSRUFURVItVEhBTiBTSUdOICovXG5cdFhLX3F1ZXN0aW9uOiAgICAgICAgICAgICAgICAgICAgMHgwMDNmLCAvKiBVKzAwM0YgUVVFU1RJT04gTUFSSyAqL1xuXHRYS19hdDogICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDA0MCwgLyogVSswMDQwIENPTU1FUkNJQUwgQVQgKi9cblx0WEtfQTogICAgICAgICAgICAgICAgICAgICAgICAgICAweDAwNDEsIC8qIFUrMDA0MSBMQVRJTiBDQVBJVEFMIExFVFRFUiBBICovXG5cdFhLX0I6ICAgICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDQyLCAvKiBVKzAwNDIgTEFUSU4gQ0FQSVRBTCBMRVRURVIgQiAqL1xuXHRYS19DOiAgICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDA0MywgLyogVSswMDQzIExBVElOIENBUElUQUwgTEVUVEVSIEMgKi9cblx0WEtfRDogICAgICAgICAgICAgICAgICAgICAgICAgICAweDAwNDQsIC8qIFUrMDA0NCBMQVRJTiBDQVBJVEFMIExFVFRFUiBEICovXG5cdFhLX0U6ICAgICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDQ1LCAvKiBVKzAwNDUgTEFUSU4gQ0FQSVRBTCBMRVRURVIgRSAqL1xuXHRYS19GOiAgICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDA0NiwgLyogVSswMDQ2IExBVElOIENBUElUQUwgTEVUVEVSIEYgKi9cblx0WEtfRzogICAgICAgICAgICAgICAgICAgICAgICAgICAweDAwNDcsIC8qIFUrMDA0NyBMQVRJTiBDQVBJVEFMIExFVFRFUiBHICovXG5cdFhLX0g6ICAgICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDQ4LCAvKiBVKzAwNDggTEFUSU4gQ0FQSVRBTCBMRVRURVIgSCAqL1xuXHRYS19JOiAgICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDA0OSwgLyogVSswMDQ5IExBVElOIENBUElUQUwgTEVUVEVSIEkgKi9cblx0WEtfSjogICAgICAgICAgICAgICAgICAgICAgICAgICAweDAwNGEsIC8qIFUrMDA0QSBMQVRJTiBDQVBJVEFMIExFVFRFUiBKICovXG5cdFhLX0s6ICAgICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDRiLCAvKiBVKzAwNEIgTEFUSU4gQ0FQSVRBTCBMRVRURVIgSyAqL1xuXHRYS19MOiAgICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDA0YywgLyogVSswMDRDIExBVElOIENBUElUQUwgTEVUVEVSIEwgKi9cblx0WEtfTTogICAgICAgICAgICAgICAgICAgICAgICAgICAweDAwNGQsIC8qIFUrMDA0RCBMQVRJTiBDQVBJVEFMIExFVFRFUiBNICovXG5cdFhLX046ICAgICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDRlLCAvKiBVKzAwNEUgTEFUSU4gQ0FQSVRBTCBMRVRURVIgTiAqL1xuXHRYS19POiAgICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDA0ZiwgLyogVSswMDRGIExBVElOIENBUElUQUwgTEVUVEVSIE8gKi9cblx0WEtfUDogICAgICAgICAgICAgICAgICAgICAgICAgICAweDAwNTAsIC8qIFUrMDA1MCBMQVRJTiBDQVBJVEFMIExFVFRFUiBQICovXG5cdFhLX1E6ICAgICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDUxLCAvKiBVKzAwNTEgTEFUSU4gQ0FQSVRBTCBMRVRURVIgUSAqL1xuXHRYS19SOiAgICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDA1MiwgLyogVSswMDUyIExBVElOIENBUElUQUwgTEVUVEVSIFIgKi9cblx0WEtfUzogICAgICAgICAgICAgICAgICAgICAgICAgICAweDAwNTMsIC8qIFUrMDA1MyBMQVRJTiBDQVBJVEFMIExFVFRFUiBTICovXG5cdFhLX1Q6ICAgICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDU0LCAvKiBVKzAwNTQgTEFUSU4gQ0FQSVRBTCBMRVRURVIgVCAqL1xuXHRYS19VOiAgICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDA1NSwgLyogVSswMDU1IExBVElOIENBUElUQUwgTEVUVEVSIFUgKi9cblx0WEtfVjogICAgICAgICAgICAgICAgICAgICAgICAgICAweDAwNTYsIC8qIFUrMDA1NiBMQVRJTiBDQVBJVEFMIExFVFRFUiBWICovXG5cdFhLX1c6ICAgICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDU3LCAvKiBVKzAwNTcgTEFUSU4gQ0FQSVRBTCBMRVRURVIgVyAqL1xuXHRYS19YOiAgICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDA1OCwgLyogVSswMDU4IExBVElOIENBUElUQUwgTEVUVEVSIFggKi9cblx0WEtfWTogICAgICAgICAgICAgICAgICAgICAgICAgICAweDAwNTksIC8qIFUrMDA1OSBMQVRJTiBDQVBJVEFMIExFVFRFUiBZICovXG5cdFhLX1o6ICAgICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDVhLCAvKiBVKzAwNUEgTEFUSU4gQ0FQSVRBTCBMRVRURVIgWiAqL1xuXHRYS19icmFja2V0bGVmdDogICAgICAgICAgICAgICAgIDB4MDA1YiwgLyogVSswMDVCIExFRlQgU1FVQVJFIEJSQUNLRVQgKi9cblx0WEtfYmFja3NsYXNoOiAgICAgICAgICAgICAgICAgICAweDAwNWMsIC8qIFUrMDA1QyBSRVZFUlNFIFNPTElEVVMgKi9cblx0WEtfYnJhY2tldHJpZ2h0OiAgICAgICAgICAgICAgICAweDAwNWQsIC8qIFUrMDA1RCBSSUdIVCBTUVVBUkUgQlJBQ0tFVCAqL1xuXHRYS19hc2NpaWNpcmN1bTogICAgICAgICAgICAgICAgIDB4MDA1ZSwgLyogVSswMDVFIENJUkNVTUZMRVggQUNDRU5UICovXG5cdFhLX3VuZGVyc2NvcmU6ICAgICAgICAgICAgICAgICAgMHgwMDVmLCAvKiBVKzAwNUYgTE9XIExJTkUgKi9cblx0WEtfZ3JhdmU6ICAgICAgICAgICAgICAgICAgICAgICAweDAwNjAsIC8qIFUrMDA2MCBHUkFWRSBBQ0NFTlQgKi9cblx0WEtfcXVvdGVsZWZ0OiAgICAgICAgICAgICAgICAgICAweDAwNjAsIC8qIGRlcHJlY2F0ZWQgKi9cblx0WEtfYTogICAgICAgICAgICAgICAgICAgICAgICAgICAweDAwNjEsIC8qIFUrMDA2MSBMQVRJTiBTTUFMTCBMRVRURVIgQSAqL1xuXHRYS19iOiAgICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDA2MiwgLyogVSswMDYyIExBVElOIFNNQUxMIExFVFRFUiBCICovXG5cdFhLX2M6ICAgICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDYzLCAvKiBVKzAwNjMgTEFUSU4gU01BTEwgTEVUVEVSIEMgKi9cblx0WEtfZDogICAgICAgICAgICAgICAgICAgICAgICAgICAweDAwNjQsIC8qIFUrMDA2NCBMQVRJTiBTTUFMTCBMRVRURVIgRCAqL1xuXHRYS19lOiAgICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDA2NSwgLyogVSswMDY1IExBVElOIFNNQUxMIExFVFRFUiBFICovXG5cdFhLX2Y6ICAgICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDY2LCAvKiBVKzAwNjYgTEFUSU4gU01BTEwgTEVUVEVSIEYgKi9cblx0WEtfZzogICAgICAgICAgICAgICAgICAgICAgICAgICAweDAwNjcsIC8qIFUrMDA2NyBMQVRJTiBTTUFMTCBMRVRURVIgRyAqL1xuXHRYS19oOiAgICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDA2OCwgLyogVSswMDY4IExBVElOIFNNQUxMIExFVFRFUiBIICovXG5cdFhLX2k6ICAgICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDY5LCAvKiBVKzAwNjkgTEFUSU4gU01BTEwgTEVUVEVSIEkgKi9cblx0WEtfajogICAgICAgICAgICAgICAgICAgICAgICAgICAweDAwNmEsIC8qIFUrMDA2QSBMQVRJTiBTTUFMTCBMRVRURVIgSiAqL1xuXHRYS19rOiAgICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDA2YiwgLyogVSswMDZCIExBVElOIFNNQUxMIExFVFRFUiBLICovXG5cdFhLX2w6ICAgICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDZjLCAvKiBVKzAwNkMgTEFUSU4gU01BTEwgTEVUVEVSIEwgKi9cblx0WEtfbTogICAgICAgICAgICAgICAgICAgICAgICAgICAweDAwNmQsIC8qIFUrMDA2RCBMQVRJTiBTTUFMTCBMRVRURVIgTSAqL1xuXHRYS19uOiAgICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDA2ZSwgLyogVSswMDZFIExBVElOIFNNQUxMIExFVFRFUiBOICovXG5cdFhLX286ICAgICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDZmLCAvKiBVKzAwNkYgTEFUSU4gU01BTEwgTEVUVEVSIE8gKi9cblx0WEtfcDogICAgICAgICAgICAgICAgICAgICAgICAgICAweDAwNzAsIC8qIFUrMDA3MCBMQVRJTiBTTUFMTCBMRVRURVIgUCAqL1xuXHRYS19xOiAgICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDA3MSwgLyogVSswMDcxIExBVElOIFNNQUxMIExFVFRFUiBRICovXG5cdFhLX3I6ICAgICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDcyLCAvKiBVKzAwNzIgTEFUSU4gU01BTEwgTEVUVEVSIFIgKi9cblx0WEtfczogICAgICAgICAgICAgICAgICAgICAgICAgICAweDAwNzMsIC8qIFUrMDA3MyBMQVRJTiBTTUFMTCBMRVRURVIgUyAqL1xuXHRYS190OiAgICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDA3NCwgLyogVSswMDc0IExBVElOIFNNQUxMIExFVFRFUiBUICovXG5cdFhLX3U6ICAgICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDc1LCAvKiBVKzAwNzUgTEFUSU4gU01BTEwgTEVUVEVSIFUgKi9cblx0WEtfdjogICAgICAgICAgICAgICAgICAgICAgICAgICAweDAwNzYsIC8qIFUrMDA3NiBMQVRJTiBTTUFMTCBMRVRURVIgViAqL1xuXHRYS193OiAgICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDA3NywgLyogVSswMDc3IExBVElOIFNNQUxMIExFVFRFUiBXICovXG5cdFhLX3g6ICAgICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDc4LCAvKiBVKzAwNzggTEFUSU4gU01BTEwgTEVUVEVSIFggKi9cblx0WEtfeTogICAgICAgICAgICAgICAgICAgICAgICAgICAweDAwNzksIC8qIFUrMDA3OSBMQVRJTiBTTUFMTCBMRVRURVIgWSAqL1xuXHRYS196OiAgICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDA3YSwgLyogVSswMDdBIExBVElOIFNNQUxMIExFVFRFUiBaICovXG5cdFhLX2JyYWNlbGVmdDogICAgICAgICAgICAgICAgICAgMHgwMDdiLCAvKiBVKzAwN0IgTEVGVCBDVVJMWSBCUkFDS0VUICovXG5cdFhLX2JhcjogICAgICAgICAgICAgICAgICAgICAgICAgMHgwMDdjLCAvKiBVKzAwN0MgVkVSVElDQUwgTElORSAqL1xuXHRYS19icmFjZXJpZ2h0OiAgICAgICAgICAgICAgICAgIDB4MDA3ZCwgLyogVSswMDdEIFJJR0hUIENVUkxZIEJSQUNLRVQgKi9cblx0WEtfYXNjaWl0aWxkZTogICAgICAgICAgICAgICAgICAweDAwN2UsIC8qIFUrMDA3RSBUSUxERSAqL1xuXG5cdFhLX25vYnJlYWtzcGFjZTogICAgICAgICAgICAgICAgMHgwMGEwLCAvKiBVKzAwQTAgTk8tQlJFQUsgU1BBQ0UgKi9cblx0WEtfZXhjbGFtZG93bjogICAgICAgICAgICAgICAgICAweDAwYTEsIC8qIFUrMDBBMSBJTlZFUlRFRCBFWENMQU1BVElPTiBNQVJLICovXG5cdFhLX2NlbnQ6ICAgICAgICAgICAgICAgICAgICAgICAgMHgwMGEyLCAvKiBVKzAwQTIgQ0VOVCBTSUdOICovXG5cdFhLX3N0ZXJsaW5nOiAgICAgICAgICAgICAgICAgICAgMHgwMGEzLCAvKiBVKzAwQTMgUE9VTkQgU0lHTiAqL1xuXHRYS19jdXJyZW5jeTogICAgICAgICAgICAgICAgICAgIDB4MDBhNCwgLyogVSswMEE0IENVUlJFTkNZIFNJR04gKi9cblx0WEtfeWVuOiAgICAgICAgICAgICAgICAgICAgICAgICAweDAwYTUsIC8qIFUrMDBBNSBZRU4gU0lHTiAqL1xuXHRYS19icm9rZW5iYXI6ICAgICAgICAgICAgICAgICAgIDB4MDBhNiwgLyogVSswMEE2IEJST0tFTiBCQVIgKi9cblx0WEtfc2VjdGlvbjogICAgICAgICAgICAgICAgICAgICAweDAwYTcsIC8qIFUrMDBBNyBTRUNUSU9OIFNJR04gKi9cblx0WEtfZGlhZXJlc2lzOiAgICAgICAgICAgICAgICAgICAweDAwYTgsIC8qIFUrMDBBOCBESUFFUkVTSVMgKi9cblx0WEtfY29weXJpZ2h0OiAgICAgICAgICAgICAgICAgICAweDAwYTksIC8qIFUrMDBBOSBDT1BZUklHSFQgU0lHTiAqL1xuXHRYS19vcmRmZW1pbmluZTogICAgICAgICAgICAgICAgIDB4MDBhYSwgLyogVSswMEFBIEZFTUlOSU5FIE9SRElOQUwgSU5ESUNBVE9SICovXG5cdFhLX2d1aWxsZW1vdGxlZnQ6ICAgICAgICAgICAgICAgMHgwMGFiLCAvKiBVKzAwQUIgTEVGVC1QT0lOVElORyBET1VCTEUgQU5HTEUgUVVPVEFUSU9OIE1BUksgKi9cblx0WEtfbm90c2lnbjogICAgICAgICAgICAgICAgICAgICAweDAwYWMsIC8qIFUrMDBBQyBOT1QgU0lHTiAqL1xuXHRYS19oeXBoZW46ICAgICAgICAgICAgICAgICAgICAgIDB4MDBhZCwgLyogVSswMEFEIFNPRlQgSFlQSEVOICovXG5cdFhLX3JlZ2lzdGVyZWQ6ICAgICAgICAgICAgICAgICAgMHgwMGFlLCAvKiBVKzAwQUUgUkVHSVNURVJFRCBTSUdOICovXG5cdFhLX21hY3JvbjogICAgICAgICAgICAgICAgICAgICAgMHgwMGFmLCAvKiBVKzAwQUYgTUFDUk9OICovXG5cdFhLX2RlZ3JlZTogICAgICAgICAgICAgICAgICAgICAgMHgwMGIwLCAvKiBVKzAwQjAgREVHUkVFIFNJR04gKi9cblx0WEtfcGx1c21pbnVzOiAgICAgICAgICAgICAgICAgICAweDAwYjEsIC8qIFUrMDBCMSBQTFVTLU1JTlVTIFNJR04gKi9cblx0WEtfdHdvc3VwZXJpb3I6ICAgICAgICAgICAgICAgICAweDAwYjIsIC8qIFUrMDBCMiBTVVBFUlNDUklQVCBUV08gKi9cblx0WEtfdGhyZWVzdXBlcmlvcjogICAgICAgICAgICAgICAweDAwYjMsIC8qIFUrMDBCMyBTVVBFUlNDUklQVCBUSFJFRSAqL1xuXHRYS19hY3V0ZTogICAgICAgICAgICAgICAgICAgICAgIDB4MDBiNCwgLyogVSswMEI0IEFDVVRFIEFDQ0VOVCAqL1xuXHRYS19tdTogICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDBiNSwgLyogVSswMEI1IE1JQ1JPIFNJR04gKi9cblx0WEtfcGFyYWdyYXBoOiAgICAgICAgICAgICAgICAgICAweDAwYjYsIC8qIFUrMDBCNiBQSUxDUk9XIFNJR04gKi9cblx0WEtfcGVyaW9kY2VudGVyZWQ6ICAgICAgICAgICAgICAweDAwYjcsIC8qIFUrMDBCNyBNSURETEUgRE9UICovXG5cdFhLX2NlZGlsbGE6ICAgICAgICAgICAgICAgICAgICAgMHgwMGI4LCAvKiBVKzAwQjggQ0VESUxMQSAqL1xuXHRYS19vbmVzdXBlcmlvcjogICAgICAgICAgICAgICAgIDB4MDBiOSwgLyogVSswMEI5IFNVUEVSU0NSSVBUIE9ORSAqL1xuXHRYS19tYXNjdWxpbmU6ICAgICAgICAgICAgICAgICAgIDB4MDBiYSwgLyogVSswMEJBIE1BU0NVTElORSBPUkRJTkFMIElORElDQVRPUiAqL1xuXHRYS19ndWlsbGVtb3RyaWdodDogICAgICAgICAgICAgIDB4MDBiYiwgLyogVSswMEJCIFJJR0hULVBPSU5USU5HIERPVUJMRSBBTkdMRSBRVU9UQVRJT04gTUFSSyAqL1xuXHRYS19vbmVxdWFydGVyOiAgICAgICAgICAgICAgICAgIDB4MDBiYywgLyogVSswMEJDIFZVTEdBUiBGUkFDVElPTiBPTkUgUVVBUlRFUiAqL1xuXHRYS19vbmVoYWxmOiAgICAgICAgICAgICAgICAgICAgIDB4MDBiZCwgLyogVSswMEJEIFZVTEdBUiBGUkFDVElPTiBPTkUgSEFMRiAqL1xuXHRYS190aHJlZXF1YXJ0ZXJzOiAgICAgICAgICAgICAgIDB4MDBiZSwgLyogVSswMEJFIFZVTEdBUiBGUkFDVElPTiBUSFJFRSBRVUFSVEVSUyAqL1xuXHRYS19xdWVzdGlvbmRvd246ICAgICAgICAgICAgICAgIDB4MDBiZiwgLyogVSswMEJGIElOVkVSVEVEIFFVRVNUSU9OIE1BUksgKi9cblx0WEtfQWdyYXZlOiAgICAgICAgICAgICAgICAgICAgICAweDAwYzAsIC8qIFUrMDBDMCBMQVRJTiBDQVBJVEFMIExFVFRFUiBBIFdJVEggR1JBVkUgKi9cblx0WEtfQWFjdXRlOiAgICAgICAgICAgICAgICAgICAgICAweDAwYzEsIC8qIFUrMDBDMSBMQVRJTiBDQVBJVEFMIExFVFRFUiBBIFdJVEggQUNVVEUgKi9cblx0WEtfQWNpcmN1bWZsZXg6ICAgICAgICAgICAgICAgICAweDAwYzIsIC8qIFUrMDBDMiBMQVRJTiBDQVBJVEFMIExFVFRFUiBBIFdJVEggQ0lSQ1VNRkxFWCAqL1xuXHRYS19BdGlsZGU6ICAgICAgICAgICAgICAgICAgICAgIDB4MDBjMywgLyogVSswMEMzIExBVElOIENBUElUQUwgTEVUVEVSIEEgV0lUSCBUSUxERSAqL1xuXHRYS19BZGlhZXJlc2lzOiAgICAgICAgICAgICAgICAgIDB4MDBjNCwgLyogVSswMEM0IExBVElOIENBUElUQUwgTEVUVEVSIEEgV0lUSCBESUFFUkVTSVMgKi9cblx0WEtfQXJpbmc6ICAgICAgICAgICAgICAgICAgICAgICAweDAwYzUsIC8qIFUrMDBDNSBMQVRJTiBDQVBJVEFMIExFVFRFUiBBIFdJVEggUklORyBBQk9WRSAqL1xuXHRYS19BRTogICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDBjNiwgLyogVSswMEM2IExBVElOIENBUElUQUwgTEVUVEVSIEFFICovXG5cdFhLX0NjZWRpbGxhOiAgICAgICAgICAgICAgICAgICAgMHgwMGM3LCAvKiBVKzAwQzcgTEFUSU4gQ0FQSVRBTCBMRVRURVIgQyBXSVRIIENFRElMTEEgKi9cblx0WEtfRWdyYXZlOiAgICAgICAgICAgICAgICAgICAgICAweDAwYzgsIC8qIFUrMDBDOCBMQVRJTiBDQVBJVEFMIExFVFRFUiBFIFdJVEggR1JBVkUgKi9cblx0WEtfRWFjdXRlOiAgICAgICAgICAgICAgICAgICAgICAweDAwYzksIC8qIFUrMDBDOSBMQVRJTiBDQVBJVEFMIExFVFRFUiBFIFdJVEggQUNVVEUgKi9cblx0WEtfRWNpcmN1bWZsZXg6ICAgICAgICAgICAgICAgICAweDAwY2EsIC8qIFUrMDBDQSBMQVRJTiBDQVBJVEFMIExFVFRFUiBFIFdJVEggQ0lSQ1VNRkxFWCAqL1xuXHRYS19FZGlhZXJlc2lzOiAgICAgICAgICAgICAgICAgIDB4MDBjYiwgLyogVSswMENCIExBVElOIENBUElUQUwgTEVUVEVSIEUgV0lUSCBESUFFUkVTSVMgKi9cblx0WEtfSWdyYXZlOiAgICAgICAgICAgICAgICAgICAgICAweDAwY2MsIC8qIFUrMDBDQyBMQVRJTiBDQVBJVEFMIExFVFRFUiBJIFdJVEggR1JBVkUgKi9cblx0WEtfSWFjdXRlOiAgICAgICAgICAgICAgICAgICAgICAweDAwY2QsIC8qIFUrMDBDRCBMQVRJTiBDQVBJVEFMIExFVFRFUiBJIFdJVEggQUNVVEUgKi9cblx0WEtfSWNpcmN1bWZsZXg6ICAgICAgICAgICAgICAgICAweDAwY2UsIC8qIFUrMDBDRSBMQVRJTiBDQVBJVEFMIExFVFRFUiBJIFdJVEggQ0lSQ1VNRkxFWCAqL1xuXHRYS19JZGlhZXJlc2lzOiAgICAgICAgICAgICAgICAgIDB4MDBjZiwgLyogVSswMENGIExBVElOIENBUElUQUwgTEVUVEVSIEkgV0lUSCBESUFFUkVTSVMgKi9cblx0WEtfRVRIOiAgICAgICAgICAgICAgICAgICAgICAgICAweDAwZDAsIC8qIFUrMDBEMCBMQVRJTiBDQVBJVEFMIExFVFRFUiBFVEggKi9cblx0WEtfRXRoOiAgICAgICAgICAgICAgICAgICAgICAgICAweDAwZDAsIC8qIGRlcHJlY2F0ZWQgKi9cblx0WEtfTnRpbGRlOiAgICAgICAgICAgICAgICAgICAgICAweDAwZDEsIC8qIFUrMDBEMSBMQVRJTiBDQVBJVEFMIExFVFRFUiBOIFdJVEggVElMREUgKi9cblx0WEtfT2dyYXZlOiAgICAgICAgICAgICAgICAgICAgICAweDAwZDIsIC8qIFUrMDBEMiBMQVRJTiBDQVBJVEFMIExFVFRFUiBPIFdJVEggR1JBVkUgKi9cblx0WEtfT2FjdXRlOiAgICAgICAgICAgICAgICAgICAgICAweDAwZDMsIC8qIFUrMDBEMyBMQVRJTiBDQVBJVEFMIExFVFRFUiBPIFdJVEggQUNVVEUgKi9cblx0WEtfT2NpcmN1bWZsZXg6ICAgICAgICAgICAgICAgICAweDAwZDQsIC8qIFUrMDBENCBMQVRJTiBDQVBJVEFMIExFVFRFUiBPIFdJVEggQ0lSQ1VNRkxFWCAqL1xuXHRYS19PdGlsZGU6ICAgICAgICAgICAgICAgICAgICAgIDB4MDBkNSwgLyogVSswMEQ1IExBVElOIENBUElUQUwgTEVUVEVSIE8gV0lUSCBUSUxERSAqL1xuXHRYS19PZGlhZXJlc2lzOiAgICAgICAgICAgICAgICAgIDB4MDBkNiwgLyogVSswMEQ2IExBVElOIENBUElUQUwgTEVUVEVSIE8gV0lUSCBESUFFUkVTSVMgKi9cblx0WEtfbXVsdGlwbHk6ICAgICAgICAgICAgICAgICAgICAweDAwZDcsIC8qIFUrMDBENyBNVUxUSVBMSUNBVElPTiBTSUdOICovXG5cdFhLX09zbGFzaDogICAgICAgICAgICAgICAgICAgICAgMHgwMGQ4LCAvKiBVKzAwRDggTEFUSU4gQ0FQSVRBTCBMRVRURVIgTyBXSVRIIFNUUk9LRSAqL1xuXHRYS19Pb2JsaXF1ZTogICAgICAgICAgICAgICAgICAgIDB4MDBkOCwgLyogVSswMEQ4IExBVElOIENBUElUQUwgTEVUVEVSIE8gV0lUSCBTVFJPS0UgKi9cblx0WEtfVWdyYXZlOiAgICAgICAgICAgICAgICAgICAgICAweDAwZDksIC8qIFUrMDBEOSBMQVRJTiBDQVBJVEFMIExFVFRFUiBVIFdJVEggR1JBVkUgKi9cblx0WEtfVWFjdXRlOiAgICAgICAgICAgICAgICAgICAgICAweDAwZGEsIC8qIFUrMDBEQSBMQVRJTiBDQVBJVEFMIExFVFRFUiBVIFdJVEggQUNVVEUgKi9cblx0WEtfVWNpcmN1bWZsZXg6ICAgICAgICAgICAgICAgICAweDAwZGIsIC8qIFUrMDBEQiBMQVRJTiBDQVBJVEFMIExFVFRFUiBVIFdJVEggQ0lSQ1VNRkxFWCAqL1xuXHRYS19VZGlhZXJlc2lzOiAgICAgICAgICAgICAgICAgIDB4MDBkYywgLyogVSswMERDIExBVElOIENBUElUQUwgTEVUVEVSIFUgV0lUSCBESUFFUkVTSVMgKi9cblx0WEtfWWFjdXRlOiAgICAgICAgICAgICAgICAgICAgICAweDAwZGQsIC8qIFUrMDBERCBMQVRJTiBDQVBJVEFMIExFVFRFUiBZIFdJVEggQUNVVEUgKi9cblx0WEtfVEhPUk46ICAgICAgICAgICAgICAgICAgICAgICAweDAwZGUsIC8qIFUrMDBERSBMQVRJTiBDQVBJVEFMIExFVFRFUiBUSE9STiAqL1xuXHRYS19UaG9ybjogICAgICAgICAgICAgICAgICAgICAgIDB4MDBkZSwgLyogZGVwcmVjYXRlZCAqL1xuXHRYS19zc2hhcnA6ICAgICAgICAgICAgICAgICAgICAgIDB4MDBkZiwgLyogVSswMERGIExBVElOIFNNQUxMIExFVFRFUiBTSEFSUCBTICovXG5cdFhLX2FncmF2ZTogICAgICAgICAgICAgICAgICAgICAgMHgwMGUwLCAvKiBVKzAwRTAgTEFUSU4gU01BTEwgTEVUVEVSIEEgV0lUSCBHUkFWRSAqL1xuXHRYS19hYWN1dGU6ICAgICAgICAgICAgICAgICAgICAgIDB4MDBlMSwgLyogVSswMEUxIExBVElOIFNNQUxMIExFVFRFUiBBIFdJVEggQUNVVEUgKi9cblx0WEtfYWNpcmN1bWZsZXg6ICAgICAgICAgICAgICAgICAweDAwZTIsIC8qIFUrMDBFMiBMQVRJTiBTTUFMTCBMRVRURVIgQSBXSVRIIENJUkNVTUZMRVggKi9cblx0WEtfYXRpbGRlOiAgICAgICAgICAgICAgICAgICAgICAweDAwZTMsIC8qIFUrMDBFMyBMQVRJTiBTTUFMTCBMRVRURVIgQSBXSVRIIFRJTERFICovXG5cdFhLX2FkaWFlcmVzaXM6ICAgICAgICAgICAgICAgICAgMHgwMGU0LCAvKiBVKzAwRTQgTEFUSU4gU01BTEwgTEVUVEVSIEEgV0lUSCBESUFFUkVTSVMgKi9cblx0WEtfYXJpbmc6ICAgICAgICAgICAgICAgICAgICAgICAweDAwZTUsIC8qIFUrMDBFNSBMQVRJTiBTTUFMTCBMRVRURVIgQSBXSVRIIFJJTkcgQUJPVkUgKi9cblx0WEtfYWU6ICAgICAgICAgICAgICAgICAgICAgICAgICAweDAwZTYsIC8qIFUrMDBFNiBMQVRJTiBTTUFMTCBMRVRURVIgQUUgKi9cblx0WEtfY2NlZGlsbGE6ICAgICAgICAgICAgICAgICAgICAweDAwZTcsIC8qIFUrMDBFNyBMQVRJTiBTTUFMTCBMRVRURVIgQyBXSVRIIENFRElMTEEgKi9cblx0WEtfZWdyYXZlOiAgICAgICAgICAgICAgICAgICAgICAweDAwZTgsIC8qIFUrMDBFOCBMQVRJTiBTTUFMTCBMRVRURVIgRSBXSVRIIEdSQVZFICovXG5cdFhLX2VhY3V0ZTogICAgICAgICAgICAgICAgICAgICAgMHgwMGU5LCAvKiBVKzAwRTkgTEFUSU4gU01BTEwgTEVUVEVSIEUgV0lUSCBBQ1VURSAqL1xuXHRYS19lY2lyY3VtZmxleDogICAgICAgICAgICAgICAgIDB4MDBlYSwgLyogVSswMEVBIExBVElOIFNNQUxMIExFVFRFUiBFIFdJVEggQ0lSQ1VNRkxFWCAqL1xuXHRYS19lZGlhZXJlc2lzOiAgICAgICAgICAgICAgICAgIDB4MDBlYiwgLyogVSswMEVCIExBVElOIFNNQUxMIExFVFRFUiBFIFdJVEggRElBRVJFU0lTICovXG5cdFhLX2lncmF2ZTogICAgICAgICAgICAgICAgICAgICAgMHgwMGVjLCAvKiBVKzAwRUMgTEFUSU4gU01BTEwgTEVUVEVSIEkgV0lUSCBHUkFWRSAqL1xuXHRYS19pYWN1dGU6ICAgICAgICAgICAgICAgICAgICAgIDB4MDBlZCwgLyogVSswMEVEIExBVElOIFNNQUxMIExFVFRFUiBJIFdJVEggQUNVVEUgKi9cblx0WEtfaWNpcmN1bWZsZXg6ICAgICAgICAgICAgICAgICAweDAwZWUsIC8qIFUrMDBFRSBMQVRJTiBTTUFMTCBMRVRURVIgSSBXSVRIIENJUkNVTUZMRVggKi9cblx0WEtfaWRpYWVyZXNpczogICAgICAgICAgICAgICAgICAweDAwZWYsIC8qIFUrMDBFRiBMQVRJTiBTTUFMTCBMRVRURVIgSSBXSVRIIERJQUVSRVNJUyAqL1xuXHRYS19ldGg6ICAgICAgICAgICAgICAgICAgICAgICAgIDB4MDBmMCwgLyogVSswMEYwIExBVElOIFNNQUxMIExFVFRFUiBFVEggKi9cblx0WEtfbnRpbGRlOiAgICAgICAgICAgICAgICAgICAgICAweDAwZjEsIC8qIFUrMDBGMSBMQVRJTiBTTUFMTCBMRVRURVIgTiBXSVRIIFRJTERFICovXG5cdFhLX29ncmF2ZTogICAgICAgICAgICAgICAgICAgICAgMHgwMGYyLCAvKiBVKzAwRjIgTEFUSU4gU01BTEwgTEVUVEVSIE8gV0lUSCBHUkFWRSAqL1xuXHRYS19vYWN1dGU6ICAgICAgICAgICAgICAgICAgICAgIDB4MDBmMywgLyogVSswMEYzIExBVElOIFNNQUxMIExFVFRFUiBPIFdJVEggQUNVVEUgKi9cblx0WEtfb2NpcmN1bWZsZXg6ICAgICAgICAgICAgICAgICAweDAwZjQsIC8qIFUrMDBGNCBMQVRJTiBTTUFMTCBMRVRURVIgTyBXSVRIIENJUkNVTUZMRVggKi9cblx0WEtfb3RpbGRlOiAgICAgICAgICAgICAgICAgICAgICAweDAwZjUsIC8qIFUrMDBGNSBMQVRJTiBTTUFMTCBMRVRURVIgTyBXSVRIIFRJTERFICovXG5cdFhLX29kaWFlcmVzaXM6ICAgICAgICAgICAgICAgICAgMHgwMGY2LCAvKiBVKzAwRjYgTEFUSU4gU01BTEwgTEVUVEVSIE8gV0lUSCBESUFFUkVTSVMgKi9cblx0WEtfZGl2aXNpb246ICAgICAgICAgICAgICAgICAgICAweDAwZjcsIC8qIFUrMDBGNyBESVZJU0lPTiBTSUdOICovXG5cdFhLX29zbGFzaDogICAgICAgICAgICAgICAgICAgICAgMHgwMGY4LCAvKiBVKzAwRjggTEFUSU4gU01BTEwgTEVUVEVSIE8gV0lUSCBTVFJPS0UgKi9cblx0WEtfb29ibGlxdWU6ICAgICAgICAgICAgICAgICAgICAweDAwZjgsIC8qIFUrMDBGOCBMQVRJTiBTTUFMTCBMRVRURVIgTyBXSVRIIFNUUk9LRSAqL1xuXHRYS191Z3JhdmU6ICAgICAgICAgICAgICAgICAgICAgIDB4MDBmOSwgLyogVSswMEY5IExBVElOIFNNQUxMIExFVFRFUiBVIFdJVEggR1JBVkUgKi9cblx0WEtfdWFjdXRlOiAgICAgICAgICAgICAgICAgICAgICAweDAwZmEsIC8qIFUrMDBGQSBMQVRJTiBTTUFMTCBMRVRURVIgVSBXSVRIIEFDVVRFICovXG5cdFhLX3VjaXJjdW1mbGV4OiAgICAgICAgICAgICAgICAgMHgwMGZiLCAvKiBVKzAwRkIgTEFUSU4gU01BTEwgTEVUVEVSIFUgV0lUSCBDSVJDVU1GTEVYICovXG5cdFhLX3VkaWFlcmVzaXM6ICAgICAgICAgICAgICAgICAgMHgwMGZjLCAvKiBVKzAwRkMgTEFUSU4gU01BTEwgTEVUVEVSIFUgV0lUSCBESUFFUkVTSVMgKi9cblx0WEtfeWFjdXRlOiAgICAgICAgICAgICAgICAgICAgICAweDAwZmQsIC8qIFUrMDBGRCBMQVRJTiBTTUFMTCBMRVRURVIgWSBXSVRIIEFDVVRFICovXG5cdFhLX3Rob3JuOiAgICAgICAgICAgICAgICAgICAgICAgMHgwMGZlLCAvKiBVKzAwRkUgTEFUSU4gU01BTEwgTEVUVEVSIFRIT1JOICovXG5cdFhLX3lkaWFlcmVzaXM6ICAgICAgICAgICAgICAgICAgMHgwMGZmICAvKiBVKzAwRkYgTEFUSU4gU01BTEwgTEVUVEVSIFkgV0lUSCBESUFFUkVTSVMgKi9cbn07XG5cblxuLyoqXG4gKiBNYXBwaW5ncyBmcm9tIFVuaWNvZGUgY29kZXBvaW50cyB0byB0aGUga2V5c3ltIHZhbHVlcyAoYW5kIG9wdGlvbmFsbHksIGtleVxuICogbmFtZXMpIGV4cGVjdGVkIGJ5IHRoZSBSRkIgcHJvdG9jb2wuXG4gKi9cbnZhciBrZXluYW1lcyA9IG51bGw7XG52YXIgY29kZXBvaW50cyA9IHsnMzInOjMyLCczMyc6MzMsJzM0JzozNCwnMzUnOjM1LCczNic6MzYsJzM3JzozNywnMzgnOjM4LCczOSc6MzksJzQwJzo0MCwnNDEnOjQxLCc0Mic6NDIsJzQzJzo0MywnNDQnOjQ0LCc0NSc6NDUsJzQ2Jzo0NiwnNDcnOjQ3LCc0OCc6NDgsJzQ5Jzo0OSwnNTAnOjUwLCc1MSc6NTEsJzUyJzo1MiwnNTMnOjUzLCc1NCc6NTQsJzU1Jzo1NSwnNTYnOjU2LCc1Nyc6NTcsJzU4Jzo1OCwnNTknOjU5LCc2MCc6NjAsJzYxJzo2MSwnNjInOjYyLCc2Myc6NjMsJzY0Jzo2NCwnNjUnOjY1LCc2Nic6NjYsJzY3Jzo2NywnNjgnOjY4LCc2OSc6NjksJzcwJzo3MCwnNzEnOjcxLCc3Mic6NzIsJzczJzo3MywnNzQnOjc0LCc3NSc6NzUsJzc2Jzo3NiwnNzcnOjc3LCc3OCc6NzgsJzc5Jzo3OSwnODAnOjgwLCc4MSc6ODEsJzgyJzo4MiwnODMnOjgzLCc4NCc6ODQsJzg1Jzo4NSwnODYnOjg2LCc4Nyc6ODcsJzg4Jzo4OCwnODknOjg5LCc5MCc6OTAsJzkxJzo5MSwnOTInOjkyLCc5Myc6OTMsJzk0Jzo5NCwnOTUnOjk1LCc5Nic6OTYsJzk3Jzo5NywnOTgnOjk4LCc5OSc6OTksJzEwMCc6MTAwLCcxMDEnOjEwMSwnMTAyJzoxMDIsJzEwMyc6MTAzLCcxMDQnOjEwNCwnMTA1JzoxMDUsJzEwNic6MTA2LCcxMDcnOjEwNywnMTA4JzoxMDgsJzEwOSc6MTA5LCcxMTAnOjExMCwnMTExJzoxMTEsJzExMic6MTEyLCcxMTMnOjExMywnMTE0JzoxMTQsJzExNSc6MTE1LCcxMTYnOjExNiwnMTE3JzoxMTcsJzExOCc6MTE4LCcxMTknOjExOSwnMTIwJzoxMjAsJzEyMSc6MTIxLCcxMjInOjEyMiwnMTIzJzoxMjMsJzEyNCc6MTI0LCcxMjUnOjEyNSwnMTI2JzoxMjYsJzE2MCc6MTYwLCcxNjEnOjE2MSwnMTYyJzoxNjIsJzE2Myc6MTYzLCcxNjQnOjE2NCwnMTY1JzoxNjUsJzE2Nic6MTY2LCcxNjcnOjE2NywnMTY4JzoxNjgsJzE2OSc6MTY5LCcxNzAnOjE3MCwnMTcxJzoxNzEsJzE3Mic6MTcyLCcxNzMnOjE3MywnMTc0JzoxNzQsJzE3NSc6MTc1LCcxNzYnOjE3NiwnMTc3JzoxNzcsJzE3OCc6MTc4LCcxNzknOjE3OSwnMTgwJzoxODAsJzE4MSc6MTgxLCcxODInOjE4MiwnMTgzJzoxODMsJzE4NCc6MTg0LCcxODUnOjE4NSwnMTg2JzoxODYsJzE4Nyc6MTg3LCcxODgnOjE4OCwnMTg5JzoxODksJzE5MCc6MTkwLCcxOTEnOjE5MSwnMTkyJzoxOTIsJzE5Myc6MTkzLCcxOTQnOjE5NCwnMTk1JzoxOTUsJzE5Nic6MTk2LCcxOTcnOjE5NywnMTk4JzoxOTgsJzE5OSc6MTk5LCcyMDAnOjIwMCwnMjAxJzoyMDEsJzIwMic6MjAyLCcyMDMnOjIwMywnMjA0JzoyMDQsJzIwNSc6MjA1LCcyMDYnOjIwNiwnMjA3JzoyMDcsJzIwOCc6MjA4LCcyMDknOjIwOSwnMjEwJzoyMTAsJzIxMSc6MjExLCcyMTInOjIxMiwnMjEzJzoyMTMsJzIxNCc6MjE0LCcyMTUnOjIxNSwnMjE2JzoyMTYsJzIxNyc6MjE3LCcyMTgnOjIxOCwnMjE5JzoyMTksJzIyMCc6MjIwLCcyMjEnOjIyMSwnMjIyJzoyMjIsJzIyMyc6MjIzLCcyMjQnOjIyNCwnMjI1JzoyMjUsJzIyNic6MjI2LCcyMjcnOjIyNywnMjI4JzoyMjgsJzIyOSc6MjI5LCcyMzAnOjIzMCwnMjMxJzoyMzEsJzIzMic6MjMyLCcyMzMnOjIzMywnMjM0JzoyMzQsJzIzNSc6MjM1LCcyMzYnOjIzNiwnMjM3JzoyMzcsJzIzOCc6MjM4LCcyMzknOjIzOSwnMjQwJzoyNDAsJzI0MSc6MjQxLCcyNDInOjI0MiwnMjQzJzoyNDMsJzI0NCc6MjQ0LCcyNDUnOjI0NSwnMjQ2JzoyNDYsJzI0Nyc6MjQ3LCcyNDgnOjI0OCwnMjQ5JzoyNDksJzI1MCc6MjUwLCcyNTEnOjI1MSwnMjUyJzoyNTIsJzI1Myc6MjUzLCcyNTQnOjI1NCwnMjU1JzoyNTUsJzI1Nic6OTYwLCcyNTcnOjk5MiwnMjU4Jzo0NTEsJzI1OSc6NDgzLCcyNjAnOjQxNywnMjYxJzo0MzMsJzI2Mic6NDU0LCcyNjMnOjQ4NiwnMjY0Jzo3MTAsJzI2NSc6NzQyLCcyNjYnOjcwOSwnMjY3Jzo3NDEsJzI2OCc6NDU2LCcyNjknOjQ4OCwnMjcwJzo0NjMsJzI3MSc6NDk1LCcyNzInOjQ2NCwnMjczJzo0OTYsJzI3NCc6OTM4LCcyNzUnOjk1NCwnMjc4Jzo5NzIsJzI3OSc6MTAwNCwnMjgwJzo0NTgsJzI4MSc6NDkwLCcyODInOjQ2MCwnMjgzJzo0OTIsJzI4NCc6NzI4LCcyODUnOjc2MCwnMjg2Jzo2ODMsJzI4Nyc6Njk5LCcyODgnOjcyNSwnMjg5Jzo3NTcsJzI5MCc6OTM5LCcyOTEnOjk1NSwnMjkyJzo2NzgsJzI5Myc6Njk0LCcyOTQnOjY3MywnMjk1Jzo2ODksJzI5Nic6OTMzLCcyOTcnOjk0OSwnMjk4Jzo5NzUsJzI5OSc6MTAwNywnMzAwJzoxNjc3NzUxNiwnMzAxJzoxNjc3NzUxNywnMzAyJzo5NjcsJzMwMyc6OTk5LCczMDQnOjY4MSwnMzA1Jzo2OTcsJzMwOCc6Njg0LCczMDknOjcwMCwnMzEwJzo5NzksJzMxMSc6MTAxMSwnMzEyJzo5MzAsJzMxMyc6NDUzLCczMTQnOjQ4NSwnMzE1Jzo5MzQsJzMxNic6OTUwLCczMTcnOjQyMSwnMzE4Jzo0MzcsJzMyMSc6NDE5LCczMjInOjQzNSwnMzIzJzo0NjUsJzMyNCc6NDk3LCczMjUnOjk3NywnMzI2JzoxMDA5LCczMjcnOjQ2NiwnMzI4Jzo0OTgsJzMzMCc6OTU3LCczMzEnOjk1OSwnMzMyJzo5NzgsJzMzMyc6MTAxMCwnMzM2Jzo0NjksJzMzNyc6NTAxLCczMzgnOjUwNTIsJzMzOSc6NTA1MywnMzQwJzo0NDgsJzM0MSc6NDgwLCczNDInOjkzMSwnMzQzJzo5NDcsJzM0NCc6NDcyLCczNDUnOjUwNCwnMzQ2Jzo0MjIsJzM0Nyc6NDM4LCczNDgnOjczNCwnMzQ5Jzo3NjYsJzM1MCc6NDI2LCczNTEnOjQ0MiwnMzUyJzo0MjUsJzM1Myc6NDQxLCczNTQnOjQ3OCwnMzU1Jzo1MTAsJzM1Nic6NDI3LCczNTcnOjQ0MywnMzU4Jzo5NDAsJzM1OSc6OTU2LCczNjAnOjk4OSwnMzYxJzoxMDIxLCczNjInOjk5MCwnMzYzJzoxMDIyLCczNjQnOjczMywnMzY1Jzo3NjUsJzM2Nic6NDczLCczNjcnOjUwNSwnMzY4Jzo0NzUsJzM2OSc6NTA3LCczNzAnOjk4NSwnMzcxJzoxMDE3LCczNzInOjE2Nzc3NTg4LCczNzMnOjE2Nzc3NTg5LCczNzQnOjE2Nzc3NTkwLCczNzUnOjE2Nzc3NTkxLCczNzYnOjUwNTQsJzM3Nyc6NDI4LCczNzgnOjQ0NCwnMzc5Jzo0MzEsJzM4MCc6NDQ3LCczODEnOjQzMCwnMzgyJzo0NDYsJzM5OSc6MTY3Nzc2MTUsJzQwMic6MjI5NCwnNDE1JzoxNjc3NzYzMSwnNDE2JzoxNjc3NzYzMiwnNDE3JzoxNjc3NzYzMywnNDMxJzoxNjc3NzY0NywnNDMyJzoxNjc3NzY0OCwnNDM3JzoxNjc3NzY1MywnNDM4JzoxNjc3NzY1NCwnNDM5JzoxNjc3NzY1NSwnNDY2JzoxNjc3NzY4MSwnNDg2JzoxNjc3NzcwMiwnNDg3JzoxNjc3NzcwMywnNjAxJzoxNjc3NzgxNywnNjI5JzoxNjc3Nzg0NSwnNjU4JzoxNjc3Nzg3NCwnNzExJzo0MzksJzcyOCc6NDE4LCc3MjknOjUxMSwnNzMxJzo0MzQsJzczMyc6NDQ1LCc5MDEnOjE5NjYsJzkwMic6MTk1MywnOTA0JzoxOTU0LCc5MDUnOjE5NTUsJzkwNic6MTk1NiwnOTA4JzoxOTU5LCc5MTAnOjE5NjAsJzkxMSc6MTk2MywnOTEyJzoxOTc0LCc5MTMnOjE5ODUsJzkxNCc6MTk4NiwnOTE1JzoxOTg3LCc5MTYnOjE5ODgsJzkxNyc6MTk4OSwnOTE4JzoxOTkwLCc5MTknOjE5OTEsJzkyMCc6MTk5MiwnOTIxJzoxOTkzLCc5MjInOjE5OTQsJzkyMyc6MTk5NSwnOTI0JzoxOTk2LCc5MjUnOjE5OTcsJzkyNic6MTk5OCwnOTI3JzoxOTk5LCc5MjgnOjIwMDAsJzkyOSc6MjAwMSwnOTMxJzoyMDAyLCc5MzInOjIwMDQsJzkzMyc6MjAwNSwnOTM0JzoyMDA2LCc5MzUnOjIwMDcsJzkzNic6MjAwOCwnOTM3JzoyMDA5LCc5MzgnOjE5NTcsJzkzOSc6MTk2MSwnOTQwJzoxOTY5LCc5NDEnOjE5NzAsJzk0Mic6MTk3MSwnOTQzJzoxOTcyLCc5NDQnOjE5NzgsJzk0NSc6MjAxNywnOTQ2JzoyMDE4LCc5NDcnOjIwMTksJzk0OCc6MjAyMCwnOTQ5JzoyMDIxLCc5NTAnOjIwMjIsJzk1MSc6MjAyMywnOTUyJzoyMDI0LCc5NTMnOjIwMjUsJzk1NCc6MjAyNiwnOTU1JzoyMDI3LCc5NTYnOjIwMjgsJzk1Nyc6MjAyOSwnOTU4JzoyMDMwLCc5NTknOjIwMzEsJzk2MCc6MjAzMiwnOTYxJzoyMDMzLCc5NjInOjIwMzUsJzk2Myc6MjAzNCwnOTY0JzoyMDM2LCc5NjUnOjIwMzcsJzk2Nic6MjAzOCwnOTY3JzoyMDM5LCc5NjgnOjIwNDAsJzk2OSc6MjA0MSwnOTcwJzoxOTczLCc5NzEnOjE5NzcsJzk3Mic6MTk3NSwnOTczJzoxOTc2LCc5NzQnOjE5NzksJzEwMjUnOjE3MTUsJzEwMjYnOjE3MTMsJzEwMjcnOjE3MTQsJzEwMjgnOjE3MTYsJzEwMjknOjE3MTcsJzEwMzAnOjE3MTgsJzEwMzEnOjE3MTksJzEwMzInOjE3MjAsJzEwMzMnOjE3MjEsJzEwMzQnOjE3MjIsJzEwMzUnOjE3MjMsJzEwMzYnOjE3MjQsJzEwMzgnOjE3MjYsJzEwMzknOjE3MjcsJzEwNDAnOjE3NjEsJzEwNDEnOjE3NjIsJzEwNDInOjE3ODMsJzEwNDMnOjE3NjcsJzEwNDQnOjE3NjQsJzEwNDUnOjE3NjUsJzEwNDYnOjE3ODIsJzEwNDcnOjE3ODYsJzEwNDgnOjE3NjksJzEwNDknOjE3NzAsJzEwNTAnOjE3NzEsJzEwNTEnOjE3NzIsJzEwNTInOjE3NzMsJzEwNTMnOjE3NzQsJzEwNTQnOjE3NzUsJzEwNTUnOjE3NzYsJzEwNTYnOjE3NzgsJzEwNTcnOjE3NzksJzEwNTgnOjE3ODAsJzEwNTknOjE3ODEsJzEwNjAnOjE3NjYsJzEwNjEnOjE3NjgsJzEwNjInOjE3NjMsJzEwNjMnOjE3OTAsJzEwNjQnOjE3ODcsJzEwNjUnOjE3ODksJzEwNjYnOjE3OTEsJzEwNjcnOjE3ODUsJzEwNjgnOjE3ODQsJzEwNjknOjE3ODgsJzEwNzAnOjE3NjAsJzEwNzEnOjE3NzcsJzEwNzInOjE3MjksJzEwNzMnOjE3MzAsJzEwNzQnOjE3NTEsJzEwNzUnOjE3MzUsJzEwNzYnOjE3MzIsJzEwNzcnOjE3MzMsJzEwNzgnOjE3NTAsJzEwNzknOjE3NTQsJzEwODAnOjE3MzcsJzEwODEnOjE3MzgsJzEwODInOjE3MzksJzEwODMnOjE3NDAsJzEwODQnOjE3NDEsJzEwODUnOjE3NDIsJzEwODYnOjE3NDMsJzEwODcnOjE3NDQsJzEwODgnOjE3NDYsJzEwODknOjE3NDcsJzEwOTAnOjE3NDgsJzEwOTEnOjE3NDksJzEwOTInOjE3MzQsJzEwOTMnOjE3MzYsJzEwOTQnOjE3MzEsJzEwOTUnOjE3NTgsJzEwOTYnOjE3NTUsJzEwOTcnOjE3NTcsJzEwOTgnOjE3NTksJzEwOTknOjE3NTMsJzExMDAnOjE3NTIsJzExMDEnOjE3NTYsJzExMDInOjE3MjgsJzExMDMnOjE3NDUsJzExMDUnOjE2OTksJzExMDYnOjE2OTcsJzExMDcnOjE2OTgsJzExMDgnOjE3MDAsJzExMDknOjE3MDEsJzExMTAnOjE3MDIsJzExMTEnOjE3MDMsJzExMTInOjE3MDQsJzExMTMnOjE3MDUsJzExMTQnOjE3MDYsJzExMTUnOjE3MDcsJzExMTYnOjE3MDgsJzExMTgnOjE3MTAsJzExMTknOjE3MTEsJzExNjgnOjE3MjUsJzExNjknOjE3MDksJzExNzAnOjE2Nzc4Mzg2LCcxMTcxJzoxNjc3ODM4NywnMTE3NCc6MTY3NzgzOTAsJzExNzUnOjE2Nzc4MzkxLCcxMTc4JzoxNjc3ODM5NCwnMTE3OSc6MTY3NzgzOTUsJzExODAnOjE2Nzc4Mzk2LCcxMTgxJzoxNjc3ODM5NywnMTE4Nic6MTY3Nzg0MDIsJzExODcnOjE2Nzc4NDAzLCcxMTk4JzoxNjc3ODQxNCwnMTE5OSc6MTY3Nzg0MTUsJzEyMDAnOjE2Nzc4NDE2LCcxMjAxJzoxNjc3ODQxNywnMTIwMic6MTY3Nzg0MTgsJzEyMDMnOjE2Nzc4NDE5LCcxMjA2JzoxNjc3ODQyMiwnMTIwNyc6MTY3Nzg0MjMsJzEyMDgnOjE2Nzc4NDI0LCcxMjA5JzoxNjc3ODQyNSwnMTIxMCc6MTY3Nzg0MjYsJzEyMTEnOjE2Nzc4NDI3LCcxMjQwJzoxNjc3ODQ1NiwnMTI0MSc6MTY3Nzg0NTcsJzEyNTAnOjE2Nzc4NDY2LCcxMjUxJzoxNjc3ODQ2NywnMTI1Nic6MTY3Nzg0NzIsJzEyNTcnOjE2Nzc4NDczLCcxMjYyJzoxNjc3ODQ3OCwnMTI2Myc6MTY3Nzg0NzksJzEzMjknOjE2Nzc4NTQ1LCcxMzMwJzoxNjc3ODU0NiwnMTMzMSc6MTY3Nzg1NDcsJzEzMzInOjE2Nzc4NTQ4LCcxMzMzJzoxNjc3ODU0OSwnMTMzNCc6MTY3Nzg1NTAsJzEzMzUnOjE2Nzc4NTUxLCcxMzM2JzoxNjc3ODU1MiwnMTMzNyc6MTY3Nzg1NTMsJzEzMzgnOjE2Nzc4NTU0LCcxMzM5JzoxNjc3ODU1NSwnMTM0MCc6MTY3Nzg1NTYsJzEzNDEnOjE2Nzc4NTU3LCcxMzQyJzoxNjc3ODU1OCwnMTM0Myc6MTY3Nzg1NTksJzEzNDQnOjE2Nzc4NTYwLCcxMzQ1JzoxNjc3ODU2MSwnMTM0Nic6MTY3Nzg1NjIsJzEzNDcnOjE2Nzc4NTYzLCcxMzQ4JzoxNjc3ODU2NCwnMTM0OSc6MTY3Nzg1NjUsJzEzNTAnOjE2Nzc4NTY2LCcxMzUxJzoxNjc3ODU2NywnMTM1Mic6MTY3Nzg1NjgsJzEzNTMnOjE2Nzc4NTY5LCcxMzU0JzoxNjc3ODU3MCwnMTM1NSc6MTY3Nzg1NzEsJzEzNTYnOjE2Nzc4NTcyLCcxMzU3JzoxNjc3ODU3MywnMTM1OCc6MTY3Nzg1NzQsJzEzNTknOjE2Nzc4NTc1LCcxMzYwJzoxNjc3ODU3NiwnMTM2MSc6MTY3Nzg1NzcsJzEzNjInOjE2Nzc4NTc4LCcxMzYzJzoxNjc3ODU3OSwnMTM2NCc6MTY3Nzg1ODAsJzEzNjUnOjE2Nzc4NTgxLCcxMzY2JzoxNjc3ODU4MiwnMTM3MCc6MTY3Nzg1ODYsJzEzNzEnOjE2Nzc4NTg3LCcxMzcyJzoxNjc3ODU4OCwnMTM3Myc6MTY3Nzg1ODksJzEzNzQnOjE2Nzc4NTkwLCcxMzc3JzoxNjc3ODU5MywnMTM3OCc6MTY3Nzg1OTQsJzEzNzknOjE2Nzc4NTk1LCcxMzgwJzoxNjc3ODU5NiwnMTM4MSc6MTY3Nzg1OTcsJzEzODInOjE2Nzc4NTk4LCcxMzgzJzoxNjc3ODU5OSwnMTM4NCc6MTY3Nzg2MDAsJzEzODUnOjE2Nzc4NjAxLCcxMzg2JzoxNjc3ODYwMiwnMTM4Nyc6MTY3Nzg2MDMsJzEzODgnOjE2Nzc4NjA0LCcxMzg5JzoxNjc3ODYwNSwnMTM5MCc6MTY3Nzg2MDYsJzEzOTEnOjE2Nzc4NjA3LCcxMzkyJzoxNjc3ODYwOCwnMTM5Myc6MTY3Nzg2MDksJzEzOTQnOjE2Nzc4NjEwLCcxMzk1JzoxNjc3ODYxMSwnMTM5Nic6MTY3Nzg2MTIsJzEzOTcnOjE2Nzc4NjEzLCcxMzk4JzoxNjc3ODYxNCwnMTM5OSc6MTY3Nzg2MTUsJzE0MDAnOjE2Nzc4NjE2LCcxNDAxJzoxNjc3ODYxNywnMTQwMic6MTY3Nzg2MTgsJzE0MDMnOjE2Nzc4NjE5LCcxNDA0JzoxNjc3ODYyMCwnMTQwNSc6MTY3Nzg2MjEsJzE0MDYnOjE2Nzc4NjIyLCcxNDA3JzoxNjc3ODYyMywnMTQwOCc6MTY3Nzg2MjQsJzE0MDknOjE2Nzc4NjI1LCcxNDEwJzoxNjc3ODYyNiwnMTQxMSc6MTY3Nzg2MjcsJzE0MTInOjE2Nzc4NjI4LCcxNDEzJzoxNjc3ODYyOSwnMTQxNCc6MTY3Nzg2MzAsJzE0MTUnOjE2Nzc4NjMxLCcxNDE3JzoxNjc3ODYzMywnMTQxOCc6MTY3Nzg2MzQsJzE0ODgnOjMyOTYsJzE0ODknOjMyOTcsJzE0OTAnOjMyOTgsJzE0OTEnOjMyOTksJzE0OTInOjMzMDAsJzE0OTMnOjMzMDEsJzE0OTQnOjMzMDIsJzE0OTUnOjMzMDMsJzE0OTYnOjMzMDQsJzE0OTcnOjMzMDUsJzE0OTgnOjMzMDYsJzE0OTknOjMzMDcsJzE1MDAnOjMzMDgsJzE1MDEnOjMzMDksJzE1MDInOjMzMTAsJzE1MDMnOjMzMTEsJzE1MDQnOjMzMTIsJzE1MDUnOjMzMTMsJzE1MDYnOjMzMTQsJzE1MDcnOjMzMTUsJzE1MDgnOjMzMTYsJzE1MDknOjMzMTcsJzE1MTAnOjMzMTgsJzE1MTEnOjMzMTksJzE1MTInOjMzMjAsJzE1MTMnOjMzMjEsJzE1MTQnOjMzMjIsJzE1NDgnOjE0NTIsJzE1NjMnOjE0NjcsJzE1NjcnOjE0NzEsJzE1NjknOjE0NzMsJzE1NzAnOjE0NzQsJzE1NzEnOjE0NzUsJzE1NzInOjE0NzYsJzE1NzMnOjE0NzcsJzE1NzQnOjE0NzgsJzE1NzUnOjE0NzksJzE1NzYnOjE0ODAsJzE1NzcnOjE0ODEsJzE1NzgnOjE0ODIsJzE1NzknOjE0ODMsJzE1ODAnOjE0ODQsJzE1ODEnOjE0ODUsJzE1ODInOjE0ODYsJzE1ODMnOjE0ODcsJzE1ODQnOjE0ODgsJzE1ODUnOjE0ODksJzE1ODYnOjE0OTAsJzE1ODcnOjE0OTEsJzE1ODgnOjE0OTIsJzE1ODknOjE0OTMsJzE1OTAnOjE0OTQsJzE1OTEnOjE0OTUsJzE1OTInOjE0OTYsJzE1OTMnOjE0OTcsJzE1OTQnOjE0OTgsJzE2MDAnOjE1MDQsJzE2MDEnOjE1MDUsJzE2MDInOjE1MDYsJzE2MDMnOjE1MDcsJzE2MDQnOjE1MDgsJzE2MDUnOjE1MDksJzE2MDYnOjE1MTAsJzE2MDcnOjE1MTEsJzE2MDgnOjE1MTIsJzE2MDknOjE1MTMsJzE2MTAnOjE1MTQsJzE2MTEnOjE1MTUsJzE2MTInOjE1MTYsJzE2MTMnOjE1MTcsJzE2MTQnOjE1MTgsJzE2MTUnOjE1MTksJzE2MTYnOjE1MjAsJzE2MTcnOjE1MjEsJzE2MTgnOjE1MjIsJzE2MTknOjE2Nzc4ODM1LCcxNjIwJzoxNjc3ODgzNiwnMTYyMSc6MTY3Nzg4MzcsJzE2MzInOjE2Nzc4ODQ4LCcxNjMzJzoxNjc3ODg0OSwnMTYzNCc6MTY3Nzg4NTAsJzE2MzUnOjE2Nzc4ODUxLCcxNjM2JzoxNjc3ODg1MiwnMTYzNyc6MTY3Nzg4NTMsJzE2MzgnOjE2Nzc4ODU0LCcxNjM5JzoxNjc3ODg1NSwnMTY0MCc6MTY3Nzg4NTYsJzE2NDEnOjE2Nzc4ODU3LCcxNjQyJzoxNjc3ODg1OCwnMTY0OCc6MTY3Nzg4NjQsJzE2NTcnOjE2Nzc4ODczLCcxNjYyJzoxNjc3ODg3OCwnMTY3MCc6MTY3Nzg4ODYsJzE2NzInOjE2Nzc4ODg4LCcxNjgxJzoxNjc3ODg5NywnMTY4OCc6MTY3Nzg5MDQsJzE3MDAnOjE2Nzc4OTE2LCcxNzA1JzoxNjc3ODkyMSwnMTcxMSc6MTY3Nzg5MjcsJzE3MjInOjE2Nzc4OTM4LCcxNzI2JzoxNjc3ODk0MiwnMTcyOSc6MTY3Nzg5NDUsJzE3NDAnOjE2Nzc4OTU2LCcxNzQ2JzoxNjc3ODk2MiwnMTc0OCc6MTY3Nzg5NjQsJzE3NzYnOjE2Nzc4OTkyLCcxNzc3JzoxNjc3ODk5MywnMTc3OCc6MTY3Nzg5OTQsJzE3NzknOjE2Nzc4OTk1LCcxNzgwJzoxNjc3ODk5NiwnMTc4MSc6MTY3Nzg5OTcsJzE3ODInOjE2Nzc4OTk4LCcxNzgzJzoxNjc3ODk5OSwnMTc4NCc6MTY3NzkwMDAsJzE3ODUnOjE2Nzc5MDAxLCczNDU4JzoxNjc4MDY3NCwnMzQ1OSc6MTY3ODA2NzUsJzM0NjEnOjE2NzgwNjc3LCczNDYyJzoxNjc4MDY3OCwnMzQ2Myc6MTY3ODA2NzksJzM0NjQnOjE2NzgwNjgwLCczNDY1JzoxNjc4MDY4MSwnMzQ2Nic6MTY3ODA2ODIsJzM0NjcnOjE2NzgwNjgzLCczNDY4JzoxNjc4MDY4NCwnMzQ2OSc6MTY3ODA2ODUsJzM0NzAnOjE2NzgwNjg2LCczNDcxJzoxNjc4MDY4NywnMzQ3Mic6MTY3ODA2ODgsJzM0NzMnOjE2NzgwNjg5LCczNDc0JzoxNjc4MDY5MCwnMzQ3NSc6MTY3ODA2OTEsJzM0NzYnOjE2NzgwNjkyLCczNDc3JzoxNjc4MDY5MywnMzQ3OCc6MTY3ODA2OTQsJzM0ODInOjE2NzgwNjk4LCczNDgzJzoxNjc4MDY5OSwnMzQ4NCc6MTY3ODA3MDAsJzM0ODUnOjE2NzgwNzAxLCczNDg2JzoxNjc4MDcwMiwnMzQ4Nyc6MTY3ODA3MDMsJzM0ODgnOjE2NzgwNzA0LCczNDg5JzoxNjc4MDcwNSwnMzQ5MCc6MTY3ODA3MDYsJzM0OTEnOjE2NzgwNzA3LCczNDkyJzoxNjc4MDcwOCwnMzQ5Myc6MTY3ODA3MDksJzM0OTQnOjE2NzgwNzEwLCczNDk1JzoxNjc4MDcxMSwnMzQ5Nic6MTY3ODA3MTIsJzM0OTcnOjE2NzgwNzEzLCczNDk4JzoxNjc4MDcxNCwnMzQ5OSc6MTY3ODA3MTUsJzM1MDAnOjE2NzgwNzE2LCczNTAxJzoxNjc4MDcxNywnMzUwMic6MTY3ODA3MTgsJzM1MDMnOjE2NzgwNzE5LCczNTA0JzoxNjc4MDcyMCwnMzUwNSc6MTY3ODA3MjEsJzM1MDcnOjE2NzgwNzIzLCczNTA4JzoxNjc4MDcyNCwnMzUwOSc6MTY3ODA3MjUsJzM1MTAnOjE2NzgwNzI2LCczNTExJzoxNjc4MDcyNywnMzUxMic6MTY3ODA3MjgsJzM1MTMnOjE2NzgwNzI5LCczNTE0JzoxNjc4MDczMCwnMzUxNSc6MTY3ODA3MzEsJzM1MTcnOjE2NzgwNzMzLCczNTIwJzoxNjc4MDczNiwnMzUyMSc6MTY3ODA3MzcsJzM1MjInOjE2NzgwNzM4LCczNTIzJzoxNjc4MDczOSwnMzUyNCc6MTY3ODA3NDAsJzM1MjUnOjE2NzgwNzQxLCczNTI2JzoxNjc4MDc0MiwnMzUzMCc6MTY3ODA3NDYsJzM1MzUnOjE2NzgwNzUxLCczNTM2JzoxNjc4MDc1MiwnMzUzNyc6MTY3ODA3NTMsJzM1MzgnOjE2NzgwNzU0LCczNTM5JzoxNjc4MDc1NSwnMzU0MCc6MTY3ODA3NTYsJzM1NDInOjE2NzgwNzU4LCczNTQ0JzoxNjc4MDc2MCwnMzU0NSc6MTY3ODA3NjEsJzM1NDYnOjE2NzgwNzYyLCczNTQ3JzoxNjc4MDc2MywnMzU0OCc6MTY3ODA3NjQsJzM1NDknOjE2NzgwNzY1LCczNTUwJzoxNjc4MDc2NiwnMzU1MSc6MTY3ODA3NjcsJzM1NzAnOjE2NzgwNzg2LCczNTcxJzoxNjc4MDc4NywnMzU3Mic6MTY3ODA3ODgsJzM1ODUnOjM0ODksJzM1ODYnOjM0OTAsJzM1ODcnOjM0OTEsJzM1ODgnOjM0OTIsJzM1ODknOjM0OTMsJzM1OTAnOjM0OTQsJzM1OTEnOjM0OTUsJzM1OTInOjM0OTYsJzM1OTMnOjM0OTcsJzM1OTQnOjM0OTgsJzM1OTUnOjM0OTksJzM1OTYnOjM1MDAsJzM1OTcnOjM1MDEsJzM1OTgnOjM1MDIsJzM1OTknOjM1MDMsJzM2MDAnOjM1MDQsJzM2MDEnOjM1MDUsJzM2MDInOjM1MDYsJzM2MDMnOjM1MDcsJzM2MDQnOjM1MDgsJzM2MDUnOjM1MDksJzM2MDYnOjM1MTAsJzM2MDcnOjM1MTEsJzM2MDgnOjM1MTIsJzM2MDknOjM1MTMsJzM2MTAnOjM1MTQsJzM2MTEnOjM1MTUsJzM2MTInOjM1MTYsJzM2MTMnOjM1MTcsJzM2MTQnOjM1MTgsJzM2MTUnOjM1MTksJzM2MTYnOjM1MjAsJzM2MTcnOjM1MjEsJzM2MTgnOjM1MjIsJzM2MTknOjM1MjMsJzM2MjAnOjM1MjQsJzM2MjEnOjM1MjUsJzM2MjInOjM1MjYsJzM2MjMnOjM1MjcsJzM2MjQnOjM1MjgsJzM2MjUnOjM1MjksJzM2MjYnOjM1MzAsJzM2MjcnOjM1MzEsJzM2MjgnOjM1MzIsJzM2MjknOjM1MzMsJzM2MzAnOjM1MzQsJzM2MzEnOjM1MzUsJzM2MzInOjM1MzYsJzM2MzMnOjM1MzcsJzM2MzQnOjM1MzgsJzM2MzUnOjM1MzksJzM2MzYnOjM1NDAsJzM2MzcnOjM1NDEsJzM2MzgnOjM1NDIsJzM2MzknOjM1NDMsJzM2NDAnOjM1NDQsJzM2NDEnOjM1NDUsJzM2NDInOjM1NDYsJzM2NDcnOjM1NTEsJzM2NDgnOjM1NTIsJzM2NDknOjM1NTMsJzM2NTAnOjM1NTQsJzM2NTEnOjM1NTUsJzM2NTInOjM1NTYsJzM2NTMnOjM1NTcsJzM2NTQnOjM1NTgsJzM2NTUnOjM1NTksJzM2NTYnOjM1NjAsJzM2NTcnOjM1NjEsJzM2NTgnOjM1NjIsJzM2NTknOjM1NjMsJzM2NjAnOjM1NjQsJzM2NjEnOjM1NjUsJzM2NjQnOjM1NjgsJzM2NjUnOjM1NjksJzM2NjYnOjM1NzAsJzM2NjcnOjM1NzEsJzM2NjgnOjM1NzIsJzM2NjknOjM1NzMsJzM2NzAnOjM1NzQsJzM2NzEnOjM1NzUsJzM2NzInOjM1NzYsJzM2NzMnOjM1NzcsJzQzMDQnOjE2NzgxNTIwLCc0MzA1JzoxNjc4MTUyMSwnNDMwNic6MTY3ODE1MjIsJzQzMDcnOjE2NzgxNTIzLCc0MzA4JzoxNjc4MTUyNCwnNDMwOSc6MTY3ODE1MjUsJzQzMTAnOjE2NzgxNTI2LCc0MzExJzoxNjc4MTUyNywnNDMxMic6MTY3ODE1MjgsJzQzMTMnOjE2NzgxNTI5LCc0MzE0JzoxNjc4MTUzMCwnNDMxNSc6MTY3ODE1MzEsJzQzMTYnOjE2NzgxNTMyLCc0MzE3JzoxNjc4MTUzMywnNDMxOCc6MTY3ODE1MzQsJzQzMTknOjE2NzgxNTM1LCc0MzIwJzoxNjc4MTUzNiwnNDMyMSc6MTY3ODE1MzcsJzQzMjInOjE2NzgxNTM4LCc0MzIzJzoxNjc4MTUzOSwnNDMyNCc6MTY3ODE1NDAsJzQzMjUnOjE2NzgxNTQxLCc0MzI2JzoxNjc4MTU0MiwnNDMyNyc6MTY3ODE1NDMsJzQzMjgnOjE2NzgxNTQ0LCc0MzI5JzoxNjc4MTU0NSwnNDMzMCc6MTY3ODE1NDYsJzQzMzEnOjE2NzgxNTQ3LCc0MzMyJzoxNjc4MTU0OCwnNDMzMyc6MTY3ODE1NDksJzQzMzQnOjE2NzgxNTUwLCc0MzM1JzoxNjc4MTU1MSwnNDMzNic6MTY3ODE1NTIsJzQzMzcnOjE2NzgxNTUzLCc0MzM4JzoxNjc4MTU1NCwnNDMzOSc6MTY3ODE1NTUsJzQzNDAnOjE2NzgxNTU2LCc0MzQxJzoxNjc4MTU1NywnNDM0Mic6MTY3ODE1NTgsJzc2ODInOjE2Nzg0ODk4LCc3NjgzJzoxNjc4NDg5OSwnNzY5MCc6MTY3ODQ5MDYsJzc2OTEnOjE2Nzg0OTA3LCc3NzEwJzoxNjc4NDkyNiwnNzcxMSc6MTY3ODQ5MjcsJzc3MzQnOjE2Nzg0OTUwLCc3NzM1JzoxNjc4NDk1MSwnNzc0NCc6MTY3ODQ5NjAsJzc3NDUnOjE2Nzg0OTYxLCc3NzY2JzoxNjc4NDk4MiwnNzc2Nyc6MTY3ODQ5ODMsJzc3NzYnOjE2Nzg0OTkyLCc3Nzc3JzoxNjc4NDk5MywnNzc4Nic6MTY3ODUwMDIsJzc3ODcnOjE2Nzg1MDAzLCc3ODA4JzoxNjc4NTAyNCwnNzgwOSc6MTY3ODUwMjUsJzc4MTAnOjE2Nzg1MDI2LCc3ODExJzoxNjc4NTAyNywnNzgxMic6MTY3ODUwMjgsJzc4MTMnOjE2Nzg1MDI5LCc3ODE4JzoxNjc4NTAzNCwnNzgxOSc6MTY3ODUwMzUsJzc4NDAnOjE2Nzg1MDU2LCc3ODQxJzoxNjc4NTA1NywnNzg0Mic6MTY3ODUwNTgsJzc4NDMnOjE2Nzg1MDU5LCc3ODQ0JzoxNjc4NTA2MCwnNzg0NSc6MTY3ODUwNjEsJzc4NDYnOjE2Nzg1MDYyLCc3ODQ3JzoxNjc4NTA2MywnNzg0OCc6MTY3ODUwNjQsJzc4NDknOjE2Nzg1MDY1LCc3ODUwJzoxNjc4NTA2NiwnNzg1MSc6MTY3ODUwNjcsJzc4NTInOjE2Nzg1MDY4LCc3ODUzJzoxNjc4NTA2OSwnNzg1NCc6MTY3ODUwNzAsJzc4NTUnOjE2Nzg1MDcxLCc3ODU2JzoxNjc4NTA3MiwnNzg1Nyc6MTY3ODUwNzMsJzc4NTgnOjE2Nzg1MDc0LCc3ODU5JzoxNjc4NTA3NSwnNzg2MCc6MTY3ODUwNzYsJzc4NjEnOjE2Nzg1MDc3LCc3ODYyJzoxNjc4NTA3OCwnNzg2Myc6MTY3ODUwNzksJzc4NjQnOjE2Nzg1MDgwLCc3ODY1JzoxNjc4NTA4MSwnNzg2Nic6MTY3ODUwODIsJzc4NjcnOjE2Nzg1MDgzLCc3ODY4JzoxNjc4NTA4NCwnNzg2OSc6MTY3ODUwODUsJzc4NzAnOjE2Nzg1MDg2LCc3ODcxJzoxNjc4NTA4NywnNzg3Mic6MTY3ODUwODgsJzc4NzMnOjE2Nzg1MDg5LCc3ODc0JzoxNjc4NTA5MCwnNzg3NSc6MTY3ODUwOTEsJzc4NzYnOjE2Nzg1MDkyLCc3ODc3JzoxNjc4NTA5MywnNzg3OCc6MTY3ODUwOTQsJzc4NzknOjE2Nzg1MDk1LCc3ODgwJzoxNjc4NTA5NiwnNzg4MSc6MTY3ODUwOTcsJzc4ODInOjE2Nzg1MDk4LCc3ODgzJzoxNjc4NTA5OSwnNzg4NCc6MTY3ODUxMDAsJzc4ODUnOjE2Nzg1MTAxLCc3ODg2JzoxNjc4NTEwMiwnNzg4Nyc6MTY3ODUxMDMsJzc4ODgnOjE2Nzg1MTA0LCc3ODg5JzoxNjc4NTEwNSwnNzg5MCc6MTY3ODUxMDYsJzc4OTEnOjE2Nzg1MTA3LCc3ODkyJzoxNjc4NTEwOCwnNzg5Myc6MTY3ODUxMDksJzc4OTQnOjE2Nzg1MTEwLCc3ODk1JzoxNjc4NTExMSwnNzg5Nic6MTY3ODUxMTIsJzc4OTcnOjE2Nzg1MTEzLCc3ODk4JzoxNjc4NTExNCwnNzg5OSc6MTY3ODUxMTUsJzc5MDAnOjE2Nzg1MTE2LCc3OTAxJzoxNjc4NTExNywnNzkwMic6MTY3ODUxMTgsJzc5MDMnOjE2Nzg1MTE5LCc3OTA0JzoxNjc4NTEyMCwnNzkwNSc6MTY3ODUxMjEsJzc5MDYnOjE2Nzg1MTIyLCc3OTA3JzoxNjc4NTEyMywnNzkwOCc6MTY3ODUxMjQsJzc5MDknOjE2Nzg1MTI1LCc3OTEwJzoxNjc4NTEyNiwnNzkxMSc6MTY3ODUxMjcsJzc5MTInOjE2Nzg1MTI4LCc3OTEzJzoxNjc4NTEyOSwnNzkxNCc6MTY3ODUxMzAsJzc5MTUnOjE2Nzg1MTMxLCc3OTE2JzoxNjc4NTEzMiwnNzkxNyc6MTY3ODUxMzMsJzc5MTgnOjE2Nzg1MTM0LCc3OTE5JzoxNjc4NTEzNSwnNzkyMCc6MTY3ODUxMzYsJzc5MjEnOjE2Nzg1MTM3LCc3OTIyJzoxNjc4NTEzOCwnNzkyMyc6MTY3ODUxMzksJzc5MjQnOjE2Nzg1MTQwLCc3OTI1JzoxNjc4NTE0MSwnNzkyNic6MTY3ODUxNDIsJzc5MjcnOjE2Nzg1MTQzLCc3OTI4JzoxNjc4NTE0NCwnNzkyOSc6MTY3ODUxNDUsJzgxOTQnOjI3MjIsJzgxOTUnOjI3MjEsJzgxOTYnOjI3MjMsJzgxOTcnOjI3MjQsJzgxOTknOjI3MjUsJzgyMDAnOjI3MjYsJzgyMDEnOjI3MjcsJzgyMDInOjI3MjgsJzgyMTAnOjI3NDcsJzgyMTEnOjI3MzAsJzgyMTInOjI3MjksJzgyMTMnOjE5NjcsJzgyMTUnOjMyOTUsJzgyMTYnOjI3NjgsJzgyMTcnOjI3NjksJzgyMTgnOjI4MTMsJzgyMjAnOjI3NzAsJzgyMjEnOjI3NzEsJzgyMjInOjI4MTQsJzgyMjQnOjI4MDEsJzgyMjUnOjI4MDIsJzgyMjYnOjI3OTAsJzgyMjknOjI3MzUsJzgyMzAnOjI3MzQsJzgyNDAnOjI3NzMsJzgyNDInOjI3NzQsJzgyNDMnOjI3NzUsJzgyNDgnOjI4MTIsJzgyNTQnOjExNTAsJzgzMDQnOjE2Nzg1NTIwLCc4MzA4JzoxNjc4NTUyNCwnODMwOSc6MTY3ODU1MjUsJzgzMTAnOjE2Nzg1NTI2LCc4MzExJzoxNjc4NTUyNywnODMxMic6MTY3ODU1MjgsJzgzMTMnOjE2Nzg1NTI5LCc4MzIwJzoxNjc4NTUzNiwnODMyMSc6MTY3ODU1MzcsJzgzMjInOjE2Nzg1NTM4LCc4MzIzJzoxNjc4NTUzOSwnODMyNCc6MTY3ODU1NDAsJzgzMjUnOjE2Nzg1NTQxLCc4MzI2JzoxNjc4NTU0MiwnODMyNyc6MTY3ODU1NDMsJzgzMjgnOjE2Nzg1NTQ0LCc4MzI5JzoxNjc4NTU0NSwnODM1Mic6MTY3ODU1NjgsJzgzNTMnOjE2Nzg1NTY5LCc4MzU0JzoxNjc4NTU3MCwnODM1NSc6MTY3ODU1NzEsJzgzNTYnOjE2Nzg1NTcyLCc4MzU3JzoxNjc4NTU3MywnODM1OCc6MTY3ODU1NzQsJzgzNTknOjE2Nzg1NTc1LCc4MzYwJzoxNjc4NTU3NiwnODM2MSc6MzgzOSwnODM2Mic6MTY3ODU1NzgsJzgzNjMnOjE2Nzg1NTc5LCc4MzY0Jzo4MzY0LCc4NDUzJzoyNzQ0LCc4NDcwJzoxNzEyLCc4NDcxJzoyODExLCc4NDc4JzoyNzcyLCc4NDgyJzoyNzYxLCc4NTMxJzoyNzM2LCc4NTMyJzoyNzM3LCc4NTMzJzoyNzM4LCc4NTM0JzoyNzM5LCc4NTM1JzoyNzQwLCc4NTM2JzoyNzQxLCc4NTM3JzoyNzQyLCc4NTM4JzoyNzQzLCc4NTM5JzoyNzU1LCc4NTQwJzoyNzU2LCc4NTQxJzoyNzU3LCc4NTQyJzoyNzU4LCc4NTkyJzoyMjk5LCc4NTkzJzoyMzAwLCc4NTk0JzoyMzAxLCc4NTk1JzoyMzAyLCc4NjU4JzoyMjU0LCc4NjYwJzoyMjUzLCc4NzA2JzoyMjg3LCc4NzA5JzoxNjc4NTkyNSwnODcxMSc6MjI0NSwnODcxMic6MTY3ODU5MjgsJzg3MTMnOjE2Nzg1OTI5LCc4NzE1JzoxNjc4NTkzMSwnODcyOCc6MzAxOCwnODczMCc6MjI2MiwnODczMSc6MTY3ODU5NDcsJzg3MzInOjE2Nzg1OTQ4LCc4NzMzJzoyMjQxLCc4NzM0JzoyMjQyLCc4NzQzJzoyMjcwLCc4NzQ0JzoyMjcxLCc4NzQ1JzoyMjY4LCc4NzQ2JzoyMjY5LCc4NzQ3JzoyMjM5LCc4NzQ4JzoxNjc4NTk2NCwnODc0OSc6MTY3ODU5NjUsJzg3NTYnOjIyNDAsJzg3NTcnOjE2Nzg1OTczLCc4NzY0JzoyMjQ4LCc4NzcxJzoyMjQ5LCc4NzczJzoxNjc4NTk5MiwnODc3NSc6MTY3ODU5OTEsJzg4MDAnOjIyMzcsJzg4MDEnOjIyNTUsJzg4MDInOjE2Nzg2MDE4LCc4ODAzJzoxNjc4NjAxOSwnODgwNCc6MjIzNiwnODgwNSc6MjIzOCwnODgzNCc6MjI2NiwnODgzNSc6MjI2NywnODg2Nic6MzA2OCwnODg2Nyc6MzAzNiwnODg2OCc6MzAxMCwnODg2OSc6MzAyMiwnODk2OCc6MzAyNywnODk3MCc6MzAxMiwnODk4MSc6MjgxMCwnODk5Mic6MjIxMiwnODk5Myc6MjIxMywnOTEwOSc6MzAyMCwnOTExNSc6MjIxOSwnOTExNyc6MjIyMCwnOTExOCc6MjIyMSwnOTEyMCc6MjIyMiwnOTEyMSc6MjIxNSwnOTEyMyc6MjIxNiwnOTEyNCc6MjIxNywnOTEyNic6MjIxOCwnOTEyOCc6MjIyMywnOTEzMic6MjIyNCwnOTE0Myc6MjIwOSwnOTE0Nic6MjU0MywnOTE0Nyc6MjU0NCwnOTE0OCc6MjU0NiwnOTE0OSc6MjU0NywnOTIyNSc6MjUzMCwnOTIyNic6MjUzMywnOTIyNyc6MjUzNywnOTIyOCc6MjUzMSwnOTIyOSc6MjUzMiwnOTI1MSc6MjczMiwnOTI1Mic6MjUzNiwnOTQ3Mic6MjIxMSwnOTQ3NCc6MjIxNCwnOTQ4NCc6MjIxMCwnOTQ4OCc6MjUzOSwnOTQ5Mic6MjU0MSwnOTQ5Nic6MjUzOCwnOTUwMCc6MjU0OCwnOTUwOCc6MjU0OSwnOTUxNic6MjU1MSwnOTUyNCc6MjU1MCwnOTUzMic6MjU0MiwnOTYxOCc6MjUyOSwnOTY0Mic6Mjc5MSwnOTY0Myc6Mjc4NSwnOTY0NCc6Mjc3OSwnOTY0NSc6Mjc4NiwnOTY0Nic6Mjc4MywnOTY0Nyc6Mjc2NywnOTY1MCc6Mjc5MiwnOTY1MSc6Mjc4NywnOTY1NCc6Mjc4MSwnOTY1NSc6Mjc2NSwnOTY2MCc6Mjc5MywnOTY2MSc6Mjc4OCwnOTY2NCc6Mjc4MCwnOTY2NSc6Mjc2NCwnOTY3MCc6MjUyOCwnOTY3NSc6Mjc2NiwnOTY3OSc6Mjc4MiwnOTcwMic6Mjc4NCwnOTczNCc6Mjc4OSwnOTc0Mic6MjgwOSwnOTc0Nyc6Mjc2MiwnOTc1Nic6Mjc5NCwnOTc1OCc6Mjc5NSwnOTc5Mic6MjgwOCwnOTc5NCc6MjgwNywnOTgyNyc6Mjc5NiwnOTgyOSc6Mjc5OCwnOTgzMCc6Mjc5NywnOTgzNyc6MjgwNiwnOTgzOSc6MjgwNSwnMTAwMDMnOjI4MDMsJzEwMDA3JzoyODA0LCcxMDAxMyc6Mjc3NywnMTAwMTYnOjI4MDAsJzEwMjE2JzoyNzQ4LCcxMDIxNyc6Mjc1MCwnMTAyNDAnOjE2Nzg3NDU2LCcxMDI0MSc6MTY3ODc0NTcsJzEwMjQyJzoxNjc4NzQ1OCwnMTAyNDMnOjE2Nzg3NDU5LCcxMDI0NCc6MTY3ODc0NjAsJzEwMjQ1JzoxNjc4NzQ2MSwnMTAyNDYnOjE2Nzg3NDYyLCcxMDI0Nyc6MTY3ODc0NjMsJzEwMjQ4JzoxNjc4NzQ2NCwnMTAyNDknOjE2Nzg3NDY1LCcxMDI1MCc6MTY3ODc0NjYsJzEwMjUxJzoxNjc4NzQ2NywnMTAyNTInOjE2Nzg3NDY4LCcxMDI1Myc6MTY3ODc0NjksJzEwMjU0JzoxNjc4NzQ3MCwnMTAyNTUnOjE2Nzg3NDcxLCcxMDI1Nic6MTY3ODc0NzIsJzEwMjU3JzoxNjc4NzQ3MywnMTAyNTgnOjE2Nzg3NDc0LCcxMDI1OSc6MTY3ODc0NzUsJzEwMjYwJzoxNjc4NzQ3NiwnMTAyNjEnOjE2Nzg3NDc3LCcxMDI2Mic6MTY3ODc0NzgsJzEwMjYzJzoxNjc4NzQ3OSwnMTAyNjQnOjE2Nzg3NDgwLCcxMDI2NSc6MTY3ODc0ODEsJzEwMjY2JzoxNjc4NzQ4MiwnMTAyNjcnOjE2Nzg3NDgzLCcxMDI2OCc6MTY3ODc0ODQsJzEwMjY5JzoxNjc4NzQ4NSwnMTAyNzAnOjE2Nzg3NDg2LCcxMDI3MSc6MTY3ODc0ODcsJzEwMjcyJzoxNjc4NzQ4OCwnMTAyNzMnOjE2Nzg3NDg5LCcxMDI3NCc6MTY3ODc0OTAsJzEwMjc1JzoxNjc4NzQ5MSwnMTAyNzYnOjE2Nzg3NDkyLCcxMDI3Nyc6MTY3ODc0OTMsJzEwMjc4JzoxNjc4NzQ5NCwnMTAyNzknOjE2Nzg3NDk1LCcxMDI4MCc6MTY3ODc0OTYsJzEwMjgxJzoxNjc4NzQ5NywnMTAyODInOjE2Nzg3NDk4LCcxMDI4Myc6MTY3ODc0OTksJzEwMjg0JzoxNjc4NzUwMCwnMTAyODUnOjE2Nzg3NTAxLCcxMDI4Nic6MTY3ODc1MDIsJzEwMjg3JzoxNjc4NzUwMywnMTAyODgnOjE2Nzg3NTA0LCcxMDI4OSc6MTY3ODc1MDUsJzEwMjkwJzoxNjc4NzUwNiwnMTAyOTEnOjE2Nzg3NTA3LCcxMDI5Mic6MTY3ODc1MDgsJzEwMjkzJzoxNjc4NzUwOSwnMTAyOTQnOjE2Nzg3NTEwLCcxMDI5NSc6MTY3ODc1MTEsJzEwMjk2JzoxNjc4NzUxMiwnMTAyOTcnOjE2Nzg3NTEzLCcxMDI5OCc6MTY3ODc1MTQsJzEwMjk5JzoxNjc4NzUxNSwnMTAzMDAnOjE2Nzg3NTE2LCcxMDMwMSc6MTY3ODc1MTcsJzEwMzAyJzoxNjc4NzUxOCwnMTAzMDMnOjE2Nzg3NTE5LCcxMDMwNCc6MTY3ODc1MjAsJzEwMzA1JzoxNjc4NzUyMSwnMTAzMDYnOjE2Nzg3NTIyLCcxMDMwNyc6MTY3ODc1MjMsJzEwMzA4JzoxNjc4NzUyNCwnMTAzMDknOjE2Nzg3NTI1LCcxMDMxMCc6MTY3ODc1MjYsJzEwMzExJzoxNjc4NzUyNywnMTAzMTInOjE2Nzg3NTI4LCcxMDMxMyc6MTY3ODc1MjksJzEwMzE0JzoxNjc4NzUzMCwnMTAzMTUnOjE2Nzg3NTMxLCcxMDMxNic6MTY3ODc1MzIsJzEwMzE3JzoxNjc4NzUzMywnMTAzMTgnOjE2Nzg3NTM0LCcxMDMxOSc6MTY3ODc1MzUsJzEwMzIwJzoxNjc4NzUzNiwnMTAzMjEnOjE2Nzg3NTM3LCcxMDMyMic6MTY3ODc1MzgsJzEwMzIzJzoxNjc4NzUzOSwnMTAzMjQnOjE2Nzg3NTQwLCcxMDMyNSc6MTY3ODc1NDEsJzEwMzI2JzoxNjc4NzU0MiwnMTAzMjcnOjE2Nzg3NTQzLCcxMDMyOCc6MTY3ODc1NDQsJzEwMzI5JzoxNjc4NzU0NSwnMTAzMzAnOjE2Nzg3NTQ2LCcxMDMzMSc6MTY3ODc1NDcsJzEwMzMyJzoxNjc4NzU0OCwnMTAzMzMnOjE2Nzg3NTQ5LCcxMDMzNCc6MTY3ODc1NTAsJzEwMzM1JzoxNjc4NzU1MSwnMTAzMzYnOjE2Nzg3NTUyLCcxMDMzNyc6MTY3ODc1NTMsJzEwMzM4JzoxNjc4NzU1NCwnMTAzMzknOjE2Nzg3NTU1LCcxMDM0MCc6MTY3ODc1NTYsJzEwMzQxJzoxNjc4NzU1NywnMTAzNDInOjE2Nzg3NTU4LCcxMDM0Myc6MTY3ODc1NTksJzEwMzQ0JzoxNjc4NzU2MCwnMTAzNDUnOjE2Nzg3NTYxLCcxMDM0Nic6MTY3ODc1NjIsJzEwMzQ3JzoxNjc4NzU2MywnMTAzNDgnOjE2Nzg3NTY0LCcxMDM0OSc6MTY3ODc1NjUsJzEwMzUwJzoxNjc4NzU2NiwnMTAzNTEnOjE2Nzg3NTY3LCcxMDM1Mic6MTY3ODc1NjgsJzEwMzUzJzoxNjc4NzU2OSwnMTAzNTQnOjE2Nzg3NTcwLCcxMDM1NSc6MTY3ODc1NzEsJzEwMzU2JzoxNjc4NzU3MiwnMTAzNTcnOjE2Nzg3NTczLCcxMDM1OCc6MTY3ODc1NzQsJzEwMzU5JzoxNjc4NzU3NSwnMTAzNjAnOjE2Nzg3NTc2LCcxMDM2MSc6MTY3ODc1NzcsJzEwMzYyJzoxNjc4NzU3OCwnMTAzNjMnOjE2Nzg3NTc5LCcxMDM2NCc6MTY3ODc1ODAsJzEwMzY1JzoxNjc4NzU4MSwnMTAzNjYnOjE2Nzg3NTgyLCcxMDM2Nyc6MTY3ODc1ODMsJzEwMzY4JzoxNjc4NzU4NCwnMTAzNjknOjE2Nzg3NTg1LCcxMDM3MCc6MTY3ODc1ODYsJzEwMzcxJzoxNjc4NzU4NywnMTAzNzInOjE2Nzg3NTg4LCcxMDM3Myc6MTY3ODc1ODksJzEwMzc0JzoxNjc4NzU5MCwnMTAzNzUnOjE2Nzg3NTkxLCcxMDM3Nic6MTY3ODc1OTIsJzEwMzc3JzoxNjc4NzU5MywnMTAzNzgnOjE2Nzg3NTk0LCcxMDM3OSc6MTY3ODc1OTUsJzEwMzgwJzoxNjc4NzU5NiwnMTAzODEnOjE2Nzg3NTk3LCcxMDM4Mic6MTY3ODc1OTgsJzEwMzgzJzoxNjc4NzU5OSwnMTAzODQnOjE2Nzg3NjAwLCcxMDM4NSc6MTY3ODc2MDEsJzEwMzg2JzoxNjc4NzYwMiwnMTAzODcnOjE2Nzg3NjAzLCcxMDM4OCc6MTY3ODc2MDQsJzEwMzg5JzoxNjc4NzYwNSwnMTAzOTAnOjE2Nzg3NjA2LCcxMDM5MSc6MTY3ODc2MDcsJzEwMzkyJzoxNjc4NzYwOCwnMTAzOTMnOjE2Nzg3NjA5LCcxMDM5NCc6MTY3ODc2MTAsJzEwMzk1JzoxNjc4NzYxMSwnMTAzOTYnOjE2Nzg3NjEyLCcxMDM5Nyc6MTY3ODc2MTMsJzEwMzk4JzoxNjc4NzYxNCwnMTAzOTknOjE2Nzg3NjE1LCcxMDQwMCc6MTY3ODc2MTYsJzEwNDAxJzoxNjc4NzYxNywnMTA0MDInOjE2Nzg3NjE4LCcxMDQwMyc6MTY3ODc2MTksJzEwNDA0JzoxNjc4NzYyMCwnMTA0MDUnOjE2Nzg3NjIxLCcxMDQwNic6MTY3ODc2MjIsJzEwNDA3JzoxNjc4NzYyMywnMTA0MDgnOjE2Nzg3NjI0LCcxMDQwOSc6MTY3ODc2MjUsJzEwNDEwJzoxNjc4NzYyNiwnMTA0MTEnOjE2Nzg3NjI3LCcxMDQxMic6MTY3ODc2MjgsJzEwNDEzJzoxNjc4NzYyOSwnMTA0MTQnOjE2Nzg3NjMwLCcxMDQxNSc6MTY3ODc2MzEsJzEwNDE2JzoxNjc4NzYzMiwnMTA0MTcnOjE2Nzg3NjMzLCcxMDQxOCc6MTY3ODc2MzQsJzEwNDE5JzoxNjc4NzYzNSwnMTA0MjAnOjE2Nzg3NjM2LCcxMDQyMSc6MTY3ODc2MzcsJzEwNDIyJzoxNjc4NzYzOCwnMTA0MjMnOjE2Nzg3NjM5LCcxMDQyNCc6MTY3ODc2NDAsJzEwNDI1JzoxNjc4NzY0MSwnMTA0MjYnOjE2Nzg3NjQyLCcxMDQyNyc6MTY3ODc2NDMsJzEwNDI4JzoxNjc4NzY0NCwnMTA0MjknOjE2Nzg3NjQ1LCcxMDQzMCc6MTY3ODc2NDYsJzEwNDMxJzoxNjc4NzY0NywnMTA0MzInOjE2Nzg3NjQ4LCcxMDQzMyc6MTY3ODc2NDksJzEwNDM0JzoxNjc4NzY1MCwnMTA0MzUnOjE2Nzg3NjUxLCcxMDQzNic6MTY3ODc2NTIsJzEwNDM3JzoxNjc4NzY1MywnMTA0MzgnOjE2Nzg3NjU0LCcxMDQzOSc6MTY3ODc2NTUsJzEwNDQwJzoxNjc4NzY1NiwnMTA0NDEnOjE2Nzg3NjU3LCcxMDQ0Mic6MTY3ODc2NTgsJzEwNDQzJzoxNjc4NzY1OSwnMTA0NDQnOjE2Nzg3NjYwLCcxMDQ0NSc6MTY3ODc2NjEsJzEwNDQ2JzoxNjc4NzY2MiwnMTA0NDcnOjE2Nzg3NjYzLCcxMDQ0OCc6MTY3ODc2NjQsJzEwNDQ5JzoxNjc4NzY2NSwnMTA0NTAnOjE2Nzg3NjY2LCcxMDQ1MSc6MTY3ODc2NjcsJzEwNDUyJzoxNjc4NzY2OCwnMTA0NTMnOjE2Nzg3NjY5LCcxMDQ1NCc6MTY3ODc2NzAsJzEwNDU1JzoxNjc4NzY3MSwnMTA0NTYnOjE2Nzg3NjcyLCcxMDQ1Nyc6MTY3ODc2NzMsJzEwNDU4JzoxNjc4NzY3NCwnMTA0NTknOjE2Nzg3Njc1LCcxMDQ2MCc6MTY3ODc2NzYsJzEwNDYxJzoxNjc4NzY3NywnMTA0NjInOjE2Nzg3Njc4LCcxMDQ2Myc6MTY3ODc2NzksJzEwNDY0JzoxNjc4NzY4MCwnMTA0NjUnOjE2Nzg3NjgxLCcxMDQ2Nic6MTY3ODc2ODIsJzEwNDY3JzoxNjc4NzY4MywnMTA0NjgnOjE2Nzg3Njg0LCcxMDQ2OSc6MTY3ODc2ODUsJzEwNDcwJzoxNjc4NzY4NiwnMTA0NzEnOjE2Nzg3Njg3LCcxMDQ3Mic6MTY3ODc2ODgsJzEwNDczJzoxNjc4NzY4OSwnMTA0NzQnOjE2Nzg3NjkwLCcxMDQ3NSc6MTY3ODc2OTEsJzEwNDc2JzoxNjc4NzY5MiwnMTA0NzcnOjE2Nzg3NjkzLCcxMDQ3OCc6MTY3ODc2OTQsJzEwNDc5JzoxNjc4NzY5NSwnMTA0ODAnOjE2Nzg3Njk2LCcxMDQ4MSc6MTY3ODc2OTcsJzEwNDgyJzoxNjc4NzY5OCwnMTA0ODMnOjE2Nzg3Njk5LCcxMDQ4NCc6MTY3ODc3MDAsJzEwNDg1JzoxNjc4NzcwMSwnMTA0ODYnOjE2Nzg3NzAyLCcxMDQ4Nyc6MTY3ODc3MDMsJzEwNDg4JzoxNjc4NzcwNCwnMTA0ODknOjE2Nzg3NzA1LCcxMDQ5MCc6MTY3ODc3MDYsJzEwNDkxJzoxNjc4NzcwNywnMTA0OTInOjE2Nzg3NzA4LCcxMDQ5Myc6MTY3ODc3MDksJzEwNDk0JzoxNjc4NzcxMCwnMTA0OTUnOjE2Nzg3NzExLCcxMjI4OSc6MTE4OCwnMTIyOTAnOjExODUsJzEyMzAwJzoxMTg2LCcxMjMwMSc6MTE4NywnMTI0NDMnOjEyNDYsJzEyNDQ0JzoxMjQ3LCcxMjQ0OSc6MTE5MSwnMTI0NTAnOjEyMDEsJzEyNDUxJzoxMTkyLCcxMjQ1Mic6MTIwMiwnMTI0NTMnOjExOTMsJzEyNDU0JzoxMjAzLCcxMjQ1NSc6MTE5NCwnMTI0NTYnOjEyMDQsJzEyNDU3JzoxMTk1LCcxMjQ1OCc6MTIwNSwnMTI0NTknOjEyMDYsJzEyNDYxJzoxMjA3LCcxMjQ2Myc6MTIwOCwnMTI0NjUnOjEyMDksJzEyNDY3JzoxMjEwLCcxMjQ2OSc6MTIxMSwnMTI0NzEnOjEyMTIsJzEyNDczJzoxMjEzLCcxMjQ3NSc6MTIxNCwnMTI0NzcnOjEyMTUsJzEyNDc5JzoxMjE2LCcxMjQ4MSc6MTIxNywnMTI0ODMnOjExOTksJzEyNDg0JzoxMjE4LCcxMjQ4Nic6MTIxOSwnMTI0ODgnOjEyMjAsJzEyNDkwJzoxMjIxLCcxMjQ5MSc6MTIyMiwnMTI0OTInOjEyMjMsJzEyNDkzJzoxMjI0LCcxMjQ5NCc6MTIyNSwnMTI0OTUnOjEyMjYsJzEyNDk4JzoxMjI3LCcxMjUwMSc6MTIyOCwnMTI1MDQnOjEyMjksJzEyNTA3JzoxMjMwLCcxMjUxMCc6MTIzMSwnMTI1MTEnOjEyMzIsJzEyNTEyJzoxMjMzLCcxMjUxMyc6MTIzNCwnMTI1MTQnOjEyMzUsJzEyNTE1JzoxMTk2LCcxMjUxNic6MTIzNiwnMTI1MTcnOjExOTcsJzEyNTE4JzoxMjM3LCcxMjUxOSc6MTE5OCwnMTI1MjAnOjEyMzgsJzEyNTIxJzoxMjM5LCcxMjUyMic6MTI0MCwnMTI1MjMnOjEyNDEsJzEyNTI0JzoxMjQyLCcxMjUyNSc6MTI0MywnMTI1MjcnOjEyNDQsJzEyNTMwJzoxMTkwLCcxMjUzMSc6MTI0NSwnMTI1MzknOjExODksJzEyNTQwJzoxMjAwfTtcblxuXG5mdW5jdGlvbiBsb29rdXAoaykge1xuXHRyZXR1cm4gayA/IHtrZXlzeW06IGssIGtleW5hbWU6IGtleW5hbWVzID8ga2V5bmFtZXNba10gOiBrfSA6IHVuZGVmaW5lZDtcbn1cblxuXG5mdW5jdGlvbiBmcm9tVW5pY29kZSh1KSB7XG5cdHJldHVybiBsb29rdXAoY29kZXBvaW50c1t1XSk7XG59XG5cblxuLyoqXG4gKiBFeHBvc2UgbG9va3VwKCkgYW5kIGZyb21Vbmljb2RlKCkgZnVuY3Rpb25zLlxuICovXG5LZXlzLmxvb2t1cCA9IGxvb2t1cDtcbktleXMuZnJvbVVuaWNvZGUgPSBmcm9tVW5pY29kZTtcblxuXG4vKipcbiAqIEV4cG9zZSBLZXlzIE9iamVjdC5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBLZXlzO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ub3ZuYy1ub2RlL2xpYi9rZXlzLmpzXCIsXCIvLi4vLi4vbm9kZV9tb2R1bGVzL25vdm5jLW5vZGUvbGliXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLypcbiAqIG5vVk5DOiBIVE1MNSBWTkMgY2xpZW50XG4gKiBDb3B5cmlnaHQgKEMpIDIwMTIgSm9lbCBNYXJ0aW5cbiAqIENvcHlyaWdodCAoQykgMjAxMyBTYW11ZWwgTWFubmVoZWQgZm9yIENlbmRpbyBBQlxuICogTGljZW5zZWQgdW5kZXIgTVBMIDIuMCAoc2VlIExJQ0VOU0UudHh0KVxuICpcbiAqIFRJR0hUIGRlY29kZXIgcG9ydGlvbjpcbiAqIChjKSAyMDEyIE1pY2hhZWwgVGluZ2xvZiwgSm9lIEJhbGF6LCBMZXMgUGllY2ggKE1lcmN1cmkuY2EpXG4gKi9cblxuXG4vKipcbiAqIEV4cG9zZSB0aGUgUkZCIGNsYXNzLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IFJGQjtcblxuXG4vKipcbiAqIERlcGVuZGVuY2llcy5cbiAqL1xudmFyIGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnbm9WTkM6UkZCJyk7XG52YXIgZGVidWdlcnJvciA9IHJlcXVpcmUoJ2RlYnVnJykoJ25vVk5DOkVSUk9SOlJGQicpO1xuZGVidWdlcnJvci5sb2cgPSBjb25zb2xlLndhcm4uYmluZChjb25zb2xlKTtcbnZhciBVdGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgV2Vic29jayA9IHJlcXVpcmUoJy4vd2Vic29jaycpO1xudmFyIEtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcbnZhciBJbnB1dCA9IHJlcXVpcmUoJy4vaW5wdXQnKTtcbnZhciBLZXlib2FyZCA9IElucHV0LktleWJvYXJkO1xudmFyIE1vdXNlID0gSW5wdXQuTW91c2U7XG52YXIgRGlzcGxheSA9IHJlcXVpcmUoJy4vZGlzcGxheScpO1xudmFyIEJhc2U2NCA9IHJlcXVpcmUoJy4vYmFzZTY0Jyk7XG52YXIgREVTID0gcmVxdWlyZSgnLi9kZXMnKTtcbnZhciBUSU5GID0gcmVxdWlyZSgnLi90aW5mJyk7XG5cblxuZnVuY3Rpb24gUkZCIChkZWZhdWx0cykge1xuXHRkZWJ1ZygnbmV3KCknKTtcblxuXHRkZWZhdWx0cyA9IGRlZmF1bHRzIHx8IHt9O1xuXG5cdHRoaXMuX3JmYl91cmwgPSBudWxsO1xuXHR0aGlzLl9yZmJfcGFzc3dvcmQgPSAnJztcblxuXHR0aGlzLl9yZmJfc3RhdGUgPSAnZGlzY29ubmVjdGVkJztcblx0dGhpcy5fcmZiX3ZlcnNpb24gPSAwO1xuXHR0aGlzLl9yZmJfbWF4X3ZlcnNpb24gPSAzLjg7XG5cdHRoaXMuX3JmYl9hdXRoX3NjaGVtZSA9ICcnO1xuXG5cdHRoaXMuX3JmYl90aWdodHZuYyA9IGZhbHNlO1xuXHR0aGlzLl9yZmJfeHZwX3ZlciA9IDA7XG5cblx0Ly8gSW4gcHJlZmVyZW5jZSBvcmRlclxuXHR0aGlzLl9lbmNvZGluZ3MgPSBbXG5cdFx0WydDT1BZUkVDVCcsICAgICAgICAgMHgwMSBdLFxuXHRcdFsnVElHSFQnLCAgICAgICAgICAgIDB4MDcgXSxcblx0XHRbJ1RJR0hUX1BORycsICAgICAgICAtMjYwIF0sXG5cdFx0WydIRVhUSUxFJywgICAgICAgICAgMHgwNSBdLFxuXHRcdFsnUlJFJywgICAgICAgICAgICAgIDB4MDIgXSxcblx0XHRbJ1JBVycsICAgICAgICAgICAgICAweDAwIF0sXG5cdFx0WydEZXNrdG9wU2l6ZScsICAgICAgLTIyMyBdLFxuXHRcdFsnQ3Vyc29yJywgICAgICAgICAgIC0yMzkgXSxcblxuXHRcdC8vIFBzdWVkby1lbmNvZGluZyBzZXR0aW5nc1xuXHRcdC8vWydKUEVHX3F1YWxpdHlfbG8nLCAgICAtMzIgXSxcblx0XHRbJ0pQRUdfcXVhbGl0eV9tZWQnLCAgICAgLTI2IF0sXG5cdFx0Ly9bJ0pQRUdfcXVhbGl0eV9oaScsICAgIC0yMyBdLFxuXHRcdC8vWydjb21wcmVzc19sbycsICAgICAgIC0yNTUgXSxcblx0XHRbJ2NvbXByZXNzX2hpJywgICAgICAgICAtMjQ3IF0sXG5cdFx0WydsYXN0X3JlY3QnLCAgICAgICAgICAgLTIyNCBdLFxuXHRcdFsneHZwJywgICAgICAgICAgICAgICAgIC0zMDkgXSxcblx0XHRbJ0V4dGVuZGVkRGVza3RvcFNpemUnLCAtMzA4IF1cblx0XTtcblxuXHR0aGlzLl9lbmNIYW5kbGVycyA9IHt9O1xuXHR0aGlzLl9lbmNOYW1lcyA9IHt9O1xuXHR0aGlzLl9lbmNTdGF0cyA9IHt9O1xuXG5cdHRoaXMuX3NvY2sgPSBudWxsOyAgICAgICAgICAgICAgLy8gV2Vic29jayBvYmplY3Rcblx0dGhpcy5fZGlzcGxheSA9IG51bGw7ICAgICAgICAgICAvLyBEaXNwbGF5IG9iamVjdFxuXHR0aGlzLl9rZXlib2FyZCA9IG51bGw7ICAgICAgICAgIC8vIEtleWJvYXJkIGlucHV0IGhhbmRsZXIgb2JqZWN0XG5cdHRoaXMuX21vdXNlID0gbnVsbDsgICAgICAgICAgICAgLy8gTW91c2UgaW5wdXQgaGFuZGxlciBvYmplY3Rcblx0dGhpcy5fc2VuZFRpbWVyID0gbnVsbDsgICAgICAgICAvLyBTZW5kIFF1ZXVlIGNoZWNrIHRpbWVyXG5cdHRoaXMuX2Rpc2Nvbm5UaW1lciA9IG51bGw7ICAgICAgLy8gZGlzY29ubmVjdGlvbiB0aW1lclxuXHR0aGlzLl9tc2dUaW1lciA9IG51bGw7ICAgICAgICAgIC8vIHF1ZXVlZCBoYW5kbGVfbXNnIHRpbWVyXG5cblx0Ly8gRnJhbWUgYnVmZmVyIHVwZGF0ZSBzdGF0ZVxuXHR0aGlzLl9GQlUgPSB7XG5cdFx0cmVjdHM6IDAsXG5cdFx0c3VicmVjdHM6IDAsICAgICAgICAgICAgLy8gUlJFXG5cdFx0bGluZXM6IDAsICAgICAgICAgICAgICAgLy8gUkFXXG5cdFx0dGlsZXM6IDAsICAgICAgICAgICAgICAgLy8gSEVYVElMRVxuXHRcdGJ5dGVzOiAwLFxuXHRcdHg6IDAsXG5cdFx0eTogMCxcblx0XHR3aWR0aDogMCxcblx0XHRoZWlnaHQ6IDAsXG5cdFx0ZW5jb2Rpbmc6IDAsXG5cdFx0c3ViZW5jb2Rpbmc6IC0xLFxuXHRcdGJhY2tncm91bmQ6IG51bGwsXG5cdFx0emxpYjogW10gICAgICAgICAgICAgICAgLy8gVElHSFQgemxpYiBzdHJlYW1zXG5cdH07XG5cblx0dGhpcy5fZmJfQnBwID0gNDtcblx0dGhpcy5fZmJfZGVwdGggPSAzO1xuXHR0aGlzLl9mYl93aWR0aCA9IDA7XG5cdHRoaXMuX2ZiX2hlaWdodCA9IDA7XG5cdHRoaXMuX2ZiX25hbWUgPSAnJztcblxuXHR0aGlzLl9ycmVfY2h1bmtfc3ogPSAxMDA7XG5cblx0dGhpcy5fdGltaW5nID0ge1xuXHRcdGxhc3RfZmJ1OiAwLFxuXHRcdGZidV90b3RhbDogMCxcblx0XHRmYnVfdG90YWxfY250OiAwLFxuXHRcdGZ1bGxfZmJ1X3RvdGFsOiAwLFxuXHRcdGZ1bGxfZmJ1X2NudDogMCxcblxuXHRcdGZidV9ydF9zdGFydDogMCxcblx0XHRmYnVfcnRfdG90YWw6IDAsXG5cdFx0ZmJ1X3J0X2NudDogMCxcblx0XHRwaXhlbHM6IDBcblx0fTtcblxuXHR0aGlzLl9zdXBwb3J0c1NldERlc2t0b3BTaXplID0gZmFsc2U7XG5cdHRoaXMuX3NjcmVlbl9pZCA9IDA7XG5cdHRoaXMuX3NjcmVlbl9mbGFncyA9IDA7XG5cblx0Ly8gTW91c2Ugc3RhdGVcblx0dGhpcy5fbW91c2VfYnV0dG9uTWFzayA9IDA7XG5cdHRoaXMuX21vdXNlX2FyciA9IFtdO1xuXHR0aGlzLl92aWV3cG9ydERyYWdnaW5nID0gZmFsc2U7XG5cdHRoaXMuX3ZpZXdwb3J0RHJhZ1BvcyA9IHt9O1xuXG5cdC8vIHNldCB0aGUgZGVmYXVsdCB2YWx1ZSBvbiB1c2VyLWZhY2luZyBwcm9wZXJ0aWVzXG5cdFV0aWwuc2V0X2RlZmF1bHRzKHRoaXMsIGRlZmF1bHRzLCB7XG5cdFx0J3RhcmdldCc6ICdudWxsJywgICAgICAgICAgICAgICAgICAgICAgIC8vIFZOQyBkaXNwbGF5IHJlbmRlcmluZyBDYW52YXMgb2JqZWN0XG5cdFx0J2ZvY3VzQ29udGFpbmVyJzogZG9jdW1lbnQsICAgICAgICAgICAgIC8vIERPTSBlbGVtZW50IHRoYXQgY2FwdHVyZXMga2V5Ym9hcmQgaW5wdXRcblx0XHQnZW5jcnlwdCc6IGZhbHNlLCAgICAgICAgICAgICAgICAgICAgICAgLy8gVXNlIFRMUy9TU0wvd3NzIGVuY3J5cHRpb25cblx0XHQndHJ1ZV9jb2xvcic6IHRydWUsICAgICAgICAgICAgICAgICAgICAgLy8gUmVxdWVzdCB0cnVlIGNvbG9yIHBpeGVsIGRhdGFcblx0XHQnbG9jYWxfY3Vyc29yJzogZmFsc2UsICAgICAgICAgICAgICAgICAgLy8gUmVxdWVzdCBsb2NhbGx5IHJlbmRlcmVkIGN1cnNvclxuXHRcdCdzaGFyZWQnOiB0cnVlLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSZXF1ZXN0IHNoYXJlZCBtb2RlXG5cdFx0J3ZpZXdfb25seSc6IGZhbHNlLCAgICAgICAgICAgICAgICAgICAgIC8vIERpc2FibGUgY2xpZW50IG1vdXNlL2tleWJvYXJkXG5cdFx0J3h2cF9wYXNzd29yZF9zZXAnOiAnQCcsICAgICAgICAgICAgICAgIC8vIFNlcGFyYXRvciBmb3IgWFZQIHBhc3N3b3JkIGZpZWxkc1xuXHRcdCdkaXNjb25uZWN0VGltZW91dCc6IDMsICAgICAgICAgICAgICAgICAvLyBUaW1lIChzKSB0byB3YWl0IGZvciBkaXNjb25uZWN0aW9uXG5cdFx0J3dzUHJvdG9jb2xzJzogWydiaW5hcnknLCAnYmFzZTY0J10sICAgIC8vIFByb3RvY29scyB0byB1c2UgaW4gdGhlIFdlYlNvY2tldCBjb25uZWN0aW9uXG5cdFx0J3JlcGVhdGVySUQnOiAnJywgICAgICAgICAgICAgICAgICAgICAgIC8vIFtVbHRyYVZOQ10gUmVwZWF0ZXJJRCB0byBjb25uZWN0IHRvXG5cdFx0J3ZpZXdwb3J0RHJhZyc6IGZhbHNlLCAgICAgICAgICAgICAgICAgIC8vIE1vdmUgdGhlIHZpZXdwb3J0IG9uIG1vdXNlIGRyYWdzXG5cdFx0J2ZvcmNlQXV0aFNjaGVtZSc6IDAsICAgICAgICAgICAgICAgICAgIC8vIEZvcmNlIGF1dGggc2NoZW1lICgwIG1lYW5zIG5vKVxuXHRcdCdlbmFibGVNb3VzZUFuZFRvdWNoJzogZmFsc2UsICAgICAgICAgICAvLyBXaGV0aGVyIGFsc28gZW5hYmxlIG1vdXNlIGV2ZW50cyB3aGVuIHRvdWNoIHNjcmVlbiBpcyBkZXRlY3RlZFxuXG5cdFx0Ly8gQ2FsbGJhY2sgZnVuY3Rpb25zXG5cdFx0J29uVXBkYXRlU3RhdGUnOiBmdW5jdGlvbiAoKSB7IH0sICAgICAgIC8vIG9uVXBkYXRlU3RhdGUocmZiLCBzdGF0ZSwgb2xkc3RhdGUsIHN0YXR1c01zZyk6IHN0YXRlIHVwZGF0ZS9jaGFuZ2Vcblx0XHQnb25QYXNzd29yZFJlcXVpcmVkJzogZnVuY3Rpb24gKCkgeyB9LCAgLy8gb25QYXNzd29yZFJlcXVpcmVkKHJmYik6IFZOQyBwYXNzd29yZCBpcyByZXF1aXJlZFxuXHRcdCdvbkNsaXBib2FyZCc6IGZ1bmN0aW9uICgpIHsgfSwgICAgICAgICAvLyBvbkNsaXBib2FyZChyZmIsIHRleHQpOiBSRkIgY2xpcGJvYXJkIGNvbnRlbnRzIHJlY2VpdmVkXG5cdFx0J29uQmVsbCc6IGZ1bmN0aW9uICgpIHsgfSwgICAgICAgICAgICAgIC8vIG9uQmVsbChyZmIpOiBSRkIgQmVsbCBtZXNzYWdlIHJlY2VpdmVkXG5cdFx0J29uRkJVUmVjZWl2ZSc6IGZ1bmN0aW9uICgpIHsgfSwgICAgICAgIC8vIG9uRkJVUmVjZWl2ZShyZmIsIGZidSk6IFJGQiBGQlUgcmVjZWl2ZWQgYnV0IG5vdCB5ZXQgcHJvY2Vzc2VkXG5cdFx0J29uRkJVQ29tcGxldGUnOiBmdW5jdGlvbiAoKSB7IH0sICAgICAgIC8vIG9uRkJVQ29tcGxldGUocmZiLCBmYnUpOiBSRkIgRkJVIHJlY2VpdmVkIGFuZCBwcm9jZXNzZWRcblx0XHQnb25GQlJlc2l6ZSc6IGZ1bmN0aW9uICgpIHsgfSwgICAgICAgICAgLy8gb25GQlJlc2l6ZShyZmIsIHdpZHRoLCBoZWlnaHQpOiBmcmFtZSBidWZmZXIgcmVzaXplZFxuXHRcdCdvbkRlc2t0b3BOYW1lJzogZnVuY3Rpb24gKCkgeyB9LCAgICAgICAvLyBvbkRlc2t0b3BOYW1lKHJmYiwgbmFtZSk6IGRlc2t0b3AgbmFtZSByZWNlaXZlZFxuXHRcdCdvblh2cEluaXQnOiBmdW5jdGlvbiAoKSB7IH0sICAgICAgICAgICAvLyBvblh2cEluaXQodmVyc2lvbik6IFhWUCBleHRlbnNpb25zIGFjdGl2ZSBmb3IgdGhpcyBjb25uZWN0aW9uXG5cdFx0J29uVW5rbm93bk1lc3NhZ2VUeXBlJzogbnVsbCAgICAgICAgICAgIC8vIEhhbmRsZXIgZm9yIHVua25vd24gVk5DIG1lc3NhZ2UgdHlwZXMuIElmXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgICAgICAgICAgICAgICAgICAgIC8vIG51bGwgZmFpbHVyZSBpcyBlbWl0dGVkIGFuZCB0aGUgUkZCIGNsb3NlZC5cblx0fSk7XG5cblx0Ly8gcG9wdWxhdGUgZW5jSGFuZGxlcnMgd2l0aCBib3VuZCB2ZXJzaW9uc1xuXHRPYmplY3Qua2V5cyhSRkIuZW5jb2RpbmdIYW5kbGVycykuZm9yRWFjaChmdW5jdGlvbiAoZW5jTmFtZSkge1xuXHRcdHRoaXMuX2VuY0hhbmRsZXJzW2VuY05hbWVdID0gUkZCLmVuY29kaW5nSGFuZGxlcnNbZW5jTmFtZV0uYmluZCh0aGlzKTtcblx0fS5iaW5kKHRoaXMpKTtcblxuXHQvLyBDcmVhdGUgbG9va3VwIHRhYmxlcyBiYXNlZCBvbiBlbmNvZGluZyBudW1iZXJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9lbmNvZGluZ3MubGVuZ3RoOyBpKyspIHtcblx0XHR0aGlzLl9lbmNIYW5kbGVyc1t0aGlzLl9lbmNvZGluZ3NbaV1bMV1dID0gdGhpcy5fZW5jSGFuZGxlcnNbdGhpcy5fZW5jb2RpbmdzW2ldWzBdXTtcblx0XHR0aGlzLl9lbmNOYW1lc1t0aGlzLl9lbmNvZGluZ3NbaV1bMV1dID0gdGhpcy5fZW5jb2RpbmdzW2ldWzBdO1xuXHRcdHRoaXMuX2VuY1N0YXRzW3RoaXMuX2VuY29kaW5nc1tpXVsxXV0gPSBbMCwgMF07XG5cdH1cblxuXHR0cnkge1xuXHRcdHRoaXMuX2Rpc3BsYXkgPSBuZXcgRGlzcGxheSh7dGFyZ2V0OiB0aGlzLl90YXJnZXR9KTtcblx0fSBjYXRjaChlcnJvcikge1xuXHRcdGRlYnVnZXJyb3IoJ0Rpc3BsYXkgZXhjZXB0aW9uOiAnICsgZXJyb3IpO1xuXHRcdC8vIERvbid0IGNvbnRpbnVlLiBBdm9pZCB1Z2x5IGVycm9ycyBpbiBcImZhdGFsXCIgc3RhdGUuXG5cdFx0dGhyb3coZXJyb3IpO1xuXHR9XG5cblx0dGhpcy5fa2V5Ym9hcmQgPSBuZXcgS2V5Ym9hcmQoe1xuXHRcdHRhcmdldDogdGhpcy5fZm9jdXNDb250YWluZXIsXG5cdFx0b25LZXlQcmVzczogdGhpcy5faGFuZGxlS2V5UHJlc3MuYmluZCh0aGlzKVxuXHR9KTtcblxuXHR0aGlzLl9tb3VzZSA9IG5ldyBNb3VzZSh7XG5cdFx0dGFyZ2V0OiB0aGlzLl90YXJnZXQsXG5cdFx0b25Nb3VzZUJ1dHRvbjogdGhpcy5faGFuZGxlTW91c2VCdXR0b24uYmluZCh0aGlzKSxcblx0XHRvbk1vdXNlTW92ZTogdGhpcy5faGFuZGxlTW91c2VNb3ZlLmJpbmQodGhpcyksXG5cdFx0bm90aWZ5OiB0aGlzLl9rZXlib2FyZC5zeW5jLmJpbmQodGhpcy5fa2V5Ym9hcmQpLFxuXHRcdGVuYWJsZU1vdXNlQW5kVG91Y2g6IHRoaXMuX2VuYWJsZU1vdXNlQW5kVG91Y2hcblx0fSk7XG5cblx0dGhpcy5fc29jayA9IG5ldyBXZWJzb2NrKCk7XG5cblx0dGhpcy5fc29jay5vbignbWVzc2FnZScsIHRoaXMuX2hhbmRsZV9tZXNzYWdlLmJpbmQodGhpcykpO1xuXG5cdHRoaXMuX3NvY2sub24oJ29wZW4nLCBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHRoaXMuX3JmYl9zdGF0ZSA9PT0gJ2Nvbm5lY3QnKSB7XG5cdFx0XHR0aGlzLl91cGRhdGVTdGF0ZSgnUHJvdG9jb2xWZXJzaW9uJywgJ1N0YXJ0aW5nIFZOQyBoYW5kc2hha2UnKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fZmFpbCgnR290IHVuZXhwZWN0ZWQgV2ViU29ja2V0IGNvbm5lY3Rpb24nKTtcblx0XHR9XG5cdH0uYmluZCh0aGlzKSk7XG5cblx0dGhpcy5fc29jay5vbignY2xvc2UnLCBmdW5jdGlvbiAoZSkge1xuXHRcdGRlYnVnKCdXZWJTb2NrZXQgY2xvc2VkJyk7XG5cblx0XHR2YXIgbXNnID0gJyc7XG5cdFx0aWYgKGUuY29kZSkge1xuXHRcdFx0bXNnID0gJyAoY29kZTogJyArIGUuY29kZTtcblx0XHRcdGlmIChlLnJlYXNvbikge1xuXHRcdFx0XHRtc2cgKz0gJywgcmVhc29uOiAnICsgZS5yZWFzb247XG5cdFx0XHR9XG5cdFx0XHRtc2cgKz0gJyknO1xuXHRcdH1cblx0XHRpZiAodGhpcy5fcmZiX3N0YXRlID09PSAnZGlzY29ubmVjdCcpIHtcblx0XHRcdHRoaXMuX3VwZGF0ZVN0YXRlKCdkaXNjb25uZWN0ZWQnLCAnVk5DIGRpc2Nvbm5lY3RlZCcgKyBtc2cpO1xuXHRcdH0gZWxzZSBpZiAodGhpcy5fcmZiX3N0YXRlID09PSAnUHJvdG9jb2xWZXJzaW9uJykge1xuXHRcdFx0dGhpcy5fZmFpbCgnRmFpbGVkIHRvIGNvbm5lY3QgdG8gc2VydmVyJyArIG1zZyk7XG5cdFx0fSBlbHNlIGlmICh0aGlzLl9yZmJfc3RhdGUgaW4geydmYWlsZWQnOiAxLCAnZGlzY29ubmVjdGVkJzogMX0pIHtcblx0XHRcdGRlYnVnKCdSZWNlaXZlZCBvbmNsb3NlIHdoaWxlIGRpc2Nvbm5lY3RlZCcgKyBtc2cpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9mYWlsKCdTZXJ2ZXIgZGlzY29ubmVjdGVkJyArIG1zZyk7XG5cdFx0fVxuXHRcdHRoaXMuX3NvY2sub2ZmKCdjbG9zZScpO1xuXHR9LmJpbmQodGhpcykpO1xuXG5cdHRoaXMuX3NvY2sub24oJ2Vycm9yJywgZnVuY3Rpb24gKCkge1xuXHRcdGRlYnVnZXJyb3IoJ1dlYlNvY2tldCBlcnJvcicpO1xuXHR9KTtcblxuXHR0aGlzLl9pbml0X3ZhcnMoKTtcblxuXHR2YXIgcm1vZGUgPSB0aGlzLl9kaXNwbGF5LmdldF9yZW5kZXJfbW9kZSgpO1xuXG5cdHRoaXMuX3VwZGF0ZVN0YXRlKCdsb2FkZWQnLCAnbm9WTkMgcmVhZHk6ICcgKyBybW9kZSk7XG59XG5cblxuUkZCLnByb3RvdHlwZSA9IHtcblx0Ly8gUHVibGljIG1ldGhvZHNcblx0Y29ubmVjdDogZnVuY3Rpb24gKHVybCwgcGFzc3dvcmQpIHtcblx0XHR0aGlzLl9yZmJfdXJsID0gdXJsO1xuXHRcdHRoaXMuX3JmYl9wYXNzd29yZCA9IChwYXNzd29yZCAhPT0gdW5kZWZpbmVkKSA/IHBhc3N3b3JkIDogJyc7XG5cblx0XHR0aGlzLl91cGRhdGVTdGF0ZSgnY29ubmVjdCcsICdDb25uZWN0aW5nJyk7XG5cdH0sXG5cblx0ZGlzY29ubmVjdDogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuX3VwZGF0ZVN0YXRlKCdkaXNjb25uZWN0JywgJ0Rpc2Nvbm5lY3RpbmcnKTtcblx0XHR0aGlzLl9zb2NrLm9mZignZXJyb3InKTtcblx0XHR0aGlzLl9zb2NrLm9mZignbWVzc2FnZScpO1xuXHRcdHRoaXMuX3NvY2sub2ZmKCdvcGVuJyk7XG5cdH0sXG5cblx0c2VuZFBhc3N3b3JkOiBmdW5jdGlvbiAocGFzc3dkKSB7XG5cdFx0dGhpcy5fcmZiX3Bhc3N3b3JkID0gcGFzc3dkO1xuXHRcdHRoaXMuX3JmYl9zdGF0ZSA9ICdBdXRoZW50aWNhdGlvbic7XG5cdFx0c2V0VGltZW91dCh0aGlzLl9pbml0X21zZy5iaW5kKHRoaXMpLCAxKTtcblx0fSxcblxuXHRzZW5kQ3RybEFsdERlbDogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLl9yZmJfc3RhdGUgIT09ICdub3JtYWwnIHx8IHRoaXMuX3ZpZXdfb25seSkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRcdHZhciBhcnIgPSBbXTtcblx0XHRhcnIgPSBhcnIuY29uY2F0KFJGQi5tZXNzYWdlcy5rZXlFdmVudChLZXlzLlhLX0NvbnRyb2xfTCwgMSkpO1xuXHRcdGFyciA9IGFyci5jb25jYXQoUkZCLm1lc3NhZ2VzLmtleUV2ZW50KEtleXMuWEtfQWx0X0wsIDEpKTtcblx0XHRhcnIgPSBhcnIuY29uY2F0KFJGQi5tZXNzYWdlcy5rZXlFdmVudChLZXlzLlhLX0RlbGV0ZSwgMSkpO1xuXHRcdGFyciA9IGFyci5jb25jYXQoUkZCLm1lc3NhZ2VzLmtleUV2ZW50KEtleXMuWEtfRGVsZXRlLCAwKSk7XG5cdFx0YXJyID0gYXJyLmNvbmNhdChSRkIubWVzc2FnZXMua2V5RXZlbnQoS2V5cy5YS19BbHRfTCwgMCkpO1xuXHRcdGFyciA9IGFyci5jb25jYXQoUkZCLm1lc3NhZ2VzLmtleUV2ZW50KEtleXMuWEtfQ29udHJvbF9MLCAwKSk7XG5cdFx0dGhpcy5fc29jay5zZW5kKGFycik7XG5cdH0sXG5cblx0eHZwT3A6IGZ1bmN0aW9uICh2ZXIsIG9wKSB7XG5cdFx0aWYgKHRoaXMuX3JmYl94dnBfdmVyIDwgdmVyKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdGRlYnVnKCd4dnBPcCgpIHwgc2VuZGluZyBYVlAgb3BlcmF0aW9uICcgKyBvcCArICcgKHZlcnNpb24gJyArIHZlciArICcpJyk7XG5cdFx0dGhpcy5fc29jay5zZW5kX3N0cmluZygnXFx4RkFcXHgwMCcgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKHZlcikgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKG9wKSk7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH0sXG5cblx0eHZwU2h1dGRvd246IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gdGhpcy54dnBPcCgxLCAyKTtcblx0fSxcblxuXHR4dnBSZWJvb3Q6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gdGhpcy54dnBPcCgxLCAzKTtcblx0fSxcblxuXHR4dnBSZXNldDogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLnh2cE9wKDEsIDQpO1xuXHR9LFxuXG5cdC8vIFNlbmQgYSBrZXkgcHJlc3MuIElmICdkb3duJyBpcyBub3Qgc3BlY2lmaWVkIHRoZW4gc2VuZCBhIGRvd24ga2V5XG5cdC8vIGZvbGxvd2VkIGJ5IGFuIHVwIGtleS5cblx0c2VuZEtleTogZnVuY3Rpb24gKGNvZGUsIGRvd24pIHtcblx0XHRpZiAodGhpcy5fcmZiX3N0YXRlICE9PSAnbm9ybWFsJyB8fCB0aGlzLl92aWV3X29ubHkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0dmFyIGFyciA9IFtdO1xuXHRcdGlmICh0eXBlb2YgZG93biAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdGRlYnVnKCdzZW5kS2V5KCkgfCBzZW5kaW5nIGtleSBjb2RlICgnICsgKGRvd24gPyAnZG93bicgOiAndXAnKSArICcpOiAnICsgY29kZSk7XG5cdFx0XHRhcnIgPSBhcnIuY29uY2F0KFJGQi5tZXNzYWdlcy5rZXlFdmVudChjb2RlLCBkb3duID8gMSA6IDApKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGVidWcoJ3NlbmRLZXkoKSB8IHNlbmRpbmcga2V5IGNvZGUgKGRvd24gKyB1cCk6ICcgKyBjb2RlKTtcblx0XHRcdGFyciA9IGFyci5jb25jYXQoUkZCLm1lc3NhZ2VzLmtleUV2ZW50KGNvZGUsIDEpKTtcblx0XHRcdGFyciA9IGFyci5jb25jYXQoUkZCLm1lc3NhZ2VzLmtleUV2ZW50KGNvZGUsIDApKTtcblx0XHR9XG5cdFx0dGhpcy5fc29jay5zZW5kKGFycik7XG5cdH0sXG5cblx0Y2xpcGJvYXJkUGFzdGVGcm9tOiBmdW5jdGlvbiAodGV4dCkge1xuXHRcdGlmICh0aGlzLl9yZmJfc3RhdGUgIT09ICdub3JtYWwnKSB7IHJldHVybjsgfVxuXHRcdHRoaXMuX3NvY2suc2VuZChSRkIubWVzc2FnZXMuY2xpZW50Q3V0VGV4dCh0ZXh0KSk7XG5cdH0sXG5cblx0c2V0RGVza3RvcFNpemU6IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0KSB7XG5cdFx0aWYgKHRoaXMuX3JmYl9zdGF0ZSAhPT0gJ25vcm1hbCcpIHsgcmV0dXJuOyB9XG5cblx0XHRpZiAodGhpcy5fc3VwcG9ydHNTZXREZXNrdG9wU2l6ZSkge1xuXG5cdFx0XHR2YXIgYXJyID0gWzI1MV07ICAgIC8vIG1zZy10eXBlXG5cdFx0XHRVdGlsLnB1c2g4KGFyciwgMCk7ICAgICAgIC8vIHBhZGRpbmdcblx0XHRcdFV0aWwucHVzaDE2KGFyciwgd2lkdGgpOyAgLy8gd2lkdGhcblx0XHRcdFV0aWwucHVzaDE2KGFyciwgaGVpZ2h0KTsgLy8gaGVpZ2h0XG5cblx0XHRcdFV0aWwucHVzaDgoYXJyLCAxKTsgICAgICAgLy8gbnVtYmVyLW9mLXNjcmVlbnNcblx0XHRcdFV0aWwucHVzaDgoYXJyLCAwKTsgICAgICAgLy8gcGFkZGluZ1xuXG5cdFx0XHQvLyBzY3JlZW4gYXJyYXlcblx0XHRcdFV0aWwucHVzaDMyKGFyciwgdGhpcy5fc2NyZWVuX2lkKTsgICAgLy8gaWRcblx0XHRcdFV0aWwucHVzaDE2KGFyciwgMCk7ICAgICAgICAgICAgICAgICAgLy8geC1wb3NpdGlvblxuXHRcdFx0VXRpbC5wdXNoMTYoYXJyLCAwKTsgICAgICAgICAgICAgICAgICAvLyB5LXBvc2l0aW9uXG5cdFx0XHRVdGlsLnB1c2gxNihhcnIsIHdpZHRoKTsgICAgICAgICAgICAgIC8vIHdpZHRoXG5cdFx0XHRVdGlsLnB1c2gxNihhcnIsIGhlaWdodCk7ICAgICAgICAgICAgIC8vIGhlaWdodFxuXHRcdFx0VXRpbC5wdXNoMzIoYXJyLCB0aGlzLl9zY3JlZW5fZmxhZ3MpOyAvLyBmbGFnc1xuXG5cdFx0XHR0aGlzLl9zb2NrLnNlbmQoYXJyKTtcblx0XHR9XG5cdH0sXG5cblx0Ly8gUHJpdmF0ZSBtZXRob2RzXG5cdF9jb25uZWN0OiBmdW5jdGlvbiAoKSB7XG5cdFx0ZGVidWcoJ19jb25uZWN0KCkgfCBjb25uZWN0aW5nIHRvICcgKyB0aGlzLl9yZmJfdXJsKTtcblx0XHR0aGlzLl9zb2NrLm9wZW4odGhpcy5fcmZiX3VybCwgdGhpcy5fd3NQcm90b2NvbHMpO1xuXHR9LFxuXG5cdF9pbml0X3ZhcnM6IGZ1bmN0aW9uICgpIHtcblx0XHQvLyByZXNldCBzdGF0ZVxuXHRcdHRoaXMuX3NvY2suaW5pdCgpO1xuXG5cdFx0dGhpcy5fRkJVLnJlY3RzICAgICAgICA9IDA7XG5cdFx0dGhpcy5fRkJVLnN1YnJlY3RzICAgICA9IDA7ICAvLyBSUkUgYW5kIEhFWFRJTEVcblx0XHR0aGlzLl9GQlUubGluZXMgICAgICAgID0gMDsgIC8vIFJBV1xuXHRcdHRoaXMuX0ZCVS50aWxlcyAgICAgICAgPSAwOyAgLy8gSEVYVElMRVxuXHRcdHRoaXMuX0ZCVS56bGlicyAgICAgICAgPSBbXTsgLy8gVElHSFQgemxpYiBlbmNvZGVyc1xuXHRcdHRoaXMuX21vdXNlX2J1dHRvbk1hc2sgPSAwO1xuXHRcdHRoaXMuX21vdXNlX2FyciAgICAgICAgPSBbXTtcblx0XHR0aGlzLl9yZmJfdGlnaHR2bmMgICAgID0gZmFsc2U7XG5cblx0XHQvLyBDbGVhciB0aGUgcGVyIGNvbm5lY3Rpb24gZW5jb2Rpbmcgc3RhdHNcblx0XHR2YXIgaTtcblx0XHRmb3IgKGkgPSAwOyBpIDwgdGhpcy5fZW5jb2RpbmdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR0aGlzLl9lbmNTdGF0c1t0aGlzLl9lbmNvZGluZ3NbaV1bMV1dWzBdID0gMDtcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgNDsgaSsrKSB7XG5cdFx0XHR0aGlzLl9GQlUuemxpYnNbaV0gPSBuZXcgVElORigpO1xuXHRcdFx0dGhpcy5fRkJVLnpsaWJzW2ldLmluaXQoKTtcblx0XHR9XG5cdH0sXG5cblx0X3ByaW50X3N0YXRzOiBmdW5jdGlvbiAoKSB7XG5cdFx0ZGVidWcoJ19wcmludF9zdGF0cygpIHwgZW5jb2Rpbmcgc3RhdHMgZm9yIHRoaXMgY29ubmVjdGlvbjonKTtcblxuXHRcdHZhciBpLCBzO1xuXHRcdGZvciAoaSA9IDA7IGkgPCB0aGlzLl9lbmNvZGluZ3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdHMgPSB0aGlzLl9lbmNTdGF0c1t0aGlzLl9lbmNvZGluZ3NbaV1bMV1dO1xuXHRcdFx0aWYgKHNbMF0gKyBzWzFdID4gMCkge1xuXHRcdFx0XHRkZWJ1ZygnX3ByaW50X3N0YXRzKCkgfCAnICsgdGhpcy5fZW5jb2RpbmdzW2ldWzBdICsgJzogJyArIHNbMF0gKyAnIHJlY3RzJyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZGVidWcoJ19wcmludF9zdGF0cygpIHwgZW5jb2Rpbmcgc3RhdHMgc2luY2UgcGFnZSBsb2FkOicpO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IHRoaXMuX2VuY29kaW5ncy5sZW5ndGg7IGkrKykge1xuXHRcdFx0cyA9IHRoaXMuX2VuY1N0YXRzW3RoaXMuX2VuY29kaW5nc1tpXVsxXV07XG5cdFx0XHRkZWJ1ZygnX3ByaW50X3N0YXRzKCkgfCAnICsgdGhpcy5fZW5jb2RpbmdzW2ldWzBdICsgJzogJyArIHNbMV0gKyAnIHJlY3RzJyk7XG5cdFx0fVxuXHR9LFxuXG5cdF9jbGVhbnVwU29ja2V0OiBmdW5jdGlvbiAoc3RhdGUpIHtcblx0XHRpZiAodGhpcy5fc2VuZFRpbWVyKSB7XG5cdFx0XHRjbGVhckludGVydmFsKHRoaXMuX3NlbmRUaW1lcik7XG5cdFx0XHR0aGlzLl9zZW5kVGltZXIgPSBudWxsO1xuXHRcdH1cblx0XHRpZiAodGhpcy5fbXNnVGltZXIpIHtcblx0XHRcdGNsZWFySW50ZXJ2YWwodGhpcy5fbXNnVGltZXIpO1xuXHRcdFx0dGhpcy5fbXNnVGltZXIgPSBudWxsO1xuXHRcdH1cblx0XHRpZiAodGhpcy5fZGlzcGxheSAmJiB0aGlzLl9kaXNwbGF5LmdldF9jb250ZXh0KCkpIHtcblx0XHRcdHRoaXMuX2tleWJvYXJkLnVuZ3JhYigpO1xuXHRcdFx0dGhpcy5fbW91c2UudW5ncmFiKCk7XG5cdFx0XHRpZiAoc3RhdGUgIT09ICdjb25uZWN0JyAmJiBzdGF0ZSAhPT0gJ2xvYWRlZCcpIHtcblx0XHRcdFx0dGhpcy5fZGlzcGxheS5kZWZhdWx0Q3Vyc29yKCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9kaXNwbGF5LmNsZWFyKCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fc29jay5jbG9zZSgpO1xuXHR9LFxuXG5cblx0Lypcblx0ICogUGFnZSBzdGF0ZXM6XG5cdCAqICAgbG9hZGVkICAgICAgIC0gcGFnZSBsb2FkLCBlcXVpdmFsZW50IHRvIGRpc2Nvbm5lY3RlZFxuXHQgKiAgIGRpc2Nvbm5lY3RlZCAtIGlkbGUgc3RhdGVcblx0ICogICBjb25uZWN0ICAgICAgLSBzdGFydGluZyB0byBjb25uZWN0ICh0byBQcm90b2NvbFZlcnNpb24pXG5cdCAqICAgbm9ybWFsICAgICAgIC0gY29ubmVjdGVkXG5cdCAqICAgZGlzY29ubmVjdCAgIC0gc3RhcnRpbmcgdG8gZGlzY29ubmVjdFxuXHQgKiAgIGZhaWxlZCAgICAgICAtIGFibm9ybWFsIGRpc2Nvbm5lY3Rcblx0ICogICBmYXRhbCAgICAgICAgLSBmYWlsZWQgdG8gbG9hZCBwYWdlLCBvciBmYXRhbCBlcnJvclxuXHQgKlxuXHQgKiBSRkIgcHJvdG9jb2wgaW5pdGlhbGl6YXRpb24gc3RhdGVzOlxuXHQgKiAgIFByb3RvY29sVmVyc2lvblxuXHQgKiAgIFNlY3VyaXR5XG5cdCAqICAgQXV0aGVudGljYXRpb25cblx0ICogICBwYXNzd29yZCAgICAgLSB3YWl0aW5nIGZvciBwYXNzd29yZCwgbm90IHBhcnQgb2YgUkZCXG5cdCAqICAgU2VjdXJpdHlSZXN1bHRcblx0ICogICBDbGllbnRJbml0aWFsaXphdGlvbiAtIG5vdCB0cmlnZ2VyZWQgYnkgc2VydmVyIG1lc3NhZ2Vcblx0ICogICBTZXJ2ZXJJbml0aWFsaXphdGlvbiAodG8gbm9ybWFsKVxuXHQgKi9cblx0X3VwZGF0ZVN0YXRlOiBmdW5jdGlvbiAoc3RhdGUsIHN0YXR1c01zZykge1xuXHRcdGRlYnVnKCdfdXBkYXRlU3RhdGUoKSB8IFtzdGF0ZTolcywgbXNnOlwiJXNcIl0nLCBzdGF0ZSwgc3RhdHVzTXNnKTtcblxuXHRcdHZhciBvbGRzdGF0ZSA9IHRoaXMuX3JmYl9zdGF0ZTtcblxuXHRcdGlmIChzdGF0ZSA9PT0gb2xkc3RhdGUpIHtcblx0XHRcdC8vIEFscmVhZHkgaGVyZSwgaWdub3JlXG5cdFx0XHRkZWJ1ZygnX3VwZGF0ZVN0YXRlKCkgfCBhbHJlYWR5IGluIHN0YXRlIFwiJyArIHN0YXRlICsgJ1wiLCBpZ25vcmluZycpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8qXG5cdFx0ICogVGhlc2UgYXJlIGRpc2Nvbm5lY3RlZCBzdGF0ZXMuIEEgcHJldmlvdXMgY29ubmVjdCBtYXlcblx0XHQgKiBhc3luY2hyb25vdXNseSBjYXVzZSBhIGNvbm5lY3Rpb24gc28gbWFrZSBzdXJlIHdlIGFyZSBjbG9zZWQuXG5cdFx0ICovXG5cdFx0aWYgKHN0YXRlIGluIHsnZGlzY29ubmVjdGVkJzogMSwgJ2xvYWRlZCc6IDEsICdjb25uZWN0JzogMSxcblx0XHRcdCdkaXNjb25uZWN0JzogMSwgJ2ZhaWxlZCc6IDEsICdmYXRhbCc6IDF9KSB7XG5cdFx0XHR0aGlzLl9jbGVhbnVwU29ja2V0KHN0YXRlKTtcblx0XHR9XG5cblx0XHRpZiAob2xkc3RhdGUgPT09ICdmYXRhbCcpIHtcblx0XHRcdGRlYnVnZXJyb3IoJ191cGRhdGVTdGF0ZSgpIHwgZmF0YWwgZXJyb3IsIGNhbm5vdCBjb250aW51ZScpO1xuXHRcdH1cblxuXHRcdGlmIChzdGF0dXNNc2cgJiYgKHN0YXRlID09PSAnZmFpbGVkJyB8fCBzdGF0ZSA9PT0gJ2ZhdGFsJykpIHtcblx0XHRcdGRlYnVnZXJyb3IoJ191cGRhdGVTdGF0ZSgpIHwgJXM6ICVzJywgc3RhdGUsIHN0YXR1c01zZyk7XG5cdFx0fVxuXG5cdFx0aWYgKG9sZHN0YXRlID09PSAnZmFpbGVkJyAmJiBzdGF0ZSA9PT0gJ2Rpc2Nvbm5lY3RlZCcpIHtcblx0XHRcdC8vIGRvIGRpc2Nvbm5lY3QgYWN0aW9uLCBidXQgc3RheSBpbiBmYWlsZWQgc3RhdGVcblx0XHRcdHRoaXMuX3JmYl9zdGF0ZSA9ICdmYWlsZWQnO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9yZmJfc3RhdGUgPSBzdGF0ZTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fZGlzY29ublRpbWVyICYmIHRoaXMuX3JmYl9zdGF0ZSAhPT0gJ2Rpc2Nvbm5lY3QnKSB7XG5cdFx0XHRkZWJ1ZygnX3VwZGF0ZVN0YXRlKCkgfCBjbGVhcmluZyBkaXNjb25uZWN0IHRpbWVyJyk7XG5cdFx0XHRjbGVhclRpbWVvdXQodGhpcy5fZGlzY29ublRpbWVyKTtcblx0XHRcdHRoaXMuX2Rpc2Nvbm5UaW1lciA9IG51bGw7XG5cdFx0XHR0aGlzLl9zb2NrLm9mZignY2xvc2UnKTsgIC8vIG1ha2Ugc3VyZSB3ZSBkb24ndCBnZXQgYSBkb3VibGUgZXZlbnRcblx0XHR9XG5cblx0XHRzd2l0Y2ggKHN0YXRlKSB7XG5cdFx0XHRjYXNlICdub3JtYWwnOlxuXHRcdFx0XHRpZiAob2xkc3RhdGUgPT09ICdkaXNjb25uZWN0ZWQnIHx8IG9sZHN0YXRlID09PSAnZmFpbGVkJykge1xuXHRcdFx0XHRcdGRlYnVnZXJyb3IoJ191cGRhdGVTdGF0ZSgpIHwgaW52YWxpZCB0cmFuc2l0aW9uIGZyb20gXCJkaXNjb25uZWN0ZWRcIiBvciBcImZhaWxlZFwiIHRvIFwibm9ybWFsXCInKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSAnY29ubmVjdCc6XG5cdFx0XHRcdHRoaXMuX2luaXRfdmFycygpO1xuXHRcdFx0XHR0aGlzLl9jb25uZWN0KCk7XG5cdFx0XHRcdC8vIFdlYlNvY2tldC5vbm9wZW4gdHJhbnNpdGlvbnMgdG8gJ1Byb3RvY29sVmVyc2lvbidcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgJ2Rpc2Nvbm5lY3QnOlxuXHRcdFx0XHR0aGlzLl9kaXNjb25uVGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR0aGlzLl9mYWlsKCdEaXNjb25uZWN0IHRpbWVvdXQnKTtcblx0XHRcdFx0fS5iaW5kKHRoaXMpLCB0aGlzLl9kaXNjb25uZWN0VGltZW91dCAqIDEwMDApO1xuXG5cdFx0XHRcdHRoaXMuX3ByaW50X3N0YXRzKCk7XG5cblx0XHRcdFx0Ly8gV2ViU29ja2V0Lm9uY2xvc2UgdHJhbnNpdGlvbnMgdG8gJ2Rpc2Nvbm5lY3RlZCdcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgJ2ZhaWxlZCc6XG5cdFx0XHRcdGlmIChvbGRzdGF0ZSA9PT0gJ2Rpc2Nvbm5lY3RlZCcpIHtcblx0XHRcdFx0XHRkZWJ1Z2Vycm9yKCdfdXBkYXRlU3RhdGUoKSB8IGludmFsaWQgdHJhbnNpdGlvbiBmcm9tIFwiZGlzY29ubmVjdGVkXCIgdG8gXCJmYWlsZWRcIicpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKG9sZHN0YXRlID09PSAnbm9ybWFsJykge1xuXHRcdFx0XHRcdGRlYnVnZXJyb3IoJ191cGRhdGVTdGF0ZSgpIHwgZXJyb3Igd2hpbGUgY29ubmVjdGVkJyk7XG5cdFx0XHRcdH0gZWxzZSBpZiAob2xkc3RhdGUgPT09ICdpbml0Jykge1xuXHRcdFx0XHRcdGRlYnVnZXJyb3IoJ191cGRhdGVTdGF0ZSgpIHwgZXJyb3Igd2hpbGUgaW5pdGlhbGl6aW5nJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBNYWtlIHN1cmUgd2UgdHJhbnNpdGlvbiB0byBkaXNjb25uZWN0ZWRcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dGhpcy5fdXBkYXRlU3RhdGUoJ2Rpc2Nvbm5lY3RlZCcpO1xuXHRcdFx0XHR9LmJpbmQodGhpcyksIDUwKTtcblxuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0Ly8gTm8gc3RhdGUgY2hhbmdlIGFjdGlvbiB0byB0YWtlXG5cdFx0fVxuXG5cdFx0aWYgKG9sZHN0YXRlID09PSAnZmFpbGVkJyAmJiBzdGF0ZSA9PT0gJ2Rpc2Nvbm5lY3RlZCcpIHtcblx0XHRcdHRoaXMuX29uVXBkYXRlU3RhdGUodGhpcywgc3RhdGUsIG9sZHN0YXRlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fb25VcGRhdGVTdGF0ZSh0aGlzLCBzdGF0ZSwgb2xkc3RhdGUsIHN0YXR1c01zZyk7XG5cdFx0fVxuXHR9LFxuXG5cdF9mYWlsOiBmdW5jdGlvbiAobXNnKSB7XG5cdFx0dGhpcy5fdXBkYXRlU3RhdGUoJ2ZhaWxlZCcsIG1zZyk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9LFxuXG5cdF9oYW5kbGVfbWVzc2FnZTogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLl9zb2NrLnJRbGVuKCkgPT09IDApIHtcblx0XHRcdGRlYnVnZXJyb3IoJ19oYW5kbGVfbWVzc2FnZSgpIHwgY2FsbGVkIG9uIGFuIGVtcHR5IHJlY2VpdmUgcXVldWUnKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRzd2l0Y2ggKHRoaXMuX3JmYl9zdGF0ZSkge1xuXHRcdFx0Y2FzZSAnZGlzY29ubmVjdGVkJzpcblx0XHRcdGNhc2UgJ2ZhaWxlZCc6XG5cdFx0XHRcdGRlYnVnZXJyb3IoJ19oYW5kbGVfbWVzc2FnZSgpIHwgZ290IGRhdGEgd2hpbGUgZGlzY29ubmVjdGVkJyk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnbm9ybWFsJzpcblx0XHRcdFx0aWYgKHRoaXMuX25vcm1hbF9tc2coKSAmJiB0aGlzLl9zb2NrLnJRbGVuKCkgPiAwKSB7XG5cdFx0XHRcdFx0Ly8gdHJ1ZSBtZWFucyB3ZSBjYW4gY29udGludWUgcHJvY2Vzc2luZ1xuXHRcdFx0XHRcdC8vIEdpdmUgb3RoZXIgZXZlbnRzIGEgY2hhbmNlIHRvIHJ1blxuXHRcdFx0XHRcdGlmICh0aGlzLl9tc2dUaW1lciA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0ZGVidWcoJ19oYW5kbGVfbWVzc2FnZSgpIHwgbW9yZSBkYXRhIHRvIHByb2Nlc3MsIGNyZWF0aW5nIHRpbWVyJyk7XG5cdFx0XHRcdFx0XHR0aGlzLl9tc2dUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9tc2dUaW1lciA9IG51bGw7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2hhbmRsZV9tZXNzYWdlKCk7XG5cdFx0XHRcdFx0XHR9LmJpbmQodGhpcyksIDEwKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0ZGVidWcoJ19oYW5kbGVfbWVzc2FnZSgpIHwgbW9yZSBkYXRhIHRvIHByb2Nlc3MsIGV4aXN0aW5nIHRpbWVyJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0dGhpcy5faW5pdF9tc2coKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9LFxuXG5cdF9jaGVja0V2ZW50czogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLl9yZmJfc3RhdGUgPT09ICdub3JtYWwnICYmICF0aGlzLl92aWV3cG9ydERyYWdnaW5nICYmIHRoaXMuX21vdXNlX2Fyci5sZW5ndGggPiAwKSB7XG5cdFx0XHR0aGlzLl9zb2NrLnNlbmQodGhpcy5fbW91c2VfYXJyKTtcblx0XHRcdHRoaXMuX21vdXNlX2FyciA9IFtdO1xuXHRcdH1cblx0fSxcblxuXHRfaGFuZGxlS2V5UHJlc3M6IGZ1bmN0aW9uIChrZXlzeW0sIGRvd24pIHtcblx0XHRpZiAodGhpcy5fdmlld19vbmx5KSB7IHJldHVybjsgfSAvLyBWaWV3IG9ubHksIHNraXAga2V5Ym9hcmQsIGV2ZW50c1xuXHRcdHRoaXMuX3NvY2suc2VuZChSRkIubWVzc2FnZXMua2V5RXZlbnQoa2V5c3ltLCBkb3duKSk7XG5cdH0sXG5cblx0X2hhbmRsZU1vdXNlQnV0dG9uOiBmdW5jdGlvbiAoeCwgeSwgZG93biwgYm1hc2spIHtcblx0XHRpZiAoZG93bikge1xuXHRcdFx0dGhpcy5fbW91c2VfYnV0dG9uTWFzayB8PSBibWFzaztcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fbW91c2VfYnV0dG9uTWFzayBePSBibWFzaztcblx0XHR9XG5cblx0XHRpZiAodGhpcy5fdmlld3BvcnREcmFnKSB7XG5cdFx0XHRpZiAoZG93biAmJiAhdGhpcy5fdmlld3BvcnREcmFnZ2luZykge1xuXHRcdFx0XHR0aGlzLl92aWV3cG9ydERyYWdnaW5nID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5fdmlld3BvcnREcmFnUG9zID0geyd4JzogeCwgJ3knOiB5fTtcblxuXHRcdFx0XHQvLyBTa2lwIHNlbmRpbmcgbW91c2UgZXZlbnRzXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuX3ZpZXdwb3J0RHJhZ2dpbmcgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAodGhpcy5fdmlld19vbmx5KSB7IHJldHVybjsgfSAvLyBWaWV3IG9ubHksIHNraXAgbW91c2UgZXZlbnRzXG5cblx0XHR0aGlzLl9tb3VzZV9hcnIgPSB0aGlzLl9tb3VzZV9hcnIuY29uY2F0KFxuXHRcdFx0XHRSRkIubWVzc2FnZXMucG9pbnRlckV2ZW50KHRoaXMuX2Rpc3BsYXkuYWJzWCh4KSwgdGhpcy5fZGlzcGxheS5hYnNZKHkpLCB0aGlzLl9tb3VzZV9idXR0b25NYXNrKSk7XG5cdFx0dGhpcy5fc29jay5zZW5kKHRoaXMuX21vdXNlX2Fycik7XG5cdFx0dGhpcy5fbW91c2VfYXJyID0gW107XG5cdH0sXG5cblx0X2hhbmRsZU1vdXNlTW92ZTogZnVuY3Rpb24gKHgsIHkpIHtcblx0XHRpZiAodGhpcy5fdmlld3BvcnREcmFnZ2luZykge1xuXHRcdFx0dmFyIGRlbHRhWCA9IHRoaXMuX3ZpZXdwb3J0RHJhZ1Bvcy54IC0geDtcblx0XHRcdHZhciBkZWx0YVkgPSB0aGlzLl92aWV3cG9ydERyYWdQb3MueSAtIHk7XG5cdFx0XHR0aGlzLl92aWV3cG9ydERyYWdQb3MgPSB7J3gnOiB4LCAneSc6IHl9O1xuXG5cdFx0XHR0aGlzLl9kaXNwbGF5LnZpZXdwb3J0Q2hhbmdlUG9zKGRlbHRhWCwgZGVsdGFZKTtcblxuXHRcdFx0Ly8gU2tpcCBzZW5kaW5nIG1vdXNlIGV2ZW50c1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl92aWV3X29ubHkpIHsgcmV0dXJuOyB9IC8vIFZpZXcgb25seSwgc2tpcCBtb3VzZSBldmVudHNcblxuXHRcdHRoaXMuX21vdXNlX2FyciA9IHRoaXMuX21vdXNlX2Fyci5jb25jYXQoXG5cdFx0XHRcdFJGQi5tZXNzYWdlcy5wb2ludGVyRXZlbnQodGhpcy5fZGlzcGxheS5hYnNYKHgpLCB0aGlzLl9kaXNwbGF5LmFic1koeSksIHRoaXMuX21vdXNlX2J1dHRvbk1hc2spKTtcblxuXHRcdHRoaXMuX2NoZWNrRXZlbnRzKCk7XG5cdH0sXG5cblx0Ly8gTWVzc2FnZSBIYW5kbGVyc1xuXG5cdF9uZWdvdGlhdGVfcHJvdG9jb2xfdmVyc2lvbjogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLl9zb2NrLnJRbGVuKCkgPCAxMikge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2ZhaWwoJ0luY29tcGxldGUgcHJvdG9jb2wgdmVyc2lvbicpO1xuXHRcdH1cblxuXHRcdHZhciBzdmVyc2lvbiA9IHRoaXMuX3NvY2suclFzaGlmdFN0cigxMikuc3Vic3RyKDQsIDcpO1xuXHRcdGRlYnVnKCdfbmVnb3RpYXRlX3Byb3RvY29sX3ZlcnNpb24oKSB8IHNlcnZlciBQcm90b2NvbFZlcnNpb246ICcgKyBzdmVyc2lvbik7XG5cdFx0dmFyIGlzX3JlcGVhdGVyID0gMDtcblxuXHRcdHN3aXRjaCAoc3ZlcnNpb24pIHtcblx0XHRcdGNhc2UgJzAwMC4wMDAnOiAgLy8gVWx0cmFWTkMgcmVwZWF0ZXJcblx0XHRcdFx0aXNfcmVwZWF0ZXIgPSAxO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJzAwMy4wMDMnOlxuXHRcdFx0Y2FzZSAnMDAzLjAwNic6ICAvLyBVbHRyYVZOQ1xuXHRcdFx0Y2FzZSAnMDAzLjg4OSc6ICAvLyBBcHBsZSBSZW1vdGUgRGVza3RvcFxuXHRcdFx0XHR0aGlzLl9yZmJfdmVyc2lvbiA9IDMuMztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICcwMDMuMDA3Jzpcblx0XHRcdFx0dGhpcy5fcmZiX3ZlcnNpb24gPSAzLjc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnMDAzLjAwOCc6XG5cdFx0XHRjYXNlICcwMDQuMDAwJzogIC8vIEludGVsIEFNVCBLVk1cblx0XHRcdGNhc2UgJzAwNC4wMDEnOiAgLy8gUmVhbFZOQyA0LjZcblx0XHRcdFx0dGhpcy5fcmZiX3ZlcnNpb24gPSAzLjg7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2ZhaWwoJ0ludmFsaWQgc2VydmVyIHZlcnNpb24gJyArIHN2ZXJzaW9uKTtcblx0XHR9XG5cblx0XHRpZiAoaXNfcmVwZWF0ZXIpIHtcblx0XHRcdHZhciByZXBlYXRlcklEID0gdGhpcy5fcmVwZWF0ZXJJRDtcblx0XHRcdHdoaWxlIChyZXBlYXRlcklELmxlbmd0aCA8IDI1MCkge1xuXHRcdFx0XHRyZXBlYXRlcklEICs9ICdcXDAnO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fc29jay5zZW5kX3N0cmluZyhyZXBlYXRlcklEKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9yZmJfdmVyc2lvbiA+IHRoaXMuX3JmYl9tYXhfdmVyc2lvbikge1xuXHRcdFx0dGhpcy5fcmZiX3ZlcnNpb24gPSB0aGlzLl9yZmJfbWF4X3ZlcnNpb247XG5cdFx0fVxuXG5cdFx0Ly8gU2VuZCB1cGRhdGVzIGVpdGhlciBhdCBhIHJhdGUgb2YgMSB1cGRhdGUgcGVyIDUwbXMsIG9yXG5cdFx0Ly8gd2hhdGV2ZXIgc2xvd2VyIHJhdGUgdGhlIG5ldHdvcmsgY2FuIGhhbmRsZVxuXHRcdHRoaXMuX3NlbmRUaW1lciA9IHNldEludGVydmFsKHRoaXMuX3NvY2suZmx1c2guYmluZCh0aGlzLl9zb2NrKSwgNTApO1xuXG5cdFx0dmFyIGN2ZXJzaW9uID0gJzAwJyArIHBhcnNlSW50KHRoaXMuX3JmYl92ZXJzaW9uLCAxMCkgK1xuXHRcdFx0XHRcdFx0ICcuMDAnICsgKCh0aGlzLl9yZmJfdmVyc2lvbiAqIDEwKSAlIDEwKTtcblx0XHR0aGlzLl9zb2NrLnNlbmRfc3RyaW5nKCdSRkIgJyArIGN2ZXJzaW9uICsgJ1xcbicpO1xuXHRcdHRoaXMuX3VwZGF0ZVN0YXRlKCdTZWN1cml0eScsICdTZW50IFByb3RvY29sVmVyc2lvbjogJyArIGN2ZXJzaW9uKTtcblx0fSxcblxuXHRfbmVnb3RpYXRlX3NlY3VyaXR5OiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHRoaXMuX3JmYl92ZXJzaW9uID49IDMuNykge1xuXHRcdFx0Ly8gU2VydmVyIHNlbmRzIHN1cHBvcnRlZCBsaXN0LCBjbGllbnQgZGVjaWRlc1xuXHRcdFx0dmFyIG51bV90eXBlcyA9IHRoaXMuX3NvY2suclFzaGlmdDgoKTtcblx0XHRcdGlmICh0aGlzLl9zb2NrLnJRd2FpdCgnc2VjdXJpdHkgdHlwZScsIG51bV90eXBlcywgMSkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0XHRcdGlmIChudW1fdHlwZXMgPT09IDApIHtcblx0XHRcdFx0dmFyIHN0cmxlbiA9IHRoaXMuX3NvY2suclFzaGlmdDMyKCk7XG5cdFx0XHRcdHZhciByZWFzb24gPSB0aGlzLl9zb2NrLnJRc2hpZnRTdHIoc3RybGVuKTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2ZhaWwoJ1NlY3VyaXR5IGZhaWx1cmU6ICcgKyByZWFzb24pO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9yZmJfYXV0aF9zY2hlbWUgPSAwO1xuXHRcdFx0dmFyIHR5cGVzID0gdGhpcy5fc29jay5yUXNoaWZ0Qnl0ZXMobnVtX3R5cGVzKTtcblx0XHRcdGRlYnVnKCdfbmVnb3RpYXRlX3NlY3VyaXR5KCkgfCBzZXJ2ZXIgc2VjdXJpdHkgdHlwZXM6ICcgKyB0eXBlcyk7XG5cblx0XHRcdGlmICghIHRoaXMuX2ZvcmNlQXV0aFNjaGVtZSkge1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHR5cGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aWYgKHR5cGVzW2ldID4gdGhpcy5fcmZiX2F1dGhfc2NoZW1lICYmICh0eXBlc1tpXSA8PSAxNiB8fCB0eXBlc1tpXSA9PT0gMjIpKSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9yZmJfYXV0aF9zY2hlbWUgPSB0eXBlc1tpXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR0aGlzLl9yZmJfYXV0aF9zY2hlbWUgPSB0aGlzLl9mb3JjZUF1dGhTY2hlbWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLl9yZmJfYXV0aF9zY2hlbWUgPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2ZhaWwoJ1Vuc3VwcG9ydGVkIHNlY3VyaXR5IHR5cGVzOiAnICsgdHlwZXMpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9zb2NrLnNlbmQoW3RoaXMuX3JmYl9hdXRoX3NjaGVtZV0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBTZXJ2ZXIgZGVjaWRlc1xuXHRcdFx0aWYgKHRoaXMuX3NvY2suclF3YWl0KCdzZWN1cml0eSBzY2hlbWUnLCA0KSkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdHRoaXMuX3JmYl9hdXRoX3NjaGVtZSA9IHRoaXMuX3NvY2suclFzaGlmdDMyKCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fdXBkYXRlU3RhdGUoJ0F1dGhlbnRpY2F0aW9uJywgJ0F1dGhlbnRpY2F0aW5nIHVzaW5nIHNjaGVtZTogJyArIHRoaXMuX3JmYl9hdXRoX3NjaGVtZSk7XG5cdFx0cmV0dXJuIHRoaXMuX2luaXRfbXNnKCk7IC8vIGp1bXAgdG8gYXV0aGVudGljYXRpb25cblx0fSxcblxuXHQvLyBhdXRoZW50aWNhdGlvblxuXHRfbmVnb3RpYXRlX3h2cF9hdXRoOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHh2cF9zZXAgPSB0aGlzLl94dnBfcGFzc3dvcmRfc2VwO1xuXHRcdHZhciB4dnBfYXV0aCA9IHRoaXMuX3JmYl9wYXNzd29yZC5zcGxpdCh4dnBfc2VwKTtcblx0XHRpZiAoeHZwX2F1dGgubGVuZ3RoIDwgMykge1xuXHRcdFx0dGhpcy5fdXBkYXRlU3RhdGUoJ3Bhc3N3b3JkJywgJ1hWUCBjcmVkZW50aWFscyByZXF1aXJlZCAodXNlcicgKyB4dnBfc2VwICtcblx0XHRcdFx0XHRcdFx0XHQndGFyZ2V0JyArIHh2cF9zZXAgKyAncGFzc3dvcmQpIC0tIGdvdCBvbmx5ICcgKyB0aGlzLl9yZmJfcGFzc3dvcmQpO1xuXHRcdFx0dGhpcy5fb25QYXNzd29yZFJlcXVpcmVkKHRoaXMpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHZhciB4dnBfYXV0aF9zdHIgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHh2cF9hdXRoWzBdLmxlbmd0aCkgK1xuXHRcdFx0XHRcdFx0XHQgU3RyaW5nLmZyb21DaGFyQ29kZSh4dnBfYXV0aFsxXS5sZW5ndGgpICtcblx0XHRcdFx0XHRcdFx0IHh2cF9hdXRoWzBdICtcblx0XHRcdFx0XHRcdFx0IHh2cF9hdXRoWzFdO1xuXHRcdHRoaXMuX3NvY2suc2VuZF9zdHJpbmcoeHZwX2F1dGhfc3RyKTtcblx0XHR0aGlzLl9yZmJfcGFzc3dvcmQgPSB4dnBfYXV0aC5zbGljZSgyKS5qb2luKHh2cF9zZXApO1xuXHRcdHRoaXMuX3JmYl9hdXRoX3NjaGVtZSA9IDI7XG5cdFx0cmV0dXJuIHRoaXMuX25lZ290aWF0ZV9hdXRoZW50aWNhdGlvbigpO1xuXHR9LFxuXG5cdF9uZWdvdGlhdGVfc3RkX3ZuY19hdXRoOiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHRoaXMuX3JmYl9wYXNzd29yZC5sZW5ndGggPT09IDApIHtcblx0XHRcdC8vIE5vdGlmeSB2aWEgYm90aCBjYWxsYmFja3Mgc2luY2UgaXQncyBraW5kIG9mXG5cdFx0XHQvLyBhbiBSRkIgc3RhdGUgY2hhbmdlIGFuZCBhIFVJIGludGVyZmFjZSBpc3N1ZVxuXHRcdFx0dGhpcy5fdXBkYXRlU3RhdGUoJ3Bhc3N3b3JkJywgJ1Bhc3N3b3JkIFJlcXVpcmVkJyk7XG5cdFx0XHR0aGlzLl9vblBhc3N3b3JkUmVxdWlyZWQodGhpcyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX3NvY2suclF3YWl0KCdhdXRoIGNoYWxsZW5nZScsIDE2KSkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRcdHZhciBjaGFsbGVuZ2UgPSB0aGlzLl9zb2NrLnJRc2hpZnRCeXRlcygxNik7XG5cdFx0dmFyIHJlc3BvbnNlID0gUkZCLmdlbkRFUyh0aGlzLl9yZmJfcGFzc3dvcmQsIGNoYWxsZW5nZSk7XG5cdFx0dGhpcy5fc29jay5zZW5kKHJlc3BvbnNlKTtcblx0XHR0aGlzLl91cGRhdGVTdGF0ZSgnU2VjdXJpdHlSZXN1bHQnKTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSxcblxuXHRfbmVnb3RpYXRlX3RpZ2h0X3R1bm5lbHM6IGZ1bmN0aW9uIChudW1UdW5uZWxzKSB7XG5cdFx0dmFyIGNsaWVudFN1cHBvcnRlZFR1bm5lbFR5cGVzID0ge1xuXHRcdFx0MDogeyB2ZW5kb3I6ICdUR0hUJywgc2lnbmF0dXJlOiAnTk9UVU5ORUwnIH1cblx0XHR9O1xuXHRcdHZhciBzZXJ2ZXJTdXBwb3J0ZWRUdW5uZWxUeXBlcyA9IHt9O1xuXHRcdC8vIHJlY2VpdmUgdHVubmVsIGNhcGFiaWxpdGllc1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbnVtVHVubmVsczsgaSsrKSB7XG5cdFx0XHR2YXIgY2FwX2NvZGUgPSB0aGlzLl9zb2NrLnJRc2hpZnQzMigpO1xuXHRcdFx0dmFyIGNhcF92ZW5kb3IgPSB0aGlzLl9zb2NrLnJRc2hpZnRTdHIoNCk7XG5cdFx0XHR2YXIgY2FwX3NpZ25hdHVyZSA9IHRoaXMuX3NvY2suclFzaGlmdFN0cig4KTtcblx0XHRcdHNlcnZlclN1cHBvcnRlZFR1bm5lbFR5cGVzW2NhcF9jb2RlXSA9IHsgdmVuZG9yOiBjYXBfdmVuZG9yLCBzaWduYXR1cmU6IGNhcF9zaWduYXR1cmUgfTtcblx0XHR9XG5cblx0XHQvLyBjaG9vc2UgdGhlIG5vdHVubmVsIHR5cGVcblx0XHRpZiAoc2VydmVyU3VwcG9ydGVkVHVubmVsVHlwZXNbMF0pIHtcblx0XHRcdGlmIChzZXJ2ZXJTdXBwb3J0ZWRUdW5uZWxUeXBlc1swXS52ZW5kb3IgIT09IGNsaWVudFN1cHBvcnRlZFR1bm5lbFR5cGVzWzBdLnZlbmRvciB8fFxuXHRcdFx0XHRzZXJ2ZXJTdXBwb3J0ZWRUdW5uZWxUeXBlc1swXS5zaWduYXR1cmUgIT09IGNsaWVudFN1cHBvcnRlZFR1bm5lbFR5cGVzWzBdLnNpZ25hdHVyZSkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZmFpbCgnQ2xpZW50XFwncyB0dW5uZWwgdHlwZSBoYWQgdGhlIGluY29ycmVjdCB2ZW5kb3Igb3Igc2lnbmF0dXJlJyk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9zb2NrLnNlbmQoWzAsIDAsIDAsIDBdKTsgIC8vIHVzZSBOT1RVTk5FTFxuXHRcdFx0cmV0dXJuIGZhbHNlOyAvLyB3YWl0IHVudGlsIHdlIHJlY2VpdmUgdGhlIHN1YiBhdXRoIGNvdW50IHRvIGNvbnRpbnVlXG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzLl9mYWlsKCdTZXJ2ZXIgd2FudGVkIHR1bm5lbHMsIGJ1dCBkb2VzblxcJ3Qgc3VwcG9ydCB0aGUgbm90dW5uZWwgdHlwZScpO1xuXHRcdH1cblx0fSxcblxuXHRfbmVnb3RpYXRlX3RpZ2h0X2F1dGg6IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAoIXRoaXMuX3JmYl90aWdodHZuYykgeyAgLy8gZmlyc3QgcGFzcywgZG8gdGhlIHR1bm5lbCBuZWdvdGlhdGlvblxuXHRcdFx0aWYgKHRoaXMuX3NvY2suclF3YWl0KCdudW0gdHVubmVscycsIDQpKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0dmFyIG51bVR1bm5lbHMgPSB0aGlzLl9zb2NrLnJRc2hpZnQzMigpO1xuXHRcdFx0aWYgKG51bVR1bm5lbHMgPiAwICYmIHRoaXMuX3NvY2suclF3YWl0KCd0dW5uZWwgY2FwYWJpbGl0aWVzJywgMTYgKiBudW1UdW5uZWxzLCA0KSkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRcdFx0dGhpcy5fcmZiX3RpZ2h0dm5jID0gdHJ1ZTtcblxuXHRcdFx0aWYgKG51bVR1bm5lbHMgPiAwKSB7XG5cdFx0XHRcdHRoaXMuX25lZ290aWF0ZV90aWdodF90dW5uZWxzKG51bVR1bm5lbHMpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7ICAvLyB3YWl0IHVudGlsIHdlIHJlY2VpdmUgdGhlIHN1YiBhdXRoIHRvIGNvbnRpbnVlXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gc2Vjb25kIHBhc3MsIGRvIHRoZSBzdWItYXV0aCBuZWdvdGlhdGlvblxuXHRcdGlmICh0aGlzLl9zb2NrLnJRd2FpdCgnc3ViIGF1dGggY291bnQnLCA0KSkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHR2YXIgc3ViQXV0aENvdW50ID0gdGhpcy5fc29jay5yUXNoaWZ0MzIoKTtcblx0XHRpZiAodGhpcy5fc29jay5yUXdhaXQoJ3N1YiBhdXRoIGNhcGFiaWxpdGllcycsIDE2ICogc3ViQXV0aENvdW50LCA0KSkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRcdHZhciBjbGllbnRTdXBwb3J0ZWRUeXBlcyA9IHtcblx0XHRcdCdTVERWTk9BVVRIX18nOiAxLFxuXHRcdFx0J1NURFZWTkNBVVRIXyc6IDJcblx0XHR9O1xuXG5cdFx0dmFyIHNlcnZlclN1cHBvcnRlZFR5cGVzID0gW107XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN1YkF1dGhDb3VudDsgaSsrKSB7XG5cdFx0XHR2YXIgY2FwYWJpbGl0aWVzID0gdGhpcy5fc29jay5yUXNoaWZ0U3RyKDEyKTtcblx0XHRcdHNlcnZlclN1cHBvcnRlZFR5cGVzLnB1c2goY2FwYWJpbGl0aWVzKTtcblx0XHR9XG5cblx0XHRkZWJ1ZygnX25lZ290aWF0ZV90aWdodF9hdXRoKCkgfCBjbGllbnRTdXBwb3J0ZWRUeXBlczogJW8nLCBjbGllbnRTdXBwb3J0ZWRUeXBlcyk7XG5cdFx0ZGVidWcoJ19uZWdvdGlhdGVfdGlnaHRfYXV0aCgpIHwgc2VydmVyU3VwcG9ydGVkVHlwZXM6ICVvJywgc2VydmVyU3VwcG9ydGVkVHlwZXMpO1xuXG5cdFx0Zm9yICh2YXIgYXV0aFR5cGUgaW4gY2xpZW50U3VwcG9ydGVkVHlwZXMpIHtcblx0XHRcdGlmIChzZXJ2ZXJTdXBwb3J0ZWRUeXBlcy5pbmRleE9mKGF1dGhUeXBlKSAhPT0gLTEpIHtcblx0XHRcdFx0dGhpcy5fc29jay5zZW5kKFswLCAwLCAwLCBjbGllbnRTdXBwb3J0ZWRUeXBlc1thdXRoVHlwZV1dKTtcblxuXHRcdFx0XHRzd2l0Y2ggKGF1dGhUeXBlKSB7XG5cdFx0XHRcdFx0Y2FzZSAnU1REVk5PQVVUSF9fJzogIC8vIG5vIGF1dGhcblx0XHRcdFx0XHRcdHRoaXMuX3VwZGF0ZVN0YXRlKCdTZWN1cml0eVJlc3VsdCcpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0Y2FzZSAnU1REVlZOQ0FVVEhfJzogLy8gVk5DIGF1dGhcblx0XHRcdFx0XHRcdHRoaXMuX3JmYl9hdXRoX3NjaGVtZSA9IDI7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5faW5pdF9tc2coKTtcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuX2ZhaWwoJ1Vuc3VwcG9ydGVkIHRpbnkgYXV0aCBzY2hlbWU6ICcgKyBhdXRoVHlwZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLl9mYWlsKCdObyBzdXBwb3J0ZWQgc3ViLWF1dGggdHlwZXMhJyk7XG5cdH0sXG5cblx0X25lZ290aWF0ZV9hdXRoZW50aWNhdGlvbjogZnVuY3Rpb24gKCkge1xuXHRcdHN3aXRjaCAodGhpcy5fcmZiX2F1dGhfc2NoZW1lKSB7XG5cdFx0XHRjYXNlIDA6ICAvLyBjb25uZWN0aW9uIGZhaWxlZFxuXHRcdFx0XHRpZiAodGhpcy5fc29jay5yUXdhaXQoJ2F1dGggcmVhc29uJywgNCkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHRcdHZhciBzdHJsZW4gPSB0aGlzLl9zb2NrLnJRc2hpZnQzMigpO1xuXHRcdFx0XHR2YXIgcmVhc29uID0gdGhpcy5fc29jay5yUXNoaWZ0U3RyKHN0cmxlbik7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9mYWlsKCdBdXRoIGZhaWx1cmU6ICcgKyByZWFzb24pO1xuXG5cdFx0XHRjYXNlIDE6ICAvLyBubyBhdXRoXG5cdFx0XHRcdGlmICh0aGlzLl9yZmJfdmVyc2lvbiA+PSAzLjgpIHtcblx0XHRcdFx0XHR0aGlzLl91cGRhdGVTdGF0ZSgnU2VjdXJpdHlSZXN1bHQnKTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLl91cGRhdGVTdGF0ZSgnQ2xpZW50SW5pdGlhbGlzYXRpb24nLCAnTm8gYXV0aCByZXF1aXJlZCcpO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5faW5pdF9tc2coKTtcblxuXHRcdFx0Y2FzZSAyMjogIC8vIFhWUCBhdXRoXG5cdFx0XHRcdHJldHVybiB0aGlzLl9uZWdvdGlhdGVfeHZwX2F1dGgoKTtcblxuXHRcdFx0Y2FzZSAyOiAgLy8gVk5DIGF1dGhlbnRpY2F0aW9uXG5cdFx0XHRcdHJldHVybiB0aGlzLl9uZWdvdGlhdGVfc3RkX3ZuY19hdXRoKCk7XG5cblx0XHRcdGNhc2UgMTY6ICAvLyBUaWdodFZOQyBTZWN1cml0eSBUeXBlXG5cdFx0XHRcdHJldHVybiB0aGlzLl9uZWdvdGlhdGVfdGlnaHRfYXV0aCgpO1xuXG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5fZmFpbCgnVW5zdXBwb3J0ZWQgYXV0aCBzY2hlbWU6ICcgKyB0aGlzLl9yZmJfYXV0aF9zY2hlbWUpO1xuXHRcdH1cblx0fSxcblxuXHRfaGFuZGxlX3NlY3VyaXR5X3Jlc3VsdDogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLl9zb2NrLnJRd2FpdCgnVk5DIGF1dGggcmVzcG9uc2UgJywgNCkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0c3dpdGNoICh0aGlzLl9zb2NrLnJRc2hpZnQzMigpKSB7XG5cdFx0XHRjYXNlIDA6ICAvLyBPS1xuXHRcdFx0XHR0aGlzLl91cGRhdGVTdGF0ZSgnQ2xpZW50SW5pdGlhbGlzYXRpb24nLCAnQXV0aGVudGljYXRpb24gT0snKTtcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2luaXRfbXNnKCk7XG5cdFx0XHRjYXNlIDE6ICAvLyBmYWlsZWRcblx0XHRcdFx0aWYgKHRoaXMuX3JmYl92ZXJzaW9uID49IDMuOCkge1xuXHRcdFx0XHRcdHZhciBsZW5ndGggPSB0aGlzLl9zb2NrLnJRc2hpZnQzMigpO1xuXHRcdFx0XHRcdGlmICh0aGlzLl9zb2NrLnJRd2FpdCgnU2VjdXJpdHlSZXN1bHQgcmVhc29uJywgbGVuZ3RoLCA4KSkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdFx0XHR2YXIgcmVhc29uID0gdGhpcy5fc29jay5yUXNoaWZ0U3RyKGxlbmd0aCk7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuX2ZhaWwocmVhc29uKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fZmFpbCgnQXV0aGVudGljYXRpb24gZmFpbHVyZScpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2ZhaWwoJ1RvbyBtYW55IGF1dGggYXR0ZW1wdHMnKTtcblx0XHR9XG5cdH0sXG5cblx0X25lZ290aWF0ZV9zZXJ2ZXJfaW5pdDogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLl9zb2NrLnJRd2FpdCgnc2VydmVyIGluaXRpYWxpemF0aW9uJywgMjQpKSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdFx0LyogU2NyZWVuIHNpemUgKi9cblx0XHR0aGlzLl9mYl93aWR0aCAgPSB0aGlzLl9zb2NrLnJRc2hpZnQxNigpO1xuXHRcdHRoaXMuX2ZiX2hlaWdodCA9IHRoaXMuX3NvY2suclFzaGlmdDE2KCk7XG5cblx0XHQvKiBQSVhFTF9GT1JNQVQgKi9cblx0XHR2YXIgYnBwICAgICAgICAgPSB0aGlzLl9zb2NrLnJRc2hpZnQ4KCk7XG5cdFx0dmFyIGRlcHRoICAgICAgID0gdGhpcy5fc29jay5yUXNoaWZ0OCgpO1xuXHRcdHZhciBiaWdfZW5kaWFuICA9IHRoaXMuX3NvY2suclFzaGlmdDgoKTtcblx0XHR2YXIgdHJ1ZV9jb2xvciAgPSB0aGlzLl9zb2NrLnJRc2hpZnQ4KCk7XG5cblx0XHR2YXIgcmVkX21heCAgICAgPSB0aGlzLl9zb2NrLnJRc2hpZnQxNigpO1xuXHRcdHZhciBncmVlbl9tYXggICA9IHRoaXMuX3NvY2suclFzaGlmdDE2KCk7XG5cdFx0dmFyIGJsdWVfbWF4ICAgID0gdGhpcy5fc29jay5yUXNoaWZ0MTYoKTtcblx0XHR2YXIgcmVkX3NoaWZ0ICAgPSB0aGlzLl9zb2NrLnJRc2hpZnQ4KCk7XG5cdFx0dmFyIGdyZWVuX3NoaWZ0ID0gdGhpcy5fc29jay5yUXNoaWZ0OCgpO1xuXHRcdHZhciBibHVlX3NoaWZ0ICA9IHRoaXMuX3NvY2suclFzaGlmdDgoKTtcblx0XHR0aGlzLl9zb2NrLnJRc2tpcEJ5dGVzKDMpOyAgLy8gcGFkZGluZ1xuXG5cdFx0Ly8gTkIoZGlyZWN0eG1hbjEyKTogd2UgZG9uJ3Qgd2FudCB0byBjYWxsIGFueSBjYWxsYmFja3Mgb3IgcHJpbnQgbWVzc2FnZXMgdW50aWxcblx0XHQvLyAgICAgICAgICAgICAgICAgICAqYWZ0ZXIqIHdlJ3JlIHBhc3QgdGhlIHBvaW50IHdoZXJlIHdlIGNvdWxkIGJhY2t0cmFja1xuXG5cdFx0LyogQ29ubmVjdGlvbiBuYW1lL3RpdGxlICovXG5cdFx0dmFyIG5hbWVfbGVuZ3RoID0gdGhpcy5fc29jay5yUXNoaWZ0MzIoKTtcblx0XHRpZiAodGhpcy5fc29jay5yUXdhaXQoJ3NlcnZlciBpbml0IG5hbWUnLCBuYW1lX2xlbmd0aCwgMjQpKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdHRoaXMuX2ZiX25hbWUgPSBVdGlsLmRlY29kZVVURjgodGhpcy5fc29jay5yUXNoaWZ0U3RyKG5hbWVfbGVuZ3RoKSk7XG5cblx0XHRpZiAodGhpcy5fcmZiX3RpZ2h0dm5jKSB7XG5cdFx0XHRpZiAodGhpcy5fc29jay5yUXdhaXQoJ1RpZ2h0Vk5DIGV4dGVuZGVkIHNlcnZlciBpbml0IGhlYWRlcicsIDgsIDI0ICsgbmFtZV9sZW5ndGgpKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0Ly8gSW4gVGlnaHRWTkMgbW9kZSwgU2VydmVySW5pdCBtZXNzYWdlIGlzIGV4dGVuZGVkXG5cdFx0XHR2YXIgbnVtU2VydmVyTWVzc2FnZXMgPSB0aGlzLl9zb2NrLnJRc2hpZnQxNigpO1xuXHRcdFx0dmFyIG51bUNsaWVudE1lc3NhZ2VzID0gdGhpcy5fc29jay5yUXNoaWZ0MTYoKTtcblx0XHRcdHZhciBudW1FbmNvZGluZ3MgPSB0aGlzLl9zb2NrLnJRc2hpZnQxNigpO1xuXHRcdFx0dGhpcy5fc29jay5yUXNraXBCeXRlcygyKTsgIC8vIHBhZGRpbmdcblxuXHRcdFx0dmFyIHRvdGFsTWVzc2FnZXNMZW5ndGggPSAobnVtU2VydmVyTWVzc2FnZXMgKyBudW1DbGllbnRNZXNzYWdlcyArIG51bUVuY29kaW5ncykgKiAxNjtcblx0XHRcdGlmICh0aGlzLl9zb2NrLnJRd2FpdCgnVGlnaHRWTkMgZXh0ZW5kZWQgc2VydmVyIGluaXQgaGVhZGVyJywgdG90YWxNZXNzYWdlc0xlbmd0aCwgMzIgKyBuYW1lX2xlbmd0aCkpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgaTtcblx0XHRcdGZvciAoaSA9IDA7IGkgPCBudW1TZXJ2ZXJNZXNzYWdlczsgaSsrKSB7XG5cdFx0XHRcdC8vIFRPRE86IGh0dHBzOi8vZ2l0aHViLmNvbS9rYW5ha2Evbm9WTkMvaXNzdWVzLzQ0MFxuXHRcdFx0XHR0aGlzLl9zb2NrLnJRc2hpZnRTdHIoMTYpO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgbnVtQ2xpZW50TWVzc2FnZXM7IGkrKykge1xuXHRcdFx0XHR0aGlzLl9zb2NrLnJRc2hpZnRTdHIoMTYpO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgbnVtRW5jb2RpbmdzOyBpKyspIHtcblx0XHRcdFx0dGhpcy5fc29jay5yUXNoaWZ0U3RyKDE2KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBOQihkaXJlY3R4bWFuMTIpOiB0aGVzZSBhcmUgZG93biBoZXJlIHNvIHRoYXQgd2UgZG9uJ3QgcnVuIHRoZW0gbXVsdGlwbGUgdGltZXNcblx0XHQvLyAgICAgICAgICAgICAgICAgICBpZiB3ZSBiYWNrdHJhY2tcblx0XHRkZWJ1ZygnX25lZ290aWF0ZV9zZXJ2ZXJfaW5pdCgpIHwgc2NyZWVuOiAnICsgdGhpcy5fZmJfd2lkdGggKyAneCcgKyB0aGlzLl9mYl9oZWlnaHQgK1xuXHRcdFx0XHRcdCcsIGJwcDogJyArIGJwcCArICcsIGRlcHRoOiAnICsgZGVwdGggK1xuXHRcdFx0XHRcdCcsIGJpZ19lbmRpYW46ICcgKyBiaWdfZW5kaWFuICtcblx0XHRcdFx0XHQnLCB0cnVlX2NvbG9yOiAnICsgdHJ1ZV9jb2xvciArXG5cdFx0XHRcdFx0JywgcmVkX21heDogJyArIHJlZF9tYXggK1xuXHRcdFx0XHRcdCcsIGdyZWVuX21heDogJyArIGdyZWVuX21heCArXG5cdFx0XHRcdFx0JywgYmx1ZV9tYXg6ICcgKyBibHVlX21heCArXG5cdFx0XHRcdFx0JywgcmVkX3NoaWZ0OiAnICsgcmVkX3NoaWZ0ICtcblx0XHRcdFx0XHQnLCBncmVlbl9zaGlmdDogJyArIGdyZWVuX3NoaWZ0ICtcblx0XHRcdFx0XHQnLCBibHVlX3NoaWZ0OiAnICsgYmx1ZV9zaGlmdCk7XG5cblx0XHRpZiAoYmlnX2VuZGlhbiAhPT0gMCkge1xuXHRcdFx0ZGVidWdlcnJvcignX25lZ290aWF0ZV9zZXJ2ZXJfaW5pdCgpIHwgc2VydmVyIG5hdGl2ZSBlbmRpYW4gaXMgbm90IGxpdHRsZSBlbmRpYW4nKTtcblx0XHR9XG5cblx0XHRpZiAocmVkX3NoaWZ0ICE9PSAxNikge1xuXHRcdFx0ZGVidWdlcnJvcignX25lZ290aWF0ZV9zZXJ2ZXJfaW5pdCgpIHwgc2VydmVyIG5hdGl2ZSByZWQtc2hpZnQgaXMgbm90IDE2Jyk7XG5cdFx0fVxuXG5cdFx0aWYgKGJsdWVfc2hpZnQgIT09IDApIHtcblx0XHRcdGRlYnVnZXJyb3IoJ19uZWdvdGlhdGVfc2VydmVyX2luaXQoKSB8IHNlcnZlciBuYXRpdmUgYmx1ZS1zaGlmdCBpcyBub3QgMCcpO1xuXHRcdH1cblxuXHRcdC8vIHdlJ3JlIHBhc3QgdGhlIHBvaW50IHdoZXJlIHdlIGNvdWxkIGJhY2t0cmFjaywgc28gaXQncyBzYWZlIHRvIGNhbGwgdGhpc1xuXHRcdHRoaXMuX29uRGVza3RvcE5hbWUodGhpcywgdGhpcy5fZmJfbmFtZSk7XG5cblx0XHRpZiAodGhpcy5fdHJ1ZV9jb2xvciAmJiB0aGlzLl9mYl9uYW1lID09PSAnSW50ZWwocikgQU1UIEtWTScpIHtcblx0XHRcdGRlYnVnZXJyb3IoJ19uZWdvdGlhdGVfc2VydmVyX2luaXQoKSB8IEludGVsIEFNVCBLVk0gb25seSBzdXBwb3J0cyA4LzE2IGJpdCBkZXB0aHMsIGRpc2FibGluZyB0cnVlIGNvbG9yJyk7XG5cdFx0XHR0aGlzLl90cnVlX2NvbG9yID0gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dGhpcy5fZGlzcGxheS5zZXRfdHJ1ZV9jb2xvcih0aGlzLl90cnVlX2NvbG9yKTtcblx0XHR0aGlzLl9kaXNwbGF5LnJlc2l6ZSh0aGlzLl9mYl93aWR0aCwgdGhpcy5fZmJfaGVpZ2h0KTtcblx0XHR0aGlzLl9vbkZCUmVzaXplKHRoaXMsIHRoaXMuX2ZiX3dpZHRoLCB0aGlzLl9mYl9oZWlnaHQpO1xuXHRcdHRoaXMuX2tleWJvYXJkLmdyYWIoKTtcblx0XHR0aGlzLl9tb3VzZS5ncmFiKCk7XG5cblx0XHRpZiAodGhpcy5fdHJ1ZV9jb2xvcikge1xuXHRcdFx0dGhpcy5fZmJfQnBwID0gNDtcblx0XHRcdHRoaXMuX2ZiX2RlcHRoID0gMztcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fZmJfQnBwID0gMTtcblx0XHRcdHRoaXMuX2ZiX2RlcHRoID0gMTtcblx0XHR9XG5cblx0XHR2YXIgcmVzcG9uc2UgPSBSRkIubWVzc2FnZXMucGl4ZWxGb3JtYXQodGhpcy5fZmJfQnBwLCB0aGlzLl9mYl9kZXB0aCwgdGhpcy5fdHJ1ZV9jb2xvcik7XG5cdFx0cmVzcG9uc2UgPSByZXNwb25zZS5jb25jYXQoXG5cdFx0XHRcdFx0XHRSRkIubWVzc2FnZXMuY2xpZW50RW5jb2RpbmdzKHRoaXMuX2VuY29kaW5ncywgdGhpcy5fbG9jYWxfY3Vyc29yLCB0aGlzLl90cnVlX2NvbG9yKSk7XG5cdFx0cmVzcG9uc2UgPSByZXNwb25zZS5jb25jYXQoXG5cdFx0XHRcdFx0XHRSRkIubWVzc2FnZXMuZmJVcGRhdGVSZXF1ZXN0cyh0aGlzLl9kaXNwbGF5LmdldENsZWFuRGlydHlSZXNldCgpLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuX2ZiX3dpZHRoLCB0aGlzLl9mYl9oZWlnaHQpKTtcblxuXHRcdHRoaXMuX3RpbWluZy5mYnVfcnRfc3RhcnQgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuXHRcdHRoaXMuX3RpbWluZy5waXhlbHMgPSAwO1xuXHRcdHRoaXMuX3NvY2suc2VuZChyZXNwb25zZSk7XG5cblx0XHR0aGlzLl9jaGVja0V2ZW50cygpO1xuXG5cdFx0dGhpcy5fdXBkYXRlU3RhdGUoJ25vcm1hbCcsICdDb25uZWN0ZWQgdG86ICcgKyB0aGlzLl9mYl9uYW1lKTtcblx0fSxcblxuXHRfaW5pdF9tc2c6IGZ1bmN0aW9uICgpIHtcblx0XHRzd2l0Y2ggKHRoaXMuX3JmYl9zdGF0ZSkge1xuXHRcdFx0Y2FzZSAnUHJvdG9jb2xWZXJzaW9uJzpcblx0XHRcdFx0cmV0dXJuIHRoaXMuX25lZ290aWF0ZV9wcm90b2NvbF92ZXJzaW9uKCk7XG5cblx0XHRcdGNhc2UgJ1NlY3VyaXR5Jzpcblx0XHRcdFx0cmV0dXJuIHRoaXMuX25lZ290aWF0ZV9zZWN1cml0eSgpO1xuXG5cdFx0XHRjYXNlICdBdXRoZW50aWNhdGlvbic6XG5cdFx0XHRcdHJldHVybiB0aGlzLl9uZWdvdGlhdGVfYXV0aGVudGljYXRpb24oKTtcblxuXHRcdFx0Y2FzZSAnU2VjdXJpdHlSZXN1bHQnOlxuXHRcdFx0XHRyZXR1cm4gdGhpcy5faGFuZGxlX3NlY3VyaXR5X3Jlc3VsdCgpO1xuXG5cdFx0XHRjYXNlICdDbGllbnRJbml0aWFsaXNhdGlvbic6XG5cdFx0XHRcdHRoaXMuX3NvY2suc2VuZChbdGhpcy5fc2hhcmVkID8gMSA6IDBdKTsgLy8gQ2xpZW50SW5pdGlhbGlzYXRpb25cblx0XHRcdFx0dGhpcy5fdXBkYXRlU3RhdGUoJ1NlcnZlckluaXRpYWxpc2F0aW9uJywgJ0F1dGhlbnRpY2F0aW9uIE9LJyk7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXG5cdFx0XHRjYXNlICdTZXJ2ZXJJbml0aWFsaXNhdGlvbic6XG5cdFx0XHRcdHJldHVybiB0aGlzLl9uZWdvdGlhdGVfc2VydmVyX2luaXQoKTtcblx0XHR9XG5cdH0sXG5cblx0X2hhbmRsZV9zZXRfY29sb3VyX21hcF9tc2c6IGZ1bmN0aW9uICgpIHtcblx0XHRkZWJ1ZygnX2hhbmRsZV9zZXRfY29sb3VyX21hcF9tc2coKScpO1xuXG5cdFx0dGhpcy5fc29jay5yUXNraXA4KCk7ICAvLyBQYWRkaW5nXG5cblx0XHR2YXIgZmlyc3RfY29sb3VyID0gdGhpcy5fc29jay5yUXNoaWZ0MTYoKTtcblx0XHR2YXIgbnVtX2NvbG91cnMgPSB0aGlzLl9zb2NrLnJRc2hpZnQxNigpO1xuXHRcdGlmICh0aGlzLl9zb2NrLnJRd2FpdCgnU2V0Q29sb3JNYXBFbnRyaWVzJywgbnVtX2NvbG91cnMgKiA2LCA2KSkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRcdGZvciAodmFyIGMgPSAwOyBjIDwgbnVtX2NvbG91cnM7IGMrKykge1xuXHRcdFx0dmFyIHJlZCA9IHBhcnNlSW50KHRoaXMuX3NvY2suclFzaGlmdDE2KCkgLyAyNTYsIDEwKTtcblx0XHRcdHZhciBncmVlbiA9IHBhcnNlSW50KHRoaXMuX3NvY2suclFzaGlmdDE2KCkgLyAyNTYsIDEwKTtcblx0XHRcdHZhciBibHVlID0gcGFyc2VJbnQodGhpcy5fc29jay5yUXNoaWZ0MTYoKSAvIDI1NiwgMTApO1xuXHRcdFx0dGhpcy5fZGlzcGxheS5zZXRfY29sb3VyTWFwKFtibHVlLCBncmVlbiwgcmVkXSwgZmlyc3RfY29sb3VyICsgYyk7XG5cdFx0fVxuXHRcdGRlYnVnKCdfaGFuZGxlX3NldF9jb2xvdXJfbWFwX21zZygpIHwgY29sb3VyTWFwOiAnICsgdGhpcy5fZGlzcGxheS5nZXRfY29sb3VyTWFwKCkpO1xuXHRcdGRlYnVnKCdfaGFuZGxlX3NldF9jb2xvdXJfbWFwX21zZygpIHwgcmVnaXN0ZXJlZCAnICsgbnVtX2NvbG91cnMgKyAnIGNvbG91ck1hcCBlbnRyaWVzJyk7XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSxcblxuXHRfaGFuZGxlX3NlcnZlcl9jdXRfdGV4dDogZnVuY3Rpb24gKCkge1xuXHRcdGRlYnVnKCdfaGFuZGxlX3NlcnZlcl9jdXRfdGV4dCgpJyk7XG5cblx0XHRpZiAodGhpcy5fc29jay5yUXdhaXQoJ1NlcnZlckN1dFRleHQgaGVhZGVyJywgNywgMSkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0dGhpcy5fc29jay5yUXNraXBCeXRlcygzKTsgIC8vIFBhZGRpbmdcblx0XHR2YXIgbGVuZ3RoID0gdGhpcy5fc29jay5yUXNoaWZ0MzIoKTtcblx0XHRpZiAodGhpcy5fc29jay5yUXdhaXQoJ1NlcnZlckN1dFRleHQnLCBsZW5ndGgsIDgpKSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdFx0dmFyIHRleHQgPSB0aGlzLl9zb2NrLnJRc2hpZnRTdHIobGVuZ3RoKTtcblx0XHR0aGlzLl9vbkNsaXBib2FyZCh0aGlzLCB0ZXh0KTtcblxuXHRcdHJldHVybiB0cnVlO1xuXHR9LFxuXG5cdF9oYW5kbGVfeHZwX21zZzogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLl9zb2NrLnJRd2FpdCgnWFZQIHZlcnNpb24gYW5kIG1lc3NhZ2UnLCAzLCAxKSkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHR0aGlzLl9zb2NrLnJRc2tpcDgoKTsgIC8vIFBhZGRpbmdcblx0XHR2YXIgeHZwX3ZlciA9IHRoaXMuX3NvY2suclFzaGlmdDgoKTtcblx0XHR2YXIgeHZwX21zZyA9IHRoaXMuX3NvY2suclFzaGlmdDgoKTtcblxuXHRcdHN3aXRjaCAoeHZwX21zZykge1xuXHRcdFx0Y2FzZSAwOiAgLy8gWFZQX0ZBSUxcblx0XHRcdFx0dGhpcy5fdXBkYXRlU3RhdGUodGhpcy5fcmZiX3N0YXRlLCAnT3BlcmF0aW9uIEZhaWxlZCcpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMTogIC8vIFhWUF9JTklUXG5cdFx0XHRcdHRoaXMuX3JmYl94dnBfdmVyID0geHZwX3Zlcjtcblx0XHRcdFx0ZGVidWcoJ19oYW5kbGVfeHZwX21zZygpIHwgWFZQIGV4dGVuc2lvbnMgZW5hYmxlZCAodmVyc2lvbiAnICsgdGhpcy5fcmZiX3h2cF92ZXIgKyAnKScpO1xuXHRcdFx0XHR0aGlzLl9vblh2cEluaXQodGhpcy5fcmZiX3h2cF92ZXIpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHRoaXMuX2ZhaWwoJ0Rpc2Nvbm5lY3RlZDogaWxsZWdhbCBzZXJ2ZXIgWFZQIG1lc3NhZ2UgJyArIHh2cF9tc2cpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSxcblxuXHRfbm9ybWFsX21zZzogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBtc2dfdHlwZTtcblxuXHRcdGlmICh0aGlzLl9GQlUucmVjdHMgPiAwKSB7XG5cdFx0XHRtc2dfdHlwZSA9IDA7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1zZ190eXBlID0gdGhpcy5fc29jay5yUXNoaWZ0OCgpO1xuXHRcdH1cblxuXHRcdHN3aXRjaCAobXNnX3R5cGUpIHtcblx0XHRcdGNhc2UgMDogIC8vIEZyYW1lYnVmZmVyVXBkYXRlXG5cdFx0XHRcdHZhciByZXQgPSB0aGlzLl9mcmFtZWJ1ZmZlclVwZGF0ZSgpO1xuXHRcdFx0XHRpZiAocmV0KSB7XG5cdFx0XHRcdFx0dGhpcy5fc29jay5zZW5kKFJGQi5tZXNzYWdlcy5mYlVwZGF0ZVJlcXVlc3RzKFxuXHRcdFx0XHRcdFx0dGhpcy5fZGlzcGxheS5nZXRDbGVhbkRpcnR5UmVzZXQoKSxcblx0XHRcdFx0XHRcdHRoaXMuX2ZiX3dpZHRoLFxuXHRcdFx0XHRcdFx0dGhpcy5fZmJfaGVpZ2h0XG5cdFx0XHRcdFx0KSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHJldDtcblxuXHRcdFx0Y2FzZSAxOiAgLy8gU2V0Q29sb3JNYXBFbnRyaWVzXG5cdFx0XHRcdHJldHVybiB0aGlzLl9oYW5kbGVfc2V0X2NvbG91cl9tYXBfbXNnKCk7XG5cblx0XHRcdGNhc2UgMjogIC8vIEJlbGxcblx0XHRcdFx0ZGVidWcoJ19ub3JtYWxfbXNnKCkgfCBiZWxsJyk7XG5cdFx0XHRcdHRoaXMuX29uQmVsbCh0aGlzKTtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cblx0XHRcdGNhc2UgMzogIC8vIFNlcnZlckN1dFRleHRcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2hhbmRsZV9zZXJ2ZXJfY3V0X3RleHQoKTtcblxuXHRcdFx0Y2FzZSAyNTA6ICAvLyBYVlBcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2hhbmRsZV94dnBfbXNnKCk7XG5cblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdC8vIElmIG9uVW5rbm93bk1lc3NhZ2VUeXBlIGlzIG5vdCBzZXQgdGhlbiBqdXN0IGZhaWwuXG5cdFx0XHRcdGlmICghIHRoaXMuX29uVW5rbm93bk1lc3NhZ2VUeXBlKSB7XG5cdFx0XHRcdFx0dGhpcy5fZmFpbCgnRGlzY29ubmVjdGVkOiBpbGxlZ2FsIHNlcnZlciBtZXNzYWdlIHR5cGUgJyArIG1zZ190eXBlKTtcblx0XHRcdFx0XHRkZWJ1Z2Vycm9yKCdfbm9ybWFsX21zZygpIHwgc29jay5yUXNsaWNlKDAsIDMwKTogJyArIHRoaXMuX3NvY2suclFzbGljZSgwLCAzMCkpO1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIElmIG9uVW5rbm93bk1lc3NhZ2VUeXBlIGlzIHNldCB0aGVuIGNhbGwgaXQuIElmIHRoZSBhcHAgZG9lcyBub3QgYWNjZXB0XG5cdFx0XHRcdC8vIHRoZSB1bmtub3duIG1lc3NhZ2UgdHlwZSBpdCBtdXN0IHRocm93IGFuIGVycm9yLlxuXHRcdFx0XHQvLyBUaGUgbGlzdGVuZXIgbXVzdCByZXR1cm4gZmFsc2UgaWYgbW9yZSBieXRlcyBhcmUgbmVlZGVkLFxuXHRcdFx0XHQvLyB0cnVlIG90aGVyd2lzZS5cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0ZGVidWcoJ19ub3JtYWxfbXNnKCkgfCBwYXNzaW5nIHVua25vd24gbWVzc2FnZSB0eXBlICcgKyBtc2dfdHlwZSArICcgdG8gdGhlIG9uVW5rbm93bk1lc3NhZ2VUeXBlIGxpc3RlbmVyJyk7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLl9vblVua25vd25NZXNzYWdlVHlwZShtc2dfdHlwZSwgdGhpcy5fc29jayk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhdGNoKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRkZWJ1Z2Vycm9yKCdfbm9ybWFsX21zZygpIHwgZXJyb3IgY2F0Y2hlZCBkdXJpbmcgb25Vbmtub3duTWVzc2FnZVR5cGU6ICVvJywgZXJyb3IpO1xuXHRcdFx0XHRcdFx0dGhpcy5fZmFpbCgnRGlzY29ubmVjdGVkOiBpbnZhbGlkIGN1c3RvbSBzZXJ2ZXIgbWVzc2FnZSB0eXBlICcgKyBtc2dfdHlwZSk7XG5cdFx0XHRcdFx0XHRkZWJ1Z2Vycm9yKCdfbm9ybWFsX21zZygpIHwgc29jay5yUXNsaWNlKDAsIDMwKTogJyArIHRoaXMuX3NvY2suclFzbGljZSgwLCAzMCkpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdF9mcmFtZWJ1ZmZlclVwZGF0ZTogZnVuY3Rpb24gKCkge1xuXHRcdHZhciByZXQgPSB0cnVlO1xuXHRcdHZhciBub3c7XG5cblx0XHRpZiAodGhpcy5fRkJVLnJlY3RzID09PSAwKSB7XG5cdFx0XHRpZiAodGhpcy5fc29jay5yUXdhaXQoJ0ZCVSBoZWFkZXInLCAzLCAxKSkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdHRoaXMuX3NvY2suclFza2lwOCgpOyAgLy8gUGFkZGluZ1xuXHRcdFx0dGhpcy5fRkJVLnJlY3RzID0gdGhpcy5fc29jay5yUXNoaWZ0MTYoKTtcblx0XHRcdHRoaXMuX0ZCVS5ieXRlcyA9IDA7XG5cdFx0XHR0aGlzLl90aW1pbmcuY3VyX2ZidSA9IDA7XG5cdFx0XHRpZiAodGhpcy5fdGltaW5nLmZidV9ydF9zdGFydCA+IDApIHtcblx0XHRcdFx0bm93ID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcblx0XHRcdFx0ZGVidWcoJ19mcmFtZWJ1ZmZlclVwZGF0ZSgpIHwgZmlyc3QgRkJVIGxhdGVuY3k6ICcgKyAobm93IC0gdGhpcy5fdGltaW5nLmZidV9ydF9zdGFydCkpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHdoaWxlICh0aGlzLl9GQlUucmVjdHMgPiAwKSB7XG5cdFx0XHRpZiAodGhpcy5fcmZiX3N0YXRlICE9PSAnbm9ybWFsJykgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRcdFx0aWYgKHRoaXMuX3NvY2suclF3YWl0KCdGQlUnLCB0aGlzLl9GQlUuYnl0ZXMpKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0aWYgKHRoaXMuX0ZCVS5ieXRlcyA9PT0gMCkge1xuXHRcdFx0XHRpZiAodGhpcy5fc29jay5yUXdhaXQoJ3JlY3QgaGVhZGVyJywgMTIpKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0XHQvKiBOZXcgRnJhbWVidWZmZXJVcGRhdGUgKi9cblxuXHRcdFx0XHR2YXIgaGRyID0gdGhpcy5fc29jay5yUXNoaWZ0Qnl0ZXMoMTIpO1xuXHRcdFx0XHR0aGlzLl9GQlUueCAgICAgICAgPSAoaGRyWzBdIDw8IDgpICsgaGRyWzFdO1xuXHRcdFx0XHR0aGlzLl9GQlUueSAgICAgICAgPSAoaGRyWzJdIDw8IDgpICsgaGRyWzNdO1xuXHRcdFx0XHR0aGlzLl9GQlUud2lkdGggICAgPSAoaGRyWzRdIDw8IDgpICsgaGRyWzVdO1xuXHRcdFx0XHR0aGlzLl9GQlUuaGVpZ2h0ICAgPSAoaGRyWzZdIDw8IDgpICsgaGRyWzddO1xuXHRcdFx0XHR0aGlzLl9GQlUuZW5jb2RpbmcgPSBwYXJzZUludCgoaGRyWzhdIDw8IDI0KSArIChoZHJbOV0gPDwgMTYpICtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdChoZHJbMTBdIDw8IDgpICsgaGRyWzExXSwgMTApO1xuXG5cdFx0XHRcdHRoaXMuX29uRkJVUmVjZWl2ZSh0aGlzLFxuXHRcdFx0XHRcdHsneCc6IHRoaXMuX0ZCVS54LCAneSc6IHRoaXMuX0ZCVS55LFxuXHRcdFx0XHRcdCAnd2lkdGgnOiB0aGlzLl9GQlUud2lkdGgsICdoZWlnaHQnOiB0aGlzLl9GQlUuaGVpZ2h0LFxuXHRcdFx0XHRcdCAnZW5jb2RpbmcnOiB0aGlzLl9GQlUuZW5jb2RpbmcsXG5cdFx0XHRcdFx0ICdlbmNvZGluZ05hbWUnOiB0aGlzLl9lbmNOYW1lc1t0aGlzLl9GQlUuZW5jb2RpbmddfSk7XG5cblx0XHRcdFx0aWYgKCF0aGlzLl9lbmNOYW1lc1t0aGlzLl9GQlUuZW5jb2RpbmddKSB7XG5cdFx0XHRcdFx0dGhpcy5fZmFpbCgnRGlzY29ubmVjdGVkOiB1bnN1cHBvcnRlZCBlbmNvZGluZyAnICtcblx0XHRcdFx0XHRcdFx0XHQgdGhpcy5fRkJVLmVuY29kaW5nKTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fdGltaW5nLmxhc3RfZmJ1ID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcblxuXHRcdFx0cmV0ID0gdGhpcy5fZW5jSGFuZGxlcnNbdGhpcy5fRkJVLmVuY29kaW5nXSgpO1xuXG5cdFx0XHRub3cgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuXHRcdFx0dGhpcy5fdGltaW5nLmN1cl9mYnUgKz0gKG5vdyAtIHRoaXMuX3RpbWluZy5sYXN0X2ZidSk7XG5cblx0XHRcdGlmIChyZXQpIHtcblx0XHRcdFx0dGhpcy5fZW5jU3RhdHNbdGhpcy5fRkJVLmVuY29kaW5nXVswXSsrO1xuXHRcdFx0XHR0aGlzLl9lbmNTdGF0c1t0aGlzLl9GQlUuZW5jb2RpbmddWzFdKys7XG5cdFx0XHRcdHRoaXMuX3RpbWluZy5waXhlbHMgKz0gdGhpcy5fRkJVLndpZHRoICogdGhpcy5fRkJVLmhlaWdodDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuX3RpbWluZy5waXhlbHMgPj0gKHRoaXMuX2ZiX3dpZHRoICogdGhpcy5fZmJfaGVpZ2h0KSkge1xuXHRcdFx0XHRpZiAoKHRoaXMuX0ZCVS53aWR0aCA9PT0gdGhpcy5fZmJfd2lkdGggJiYgdGhpcy5fRkJVLmhlaWdodCA9PT0gdGhpcy5fZmJfaGVpZ2h0KSB8fFxuXHRcdFx0XHRcdHRoaXMuX3RpbWluZy5mYnVfcnRfc3RhcnQgPiAwKSB7XG5cdFx0XHRcdFx0dGhpcy5fdGltaW5nLmZ1bGxfZmJ1X3RvdGFsICs9IHRoaXMuX3RpbWluZy5jdXJfZmJ1O1xuXHRcdFx0XHRcdHRoaXMuX3RpbWluZy5mdWxsX2ZidV9jbnQrKztcblx0XHRcdFx0XHRkZWJ1ZygnX2ZyYW1lYnVmZmVyVXBkYXRlKCkgfCB0aW1pbmcgb2YgZnVsbCBGQlUsIGN1cnI6ICcgK1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3RpbWluZy5jdXJfZmJ1ICsgJywgdG90YWw6ICcgK1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3RpbWluZy5mdWxsX2ZidV90b3RhbCArICcsIGNudDogJyArXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fdGltaW5nLmZ1bGxfZmJ1X2NudCArICcsIGF2ZzogJyArXG5cdFx0XHRcdFx0XHRcdFx0KHRoaXMuX3RpbWluZy5mdWxsX2ZidV90b3RhbCAvIHRoaXMuX3RpbWluZy5mdWxsX2ZidV9jbnQpKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh0aGlzLl90aW1pbmcuZmJ1X3J0X3N0YXJ0ID4gMCkge1xuXHRcdFx0XHRcdHZhciBmYnVfcnRfZGlmZiA9IG5vdyAtIHRoaXMuX3RpbWluZy5mYnVfcnRfc3RhcnQ7XG5cdFx0XHRcdFx0dGhpcy5fdGltaW5nLmZidV9ydF90b3RhbCArPSBmYnVfcnRfZGlmZjtcblx0XHRcdFx0XHR0aGlzLl90aW1pbmcuZmJ1X3J0X2NudCsrO1xuXHRcdFx0XHRcdGRlYnVnKCdfZnJhbWVidWZmZXJVcGRhdGUoKSB8IGZ1bGwgRkJVIHJvdW5kLXRyaXAsIGN1cjogJyArXG5cdFx0XHRcdFx0XHQgZmJ1X3J0X2RpZmYgKyAnLCB0b3RhbDogJyArXG5cdFx0XHRcdFx0XHQgdGhpcy5fdGltaW5nLmZidV9ydF90b3RhbCArICcsIGNudDogJyArXG5cdFx0XHRcdFx0XHQgdGhpcy5fdGltaW5nLmZidV9ydF9jbnQgKyAnLCBhdmc6ICcgK1xuXHRcdFx0XHRcdFx0ICh0aGlzLl90aW1pbmcuZmJ1X3J0X3RvdGFsIC8gdGhpcy5fdGltaW5nLmZidV9ydF9jbnQpKTtcblx0XHRcdFx0XHR0aGlzLl90aW1pbmcuZmJ1X3J0X3N0YXJ0ID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIXJldCkgeyByZXR1cm4gcmV0OyB9ICAvLyBuZWVkIG1vcmUgZGF0YVxuXHRcdH1cblxuXHRcdHRoaXMuX29uRkJVQ29tcGxldGUodGhpcyxcblx0XHRcdFx0eyd4JzogdGhpcy5fRkJVLngsICd5JzogdGhpcy5fRkJVLnksXG5cdFx0XHRcdCAnd2lkdGgnOiB0aGlzLl9GQlUud2lkdGgsICdoZWlnaHQnOiB0aGlzLl9GQlUuaGVpZ2h0LFxuXHRcdFx0XHQgJ2VuY29kaW5nJzogdGhpcy5fRkJVLmVuY29kaW5nLFxuXHRcdFx0XHQgJ2VuY29kaW5nTmFtZSc6IHRoaXMuX2VuY05hbWVzW3RoaXMuX0ZCVS5lbmNvZGluZ119KTtcblxuXHRcdHJldHVybiB0cnVlOyAgLy8gV2UgZmluaXNoZWQgdGhpcyBGQlVcblx0fSxcbn07XG5cblxuVXRpbC5tYWtlX3Byb3BlcnRpZXMoUkZCLCBbXG5cdFsndGFyZ2V0JywgJ3dvJywgJ2RvbSddLCAgICAgICAgICAgICAgICAvLyBWTkMgZGlzcGxheSByZW5kZXJpbmcgQ2FudmFzIG9iamVjdFxuXHRbJ2ZvY3VzQ29udGFpbmVyJywgJ3dvJywgJ2RvbSddLCAgICAgICAgLy8gRE9NIGVsZW1lbnQgdGhhdCBjYXB0dXJlcyBrZXlib2FyZCBpbnB1dFxuXHRbJ2VuY3J5cHQnLCAncncnLCAnYm9vbCddLCAgICAgICAgICAgICAgLy8gVXNlIFRMUy9TU0wvd3NzIGVuY3J5cHRpb25cblx0Wyd0cnVlX2NvbG9yJywgJ3J3JywgJ2Jvb2wnXSwgICAgICAgICAgIC8vIFJlcXVlc3QgdHJ1ZSBjb2xvciBwaXhlbCBkYXRhXG5cdFsnbG9jYWxfY3Vyc29yJywgJ3J3JywgJ2Jvb2wnXSwgICAgICAgICAvLyBSZXF1ZXN0IGxvY2FsbHkgcmVuZGVyZWQgY3Vyc29yXG5cdFsnc2hhcmVkJywgJ3J3JywgJ2Jvb2wnXSwgICAgICAgICAgICAgICAvLyBSZXF1ZXN0IHNoYXJlZCBtb2RlXG5cdFsndmlld19vbmx5JywgJ3J3JywgJ2Jvb2wnXSwgICAgICAgICAgICAvLyBEaXNhYmxlIGNsaWVudCBtb3VzZS9rZXlib2FyZFxuXHRbJ3h2cF9wYXNzd29yZF9zZXAnLCAncncnLCAnc3RyJ10sICAgICAgLy8gU2VwYXJhdG9yIGZvciBYVlAgcGFzc3dvcmQgZmllbGRzXG5cdFsnZGlzY29ubmVjdFRpbWVvdXQnLCAncncnLCAnaW50J10sICAgICAvLyBUaW1lIChzKSB0byB3YWl0IGZvciBkaXNjb25uZWN0aW9uXG5cdFsnd3NQcm90b2NvbHMnLCAncncnLCAnYXJyJ10sICAgICAgICAgICAvLyBQcm90b2NvbHMgdG8gdXNlIGluIHRoZSBXZWJTb2NrZXQgY29ubmVjdGlvblxuXHRbJ3JlcGVhdGVySUQnLCAncncnLCAnc3RyJ10sICAgICAgICAgICAgLy8gW1VsdHJhVk5DXSBSZXBlYXRlcklEIHRvIGNvbm5lY3QgdG9cblx0Wyd2aWV3cG9ydERyYWcnLCAncncnLCAnYm9vbCddLCAgICAgICAgIC8vIE1vdmUgdGhlIHZpZXdwb3J0IG9uIG1vdXNlIGRyYWdzXG5cdFsnZm9yY2VBdXRoU2NoZW1lJywgJ3J3JywgJ2ludCddLCAgICAgICAvLyBGb3JjZSBhdXRoIHNjaGVtZSAoMCBtZWFucyBubylcblx0WydlbmFibGVNb3VzZUFuZFRvdWNoJywgJ3J3JywgJ2Jvb2wnXSwgIC8vIFdoZXRoZXIgYWxzbyBlbmFibGUgbW91c2UgZXZlbnRzIHdoZW4gdG91Y2ggc2NyZWVuIGlzIGRldGVjdGVkXG5cblx0Ly8gQ2FsbGJhY2sgZnVuY3Rpb25zXG5cdFsnb25VcGRhdGVTdGF0ZScsICdydycsICdmdW5jJ10sICAgICAgICAvLyBvblVwZGF0ZVN0YXRlKHJmYiwgc3RhdGUsIG9sZHN0YXRlLCBzdGF0dXNNc2cpOiBSRkIgc3RhdGUgdXBkYXRlL2NoYW5nZVxuXHRbJ29uUGFzc3dvcmRSZXF1aXJlZCcsICdydycsICdmdW5jJ10sICAgLy8gb25QYXNzd29yZFJlcXVpcmVkKHJmYik6IFZOQyBwYXNzd29yZCBpcyByZXF1aXJlZFxuXHRbJ29uQ2xpcGJvYXJkJywgJ3J3JywgJ2Z1bmMnXSwgICAgICAgICAgLy8gb25DbGlwYm9hcmQocmZiLCB0ZXh0KTogUkZCIGNsaXBib2FyZCBjb250ZW50cyByZWNlaXZlZFxuXHRbJ29uQmVsbCcsICdydycsICdmdW5jJ10sICAgICAgICAgICAgICAgLy8gb25CZWxsKHJmYik6IFJGQiBCZWxsIG1lc3NhZ2UgcmVjZWl2ZWRcblx0WydvbkZCVVJlY2VpdmUnLCAncncnLCAnZnVuYyddLCAgICAgICAgIC8vIG9uRkJVUmVjZWl2ZShyZmIsIGZidSk6IFJGQiBGQlUgcmVjZWl2ZWQgYnV0IG5vdCB5ZXQgcHJvY2Vzc2VkXG5cdFsnb25GQlVDb21wbGV0ZScsICdydycsICdmdW5jJ10sICAgICAgICAvLyBvbkZCVUNvbXBsZXRlKHJmYiwgZmJ1KTogUkZCIEZCVSByZWNlaXZlZCBhbmQgcHJvY2Vzc2VkXG5cdFsnb25GQlJlc2l6ZScsICdydycsICdmdW5jJ10sICAgICAgICAgICAvLyBvbkZCUmVzaXplKHJmYiwgd2lkdGgsIGhlaWdodCk6IGZyYW1lIGJ1ZmZlciByZXNpemVkXG5cdFsnb25EZXNrdG9wTmFtZScsICdydycsICdmdW5jJ10sICAgICAgICAvLyBvbkRlc2t0b3BOYW1lKHJmYiwgbmFtZSk6IGRlc2t0b3AgbmFtZSByZWNlaXZlZFxuXHRbJ29uWHZwSW5pdCcsICdydycsICdmdW5jJ10sICAgICAgICAgICAgLy8gb25YdnBJbml0KHZlcnNpb24pOiBYVlAgZXh0ZW5zaW9ucyBhY3RpdmUgZm9yIHRoaXMgY29ubmVjdGlvblxuXHRbJ29uVW5rbm93bk1lc3NhZ2VUeXBlJywgJ3J3JywgJ2Z1bmMnXSAgLy8gSGFuZGxlciBmb3IgdW5rbm93biBWTkMgbWVzc2FnZSB0eXBlcy4gSWZcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgICAgICAgICAgICAgICAgICAgIC8vIG51bGwgZmFpbHVyZSBpcyBlbWl0dGVkIGFuZCB0aGUgUkZCIGNsb3NlZC5cbl0pO1xuXG5cblJGQi5wcm90b3R5cGUuc2V0X2xvY2FsX2N1cnNvciA9IGZ1bmN0aW9uIChjdXJzb3IpIHtcblx0aWYgKCFjdXJzb3IgfHwgKGN1cnNvciBpbiB7JzAnOiAxLCAnbm8nOiAxLCAnZmFsc2UnOiAxfSkpIHtcblx0XHR0aGlzLl9sb2NhbF9jdXJzb3IgPSBmYWxzZTtcblx0XHR0aGlzLl9kaXNwbGF5LmRpc2FibGVMb2NhbEN1cnNvcigpOyAvLyBPbmx5IHNob3cgc2VydmVyLXNpZGUgY3Vyc29yXG5cdH0gZWxzZSB7XG5cdFx0aWYgKHRoaXMuX2Rpc3BsYXkuZ2V0X2N1cnNvcl91cmkoKSkge1xuXHRcdFx0dGhpcy5fbG9jYWxfY3Vyc29yID0gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGVidWcoJ2Jyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBsb2NhbCBjdXJzb3InKTtcblx0XHRcdHRoaXMuX2Rpc3BsYXkuZGlzYWJsZUxvY2FsQ3Vyc29yKCk7XG5cdFx0fVxuXHR9XG59O1xuXG5SRkIucHJvdG90eXBlLmdldF9kaXNwbGF5ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fZGlzcGxheTsgfTtcblJGQi5wcm90b3R5cGUuZ2V0X2tleWJvYXJkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fa2V5Ym9hcmQ7IH07XG5SRkIucHJvdG90eXBlLmdldF9tb3VzZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX21vdXNlOyB9O1xuXG5cbi8vIENsYXNzIE1ldGhvZHNcblJGQi5tZXNzYWdlcyA9IHtcblx0a2V5RXZlbnQ6IGZ1bmN0aW9uIChrZXlzeW0sIGRvd24pIHtcblx0XHR2YXIgYXJyID0gWzRdO1xuXHRcdFV0aWwucHVzaDgoYXJyLCBkb3duKTtcblx0XHRVdGlsLnB1c2gxNihhcnIsIDApO1xuXHRcdFV0aWwucHVzaDMyKGFyciwga2V5c3ltKTtcblx0XHRyZXR1cm4gYXJyO1xuXHR9LFxuXG5cdHBvaW50ZXJFdmVudDogZnVuY3Rpb24gKHgsIHksIG1hc2spIHtcblx0XHR2YXIgYXJyID0gWzVdOyAgLy8gbXNnLXR5cGVcblx0XHRVdGlsLnB1c2g4KGFyciwgbWFzayk7XG5cdFx0VXRpbC5wdXNoMTYoYXJyLCB4KTtcblx0XHRVdGlsLnB1c2gxNihhcnIsIHkpO1xuXHRcdHJldHVybiBhcnI7XG5cdH0sXG5cblx0Ly8gVE9ETyhkaXJlY3R4bWFuMTIpOiBtYWtlIHRoaXMgdW5pY29kZSBjb21wYXRpYmxlP1xuXHRjbGllbnRDdXRUZXh0OiBmdW5jdGlvbiAodGV4dCkge1xuXHRcdHZhciBhcnIgPSBbNl07ICAvLyBtc2ctdHlwZVxuXHRcdFV0aWwucHVzaDgoYXJyLCAwKTsgICAvLyBwYWRkaW5nXG5cdFx0VXRpbC5wdXNoOChhcnIsIDApOyAgIC8vIHBhZGRpbmdcblx0XHRVdGlsLnB1c2g4KGFyciwgMCk7ICAgLy8gcGFkZGluZ1xuXHRcdFV0aWwucHVzaDMyKGFyciwgdGV4dC5sZW5ndGgpO1xuXHRcdHZhciBuID0gdGV4dC5sZW5ndGg7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIHtcblx0XHRcdGFyci5wdXNoKHRleHQuY2hhckNvZGVBdChpKSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFycjtcblx0fSxcblxuXHRwaXhlbEZvcm1hdDogZnVuY3Rpb24gKGJwcCwgZGVwdGgsIHRydWVfY29sb3IpIHtcblx0XHR2YXIgYXJyID0gWzBdOyAvLyBtc2ctdHlwZVxuXHRcdFV0aWwucHVzaDgoYXJyLCAwKTsgIC8vIHBhZGRpbmdcblx0XHRVdGlsLnB1c2g4KGFyciwgMCk7ICAvLyBwYWRkaW5nXG5cdFx0VXRpbC5wdXNoOChhcnIsIDApOyAgLy8gcGFkZGluZ1xuXG5cdFx0VXRpbC5wdXNoOChhcnIsIGJwcCAqIDgpOyAvLyBiaXRzLXBlci1waXhlbFxuXHRcdFV0aWwucHVzaDgoYXJyLCBkZXB0aCAqIDgpOyAvLyBkZXB0aFxuXHRcdFV0aWwucHVzaDgoYXJyLCAwKTsgIC8vIGxpdHRsZS1lbmRpYW5cblx0XHRVdGlsLnB1c2g4KGFyciwgdHJ1ZV9jb2xvciA/IDEgOiAwKTsgIC8vIHRydWUtY29sb3JcblxuXHRcdFV0aWwucHVzaDE2KGFyciwgMjU1KTsgIC8vIHJlZC1tYXhcblx0XHRVdGlsLnB1c2gxNihhcnIsIDI1NSk7ICAvLyBncmVlbi1tYXhcblx0XHRVdGlsLnB1c2gxNihhcnIsIDI1NSk7ICAvLyBibHVlLW1heFxuXHRcdFV0aWwucHVzaDgoYXJyLCAxNik7ICAgIC8vIHJlZC1zaGlmdFxuXHRcdFV0aWwucHVzaDgoYXJyLCA4KTsgICAgIC8vIGdyZWVuLXNoaWZ0XG5cdFx0VXRpbC5wdXNoOChhcnIsIDApOyAgICAgLy8gYmx1ZS1zaGlmdFxuXG5cdFx0VXRpbC5wdXNoOChhcnIsIDApOyAgICAgLy8gcGFkZGluZ1xuXHRcdFV0aWwucHVzaDgoYXJyLCAwKTsgICAgIC8vIHBhZGRpbmdcblx0XHRVdGlsLnB1c2g4KGFyciwgMCk7ICAgICAvLyBwYWRkaW5nXG5cdFx0cmV0dXJuIGFycjtcblx0fSxcblxuXHRjbGllbnRFbmNvZGluZ3M6IGZ1bmN0aW9uIChlbmNvZGluZ3MsIGxvY2FsX2N1cnNvciwgdHJ1ZV9jb2xvcikge1xuXHRcdHZhciBpLCBlbmNMaXN0ID0gW107XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgZW5jb2RpbmdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoZW5jb2RpbmdzW2ldWzBdID09PSAnQ3Vyc29yJyAmJiAhbG9jYWxfY3Vyc29yKSB7XG5cdFx0XHRcdGRlYnVnKCdjbGllbnRFbmNvZGluZ3MoKSB8IHNraXBwaW5nIEN1cnNvciBwc2V1ZG8tZW5jb2RpbmcnKTtcblx0XHRcdH0gZWxzZSBpZiAoZW5jb2RpbmdzW2ldWzBdID09PSAnVElHSFQnICYmICF0cnVlX2NvbG9yKSB7XG5cdFx0XHRcdC8vIFRPRE86IHJlbW92ZSB0aGlzIHdoZW4gd2UgaGF2ZSB0aWdodCtub24tdHJ1ZS1jb2xvclxuXHRcdFx0XHRkZWJ1ZygnY2xpZW50RW5jb2RpbmdzKCkgfCBza2lwcGluZyB0aWdodCBhcyBpdCBpcyBvbmx5IHN1cHBvcnRlZCB3aXRoIHRydWUgY29sb3InKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGVuY0xpc3QucHVzaChlbmNvZGluZ3NbaV1bMV0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciBhcnIgPSBbMl07ICAvLyBtc2ctdHlwZVxuXHRcdFV0aWwucHVzaDgoYXJyLCAwKTsgICAvLyBwYWRkaW5nXG5cblx0XHRVdGlsLnB1c2gxNihhcnIsIGVuY0xpc3QubGVuZ3RoKTsgIC8vIGVuY29kaW5nIGNvdW50XG5cdFx0Zm9yIChpID0gMDsgaSA8IGVuY0xpc3QubGVuZ3RoOyBpKyspIHtcblx0XHRcdFV0aWwucHVzaDMyKGFyciwgZW5jTGlzdFtpXSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFycjtcblx0fSxcblxuXHRmYlVwZGF0ZVJlcXVlc3RzOiBmdW5jdGlvbiAoY2xlYW5EaXJ0eSwgZmJfd2lkdGgsIGZiX2hlaWdodCkge1xuXHRcdHZhciBhcnIgPSBbXTtcblxuXHRcdHZhciBjYiA9IGNsZWFuRGlydHkuY2xlYW5Cb3g7XG5cdFx0dmFyIHcsIGg7XG5cdFx0aWYgKGNiLncgPiAwICYmIGNiLmggPiAwKSB7XG5cdFx0XHR3ID0gdHlwZW9mIGNiLncgPT09ICd1bmRlZmluZWQnID8gZmJfd2lkdGggOiBjYi53O1xuXHRcdFx0aCA9IHR5cGVvZiBjYi5oID09PSAndW5kZWZpbmVkJyA/IGZiX2hlaWdodCA6IGNiLmg7XG5cdFx0XHQvLyBSZXF1ZXN0IGluY3JlbWVudGFsIGZvciBjbGVhbiBib3hcblx0XHRcdGFyciA9IGFyci5jb25jYXQoUkZCLm1lc3NhZ2VzLmZiVXBkYXRlUmVxdWVzdCgxLCBjYi54LCBjYi55LCB3LCBoKSk7XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjbGVhbkRpcnR5LmRpcnR5Qm94ZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBkYiA9IGNsZWFuRGlydHkuZGlydHlCb3hlc1tpXTtcblx0XHRcdC8vIEZvcmNlIGFsbCAobm9uLWluY3JlbWVudGFsKSBmb3IgZGlydHkgYm94XG5cdFx0XHR3ID0gdHlwZW9mIGRiLncgPT09ICd1bmRlZmluZWQnID8gZmJfd2lkdGggOiBkYi53O1xuXHRcdFx0aCA9IHR5cGVvZiBkYi5oID09PSAndW5kZWZpbmVkJyA/IGZiX2hlaWdodCA6IGRiLmg7XG5cdFx0XHRhcnIgPSBhcnIuY29uY2F0KFJGQi5tZXNzYWdlcy5mYlVwZGF0ZVJlcXVlc3QoMCwgZGIueCwgZGIueSwgdywgaCkpO1xuXHRcdH1cblxuXHRcdHJldHVybiBhcnI7XG5cdH0sXG5cblx0ZmJVcGRhdGVSZXF1ZXN0OiBmdW5jdGlvbiAoaW5jcmVtZW50YWwsIHgsIHksIHcsIGgpIHtcblx0XHRpZiAodHlwZW9mKHgpID09PSAndW5kZWZpbmVkJykgeyB4ID0gMDsgfVxuXHRcdGlmICh0eXBlb2YoeSkgPT09ICd1bmRlZmluZWQnKSB7IHkgPSAwOyB9XG5cblx0XHR2YXIgYXJyID0gWzNdOyAgLy8gbXNnLXR5cGVcblx0XHRVdGlsLnB1c2g4KGFyciwgaW5jcmVtZW50YWwpO1xuXHRcdFV0aWwucHVzaDE2KGFyciwgeCk7XG5cdFx0VXRpbC5wdXNoMTYoYXJyLCB5KTtcblx0XHRVdGlsLnB1c2gxNihhcnIsIHcpO1xuXHRcdFV0aWwucHVzaDE2KGFyciwgaCk7XG5cblx0XHRyZXR1cm4gYXJyO1xuXHR9XG59O1xuXG5SRkIuZ2VuREVTID0gZnVuY3Rpb24gKHBhc3N3b3JkLCBjaGFsbGVuZ2UpIHtcblx0dmFyIHBhc3N3ZCA9IFtdO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHBhc3N3b3JkLmxlbmd0aDsgaSsrKSB7XG5cdFx0cGFzc3dkLnB1c2gocGFzc3dvcmQuY2hhckNvZGVBdChpKSk7XG5cdH1cblx0cmV0dXJuIChuZXcgREVTKHBhc3N3ZCkpLmVuY3J5cHQoY2hhbGxlbmdlKTtcbn07XG5cblJGQi5lbmNvZGluZ0hhbmRsZXJzID0ge1xuXHRSQVc6IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodGhpcy5fRkJVLmxpbmVzID09PSAwKSB7XG5cdFx0XHR0aGlzLl9GQlUubGluZXMgPSB0aGlzLl9GQlUuaGVpZ2h0O1xuXHRcdH1cblxuXHRcdHRoaXMuX0ZCVS5ieXRlcyA9IHRoaXMuX0ZCVS53aWR0aCAqIHRoaXMuX2ZiX0JwcDsgIC8vIGF0IGxlYXN0IGEgbGluZVxuXHRcdGlmICh0aGlzLl9zb2NrLnJRd2FpdCgnUkFXJywgdGhpcy5fRkJVLmJ5dGVzKSkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHR2YXIgY3VyX3kgPSB0aGlzLl9GQlUueSArICh0aGlzLl9GQlUuaGVpZ2h0IC0gdGhpcy5fRkJVLmxpbmVzKTtcblx0XHR2YXIgY3Vycl9oZWlnaHQgPSBNYXRoLm1pbih0aGlzLl9GQlUubGluZXMsXG5cdFx0XHRcdFx0XHRcdFx0XHQgTWF0aC5mbG9vcih0aGlzLl9zb2NrLnJRbGVuKCkgLyAodGhpcy5fRkJVLndpZHRoICogdGhpcy5fZmJfQnBwKSkpO1xuXHRcdHRoaXMuX2Rpc3BsYXkuYmxpdEltYWdlKHRoaXMuX0ZCVS54LCBjdXJfeSwgdGhpcy5fRkJVLndpZHRoLFxuXHRcdFx0XHRcdFx0XHRcdGN1cnJfaGVpZ2h0LCB0aGlzLl9zb2NrLmdldF9yUSgpLFxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3NvY2suZ2V0X3JRaSgpKTtcblx0XHR0aGlzLl9zb2NrLnJRc2tpcEJ5dGVzKHRoaXMuX0ZCVS53aWR0aCAqIGN1cnJfaGVpZ2h0ICogdGhpcy5fZmJfQnBwKTtcblx0XHR0aGlzLl9GQlUubGluZXMgLT0gY3Vycl9oZWlnaHQ7XG5cblx0XHRpZiAodGhpcy5fRkJVLmxpbmVzID4gMCkge1xuXHRcdFx0dGhpcy5fRkJVLmJ5dGVzID0gdGhpcy5fRkJVLndpZHRoICogdGhpcy5fZmJfQnBwOyAgLy8gQXQgbGVhc3QgYW5vdGhlciBsaW5lXG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuX0ZCVS5yZWN0cy0tO1xuXHRcdFx0dGhpcy5fRkJVLmJ5dGVzID0gMDtcblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSxcblxuXHRDT1BZUkVDVDogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuX0ZCVS5ieXRlcyA9IDQ7XG5cdFx0aWYgKHRoaXMuX3NvY2suclF3YWl0KCdDT1BZUkVDVCcsIDQpKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdHRoaXMuX2Rpc3BsYXkucmVuZGVyUV9wdXNoKHtcblx0XHRcdCd0eXBlJzogJ2NvcHknLFxuXHRcdFx0J29sZF94JzogdGhpcy5fc29jay5yUXNoaWZ0MTYoKSxcblx0XHRcdCdvbGRfeSc6IHRoaXMuX3NvY2suclFzaGlmdDE2KCksXG5cdFx0XHQneCc6IHRoaXMuX0ZCVS54LFxuXHRcdFx0J3knOiB0aGlzLl9GQlUueSxcblx0XHRcdCd3aWR0aCc6IHRoaXMuX0ZCVS53aWR0aCxcblx0XHRcdCdoZWlnaHQnOiB0aGlzLl9GQlUuaGVpZ2h0XG5cdFx0fSk7XG5cdFx0dGhpcy5fRkJVLnJlY3RzLS07XG5cdFx0dGhpcy5fRkJVLmJ5dGVzID0gMDtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSxcblxuXHRSUkU6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgY29sb3I7XG5cdFx0aWYgKHRoaXMuX0ZCVS5zdWJyZWN0cyA9PT0gMCkge1xuXHRcdFx0dGhpcy5fRkJVLmJ5dGVzID0gNCArIHRoaXMuX2ZiX0JwcDtcblx0XHRcdGlmICh0aGlzLl9zb2NrLnJRd2FpdCgnUlJFJywgNCArIHRoaXMuX2ZiX0JwcCkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XHR0aGlzLl9GQlUuc3VicmVjdHMgPSB0aGlzLl9zb2NrLnJRc2hpZnQzMigpO1xuXHRcdFx0Y29sb3IgPSB0aGlzLl9zb2NrLnJRc2hpZnRCeXRlcyh0aGlzLl9mYl9CcHApOyAgLy8gQmFja2dyb3VuZFxuXHRcdFx0dGhpcy5fZGlzcGxheS5maWxsUmVjdCh0aGlzLl9GQlUueCwgdGhpcy5fRkJVLnksIHRoaXMuX0ZCVS53aWR0aCwgdGhpcy5fRkJVLmhlaWdodCwgY29sb3IpO1xuXHRcdH1cblxuXHRcdHdoaWxlICh0aGlzLl9GQlUuc3VicmVjdHMgPiAwICYmIHRoaXMuX3NvY2suclFsZW4oKSA+PSAodGhpcy5fZmJfQnBwICsgOCkpIHtcblx0XHRcdGNvbG9yID0gdGhpcy5fc29jay5yUXNoaWZ0Qnl0ZXModGhpcy5fZmJfQnBwKTtcblx0XHRcdHZhciB4ID0gdGhpcy5fc29jay5yUXNoaWZ0MTYoKTtcblx0XHRcdHZhciB5ID0gdGhpcy5fc29jay5yUXNoaWZ0MTYoKTtcblx0XHRcdHZhciB3aWR0aCA9IHRoaXMuX3NvY2suclFzaGlmdDE2KCk7XG5cdFx0XHR2YXIgaGVpZ2h0ID0gdGhpcy5fc29jay5yUXNoaWZ0MTYoKTtcblx0XHRcdHRoaXMuX2Rpc3BsYXkuZmlsbFJlY3QodGhpcy5fRkJVLnggKyB4LCB0aGlzLl9GQlUueSArIHksIHdpZHRoLCBoZWlnaHQsIGNvbG9yKTtcblx0XHRcdHRoaXMuX0ZCVS5zdWJyZWN0cy0tO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9GQlUuc3VicmVjdHMgPiAwKSB7XG5cdFx0XHR2YXIgY2h1bmsgPSBNYXRoLm1pbih0aGlzLl9ycmVfY2h1bmtfc3osIHRoaXMuX0ZCVS5zdWJyZWN0cyk7XG5cdFx0XHR0aGlzLl9GQlUuYnl0ZXMgPSAodGhpcy5fZmJfQnBwICsgOCkgKiBjaHVuaztcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fRkJVLnJlY3RzLS07XG5cdFx0XHR0aGlzLl9GQlUuYnl0ZXMgPSAwO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9LFxuXG5cdEhFWFRJTEU6IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgclEgPSB0aGlzLl9zb2NrLmdldF9yUSgpO1xuXHRcdHZhciByUWkgPSB0aGlzLl9zb2NrLmdldF9yUWkoKTtcblxuXHRcdGlmICh0aGlzLl9GQlUudGlsZXMgPT09IDApIHtcblx0XHRcdHRoaXMuX0ZCVS50aWxlc194ID0gTWF0aC5jZWlsKHRoaXMuX0ZCVS53aWR0aCAvIDE2KTtcblx0XHRcdHRoaXMuX0ZCVS50aWxlc195ID0gTWF0aC5jZWlsKHRoaXMuX0ZCVS5oZWlnaHQgLyAxNik7XG5cdFx0XHR0aGlzLl9GQlUudG90YWxfdGlsZXMgPSB0aGlzLl9GQlUudGlsZXNfeCAqIHRoaXMuX0ZCVS50aWxlc195O1xuXHRcdFx0dGhpcy5fRkJVLnRpbGVzID0gdGhpcy5fRkJVLnRvdGFsX3RpbGVzO1xuXHRcdH1cblxuXHRcdHdoaWxlICh0aGlzLl9GQlUudGlsZXMgPiAwKSB7XG5cdFx0XHR0aGlzLl9GQlUuYnl0ZXMgPSAxO1xuXHRcdFx0aWYgKHRoaXMuX3NvY2suclF3YWl0KCdIRVhUSUxFIHN1YmVuY29kaW5nJywgdGhpcy5fRkJVLmJ5dGVzKSkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcdHZhciBzdWJlbmNvZGluZyA9IHJRW3JRaV07ICAvLyBQZWVrXG5cdFx0XHRpZiAoc3ViZW5jb2RpbmcgPiAzMCkgeyAgLy8gUmF3XG5cdFx0XHRcdHRoaXMuX2ZhaWwoJ0Rpc2Nvbm5lY3RlZDogaWxsZWdhbCBoZXh0aWxlIHN1YmVuY29kaW5nICcgKyBzdWJlbmNvZGluZyk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHN1YnJlY3RzID0gMDtcblx0XHRcdHZhciBjdXJyX3RpbGUgPSB0aGlzLl9GQlUudG90YWxfdGlsZXMgLSB0aGlzLl9GQlUudGlsZXM7XG5cdFx0XHR2YXIgdGlsZV94ID0gY3Vycl90aWxlICUgdGhpcy5fRkJVLnRpbGVzX3g7XG5cdFx0XHR2YXIgdGlsZV95ID0gTWF0aC5mbG9vcihjdXJyX3RpbGUgLyB0aGlzLl9GQlUudGlsZXNfeCk7XG5cdFx0XHR2YXIgeCA9IHRoaXMuX0ZCVS54ICsgdGlsZV94ICogMTY7XG5cdFx0XHR2YXIgeSA9IHRoaXMuX0ZCVS55ICsgdGlsZV95ICogMTY7XG5cdFx0XHR2YXIgdyA9IE1hdGgubWluKDE2LCAodGhpcy5fRkJVLnggKyB0aGlzLl9GQlUud2lkdGgpIC0geCk7XG5cdFx0XHR2YXIgaCA9IE1hdGgubWluKDE2LCAodGhpcy5fRkJVLnkgKyB0aGlzLl9GQlUuaGVpZ2h0KSAtIHkpO1xuXG5cdFx0XHQvLyBGaWd1cmUgb3V0IGhvdyBtdWNoIHdlIGFyZSBleHBlY3Rpbmdcblx0XHRcdGlmIChzdWJlbmNvZGluZyAmIDB4MDEpIHsgIC8vIFJhd1xuXHRcdFx0XHR0aGlzLl9GQlUuYnl0ZXMgKz0gdyAqIGggKiB0aGlzLl9mYl9CcHA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoc3ViZW5jb2RpbmcgJiAweDAyKSB7ICAvLyBCYWNrZ3JvdW5kXG5cdFx0XHRcdFx0dGhpcy5fRkJVLmJ5dGVzICs9IHRoaXMuX2ZiX0JwcDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoc3ViZW5jb2RpbmcgJiAweDA0KSB7ICAvLyBGb3JlZ3JvdW5kXG5cdFx0XHRcdFx0dGhpcy5fRkJVLmJ5dGVzICs9IHRoaXMuX2ZiX0JwcDtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoc3ViZW5jb2RpbmcgJiAweDA4KSB7ICAvLyBBbnlTdWJyZWN0c1xuXHRcdFx0XHRcdHRoaXMuX0ZCVS5ieXRlcysrOyAgLy8gU2luY2Ugd2UgYXJlbid0IHNoaWZ0aW5nIGl0IG9mZlxuXHRcdFx0XHRcdGlmICh0aGlzLl9zb2NrLnJRd2FpdCgnaGV4dGlsZSBzdWJyZWN0cyBoZWFkZXInLCB0aGlzLl9GQlUuYnl0ZXMpKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0XHRcdHN1YnJlY3RzID0gclFbclFpICsgdGhpcy5fRkJVLmJ5dGVzIC0gMV07ICAvLyBQZWVrXG5cdFx0XHRcdFx0aWYgKHN1YmVuY29kaW5nICYgMHgxMCkgeyAgLy8gU3VicmVjdHNDb2xvdXJlZFxuXHRcdFx0XHRcdFx0dGhpcy5fRkJVLmJ5dGVzICs9IHN1YnJlY3RzICogKHRoaXMuX2ZiX0JwcCArIDIpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGlzLl9GQlUuYnl0ZXMgKz0gc3VicmVjdHMgKiAyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5fc29jay5yUXdhaXQoJ2hleHRpbGUnLCB0aGlzLl9GQlUuYnl0ZXMpKSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdFx0XHQvLyBXZSBrbm93IHRoZSBlbmNvZGluZyBhbmQgaGF2ZSBhIHdob2xlIHRpbGVcblx0XHRcdHRoaXMuX0ZCVS5zdWJlbmNvZGluZyA9IHJRW3JRaV07XG5cdFx0XHRyUWkrKztcblx0XHRcdGlmICh0aGlzLl9GQlUuc3ViZW5jb2RpbmcgPT09IDApIHtcblx0XHRcdFx0aWYgKHRoaXMuX0ZCVS5sYXN0c3ViZW5jb2RpbmcgJiAweDAxKSB7XG5cdFx0XHRcdFx0Ly8gV2VpcmQ6IGlnbm9yZSBibGFua3MgYXJlIFJBV1xuXHRcdFx0XHRcdGRlYnVnKCdIRVhUSUxFKCkgfCBpZ25vcmluZyBibGFuayBhZnRlciBSQVcnKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLl9kaXNwbGF5LmZpbGxSZWN0KHgsIHksIHcsIGgsIHRoaXMuX0ZCVS5iYWNrZ3JvdW5kKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICh0aGlzLl9GQlUuc3ViZW5jb2RpbmcgJiAweDAxKSB7ICAvLyBSYXdcblx0XHRcdFx0dGhpcy5fZGlzcGxheS5ibGl0SW1hZ2UoeCwgeSwgdywgaCwgclEsIHJRaSk7XG5cdFx0XHRcdHJRaSArPSB0aGlzLl9GQlUuYnl0ZXMgLSAxO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKHRoaXMuX0ZCVS5zdWJlbmNvZGluZyAmIDB4MDIpIHsgIC8vIEJhY2tncm91bmRcblx0XHRcdFx0XHR0aGlzLl9GQlUuYmFja2dyb3VuZCA9IHJRLnNsaWNlKHJRaSwgclFpICsgdGhpcy5fZmJfQnBwKTtcblx0XHRcdFx0XHRyUWkgKz0gdGhpcy5fZmJfQnBwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLl9GQlUuc3ViZW5jb2RpbmcgJiAweDA0KSB7ICAvLyBGb3JlZ3JvdW5kXG5cdFx0XHRcdFx0dGhpcy5fRkJVLmZvcmVncm91bmQgPSByUS5zbGljZShyUWksIHJRaSArIHRoaXMuX2ZiX0JwcCk7XG5cdFx0XHRcdFx0clFpICs9IHRoaXMuX2ZiX0JwcDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRoaXMuX2Rpc3BsYXkuc3RhcnRUaWxlKHgsIHksIHcsIGgsIHRoaXMuX0ZCVS5iYWNrZ3JvdW5kKTtcblx0XHRcdFx0aWYgKHRoaXMuX0ZCVS5zdWJlbmNvZGluZyAmIDB4MDgpIHsgIC8vIEFueVN1YnJlY3RzXG5cdFx0XHRcdFx0c3VicmVjdHMgPSByUVtyUWldO1xuXHRcdFx0XHRcdHJRaSsrO1xuXG5cdFx0XHRcdFx0Zm9yICh2YXIgcyA9IDA7IHMgPCBzdWJyZWN0czsgcysrKSB7XG5cdFx0XHRcdFx0XHR2YXIgY29sb3I7XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5fRkJVLnN1YmVuY29kaW5nICYgMHgxMCkgeyAgLy8gU3VicmVjdHNDb2xvdXJlZFxuXHRcdFx0XHRcdFx0XHRjb2xvciA9IHJRLnNsaWNlKHJRaSwgclFpICsgdGhpcy5fZmJfQnBwKTtcblx0XHRcdFx0XHRcdFx0clFpICs9IHRoaXMuX2ZiX0JwcDtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGNvbG9yID0gdGhpcy5fRkJVLmZvcmVncm91bmQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR2YXIgeHkgPSByUVtyUWldO1xuXHRcdFx0XHRcdFx0clFpKys7XG5cdFx0XHRcdFx0XHR2YXIgc3ggPSAoeHkgPj4gNCk7XG5cdFx0XHRcdFx0XHR2YXIgc3kgPSAoeHkgJiAweDBmKTtcblxuXHRcdFx0XHRcdFx0dmFyIHdoID0gclFbclFpXTtcblx0XHRcdFx0XHRcdHJRaSsrO1xuXHRcdFx0XHRcdFx0dmFyIHN3ID0gKHdoID4+IDQpICsgMTtcblx0XHRcdFx0XHRcdHZhciBzaCA9ICh3aCAmIDB4MGYpICsgMTtcblxuXHRcdFx0XHRcdFx0dGhpcy5fZGlzcGxheS5zdWJUaWxlKHN4LCBzeSwgc3csIHNoLCBjb2xvcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX2Rpc3BsYXkuZmluaXNoVGlsZSgpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5fc29jay5zZXRfclFpKHJRaSk7XG5cdFx0XHR0aGlzLl9GQlUubGFzdHN1YmVuY29kaW5nID0gdGhpcy5fRkJVLnN1YmVuY29kaW5nO1xuXHRcdFx0dGhpcy5fRkJVLmJ5dGVzID0gMDtcblx0XHRcdHRoaXMuX0ZCVS50aWxlcy0tO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9GQlUudGlsZXMgPT09IDApIHtcblx0XHRcdHRoaXMuX0ZCVS5yZWN0cy0tO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9LFxuXG5cdGdldFRpZ2h0Q0xlbmd0aDogZnVuY3Rpb24gKGFycikge1xuXHRcdHZhciBoZWFkZXIgPSAxLCBkYXRhID0gMDtcblx0XHRkYXRhICs9IGFyclswXSAmIDB4N2Y7XG5cdFx0aWYgKGFyclswXSAmIDB4ODApIHtcblx0XHRcdGhlYWRlcisrO1xuXHRcdFx0ZGF0YSArPSAoYXJyWzFdICYgMHg3ZikgPDwgNztcblx0XHRcdGlmIChhcnJbMV0gJiAweDgwKSB7XG5cdFx0XHRcdGhlYWRlcisrO1xuXHRcdFx0XHRkYXRhICs9IGFyclsyXSA8PCAxNDtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIFtoZWFkZXIsIGRhdGFdO1xuXHR9LFxuXG5cdGRpc3BsYXlfdGlnaHQ6IGZ1bmN0aW9uIChpc1RpZ2h0UE5HKSB7XG5cdFx0aWYgKHRoaXMuX2ZiX2RlcHRoID09PSAxKSB7XG5cdFx0XHR0aGlzLl9mYWlsKCdUaWdodCBwcm90b2NvbCBoYW5kbGVyIG9ubHkgaW1wbGVtZW50cyB0cnVlIGNvbG9yIG1vZGUnKTtcblx0XHR9XG5cblx0XHR0aGlzLl9GQlUuYnl0ZXMgPSAxOyAgLy8gY29tcHJlc3Npb24tY29udHJvbCBieXRlXG5cdFx0aWYgKHRoaXMuX3NvY2suclF3YWl0KCdUSUdIVCBjb21wcmVzc2lvbi1jb250cm9sJywgdGhpcy5fRkJVLmJ5dGVzKSkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRcdC8vIHZhciBjaGVja3N1bSA9IGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0Ly8gXHR2YXIgc3VtID0gMDtcblx0XHQvLyBcdGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuXHRcdC8vIFx0XHRzdW0gKz0gZGF0YVtpXTtcblx0XHQvLyBcdFx0aWYgKHN1bSA+IDY1NTM2KSB7IHN1bSAtPSA2NTUzNjsgfVxuXHRcdC8vIFx0fVxuXHRcdC8vIFx0cmV0dXJuIHN1bTtcblx0XHQvLyB9O1xuXG5cdFx0dmFyIHJlc2V0U3RyZWFtcyA9IDA7XG5cdFx0dmFyIHN0cmVhbUlkID0gLTE7XG5cdFx0dmFyIGRlY29tcHJlc3MgPSBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcblx0XHRcdFx0aWYgKChyZXNldFN0cmVhbXMgPj4gaSkgJiAxKSB7XG5cdFx0XHRcdFx0dGhpcy5fRkJVLnpsaWJzW2ldLnJlc2V0KCk7XG5cdFx0XHRcdFx0ZGVidWcoJ2Rpc3BsYXlfdGlnaHQoKSB8IHJlc2V0IHpsaWIgc3RyZWFtICcgKyBpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR2YXIgdW5jb21wcmVzc2VkID0gdGhpcy5fRkJVLnpsaWJzW3N0cmVhbUlkXS51bmNvbXByZXNzKGRhdGEsIDApO1xuXHRcdFx0aWYgKHVuY29tcHJlc3NlZC5zdGF0dXMgIT09IDApIHtcblx0XHRcdFx0ZGVidWdlcnJvcignZGlzcGxheV90aWdodCgpIHwgaW52YWxpZCBkYXRhIGluIHpsaWIgc3RyZWFtJyk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB1bmNvbXByZXNzZWQuZGF0YTtcblx0XHR9LmJpbmQodGhpcyk7XG5cblx0XHR2YXIgaW5kZXhlZFRvUkdCID0gZnVuY3Rpb24gKGRhdGEsIG51bUNvbG9ycywgcGFsZXR0ZSwgd2lkdGgsIGhlaWdodCkge1xuXHRcdFx0Ly8gQ29udmVydCBpbmRleGVkIChwYWxldHRlIGJhc2VkKSBpbWFnZSBkYXRhIHRvIFJHQlxuXHRcdFx0Ly8gVE9ETzogcmVkdWNlIG51bWJlciBvZiBjYWxjdWxhdGlvbnMgaW5zaWRlIGxvb3Bcblx0XHRcdHZhciBkZXN0ID0gW107XG5cdFx0XHR2YXIgeCwgeSwgZHAsIHNwO1xuXHRcdFx0aWYgKG51bUNvbG9ycyA9PT0gMikge1xuXHRcdFx0XHR2YXIgdyA9IE1hdGguZmxvb3IoKHdpZHRoICsgNykgLyA4KTtcblx0XHRcdFx0dmFyIHcxID0gTWF0aC5mbG9vcih3aWR0aCAvIDgpO1xuXG5cdFx0XHRcdGZvciAoeSA9IDA7IHkgPCBoZWlnaHQ7IHkrKykge1xuXHRcdFx0XHRcdHZhciBiO1xuXHRcdFx0XHRcdGZvciAoeCA9IDA7IHggPCB3MTsgeCsrKSB7XG5cdFx0XHRcdFx0XHRmb3IgKGIgPSA3OyBiID49IDA7IGItLSkge1xuXHRcdFx0XHRcdFx0XHRkcCA9ICh5ICogd2lkdGggKyB4ICogOCArIDcgLSBiKSAqIDM7XG5cdFx0XHRcdFx0XHRcdHNwID0gKGRhdGFbeSAqIHcgKyB4XSA+PiBiICYgMSkgKiAzO1xuXHRcdFx0XHRcdFx0XHRkZXN0W2RwXSA9IHBhbGV0dGVbc3BdO1xuXHRcdFx0XHRcdFx0XHRkZXN0W2RwICsgMV0gPSBwYWxldHRlW3NwICsgMV07XG5cdFx0XHRcdFx0XHRcdGRlc3RbZHAgKyAyXSA9IHBhbGV0dGVbc3AgKyAyXTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRmb3IgKGIgPSA3OyBiID49IDggLSB3aWR0aCAlIDg7IGItLSkge1xuXHRcdFx0XHRcdFx0ZHAgPSAoeSAqIHdpZHRoICsgeCAqIDggKyA3IC0gYikgKiAzO1xuXHRcdFx0XHRcdFx0c3AgPSAoZGF0YVt5ICogdyArIHhdID4+IGIgJiAxKSAqIDM7XG5cdFx0XHRcdFx0XHRkZXN0W2RwXSA9IHBhbGV0dGVbc3BdO1xuXHRcdFx0XHRcdFx0ZGVzdFtkcCArIDFdID0gcGFsZXR0ZVtzcCArIDFdO1xuXHRcdFx0XHRcdFx0ZGVzdFtkcCArIDJdID0gcGFsZXR0ZVtzcCArIDJdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9yICh5ID0gMDsgeSA8IGhlaWdodDsgeSsrKSB7XG5cdFx0XHRcdFx0Zm9yICh4ID0gMDsgeCA8IHdpZHRoOyB4KyspIHtcblx0XHRcdFx0XHRcdGRwID0gKHkgKiB3aWR0aCArIHgpICogMztcblx0XHRcdFx0XHRcdHNwID0gZGF0YVt5ICogd2lkdGggKyB4XSAqIDM7XG5cdFx0XHRcdFx0XHRkZXN0W2RwXSA9IHBhbGV0dGVbc3BdO1xuXHRcdFx0XHRcdFx0ZGVzdFtkcCArIDFdID0gcGFsZXR0ZVtzcCArIDFdO1xuXHRcdFx0XHRcdFx0ZGVzdFtkcCArIDJdID0gcGFsZXR0ZVtzcCArIDJdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZGVzdDtcblx0XHR9LmJpbmQodGhpcyk7XG5cblx0XHR2YXIgclEgPSB0aGlzLl9zb2NrLmdldF9yUSgpO1xuXHRcdHZhciByUWkgPSB0aGlzLl9zb2NrLmdldF9yUWkoKTtcblx0XHR2YXIgY21vZGUsIGNsZW5ndGgsIGRhdGE7XG5cblx0XHR2YXIgaGFuZGxlUGFsZXR0ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBudW1Db2xvcnMgPSByUVtyUWkgKyAyXSArIDE7XG5cdFx0XHR2YXIgcGFsZXR0ZVNpemUgPSBudW1Db2xvcnMgKiB0aGlzLl9mYl9kZXB0aDtcblx0XHRcdHRoaXMuX0ZCVS5ieXRlcyArPSBwYWxldHRlU2l6ZTtcblx0XHRcdGlmICh0aGlzLl9zb2NrLnJRd2FpdCgnVElHSFQgcGFsZXR0ZSAnICsgY21vZGUsIHRoaXMuX0ZCVS5ieXRlcykpIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0XHRcdHZhciBicHAgPSAobnVtQ29sb3JzIDw9IDIpID8gMSA6IDg7XG5cdFx0XHR2YXIgcm93U2l6ZSA9IE1hdGguZmxvb3IoKHRoaXMuX0ZCVS53aWR0aCAqIGJwcCArIDcpIC8gOCk7XG5cdFx0XHR2YXIgcmF3ID0gZmFsc2U7XG5cdFx0XHRpZiAocm93U2l6ZSAqIHRoaXMuX0ZCVS5oZWlnaHQgPCAxMikge1xuXHRcdFx0XHRyYXcgPSB0cnVlO1xuXHRcdFx0XHRjbGVuZ3RoID0gWzAsIHJvd1NpemUgKiB0aGlzLl9GQlUuaGVpZ2h0XTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNsZW5ndGggPSBSRkIuZW5jb2RpbmdIYW5kbGVycy5nZXRUaWdodENMZW5ndGgoXG5cdFx0XHRcdFx0dGhpcy5fc29jay5yUXNsaWNlKDMgKyBwYWxldHRlU2l6ZSwgMyArIHBhbGV0dGVTaXplICsgM1xuXHRcdFx0XHQpKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fRkJVLmJ5dGVzICs9IGNsZW5ndGhbMF0gKyBjbGVuZ3RoWzFdO1xuXHRcdFx0aWYgKHRoaXMuX3NvY2suclF3YWl0KCdUSUdIVCAnICsgY21vZGUsIHRoaXMuX0ZCVS5ieXRlcykpIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0XHRcdC8vIFNoaWZ0IGN0bCwgZmlsdGVyIGlkLCBudW0gY29sb3JzLCBwYWxldHRlIGVudHJpZXMsIGFuZCBjbGVuZ3RoIG9mZlxuXHRcdFx0dGhpcy5fc29jay5yUXNraXBCeXRlcygzKTtcblx0XHRcdHZhciBwYWxldHRlID0gdGhpcy5fc29jay5yUXNoaWZ0Qnl0ZXMocGFsZXR0ZVNpemUpO1xuXHRcdFx0dGhpcy5fc29jay5yUXNraXBCeXRlcyhjbGVuZ3RoWzBdKTtcblxuXHRcdFx0aWYgKHJhdykge1xuXHRcdFx0XHRkYXRhID0gdGhpcy5fc29jay5yUXNoaWZ0Qnl0ZXMoY2xlbmd0aFsxXSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkYXRhID0gZGVjb21wcmVzcyh0aGlzLl9zb2NrLnJRc2hpZnRCeXRlcyhjbGVuZ3RoWzFdKSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIENvbnZlcnQgaW5kZXhlZCAocGFsZXR0ZSBiYXNlZCkgaW1hZ2UgZGF0YSB0byBSR0Jcblx0XHRcdHZhciByZ2IgPSBpbmRleGVkVG9SR0IoZGF0YSwgbnVtQ29sb3JzLCBwYWxldHRlLCB0aGlzLl9GQlUud2lkdGgsIHRoaXMuX0ZCVS5oZWlnaHQpO1xuXG5cdFx0XHR0aGlzLl9kaXNwbGF5LnJlbmRlclFfcHVzaCh7XG5cdFx0XHRcdCd0eXBlJzogJ2JsaXRSZ2InLFxuXHRcdFx0XHQnZGF0YSc6IHJnYixcblx0XHRcdFx0J3gnOiB0aGlzLl9GQlUueCxcblx0XHRcdFx0J3knOiB0aGlzLl9GQlUueSxcblx0XHRcdFx0J3dpZHRoJzogdGhpcy5fRkJVLndpZHRoLFxuXHRcdFx0XHQnaGVpZ2h0JzogdGhpcy5fRkJVLmhlaWdodFxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0uYmluZCh0aGlzKTtcblxuXHRcdHZhciBoYW5kbGVDb3B5ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIHJhdyA9IGZhbHNlO1xuXHRcdFx0dmFyIHVuY29tcHJlc3NlZFNpemUgPSB0aGlzLl9GQlUud2lkdGggKiB0aGlzLl9GQlUuaGVpZ2h0ICogdGhpcy5fZmJfZGVwdGg7XG5cdFx0XHRpZiAodW5jb21wcmVzc2VkU2l6ZSA8IDEyKSB7XG5cdFx0XHRcdHJhdyA9IHRydWU7XG5cdFx0XHRcdGNsZW5ndGggPSBbMCwgdW5jb21wcmVzc2VkU2l6ZV07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjbGVuZ3RoID0gUkZCLmVuY29kaW5nSGFuZGxlcnMuZ2V0VGlnaHRDTGVuZ3RoKHRoaXMuX3NvY2suclFzbGljZSgxLCA0KSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9GQlUuYnl0ZXMgPSAxICsgY2xlbmd0aFswXSArIGNsZW5ndGhbMV07XG5cdFx0XHRpZiAodGhpcy5fc29jay5yUXdhaXQoJ1RJR0hUICcgKyBjbW9kZSwgdGhpcy5fRkJVLmJ5dGVzKSkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRcdFx0Ly8gU2hpZnQgY3RsLCBjbGVuZ3RoIG9mZlxuXHRcdFx0dGhpcy5fc29jay5yUXNoaWZ0Qnl0ZXMoMSArIGNsZW5ndGhbMF0pO1xuXG5cdFx0XHRpZiAocmF3KSB7XG5cdFx0XHRcdGRhdGEgPSB0aGlzLl9zb2NrLnJRc2hpZnRCeXRlcyhjbGVuZ3RoWzFdKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRhdGEgPSBkZWNvbXByZXNzKHRoaXMuX3NvY2suclFzaGlmdEJ5dGVzKGNsZW5ndGhbMV0pKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fZGlzcGxheS5yZW5kZXJRX3B1c2goe1xuXHRcdFx0XHQndHlwZSc6ICdibGl0UmdiJyxcblx0XHRcdFx0J2RhdGEnOiBkYXRhLFxuXHRcdFx0XHQneCc6IHRoaXMuX0ZCVS54LFxuXHRcdFx0XHQneSc6IHRoaXMuX0ZCVS55LFxuXHRcdFx0XHQnd2lkdGgnOiB0aGlzLl9GQlUud2lkdGgsXG5cdFx0XHRcdCdoZWlnaHQnOiB0aGlzLl9GQlUuaGVpZ2h0XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fS5iaW5kKHRoaXMpO1xuXG5cdFx0dmFyIGN0bCA9IHRoaXMuX3NvY2suclFwZWVrOCgpO1xuXG5cdFx0Ly8gS2VlcCB0aWdodCByZXNldCBiaXRzXG5cdFx0cmVzZXRTdHJlYW1zID0gY3RsICYgMHhGO1xuXG5cdFx0Ly8gRmlndXJlIG91dCBmaWx0ZXJcblx0XHRjdGwgPSBjdGwgPj4gNDtcblx0XHRzdHJlYW1JZCA9IGN0bCAmIDB4MztcblxuXHRcdGlmIChjdGwgPT09IDB4MDgpICAgICAgeyBjbW9kZSA9ICdmaWxsJzsgfVxuXHRcdGVsc2UgaWYgKGN0bCA9PT0gMHgwOSkgeyBjbW9kZSA9ICdqcGVnJzsgfVxuXHRcdGVsc2UgaWYgKGN0bCA9PT0gMHgwQSkgeyBjbW9kZSA9ICdwbmcnOyB9XG5cdFx0ZWxzZSBpZiAoY3RsICYgMHgwNCkgICB7IGNtb2RlID0gJ2ZpbHRlcic7IH1cblx0XHRlbHNlIGlmIChjdGwgPCAweDA0KSAgIHsgY21vZGUgPSAnY29weSc7IH1cblx0XHRlbHNlIHtcblx0XHRcdHJldHVybiB0aGlzLl9mYWlsKCdJbGxlZ2FsIHRpZ2h0IGNvbXByZXNzaW9uIHJlY2VpdmVkLCBjdGw6ICcgKyBjdGwpO1xuXHRcdH1cblxuXHRcdGlmIChpc1RpZ2h0UE5HICYmIChjbW9kZSA9PT0gJ2ZpbHRlcicgfHwgY21vZGUgPT09ICdjb3B5JykpIHtcblx0XHRcdHJldHVybiB0aGlzLl9mYWlsKCdmaWx0ZXIvY29weSByZWNlaXZlZCBpbiB0aWdodFBORyBtb2RlJyk7XG5cdFx0fVxuXG5cdFx0c3dpdGNoIChjbW9kZSkge1xuXHRcdFx0Ly8gZmlsbCB1c2UgZmJfZGVwdGggYmVjYXVzZSBUUElYRUxzIGRyb3AgdGhlIHBhZGRpbmcgYnl0ZVxuXHRcdFx0Y2FzZSAnZmlsbCc6ICAvLyBUUElYRUxcblx0XHRcdFx0dGhpcy5fRkJVLmJ5dGVzICs9IHRoaXMuX2ZiX2RlcHRoO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ2pwZWcnOiAgLy8gbWF4IGNsZW5ndGhcblx0XHRcdFx0dGhpcy5fRkJVLmJ5dGVzICs9IDM7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAncG5nJzogIC8vIG1heCBjbGVuZ3RoXG5cdFx0XHRcdHRoaXMuX0ZCVS5ieXRlcyArPSAzO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ2ZpbHRlcic6ICAvLyBmaWx0ZXIgaWQgKyBudW0gY29sb3JzIGlmIHBhbGV0dGVcblx0XHRcdFx0dGhpcy5fRkJVLmJ5dGVzICs9IDI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnY29weSc6XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9zb2NrLnJRd2FpdCgnVElHSFQgJyArIGNtb2RlLCB0aGlzLl9GQlUuYnl0ZXMpKSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdFx0Ly8gRGV0ZXJtaW5lIEZCVS5ieXRlc1xuXHRcdHN3aXRjaCAoY21vZGUpIHtcblx0XHRcdGNhc2UgJ2ZpbGwnOlxuXHRcdFx0XHR0aGlzLl9zb2NrLnJRc2tpcDgoKTsgIC8vIHNoaWZ0IG9mZiBjdGxcblx0XHRcdFx0dmFyIGNvbG9yID0gdGhpcy5fc29jay5yUXNoaWZ0Qnl0ZXModGhpcy5fZmJfZGVwdGgpO1xuXHRcdFx0XHR0aGlzLl9kaXNwbGF5LnJlbmRlclFfcHVzaCh7XG5cdFx0XHRcdFx0J3R5cGUnOiAnZmlsbCcsXG5cdFx0XHRcdFx0J3gnOiB0aGlzLl9GQlUueCxcblx0XHRcdFx0XHQneSc6IHRoaXMuX0ZCVS55LFxuXHRcdFx0XHRcdCd3aWR0aCc6IHRoaXMuX0ZCVS53aWR0aCxcblx0XHRcdFx0XHQnaGVpZ2h0JzogdGhpcy5fRkJVLmhlaWdodCxcblx0XHRcdFx0XHQnY29sb3InOiBbY29sb3JbMl0sIGNvbG9yWzFdLCBjb2xvclswXV1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAncG5nJzpcblx0XHRcdGNhc2UgJ2pwZWcnOlxuXHRcdFx0XHRjbGVuZ3RoID0gUkZCLmVuY29kaW5nSGFuZGxlcnMuZ2V0VGlnaHRDTGVuZ3RoKHRoaXMuX3NvY2suclFzbGljZSgxLCA0KSk7XG5cdFx0XHRcdHRoaXMuX0ZCVS5ieXRlcyA9IDEgKyBjbGVuZ3RoWzBdICsgY2xlbmd0aFsxXTsgIC8vIGN0bCArIGNsZW5ndGggc2l6ZSArIGpwZWctZGF0YVxuXHRcdFx0XHRpZiAodGhpcy5fc29jay5yUXdhaXQoJ1RJR0hUICcgKyBjbW9kZSwgdGhpcy5fRkJVLmJ5dGVzKSkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRcdFx0XHQvLyBXZSBoYXZlIGV2ZXJ5dGhpbmcsIHJlbmRlciBpdFxuXHRcdFx0XHR0aGlzLl9zb2NrLnJRc2tpcEJ5dGVzKDEgKyBjbGVuZ3RoWzBdKTsgIC8vIHNoaWZ0IG9mZiBjbHQgKyBjb21wYWN0IGxlbmd0aFxuXHRcdFx0XHR2YXIgaW1nID0gbmV3IEltYWdlKCk7XG5cdFx0XHRcdGltZy5zcmMgPSAnZGF0YTogaW1hZ2UvJyArIGNtb2RlICtcblx0XHRcdFx0XHRleHRyYWN0X2RhdGFfdXJpKHRoaXMuX3NvY2suclFzaGlmdEJ5dGVzKGNsZW5ndGhbMV0pKTtcblx0XHRcdFx0dGhpcy5fZGlzcGxheS5yZW5kZXJRX3B1c2goe1xuXHRcdFx0XHRcdCd0eXBlJzogJ2ltZycsXG5cdFx0XHRcdFx0J2ltZyc6IGltZyxcblx0XHRcdFx0XHQneCc6IHRoaXMuX0ZCVS54LFxuXHRcdFx0XHRcdCd5JzogdGhpcy5fRkJVLnlcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGltZyA9IG51bGw7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnZmlsdGVyJzpcblx0XHRcdFx0dmFyIGZpbHRlcklkID0gclFbclFpICsgMV07XG5cdFx0XHRcdGlmIChmaWx0ZXJJZCA9PT0gMSkge1xuXHRcdFx0XHRcdGlmICghaGFuZGxlUGFsZXR0ZSgpKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vIEZpbHRlciAwLCBDb3B5IGNvdWxkIGJlIHZhbGlkIGhlcmUsIGJ1dCBzZXJ2ZXJzIGRvbid0IHNlbmQgaXQgYXMgYW4gZXhwbGljaXQgZmlsdGVyXG5cdFx0XHRcdFx0Ly8gRmlsdGVyIDIsIEdyYWRpZW50IGlzIHZhbGlkIGJ1dCBub3QgdXNlIGlmIGpwZWcgaXMgZW5hYmxlZFxuXHRcdFx0XHRcdC8vIFRPRE8oZGlyZWN0eG1hbjEyKTogd2h5IGFyZW4ndCB3ZSBqdXN0IGNhbGxpbmcgJ19mYWlsJyBoZXJlXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCB0aWdodCBzdWJlbmNvZGluZyByZWNlaXZlZCwgZmlsdGVyOiAnICsgZmlsdGVySWQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnY29weSc6XG5cdFx0XHRcdGlmICghaGFuZGxlQ29weSgpKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblxuXHRcdHRoaXMuX0ZCVS5ieXRlcyA9IDA7XG5cdFx0dGhpcy5fRkJVLnJlY3RzLS07XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSxcblxuXHRUSUdIVDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fZW5jSGFuZGxlcnMuZGlzcGxheV90aWdodChmYWxzZSk7IH0sXG5cdFRJR0hUX1BORzogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fZW5jSGFuZGxlcnMuZGlzcGxheV90aWdodCh0cnVlKTsgfSxcblxuXHRsYXN0X3JlY3Q6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLl9GQlUucmVjdHMgPSAwO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9LFxuXG5cdGhhbmRsZV9GQl9yZXNpemU6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLl9mYl93aWR0aCA9IHRoaXMuX0ZCVS53aWR0aDtcblx0XHR0aGlzLl9mYl9oZWlnaHQgPSB0aGlzLl9GQlUuaGVpZ2h0O1xuXHRcdHRoaXMuX2Rpc3BsYXkucmVzaXplKHRoaXMuX2ZiX3dpZHRoLCB0aGlzLl9mYl9oZWlnaHQpO1xuXHRcdHRoaXMuX29uRkJSZXNpemUodGhpcywgdGhpcy5fZmJfd2lkdGgsIHRoaXMuX2ZiX2hlaWdodCk7XG5cdFx0dGhpcy5fdGltaW5nLmZidV9ydF9zdGFydCA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG5cblx0XHR0aGlzLl9GQlUuYnl0ZXMgPSAwO1xuXHRcdHRoaXMuX0ZCVS5yZWN0cyAtPSAxO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9LFxuXG5cdEV4dGVuZGVkRGVza3RvcFNpemU6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLl9GQlUuYnl0ZXMgPSAxO1xuXHRcdGlmICh0aGlzLl9zb2NrLnJRd2FpdCgnRXh0ZW5kZWREZXNrdG9wU2l6ZScsIHRoaXMuX0ZCVS5ieXRlcykpIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0XHR0aGlzLl9zdXBwb3J0c1NldERlc2t0b3BTaXplID0gdHJ1ZTtcblx0XHR2YXIgbnVtYmVyX29mX3NjcmVlbnMgPSB0aGlzLl9zb2NrLnJRcGVlazgoKTtcblxuXHRcdHRoaXMuX0ZCVS5ieXRlcyA9IDQgKyAobnVtYmVyX29mX3NjcmVlbnMgKiAxNik7XG5cdFx0aWYgKHRoaXMuX3NvY2suclF3YWl0KCdFeHRlbmRlZERlc2t0b3BTaXplJywgdGhpcy5fRkJVLmJ5dGVzKSkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRcdHRoaXMuX3NvY2suclFza2lwQnl0ZXMoMSk7ICAvLyBudW1iZXItb2Ytc2NyZWVuc1xuXHRcdHRoaXMuX3NvY2suclFza2lwQnl0ZXMoMyk7ICAvLyBwYWRkaW5nXG5cblx0XHRmb3IgKHZhciBpPTA7IGk8bnVtYmVyX29mX3NjcmVlbnM7IGkgKz0gMSkge1xuXHRcdFx0Ly8gU2F2ZSB0aGUgaWQgYW5kIGZsYWdzIG9mIHRoZSBmaXJzdCBzY3JlZW5cblx0XHRcdGlmIChpID09PSAwKSB7XG5cdFx0XHRcdHRoaXMuX3NjcmVlbl9pZCA9IHRoaXMuX3NvY2suclFzaGlmdEJ5dGVzKDQpOyAgICAvLyBpZFxuXHRcdFx0XHR0aGlzLl9zb2NrLnJRc2tpcEJ5dGVzKDIpOyAgICAgICAgICAgICAgICAgICAgICAgLy8geC1wb3NpdGlvblxuXHRcdFx0XHR0aGlzLl9zb2NrLnJRc2tpcEJ5dGVzKDIpOyAgICAgICAgICAgICAgICAgICAgICAgLy8geS1wb3NpdGlvblxuXHRcdFx0XHR0aGlzLl9zb2NrLnJRc2tpcEJ5dGVzKDIpOyAgICAgICAgICAgICAgICAgICAgICAgLy8gd2lkdGhcblx0XHRcdFx0dGhpcy5fc29jay5yUXNraXBCeXRlcygyKTsgICAgICAgICAgICAgICAgICAgICAgIC8vIGhlaWdodFxuXHRcdFx0XHR0aGlzLl9zY3JlZW5fZmxhZ3MgPSB0aGlzLl9zb2NrLnJRc2hpZnRCeXRlcyg0KTsgLy8gZmxhZ3Ncblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuX3NvY2suclFza2lwQnl0ZXMoMTYpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8qXG5cdFx0ICogVGhlIHgtcG9zaXRpb24gaW5kaWNhdGVzIHRoZSByZWFzb24gZm9yIHRoZSBjaGFuZ2U6XG5cdFx0ICpcblx0XHQgKiAgMCAtIHNlcnZlciByZXNpemVkIG9uIGl0cyBvd25cblx0XHQgKiAgMSAtIHRoaXMgY2xpZW50IHJlcXVlc3RlZCB0aGUgcmVzaXplXG5cdFx0ICogIDIgLSBhbm90aGVyIGNsaWVudCByZXF1ZXN0ZWQgdGhlIHJlc2l6ZVxuXHRcdCAqL1xuXG5cdFx0Ly8gV2UgbmVlZCB0byBoYW5kbGUgZXJyb3JzIHdoZW4gd2UgcmVxdWVzdGVkIHRoZSByZXNpemUuXG5cdFx0aWYgKHRoaXMuX0ZCVS54ID09PSAxICYmIHRoaXMuX0ZCVS55ICE9PSAwKSB7XG5cdFx0XHR2YXIgbXNnID0gJyc7XG5cdFx0XHQvLyBUaGUgeS1wb3NpdGlvbiBpbmRpY2F0ZXMgdGhlIHN0YXR1cyBjb2RlIGZyb20gdGhlIHNlcnZlclxuXHRcdFx0c3dpdGNoICh0aGlzLl9GQlUueSkge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHRcdG1zZyA9ICdyZXNpemUgaXMgYWRtaW5pc3RyYXRpdmVseSBwcm9oaWJpdGVkJztcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRtc2cgPSAnb3V0IG9mIHJlc291cmNlcyc7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDM6XG5cdFx0XHRcdFx0bXNnID0gJ2ludmFsaWQgc2NyZWVuIGxheW91dCc7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdG1zZyA9ICd1bmtub3duIHJlYXNvbic7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRkZWJ1ZygnRXh0ZW5kZWREZXNrdG9wU2l6ZSgpIHwgc2VydmVyIGRpZCBub3QgYWNjZXB0IHRoZSByZXNpemUgcmVxdWVzdDogJXMnLCBtc2cpO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0dGhpcy5fZW5jSGFuZGxlcnMuaGFuZGxlX0ZCX3Jlc2l6ZSgpO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9LFxuXG5cdERlc2t0b3BTaXplOiBmdW5jdGlvbiAoKSB7XG5cdFx0ZGVidWcoJ0Rlc2t0b3BTaXplKCknKTtcblxuXHRcdHRoaXMuX2VuY0hhbmRsZXJzLmhhbmRsZV9GQl9yZXNpemUoKTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSxcblxuXHRDdXJzb3I6IGZ1bmN0aW9uICgpIHtcblx0XHRkZWJ1ZygnQ3Vyc29yKCknKTtcblxuXHRcdHZhciB4ID0gdGhpcy5fRkJVLng7ICAvLyBob3RzcG90LXhcblx0XHR2YXIgeSA9IHRoaXMuX0ZCVS55OyAgLy8gaG90c3BvdC15XG5cdFx0dmFyIHcgPSB0aGlzLl9GQlUud2lkdGg7XG5cdFx0dmFyIGggPSB0aGlzLl9GQlUuaGVpZ2h0O1xuXG5cdFx0dmFyIHBpeGVsc2xlbmd0aCA9IHcgKiBoICogdGhpcy5fZmJfQnBwO1xuXHRcdHZhciBtYXNrbGVuZ3RoID0gTWF0aC5mbG9vcigodyArIDcpIC8gOCkgKiBoO1xuXG5cdFx0dGhpcy5fRkJVLmJ5dGVzID0gcGl4ZWxzbGVuZ3RoICsgbWFza2xlbmd0aDtcblx0XHRpZiAodGhpcy5fc29jay5yUXdhaXQoJ2N1cnNvciBlbmNvZGluZycsIHRoaXMuX0ZCVS5ieXRlcykpIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0XHR0aGlzLl9kaXNwbGF5LmNoYW5nZUN1cnNvcih0aGlzLl9zb2NrLnJRc2hpZnRCeXRlcyhwaXhlbHNsZW5ndGgpLFxuXHRcdFx0XHRcdFx0XHRcdFx0IHRoaXMuX3NvY2suclFzaGlmdEJ5dGVzKG1hc2tsZW5ndGgpLFxuXHRcdFx0XHRcdFx0XHRcdFx0IHgsIHksIHcsIGgpO1xuXG5cdFx0dGhpcy5fRkJVLmJ5dGVzID0gMDtcblx0XHR0aGlzLl9GQlUucmVjdHMtLTtcblxuXHRcdHJldHVybiB0cnVlO1xuXHR9LFxuXG5cdEpQRUdfcXVhbGl0eV9sbzogZnVuY3Rpb24gKCkge1xuXHRcdGRlYnVnZXJyb3IoJ0pQRUdfcXVhbGl0eV9sbygpIHwgc2VydmVyIHNlbnQganBlZ19xdWFsaXR5IHBzZXVkby1lbmNvZGluZycpO1xuXHR9LFxuXG5cdGNvbXByZXNzX2xvOiBmdW5jdGlvbiAoKSB7XG5cdFx0ZGVidWdlcnJvcignY29tcHJlc3NfbG8oKSB8IHNlcnZlciBzZW50IGNvbXByZXNzIGxldmVsIHBzZXVkby1lbmNvZGluZycpO1xuXHR9XG59O1xuXG5cbi8qKlxuICogUHJpdmF0ZSBBUEkuXG4gKi9cblxuXG5mdW5jdGlvbiBleHRyYWN0X2RhdGFfdXJpIChhcnIpIHtcblx0cmV0dXJuICc7YmFzZTY0LCcgKyBCYXNlNjQuZW5jb2RlKGFycik7XG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vbm9kZV9tb2R1bGVzL25vdm5jLW5vZGUvbGliL3JmYi5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ub3ZuYy1ub2RlL2xpYlwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qXG4gKiB0aW5mbGF0ZSAgLSAgdGlueSBpbmZsYXRlXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDAzIGJ5IEpvZXJnZW4gSWJzZW4gLyBKaWJ6XG4gKiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogaHR0cDovL3d3dy5pYnNlbnNvZnR3YXJlLmNvbS9cbiAqXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHByb3ZpZGVkICdhcy1pcycsIHdpdGhvdXQgYW55IGV4cHJlc3NcbiAqIG9yIGltcGxpZWQgd2FycmFudHkuICBJbiBubyBldmVudCB3aWxsIHRoZSBhdXRob3JzIGJlXG4gKiBoZWxkIGxpYWJsZSBmb3IgYW55IGRhbWFnZXMgYXJpc2luZyBmcm9tIHRoZSB1c2Ugb2ZcbiAqIHRoaXMgc29mdHdhcmUuXG4gKlxuICogUGVybWlzc2lvbiBpcyBncmFudGVkIHRvIGFueW9uZSB0byB1c2UgdGhpcyBzb2Z0d2FyZVxuICogZm9yIGFueSBwdXJwb3NlLCBpbmNsdWRpbmcgY29tbWVyY2lhbCBhcHBsaWNhdGlvbnMsXG4gKiBhbmQgdG8gYWx0ZXIgaXQgYW5kIHJlZGlzdHJpYnV0ZSBpdCBmcmVlbHksIHN1YmplY3QgdG9cbiAqIHRoZSBmb2xsb3dpbmcgcmVzdHJpY3Rpb25zOlxuICpcbiAqIDEuIFRoZSBvcmlnaW4gb2YgdGhpcyBzb2Z0d2FyZSBtdXN0IG5vdCBiZVxuICogICAgbWlzcmVwcmVzZW50ZWQ7IHlvdSBtdXN0IG5vdCBjbGFpbSB0aGF0IHlvdVxuICogICAgd3JvdGUgdGhlIG9yaWdpbmFsIHNvZnR3YXJlLiBJZiB5b3UgdXNlIHRoaXNcbiAqICAgIHNvZnR3YXJlIGluIGEgcHJvZHVjdCwgYW4gYWNrbm93bGVkZ21lbnQgaW5cbiAqICAgIHRoZSBwcm9kdWN0IGRvY3VtZW50YXRpb24gd291bGQgYmUgYXBwcmVjaWF0ZWRcbiAqICAgIGJ1dCBpcyBub3QgcmVxdWlyZWQuXG4gKlxuICogMi4gQWx0ZXJlZCBzb3VyY2UgdmVyc2lvbnMgbXVzdCBiZSBwbGFpbmx5IG1hcmtlZFxuICogICAgYXMgc3VjaCwgYW5kIG11c3Qgbm90IGJlIG1pc3JlcHJlc2VudGVkIGFzXG4gKiAgICBiZWluZyB0aGUgb3JpZ2luYWwgc29mdHdhcmUuXG4gKlxuICogMy4gVGhpcyBub3RpY2UgbWF5IG5vdCBiZSByZW1vdmVkIG9yIGFsdGVyZWQgZnJvbVxuICogICAgYW55IHNvdXJjZSBkaXN0cmlidXRpb24uXG4gKi9cblxuLypcbiAqIHRpbmZsYXRlIGphdmFzY3JpcHQgcG9ydCBieSBFcmlrIE1vbGxlciBpbiBNYXkgMjAxMS5cbiAqIGVtb2xsZXJAb3BlcmEuY29tXG4gKlxuICogcmVhZF9iaXRzKCkgcGF0Y2hlZCBieSBtaWtlQGltaWRpby5jb20gdG8gYWxsb3dcbiAqIHJlYWRpbmcgbW9yZSB0aGVuIDggYml0cyAobmVlZGVkIGluIHNvbWUgemxpYiBzdHJlYW1zKVxuICovXG5cblxuLyoqXG4gKiBFeHBvc2UgdGhlIFRJTkYgY2xhc3MuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gVElORjtcblxuXG5mdW5jdGlvbiBUSU5GKCkge1xuXHR0aGlzLk9LID0gMDtcblx0dGhpcy5EQVRBX0VSUk9SID0gKC0zKTtcblx0dGhpcy5XSU5ET1dfU0laRSA9IDMyNzY4O1xuXG5cdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqXG5cdCAqIC0tIGludGVybmFsIGRhdGEgc3RydWN0dXJlcyAtLSAqXG5cdCAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cdHRoaXMuVFJFRSA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMudGFibGUgPSBuZXcgQXJyYXkoMTYpOyAgLyogdGFibGUgb2YgY29kZSBsZW5ndGggY291bnRzICovXG5cdFx0dGhpcy50cmFucyA9IG5ldyBBcnJheSgyODgpOyAvKiBjb2RlIC0+IHN5bWJvbCB0cmFuc2xhdGlvbiB0YWJsZSAqL1xuXHR9O1xuXG5cdHRoaXMuREFUQSA9IGZ1bmN0aW9uKHRoYXQpIHtcblx0XHR0aGlzLnNvdXJjZSA9ICcnO1xuXHRcdHRoaXMuc291cmNlSW5kZXggPSAwO1xuXHRcdHRoaXMudGFnID0gMDtcblx0XHR0aGlzLmJpdGNvdW50ID0gMDtcblxuXHRcdHRoaXMuZGVzdCA9IFtdO1xuXG5cdFx0dGhpcy5oaXN0b3J5ID0gW107XG5cblx0XHR0aGlzLmx0cmVlID0gbmV3IHRoYXQuVFJFRSgpOyAvKiBkeW5hbWljIGxlbmd0aC9zeW1ib2wgdHJlZSAqL1xuXHRcdHRoaXMuZHRyZWUgPSBuZXcgdGhhdC5UUkVFKCk7IC8qIGR5bmFtaWMgZGlzdGFuY2UgdHJlZSAqL1xuXHR9O1xuXG5cdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqXG5cdCAqIC0tIHVuaW5pdGlhbGl6ZWQgZ2xvYmFsIGRhdGEgKHN0YXRpYyBzdHJ1Y3R1cmVzKSAtLSAqXG5cdCAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cdHRoaXMuc2x0cmVlID0gbmV3IHRoaXMuVFJFRSgpOyAvKiBmaXhlZCBsZW5ndGgvc3ltYm9sIHRyZWUgKi9cblx0dGhpcy5zZHRyZWUgPSBuZXcgdGhpcy5UUkVFKCk7IC8qIGZpeGVkIGRpc3RhbmNlIHRyZWUgKi9cblxuXHQvKiBleHRyYSBiaXRzIGFuZCBiYXNlIHRhYmxlcyBmb3IgbGVuZ3RoIGNvZGVzICovXG5cdHRoaXMubGVuZ3RoX2JpdHMgPSBuZXcgQXJyYXkoMzApO1xuXHR0aGlzLmxlbmd0aF9iYXNlID0gbmV3IEFycmF5KDMwKTtcblxuXHQvKiBleHRyYSBiaXRzIGFuZCBiYXNlIHRhYmxlcyBmb3IgZGlzdGFuY2UgY29kZXMgKi9cblx0dGhpcy5kaXN0X2JpdHMgPSBuZXcgQXJyYXkoMzApO1xuXHR0aGlzLmRpc3RfYmFzZSA9IG5ldyBBcnJheSgzMCk7XG5cblx0Lyogc3BlY2lhbCBvcmRlcmluZyBvZiBjb2RlIGxlbmd0aCBjb2RlcyAqL1xuXHR0aGlzLmNsY2lkeCA9IFtcblx0XHQxNiwgMTcsIDE4LCAwLCA4LCA3LCA5LCA2LFxuXHRcdDEwLCA1LCAxMSwgNCwgMTIsIDMsIDEzLCAyLFxuXHRcdDE0LCAxLCAxNVxuXHRdO1xuXG5cdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICpcblx0ICogLS0gdXRpbGl0eSBmdW5jdGlvbnMgLS0gKlxuXHQgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cdC8qIGJ1aWxkIGV4dHJhIGJpdHMgYW5kIGJhc2UgdGFibGVzICovXG5cdHRoaXMuYnVpbGRfYml0c19iYXNlID0gZnVuY3Rpb24oYml0cywgYmFzZSwgZGVsdGEsIGZpcnN0KSB7XG5cdFx0dmFyIGksIHN1bTtcblxuXHRcdC8qIGJ1aWxkIGJpdHMgdGFibGUgKi9cblx0XHRmb3IgKGkgPSAwOyBpIDwgZGVsdGE7ICsraSkge1xuXHRcdFx0Yml0c1tpXSA9IDA7XG5cdFx0fVxuXHRcdGZvciAoaSA9IDA7IGkgPCAzMCAtIGRlbHRhOyArK2kpIHtcblx0XHRcdGJpdHNbaSArIGRlbHRhXSA9IE1hdGguZmxvb3IoaSAvIGRlbHRhKTtcblx0XHR9XG5cblx0XHQvKiBidWlsZCBiYXNlIHRhYmxlICovXG5cdFx0Zm9yIChzdW0gPSBmaXJzdCwgaSA9IDA7IGkgPCAzMDsgKytpKSB7XG5cdFx0XHRiYXNlW2ldID0gc3VtO1xuXHRcdFx0c3VtICs9IDEgPDwgYml0c1tpXTtcblx0XHR9XG5cdH07XG5cblx0LyogYnVpbGQgdGhlIGZpeGVkIGh1ZmZtYW4gdHJlZXMgKi9cblx0dGhpcy5idWlsZF9maXhlZF90cmVlcyA9IGZ1bmN0aW9uKGx0LCBkdCkge1xuXHRcdHZhciBpO1xuXG5cdFx0LyogYnVpbGQgZml4ZWQgbGVuZ3RoIHRyZWUgKi9cblx0XHRmb3IgKGkgPSAwOyBpIDwgNzsgKytpKSB7IGx0LnRhYmxlW2ldID0gMDsgfVxuXG5cdFx0bHQudGFibGVbN10gPSAyNDtcblx0XHRsdC50YWJsZVs4XSA9IDE1Mjtcblx0XHRsdC50YWJsZVs5XSA9IDExMjtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCAyNDsgKytpKSB7IGx0LnRyYW5zW2ldID0gMjU2ICsgaTsgfVxuXHRcdGZvciAoaSA9IDA7IGkgPCAxNDQ7ICsraSkgeyBsdC50cmFuc1syNCArIGldID0gaTsgfVxuXHRcdGZvciAoaSA9IDA7IGkgPCA4OyArK2kpIHsgbHQudHJhbnNbMjQgKyAxNDQgKyBpXSA9IDI4MCArIGk7IH1cblx0XHRmb3IgKGkgPSAwOyBpIDwgMTEyOyArK2kpIHsgbHQudHJhbnNbMjQgKyAxNDQgKyA4ICsgaV0gPSAxNDQgKyBpOyB9XG5cblx0XHQvKiBidWlsZCBmaXhlZCBkaXN0YW5jZSB0cmVlICovXG5cdFx0Zm9yIChpID0gMDsgaSA8IDU7ICsraSkgeyBkdC50YWJsZVtpXSA9IDA7IH1cblxuXHRcdGR0LnRhYmxlWzVdID0gMzI7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgMzI7ICsraSkgeyBkdC50cmFuc1tpXSA9IGk7IH1cblx0fTtcblxuXHQvKiBnaXZlbiBhbiBhcnJheSBvZiBjb2RlIGxlbmd0aHMsIGJ1aWxkIGEgdHJlZSAqL1xuXHR0aGlzLmJ1aWxkX3RyZWUgPSBmdW5jdGlvbih0LCBsZW5ndGhzLCBsb2Zmc2V0LCBudW0pIHtcblx0XHR2YXIgb2ZmcyA9IG5ldyBBcnJheSgxNik7XG5cdFx0dmFyIGksIHN1bTtcblxuXHRcdC8qIGNsZWFyIGNvZGUgbGVuZ3RoIGNvdW50IHRhYmxlICovXG5cdFx0Zm9yIChpID0gMDsgaSA8IDE2OyArK2kpIHsgdC50YWJsZVtpXSA9IDA7IH1cblxuXHRcdC8qIHNjYW4gc3ltYm9sIGxlbmd0aHMsIGFuZCBzdW0gY29kZSBsZW5ndGggY291bnRzICovXG5cdFx0Zm9yIChpID0gMDsgaSA8IG51bTsgKytpKSB7XG5cdFx0XHR0LnRhYmxlW2xlbmd0aHNbbG9mZnNldCArIGldXSsrO1xuXHRcdH1cblxuXHRcdHQudGFibGVbMF0gPSAwO1xuXG5cdFx0LyogY29tcHV0ZSBvZmZzZXQgdGFibGUgZm9yIGRpc3RyaWJ1dGlvbiBzb3J0ICovXG5cdFx0Zm9yIChzdW0gPSAwLCBpID0gMDsgaSA8IDE2OyArK2kpIHtcblx0XHRcdG9mZnNbaV0gPSBzdW07XG5cdFx0XHRzdW0gKz0gdC50YWJsZVtpXTtcblx0XHR9XG5cblx0XHQvKiBjcmVhdGUgY29kZS0+c3ltYm9sIHRyYW5zbGF0aW9uIHRhYmxlIChzeW1ib2xzIHNvcnRlZCBieSBjb2RlKSAqL1xuXHRcdGZvciAoaSA9IDA7IGkgPCBudW07ICsraSkge1xuXHRcdFx0aWYgKGxlbmd0aHNbbG9mZnNldCArIGldKSB7XG5cdFx0XHRcdHQudHJhbnNbb2Zmc1tsZW5ndGhzW2xvZmZzZXQgKyBpXV0rK10gPSBpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tICpcblx0ICogLS0gZGVjb2RlIGZ1bmN0aW9ucyAtLSAqXG5cdCAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXHQvKiBnZXQgb25lIGJpdCBmcm9tIHNvdXJjZSBzdHJlYW0gKi9cblx0dGhpcy5nZXRiaXQgPSBmdW5jdGlvbihkKSB7XG5cdFx0dmFyIGJpdDtcblxuXHRcdC8qIGNoZWNrIGlmIHRhZyBpcyBlbXB0eSAqL1xuXHRcdGlmICghKGQuYml0Y291bnQtLSkpIHtcblx0XHRcdC8qIGxvYWQgbmV4dCB0YWcgKi9cblx0XHRcdGQudGFnID0gZC5zb3VyY2VbZC5zb3VyY2VJbmRleCsrXSAmIDB4ZmY7XG5cdFx0XHRkLmJpdGNvdW50ID0gNztcblx0XHR9XG5cblx0XHQvKiBzaGlmdCBiaXQgb3V0IG9mIHRhZyAqL1xuXHRcdGJpdCA9IGQudGFnICYgMHgwMTtcblx0XHRkLnRhZyA+Pj0gMTtcblxuXHRcdHJldHVybiBiaXQ7XG5cdH07XG5cblx0dGhpcy5yZWFkX2JpdHMgPSBmdW5jdGlvbihkLCBudW0sIGJhc2UpIHtcblx0XHRpZiAoIW51bSkge1xuXHRcdFx0cmV0dXJuIGJhc2U7XG5cdFx0fVxuXG5cdFx0dmFyIHJldCA9IHJlYWRfYml0c19kaXJlY3QoZC5zb3VyY2UsIGQuYml0Y291bnQsIGQudGFnLCBkLnNvdXJjZUluZGV4LCBudW0pO1xuXHRcdGQuYml0Y291bnQgPSByZXRbMF07XG5cdFx0ZC50YWcgPSByZXRbMV07XG5cdFx0ZC5zb3VyY2VJbmRleCA9IHJldFsyXTtcblx0XHRyZXR1cm4gcmV0WzNdICsgYmFzZTtcblx0fTtcblxuXHQvKiBnaXZlbiBhIGRhdGEgc3RyZWFtIGFuZCBhIHRyZWUsIGRlY29kZSBhIHN5bWJvbCAqL1xuXHR0aGlzLmRlY29kZV9zeW1ib2wgPSBmdW5jdGlvbihkLCB0KSB7XG5cdFx0d2hpbGUgKGQuYml0Y291bnQgPCAxNikge1xuXHRcdFx0ZC50YWcgPSBkLnRhZyB8IChkLnNvdXJjZVtkLnNvdXJjZUluZGV4KytdICYgMHhmZikgPDwgZC5iaXRjb3VudDtcblx0XHRcdGQuYml0Y291bnQgKz0gODtcblx0XHR9XG5cblx0XHR2YXIgc3VtID0gMCwgY3VyID0gMCwgbGVuID0gMDtcblx0XHRkbyB7XG5cdFx0XHRjdXIgPSAyICogY3VyICsgKChkLnRhZyAmICgxIDw8IGxlbikpID4+IGxlbik7XG5cblx0XHRcdCsrbGVuO1xuXG5cdFx0XHRzdW0gKz0gdC50YWJsZVtsZW5dO1xuXHRcdFx0Y3VyIC09IHQudGFibGVbbGVuXTtcblx0XHR9IHdoaWxlIChjdXIgPj0gMCk7XG5cblx0XHRkLnRhZyA+Pj0gbGVuO1xuXHRcdGQuYml0Y291bnQgLT0gbGVuO1xuXG5cdFx0cmV0dXJuIHQudHJhbnNbc3VtICsgY3VyXTtcblx0fTtcblxuXHQvKiBnaXZlbiBhIGRhdGEgc3RyZWFtLCBkZWNvZGUgZHluYW1pYyB0cmVlcyBmcm9tIGl0ICovXG5cdHRoaXMuZGVjb2RlX3RyZWVzID0gZnVuY3Rpb24oZCwgbHQsIGR0KSB7XG5cdFx0dmFyIGNvZGVfdHJlZSA9IG5ldyB0aGlzLlRSRUUoKTtcblx0XHR2YXIgbGVuZ3RocyA9IG5ldyBBcnJheSgyODgrMzIpO1xuXHRcdHZhciBobGl0LCBoZGlzdCwgaGNsZW47XG5cdFx0dmFyIGksIG51bSwgbGVuZ3RoO1xuXG5cdFx0LyogZ2V0IDUgYml0cyBITElUICgyNTctMjg2KSAqL1xuXHRcdGhsaXQgPSB0aGlzLnJlYWRfYml0cyhkLCA1LCAyNTcpO1xuXG5cdFx0LyogZ2V0IDUgYml0cyBIRElTVCAoMS0zMikgKi9cblx0XHRoZGlzdCA9IHRoaXMucmVhZF9iaXRzKGQsIDUsIDEpO1xuXG5cdFx0LyogZ2V0IDQgYml0cyBIQ0xFTiAoNC0xOSkgKi9cblx0XHRoY2xlbiA9IHRoaXMucmVhZF9iaXRzKGQsIDQsIDQpO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IDE5OyArK2kpIHsgbGVuZ3Roc1tpXSA9IDA7IH1cblxuXHRcdC8qIHJlYWQgY29kZSBsZW5ndGhzIGZvciBjb2RlIGxlbmd0aCBhbHBoYWJldCAqL1xuXHRcdGZvciAoaSA9IDA7IGkgPCBoY2xlbjsgKytpKSB7XG5cdFx0XHQvKiBnZXQgMyBiaXRzIGNvZGUgbGVuZ3RoICgwLTcpICovXG5cdFx0XHR2YXIgY2xlbiA9IHRoaXMucmVhZF9iaXRzKGQsIDMsIDApO1xuXG5cdFx0XHRsZW5ndGhzW3RoaXMuY2xjaWR4W2ldXSA9IGNsZW47XG5cdFx0fVxuXG5cdFx0LyogYnVpbGQgY29kZSBsZW5ndGggdHJlZSAqL1xuXHRcdHRoaXMuYnVpbGRfdHJlZShjb2RlX3RyZWUsIGxlbmd0aHMsIDAsIDE5KTtcblxuXHRcdC8qIGRlY29kZSBjb2RlIGxlbmd0aHMgZm9yIHRoZSBkeW5hbWljIHRyZWVzICovXG5cdFx0Zm9yIChudW0gPSAwOyBudW0gPCBobGl0ICsgaGRpc3Q7KSB7XG5cdFx0XHR2YXIgc3ltID0gdGhpcy5kZWNvZGVfc3ltYm9sKGQsIGNvZGVfdHJlZSk7XG5cblx0XHRcdHN3aXRjaCAoc3ltKSB7XG5cdFx0XHRjYXNlIDE2OlxuXHRcdFx0XHQvKiBjb3B5IHByZXZpb3VzIGNvZGUgbGVuZ3RoIDMtNiB0aW1lcyAocmVhZCAyIGJpdHMpICovXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR2YXIgcHJldiA9IGxlbmd0aHNbbnVtIC0gMV07XG5cdFx0XHRcdFx0Zm9yIChsZW5ndGggPSB0aGlzLnJlYWRfYml0cyhkLCAyLCAzKTsgbGVuZ3RoOyAtLWxlbmd0aCkge1xuXHRcdFx0XHRcdFx0bGVuZ3Roc1tudW0rK10gPSBwcmV2O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMTc6XG5cdFx0XHRcdC8qIHJlcGVhdCBjb2RlIGxlbmd0aCAwIGZvciAzLTEwIHRpbWVzIChyZWFkIDMgYml0cykgKi9cblx0XHRcdFx0Zm9yIChsZW5ndGggPSB0aGlzLnJlYWRfYml0cyhkLCAzLCAzKTsgbGVuZ3RoOyAtLWxlbmd0aCkge1xuXHRcdFx0XHRcdGxlbmd0aHNbbnVtKytdID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgMTg6XG5cdFx0XHRcdC8qIHJlcGVhdCBjb2RlIGxlbmd0aCAwIGZvciAxMS0xMzggdGltZXMgKHJlYWQgNyBiaXRzKSAqL1xuXHRcdFx0XHRmb3IgKGxlbmd0aCA9IHRoaXMucmVhZF9iaXRzKGQsIDcsIDExKTsgbGVuZ3RoOyAtLWxlbmd0aCkge1xuXHRcdFx0XHRcdGxlbmd0aHNbbnVtKytdID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdC8qIHZhbHVlcyAwLTE1IHJlcHJlc2VudCB0aGUgYWN0dWFsIGNvZGUgbGVuZ3RocyAqL1xuXHRcdFx0XHRsZW5ndGhzW251bSsrXSA9IHN5bTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0LyogYnVpbGQgZHluYW1pYyB0cmVlcyAqL1xuXHRcdHRoaXMuYnVpbGRfdHJlZShsdCwgbGVuZ3RocywgMCwgaGxpdCk7XG5cdFx0dGhpcy5idWlsZF90cmVlKGR0LCBsZW5ndGhzLCBobGl0LCBoZGlzdCk7XG5cdH07XG5cblx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKlxuXHQgKiAtLSBibG9jayBpbmZsYXRlIGZ1bmN0aW9ucyAtLSAqXG5cdCAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblx0LyogZ2l2ZW4gYSBzdHJlYW0gYW5kIHR3byB0cmVlcywgaW5mbGF0ZSBhIGJsb2NrIG9mIGRhdGEgKi9cblx0dGhpcy5pbmZsYXRlX2Jsb2NrX2RhdGEgPSBmdW5jdGlvbihkLCBsdCwgZHQpIHtcblx0XHQvLyBqcyBvcHRpbWl6YXRpb24uXG5cdFx0dmFyIGRkZXN0ID0gZC5kZXN0O1xuXHRcdHZhciBkZGVzdGxlbmd0aCA9IGRkZXN0Lmxlbmd0aDtcblxuXHRcdHdoaWxlICgxKSB7XG5cdFx0XHR2YXIgc3ltID0gdGhpcy5kZWNvZGVfc3ltYm9sKGQsIGx0KTtcblxuXHRcdFx0LyogY2hlY2sgZm9yIGVuZCBvZiBibG9jayAqL1xuXHRcdFx0aWYgKHN5bSA9PT0gMjU2KSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLk9LO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoc3ltIDwgMjU2KSB7XG5cdFx0XHRcdGRkZXN0W2RkZXN0bGVuZ3RoKytdID0gc3ltOyAvLyA/IFN0cmluZy5mcm9tQ2hhckNvZGUoc3ltKTtcblx0XHRcdFx0ZC5oaXN0b3J5LnB1c2goc3ltKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciBsZW5ndGgsIGRpc3QsIG9mZnM7XG5cdFx0XHRcdHZhciBpO1xuXG5cdFx0XHRcdHN5bSAtPSAyNTc7XG5cblx0XHRcdFx0LyogcG9zc2libHkgZ2V0IG1vcmUgYml0cyBmcm9tIGxlbmd0aCBjb2RlICovXG5cdFx0XHRcdGxlbmd0aCA9IHRoaXMucmVhZF9iaXRzKGQsIHRoaXMubGVuZ3RoX2JpdHNbc3ltXSwgdGhpcy5sZW5ndGhfYmFzZVtzeW1dKTtcblxuXHRcdFx0XHRkaXN0ID0gdGhpcy5kZWNvZGVfc3ltYm9sKGQsIGR0KTtcblxuXHRcdFx0XHQvKiBwb3NzaWJseSBnZXQgbW9yZSBiaXRzIGZyb20gZGlzdGFuY2UgY29kZSAqL1xuXHRcdFx0XHRvZmZzID0gZC5oaXN0b3J5Lmxlbmd0aCAtIHRoaXMucmVhZF9iaXRzKGQsIHRoaXMuZGlzdF9iaXRzW2Rpc3RdLCB0aGlzLmRpc3RfYmFzZVtkaXN0XSk7XG5cblx0XHRcdFx0aWYgKG9mZnMgPCAwKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHpsaWIgb2Zmc2V0ICcgKyBvZmZzKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8qIGNvcHkgbWF0Y2ggKi9cblx0XHRcdFx0Zm9yIChpID0gb2ZmczsgaSA8IG9mZnMgKyBsZW5ndGg7ICsraSkge1xuXHRcdFx0XHRcdC8vZGRlc3RbZGRlc3RsZW5ndGgrK10gPSBkZGVzdFtpXTtcblx0XHRcdFx0XHRkZGVzdFtkZGVzdGxlbmd0aCsrXSA9IGQuaGlzdG9yeVtpXTtcblx0XHRcdFx0XHRkLmhpc3RvcnkucHVzaChkLmhpc3RvcnlbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8qIGluZmxhdGUgYW4gdW5jb21wcmVzc2VkIGJsb2NrIG9mIGRhdGEgKi9cblx0dGhpcy5pbmZsYXRlX3VuY29tcHJlc3NlZF9ibG9jayA9IGZ1bmN0aW9uKGQpIHtcblx0XHR2YXIgbGVuZ3RoLCBpbnZsZW5ndGg7XG5cdFx0dmFyIGk7XG5cblx0XHRpZiAoZC5iaXRjb3VudCA+IDcpIHtcblx0XHRcdCB2YXIgb3ZlcmZsb3cgPSBNYXRoLmZsb29yKGQuYml0Y291bnQgLyA4KTtcblx0XHRcdCBkLnNvdXJjZUluZGV4IC09IG92ZXJmbG93O1xuXHRcdFx0IGQuYml0Y291bnQgPSAwO1xuXHRcdFx0IGQudGFnID0gMDtcblx0XHR9XG5cblx0XHQvKiBnZXQgbGVuZ3RoICovXG5cdFx0bGVuZ3RoID0gZC5zb3VyY2VbZC5zb3VyY2VJbmRleCsxXTtcblx0XHRsZW5ndGggPSAyNTYqbGVuZ3RoICsgZC5zb3VyY2VbZC5zb3VyY2VJbmRleF07XG5cblx0XHQvKiBnZXQgb25lJ3MgY29tcGxlbWVudCBvZiBsZW5ndGggKi9cblx0XHRpbnZsZW5ndGggPSBkLnNvdXJjZVtkLnNvdXJjZUluZGV4KzNdO1xuXHRcdGludmxlbmd0aCA9IDI1NippbnZsZW5ndGggKyBkLnNvdXJjZVtkLnNvdXJjZUluZGV4KzJdO1xuXG5cdFx0LyogY2hlY2sgbGVuZ3RoICovXG5cdFx0aWYgKGxlbmd0aCAhPT0gKH5pbnZsZW5ndGggJiAweDAwMDBmZmZmKSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuREFUQV9FUlJPUjtcblx0XHR9XG5cblx0XHRkLnNvdXJjZUluZGV4ICs9IDQ7XG5cblx0XHQvKiBjb3B5IGJsb2NrICovXG5cdFx0Zm9yIChpID0gbGVuZ3RoOyBpOyAtLWkpIHtcblx0XHRcdCBkLmhpc3RvcnkucHVzaChkLnNvdXJjZVtkLnNvdXJjZUluZGV4XSk7XG5cdFx0XHQgZC5kZXN0W2QuZGVzdC5sZW5ndGhdID0gZC5zb3VyY2VbZC5zb3VyY2VJbmRleCsrXTtcblx0XHR9XG5cblx0XHQvKiBtYWtlIHN1cmUgd2Ugc3RhcnQgbmV4dCBibG9jayBvbiBhIGJ5dGUgYm91bmRhcnkgKi9cblx0XHRkLmJpdGNvdW50ID0gMDtcblxuXHRcdHJldHVybiB0aGlzLk9LO1xuXHR9O1xuXG5cdC8qIGluZmxhdGUgYSBibG9jayBvZiBkYXRhIGNvbXByZXNzZWQgd2l0aCBmaXhlZCBodWZmbWFuIHRyZWVzICovXG5cdHRoaXMuaW5mbGF0ZV9maXhlZF9ibG9jayA9IGZ1bmN0aW9uKGQpIHtcblx0XHQvKiBkZWNvZGUgYmxvY2sgdXNpbmcgZml4ZWQgdHJlZXMgKi9cblx0XHRyZXR1cm4gdGhpcy5pbmZsYXRlX2Jsb2NrX2RhdGEoZCwgdGhpcy5zbHRyZWUsIHRoaXMuc2R0cmVlKTtcblx0fTtcblxuXHQvKiBpbmZsYXRlIGEgYmxvY2sgb2YgZGF0YSBjb21wcmVzc2VkIHdpdGggZHluYW1pYyBodWZmbWFuIHRyZWVzICovXG5cdHRoaXMuaW5mbGF0ZV9keW5hbWljX2Jsb2NrID0gZnVuY3Rpb24oZCkge1xuXHRcdC8qIGRlY29kZSB0cmVlcyBmcm9tIHN0cmVhbSAqL1xuXHRcdHRoaXMuZGVjb2RlX3RyZWVzKGQsIGQubHRyZWUsIGQuZHRyZWUpO1xuXG5cdFx0LyogZGVjb2RlIGJsb2NrIHVzaW5nIGRlY29kZWQgdHJlZXMgKi9cblx0XHRyZXR1cm4gdGhpcy5pbmZsYXRlX2Jsb2NrX2RhdGEoZCwgZC5sdHJlZSwgZC5kdHJlZSk7XG5cdH07XG5cblx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqXG5cdCAqIC0tIHB1YmxpYyBmdW5jdGlvbnMgLS0gKlxuXHQgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblx0LyogaW5pdGlhbGl6ZSBnbG9iYWwgKHN0YXRpYykgZGF0YSAqL1xuXHR0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHQvKiBidWlsZCBmaXhlZCBodWZmbWFuIHRyZWVzICovXG5cdFx0dGhpcy5idWlsZF9maXhlZF90cmVlcyh0aGlzLnNsdHJlZSwgdGhpcy5zZHRyZWUpO1xuXG5cdFx0LyogYnVpbGQgZXh0cmEgYml0cyBhbmQgYmFzZSB0YWJsZXMgKi9cblx0XHR0aGlzLmJ1aWxkX2JpdHNfYmFzZSh0aGlzLmxlbmd0aF9iaXRzLCB0aGlzLmxlbmd0aF9iYXNlLCA0LCAzKTtcblx0XHR0aGlzLmJ1aWxkX2JpdHNfYmFzZSh0aGlzLmRpc3RfYml0cywgdGhpcy5kaXN0X2Jhc2UsIDIsIDEpO1xuXG5cdFx0LyogZml4IGEgc3BlY2lhbCBjYXNlICovXG5cdFx0dGhpcy5sZW5ndGhfYml0c1syOF0gPSAwO1xuXHRcdHRoaXMubGVuZ3RoX2Jhc2VbMjhdID0gMjU4O1xuXG5cdFx0dGhpcy5yZXNldCgpO1xuXHR9O1xuXG5cdHRoaXMucmVzZXQgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmQgPSBuZXcgdGhpcy5EQVRBKHRoaXMpO1xuXHRcdGRlbGV0ZSB0aGlzLmhlYWRlcjtcblx0fTtcblxuXHQvKiBpbmZsYXRlIHN0cmVhbSBmcm9tIHNvdXJjZSB0byBkZXN0ICovXG5cdHRoaXMudW5jb21wcmVzcyA9IGZ1bmN0aW9uKHNvdXJjZSwgb2Zmc2V0KSB7XG5cdFx0dmFyIGQgPSB0aGlzLmQ7XG5cdFx0dmFyIGJmaW5hbDtcblxuXHRcdC8qIGluaXRpYWxpc2UgZGF0YSAqL1xuXHRcdGQuc291cmNlID0gc291cmNlO1xuXHRcdGQuc291cmNlSW5kZXggPSBvZmZzZXQ7XG5cdFx0ZC5iaXRjb3VudCA9IDA7XG5cblx0XHRkLmRlc3QgPSBbXTtcblxuXHRcdC8vIFNraXAgemxpYiBoZWFkZXIgYXQgc3RhcnQgb2Ygc3RyZWFtXG5cdFx0aWYgKHR5cGVvZiB0aGlzLmhlYWRlciA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdHRoaXMuaGVhZGVyID0gdGhpcy5yZWFkX2JpdHMoZCwgMTYsIDApO1xuXHRcdFx0LyogYnl0ZSAwOiAweDc4LCA3ID0gMzJrIHdpbmRvdyBzaXplLCA4ID0gZGVmbGF0ZSAqL1xuXHRcdFx0LyogYnl0ZSAxOiBjaGVjayBiaXRzIGZvciBoZWFkZXIgYW5kIG90aGVyIGZsYWdzICovXG5cdFx0fVxuXG5cdFx0dmFyIGJsb2NrcyA9IDA7XG5cblx0XHRkbyB7XG5cdFx0XHR2YXIgYnR5cGU7XG5cdFx0XHR2YXIgcmVzO1xuXG5cdFx0XHQvKiByZWFkIGZpbmFsIGJsb2NrIGZsYWcgKi9cblx0XHRcdGJmaW5hbCA9IHRoaXMuZ2V0Yml0KGQpO1xuXG5cdFx0XHQvKiByZWFkIGJsb2NrIHR5cGUgKDIgYml0cykgKi9cblx0XHRcdGJ0eXBlID0gdGhpcy5yZWFkX2JpdHMoZCwgMiwgMCk7XG5cblx0XHRcdC8qIGRlY29tcHJlc3MgYmxvY2sgKi9cblx0XHRcdHN3aXRjaCAoYnR5cGUpIHtcblx0XHRcdGNhc2UgMDpcblx0XHRcdFx0LyogZGVjb21wcmVzcyB1bmNvbXByZXNzZWQgYmxvY2sgKi9cblx0XHRcdFx0cmVzID0gdGhpcy5pbmZsYXRlX3VuY29tcHJlc3NlZF9ibG9jayhkKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdC8qIGRlY29tcHJlc3MgYmxvY2sgd2l0aCBmaXhlZCBodWZmbWFuIHRyZWVzICovXG5cdFx0XHRcdHJlcyA9IHRoaXMuaW5mbGF0ZV9maXhlZF9ibG9jayhkKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdC8qIGRlY29tcHJlc3MgYmxvY2sgd2l0aCBkeW5hbWljIGh1ZmZtYW4gdHJlZXMgKi9cblx0XHRcdFx0cmVzID0gdGhpcy5pbmZsYXRlX2R5bmFtaWNfYmxvY2soZCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuIHsgJ3N0YXR1cycgOiB0aGlzLkRBVEFfRVJST1IgfTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHJlcyAhPT0gdGhpcy5PSykge1xuXHRcdFx0XHRyZXR1cm4geyAnc3RhdHVzJyA6IHRoaXMuREFUQV9FUlJPUiB9O1xuXHRcdFx0fVxuXHRcdFx0YmxvY2tzKys7XG5cblx0XHR9IHdoaWxlICghYmZpbmFsICYmIGQuc291cmNlSW5kZXggPCBkLnNvdXJjZS5sZW5ndGgpO1xuXG5cdFx0ZC5oaXN0b3J5ID0gZC5oaXN0b3J5LnNsaWNlKC10aGlzLldJTkRPV19TSVpFKTtcblxuXHRcdHJldHVybiB7ICdzdGF0dXMnIDogdGhpcy5PSywgJ2RhdGEnIDogZC5kZXN0IH07XG5cdH07XG59XG5cblxuLyoqXG4gKiBQcml2YXRlIEFQSS5cbiAqL1xuXG5cbi8qIHJlYWQgYSBudW0gYml0IHZhbHVlIGZyb20gYSBzdHJlYW0gYW5kIGFkZCBiYXNlICovXG5mdW5jdGlvbiByZWFkX2JpdHNfZGlyZWN0KHNvdXJjZSwgYml0Y291bnQsIHRhZywgaWR4LCBudW0pIHtcblx0dmFyIHZhbCA9IDA7XG5cblx0d2hpbGUgKGJpdGNvdW50IDwgMjQpIHtcblx0XHR0YWcgPSB0YWcgfCAoc291cmNlW2lkeCsrXSAmIDB4ZmYpIDw8IGJpdGNvdW50O1xuXHRcdGJpdGNvdW50ICs9IDg7XG5cdH1cblxuXHR2YWwgPSB0YWcgJiAoMHhmZmZmID4+ICgxNiAtIG51bSkpO1xuXHR0YWcgPj49IG51bTtcblx0Yml0Y291bnQgLT0gbnVtO1xuXHRyZXR1cm4gW2JpdGNvdW50LCB0YWcsIGlkeCwgdmFsXTtcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ub2RlX21vZHVsZXMvbm92bmMtbm9kZS9saWIvdGluZi5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ub3ZuYy1ub2RlL2xpYlwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qXG4gKiBub1ZOQzogSFRNTDUgVk5DIGNsaWVudFxuICogQ29weXJpZ2h0IChDKSAyMDEyIEpvZWwgTWFydGluXG4gKiBMaWNlbnNlZCB1bmRlciBNUEwgMi4wIChzZWUgTElDRU5TRS50eHQpXG4gKi9cblxuXG4vKipcbiAqIERlcGVuZGVuY2llcy5cbiAqL1xudmFyIGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnbm9WTkM6VXRpbCcpO1xudmFyIGRlYnVnZXJyb3IgPSByZXF1aXJlKCdkZWJ1ZycpKCdub1ZOQzpFUlJPUjpVdGlsJyk7XG5kZWJ1Z2Vycm9yLmxvZyA9IGNvbnNvbGUud2Fybi5iaW5kKGNvbnNvbGUpO1xuXG5cbi8qKlxuICogTG9jYWwgdmFyaWFibGVzLlxuICovXG52YXIgY3Vyc29yX3VyaXNfc3VwcG9ydGVkID0gbnVsbDtcblxuXG52YXIgVXRpbCA9IG1vZHVsZS5leHBvcnRzID0ge1xuXHRwdXNoODogZnVuY3Rpb24gKGFycmF5LCBudW0pIHtcblx0XHRhcnJheS5wdXNoKG51bSAmIDB4RkYpO1xuXHR9LFxuXG5cdHB1c2gxNjogZnVuY3Rpb24gKGFycmF5LCBudW0pIHtcblx0XHRhcnJheS5wdXNoKChudW0gPj4gOCkgJiAweEZGLFxuXHRcdFx0XHRcdFx0bnVtICYgMHhGRik7XG5cdH0sXG5cblx0cHVzaDMyOiBmdW5jdGlvbiAoYXJyYXksIG51bSkge1xuXHRcdGFycmF5LnB1c2goKG51bSA+PiAyNCkgJiAweEZGLFxuXHRcdFx0XHRcdCAobnVtID4+IDE2KSAmIDB4RkYsXG5cdFx0XHRcdFx0IChudW0gPj4gOCkgJiAweEZGLFxuXHRcdFx0XHRcdCBudW0gJiAweEZGKTtcblx0fSxcblxuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWU6IChmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKGdsb2JhbC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcblx0XHRcdHJldHVybiBnbG9iYWwucmVxdWVzdEFuaW1hdGlvbkZyYW1lLmJpbmQoZ2xvYmFsKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoZ2xvYmFsLndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSkge1xuXHRcdFx0cmV0dXJuIGdsb2JhbC53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUuYmluZChnbG9iYWwpO1xuXHRcdH1cblx0XHRlbHNlIGlmIChnbG9iYWwubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG5cdFx0XHRyZXR1cm4gZ2xvYmFsLm1velJlcXVlc3RBbmltYXRpb25GcmFtZS5iaW5kKGdsb2JhbCk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGdsb2JhbC5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG5cdFx0XHRyZXR1cm4gZ2xvYmFsLm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUuYmluZChnbG9iYWwpO1xuXHRcdH1cblx0XHRlbHNlIGlmIChnbG9iYWwubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcblx0XHRcdHJldHVybiBnbG9iYWwubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUuYmluZChnbG9iYWwpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbihjYWxsYmFjaykge1xuXHRcdFx0XHRzZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xuXHRcdFx0fTtcblx0XHR9XG5cdH0pKCksXG5cblx0bWFrZV9wcm9wZXJ0aWVzOiBmdW5jdGlvbiAoY29uc3RydWN0b3IsIGFycikge1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRtYWtlX3Byb3BlcnR5KGNvbnN0cnVjdG9yLnByb3RvdHlwZSwgYXJyW2ldWzBdLCBhcnJbaV1bMV0sIGFycltpXVsyXSk7XG5cdFx0fVxuXHR9LFxuXG5cdHNldF9kZWZhdWx0czogZnVuY3Rpb24gKG9iaiwgY29uZiwgZGVmYXVsdHMpIHtcblx0XHR2YXIgZGVmYXVsdHNfa2V5cyA9IE9iamVjdC5rZXlzKGRlZmF1bHRzKTtcblx0XHR2YXIgY29uZl9rZXlzID0gT2JqZWN0LmtleXMoY29uZik7XG5cdFx0dmFyIGtleXNfb2JqID0ge307XG5cdFx0dmFyIGk7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgZGVmYXVsdHNfa2V5cy5sZW5ndGg7IGkrKykgeyBrZXlzX29ialtkZWZhdWx0c19rZXlzW2ldXSA9IDE7IH1cblx0XHRmb3IgKGkgPSAwOyBpIDwgY29uZl9rZXlzLmxlbmd0aDsgaSsrKSB7IGtleXNfb2JqW2NvbmZfa2V5c1tpXV0gPSAxOyB9XG5cblx0XHR2YXIga2V5cyA9IE9iamVjdC5rZXlzKGtleXNfb2JqKTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgc2V0dGVyID0gb2JqWydfcmF3X3NldF8nICsga2V5c1tpXV07XG5cblx0XHRcdGlmICghc2V0dGVyKSB7XG5cdFx0XHRcdGRlYnVnZXJyb3IoJ2ludmFsaWQgcHJvcGVydHk6ICVzJywga2V5c1tpXSk7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoa2V5c1tpXSBpbiBjb25mKSB7XG5cdFx0XHRcdHNldHRlci5jYWxsKG9iaiwgY29uZltrZXlzW2ldXSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZXR0ZXIuY2FsbChvYmosIGRlZmF1bHRzW2tleXNbaV1dKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0ZGVjb2RlVVRGODogZnVuY3Rpb24gKHV0ZjhzdHJpbmcpIHtcblx0XHRyZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGVzY2FwZSh1dGY4c3RyaW5nKSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEdldCBET00gZWxlbWVudCBwb3NpdGlvbiBvbiBwYWdlLlxuXHQgKi9cblx0Z2V0UG9zaXRpb246IGZ1bmN0aW9uIChvYmopIHtcblx0XHQvLyBOQihzcm9zcyk6IHRoZSBNb3ppbGxhIGRldmVsb3BlciByZWZlcmVuY2Ugc2VlbXMgdG8gaW5kaWNhdGUgdGhhdFxuXHRcdC8vIGdldEJvdW5kaW5nQ2xpZW50UmVjdCBpbmNsdWRlcyBib3JkZXIgYW5kIHBhZGRpbmcsIHNvIHRoZSBjYW52YXNcblx0XHQvLyBzdHlsZSBzaG91bGQgTk9UIGluY2x1ZGUgZWl0aGVyLlxuXHRcdHZhciBvYmpQb3NpdGlvbiA9IG9iai5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuXHRcdHJldHVybiB7J3gnOiBvYmpQb3NpdGlvbi5sZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0LCAneSc6IG9ialBvc2l0aW9uLnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldCxcblx0XHRcdFx0XHRcdCd3aWR0aCc6IG9ialBvc2l0aW9uLndpZHRoLCAnaGVpZ2h0Jzogb2JqUG9zaXRpb24uaGVpZ2h0fTtcblx0fSxcblxuXHQvKipcblx0ICogR2V0IG1vdXNlIGV2ZW50IHBvc2l0aW9uIGluIERPTSBlbGVtZW50XG5cdCAqL1xuXHRnZXRFdmVudFBvc2l0aW9uOiBmdW5jdGlvbiAoZSwgb2JqLCBzY2FsZSwgem9vbSkge1xuXHRcdHZhciBldnQsIGRvY1gsIGRvY1ksIHBvcztcblxuXHRcdGlmICh0eXBlb2Ygem9vbSA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdHpvb20gPSAxLjA7XG5cdFx0fVxuXHRcdGV2dCA9IChlID8gZSA6IGdsb2JhbC5ldmVudCk7XG5cdFx0ZXZ0ID0gKGV2dC5jaGFuZ2VkVG91Y2hlcyA/IGV2dC5jaGFuZ2VkVG91Y2hlc1swXSA6IGV2dC50b3VjaGVzID8gZXZ0LnRvdWNoZXNbMF0gOiBldnQpO1xuXHRcdGlmIChldnQucGFnZVggfHwgZXZ0LnBhZ2VZKSB7XG5cdFx0XHRkb2NYID0gZXZ0LnBhZ2VYO1xuXHRcdFx0ZG9jWSA9IGV2dC5wYWdlWTtcblx0XHRcdGRvY1ggPSBldnQucGFnZVgvem9vbTtcblx0XHRcdGRvY1kgPSBldnQucGFnZVkvem9vbTtcblx0XHR9IGVsc2UgaWYgKGV2dC5jbGllbnRYIHx8IGV2dC5jbGllbnRZKSB7XG5cdFx0XHRkb2NYID0gZXZ0LmNsaWVudFggKyBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgK1xuXHRcdFx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdDtcblx0XHRcdGRvY1kgPSBldnQuY2xpZW50WSArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wICtcblx0XHRcdFx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcblx0XHR9XG5cdFx0cG9zID0gVXRpbC5nZXRQb3NpdGlvbihvYmopO1xuXHRcdGlmICh0eXBlb2Ygc2NhbGUgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRzY2FsZSA9IDE7XG5cdFx0fVxuXG5cdFx0dmFyIHJlYWx4ID0gZG9jWCAtIHBvcy54O1xuXHRcdHZhciByZWFseSA9IGRvY1kgLSBwb3MueTtcblx0XHR2YXIgeCA9IE1hdGgubWF4KE1hdGgubWluKHJlYWx4LCBwb3Mud2lkdGggLSAxKSwgMCk7XG5cdFx0dmFyIHkgPSBNYXRoLm1heChNYXRoLm1pbihyZWFseSwgcG9zLmhlaWdodCAtIDEpLCAwKTtcblxuXHRcdHJldHVybiB7J3gnOiB4IC8gc2NhbGUsICd5JzogeSAvIHNjYWxlLCAncmVhbHgnOiByZWFseCAvIHNjYWxlLCAncmVhbHknOiByZWFseSAvIHNjYWxlfTtcblx0fSxcblxuXHRhZGRFdmVudDogZnVuY3Rpb24gKG9iaiwgZXZUeXBlLCBmbikge1xuXHRcdGlmIChvYmouYXR0YWNoRXZlbnQpIHtcblx0XHRcdHZhciByID0gb2JqLmF0dGFjaEV2ZW50KCdvbicgKyBldlR5cGUsIGZuKTtcblx0XHRcdHJldHVybiByO1xuXHRcdH0gZWxzZSBpZiAob2JqLmFkZEV2ZW50TGlzdGVuZXIpIHtcblx0XHRcdG9iai5hZGRFdmVudExpc3RlbmVyKGV2VHlwZSwgZm4sIGZhbHNlKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ2hhbmRsZXIgY291bGQgbm90IGJlIGF0dGFjaGVkJyk7XG5cdFx0fVxuXHR9LFxuXG5cdHJlbW92ZUV2ZW50OiBmdW5jdGlvbiAob2JqLCBldlR5cGUsIGZuKSB7XG5cdFx0aWYgKG9iai5kZXRhY2hFdmVudCkge1xuXHRcdFx0dmFyIHIgPSBvYmouZGV0YWNoRXZlbnQoJ29uJyArIGV2VHlwZSwgZm4pO1xuXHRcdFx0cmV0dXJuIHI7XG5cdFx0fSBlbHNlIGlmIChvYmoucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xuXHRcdFx0b2JqLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZUeXBlLCBmbiwgZmFsc2UpO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignaGFuZGxlciBjb3VsZCBub3QgYmUgcmVtb3ZlZCcpO1xuXHRcdH1cblx0fSxcblxuXHRzdG9wRXZlbnQ6IGZ1bmN0aW9uIChlKSB7XG5cdFx0aWYgKGUuc3RvcFByb3BhZ2F0aW9uKSB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IH1cblx0XHRlbHNlICAgICAgICAgICAgICAgICAgIHsgZS5jYW5jZWxCdWJibGUgPSB0cnVlOyB9XG5cblx0XHRpZiAoZS5wcmV2ZW50RGVmYXVsdCkgIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyB9XG5cdFx0ZWxzZSAgICAgICAgICAgICAgICAgICB7IGUucmV0dXJuVmFsdWUgPSBmYWxzZTsgfVxuXHR9LFxuXG5cdGJyb3dzZXJTdXBwb3J0c0N1cnNvclVSSXM6IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAoY3Vyc29yX3VyaXNfc3VwcG9ydGVkID09PSBudWxsKSB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHR2YXIgdGFyZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cblx0XHRcdFx0dGFyZ2V0LnN0eWxlLmN1cnNvciA9ICd1cmwoXCJkYXRhOmltYWdlL3gtaWNvbjtiYXNlNjQsQUFBQ0FBRUFDQWdBQUFJQUFnQTRBUUFBRmdBQUFDZ0FBQUFJQUFBQUVBQUFBQUVBSUFBQUFBQUFFQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUQvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL0FBQUFBQUFBQUFBQUFBQUFBQUFBQUE9PVwiKSAyIDIsIGRlZmF1bHQnO1xuXG5cdFx0XHRcdGlmICh0YXJnZXQuc3R5bGUuY3Vyc29yKSB7XG5cdFx0XHRcdFx0ZGVidWcoJ2RhdGEgVVJJIHNjaGVtZSBjdXJzb3Igc3VwcG9ydGVkJyk7XG5cdFx0XHRcdFx0Y3Vyc29yX3VyaXNfc3VwcG9ydGVkID0gdHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRkZWJ1Z2Vycm9yKCdkYXRhIFVSSSBzY2hlbWUgY3Vyc29yIG5vdCBzdXBwb3J0ZWQnKTtcblx0XHRcdFx0XHRjdXJzb3JfdXJpc19zdXBwb3J0ZWQgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBjYXRjaCAoZXhjKSB7XG5cdFx0XHRcdGRlYnVnZXJyb3IoJ2RhdGEgVVJJIHNjaGVtZSBjdXJzb3IgdGVzdCBleGNlcHRpb246ICcgKyBleGMpO1xuXHRcdFx0XHRjdXJzb3JfdXJpc19zdXBwb3J0ZWQgPSBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gY3Vyc29yX3VyaXNfc3VwcG9ydGVkO1xuXHR9XG59O1xuXG5cbi8qKlxuICogUHJpdmF0ZSBBUEkuXG4gKi9cblxuXG5mdW5jdGlvbiBtYWtlX3Byb3BlcnR5IChwcm90bywgbmFtZSwgbW9kZSwgdHlwZSkge1xuXHR2YXIgZ2V0dGVyO1xuXG5cdGlmICh0eXBlID09PSAnYXJyJykge1xuXHRcdGdldHRlciA9IGZ1bmN0aW9uIChpZHgpIHtcblx0XHRcdGlmICh0eXBlb2YgaWR4ICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRyZXR1cm4gdGhpc1snXycgKyBuYW1lXVtpZHhdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIHRoaXNbJ18nICsgbmFtZV07XG5cdFx0XHR9XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRnZXR0ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzWydfJyArIG5hbWVdO1xuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBtYWtlX3NldHRlciAocHJvY2Vzc192YWwpIHtcblx0XHRpZiAocHJvY2Vzc192YWwpIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbiAodmFsLCBpZHgpIHtcblx0XHRcdFx0aWYgKHR5cGVvZiBpZHggIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdFx0dGhpc1snXycgKyBuYW1lXVtpZHhdID0gcHJvY2Vzc192YWwodmFsKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzWydfJyArIG5hbWVdID0gcHJvY2Vzc192YWwodmFsKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh2YWwsIGlkeCkge1xuXHRcdFx0XHRpZiAodHlwZW9mIGlkeCAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHR0aGlzWydfJyArIG5hbWVdW2lkeF0gPSB2YWw7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpc1snXycgKyBuYW1lXSA9IHZhbDtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XG5cdH1cblxuXHR2YXIgc2V0dGVyO1xuXG5cdGlmICh0eXBlID09PSAnYm9vbCcpIHtcblx0XHRzZXR0ZXIgPSBtYWtlX3NldHRlcihmdW5jdGlvbiAodmFsKSB7XG5cdFx0XHRpZiAoIXZhbCB8fCAodmFsIGluIHsnMCc6IDEsICdubyc6IDEsICdmYWxzZSc6IDF9KSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSBlbHNlIGlmICh0eXBlID09PSAnaW50Jykge1xuXHRcdHNldHRlciA9IG1ha2Vfc2V0dGVyKGZ1bmN0aW9uICh2YWwpIHsgcmV0dXJuIHBhcnNlSW50KHZhbCwgMTApOyB9KTtcblx0fSBlbHNlIGlmICh0eXBlID09PSAnZmxvYXQnKSB7XG5cdFx0c2V0dGVyID0gbWFrZV9zZXR0ZXIocGFyc2VGbG9hdCk7XG5cdH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cicpIHtcblx0XHRzZXR0ZXIgPSBtYWtlX3NldHRlcihTdHJpbmcpO1xuXHR9IGVsc2UgaWYgKHR5cGUgPT09ICdmdW5jJykge1xuXHRcdHNldHRlciA9IG1ha2Vfc2V0dGVyKGZ1bmN0aW9uICh2YWwpIHtcblx0XHRcdGlmICghdmFsKSB7XG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7fTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiB2YWw7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0gZWxzZSBpZiAodHlwZSA9PT0gJ2FycicgfHwgdHlwZSA9PT0gJ2RvbScgfHwgdHlwZSA9PT0gJ3JhdycpIHtcblx0XHRzZXR0ZXIgPSBtYWtlX3NldHRlcigpO1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcigndW5rbm93biBwcm9wZXJ0eSB0eXBlICcgKyB0eXBlKTsgIC8vIHNvbWUgc2FuaXR5IGNoZWNraW5nXG5cdH1cblxuXHQvLyBzZXQgdGhlIGdldHRlclxuXHRpZiAodHlwZW9mIHByb3RvWydnZXRfJyArIG5hbWVdID09PSAndW5kZWZpbmVkJykge1xuXHRcdHByb3RvWydnZXRfJyArIG5hbWVdID0gZ2V0dGVyO1xuXHR9XG5cblx0Ly8gc2V0IHRoZSBzZXR0ZXIgaWYgbmVlZGVkXG5cdGlmICh0eXBlb2YgcHJvdG9bJ3NldF8nICsgbmFtZV0gPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0aWYgKG1vZGUgPT09ICdydycpIHtcblx0XHRcdHByb3RvWydzZXRfJyArIG5hbWVdID0gc2V0dGVyO1xuXHRcdH0gZWxzZSBpZiAobW9kZSA9PT0gJ3dvJykge1xuXHRcdFx0cHJvdG9bJ3NldF8nICsgbmFtZV0gPSBmdW5jdGlvbiAodmFsLCBpZHgpIHtcblx0XHRcdFx0aWYgKHR5cGVvZiB0aGlzWydfJyArIG5hbWVdICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihuYW1lICsgJyBjYW4gb25seSBiZSBzZXQgb25jZScpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHNldHRlci5jYWxsKHRoaXMsIHZhbCwgaWR4KTtcblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cblx0Ly8gbWFrZSBhIHNwZWNpYWwgc2V0dGVyIHRoYXQgd2UgY2FuIHVzZSBpbiBzZXQgZGVmYXVsdHNcblx0cHJvdG9bJ19yYXdfc2V0XycgKyBuYW1lXSA9IGZ1bmN0aW9uICh2YWwsIGlkeCkge1xuXHRcdHNldHRlci5jYWxsKHRoaXMsIHZhbCwgaWR4KTtcblx0XHQvL2RlbGV0ZSB0aGlzWydfaW5pdF9zZXRfJyArIG5hbWVdOyAgLy8gcmVtb3ZlIGl0IGFmdGVyIHVzZVxuXHR9O1xufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ub3ZuYy1ub2RlL2xpYi91dGlsLmpzXCIsXCIvLi4vLi4vbm9kZV9tb2R1bGVzL25vdm5jLW5vZGUvbGliXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLypcbiAqIFdlYnNvY2s6IGhpZ2gtcGVyZm9ybWFuY2UgYmluYXJ5IFdlYlNvY2tldHNcbiAqIENvcHlyaWdodCAoQykgMjAxMiBKb2VsIE1hcnRpblxuICogTGljZW5zZWQgdW5kZXIgTVBMIDIuMCAoc2VlIExJQ0VOU0UudHh0KVxuICpcbiAqIFdlYnNvY2sgaXMgc2ltaWxhciB0byB0aGUgc3RhbmRhcmQgV2ViU29ja2V0IG9iamVjdCBidXQgV2Vic29ja1xuICogZW5hYmxlcyBjb21tdW5pY2F0aW9uIHdpdGggcmF3IFRDUCBzb2NrZXRzIChpLmUuIHRoZSBiaW5hcnkgc3RyZWFtKVxuICogdmlhIHdlYnNvY2tpZnkuIFRoaXMgaXMgYWNjb21wbGlzaGVkIGJ5IGJhc2U2NCBlbmNvZGluZyB0aGUgZGF0YVxuICogc3RyZWFtIGJldHdlZW4gV2Vic29jayBhbmQgd2Vic29ja2lmeS5cbiAqXG4gKiBXZWJzb2NrIGhhcyBidWlsdC1pbiByZWNlaXZlIHF1ZXVlIGJ1ZmZlcmluZzsgdGhlIG1lc3NhZ2UgZXZlbnRcbiAqIGRvZXMgbm90IGNvbnRhaW4gYWN0dWFsIGRhdGEgYnV0IGlzIHNpbXBseSBhIG5vdGlmaWNhdGlvbiB0aGF0XG4gKiB0aGVyZSBpcyBuZXcgZGF0YSBhdmFpbGFibGUuIFNldmVyYWwgclEqIG1ldGhvZHMgYXJlIGF2YWlsYWJsZSB0b1xuICogcmVhZCBiaW5hcnkgZGF0YSBvZmYgb2YgdGhlIHJlY2VpdmUgcXVldWUuXG4gKi9cblxuXG4vKipcbiAqIERlcGVuZGVuY2llcy5cbiAqL1xudmFyIGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnbm9WTkM6V2Vic29jaycpO1xudmFyIGRlYnVnZXJyb3IgPSByZXF1aXJlKCdkZWJ1ZycpKCdub1ZOQzpFUlJPUjpXZWJzb2NrJyk7XG5kZWJ1Z2Vycm9yLmxvZyA9IGNvbnNvbGUud2Fybi5iaW5kKGNvbnNvbGUpO1xudmFyIGJyb3dzZXIgPSByZXF1aXJlKCdib3dzZXInKS5icm93c2VyO1xudmFyIEJhc2U2NCA9IHJlcXVpcmUoJy4vYmFzZTY0Jyk7XG5cblxuLyoqXG4gKiBFeHBvc2UgV2Vic29jayBjbGFzcy5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBXZWJzb2NrO1xuXG5cbmZ1bmN0aW9uIFdlYnNvY2soKSB7XG5cdHRoaXMuX3dlYnNvY2tldCA9IG51bGw7ICAvLyBXZWJTb2NrZXQgb2JqZWN0XG5cdHRoaXMuX3JRID0gW107ICAgICAgICAgICAvLyBSZWNlaXZlIHF1ZXVlXG5cdHRoaXMuX3JRaSA9IDA7ICAgICAgICAgICAvLyBSZWNlaXZlIHF1ZXVlIGluZGV4XG5cdHRoaXMuX3JRbWF4ID0gMTAwMDA7ICAgICAvLyBNYXggcmVjZWl2ZSBxdWV1ZSBzaXplIGJlZm9yZSBjb21wYWN0aW5nXG5cdHRoaXMuX3NRID0gW107ICAgICAgICAgICAvLyBTZW5kIHF1ZXVlXG5cblx0dGhpcy5fbW9kZSA9ICdiYXNlNjQnOyAgICAvLyBDdXJyZW50IFdlYlNvY2tldCBtb2RlOiAnYmluYXJ5JywgJ2Jhc2U2NCdcblx0dGhpcy5tYXhCdWZmZXJlZEFtb3VudCA9IDIwMDtcblxuXHR0aGlzLl9ldmVudEhhbmRsZXJzID0ge1xuXHRcdCdtZXNzYWdlJzogZnVuY3Rpb24gKCkge30sXG5cdFx0J29wZW4nOiBmdW5jdGlvbiAoKSB7fSxcblx0XHQnY2xvc2UnOiBmdW5jdGlvbiAoKSB7fSxcblx0XHQnZXJyb3InOiBmdW5jdGlvbiAoKSB7fVxuXHR9O1xufVxuXG5cbldlYnNvY2sucHJvdG90eXBlID0ge1xuXHQvLyBHZXR0ZXJzIGFuZCBTZXR0ZXJzXG5cdGdldF9zUTogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLl9zUTtcblx0fSxcblxuXHRnZXRfclE6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gdGhpcy5fclE7XG5cdH0sXG5cblx0Z2V0X3JRaTogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB0aGlzLl9yUWk7XG5cdH0sXG5cblx0c2V0X3JRaTogZnVuY3Rpb24gKHZhbCkge1xuXHRcdHRoaXMuX3JRaSA9IHZhbDtcblx0fSxcblxuXHQvLyBSZWNlaXZlIFF1ZXVlXG5cdHJRbGVuOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX3JRLmxlbmd0aCAtIHRoaXMuX3JRaTtcblx0fSxcblxuXHRyUXBlZWs4OiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX3JRW3RoaXMuX3JRaV07XG5cdH0sXG5cblx0clFzaGlmdDg6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gdGhpcy5fclFbdGhpcy5fclFpKytdO1xuXHR9LFxuXG5cdHJRc2tpcDg6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLl9yUWkrKztcblx0fSxcblxuXHRyUXNraXBCeXRlczogZnVuY3Rpb24gKG51bSkge1xuXHRcdHRoaXMuX3JRaSArPSBudW07XG5cdH0sXG5cblx0clF1bnNoaWZ0ODogZnVuY3Rpb24gKG51bSkge1xuXHRcdGlmICh0aGlzLl9yUWkgPT09IDApIHtcblx0XHRcdHRoaXMuX3JRLnVuc2hpZnQobnVtKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5fclFpLS07XG5cdFx0XHR0aGlzLl9yUVt0aGlzLl9yUWldID0gbnVtO1xuXHRcdH1cblx0fSxcblxuXHRyUXNoaWZ0MTY6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gKHRoaXMuX3JRW3RoaXMuX3JRaSsrXSA8PCA4KSArXG5cdFx0XHQgICB0aGlzLl9yUVt0aGlzLl9yUWkrK107XG5cdH0sXG5cblx0clFzaGlmdDMyOiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuICh0aGlzLl9yUVt0aGlzLl9yUWkrK10gPDwgMjQpICtcblx0XHRcdCAgICh0aGlzLl9yUVt0aGlzLl9yUWkrK10gPDwgMTYpICtcblx0XHRcdCAgICh0aGlzLl9yUVt0aGlzLl9yUWkrK10gPDwgOCkgK1xuXHRcdFx0ICAgdGhpcy5fclFbdGhpcy5fclFpKytdO1xuXHR9LFxuXG5cdHJRc2hpZnRTdHI6IGZ1bmN0aW9uIChsZW4pIHtcblx0XHRpZiAodHlwZW9mKGxlbikgPT09ICd1bmRlZmluZWQnKSB7IGxlbiA9IHRoaXMuclFsZW4oKTsgfVxuXHRcdHZhciBhcnIgPSB0aGlzLl9yUS5zbGljZSh0aGlzLl9yUWksIHRoaXMuX3JRaSArIGxlbik7XG5cdFx0dGhpcy5fclFpICs9IGxlbjtcblx0XHRyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBhcnIpO1xuXHR9LFxuXG5cdHJRc2hpZnRCeXRlczogZnVuY3Rpb24gKGxlbikge1xuXHRcdGlmICh0eXBlb2YobGVuKSA9PT0gJ3VuZGVmaW5lZCcpIHsgbGVuID0gdGhpcy5yUWxlbigpOyB9XG5cdFx0dGhpcy5fclFpICs9IGxlbjtcblx0XHRyZXR1cm4gdGhpcy5fclEuc2xpY2UodGhpcy5fclFpIC0gbGVuLCB0aGlzLl9yUWkpO1xuXHR9LFxuXG5cdHJRc2xpY2U6IGZ1bmN0aW9uIChzdGFydCwgZW5kKSB7XG5cdFx0aWYgKGVuZCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3JRLnNsaWNlKHRoaXMuX3JRaSArIHN0YXJ0LCB0aGlzLl9yUWkgKyBlbmQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fclEuc2xpY2UodGhpcy5fclFpICsgc3RhcnQpO1xuXHRcdH1cblx0fSxcblxuXHQvLyBDaGVjayB0byBzZWUgaWYgd2UgbXVzdCB3YWl0IGZvciAnbnVtJyBieXRlcyAoZGVmYXVsdCB0byBGQlUuYnl0ZXMpXG5cdC8vIHRvIGJlIGF2YWlsYWJsZSBpbiB0aGUgcmVjZWl2ZSBxdWV1ZS4gUmV0dXJuIHRydWUgaWYgd2UgbmVlZCB0b1xuXHQvLyB3YWl0IChhbmQgcG9zc2libHkgcHJpbnQgYSBkZWJ1ZyBtZXNzYWdlKSwgb3RoZXJ3aXNlIGZhbHNlLlxuXHRyUXdhaXQ6IGZ1bmN0aW9uIChtc2csIG51bSwgZ29iYWNrKSB7XG5cdFx0dmFyIHJRbGVuID0gdGhpcy5fclEubGVuZ3RoIC0gdGhpcy5fclFpOyAvLyBTa2lwIHJRbGVuKCkgZnVuY3Rpb24gY2FsbFxuXHRcdGlmIChyUWxlbiA8IG51bSkge1xuXHRcdFx0aWYgKGdvYmFjaykge1xuXHRcdFx0XHRpZiAodGhpcy5fclFpIDwgZ29iYWNrKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdyUXdhaXQgY2Fubm90IGJhY2t1cCAnICsgZ29iYWNrICsgJyBieXRlcycpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX3JRaSAtPSBnb2JhY2s7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTsgLy8gdHJ1ZSBtZWFucyBuZWVkIG1vcmUgZGF0YVxuXHRcdH1cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH0sXG5cblx0Ly8gU2VuZCBRdWV1ZVxuXG5cdGZsdXNoOiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHRoaXMuX3dlYnNvY2tldC5idWZmZXJlZEFtb3VudCAhPT0gMCkge1xuXHRcdFx0ZGVidWcoJ2ZsdXNoKCkgfCBidWZmZXJlZEFtb3VudDogJWQnLCB0aGlzLl93ZWJzb2NrZXQuYnVmZmVyZWRBbW91bnQpO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl93ZWJzb2NrZXQuYnVmZmVyZWRBbW91bnQgPCB0aGlzLm1heEJ1ZmZlcmVkQW1vdW50KSB7XG5cdFx0XHRpZiAodGhpcy5fc1EubGVuZ3RoID4gMCkge1xuXHRcdFx0XHR0aGlzLl93ZWJzb2NrZXQuc2VuZCh0aGlzLl9lbmNvZGVfbWVzc2FnZSgpKTtcblx0XHRcdFx0dGhpcy5fc1EgPSBbXTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRlYnVnKCdmbHVzaCgpIHwgZGVsYXlpbmcgc2VuZCcpO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fSxcblxuXHRzZW5kOiBmdW5jdGlvbiAoYXJyKSB7XG5cdCAgIHRoaXMuX3NRID0gdGhpcy5fc1EuY29uY2F0KGFycik7XG5cdCAgIHJldHVybiB0aGlzLmZsdXNoKCk7XG5cdH0sXG5cblx0c2VuZF9zdHJpbmc6IGZ1bmN0aW9uIChzdHIpIHtcblx0XHR0aGlzLnNlbmQoc3RyLnNwbGl0KCcnKS5tYXAoZnVuY3Rpb24gKGNocikge1xuXHRcdFx0cmV0dXJuIGNoci5jaGFyQ29kZUF0KDApO1xuXHRcdH0pKTtcblx0fSxcblxuXHQvLyBFdmVudCBIYW5kbGVyc1xuXHRvbjogZnVuY3Rpb24gKGV2dCwgaGFuZGxlcikge1xuXHRcdHRoaXMuX2V2ZW50SGFuZGxlcnNbZXZ0XSA9IGhhbmRsZXI7XG5cdH0sXG5cblx0b2ZmOiBmdW5jdGlvbiAoZXZ0KSB7XG5cdFx0dGhpcy5fZXZlbnRIYW5kbGVyc1tldnRdID0gZnVuY3Rpb24oKSB7fTtcblx0fSxcblxuXHRpbml0OiBmdW5jdGlvbiAocHJvdG9jb2xzKSB7XG5cdFx0dGhpcy5fclEgPSBbXTtcblx0XHR0aGlzLl9yUWkgPSAwO1xuXHRcdHRoaXMuX3NRID0gW107XG5cdFx0dGhpcy5fd2Vic29ja2V0ID0gbnVsbDtcblxuXHRcdC8vIENoZWNrIGZvciBmdWxsIHR5cGVkIGFycmF5IHN1cHBvcnRcblx0XHR2YXIgYnQgPSBmYWxzZTtcblx0XHRpZiAoKCdVaW50OEFycmF5JyBpbiBnbG9iYWwpICYmICgnc2V0JyBpbiBVaW50OEFycmF5LnByb3RvdHlwZSkpIHtcblx0XHRcdGJ0ID0gdHJ1ZTtcblx0XHR9XG5cblx0XHR2YXIgd3NidCA9IGZhbHNlO1xuXHRcdGlmIChnbG9iYWwuV2ViU29ja2V0KSB7XG5cdFx0XHQvLyBTYWZhcmkgPCA3IGRvZXMgbm90IHN1cHBvcnQgYmluYXJ5IFdTLlxuXHRcdFx0aWYgKGJyb3dzZXIuc2FmYXJpICYmIE51bWJlcihicm93c2VyLnZlcnNpb24pID4gMCAmJiBOdW1iZXIoYnJvd3Nlci52ZXJzaW9uKSA8IDcpIHtcblx0XHRcdFx0ZGVidWcoJ2luaXQoKSB8IFNhZmFyaSAlZCBkb2VzIG5vdCBzdXBwb3J0IGJpbmFyeSBXZWJTb2NrZXQnLCBOdW1iZXIoYnJvd3Nlci52ZXJzaW9uKSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0d3NidCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gRGVmYXVsdCBwcm90b2NvbHMgaWYgbm90IHNwZWNpZmllZFxuXHRcdGlmICh0eXBlb2YocHJvdG9jb2xzKSA9PT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdGlmICh3c2J0KSB7XG5cdFx0XHRcdHByb3RvY29scyA9IFsnYmluYXJ5JywgJ2Jhc2U2NCddO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cHJvdG9jb2xzID0gJ2Jhc2U2NCc7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKCF3c2J0KSB7XG5cdFx0XHRpZiAocHJvdG9jb2xzID09PSAnYmluYXJ5Jykge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1dlYlNvY2tldCBiaW5hcnkgc3ViLXByb3RvY29sIHJlcXVlc3RlZCBidXQgbm90IHN1cHBvcnRlZCcpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodHlwZW9mKHByb3RvY29scykgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdHZhciBuZXdfcHJvdG9jb2xzID0gW107XG5cblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBwcm90b2NvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRpZiAocHJvdG9jb2xzW2ldID09PSAnYmluYXJ5Jykge1xuXHRcdFx0XHRcdFx0ZGVidWdlcnJvcignaW5pdCgpIHwgc2tpcHBpbmcgdW5zdXBwb3J0ZWQgV2ViU29ja2V0IGJpbmFyeSBzdWItcHJvdG9jb2wnKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bmV3X3Byb3RvY29scy5wdXNoKHByb3RvY29sc1tpXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKG5ld19wcm90b2NvbHMubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdHByb3RvY29scyA9IG5ld19wcm90b2NvbHM7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdvbmx5IFdlYlNvY2tldCBiaW5hcnkgc3ViLXByb3RvY29sIHdhcyByZXF1ZXN0ZWQgYW5kIGlzIG5vdCBzdXBwb3J0ZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBwcm90b2NvbHM7XG5cdH0sXG5cblx0b3BlbjogZnVuY3Rpb24gKHVyaSwgcHJvdG9jb2xzKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0cHJvdG9jb2xzID0gdGhpcy5pbml0KHByb3RvY29scyk7XG5cblx0XHQvLyB0aGlzLl93ZWJzb2NrZXQgPSBuZXcgV2ViU29ja2V0KHVyaSwgcHJvdG9jb2xzKTtcblx0XHQvLyBUT0RPOiBBZGQgQVBJIG9yIHNldHRpbmdzIGZvciBwYXNzaW5nIHRoZSBXM0MgV2ViU29ja2V0IGNsYXNzLlxuXHRcdGlmIChnbG9iYWwuTmF0aXZlV2ViU29ja2V0KSB7XG5cdFx0XHRkZWJ1Zygnb3BlbigpIHwgdXNpbmcgTmF0aXZlV2ViU29ja2V0Jyk7XG5cdFx0XHR0aGlzLl93ZWJzb2NrZXQgPSBuZXcgZ2xvYmFsLk5hdGl2ZVdlYlNvY2tldCh1cmksIHByb3RvY29scyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRlYnVnKCdvcGVuKCkgfCBub3QgdXNpbmcgTmF0aXZlV2ViU29ja2V0Jyk7XG5cdFx0XHR0aGlzLl93ZWJzb2NrZXQgPSBuZXcgV2ViU29ja2V0KHVyaSwgcHJvdG9jb2xzKTtcblx0XHR9XG5cblx0XHRpZiAocHJvdG9jb2xzLmluZGV4T2YoJ2JpbmFyeScpID49IDApIHtcblx0XHRcdHRoaXMuX3dlYnNvY2tldC5iaW5hcnlUeXBlID0gJ2FycmF5YnVmZmVyJztcblx0XHR9XG5cblx0XHR0aGlzLl93ZWJzb2NrZXQub25tZXNzYWdlID0gZnVuY3Rpb24gKGUpIHtcblx0XHRcdHNlbGYuX3JlY3ZfbWVzc2FnZShlKTtcblx0XHR9O1xuXG5cdFx0dGhpcy5fd2Vic29ja2V0Lm9ub3BlbiA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKHNlbGYuX3dlYnNvY2tldC5wcm90b2NvbCkge1xuXHRcdFx0XHRkZWJ1Zygnb25vcGVuOiBzZXJ2ZXIgY2hvb3NlIFwiJXNcIiBzdWItcHJvdG9jb2wnLCBzZWxmLl93ZWJzb2NrZXQucHJvdG9jb2wpO1xuXHRcdFx0XHRzZWxmLl9tb2RlID0gc2VsZi5fd2Vic29ja2V0LnByb3RvY29sO1xuXHRcdFx0XHRzZWxmLl9ldmVudEhhbmRsZXJzLm9wZW4oKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRkZWJ1Z2Vycm9yKCdvbm9wZW46IHNlcnZlciBjaG9vc2Ugbm8gc3ViLXByb3RvY29sLCB1c2luZyBcImJhc2U2NFwiJyk7XG5cdFx0XHRcdHNlbGYuX21vZGUgPSAnYmFzZTY0Jztcblx0XHRcdFx0c2VsZi5fZXZlbnRIYW5kbGVycy5vcGVuKCk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHRoaXMuX3dlYnNvY2tldC5vbmNsb3NlID0gZnVuY3Rpb24gKGUpIHtcblx0XHRcdGRlYnVnKCdvbmNsb3NlOiAlbycsIGUpO1xuXHRcdFx0c2VsZi5fZXZlbnRIYW5kbGVycy5jbG9zZShlKTtcblx0XHR9O1xuXG5cdFx0dGhpcy5fd2Vic29ja2V0Lm9uZXJyb3IgPSBmdW5jdGlvbiAoZSkge1xuXHRcdFx0ZGVidWdlcnJvcignb25lcnJvcjogJW8nLCBlKTtcblx0XHRcdHNlbGYuX2V2ZW50SGFuZGxlcnMuZXJyb3IoZSk7XG5cdFx0fTtcblx0fSxcblxuXHRjbG9zZTogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLl93ZWJzb2NrZXQpIHtcblx0XHRcdGlmICgodGhpcy5fd2Vic29ja2V0LnJlYWR5U3RhdGUgPT09IHRoaXMuX3dlYnNvY2tldC5PUEVOKSB8fFxuXHRcdFx0XHRcdCh0aGlzLl93ZWJzb2NrZXQucmVhZHlTdGF0ZSA9PT0gdGhpcy5fd2Vic29ja2V0LkNPTk5FQ1RJTkcpKSB7XG5cdFx0XHRcdGRlYnVnKCdjbG9zZSgpJyk7XG5cdFx0XHRcdHRoaXMuX3dlYnNvY2tldC5jbG9zZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl93ZWJzb2NrZXQub25tZXNzYWdlID0gZnVuY3Rpb24gKCkgeyByZXR1cm47IH07XG5cdFx0fVxuXHR9LFxuXG5cdC8vIHByaXZhdGUgbWV0aG9kc1xuXG5cdF9lbmNvZGVfbWVzc2FnZTogZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0aGlzLl9tb2RlID09PSAnYmluYXJ5Jykge1xuXHRcdFx0Ly8gUHV0IGluIGEgYmluYXJ5IGFycmF5YnVmZmVyXG5cdFx0XHRyZXR1cm4gKG5ldyBVaW50OEFycmF5KHRoaXMuX3NRKSkuYnVmZmVyO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBiYXNlNjQgZW5jb2RlXG5cdFx0XHRyZXR1cm4gQmFzZTY0LmVuY29kZSh0aGlzLl9zUSk7XG5cdFx0fVxuXHR9LFxuXG5cdF9kZWNvZGVfbWVzc2FnZTogZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRpZiAodGhpcy5fbW9kZSA9PT0gJ2JpbmFyeScpIHtcblx0XHRcdC8vIHB1c2ggYXJyYXlidWZmZXIgdmFsdWVzIG9udG8gdGhlIGVuZFxuXHRcdFx0dmFyIHU4ID0gbmV3IFVpbnQ4QXJyYXkoZGF0YSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHU4Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdHRoaXMuX3JRLnB1c2godThbaV0pO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBiYXNlNjQgZGVjb2RlIGFuZCBjb25jYXQgdG8gZW5kXG5cdFx0XHR0aGlzLl9yUSA9IHRoaXMuX3JRLmNvbmNhdChCYXNlNjQuZGVjb2RlKGRhdGEsIDApKTtcblx0XHR9XG5cdH0sXG5cblx0X3JlY3ZfbWVzc2FnZTogZnVuY3Rpb24gKGUpIHtcblx0XHR0cnkge1xuXHRcdFx0dGhpcy5fZGVjb2RlX21lc3NhZ2UoZS5kYXRhKTtcblx0XHRcdGlmICh0aGlzLnJRbGVuKCkgPiAwKSB7XG5cdFx0XHRcdHRoaXMuX2V2ZW50SGFuZGxlcnMubWVzc2FnZSgpO1xuXHRcdFx0XHQvLyBDb21wYWN0IHRoZSByZWNlaXZlIHF1ZXVlXG5cdFx0XHRcdGlmICh0aGlzLl9yUS5sZW5ndGggPiB0aGlzLl9yUW1heCkge1xuXHRcdFx0XHRcdHRoaXMuX3JRID0gdGhpcy5fclEuc2xpY2UodGhpcy5fclFpKTtcblx0XHRcdFx0XHR0aGlzLl9yUWkgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkZWJ1ZygnX3JlY3ZfbWVzc2FnZSgpIHwgaWdub3JpbmcgZW1wdHkgbWVzc2FnZScpO1xuXHRcdFx0fVxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRkZWJ1Z2Vycm9yKCdfcmVjdl9tZXNzYWdlKCkgfCBlcnJvcjogJW8nLCBlcnJvcik7XG5cblx0XHRcdGlmICh0eXBlb2YgZXJyb3IubmFtZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0dGhpcy5fZXZlbnRIYW5kbGVycy5lcnJvcihlcnJvci5uYW1lICsgJzogJyArIGVycm9yLm1lc3NhZ2UpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fZXZlbnRIYW5kbGVycy5lcnJvcihlcnJvcik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ub3ZuYy1ub2RlL2xpYi93ZWJzb2NrLmpzXCIsXCIvLi4vLi4vbm9kZV9tb2R1bGVzL25vdm5jLW5vZGUvbGliXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXG4gKiBUaGlzIGlzIHRoZSB3ZWIgYnJvd3NlciBpbXBsZW1lbnRhdGlvbiBvZiBgZGVidWcoKWAuXG4gKlxuICogRXhwb3NlIGBkZWJ1ZygpYCBhcyB0aGUgbW9kdWxlLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZGVidWcnKTtcbmV4cG9ydHMubG9nID0gbG9nO1xuZXhwb3J0cy5mb3JtYXRBcmdzID0gZm9ybWF0QXJncztcbmV4cG9ydHMuc2F2ZSA9IHNhdmU7XG5leHBvcnRzLmxvYWQgPSBsb2FkO1xuZXhwb3J0cy51c2VDb2xvcnMgPSB1c2VDb2xvcnM7XG5leHBvcnRzLnN0b3JhZ2UgPSAndW5kZWZpbmVkJyAhPSB0eXBlb2YgY2hyb21lXG4gICAgICAgICAgICAgICAmJiAndW5kZWZpbmVkJyAhPSB0eXBlb2YgY2hyb21lLnN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgID8gY2hyb21lLnN0b3JhZ2UubG9jYWxcbiAgICAgICAgICAgICAgICAgIDogbG9jYWxzdG9yYWdlKCk7XG5cbi8qKlxuICogQ29sb3JzLlxuICovXG5cbmV4cG9ydHMuY29sb3JzID0gW1xuICAnbGlnaHRzZWFncmVlbicsXG4gICdmb3Jlc3RncmVlbicsXG4gICdnb2xkZW5yb2QnLFxuICAnZG9kZ2VyYmx1ZScsXG4gICdkYXJrb3JjaGlkJyxcbiAgJ2NyaW1zb24nXG5dO1xuXG4vKipcbiAqIEN1cnJlbnRseSBvbmx5IFdlYktpdC1iYXNlZCBXZWIgSW5zcGVjdG9ycywgRmlyZWZveCA+PSB2MzEsXG4gKiBhbmQgdGhlIEZpcmVidWcgZXh0ZW5zaW9uIChhbnkgRmlyZWZveCB2ZXJzaW9uKSBhcmUga25vd25cbiAqIHRvIHN1cHBvcnQgXCIlY1wiIENTUyBjdXN0b21pemF0aW9ucy5cbiAqXG4gKiBUT0RPOiBhZGQgYSBgbG9jYWxTdG9yYWdlYCB2YXJpYWJsZSB0byBleHBsaWNpdGx5IGVuYWJsZS9kaXNhYmxlIGNvbG9yc1xuICovXG5cbmZ1bmN0aW9uIHVzZUNvbG9ycygpIHtcbiAgLy8gTkI6IEluIGFuIEVsZWN0cm9uIHByZWxvYWQgc2NyaXB0LCBkb2N1bWVudCB3aWxsIGJlIGRlZmluZWQgYnV0IG5vdCBmdWxseVxuICAvLyBpbml0aWFsaXplZC4gU2luY2Ugd2Uga25vdyB3ZSdyZSBpbiBDaHJvbWUsIHdlJ2xsIGp1c3QgZGV0ZWN0IHRoaXMgY2FzZVxuICAvLyBleHBsaWNpdGx5XG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucHJvY2VzcyAmJiB3aW5kb3cucHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBpcyB3ZWJraXQ/IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE2NDU5NjA2LzM3Njc3M1xuICAvLyBkb2N1bWVudCBpcyB1bmRlZmluZWQgaW4gcmVhY3QtbmF0aXZlOiBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QtbmF0aXZlL3B1bGwvMTYzMlxuICByZXR1cm4gKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZSAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuV2Via2l0QXBwZWFyYW5jZSkgfHxcbiAgICAvLyBpcyBmaXJlYnVnPyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zOTgxMjAvMzc2NzczXG4gICAgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5jb25zb2xlICYmICh3aW5kb3cuY29uc29sZS5maXJlYnVnIHx8ICh3aW5kb3cuY29uc29sZS5leGNlcHRpb24gJiYgd2luZG93LmNvbnNvbGUudGFibGUpKSkgfHxcbiAgICAvLyBpcyBmaXJlZm94ID49IHYzMT9cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1Rvb2xzL1dlYl9Db25zb2xlI1N0eWxpbmdfbWVzc2FnZXNcbiAgICAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkubWF0Y2goL2ZpcmVmb3hcXC8oXFxkKykvKSAmJiBwYXJzZUludChSZWdFeHAuJDEsIDEwKSA+PSAzMSkgfHxcbiAgICAvLyBkb3VibGUgY2hlY2sgd2Via2l0IGluIHVzZXJBZ2VudCBqdXN0IGluIGNhc2Ugd2UgYXJlIGluIGEgd29ya2VyXG4gICAgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIG5hdmlnYXRvci51c2VyQWdlbnQgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC9hcHBsZXdlYmtpdFxcLyhcXGQrKS8pKTtcbn1cblxuLyoqXG4gKiBNYXAgJWogdG8gYEpTT04uc3RyaW5naWZ5KClgLCBzaW5jZSBubyBXZWIgSW5zcGVjdG9ycyBkbyB0aGF0IGJ5IGRlZmF1bHQuXG4gKi9cblxuZXhwb3J0cy5mb3JtYXR0ZXJzLmogPSBmdW5jdGlvbih2KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHYpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gJ1tVbmV4cGVjdGVkSlNPTlBhcnNlRXJyb3JdOiAnICsgZXJyLm1lc3NhZ2U7XG4gIH1cbn07XG5cblxuLyoqXG4gKiBDb2xvcml6ZSBsb2cgYXJndW1lbnRzIGlmIGVuYWJsZWQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBmb3JtYXRBcmdzKGFyZ3MpIHtcbiAgdmFyIHVzZUNvbG9ycyA9IHRoaXMudXNlQ29sb3JzO1xuXG4gIGFyZ3NbMF0gPSAodXNlQ29sb3JzID8gJyVjJyA6ICcnKVxuICAgICsgdGhpcy5uYW1lc3BhY2VcbiAgICArICh1c2VDb2xvcnMgPyAnICVjJyA6ICcgJylcbiAgICArIGFyZ3NbMF1cbiAgICArICh1c2VDb2xvcnMgPyAnJWMgJyA6ICcgJylcbiAgICArICcrJyArIGV4cG9ydHMuaHVtYW5pemUodGhpcy5kaWZmKTtcblxuICBpZiAoIXVzZUNvbG9ycykgcmV0dXJuO1xuXG4gIHZhciBjID0gJ2NvbG9yOiAnICsgdGhpcy5jb2xvcjtcbiAgYXJncy5zcGxpY2UoMSwgMCwgYywgJ2NvbG9yOiBpbmhlcml0JylcblxuICAvLyB0aGUgZmluYWwgXCIlY1wiIGlzIHNvbWV3aGF0IHRyaWNreSwgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSBvdGhlclxuICAvLyBhcmd1bWVudHMgcGFzc2VkIGVpdGhlciBiZWZvcmUgb3IgYWZ0ZXIgdGhlICVjLCBzbyB3ZSBuZWVkIHRvXG4gIC8vIGZpZ3VyZSBvdXQgdGhlIGNvcnJlY3QgaW5kZXggdG8gaW5zZXJ0IHRoZSBDU1MgaW50b1xuICB2YXIgaW5kZXggPSAwO1xuICB2YXIgbGFzdEMgPSAwO1xuICBhcmdzWzBdLnJlcGxhY2UoLyVbYS16QS1aJV0vZywgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICBpZiAoJyUlJyA9PT0gbWF0Y2gpIHJldHVybjtcbiAgICBpbmRleCsrO1xuICAgIGlmICgnJWMnID09PSBtYXRjaCkge1xuICAgICAgLy8gd2Ugb25seSBhcmUgaW50ZXJlc3RlZCBpbiB0aGUgKmxhc3QqICVjXG4gICAgICAvLyAodGhlIHVzZXIgbWF5IGhhdmUgcHJvdmlkZWQgdGhlaXIgb3duKVxuICAgICAgbGFzdEMgPSBpbmRleDtcbiAgICB9XG4gIH0pO1xuXG4gIGFyZ3Muc3BsaWNlKGxhc3RDLCAwLCBjKTtcbn1cblxuLyoqXG4gKiBJbnZva2VzIGBjb25zb2xlLmxvZygpYCB3aGVuIGF2YWlsYWJsZS5cbiAqIE5vLW9wIHdoZW4gYGNvbnNvbGUubG9nYCBpcyBub3QgYSBcImZ1bmN0aW9uXCIuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBsb2coKSB7XG4gIC8vIHRoaXMgaGFja2VyeSBpcyByZXF1aXJlZCBmb3IgSUU4LzksIHdoZXJlXG4gIC8vIHRoZSBgY29uc29sZS5sb2dgIGZ1bmN0aW9uIGRvZXNuJ3QgaGF2ZSAnYXBwbHknXG4gIHJldHVybiAnb2JqZWN0JyA9PT0gdHlwZW9mIGNvbnNvbGVcbiAgICAmJiBjb25zb2xlLmxvZ1xuICAgICYmIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKGNvbnNvbGUubG9nLCBjb25zb2xlLCBhcmd1bWVudHMpO1xufVxuXG4vKipcbiAqIFNhdmUgYG5hbWVzcGFjZXNgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzYXZlKG5hbWVzcGFjZXMpIHtcbiAgdHJ5IHtcbiAgICBpZiAobnVsbCA9PSBuYW1lc3BhY2VzKSB7XG4gICAgICBleHBvcnRzLnN0b3JhZ2UucmVtb3ZlSXRlbSgnZGVidWcnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhwb3J0cy5zdG9yYWdlLmRlYnVnID0gbmFtZXNwYWNlcztcbiAgICB9XG4gIH0gY2F0Y2goZSkge31cbn1cblxuLyoqXG4gKiBMb2FkIGBuYW1lc3BhY2VzYC5cbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHJldHVybnMgdGhlIHByZXZpb3VzbHkgcGVyc2lzdGVkIGRlYnVnIG1vZGVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBsb2FkKCkge1xuICB2YXIgcjtcbiAgdHJ5IHtcbiAgICByID0gZXhwb3J0cy5zdG9yYWdlLmRlYnVnO1xuICB9IGNhdGNoKGUpIHt9XG5cbiAgLy8gSWYgZGVidWcgaXNuJ3Qgc2V0IGluIExTLCBhbmQgd2UncmUgaW4gRWxlY3Ryb24sIHRyeSB0byBsb2FkICRERUJVR1xuICBpZiAoIXIgJiYgdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmICdlbnYnIGluIHByb2Nlc3MpIHtcbiAgICByID0gcHJvY2Vzcy5lbnYuREVCVUc7XG4gIH1cblxuICByZXR1cm4gcjtcbn1cblxuLyoqXG4gKiBFbmFibGUgbmFtZXNwYWNlcyBsaXN0ZWQgaW4gYGxvY2FsU3RvcmFnZS5kZWJ1Z2AgaW5pdGlhbGx5LlxuICovXG5cbmV4cG9ydHMuZW5hYmxlKGxvYWQoKSk7XG5cbi8qKlxuICogTG9jYWxzdG9yYWdlIGF0dGVtcHRzIHRvIHJldHVybiB0aGUgbG9jYWxzdG9yYWdlLlxuICpcbiAqIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2Ugc2FmYXJpIHRocm93c1xuICogd2hlbiBhIHVzZXIgZGlzYWJsZXMgY29va2llcy9sb2NhbHN0b3JhZ2VcbiAqIGFuZCB5b3UgYXR0ZW1wdCB0byBhY2Nlc3MgaXQuXG4gKlxuICogQHJldHVybiB7TG9jYWxTdG9yYWdlfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbG9jYWxzdG9yYWdlKCkge1xuICB0cnkge1xuICAgIHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlO1xuICB9IGNhdGNoIChlKSB7fVxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ub3ZuYy1ub2RlL25vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvYnJvd3Nlci5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ub3ZuYy1ub2RlL25vZGVfbW9kdWxlcy9kZWJ1Zy9zcmNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5cbi8qKlxuICogVGhpcyBpcyB0aGUgY29tbW9uIGxvZ2ljIGZvciBib3RoIHRoZSBOb2RlLmpzIGFuZCB3ZWIgYnJvd3NlclxuICogaW1wbGVtZW50YXRpb25zIG9mIGBkZWJ1ZygpYC5cbiAqXG4gKiBFeHBvc2UgYGRlYnVnKClgIGFzIHRoZSBtb2R1bGUuXG4gKi9cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gY3JlYXRlRGVidWcuZGVidWcgPSBjcmVhdGVEZWJ1Z1snZGVmYXVsdCddID0gY3JlYXRlRGVidWc7XG5leHBvcnRzLmNvZXJjZSA9IGNvZXJjZTtcbmV4cG9ydHMuZGlzYWJsZSA9IGRpc2FibGU7XG5leHBvcnRzLmVuYWJsZSA9IGVuYWJsZTtcbmV4cG9ydHMuZW5hYmxlZCA9IGVuYWJsZWQ7XG5leHBvcnRzLmh1bWFuaXplID0gcmVxdWlyZSgnbXMnKTtcblxuLyoqXG4gKiBUaGUgY3VycmVudGx5IGFjdGl2ZSBkZWJ1ZyBtb2RlIG5hbWVzLCBhbmQgbmFtZXMgdG8gc2tpcC5cbiAqL1xuXG5leHBvcnRzLm5hbWVzID0gW107XG5leHBvcnRzLnNraXBzID0gW107XG5cbi8qKlxuICogTWFwIG9mIHNwZWNpYWwgXCIlblwiIGhhbmRsaW5nIGZ1bmN0aW9ucywgZm9yIHRoZSBkZWJ1ZyBcImZvcm1hdFwiIGFyZ3VtZW50LlxuICpcbiAqIFZhbGlkIGtleSBuYW1lcyBhcmUgYSBzaW5nbGUsIGxvd2VyIG9yIHVwcGVyLWNhc2UgbGV0dGVyLCBpLmUuIFwiblwiIGFuZCBcIk5cIi5cbiAqL1xuXG5leHBvcnRzLmZvcm1hdHRlcnMgPSB7fTtcblxuLyoqXG4gKiBQcmV2aW91cyBsb2cgdGltZXN0YW1wLlxuICovXG5cbnZhciBwcmV2VGltZTtcblxuLyoqXG4gKiBTZWxlY3QgYSBjb2xvci5cbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2VcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNlbGVjdENvbG9yKG5hbWVzcGFjZSkge1xuICB2YXIgaGFzaCA9IDAsIGk7XG5cbiAgZm9yIChpIGluIG5hbWVzcGFjZSkge1xuICAgIGhhc2ggID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBuYW1lc3BhY2UuY2hhckNvZGVBdChpKTtcbiAgICBoYXNoIHw9IDA7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICB9XG5cbiAgcmV0dXJuIGV4cG9ydHMuY29sb3JzW01hdGguYWJzKGhhc2gpICUgZXhwb3J0cy5jb2xvcnMubGVuZ3RoXTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBkZWJ1Z2dlciB3aXRoIHRoZSBnaXZlbiBgbmFtZXNwYWNlYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlRGVidWcobmFtZXNwYWNlKSB7XG5cbiAgZnVuY3Rpb24gZGVidWcoKSB7XG4gICAgLy8gZGlzYWJsZWQ/XG4gICAgaWYgKCFkZWJ1Zy5lbmFibGVkKSByZXR1cm47XG5cbiAgICB2YXIgc2VsZiA9IGRlYnVnO1xuXG4gICAgLy8gc2V0IGBkaWZmYCB0aW1lc3RhbXBcbiAgICB2YXIgY3VyciA9ICtuZXcgRGF0ZSgpO1xuICAgIHZhciBtcyA9IGN1cnIgLSAocHJldlRpbWUgfHwgY3Vycik7XG4gICAgc2VsZi5kaWZmID0gbXM7XG4gICAgc2VsZi5wcmV2ID0gcHJldlRpbWU7XG4gICAgc2VsZi5jdXJyID0gY3VycjtcbiAgICBwcmV2VGltZSA9IGN1cnI7XG5cbiAgICAvLyB0dXJuIHRoZSBgYXJndW1lbnRzYCBpbnRvIGEgcHJvcGVyIEFycmF5XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuICAgIH1cblxuICAgIGFyZ3NbMF0gPSBleHBvcnRzLmNvZXJjZShhcmdzWzBdKTtcblxuICAgIGlmICgnc3RyaW5nJyAhPT0gdHlwZW9mIGFyZ3NbMF0pIHtcbiAgICAgIC8vIGFueXRoaW5nIGVsc2UgbGV0J3MgaW5zcGVjdCB3aXRoICVPXG4gICAgICBhcmdzLnVuc2hpZnQoJyVPJyk7XG4gICAgfVxuXG4gICAgLy8gYXBwbHkgYW55IGBmb3JtYXR0ZXJzYCB0cmFuc2Zvcm1hdGlvbnNcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIGFyZ3NbMF0gPSBhcmdzWzBdLnJlcGxhY2UoLyUoW2EtekEtWiVdKS9nLCBmdW5jdGlvbihtYXRjaCwgZm9ybWF0KSB7XG4gICAgICAvLyBpZiB3ZSBlbmNvdW50ZXIgYW4gZXNjYXBlZCAlIHRoZW4gZG9uJ3QgaW5jcmVhc2UgdGhlIGFycmF5IGluZGV4XG4gICAgICBpZiAobWF0Y2ggPT09ICclJScpIHJldHVybiBtYXRjaDtcbiAgICAgIGluZGV4Kys7XG4gICAgICB2YXIgZm9ybWF0dGVyID0gZXhwb3J0cy5mb3JtYXR0ZXJzW2Zvcm1hdF07XG4gICAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGZvcm1hdHRlcikge1xuICAgICAgICB2YXIgdmFsID0gYXJnc1tpbmRleF07XG4gICAgICAgIG1hdGNoID0gZm9ybWF0dGVyLmNhbGwoc2VsZiwgdmFsKTtcblxuICAgICAgICAvLyBub3cgd2UgbmVlZCB0byByZW1vdmUgYGFyZ3NbaW5kZXhdYCBzaW5jZSBpdCdzIGlubGluZWQgaW4gdGhlIGBmb3JtYXRgXG4gICAgICAgIGFyZ3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgaW5kZXgtLTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9KTtcblxuICAgIC8vIGFwcGx5IGVudi1zcGVjaWZpYyBmb3JtYXR0aW5nIChjb2xvcnMsIGV0Yy4pXG4gICAgZXhwb3J0cy5mb3JtYXRBcmdzLmNhbGwoc2VsZiwgYXJncyk7XG5cbiAgICB2YXIgbG9nRm4gPSBkZWJ1Zy5sb2cgfHwgZXhwb3J0cy5sb2cgfHwgY29uc29sZS5sb2cuYmluZChjb25zb2xlKTtcbiAgICBsb2dGbi5hcHBseShzZWxmLCBhcmdzKTtcbiAgfVxuXG4gIGRlYnVnLm5hbWVzcGFjZSA9IG5hbWVzcGFjZTtcbiAgZGVidWcuZW5hYmxlZCA9IGV4cG9ydHMuZW5hYmxlZChuYW1lc3BhY2UpO1xuICBkZWJ1Zy51c2VDb2xvcnMgPSBleHBvcnRzLnVzZUNvbG9ycygpO1xuICBkZWJ1Zy5jb2xvciA9IHNlbGVjdENvbG9yKG5hbWVzcGFjZSk7XG5cbiAgLy8gZW52LXNwZWNpZmljIGluaXRpYWxpemF0aW9uIGxvZ2ljIGZvciBkZWJ1ZyBpbnN0YW5jZXNcbiAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBleHBvcnRzLmluaXQpIHtcbiAgICBleHBvcnRzLmluaXQoZGVidWcpO1xuICB9XG5cbiAgcmV0dXJuIGRlYnVnO1xufVxuXG4vKipcbiAqIEVuYWJsZXMgYSBkZWJ1ZyBtb2RlIGJ5IG5hbWVzcGFjZXMuIFRoaXMgY2FuIGluY2x1ZGUgbW9kZXNcbiAqIHNlcGFyYXRlZCBieSBhIGNvbG9uIGFuZCB3aWxkY2FyZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZXNcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZW5hYmxlKG5hbWVzcGFjZXMpIHtcbiAgZXhwb3J0cy5zYXZlKG5hbWVzcGFjZXMpO1xuXG4gIGV4cG9ydHMubmFtZXMgPSBbXTtcbiAgZXhwb3J0cy5za2lwcyA9IFtdO1xuXG4gIHZhciBzcGxpdCA9ICh0eXBlb2YgbmFtZXNwYWNlcyA9PT0gJ3N0cmluZycgPyBuYW1lc3BhY2VzIDogJycpLnNwbGl0KC9bXFxzLF0rLyk7XG4gIHZhciBsZW4gPSBzcGxpdC5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIGlmICghc3BsaXRbaV0pIGNvbnRpbnVlOyAvLyBpZ25vcmUgZW1wdHkgc3RyaW5nc1xuICAgIG5hbWVzcGFjZXMgPSBzcGxpdFtpXS5yZXBsYWNlKC9cXCovZywgJy4qPycpO1xuICAgIGlmIChuYW1lc3BhY2VzWzBdID09PSAnLScpIHtcbiAgICAgIGV4cG9ydHMuc2tpcHMucHVzaChuZXcgUmVnRXhwKCdeJyArIG5hbWVzcGFjZXMuc3Vic3RyKDEpICsgJyQnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4cG9ydHMubmFtZXMucHVzaChuZXcgUmVnRXhwKCdeJyArIG5hbWVzcGFjZXMgKyAnJCcpKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNhYmxlIGRlYnVnIG91dHB1dC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGRpc2FibGUoKSB7XG4gIGV4cG9ydHMuZW5hYmxlKCcnKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIG1vZGUgbmFtZSBpcyBlbmFibGVkLCBmYWxzZSBvdGhlcndpc2UuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGVuYWJsZWQobmFtZSkge1xuICB2YXIgaSwgbGVuO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBleHBvcnRzLnNraXBzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGV4cG9ydHMuc2tpcHNbaV0udGVzdChuYW1lKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICBmb3IgKGkgPSAwLCBsZW4gPSBleHBvcnRzLm5hbWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGV4cG9ydHMubmFtZXNbaV0udGVzdChuYW1lKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBDb2VyY2UgYHZhbGAuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gdmFsXG4gKiBAcmV0dXJuIHtNaXhlZH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGNvZXJjZSh2YWwpIHtcbiAgaWYgKHZhbCBpbnN0YW5jZW9mIEVycm9yKSByZXR1cm4gdmFsLnN0YWNrIHx8IHZhbC5tZXNzYWdlO1xuICByZXR1cm4gdmFsO1xufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9ub3ZuYy1ub2RlL25vZGVfbW9kdWxlcy9kZWJ1Zy9zcmMvZGVidWcuanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvbm92bmMtbm9kZS9ub2RlX21vZHVsZXMvZGVidWcvc3JjXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9wcm9jZXNzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIG5vVk5DLCBvbkZCVUNvbXBsZXRlLCBvblVwZGF0ZVN0YXRlLCBvblZOQ0NvcHlDdXQsIHJmYiwgc29ja2V0O1xuXG5ub1ZOQyA9IHJlcXVpcmUoJ25vdm5jLW5vZGUnKTtcblxuZmV0Y2goJ2h0dHA6Ly8zNS4xOTQuODAuODQvc2Vzc2lvbicpLnRoZW4oZnVuY3Rpb24ocmVzKSB7XG4gIHJldHVybiBjb25zb2xlLmxvZyhyZXMpO1xufSk7XG5cbnNvY2tldCA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vMzUuMTk0LjgwLjg0L3NvY2tldCcpO1xuXG5vblZOQ0NvcHlDdXQgPSBmdW5jdGlvbihyZmIsIHRleHQpIHt9O1xuXG5vblVwZGF0ZVN0YXRlID0gZnVuY3Rpb24ocmZiLCBzdGF0ZSwgb2xkc3RhdGUsIG1zZykge1xuICBjb25zb2xlLmxvZyhyZmIsIHN0YXRlLCBvbGRzdGF0ZSwgbXNnKTtcbn07XG5cbm9uRkJVQ29tcGxldGUgPSBmdW5jdGlvbihyZmIsIGZidSkge1xuICByZmIuc2V0RGVza3RvcFNpemUoNjgwLCA0ODApO1xuICByZXR1cm4gcmZiLnNldF9vbkZCVUNvbXBsZXRlKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSk7XG59O1xuXG5yZmIgPSBuZXcgbm9WTkMuUkZCKHtcbiAgJ3RhcmdldCc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdub1ZOQ19jYW52YXMnKSxcbiAgJ2VuY3J5cHQnOiB0cnVlLFxuICAncmVwZWF0ZXJJRCc6ICcnLFxuICAndHJ1ZV9jb2xvcic6IHRydWUsXG4gICdsb2NhbF9jdXJzb3InOiB0cnVlLFxuICAnc2hhcmVkJzogdHJ1ZSxcbiAgJ3ZpZXdfb25seSc6IGZhbHNlLFxuICAnb25VcGRhdGVTdGF0ZSc6IG9uVXBkYXRlU3RhdGUsXG4gICdvbkNsaXBib2FyZCc6IG9uVk5DQ29weUN1dCxcbiAgJ29uRkJVQ29tcGxldGUnOiBvbkZCVUNvbXBsZXRlXG59KTtcblxucmZiLnNlbmRQYXNzd29yZChcInNlY3JldFwiKTtcblxucmZiLmNvbm5lY3QoXCJ3czovLzM1LjE5NC44MC44NC93ZWJzb2NraWZ5XCIsIFwic2VjcmV0XCIpO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2Zha2VfNGZiNDUzNzYuanNcIixcIi9cIikiXX0=
