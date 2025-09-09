import { z } from 'zod';
import { Controller } from '../contracts/Controller';

const schema = z.object({
  account: z.object({
    name: z.string().min(1, 'Name is required'),
  }),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
});


export class HelloController extends Controller<unknown> {
  async handle(request: Controller.Request): Promise<Controller.Response<unknown>> {
    const parsedBody = schema.parse(request.body);
    
      return{
      statusCode: 200,
      body: {
      parsedBody,
      }, 
    };
  }
} 