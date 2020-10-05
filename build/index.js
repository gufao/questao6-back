"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
// Boot express
var app = express_1.default();
var port = 5000;
// Application routing
app.use(express_1.default.json());
app.get('/', function (request, response) { return response.status(200).json({ message: 'Hello' }); });
// Start server
app.listen(port, function () { return console.log("Server is listening on port " + port + "!"); });
