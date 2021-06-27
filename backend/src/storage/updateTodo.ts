import *  as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { TodoUpdate } from '../models/TodoUpdate'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

const logger = createLogger('UPDATE-TODO-DAO')

export const updateItem = async (userId: string,todoId: string,data:TodoUpdate,createdAt:string) => {

    const {name, dueDate,done} = data
  logger.info(`updating todo ${todoId} ${userId}`)

  try{
    const response = await docClient.update({
      TableName: todosTable,
      Key:{ 
        todoId,
        createdAt
       },
      UpdateExpression: 'SET #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': name,
        ':dueDate': dueDate,
        ':done': done
      }
    }).promise()
    logger.info(`${response}`)
    logger.info(`Updated successfully`)
  } catch(e) {
    logger.info(e)
    throw new Error('Unable to update item')

  }
  
    
  
  }
  