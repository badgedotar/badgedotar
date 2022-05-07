import { Models } from "appwrite"
import { appwrite } from "store/global"

const processExecution= (functionId: string, execution: Models.Execution, resolve: Function, reject: Function) => {
  if (execution.status === 'completed') {
    resolve(execution)
  } else if (execution.status === 'failed') {
    reject(execution)
  } else {
    setTimeout(() => {
      appwrite.functions.getExecution(functionId, execution.$id).then((execution: Models.Execution) => {
        processExecution(functionId, execution, resolve, reject)
      })
    }, 10 * 1000)
  }
}

export const runFunction = (functionId: string, data?: string | undefined) => {
  return new Promise((resolve, reject) => {
    appwrite.functions.createExecution(functionId, data).then(async (execution) => {
      setTimeout(() => {
        processExecution(functionId, execution, resolve, reject)
      }, 3 * 1000)
    }).catch(reject)
  })
}