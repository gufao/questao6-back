'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var express_1 = __importDefault(require('express'));
var crypto_1 = __importDefault(require('crypto'));
var cors_1 = __importDefault(require('cors'));
// Boot express
var app = express_1.default();
var port = process.env.PORT || '5000';
// Application routing
app.use(cors_1.default());
app.use(express_1.default.json());
app.get('/', function (request, response) {
  return response.status(200).json({ message: 'App Questão 6 - Augusto Linhares e Dayana Linhares' });
});
app.post('/encrypt', function (request, response) {
  var texto = request.body.texto;
  if (!texto) {
    return response.status(200).json({ error: 'Sem texto para encriptar' });
  }
  var password = crypto_1.default.randomBytes(16).toString('hex');
  var salt = crypto_1.default.randomBytes(16).toString('hex');
  var key = crypto_1.default.pbkdf2Sync(password, salt, 10000, 16, 'sha256');
  var iv = crypto_1.default.randomBytes(16).toString('hex');
  var cipher = crypto_1.default.createCipheriv('aes-128-gcm', key, iv);
  cipher.write(texto);
  cipher.end();
  var cipherTag = cipher.getAuthTag();
  var inputEncrypted = cipher.read();
  return response.status(200).json({
    password: password,
    salt: salt,
    cipherTagHex: cipherTag.toString('hex'),
    keyHex: key.toString('hex'),
    iv: iv,
    encrypted: inputEncrypted.toString('hex'),
  });
});
app.post('/decrypt', function (request, response) {
  var _a = request.body,
    cipherTagHex = _a.cipherTagHex,
    keyHex = _a.keyHex,
    iv = _a.iv,
    encrypted = _a.encrypted;
  if (!cipherTagHex || !keyHex || iv || encrypted) {
    return response.status(200).json({
      error: 'Não foi possível decifrar o texto. Verifique os dados inseridos',
    });
  }
  var decipher = crypto_1.default.createDecipheriv('aes-128-gcm', Buffer.from(keyHex, 'hex'), iv);
  decipher.setAuthTag(Buffer.from(cipherTagHex, 'hex'));
  decipher.write(Buffer.from(encrypted, 'hex'));
  decipher.end();
  var result = decipher.read();
  return response.status(200).json({ result: result.toString('utf-8') });
});
// Start server
app.listen(port, function () {
  return console.log('Server is listening on port ' + port + '!');
});
