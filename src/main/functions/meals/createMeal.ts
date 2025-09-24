import 'reflect-metadata';

import { CreateMealController } from '@application/controllers/meals/CreateMealController';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';
import { Registry } from '@kernel/di/Registry';


const controller = Registry.getInstance().resolve(CreateMealController);

export const handler = lambdaHttpAdapter(CreateMealController);
