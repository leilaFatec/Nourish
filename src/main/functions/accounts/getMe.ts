import 'reflect-metadata';

import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';
import { GetMeController } from '@application/controllers/accounts/GetMeController';
import { Registry } from '@kernel/di/Registry';
const controller = Registry.getInstance().resolve(GetMeController);

export const handler = lambdaHttpAdapter(GetMeController);