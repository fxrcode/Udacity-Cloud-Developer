import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodoAccess } from '../dataLayer/todoAccess'
import { getUserId } from '../auth/utils'

const todoAccess = new TodoAccess()