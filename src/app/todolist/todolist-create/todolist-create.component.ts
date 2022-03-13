import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TodolistService } from 'src/app/services/todolist.service';
import { Item } from 'src/app/models/item.model';


@Component({
  selector: 'app-todolist-create',
  templateUrl: './todolist-create.component.html',
  styleUrls: ['./todolist-create.component.css']
})
export class TodolistCreateComponent implements OnInit {

  item: Item;
  reminderFieldIsVisible: boolean = false;
  ItemImageDisplay: string = '';

  taskCreateForm: FormGroup;

  itemCategory: Array<any> = [
    { name: 'Important', value: 'important', checked: false },
    { name: 'Work', value: 'work', checked: false },
    { name: 'Extracurricular', value: 'extracurricular', checked: false },
    { name: 'Sports', value: 'sports', checked: false }
  ]

  constructor(
    private formBuilder: FormBuilder,
    private todolistService: TodolistService,
    private router: Router
  ) {

    this.taskCreateForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      //we are using FormArray because we want to dynamically generate form controls such as <input>
      categories: this.formBuilder.array([], [Validators.required]),
      reminderDate: ['', []],
      taskImageSrc: ['', []],
      markAsDone: ['', []]
    });
  }

  ngOnInit(): void {
  }

  OnCancel() {
    this.router.navigate(['/todolist']);
  }

  OnSubmit() {
    console.log(this.taskCreateForm.value);
    this.todolistService.AddTask(this.taskCreateForm.value);
    this.router.navigate(['/todolist']);
  }

  OnAddReminder() {
    this.reminderFieldIsVisible = !this.reminderFieldIsVisible;
    this.taskCreateForm.get('reminderDate').reset();
  }

  
  OnCheckboxChange(e:any,categories:string) {
    const ArrayOfCheckedCategories = <FormArray>this.taskCreateForm.get(categories);
    if(e.target.checked)
    {
      // Now to add a form control at run time we need to use push() method of FormArray
      ArrayOfCheckedCategories.push(new FormControl(e.target.value));
    }
    else{
      // To remove a form control at run time we need to use removeAt() method of FormArray.
        let i=0;
        ArrayOfCheckedCategories.controls.forEach((item) =>{
        if(item.value==e.target.value)
        {
          ArrayOfCheckedCategories.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  OnImageChange(e: any) {
    const reader = new FileReader();

    if (e.target.files && e.target.files.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.ItemImageDisplay = reader.result as string;
        this.taskCreateForm.patchValue({
          taskImageSrc: reader.result
        });

      };
    }
  }



}
