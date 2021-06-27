import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import * as uuid from 'uuid'
import { generateSignedUrl, updateTodoUrl} from '../../service/generateUploadUrl'
import { createLogger } from '../../utils/logger'



const logger = createLogger('GEN-TODO-ATTACH-URL-REQ')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info(`Received ${event.httpMethod} request to process ${logger.name} event `);

  
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event);
  const attachmentUrlId = uuid.v4()

  const  url = await generateSignedUrl(attachmentUrlId)
  
  logger.info(`This is the upload URL: ${url}`)

  await updateTodoUrl(userId,todoId,attachmentUrlId)
  
  return {
    statusCode: 201,
    headers:{
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }

  
}
