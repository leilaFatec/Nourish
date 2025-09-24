import 'reflect-metadata';


import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';
import { ListMealsByDayController } from '@application/controllers/meals/ListMealsByDayController';
import { Registry } from '@kernel/di/Registry';
import { GetMealByIdController } from '@application/controllers/meals/GetMealByIdController';


const controller = Registry.getInstance().resolve(GetMealByIdController);

export const handler = lambdaHttpAdapter(GetMealByIdController);
