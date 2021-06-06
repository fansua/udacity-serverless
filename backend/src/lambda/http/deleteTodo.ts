import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import *  as AWS from 'aws-sdk'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'



const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const logger = createLogger('create-todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log("Processing the delete TODO event...");
  
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId

  const response = await processDeleteTodo(userId, todoId)



  if(response === -1){
    console.log("Incorrect user permission to delete item")
    return {
      statusCode: 403,
      headers:{
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: `User doesn't have permission to delete item`
    }
  }

  console.log("Deleting the Item")

  console.log("item deleted")
  // TODO: Remove a TODO item by id
  return {
    statusCode: 204,
    headers:{
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }
}


const processDeleteTodo = async (userId: string, todoId: string) => {
   const itemResponse = await getItem(todoId)

   if(itemResponse.Item.userId !== userId){
     return -1
   }
   deleteItem(todoId)
   return 1

}

const deleteItem = async(id: string) => {

  logger.info(`deleting item`)
  await docClient.delete({
    TableName: todosTable,
    Key:{
       todoId:id
    }
   
  }).promise()

}

const getItem = async(id:string) => {

  const todoItem = await docClient.get({
    TableName: todosTable,
    Key: {
      todoId:id
    }
  }).promise()

  return todoItem
}
