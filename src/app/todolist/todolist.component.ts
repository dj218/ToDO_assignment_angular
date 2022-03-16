import { Component, OnInit } from '@angular/core';
import { TodolistService } from '../services/todolist.service';
import { UserService } from '../services/user.service';
import { Item } from '../models/item.model';
import { Filter } from '../models/filter.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit {

  todolist : Item[] = [];
  userEmail : string = '';
  deleteMode : boolean = false;
  filters : Filter ;
  heading : string ;

  constructor(private route: ActivatedRoute,private router: Router,private todolistService : TodolistService,private userService : UserService) {
   }

  ngOnInit(): void {

    this.userEmail = this.userService.activteUserEmail;
    this.todolistService.filters = new Filter(this.userEmail,[],'','',[],'');
    this.filters = this.todolistService.filters;
    this.todolist = this.todolistService.GetItems()

    this.todolistService.itemsFilterApplied.subscribe((filteredItems)=>{
      this.todolist = filteredItems;
      this.filters = this.todolistService.filters;

      this.SetHeading();
    })
    this.SetHeading();
  }

  SetHeading(){
    if(
      this.filters.endDate == '' &&
      this.filters.sortType == '' &&
      this.filters.startDate == '' &&
      this.filters.itemCategoryArray.length ==0 &&
      this.filters.itemTypeArray.length == 0)
    this.heading = 'All Items';

    else
      this.heading = 'Filtered Items';
  }

  OnClickCreateItem(){
    //this.router.navigate(['create'], {relativeTo:this.route})
    this.router.navigate(['/todolist/create']);
  }

  SelectItemsToDeleteButtonClicked(){
    this.todolistService.itemsToDelete = [];
    this.deleteMode = true;
  }

  OnDelete(){
    if(this.todolistService.itemsToDelete.length == 0){
      alert("You haven't selected any Items to delete");
    }
    else{
      if(confirm("Are you sure , you want to delete the selected Items?")){
        this.todolistService.DeleteItems();
      }
    }
    this.OnCancel();
  }

  OnCancel(){
    this.deleteMode = false;
    this.todolistService.itemsToDelete = [];
  }
}