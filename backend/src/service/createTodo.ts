import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { storeItem } from '../storage/storeTodo'




const logger = createLogger('CREA-TODO-SVC')

export  const createToDo  = async(id: string, data: CreateTodoRequest) => {

    const todoId:string = uuid.v4()
  
    const createdAt = new Date().toISOString()
  
    logger.info(`Creating todo ${todoId} for user ${id}`)
  
    const newTodoItem: TodoItem = {
      todoId, 
      userId:id,
      createdAt,
      done: false,
      attachmentUrl: null,
      ...data
    }
    try{
       logger.info(`Processing new TODO item with id, ${todoId}`)
       await storeItem(newTodoItem)
      
      return newTodoItem
    } catch(e) {
      logger.info(`Error processing new TODO Item with id, ${todoId}`)
      throw new Error(e)
    }
  }
  
  