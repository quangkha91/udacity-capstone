import { apiEndpoint } from '../config'
import { Fashion } from '../types/Fashion';
import { CreateFashionRequest } from '../types/CreateFashionRequest';
import Axios from 'axios'
import { UpdateFashionRequest } from '../types/UpdateFashionRequest';

export async function getFashions(idToken: string): Promise<Fashion[]> {
  console.log('Fetching Fashions')

  const response = await Axios.get(`${apiEndpoint}/fashions`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Fashions:', response.data)
  return response.data.items
}

export async function getFashionById(idToken: string, fashionId: string): Promise<Fashion> {
  const response = await Axios.get(`${apiEndpoint}/${fashionId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
      'Access-Control-Allow-Origin': '*'
    }
  })
  console.log(`fashion ${fashionId}:`, response.data)
  return response.data.item
}

export async function createFashion(
  idToken: string,
  newFashion: CreateFashionRequest
): Promise<Fashion> {
  const response = await Axios.post(`${apiEndpoint}/fashions`,  JSON.stringify(newFashion), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchFashion(
  idToken: string,
  FashionId: string,
  updatedFashion: UpdateFashionRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/fashions/${FashionId}`, JSON.stringify(updatedFashion), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteFashion(
  idToken: string,
  FashionId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/fashions/${FashionId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  FashionId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/fashions/${FashionId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
