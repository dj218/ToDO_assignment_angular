import { Component, Input, OnInit } from '@angular/core';
import { TodolistService } from 'src/app/services/todolist.service';
import { Item } from 'src/app/models/item.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todolist-item',
  templateUrl: './todolist-item.component.html',
  styleUrls: ['./todolist-item.component.css']
})
export class TodolistItemComponent implements OnInit {

 
  @Input() item : Item;
  @Input() deleteMode: boolean =false;

  subHeading : string;

  constructor(private router:Router, private todolistService : TodolistService) { }

  ngOnInit(): void {
    if(this.item.markAsDone)
      this.subHeading = '(Completed)'
  }

  OnChangeCheckbox(e : any){
    if(e.target.checked)
    this.todolistService.CheckItemToDelete(this.item.itemId);
    else if(!e.target.checked)
      this.todolistService.UncheckItemToDelete(this.item.itemId);
  }

  MarkAsDone(){
    this.item.markAsDone = true;
    this.subHeading = '(Completed)';
    this.todolistService.UpdateItem(this.item.itemId,this.item);
  }

  EditItem()
  {
    this.router.navigate(['/todolist/edit'],{queryParams:{ItemID : this.item.itemId}});
  }
}
