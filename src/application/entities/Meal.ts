import KSUID from "ksuid";

export class Meal{
  readonly id: string;

  readonly accountId: string;

  status: Meal.Status;

  attempts: number;

  inputType: Meal.InputType;

  inputFileKey: string;

  name: string;

  icon: string;

  foods: Meal.Food[];

  readonly createdAt: Date;


  constructor(attr: Meal.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string; 
    this.accountId = attr.accountId;
    this.status = attr.status;
    this.attempts = attr.attempts ?? 0;
    this.inputType = attr.inputType;
    this.inputFileKey = attr.inputFileKey;
    this.name = attr.name ?? '';
    this.icon = attr.icon ?? '';
    this.foods = attr.foods?? [];    
    this.createdAt = attr.createdAt ?? new Date();
  }
  
}

export namespace Meal {
  export type Attributes = {
    readonly accountId: string;
    status: Meal.Status;
    attempts?: number;
    inputType: Meal.InputType;
    inputFileKey: string;
    name?: string;
    icon?: string;
    foods?: Meal.Food[];    
    id?: string;
    createdAt?: Date;
  };  
  export enum Status {
    UPLOADING = 'UPLOADING',
    QUEUEO = 'QUEUEO',
    PROCESSING = 'PROCESSING',
    SUCESS = 'SUCESS',
    FAILED = 'FAILED',
  }

  export enum InputType{  
    AUDIO = 'AUDIO',
    PICTURE = 'PICTURE',  
  }

  export type Food = {
    name: string;
    quantity: string;
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;

  };
}