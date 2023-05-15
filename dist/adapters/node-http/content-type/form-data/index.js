'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var node_stream = require('node:stream');
var contentType = require('../../../../contentType-8c16408e.js');
var node_crypto = require('node:crypto');
var node_fs = require('node:fs');
var promises = require('node:fs/promises');
var node_os = require('node:os');
var node_path = require('node:path');
var node_util = require('node:util');
var _class_private_field_get = require('@swc/helpers/src/_class_private_field_get.mjs');
var _class_private_field_init = require('@swc/helpers/src/_class_private_field_init.mjs');
var _class_private_field_set = require('@swc/helpers/src/_class_private_field_set.mjs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _class_private_field_get__default = /*#__PURE__*/_interopDefaultLegacy(_class_private_field_get);
var _class_private_field_init__default = /*#__PURE__*/_interopDefaultLegacy(_class_private_field_init);
var _class_private_field_set__default = /*#__PURE__*/_interopDefaultLegacy(_class_private_field_set);

function stringToArray(s) {
  const utf8 = unescape(encodeURIComponent(s));
  return Uint8Array.from(utf8, (_, i) => utf8.charCodeAt(i));
}
function arrayToString(a) {
  const utf8 = String.fromCharCode.apply(null, a);
  return decodeURIComponent(escape(utf8));
}
function mergeArrays(...arrays) {
  const out = new Uint8Array(arrays.reduce((total, arr) => total + arr.length, 0));
  let offset = 0;
  for (const arr of arrays) {
    out.set(arr, offset);
    offset += arr.length;
  }
  return out;
}
function arraysEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

function coerce(a) {
  if (a instanceof Uint8Array) {
    return index => a[index];
  }
  return a;
}
function jsmemcmp(buf1, pos1, buf2, pos2, len) {
  const fn1 = coerce(buf1);
  const fn2 = coerce(buf2);
  for (let i = 0; i < len; ++i) {
    if (fn1(pos1 + i) !== fn2(pos2 + i)) {
      return false;
    }
  }
  return true;
}
function createOccurenceTable(s) {
  const table = new Array(256).fill(s.length);
  if (s.length > 1) {
    for (let i = 0; i < s.length - 1; i++) {
      table[s[i]] = s.length - 1 - i;
    }
  }
  return table;
}
const MATCH = Symbol('Match');
class StreamSearch {
  constructor(needle) {
    this._lookbehind = new Uint8Array();
    if (typeof needle === 'string') {
      this._needle = needle = stringToArray(needle);
    } else {
      this._needle = needle;
    }
    this._lastChar = needle[needle.length - 1];
    this._occ = createOccurenceTable(needle);
  }
  feed(chunk) {
    let pos = 0;
    let tokens;
    const allTokens = [];
    while (pos !== chunk.length) {
      [pos, ...tokens] = this._feed(chunk, pos);
      allTokens.push(...tokens);
    }
    return allTokens;
  }
  end() {
    const tail = this._lookbehind;
    this._lookbehind = new Uint8Array();
    return tail;
  }
  _feed(data, bufPos) {
    const tokens = [];
    let pos = -this._lookbehind.length;
    if (pos < 0) {
      while (pos < 0 && pos <= data.length - this._needle.length) {
        const ch = this._charAt(data, pos + this._needle.length - 1);
        if (ch === this._lastChar && this._memcmp(data, pos, this._needle.length - 1)) {
          if (pos > -this._lookbehind.length) {
            tokens.push(this._lookbehind.slice(0, this._lookbehind.length + pos));
          }
          tokens.push(MATCH);
          this._lookbehind = new Uint8Array();
          return [
            pos + this._needle.length,
            ...tokens
          ];
        } else {
          pos += this._occ[ch];
        }
      }
      if (pos < 0) {
        while (pos < 0 && !this._memcmp(data, pos, data.length - pos)) {
          pos++;
        }
      }
      if (pos >= 0) {
        tokens.push(this._lookbehind);
        this._lookbehind = new Uint8Array();
      } else {
        const bytesToCutOff = this._lookbehind.length + pos;
        if (bytesToCutOff > 0) {
          tokens.push(this._lookbehind.slice(0, bytesToCutOff));
          this._lookbehind = this._lookbehind.slice(bytesToCutOff);
        }
        this._lookbehind = Uint8Array.from(new Array(this._lookbehind.length + data.length), (_, i) => this._charAt(data, i - this._lookbehind.length));
        return [
          data.length,
          ...tokens
        ];
      }
    }
    pos += bufPos;
    while (pos <= data.length - this._needle.length) {
      const ch = data[pos + this._needle.length - 1];
      if (ch === this._lastChar && data[pos] === this._needle[0] && jsmemcmp(this._needle, 0, data, pos, this._needle.length - 1)) {
        if (pos > bufPos) {
          tokens.push(data.slice(bufPos, pos));
        }
        tokens.push(MATCH);
        return [
          pos + this._needle.length,
          ...tokens
        ];
      } else {
        pos += this._occ[ch];
      }
    }
    if (pos < data.length) {
      while (pos < data.length && (data[pos] !== this._needle[0] || !jsmemcmp(data, pos, this._needle, 0, data.length - pos))) {
        ++pos;
      }
      if (pos < data.length) {
        this._lookbehind = data.slice(pos);
      }
    }
    if (pos > 0) {
      tokens.push(data.slice(bufPos, pos < data.length ? pos : data.length));
    }
    return [
      data.length,
      ...tokens
    ];
  }
  _charAt(data, pos) {
    if (pos < 0) {
      return this._lookbehind[this._lookbehind.length + pos];
    }
    return data[pos];
  }
  _memcmp(data, pos, len) {
    return jsmemcmp(this._charAt.bind(this, data), pos, this._needle, 0, len);
  }
}
class ReadableStreamSearch {
  constructor(needle, _readableStream) {
    this._readableStream = _readableStream;
    this._search = new StreamSearch(needle);
  }
  async *[Symbol.asyncIterator]() {
    const reader = this._readableStream.getReader();
    try {
      while (true) {
        const result = await reader.read();
        if (result.done) {
          break;
        }
        yield* this._search.feed(result.value);
      }
      const tail = this._search.end();
      if (tail.length) {
        yield tail;
      }
    } finally {
      reader.releaseLock();
    }
  }
}

const mergeArrays2 = Function.prototype.apply.bind(mergeArrays, undefined);
const dash = stringToArray('--');
const CRLF = stringToArray('\r\n');
function parseContentDisposition(header) {
  const parts = header.split(';').map(part => part.trim());
  if (parts.shift() !== 'form-data') {
    throw new Error('malformed content-disposition header: missing "form-data" in `' + JSON.stringify(parts) + '`');
  }
  const out = {};
  for (const part of parts) {
    const kv = part.split('=', 2);
    if (kv.length !== 2) {
      throw new Error('malformed content-disposition header: key-value pair not found - ' + part + ' in `' + header + '`');
    }
    const [name, value] = kv;
    if (value[0] === '"' && value[value.length - 1] === '"') {
      out[name] = value.slice(1, -1).replace(/\\"/g, '"');
    } else if (value[0] !== '"' && value[value.length - 1] !== '"') {
      out[name] = value;
    } else if (value[0] === '"' && value[value.length - 1] !== '"' || value[0] !== '"' && value[value.length - 1] === '"') {
      throw new Error('malformed content-disposition header: mismatched quotations in `' + header + '`');
    }
  }
  if (!out.name) {
    throw new Error('malformed content-disposition header: missing field name in `' + header + '`');
  }
  return out;
}
function parsePartHeaders(lines) {
  const entries = [];
  let disposition = false;
  let line;
  while (typeof (line = lines.shift()) !== 'undefined') {
    const colon = line.indexOf(':');
    if (colon === -1) {
      throw new Error('malformed multipart-form header: missing colon');
    }
    const header = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    switch (header) {
    case 'content-disposition':
      disposition = true;
      entries.push(...Object.entries(parseContentDisposition(value)));
      break;
    case 'content-type':
      entries.push([
        'contentType',
        value
      ]);
    }
  }
  if (!disposition) {
    throw new Error('malformed multipart-form header: missing content-disposition');
  }
  return Object.fromEntries(entries);
}
async function readHeaderLines(it, needle) {
  let firstChunk = true;
  let lastTokenWasMatch = false;
  const headerLines = [[]];
  const crlfSearch = new StreamSearch(CRLF);
  for (;;) {
    const result = await it.next();
    if (result.done) {
      throw new Error('malformed multipart-form data: unexpected end of stream');
    }
    if (firstChunk && result.value !== MATCH && arraysEqual(result.value.slice(0, 2), dash)) {
      return [
        undefined,
        new Uint8Array()
      ];
    }
    let chunk;
    if (result.value !== MATCH) {
      chunk = result.value;
    } else if (!lastTokenWasMatch) {
      chunk = needle;
    } else {
      throw new Error('malformed multipart-form data: unexpected boundary');
    }
    if (!chunk.length) {
      continue;
    }
    if (firstChunk) {
      firstChunk = false;
    }
    const tokens = crlfSearch.feed(chunk);
    for (const [i, token] of tokens.entries()) {
      const isMatch = token === MATCH;
      if (!isMatch && !token.length) {
        continue;
      }
      if (lastTokenWasMatch && isMatch) {
        tokens.push(crlfSearch.end());
        return [
          headerLines.filter(chunks => chunks.length).map(mergeArrays2).map(arrayToString),
          mergeArrays(...tokens.slice(i + 1).map(token => token === MATCH ? CRLF : token))
        ];
      }
      if (lastTokenWasMatch = isMatch) {
        headerLines.push([]);
      } else {
        headerLines[headerLines.length - 1].push(token);
      }
    }
  }
}
async function* streamMultipart(body, boundary) {
  const needle = mergeArrays(dash, stringToArray(boundary));
  const it = new ReadableStreamSearch(needle, body)[Symbol.asyncIterator]();
  for (;;) {
    const result = await it.next();
    if (result.done) {
      return;
    }
    if (result.value === MATCH) {
      break;
    }
  }
  const crlfSearch = new StreamSearch(CRLF);
  for (;;) {
    const [headerLines, tail] = await readHeaderLines(it, needle);
    if (!headerLines) {
      return;
    }
    async function nextToken() {
      const result = await it.next();
      if (result.done) {
        throw new Error('malformed multipart-form data: unexpected end of stream');
      }
      return result;
    }
    let trailingCRLF = false;
    function feedChunk(chunk) {
      const chunks = [];
      for (const token of crlfSearch.feed(chunk)) {
        if (trailingCRLF) {
          chunks.push(CRLF);
        }
        if (!(trailingCRLF = token === MATCH)) {
          chunks.push(token);
        }
      }
      return mergeArrays(...chunks);
    }
    let done = false;
    async function nextChunk() {
      const result = await nextToken();
      let chunk;
      if (result.value !== MATCH) {
        chunk = result.value;
      } else if (!trailingCRLF) {
        chunk = CRLF;
      } else {
        done = true;
        return { value: crlfSearch.end() };
      }
      return { value: feedChunk(chunk) };
    }
    const bufferedChunks = [{ value: feedChunk(tail) }];
    yield {
      ...parsePartHeaders(headerLines),
      data: {
        [Symbol.asyncIterator]() {
          return this;
        },
        async next() {
          for (;;) {
            const result = bufferedChunks.shift();
            if (!result) {
              break;
            }
            if (result.value.length > 0) {
              return result;
            }
          }
          for (;;) {
            if (done) {
              return {
                done,
                value: undefined
              };
            }
            const result = await nextChunk();
            if (result.value.length > 0) {
              return result;
            }
          }
        }
      }
    };
    while (!done) {
      bufferedChunks.push(await nextChunk());
    }
  }
}

/**
 * @see https://github.com/remix-run/remix/blob/0bcb4a304dd2f08f6032c3bf0c3aa7eb5b976901/packages/remix-server-runtime/formData.ts
 */ function composeUploadHandlers(...handlers) {
    return async (part)=>{
        for (const handler of handlers){
            const value = await handler(part);
            if (typeof value !== 'undefined' && value !== null) {
                return value;
            }
        }
        return undefined;
    };
}
class MaxPartSizeExceededError extends Error {
    constructor(field, maxBytes){
        super(`Field "${field}" exceeded upload size of ${maxBytes} bytes.`);
        this.field = field;
        this.maxBytes = maxBytes;
    }
}

function createMemoryUploadHandler({ filter , maxPartSize =3000000  } = {}) {
    return async ({ filename , contentType , name , data  })=>{
        if (filter && !await filter({
            filename,
            contentType,
            name
        })) {
            return undefined;
        }
        let size = 0;
        const chunks = [];
        for await (const chunk of data){
            size += chunk.byteLength;
            if (size > maxPartSize) {
                throw new MaxPartSizeExceededError(name, maxPartSize);
            }
            chunks.push(chunk);
        }
        if (typeof filename === 'string') {
            return new File(chunks, filename, {
                type: contentType
            });
        }
        return await new Blob(chunks, {
            type: contentType
        }).text();
    };
}

var _start = /*#__PURE__*/ new WeakMap(), _end = /*#__PURE__*/ new WeakMap(), _offset = /*#__PURE__*/ new WeakMap(), _emitUp = /*#__PURE__*/ new WeakMap(), _emitDown = /*#__PURE__*/ new WeakMap();
class SliceStream extends node_stream.Transform {
    _transform(chunk, _, done) {
        _class_private_field_set__default["default"](this, _offset, _class_private_field_get__default["default"](this, _offset) + chunk.length);
        if (!_class_private_field_get__default["default"](this, _emitUp) && _class_private_field_get__default["default"](this, _offset) >= _class_private_field_get__default["default"](this, _start)) {
            _class_private_field_set__default["default"](this, _emitUp, true);
            const start = chunk.length - (_class_private_field_get__default["default"](this, _offset) - _class_private_field_get__default["default"](this, _start));
            if (_class_private_field_get__default["default"](this, _offset) > _class_private_field_get__default["default"](this, _end)) {
                const end = chunk.length - (_class_private_field_get__default["default"](this, _offset) - _class_private_field_get__default["default"](this, _end));
                _class_private_field_set__default["default"](this, _emitDown, true);
                this.push(chunk.slice(start, end));
            } else {
                this.push(chunk.slice(start, chunk.length));
            }
            return done();
        }
        if (_class_private_field_get__default["default"](this, _emitUp) && !_class_private_field_get__default["default"](this, _emitDown)) {
            if (_class_private_field_get__default["default"](this, _offset) >= _class_private_field_get__default["default"](this, _end)) {
                _class_private_field_set__default["default"](this, _emitDown, true);
                this.push(chunk.slice(0, chunk.length - (_class_private_field_get__default["default"](this, _offset) - _class_private_field_get__default["default"](this, _end))));
            } else {
                this.push(chunk);
            }
            return done();
        }
        return done();
    }
    constructor(start = 0, end = Infinity){
        super();
        _class_private_field_init__default["default"](this, _start, {
            writable: true,
            value: void 0
        });
        _class_private_field_init__default["default"](this, _end, {
            writable: true,
            value: void 0
        });
        _class_private_field_init__default["default"](this, _offset, {
            writable: true,
            value: 0
        });
        _class_private_field_init__default["default"](this, _emitUp, {
            writable: true,
            value: false
        });
        _class_private_field_init__default["default"](this, _emitDown, {
            writable: true,
            value: false
        });
        _class_private_field_set__default["default"](this, _start, start);
        _class_private_field_set__default["default"](this, _end, end);
    }
}
function streamSlice(start = 0, end = Infinity) {
    return new SliceStream(start, end);
}

async function readableStreamToString(stream, encoding) {
    const reader = stream.getReader();
    const chunks = [];
    async function read() {
        const { done , value  } = await reader.read();
        if (done) {
            return;
        } else if (value) {
            chunks.push(value);
        }
        await read();
    }
    await read();
    return Buffer.concat(chunks).toString(encoding);
}
const defaultFilePathResolver = ({ filename ,  })=>{
    const ext = filename ? node_path.extname(filename) : '';
    return 'upload_' + node_crypto.randomBytes(4).readUInt32LE(0) + ext;
};
async function uniqueFile(filepath) {
    const ext = node_path.extname(filepath);
    let uniqueFilepath = filepath;
    for(let i = 1; await promises.stat(uniqueFilepath).then(()=>true).catch(()=>false); i++){
        uniqueFilepath = (ext ? filepath.slice(0, -ext.length) : filepath) + `-${new Date().getTime()}${ext}`;
    }
    return uniqueFilepath;
}
function createFileUploadHandler({ directory =node_os.tmpdir() , avoidFileConflicts =true , file =defaultFilePathResolver , filter , maxPartSize =3000000  } = {}) {
    return async ({ name , filename , contentType , data  })=>{
        if (!filename || filter && !await filter({
            name,
            filename,
            contentType
        })) {
            return undefined;
        }
        const dir = typeof directory === 'string' ? directory : directory({
            name,
            filename,
            contentType
        });
        if (!dir) {
            return undefined;
        }
        const filedir = node_path.resolve(dir);
        const path = typeof file === 'string' ? file : file({
            name,
            filename,
            contentType
        });
        if (!path) {
            return undefined;
        }
        let filepath = node_path.resolve(filedir, path);
        if (avoidFileConflicts) {
            filepath = await uniqueFile(filepath);
        }
        await promises.mkdir(node_path.dirname(filepath), {
            recursive: true
        }).catch(()=>{});
        const writeFileStream = node_fs.createWriteStream(filepath);
        let size = 0;
        let deleteFile = false;
        try {
            for await (const chunk of data){
                size += chunk.byteLength;
                if (size > maxPartSize) {
                    deleteFile = true;
                    throw new MaxPartSizeExceededError(name, maxPartSize);
                }
                writeFileStream.write(chunk);
            }
        } finally{
            writeFileStream.end();
            await node_util.promisify(node_stream.finished)(writeFileStream);
            if (deleteFile) {
                await promises.rm(filepath).catch(()=>{});
            }
        }
        return new NodeOnDiskFile(filepath, contentType);
    };
}
class NodeOnDiskFile {
    get size() {
        const stats = node_fs.statSync(this.filepath);
        if (this.slicer) {
            const slice = this.slicer.end - this.slicer.start;
            return slice < 0 ? 0 : slice > stats.size ? stats.size : slice;
        }
        return stats.size;
    }
    slice(start, end, type) {
        if (typeof start === 'number' && start < 0) start = this.size + start;
        if (typeof end === 'number' && end < 0) end = this.size + end;
        const startOffset = this.slicer?.start || 0;
        start = startOffset + (start || 0);
        end = startOffset + (end || this.size);
        return new NodeOnDiskFile(this.filepath, typeof type === 'string' ? type : this.type, {
            start,
            end
        });
    }
    async arrayBuffer() {
        let stream = node_fs.createReadStream(this.filepath);
        if (this.slicer) {
            stream = stream.pipe(streamSlice(this.slicer.start, this.slicer.end));
        }
        return new Promise((resolve, reject)=>{
            const buf = [];
            stream.on('data', (chunk)=>buf.push(chunk));
            stream.on('end', ()=>resolve(Buffer.concat(buf)));
            stream.on('error', (err)=>reject(err));
        });
    }
    stream() {
        let stream = node_fs.createReadStream(this.filepath);
        if (this.slicer) {
            stream = stream.pipe(streamSlice(this.slicer.start, this.slicer.end));
        }
        return node_stream.Readable.toWeb(stream);
    }
    async text() {
        return readableStreamToString(this.stream());
    }
    get [Symbol.toStringTag]() {
        return 'File';
    }
    remove() {
        return promises.unlink(this.filepath);
    }
    getFilePath() {
        return this.filepath;
    }
    constructor(filepath, type, slicer){
        this.filepath = filepath;
        this.type = type;
        this.slicer = slicer;
        this.lastModified = 0;
        this.webkitRelativePath = '';
        this.name = node_path.basename(filepath);
    }
}

/**
 * Allows you to handle multipart forms (file uploads) for your app.
 *
 * TODO: Update this comment
 * @see https://remix.run/utils/parse-multipart-form-data
 */ async function parseMultipartFormData(request, uploadHandler) {
    const contentType = request.headers['content-type'] || '';
    const [type, boundary] = contentType.split(/\s*;\s*boundary=/);
    if (!boundary || type !== 'multipart/form-data') {
        throw new TypeError('Could not parse content as FormData.');
    }
    const formData = new FormData();
    const parts = streamMultipart(node_stream.Readable.toWeb(request), boundary);
    for await (const part of parts){
        if (part.done) break;
        if (typeof part.filename === 'string') {
            // only pass basename as the multipart/form-data spec recommends
            // https://datatracker.ietf.org/doc/html/rfc7578#section-4.2
            part.filename = part.filename.split(/[/\\]/).pop();
        }
        const value = await uploadHandler(part);
        if (typeof value !== 'undefined' && value !== null) {
            formData.append(part.name, value);
        }
    }
    return formData;
}
function isMultipartFormDataRequest(req) {
    const contentTypeHeader = req.headers['content-type'];
    return contentTypeHeader?.startsWith('multipart/form-data') || contentTypeHeader === 'application/x-www-form-urlencoded';
}
const nodeHTTPFormDataContentTypeHandler = contentType.createNodeHTTPContentTypeHandler({
    isMatch (opts) {
        return isMultipartFormDataRequest(opts.req);
    },
    async getBody (opts) {
        const fields = Object.fromEntries(opts.query);
        return {
            ok: true,
            data: fields,
            preprocessed: false
        };
    },
    getInputs (opts) {
        const req = opts.req;
        const unparsedInput = req.query.get('input');
        if (!unparsedInput) {
            return {
                0: undefined
            };
        }
        const transformer = opts.router._def._config.transformer;
        const deserializedInput = transformer.input.deserialize(JSON.parse(unparsedInput));
        return {
            0: deserializedInput
        };
    }
});

exports.experimental_composeUploadHandlers = composeUploadHandlers;
exports.experimental_createFileUploadHandler = createFileUploadHandler;
exports.experimental_createMemoryUploadHandler = createMemoryUploadHandler;
exports.experimental_isMultipartFormDataRequest = isMultipartFormDataRequest;
exports.experimental_parseMultipartFormData = parseMultipartFormData;
exports.nodeHTTPFormDataContentTypeHandler = nodeHTTPFormDataContentTypeHandler;
