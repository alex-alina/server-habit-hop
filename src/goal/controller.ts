import * as HttpStatus from 'http-status-codes';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import { Repository } from 'typeorm';
import AppDataSource from '../db';
import userEntity from '../user/entity';
import Goal, { Priority } from './entity';
import { userAuth } from "../middleware/authChecker";

interface GoalRequest {
  goalDefinition: string;
  priority: Priority;
  startDate: Date;
  endDate: Date;
}

const routerOpts: Router.IRouterOptions = {
  prefix: '/users/:userId/goals',
};

const router: Router = new Router(routerOpts);

const goalRepo:Repository<Goal> = AppDataSource.getRepository(Goal);

router.get('/', userAuth, async (ctx:Koa.Context) => {
  const goals = await goalRepo.find({
    relations: {
      user: true,
    },
    where: {
      user: {id: ctx.params.userId,}
    }
  });

  ctx.body = {
    data: { goals },
  };
});

router.get('/:goalId', userAuth, async (ctx:Koa.Context) => {
  const goal = await goalRepo.findOne({
    relations: {
      user: true,
    },
    where: {
      id: ctx.params.goalId,
      user: {id: ctx.params.userId,}
    }
  });

  if (!goal) {
    ctx.throw("Goal not found", HttpStatus.StatusCodes.NOT_FOUND);
  }

  ctx.body = {
    data: { goal },
  };
});

router.post('/', userAuth, async (ctx:Koa.Context) => {
  const user = await AppDataSource.manager.findOneBy(userEntity, {
    id: ctx.params.userId,
  })
  const goals = await goalRepo.find({
    relations: {
      user: true,
    },
    where: {
      user: {id: ctx.params.userId,}
    }
  });

  if(goals.length >= 3) {
     ctx.throw( HttpStatus.StatusCodes.BAD_REQUEST, "You can add a maximum of three goals");
  }

  const goal = goalRepo.create(<GoalRequest>ctx.request.body);
  goal.user = <userEntity>user;

  await goalRepo.save(goal);
  ctx.status = HttpStatus.StatusCodes.CREATED;
  ctx.body = {
    data: { goal },
  };
});

router.delete('/:goalId', userAuth, async (ctx:Koa.Context) => {
  const goal = await goalRepo.findOne({
    relations: {
      user: true,
    },
    where: {
      id: ctx.params.goalId,
      user: {id: ctx.params.userId,}
    }
  });

  if (!goal) {
    ctx.throw("Goal not found", HttpStatus.StatusCodes.NOT_FOUND);
  }

  await goalRepo.delete(goal.id);

  ctx.status = HttpStatus.StatusCodes.NO_CONTENT;
});

router.patch('/:goalId', userAuth, async (ctx:Koa.Context) => {
  const goal:Goal | null = await goalRepo.findOne({
    relations: {
      user: true,
    },
    where: {
      id: ctx.params.goalId,
      user: {id: ctx.params.userId,}
    }
  });

  if (!goal) {
    ctx.throw("Goal not found", HttpStatus.StatusCodes.NOT_FOUND);
  }

  const updatedGoal = await goalRepo.merge(goal, <GoalRequest>ctx.request.body);

  goalRepo.save(updatedGoal);

  ctx.body = {
    data: { goal: updatedGoal },
  };
});

export default router;