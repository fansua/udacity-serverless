import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { fetchAllTodos } from '../../service/getAllTodos'

const logger = createLogger('FETCH-TODO-REQ')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info(`Received ${event.httpMethod} request to process ${logger.name} event `);


  logger.info('Processing get all todos event',event)

  const userId = getUserId(event)

  try{
    const  items = await fetchAllTodos(userId)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items
      })
    }
  } catch(e) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        "Error": "Fail to fetch all TODO Items"
      })
    }
  }
  


}



