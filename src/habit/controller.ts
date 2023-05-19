import * as HttpStatus from 'http-status-codes';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import { Repository } from 'typeorm';
import AppDataSource from '../db';
import goalEntity from '../goal/entity';
import Habit, { HabitType } from './entity';
import { userAuth } from "../middleware/authChecker";

interface HabitRequest {
  habitDescription: string;
  habitType: HabitType;
  progressMetric: string;
}

const routerOpts: Router.IRouterOptions = {
  prefix: '/users/:userId/goals/:goalId/habits',
};

const router: Router = new Router(routerOpts);

const habitRepo:Repository<Habit> = AppDataSource.getRepository(Habit);

router.get('/', userAuth, async (ctx:Koa.Context) => {
  const habits = await habitRepo.find({
    relations: {
      goal: true,
    },
    where: {
      goal: {id: ctx.params.goalId,}
    }
  });

  ctx.body = {
    data: { habits },
  };
});

router.get('/:habitId', userAuth, async (ctx:Koa.Context) => {
  const habit = await habitRepo.findOne({
    relations: {
      goal: true,
    },
    where: {
      id: ctx.params.habitId,
      goal: {id: ctx.params.goalId,}
    }
  });

  if (!habit) {
    ctx.throw("Habit not found", HttpStatus.StatusCodes.NOT_FOUND);
  }

  ctx.body = {
    data: { habit },
  };
});

router.post('/', userAuth, async (ctx:Koa.Context) => {
  const goal = await AppDataSource.manager.findOneBy(goalEntity, {
    id: ctx.params.goalId,
  })
  const habits = await habitRepo.find({
    relations: {
      goal: true,
    },
    where: {
      goal: {id: ctx.params.goalId,}
    }
  });

  if(habits.length >= 4) {
     ctx.throw( HttpStatus.StatusCodes.BAD_REQUEST, "You can add a maximum of four habits");
  }

  const habit = habitRepo.create(<HabitRequest>ctx.request.body);
  habit.goal = <goalEntity>goal;

  await habitRepo.save(habit);
  ctx.status = HttpStatus.StatusCodes.CREATED;
  ctx.body = {
    data: { habit },
  };
});

// router.delete('/:goalId', userAuth, async (ctx:Koa.Context) => {
//   const goal = await goalRepo.findOne({
//     relations: {
//       user: true,
//     },
//     where: {
//       id: ctx.params.goalId,
//       user: {id: ctx.params.userId,}
//     }
//   });

//   if (!goal) {
//     ctx.throw("Goal not found", HttpStatus.StatusCodes.NOT_FOUND);
//   }

//   await goalRepo.delete(goal.id);

//   ctx.status = HttpStatus.StatusCodes.NO_CONTENT;
// });

// router.patch('/:goalId', userAuth, async (ctx:Koa.Context) => {
//   const goal:Goal | null = await goalRepo.findOne({
//     relations: {
//       user: true,
//     },
//     where: {
//       id: ctx.params.goalId,
//       user: {id: ctx.params.userId,}
//     }
//   });

//   if (!goal) {
//     ctx.throw("Goal not found", HttpStatus.StatusCodes.NOT_FOUND);
//   }

//   const updatedGoal = await goalRepo.merge(goal, <GoalRequest>ctx.request.body);

//   goalRepo.save(updatedGoal);

//   ctx.body = {
//     data: { goal: updatedGoal },
//   };
// });

export default router;