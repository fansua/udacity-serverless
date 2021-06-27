import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { processDeleteTodo } from '../../service/deleteTodo'


const logger = createLogger('DEL-TODO-REQ')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(`Received ${event.httpMethod} request to process ${logger.name} event `);


  logger.info("Processing the delete TODO event...");
  
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId

  const response = await processDeleteTodo(userId, todoId)

  if(response === false){
    logger.info("Incorrect user permission to delete item")
    return {
      statusCode: 403,
      headers:{
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: `User doesn't have permission to delete item`
    }
  }


  logger.info("item deleted")
  // TODO: Remove a TODO item by id
  return {
    statusCode: 204,
    headers:{
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(``)

}
}




