import { getSignedUrl, generateS3attachmentUrl,updatetodoItemUrl} from '../storage/generateSignedUrl'
import { getItem } from '../storage/fetchTodo'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'

const logger = createLogger('GEN-TODO-ATTACH-URL-SVC')

export const generateSignedUrl = async (attachmentId: string) => {
    logger.info(`Generating upload URL for attachment ${attachmentId}`)

  const uploadUrl = await getSignedUrl(attachmentId)

  return uploadUrl
  }

  export const updateTodoUrl = async(userId:string, todoId:string, attachmentId:string) => {
    logger.info(`updating url for todo ${todoId} for ${userId} user with ${attachmentId} attachment id`)

    const s3AttchmentUrl  = await generateS3attachmentUrl(attachmentId)

    const item:TodoItem = await getItem(todoId)

    await updatetodoItemUrl(item,s3AttchmentUrl)

  }