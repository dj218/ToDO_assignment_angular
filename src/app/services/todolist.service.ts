import { EventEmitter, Injectable } from '@angular/core';
import { Item } from '../models/item.model';
import { Filter } from '../models/filter.model';
import { UUID } from 'angular2-uuid';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TodolistService {

  userEmail : string = '';
  todolist : Item[] = [];
  tasksToDelete : string[] = [];
  filters : Filter = new Filter(this.userService.activteUserEmail,[],'','',[],'');
  tasksFilterApplied = new EventEmitter<Item[]>();

  constructor(private userService : UserService) {
    this.GetDataOfTodolist();
  }

  
  SaveDataToLocalStorage(){
    localStorage.setItem('todolist',JSON.stringify(this.todolist));
  }

  GetDataOfTodolist(){
    this.todolist = JSON.parse(localStorage.getItem('todolist')) || [];
  }

  GetTasks(){
    let userEmail = this.filters.userEmail;
    let taskTypeArray = this.filters.taskTypeArray;
    let startDate = this.filters.startDate;
    let endDate = this.filters.endDate;
    let taskCategoryArray = this.filters.taskCategoryArray;
    let sortType = this.filters.sortType;

    let filteredTasks : Item[] = this.todolist;
    filteredTasks = this.UserIdFilter(filteredTasks , userEmail);
    filteredTasks = this.TaskTypeFilter(filteredTasks , taskTypeArray);
    filteredTasks = this.InBetweendueDateFilter(filteredTasks , startDate ,endDate);
    filteredTasks = this.TaskCategoryFilter(filteredTasks,taskCategoryArray);
    filteredTasks = this.SortFilter(filteredTasks , sortType);

    this.tasksFilterApplied.emit(filteredTasks);
    return filteredTasks;
  }

  AddTask(item){
    let newTask = new Item(
      UUID.UUID(),
      this.userService.activteUserEmail,
      item.title,
      item.dueDate,
      item.categories,
      item.reminderDate,
      item.taskImageSrc,
      item.markAsDone
    );
    this.todolist = this.todolist || [];
    this.todolist.push(newTask);
    this.GetTasks();
    this.SaveDataToLocalStorage();
  }

  UpdateTask(itemID , item){
    let i=this.todolist.map(function(e) {return e.itemId; }).indexOf(itemID);
    this.todolist[i].title = item.title;
    this.todolist[i].dueDate = item.dueDate;
    this.todolist[i].categories = item.categories;
    this.todolist[i].reminderDate = item.reminderDate;
    this.todolist[i].itemImageSrc = item.itemImageSrc;
    this.todolist[i].markAsDone = item.markAsDone;
    this.GetTasks();
    this.SaveDataToLocalStorage();
  }

  DeleteTasks(){
    this.todolist = this.todolist.filter((task)=>{
      let status = true;
      for(let tITD of this.tasksToDelete){
        if(tITD == task.itemId)
          status = false;
      }
      return status;
    })
    this.tasksToDelete = [];
    this.GetTasks();
    this.SaveDataToLocalStorage();
  }

  GetTaskByTaskId(itemID){
    let i=this.todolist.map(function(e) {return e.itemId; }).indexOf(itemID);
    return this.todolist[i];
  }

  

  UserIdFilter (todolist : Item[],userEmail : string){
    return todolist.filter((item)=>{
      if(item.userEmail == userEmail)
        return true;
      else
        return false;
    })
  }

  TaskTypeFilter(todolist : Item[],taskTypeArray : string[]){
    if(taskTypeArray.length == 0)
      return todolist;
    else
      return todolist.filter((item)=>{
        let status = false;
        for (let taskTypeArrayEl of taskTypeArray){
          if(taskTypeArrayEl == 'completedTasks')
            status = status || (item.markAsDone == true)
          else if(taskTypeArrayEl == 'dueTasks' && !item.markAsDone)
            status = true
        }
        return status;
      })
  }

  InBetweendueDateFilter(todolist : Item[], startDate : string, endDate : string){
    if(startDate == '' && endDate == '')
        return todolist;
    else if(startDate == '')
      return todolist.filter((item)=>{
        return (new Date(item.dueDate) <= new Date(endDate));
      })
    else if(endDate == '')
      return todolist.filter((item)=>{
        return (new Date(startDate) <= new Date(item.dueDate));
      })
    else
    return todolist.filter((item)=>{
      return (new Date(startDate) <= new Date(item.dueDate) &&
              new Date(item.dueDate) <= new Date(endDate));
    })
  }

  TaskCategoryFilter(todolist : Item[], taskCategoryArray : string[]){

    if(taskCategoryArray.length == 0)
      return todolist;
    else
      return todolist.filter((item)=>{
        let status = false;
        for (let tcatA of taskCategoryArray){
          status = status || item.categories.includes(tcatA);
        }
        return status;
      })
  }

  SortFilter(todolist : Item[],sortingType : string){

    if(sortingType == '')
      return todolist;
    else if(sortingType == 'sortByNameAsc'){
      return todolist.sort((a,b)=>{return a.title > b.title ? 1 : -1});
    }
    else if(sortingType == 'sortByNameDesc'){
      return todolist.sort((a,b)=>{return a.title > b.title ? -1 : 1});
    }
    else if(sortingType == 'sortByDateAsc'){
      return todolist.sort((a,b)=>{return new Date(a.dueDate) > new Date(b.dueDate) ? 1 : -1});
    }
    else{
      return todolist.sort((a,b)=>{return new Date(a.dueDate) > new Date(b.dueDate) ? -1 : 1});
    }
  }

  CheckTaskToDelete(taskId : string){
    this.tasksToDelete.push(taskId);
  }

  UncheckTaskToDelete(ItemIdToUncheck : string){
    this.tasksToDelete = this.tasksToDelete.filter((itemId)=>{
      if(itemId == ItemIdToUncheck)
        return false;
      else
        return true;
    })
  }

}

