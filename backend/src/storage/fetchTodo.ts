import *  as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

const logger = createLogger('fetch-todo-dao')

export const getItem = async(id:string) => {
  
  logger.info(`fetching todo ${id}`)
  try{
    const result = await docClient.query({
      TableName: todosTable,
      KeyConditionExpression: 'todoId = :id',
      ExpressionAttributeValues:{
        ':id':id
      }
    }).promise()

    const todoItem = result.Items[0]
    logger.info(`Todo item ->  ${todoItem}`)
    
    logger.info(`Successfuly fetch item with id ${id}`)
  
    return todoItem as TodoItem

  } catch(e){
    
    logger.info(`todo ${id} does not exist`)
    return undefined
  }
    
  }
  