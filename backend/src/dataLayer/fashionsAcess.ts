import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { FashionItem } from '../models/FashionItem'
import { FashionUpdate } from '../models/FashionUpdate'

// FASHION: Implement the dataLayer logic
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('Fashions data access')

export class FashionsAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly fashionsTable = process.env.FASHIONS_TABLE,
    private readonly fashionCreatedIndex = process.env.FASHIONS_CREATED_AT_INDEX
  ) {}

  async getAllFashions(userId: string): Promise<FashionItem[]> {
    logger.info(`Getting all fashions (userId: ${userId})`)

    const result = await this.docClient
      .query({
        TableName: this.fashionsTable,
        IndexName: this.fashionCreatedIndex,
        KeyConditionExpression: 'userId = :pk',
        ExpressionAttributeValues: {
          ':pk': userId
        }
      })
      .promise()

    const items = result.Items
    return items as FashionItem[]
  }

  async getFashion(fashionId: String, userId: String): Promise<FashionItem> {
    logger.info(`Getting fashion (fashionId: ${fashionId})`)
    const params = {
      TableName: this.fashionsTable,
          Key: {
            fashionId: fashionId,
            userId: userId
          }
     };
    const result = await this.docClient.get(params,
      (err) => {
        if (err) {
          throw new Error(err.message)
        }
      }).promise()
      logger.info(`Getting fashion ${result}`)
    return result.Item as FashionItem
  }

  async createFashion(fashionItem: FashionItem): Promise<FashionItem> {
    logger.info('Create new fashion')

    await this.docClient
      .put({
        TableName: this.fashionsTable,
        Item: fashionItem
      })
      .promise()

    return fashionItem
  }

  async updateFashion(
    fashionId: String,
    userId: String,
    updateFashionItem: FashionUpdate
  ): Promise<FashionUpdate> {
    logger.info(`Update fashion (${fashionId})`)

    await this.docClient
      .update({
        TableName: this.fashionsTable,
        Key: {
          fashionId: fashionId,
          userId: userId
        },
        UpdateExpression:
          'set #fashion_name = :name, description = :description, price = :price, dueDate = :dueDate, done = :done',
        ExpressionAttributeNames: { '#fashion_name': 'name' },
        ExpressionAttributeValues: {
          ':name': updateFashionItem.name,
          ':dueDate': updateFashionItem.dueDate,
          ':done': updateFashionItem.done
        }
      })
      .promise()

    return updateFashionItem
  }

  async deleteFashion(fashionId: String, userId: String) {
    logger.info('Delete fashion')

    await this.docClient
      .delete(
        {
          TableName: this.fashionsTable,
          Key: {
            fashionId: fashionId,
            userId: userId
          }
        },
        (err) => {
          if (err) {
            throw new Error(err.message)
          }
        }
      )
      .promise()
  }

  async updateFashionAttachmentUrl(
    fashionId: string,
    userId: string,
    url: string
  ) {
    logger.info(`Update fashion AttachmentUr: ${url}`)

    await this.docClient
      .update({
        TableName: this.fashionsTable,
        Key: {
          fashionId: fashionId,
          userId: userId
        },
        UpdateExpression: "set attachmentUrl = :url",
        ExpressionAttributeValues: {
          ":url": url,
        }
      })
      .promise()
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance')

    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
