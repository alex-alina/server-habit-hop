import * as HttpStatus from 'http-status-codes';
import * as Koa from 'koa';
import { verify } from '../jwt';

export const userAuth =  async (ctx: Koa.Context, next) => {
    const header: string | undefined= ctx.request.headers.authorization
    let token;

    if (header && header.startsWith('Bearer ')) {
      token = header.split(' ')[1];
    }
   
    if(!!(token && verify(token))) {
     await next()
    } 
    else {
      ctx.throw('Unauthorized request', HttpStatus.StatusCodes.UNAUTHORIZED)
    }  
};
