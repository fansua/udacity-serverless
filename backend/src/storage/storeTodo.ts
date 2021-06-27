import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'
import *  as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const doClient = new XAWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

const logger = createLogger('CREA-TODO-DAO')

export const storeItem = async (data: TodoItem) => {

  logger.info(`Saving new todo item ${data.todoId}`)
  try {

     await doClient.put({
      TableName: todosTable,
      ReturnValues: 'NONE',
      Item: data
    }).promise()

    logger.info(`${data.todoId} was successfully saved to DB`)
  } catch(e) {
    
    logger.info(`Error saving item with id, ${data.todoId}`)
    throw new Error(e)
  }
  }