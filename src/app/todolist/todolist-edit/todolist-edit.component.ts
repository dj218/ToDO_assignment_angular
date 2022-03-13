import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from 'src/app/models/item.model';
import { TodolistService } from 'src/app/services/todolist.service';

@Component({
  selector: 'app-todolist-edit',
  templateUrl: './todolist-edit.component.html',
  styleUrls: ['./todolist-edit.component.css']
})
export class TodolistEditComponent implements OnInit {

  itemId : string ='';
  item : Item;

  reminderFieldIsVisible : boolean = false;
  ItemImageDisplay : string = '';


  taskForm : FormGroup ;
  taskCategory: Array<any> = [
    { name: 'Important', value: 'important' },
    { name: 'Work', value: 'work' },
    { name: 'Extracurricular', value: 'extracurricular' },
    { name: 'Sports', value: 'sports' }
  ]

  constructor(
      private formBuilder : FormBuilder,
      private todolistService : TodolistService,
      private router : Router,
      private route : ActivatedRoute) {

    this.route.queryParams.subscribe((params)=>{
      this.itemId = params['itemId'];
    });

    this.item = todolistService.GetTaskByTaskId(this.itemId);

    this.taskForm = this.formBuilder.group({
      title : [this.item.title,[Validators.required]],
      dueDate : [this.item.dueDate,[Validators.required]],
      categories: this.formBuilder.array([], [Validators.required]),
      reminderDate : [this.item.reminderDate,[]],
      itemImageSrc : [this.item.itemImageSrc,[]],
      markAsDone : [this.item.markAsDone,[]]
    });

      // here as we are editing an Item so firstly we will have to load this item correctly by checking if there 
      // is a reminder , image to be displayed , which categories are selected  
      if(this.taskForm.controls['reminderDate'].value != null)
        this.reminderFieldIsVisible = true;
      if(this.taskForm.controls['itemImageSrc'].value != null)
        this.ItemImageDisplay = this.taskForm.controls['itemImageSrc'].value;
      if(this.item.categories != null){
        for(let categoryEl of this.item.categories){
          (<FormArray>this.taskForm.get('categories')).push(new FormControl(categoryEl));
        }
      }
  }

  ngOnInit(): void {
  }

  OnCancel(){
    this.router.navigate(['/todolist']);
  }

  OnSubmit(){
    this.todolistService.UpdateTask(this.itemId,this.taskForm.value);
    this.router.navigate(['/todolist']);
  }

  OnAddReminder(){
    this.reminderFieldIsVisible = !this.reminderFieldIsVisible;
    this.taskForm.get('reminderDate').reset();
  }

  OnCheckboxChange(e: any,categories : string) {
    const ArrayOfCheckedCategories= <FormArray>this.taskForm.get(categories);
    if (e.target.checked) {
      ArrayOfCheckedCategories.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      ArrayOfCheckedCategories.controls.forEach((item) => {
        if (item.value == e.target.value) {
          ArrayOfCheckedCategories.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  OnImageChange(e:any) {
    const reader = new FileReader();

    if(e.target.files && e.target.files.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.ItemImageDisplay = reader.result as string;
        this.taskForm.patchValue({
          itemImageSrc: reader.result
        });

      };
    }
  }
}
