import { getAllTodos } from '../storage/getAllTodos'
import { createLogger } from '../utils/logger'


const logger = createLogger('FETCH-TODO-SVC')

export const fetchAllTodos = async (userId: string) => {
    try {
        const itemList = await getAllTodos(userId)
        logger.info(`TODO LST -> i${itemList}`)
        return itemList
    } catch(e) {
        throw new Error(e)
    }
     
  }