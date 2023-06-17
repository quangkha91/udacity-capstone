import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getAllFashions } from '../../businessLogic/fashions'
import { getUserId } from '../utils';

// FASHION: Get all FASHION items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = getUserId(event)
    const fashions = await getAllFashions(userId)
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: fashions
      })
    }
  }
);

handler.use(
  cors({
    credentials: true
  })
)