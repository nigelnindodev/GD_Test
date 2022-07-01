import * as Koa from 'koa';
import * as KoaBody from 'koa-bodyparser';

import { jsonLog } from 'koa-json-log';
import { config } from './config';
import { registerRoutes } from './routes';
import {runMigrations} from "./models/table_gen";

const app = new Koa();

// run db migrations
runMigrations();

app.use(jsonLog());
app.use(KoaBody());

registerRoutes(app);

app.listen(config.port);

console.log(`Server is running at http://localhost:${config.port}/`);
