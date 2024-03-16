import 'reflect-metadata';
import { useExpressServer } from 'routing-controllers';
import express from 'express';
import { Server } from '@configuration';

const expressApp = express();
console.info("Starting server");

useExpressServer(expressApp, Server.Settings).listen(Server.Port);
console.info(`Server started, Listening on port ${Server.Port}`);