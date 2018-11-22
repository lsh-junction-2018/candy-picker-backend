// load environment variables from dotenv file
import {} from 'dotenv/config';
import config from './config';
import Koa from 'koa';
import Helmet from 'koa-helmet';
import Logger from 'koa-logger';
import Cors from '@koa/cors';
import BodyParser from 'koa-bodyparser';
import Respond from 'koa-respond';
import routers from './routes';
import Static from 'koa-static';

import mqtt from 'libs/mqtt';

mqtt.connect();

const app = new Koa();

app.use(Helmet());

if (process.env.NODE_ENV === 'development') {
    app.use(Logger())
}

app.use(Cors())

app.use(BodyParser({
    enableTypes: ['json'],
    jsonLimit: '5mb',
    strict: true,
    onerror: function (err, ctx) {
      ctx.throw('body parse error', 422)
    }
}))

app.use(Respond())

app.use(Static(__dirname + '/public'));

// API routes
app.use(routers.routes())
app.use(routers.allowedMethods())

export default app;

