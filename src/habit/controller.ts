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
     ctx.throw( HttpStatus.StatusCodes.BAD_REQUEST, "You can add a maximum of four habits per goal");
  }

  const habit = habitRepo.create(<HabitRequest>ctx.request.body);
  habit.goal = <goalEntity>goal;

  await habitRepo.save(habit);
  ctx.status = HttpStatus.StatusCodes.CREATED;
  ctx.body = {
    data: { habit },
  };
});

router.delete('/:habitId', userAuth, async (ctx:Koa.Context) => {
    const habit = await habitRepo.findOne({
    relations: {
      goal: true,
    },
    where: {
      id:ctx.params.habitId,
      goal: {id: ctx.params.goalId,}
    }
  });


  if (!habit) {
    ctx.throw("Habit not found", HttpStatus.StatusCodes.NOT_FOUND);
  }

  await habitRepo.delete(habit.id);

  ctx.status = HttpStatus.StatusCodes.NO_CONTENT;
});

router.patch('/:habitId', userAuth, async (ctx:Koa.Context) => {
   const habit: Habit | null = await habitRepo.findOne({
    relations: {
      goal: true,
    },
    where: {
      id:ctx.params.habitId,
      goal: {id: ctx.params.goalId,}
    }
  });

  if (!habit) {
    ctx.throw("Goal not found", HttpStatus.StatusCodes.NOT_FOUND);
  }

  const reqHabit = <HabitRequest>ctx.request.body;
  const editedHabit = {habitDescription: reqHabit.habitDescription}
  const updatedHabit = await habitRepo.merge(habit, editedHabit);

  habitRepo.save(updatedHabit);

  ctx.body = {
    data: { habit: updatedHabit },
  };
});

export default router;