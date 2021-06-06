import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import *  as AWS from 'aws-sdk'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { TodoUpdate } from '../../models/TodoUpdate'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

 update(userId,todoId,updatedTodo)
 
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}


const updateItem = async (todoId: string, data:TodoUpdate) => {

  const {name, dueDate,done} = data

  await docClient.update({
    TableName: todosTable,
    Key:{ todoId },
    UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
    ExpressionAttributeNames: {
      "#name": "name"
    },
    ExpressionAttributeValues: {
      ":name": name,
      ":dueDate": dueDate,
      ":done": done
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

const update = async(userId: string, todoId: string, data:UpdateTodoRequest ) => {

 const item = await getItem(todoId)
 if(!item){
   console.log("Not found")
 }
 if(item.Item.userId !== userId){
   console.log("unauthrozied")
 }

 updateItem(todoId,data as TodoUpdate)


}
