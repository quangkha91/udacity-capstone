import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateFashion } from '../../businessLogic/fashions'
import { UpdateFashionRequest } from '../../requests/UpdateFashionRequest'
import { getUserId } from '../utils'

    // FASHION: Update a FASHION item with the provided id using values in the "updatedFashion" object
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const fashionId = event.pathParameters.fashionId
    const updatedFashion: UpdateFashionRequest = JSON.parse(event.body)
    let userId = getUserId(event)
    let updatedFashionItem = await updateFashion(fashionId, userId, updatedFashion);

    return {
      statusCode: 200,
      body: JSON.stringify({
        updatedFashionItem
      })
    };
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )