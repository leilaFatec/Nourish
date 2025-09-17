import { PreTokenGenerationV2TriggerEvent } from "aws-lambda";

export async function handler(event: PreTokenGenerationV2TriggerEvent) { 
  console.log(JSON.stringify(event, null, 2));

  event.response = {
    claimsAndScopeOverrideDetails: {
        accessTokenGeneration: {
            claimsToAddOrOverride: {
              internalId: '????',
            },
        },
    },
  };

  return event;
}