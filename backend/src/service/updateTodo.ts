import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { getItem } from '../storage/fetchTodo'
import { updateItem } from '../storage/updateTodo'
import { createLogger } from '../utils/logger'

const logger = createLogger('UPDTE-TODO-SVC')

export const updateTodo = async(userId: string, todoId: string, data:UpdateTodoRequest ) => {
  logger.info(`fetching item ${todoId} to update`)

    const item:TodoItem = await getItem(todoId)
  
   if(!item){
    logger.info('Not Found')
    throw new Error('Not found')
   }
   if(item.userId !== userId){
     logger.info('Unauthorized')
     throw new Error('Unauthorized')
   }
    logger.info(`Item is ready to be updated for user ${userId}`)
    await updateItem( userId,todoId, data as TodoUpdate,item.createdAt)
   
   
   }
