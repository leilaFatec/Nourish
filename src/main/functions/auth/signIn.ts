import 'reflect-metadata';

import { Registry } from '@kernel/di/Registry';
import { SignInController } from '@application/controllers/SignInController';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';


const controller = Registry.getInstance().resolve(SignInController);

export const handler = lambdaHttpAdapter(controller);
