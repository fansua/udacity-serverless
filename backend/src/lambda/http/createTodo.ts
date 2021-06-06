import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import *  as AWS from 'aws-sdk'
import * as uuid from 'uuid'

const doClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { TodoItem } from '../../models/TodoItem'

const logger = createLogger('create-todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing create TODO event...',{event});
  
  const userId = getUserId(event);

  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  const response = createToDoItem(userId,newTodo)
   
  
  return {
    statusCode: 201,
    headers:{
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      response
    })
  }
}

const createToDoItem  = async(id: string, data: CreateTodoRequest) => {

  const todoId = uuid.v4()

  const createdAt = new Date().toISOString()

  logger.info(`Creating todo ${todoId} for user ${id}`)

  const newTodoItem = {
    todoId, 
    userId:id,
    createdAt,
    done: false,
    attachmentUrl: null,
    ...data
  }
  
  await storeItem(newTodoItem)

  return  newTodoItem
}

const storeItem = async (data: TodoItem) => {

  await doClient.put({
    TableName: todosTable,
    Item: data
  }).promise()

}
