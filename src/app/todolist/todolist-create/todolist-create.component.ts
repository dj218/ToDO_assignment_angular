import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TodolistService } from 'src/app/services/todolist.service';
import { Task } from 'src/app/models/task.model';


@Component({
  selector: 'app-todolist-create',
  templateUrl: './todolist-create.component.html',
  styleUrls: ['./todolist-create.component.css']
})
export class TodolistCreateComponent implements OnInit {

  reminderFieldIsVisible : boolean = false;
  taskImageDisplay : string = '';
  task : Task;

  taskCreateForm : FormGroup ;

  taskCategory: Array<any> = [
    { name: 'Important', value: 'important' },
    { name: 'Work', value: 'work' },
    { name: 'Extracurricular', value: 'extracurricular' },
    { name: 'Sports', value: 'sports' }
  ]

  constructor(
      private formBuilder : FormBuilder,
      private taskService : TodolistService,
      private router : Router
      ) {

    this.taskCreateForm = this.formBuilder.group({
      title : ['',[Validators.required]],
      dueDate : ['',[Validators.required]],
      categories: this.formBuilder.array([], [Validators.required]),
      reminderDate : ['',[]],
      taskImage : ['',[]],
      taskImageSrc : ['',[]],
      markAsDone : ['',[]]
    });
  }

  ngOnInit(): void {
  }

  onCancel(){
    this.router.navigate(['/todolist']);
  }

  onSubmit(){
    this.taskService.addTask(this.taskCreateForm.value);
    this.router.navigate(['/todolist']);
  }

  onAddReminder(){
    this.reminderFieldIsVisible = !this.reminderFieldIsVisible;
    this.taskCreateForm.get('reminderDate').reset();
  }

  onCheckboxChange(e: any,arrayType : string) {
    const checkArray: FormArray = this.taskCreateForm.get(arrayType) as FormArray;
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
        this.taskCreateForm.patchValue({
          taskImageSrc: reader.result
        });

      };
    }
  }


}
