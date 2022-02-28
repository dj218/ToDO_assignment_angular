import { EventEmitter, Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { Filter } from '../models/filter.model';
import { UUID } from 'angular2-uuid';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TodolistService {

  userEmail : string = '';
  constructor(private userService : UserService) {
    this.getData();
  }

  tasks : Task[] = [];
  tasksToDelete : string[] = [];
  filters : Filter = new Filter(this.userService.activteUserEmail,[],'','',[],'');
  tasksFilterApplied = new EventEmitter<Task[]>();

  addTask(task){
    let newTask = new Task(
      UUID.UUID(),
      this.userService.activteUserEmail,
      task.title,
      task.dueDate,
      task.categories,
      task.reminderDate,
      task.taskImage,
      task.taskImageSrc,
      task.markAsDone
    );
    this.tasks = this.tasks || [];
    this.tasks.push(newTask);
    this.getTasks();
    this.saveData();
  }

  updateTask(taskID , task){
    let i = 0;
    for (let taskEl of this.tasks){
      if(taskEl.taskId == taskID)
        break;
      i++;
    }
    this.tasks[i].title = task.title;
    this.tasks[i].dueDate = task.dueDate;
    this.tasks[i].categories = task.categories;
    this.tasks[i].reminderDate = task.reminderDate;
    this.tasks[i].taskImage = task.taskImage;
    this.tasks[i].taskImageSrc = task.taskImageSrc;
    this.tasks[i].markAsDone = task.markAsDone;
    this.getTasks();
    this.saveData();
  }

  getTaskByTaskId(taskId){
    let task : Task;
    for (let taskEl of this.tasks){
      if(taskEl.taskId == taskId){
        task = taskEl;
        break;
      }
    }
    return task;
  }

  getTasks(){

    let userEmail = this.filters.userEmail;
    let taskTypeArray = this.filters.taskTypeArray;
    let startDate = this.filters.startDate;
    let endDate = this.filters.endDate;
    let taskCategoryArray = this.filters.taskCategoryArray;
    let sortType = this.filters.sortType;

    let filteredTasks : Task[] = this.tasks;
    filteredTasks = this.userIdFilter(filteredTasks , userEmail);
    filteredTasks = this.taskTypeFilter(filteredTasks , taskTypeArray);
    filteredTasks = this.inBetweendueDateFilter(filteredTasks , startDate ,endDate);
    filteredTasks = this.taskCategoryFilter(filteredTasks,taskCategoryArray);
    filteredTasks = this.sortFilter(filteredTasks , sortType);

    this.tasksFilterApplied.emit(filteredTasks);
    return filteredTasks;
  }

  userIdFilter (tasks : Task[],userEmail : string){
    return tasks.filter((task)=>{
      if(task.userEmail == userEmail)
        return true;
      else
        return false;
    })
  }

  taskTypeFilter(tasks : Task[],taskTypeArray : string[]){
    if(taskTypeArray.length == 0)
      return tasks;
    else
      return tasks.filter((task)=>{
        let status = false;
        for (let taskTypeArrayEl of taskTypeArray){
          if(taskTypeArrayEl == 'completedTasks')
            status = status || (task.markAsDone == true)
          else if(taskTypeArrayEl == 'dueTasks' && !task.markAsDone)
            status = true
        }
        return status;
      })
  }

  inBetweendueDateFilter(tasks : Task[], startDate : string, endDate : string){
    if(startDate == '' && endDate == '')
        return tasks;
    else if(startDate == '')
      return tasks.filter((task)=>{
        return (new Date(task.dueDate) <= new Date(endDate));
      })
    else if(endDate == '')
      return tasks.filter((task)=>{
        return (new Date(startDate) <= new Date(task.dueDate));
      })
    else
    return tasks.filter((task)=>{
      return (new Date(startDate) <= new Date(task.dueDate) &&
              new Date(task.dueDate) <= new Date(endDate));
    })
  }

  taskCategoryFilter(tasks : Task[], taskCategoryArray : string[]){

    if(taskCategoryArray.length == 0)
      return tasks;
    else
      return tasks.filter((task)=>{
        let status = false;
        for (let tcatA of taskCategoryArray){
          status = status || task.categories.includes(tcatA);
        }
        return status;
      })
  }

  sortFilter(tasks : Task[],sortingType : string){

    if(sortingType == '')
      return tasks;
    else if(sortingType == 'sortByNameAsc'){
      return tasks.sort((a,b)=>{return a.title > b.title ? 1 : -1});
    }
    else if(sortingType == 'sortByNameDesc'){
      return tasks.sort((a,b)=>{return a.title > b.title ? -1 : 1});
    }
    else if(sortingType == 'sortByDateAsc'){
      return tasks.sort((a,b)=>{return new Date(a.dueDate) > new Date(b.dueDate) ? 1 : -1});
    }
    else{
      return tasks.sort((a,b)=>{return new Date(a.dueDate) > new Date(b.dueDate) ? -1 : 1});
    }
  }

  checkTaskToDelete(taskId : string){
    this.tasksToDelete.push(taskId);
  }

  uncheckTaskToDelete(taskIdToUncheck : string){
    this.tasksToDelete = this.tasksToDelete.filter((taskId)=>{
      if(taskId == taskIdToUncheck)
        return false;
      else
        return true;
    })
  }

  deleteTasks(){
    this.tasks = this.tasks.filter((task)=>{
      let status = true;
      for(let tITD of this.tasksToDelete){
        if(tITD == task.taskId)
          status = false;
      }
      return status;
    })
    this.tasksToDelete = [];
    this.getTasks();
    this.saveData();
  }

  saveData(){
    localStorage.setItem('tasks',JSON.stringify(this.tasks));
  }

  getData(){
    this.tasks = JSON.parse(localStorage.getItem('tasks'));
  }
}

