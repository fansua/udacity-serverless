
import { deleteItem } from '../storage/deleteTodo'
import { getItem } from '../storage/fetchTodo'
import { createLogger } from '../utils/logger'

const logger = createLogger('DEL-TODO-SVC')
export const processDeleteTodo = async (userId: string, todoId: string) => {

    logger.info(`Processing delete item`)
    const itemResponse = await getItem(todoId)
  
    logger.info(`response ${itemResponse.name}`)
    if(itemResponse.userId !== userId){
      logger.info(`item for user ${userId} doesn't exist`)
      return false
    }
    logger.info(`item for user ${userId} does exist`)
    try{
      await deleteItem(todoId,itemResponse.name,itemResponse.createdAt)
    return true
    }catch(e){
     logger.info(`unable to delete item, ${e}`)
     return false
    }
    
 }



  
 