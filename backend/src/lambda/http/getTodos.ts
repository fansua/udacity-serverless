import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { TodoItem } from '../../models/TodoItem'

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

const logger = createLogger('getTodos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Prcessing get all todos event',event)

  const userId = getUserId(event)
  const  items = await getTodos(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}

const getTodos = async (userId: string) => {
  // check if user exist 
   return await getAllTodos(userId)
}

const getAllTodos = async (userId: string) => {

  const result = await docClient.query({
    TableName: todosTable,
    //IndexName: todosByUserIndex,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise()

  return result.Items as TodoItem[]
}
