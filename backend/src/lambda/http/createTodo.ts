import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createToDo } from '../../service/createTodo'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'


const logger = createLogger('CREA-TODO-REQ')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(`Received ${event.httpMethod} request to process ${logger.name} event `);

  const userId = getUserId(event);

  logger.info(`Processing ${logger.name} event for user ${userId}`);

  const newTodoRequest: CreateTodoRequest = JSON.parse(event.body)
  
  
 try{
  const response = await createToDo(userId,newTodoRequest)  
  logger.info(`created item->  ${response}`)
  return {
    statusCode: 201,
    headers:{
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: response
    })
  }
 } catch(e) {
   logger.info(`failed to create item with following error -> ${e}`)
  return {
    statusCode: 500,
    headers:{
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      'Error': e
    })
  }
 }
  
   
  
}


