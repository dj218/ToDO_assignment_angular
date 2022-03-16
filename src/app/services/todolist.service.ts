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
  show : boolean = false;
  todolist : Item[] = [];
  itemsToDelete : string[] = [];
  filters : Filter = new Filter(this.userService.activteUserEmail,[],'','',[],'');
  itemsFilterApplied = new EventEmitter<Item[]>();

  constructor(private userService : UserService) {
    this.GetDataOfTodolist();
  }

  GetDataOfTodolist(){
    this.todolist = JSON.parse(localStorage.getItem('todolist')) || [];
  }

  GetItems(){
    let userEmail = this.filters.userEmail;
    let itemTypeArray = this.filters.itemTypeArray;
    let startDate = this.filters.startDate;
    let endDate = this.filters.endDate;
    let itemCategoryArray = this.filters.itemCategoryArray;
    let sortType = this.filters.sortType;

    let filteredItems : Item[] = this.todolist;
    filteredItems = this.UserIdFilter(filteredItems , userEmail);
    filteredItems = this.ItemTypeFilter(filteredItems , itemTypeArray);
    filteredItems = this.InBetweendueDateFilter(filteredItems , startDate ,endDate);
    filteredItems = this.ItemCategoryFilter(filteredItems,itemCategoryArray);
    filteredItems = this.SortFilter(filteredItems , sortType);

    this.itemsFilterApplied.emit(filteredItems);
    return filteredItems;
  }

  AddItem(item){
    let newItem = new Item(
      UUID.UUID(),
      this.userService.activteUserEmail,
      item.title,
      item.dueDate,
      item.categories,
      item.reminderDate,
      item.itemImageSrc,
      item.markAsDone
    );
    this.todolist = this.todolist || [];
    this.todolist.push(newItem);
    localStorage.setItem('todolist',JSON.stringify(this.todolist));
  }

  UpdateItem(itemID , item){
    let i=this.todolist.map(function(e) {return e.itemId; }).indexOf(itemID);
    this.todolist[i].title = item.title;
    this.todolist[i].dueDate = item.dueDate;
    this.todolist[i].categories = item.categories;
    this.todolist[i].reminderDate = item.reminderDate;
    this.todolist[i].itemImageSrc = item.itemImageSrc;
    this.todolist[i].markAsDone = item.markAsDone;
    localStorage.setItem('todolist',JSON.stringify(this.todolist));
  }

  DeleteItems(){
    this.todolist = this.todolist.filter((item)=>{
      let status = true;
      if(this.itemsToDelete.includes(item.itemId))
      {
        status=false;
      }
      return status;
    })
    this.itemsToDelete = [];
    this.GetItems();
    localStorage.setItem('todolist',JSON.stringify(this.todolist));
  }

  GetItemByItemId(itemID){
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

  ItemTypeFilter(todolist : Item[],itemTypeArray : string[]){
    if(itemTypeArray.length == 0)
      return todolist;
    else
      return todolist.filter((item)=>{
        if((item.markAsDone==true && itemTypeArray.includes('completedItems')) || (item.markAsDone==false && itemTypeArray.includes('dueItems')))
        {
          return true;
        }
        return false;
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

  ItemCategoryFilter(todolist : Item[], itemCategoryArray : string[]){

    if(itemCategoryArray.length == 0)
      return todolist;
    else
      return todolist.filter((item)=>{
        let status = false;
        itemCategoryArray.forEach((category)=>{
            status= status || item.categories.includes(category);
        });
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

  CheckItemToDelete(itemId : string){
    this.itemsToDelete.push(itemId);
  }

  UncheckItemToDelete(ItemIdToUncheck : string){
    this.itemsToDelete = this.itemsToDelete.filter((itemId)=>{
      if(itemId == ItemIdToUncheck)
        return false;
      else
        return true;
    })
  }

}

