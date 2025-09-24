import { Meal } from "@application/entities/Meal";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { s3Client } from "@infra/clients/S3Client";
import { Injectable } from "@kernel/decorators/Injectable";
import { AppConfig } from "@shared/config/AppConfig";
import { minutesToSeconds } from "@shared/utils/minutesToSeconds";

import KSUID from "ksuid";

@Injectable()
export class MealsFileStorageGateway{
  constructor(private readonly config: AppConfig){}  

  static generateInputFileKey({
    accountId,
    inputType,
  }: MealsFileStorageGateway.GenerateInputFileKeyParams): string {
    const extension = inputType === Meal.InputType.AUDIO ? 'm4a' : 'jpeg';
    const filename = `${KSUID.randomSync().string}.$(extension)`;

    return `${accountId}/${filename}` 
  }

  async createPOST({
    file,
    mealId,
  }: MealsFileStorageGateway.CreatePOSTParams): Promise<MealsFileStorageGateway.CreatePOSTResult>{
    const bucket = this.config.storage.nourishBucket;
    const contentType = file.inputType === Meal.InputType.AUDIO ? 'audio/m4a' : 'image/jpeg';

    const { url, fields} = await createPresignedPost(s3Client, {
      Bucket: bucket,
      Key: file.key,
      Expires: minutesToSeconds(5),
      Conditions: [
        {bucket},
        [ 'eq', '$key', file.key],
        [ 'eq', '$Content-Type', contentType],
        ['content-length-range', file.size, file.size],
      ],
      Fields: {
        'x-amz-meta-mealid': mealId,
      },
    });
      
    const uploadSignature = Buffer.from(
      JSON.stringify({
        url, 
        fields:{
          ...fields,
          'Content-Type': contentType,
        },
      }),
    ).toString('base64');

    return { uploadSignature };
}
}
export namespace MealsFileStorageGateway{
  export type GenerateInputFileKeyParams = {
    accountId: string;
    inputType: Meal.InputType;
  };  
  
  export type CreatePOSTParams = {
    mealId: string;
    file:{
      key: string;
      size: number;
      inputType: Meal.InputType;
    };   
  };

  export type CreatePOSTResult = {
    uploadSignature: string;
  };

}