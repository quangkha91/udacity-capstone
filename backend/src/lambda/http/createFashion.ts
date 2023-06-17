import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createFashion } from '../../businessLogic/fashions'
import { CreateFashionRequest } from '../../requests/CreateFashionRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newFashion: CreateFashionRequest = JSON.parse(event.body)
    let userId = getUserId(event)
    const { fashionId, name, dueDate, createdAt, done } = await createFashion(userId, newFashion)
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: { fashionId, name, dueDate, createdAt, done }
      })
    };
  }
)

handler.use(
  cors({
    credentials: true
  })
)