import { FashionsAccess } from '../dataLayer/fashionsAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils'
import { FashionItem } from '../models/FashionItem'
import { FashionUpdate } from '../models/FashionUpdate'
import { CreateFashionRequest } from '../requests/CreateFashionRequest'
import { UpdateFashionRequest } from '../requests/UpdateFashionRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

// FASHION: Implement businessLogic
const logger = createLogger('Fashions business logic')
const fashionAccess = new FashionsAccess()
const attachmentUtils = new AttachmentUtils()

export async function getAllFashions(userId: string): Promise<FashionItem[]> {
  logger.info(`Get all Fashions userId: ${userId}`)
  return fashionAccess.getAllFashions(userId)
}

export async function getFashion(fashionId: string, userId: string): Promise<FashionItem> {
  logger.info(`Get fashionId: ${fashionId}`)
  return fashionAccess.getFashion(fashionId, userId)
}

export async function createFashion(
  userId: string,
  createFashionRequest: CreateFashionRequest
): Promise<FashionItem> {  
  logger.info(`Create new Fashion`)
  const itemId = uuid.v4()
  return await fashionAccess.createFashion({
    fashionId: itemId,
    userId: userId,
    name: createFashionRequest.name,
    dueDate: createFashionRequest.dueDate,
    createdAt: new Date().toISOString(),
    done: false
  })
}

export async function updateFashion(
  fashionId: string,
  userId: string,
  updateFashionRequest: UpdateFashionRequest
): Promise<FashionUpdate> {
  logger.info(`Update Fashion fashionId: ${fashionId} - userId: ${userId} `)
  return await fashionAccess.updateFashion(fashionId, userId, {
    name: updateFashionRequest.name,
    dueDate: updateFashionRequest.dueDate,
    done: updateFashionRequest.done
  })
}

export async function deleteFashion(fashionId: string, userId: string) {
  logger.info(`Delete Fashion fashionId: ${fashionId} - userId: ${userId} `)
  await fashionAccess.deleteFashion(fashionId, userId)
}

export async function createAttachmentPresignedUrl(
  fashionId: string,
  userId: string
) {
  logger.info('Create attachment presigned url')
  const imageId = uuid.v4()
  const url = attachmentUtils.getAttachmentUrl(imageId)
  await fashionAccess.updateFashionAttachmentUrl(fashionId, userId, url)
  return attachmentUtils.getUploadUrl(imageId)
}
