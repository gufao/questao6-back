import express, { Application, Request, Response } from 'express';
import crypto from 'crypto';
import cors from 'cors';

// Boot express
const app: Application = express();
const port = process.env.PORT || '5000';
// Application routing

app.use(cors());
app.use(express.json());

app.get('/', (request: Request, response: Response) =>
  response.status(200).json({
    message: 'App Questão 6 - Augusto Linhares e Dayana Linhares',
  })
);

app.post('/encrypt', (request: Request, response: Response) => {
  const { texto } = request.body;

  if (!texto) {
    return response.status(200).json({ error: 'Sem texto para encriptar' });
  }

  const password = crypto.randomBytes(16).toString('hex');
  const salt = crypto.randomBytes(16).toString('hex');
  const key = crypto.pbkdf2Sync(password, salt, 10000, 16, 'sha256');
  const iv = crypto.randomBytes(16).toString('hex');

  const cipher = crypto.createCipheriv('aes-128-gcm', key, iv);

  cipher.write(texto);
  cipher.end();
  const cipherTag = cipher.getAuthTag();

  const inputEncrypted = cipher.read();

  return response.status(200).json({
    password,
    salt,
    cipherTagHex: cipherTag.toString('hex'),
    keyHex: key.toString('hex'),
    iv,
    encrypted: inputEncrypted.toString('hex'),
  });
});

app.post('/decrypt', (request: Request, response: Response) => {
  const { cipherTagHex, keyHex, iv, encrypted } = request.body;

  const decipher = crypto.createDecipheriv('aes-128-gcm', Buffer.from(keyHex, 'hex'), iv);
  decipher.setAuthTag(Buffer.from(cipherTagHex, 'hex'));

  decipher.write(Buffer.from(encrypted, 'hex'));
  decipher.end();

  const result = decipher.read();

  return response.status(200).json({ result: result.toString('utf-8') });
});

// Start server
app.listen(port, () => console.log(`Server is listening on port ${port}!`));
