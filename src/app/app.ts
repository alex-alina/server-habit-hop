import * as cors from '@koa/cors';
import * as HttpStatus from 'http-status-codes';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import goalController from '../goal/controller';
import loginController from '../login/controller';
import userController from '../user/controller';
import logger = require('koa-logger');

const app: Koa =  new Koa();
app.use(cors());

app.use(logger());

app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
  try {
    await next();
  } catch (error) {
    ctx.status = error.statusCode || error.status || HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR;
    error.status = ctx.status;
    ctx.body = { error };
    ctx.app.emit('error', error, ctx);
  }
});

app.use(bodyParser());

app.use(userController.routes())
  .use(userController.allowedMethods())
  .use(goalController.routes())
  .use(goalController.allowedMethods())
  .use(loginController.routes())
  .use(loginController.allowedMethods())


app.on('error', console.error);

export default app;