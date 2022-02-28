import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { TodolistService } from 'src/app/services/todolist.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-todolist-edit',
  templateUrl: './todolist-edit.component.html',
  styleUrls: ['./todolist-edit.component.css']
})
export class TodolistEditComponent implements OnInit {

  taskId : string ='';
  task : Task;

  reminderFieldIsVisible : boolean = false;
  taskImageDisplay : string = '';


  taskForm : FormGroup ;
  taskCategory: Array<any> = [
    { name: 'Important', value: 'important' },
    { name: 'Work', value: 'work' },
    { name: 'Extracurricular', value: 'extracurricular' },
    { name: 'Sports', value: 'sports' }
  ]

  constructor(
      private formBuilder : FormBuilder,
      private taskService : TodolistService,
      private userService : UserService,
      private router : Router,
      private route : ActivatedRoute) {

    this.route.queryParams.subscribe((params)=>{
      this.taskId = params['taskId'];
    });

    this.task = taskService.getTaskByTaskId(this.taskId);

    this.taskForm = this.formBuilder.group({
      title : [this.task.title,[Validators.required]],
      dueDate : [this.task.dueDate,[Validators.required]],
      categories: this.formBuilder.array([], [Validators.required]),
      reminderDate : [this.task.reminderDate,[]],
      taskImage : ['',[]],
      taskImageSrc : [this.task.taskImageSrc,[]],
      markAsDone : [this.task.markAsDone,[]]
    });

      if(this.taskForm.controls['reminderDate'].value != null)
        this.reminderFieldIsVisible = true;
      if(this.taskForm.controls['taskImageSrc'].value != null)
        this.taskImageDisplay = this.taskForm.controls['taskImageSrc'].value;
      if(this.task.categories != null){
        for(let categoryEl of this.task.categories){
          (<FormArray>this.taskForm.get('categories')).push(new FormControl(categoryEl));
        }
      }
  }

  ngOnInit(): void {
  }

  onCancel(){
    this.router.navigate(['/todolist']);
  }

  onSubmit(){
    this.taskService.updateTask(this.taskId,this.taskForm.value);
    this.router.navigate(['/todolist']);
  }

  onAddReminder(){
    this.reminderFieldIsVisible = !this.reminderFieldIsVisible;
    this.taskForm.get('reminderDate').reset();
  }

  onCheckboxChange(e: any,arrayType : string) {
    const checkArray: FormArray = this.taskForm.get(arrayType) as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  onImageChange(e:any) {
    const reader = new FileReader();

    if(e.target.files && e.target.files.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.taskImageDisplay = reader.result as string;
        this.taskForm.patchValue({
          taskImageSrc: reader.result
        });

      };
    }
  }


}
