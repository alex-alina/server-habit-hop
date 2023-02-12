import { validate } from "class-validator";
import * as HttpStatus from 'http-status-codes';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import { Repository } from 'typeorm';
import AppDataSource from '../db';
import goalController from '../goal/controller';
import { userAuth } from "../middleware/authChecker";
import User from './entity';

interface UserRequest {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  confirmPassword: string;
}

const routerOpts: Router.IRouterOptions = {
  prefix: '/users',
};

const router: Router = new Router(routerOpts);

const userRepo:Repository<User> = AppDataSource.getRepository(User);

// router.get('/', async (ctx:Koa.Context) => {
//   const users = await userRepo.find();

//   // Respond with our users data.
//   ctx.body = {
//     data: { users },
//   };
// });

router.get('/:userId', userAuth, async (ctx:Koa.Context) => {
  const user = await userRepo.findOne({
    where: {
      id: ctx.params.userId,
    }
  });

  if (!user) {
    ctx.throw("User not found", HttpStatus.StatusCodes.NOT_FOUND);
  }

  ctx.body = {
    data: { user },
  };
});

router.post('/', async (ctx:Koa.Context) => {
  const data = <UserRequest>ctx.request.body;
  const { confirmPassword } = data;
  
  if(data.password !== confirmPassword) {
    ctx.throw("Passwords do not match", HttpStatus.StatusCodes.BAD_REQUEST)
  }
 
  const user: User = userRepo.create(data);

  const errors = await validate(user, { validationError: { target: false } })
  if(errors.length > 0) {
    const invalidConstraints = errors.map(error => error.constraints);
    const errorMessages = invalidConstraints.map(constraint => constraint ? Object.values(constraint) : '')
    ctx.throw(`${errorMessages}`, HttpStatus.StatusCodes.BAD_REQUEST)
  }

  await userRepo.save(user);

  ctx.status = HttpStatus.StatusCodes.CREATED;
  const {password, ...rest} = user;
  ctx.body = {
    data: { rest },
  };
});

router.delete('/:userId', userAuth, async (ctx:Koa.Context) => {
  const user= await userRepo.findOne(
    {
    where: {
      id: ctx.params.userId,
    }
  });

  if (!user) {
    ctx.throw("User not found", HttpStatus.StatusCodes.NOT_FOUND);
  }

  await userRepo.delete(user.id);

  ctx.status = HttpStatus.StatusCodes.NO_CONTENT;
});

router.patch('/:userId', userAuth, async (ctx:Koa.Context) => {
  const user:User | null = await userRepo.findOne(
    {
    where: {
      id: ctx.params.userId,
    }
  });

  if (!user) {
    ctx.throw("User not found", HttpStatus.StatusCodes.NOT_FOUND);
  }

  const updatedUser = await userRepo.merge(user, <UserRequest>ctx.request.body);

  userRepo.save(updatedUser);

  ctx.body = {
    data: { user: updatedUser },
  };
});

router.use('users/:userId/', goalController.routes(), goalController.allowedMethods())

export default router;