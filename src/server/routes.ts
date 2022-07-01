
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import {parse, stringify, toJSON, fromJSON} from 'flatted';
import {processCreateReservation, getAllReservations, getReservation, processDeleteReservation} from "./services/reservation_service";
import {processCreateTitle} from "./services/title_service";
import {ApiResponse} from "./utils/ApiResponse";

export function registerRoutes(app: Koa) {

    const router = new KoaRouter();

    router.get('/', async (ctx) => {
        const welcomeText = 'Welcome to Koa!';
        ctx.body = `<!DOCTYPE html>
<html>
<head>
    <title>${welcomeText}</title>
</head>
<body>
    <h1>${welcomeText}</h1>
</body>
</html>`;
    });

    router.post('/reservation', async (ctx) => {
        try {
            const result: ApiResponse = await processCreateReservation(ctx);
            ctx.status = result.statusCode;
            ctx.body = result.response;
        } catch (e) {
            console.log(e);
            ctx.status = 500;
        }
    });

    router.get('/reservation', async(ctx) => {
       const result: ApiResponse = await getAllReservations();
        ctx.status = result.statusCode;
        ctx.body = result.response;
    });

    router.get('/reservation/:id', async(ctx) => {
        // we will have a GET here for fetching a specific reservation
        const result: ApiResponse = await getReservation(parseInt(ctx.params.id));
        ctx.status = result.statusCode;
        ctx.body = result.response;
    });

    router.delete('/reservation/:id', async(ctx) => {
        // we will finally have a DELETE for removing reservations
        const result: ApiResponse = await processDeleteReservation(ctx.params.id);
        ctx.status = result.statusCode;
        ctx.body = result.response;
    });

    router.post('/title', async(ctx) => {
       // while going through the problem I realized we also need an additional endpoint to create new books
        const result: ApiResponse = await processCreateTitle(ctx);
        ctx.status = result.statusCode;
        ctx.body = result.response;
    });

    // additional endpoint to get a title for testing

    app.use(router.routes());
    app.use(router.allowedMethods());

}
