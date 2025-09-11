import 'reflect-metadata';

import { Registry } from '@kernel/di/Registry';
import { SignUpController } from '@application/controllers/SignUpController';
import { lambdaHttpAdapter } from '@main/adapters/lambdaHttpAdapter';


const controller = Registry.getInstance().resolve(SignUpController);

export const handler = lambdaHttpAdapter(controller);
