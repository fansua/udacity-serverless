
import *  as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

const logger = createLogger('DEL-TODO-DAO')

export const deleteItem = async(todoId: string,itemName: string,createdAt:string) => {

    logger.info(`deleting item with id, ${todoId} with ${itemName}`)
    try{
       await docClient.delete({
        TableName: todosTable,
        Key: {
          todoId,
          createdAt
        },
        ReturnValues: 'NONE'
      }).promise()
       logger.info(`item, ${todoId} deleted successfully`)
    } catch(e){
      logger.info(e)
      logger.info(`Unable to delete item with id, ${todoId}`)
    }
    
  
  }