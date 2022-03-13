import { Component, Input, OnInit } from '@angular/core';
import { TodolistService } from 'src/app/services/todolist.service';
import { Item } from 'src/app/models/item.model';

@Component({
  selector: 'app-todolist-item',
  templateUrl: './todolist-item.component.html',
  styleUrls: ['./todolist-item.component.css']
})
export class TodolistItemComponent implements OnInit {

 
  @Input() item : Item;
  @Input() deleteMode : boolean = false;

  subHeading : string;

  constructor(private todolistService : TodolistService) { }

  ngOnInit(): void {

    if(this.item.markAsDone)
      this.subHeading = '(Completed)'

  }

  onChangeCheckbox(e : any){
    // if checkbox is checked we have to add this item to the delete array
    if(e.target.checked)
    this.todolistService.CheckTaskToDelete(this.item.itemId);
    // else if checkbox is unchecked we have to remove this item from the delete array by filtering it
    else if(!e.target.checked)
      this.todolistService.UncheckTaskToDelete(this.item.itemId);
  }

  markAsDone(){
    this.item.markAsDone = true;
    this.subHeading = '(Completed)';
    this.todolistService.UpdateTask(this.item.itemId,this.item);
  }
}
