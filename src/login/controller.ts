import * as HttpStatus from 'http-status-codes';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import { Repository } from 'typeorm';
import AppDataSource from '../db';
import User from '../user/entity';
import { sign } from '../jwt'

interface AuthenticatePayload {
  password: string;
  email: string; 
}

const routerOpts: Router.IRouterOptions = {
  prefix: '/logins',
};
const router: Router = new Router(routerOpts);
const userRepo:Repository<User> = AppDataSource.getRepository(User);

router.post('/', async (ctx:Koa.Context) => {
  const { email, password } = <AuthenticatePayload>ctx.request.body;

  const user = await userRepo
    .createQueryBuilder("user")
    .select("user")
    .where("user.email = :email", { email })
    .addSelect("user.password")
    .getOne()

  if (!user || !user.id) {
    ctx.throw('A user with this email does not exist', HttpStatus.StatusCodes.BAD_REQUEST)
  } 
   if (!await user.checkPassword(password)) {
    ctx.throw('Incorrect password or email', HttpStatus.StatusCodes.BAD_REQUEST)
  } 
  
  //update last login timestamp
  userRepo.save(user);

  const jwt = sign({ id: user.id })
 
  ctx.body = {
    data: { jwt },
  };
});

export default router;