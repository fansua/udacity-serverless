import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { TodoItem } from '../models/TodoItem'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

const s3 = new AWS.S3({
    signatureVersion: 'v4'
  })
  
  const bucketName = process.env.ATTACHMENTS_S3_BUCKET
  const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)
  const logger = createLogger('GEN-TODO-ATTACH-URL-DAO')


export const getSignedUrl = async (id: string) => {
    logger.info(`Generating upload URL for attachment ${id}`)

  
    const url = s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: id,
        Expires: urlExpiration
      })

      return url
  }

  export const generateS3attachmentUrl = async(id:string) => {
    const url = `https://${bucketName}.s3.amazonaws.com/${id}`
    return url
      
  }

  export const updatetodoItemUrl = async(todoItem: TodoItem,attachmentUrl:string)  => {
    const updateTodoItem = {
      ...todoItem,
      attachmentUrl:attachmentUrl
    }
    
    await docClient.put({
      TableName: todosTable,
      Item: updateTodoItem,
    }).promise()

  }