import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getFashion } from '../../businessLogic/fashions'
import { getUserId } from '../utils'

// FASHION: Get all FASHION item by fashtionId
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    let userId = getUserId(event)
    const fashionId = event.pathParameters.fashionId
    const fashion = await getFashion(fashionId,userId)
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        item: fashion
      })
    }
  }
);

handler
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true
        })
    )