import *  as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'

const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const todosByUserIndex = process.env.TODOS_USER_INDEX

const logger = createLogger('Get-todosAll-dao')

export const getAllTodos = async (userId: string) => {

  logger.info(`fetching all todo items`)
  try{
    const result = await docClient.query({
      TableName: todosTable,
      IndexName: todosByUserIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()
  
    return result.Items as TodoItem[]
  } catch(e){
    throw new Error(e)
  }

    
  }