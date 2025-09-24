import 'reflect-metadata';


import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';
import { ListMealsByDayController } from '@application/controllers/meals/ListMealsByDayController';
import { Registry } from '@kernel/di/Registry';


const controller = Registry.getInstance().resolve(ListMealsByDayController);

export const handler = lambdaHttpAdapter(ListMealsByDayController);
