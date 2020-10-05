import express, {
  Application, Request, Response,
} from 'express';
// Boot express
const app: Application = express();
const port = 5000;
// Application routing
app.use(express.json());
app.get('/', (request: Request, response: Response) => response.status(200).json({ message: 'Hello' }));
// Start server
app.listen(port, () => console.log(`Server is listening on port ${port}!`));
