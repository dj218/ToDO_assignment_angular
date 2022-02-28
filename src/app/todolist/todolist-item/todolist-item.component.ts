import { Component, Input, OnInit } from '@angular/core';
import { TodolistService } from 'src/app/services/todolist.service';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-todolist-item',
  templateUrl: './todolist-item.component.html',
  styleUrls: ['./todolist-item.component.css']
})
export class TodolistItemComponent implements OnInit {

 
  @Input() task : Task;
  @Input() deleteMode : boolean = false;

  subHeading : string;

  constructor(private taskService : TodolistService) { }

  ngOnInit(): void {

    if(this.task.markAsDone)
      this.subHeading = '(Completed)'

  }

  onChangeCheckbox(e : any){
    if(e.target.checked)
      this.taskService.checkTaskToDelete(this.task.taskId);
    else if(!e.target.checked)
      this.taskService.uncheckTaskToDelete(this.task.taskId);
  }

  markAsDone(){
    this.task.markAsDone = true;
    this.subHeading = '(Completed)';

    this.taskService.updateTask(this.task.taskId,this.task);
  }
}
