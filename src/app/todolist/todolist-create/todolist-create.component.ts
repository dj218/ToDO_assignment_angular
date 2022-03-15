import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TodolistService } from 'src/app/services/todolist.service';
import { Item } from 'src/app/models/item.model';
import { validateDueDate } from 'src/app/helpers/CustomValidators';


@Component({
  selector: 'app-todolist-create',
  templateUrl: './todolist-create.component.html',
  styleUrls: ['./todolist-create.component.css']
})
export class TodolistCreateComponent implements OnInit {

  item: Item;
  reminderFieldIsVisible: boolean = false;
  ItemImageDisplay: string = '';
  itemCreateForm: FormGroup;

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

    this.itemCreateForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      categories: this.formBuilder.array([], [Validators.required]),
      reminderDate: ['', []],
      itemImageSrc: ['', []],
      markAsDone: ['', []]
    },
    {
      validator: validateDueDate('dueDate')
    });
  }

  ngOnInit(): void {
  }

  OnCancel() {
    this.router.navigate(['/todolist']);
  }

  OnSubmit() {
    console.log(this.itemCreateForm.value);
    this.todolistService.AddItem(this.itemCreateForm.value);
    this.router.navigate(['/todolist']);
  }

  OnAddReminder() {
    this.reminderFieldIsVisible = !this.reminderFieldIsVisible;
    this.itemCreateForm.get('reminderDate').reset();
  }

  
  OnCheckboxChange(e:any,categories:string) {
    const ArrayOfCheckedCategories = <FormArray>this.itemCreateForm.get(categories);
    if(e.target.checked)
    {
      ArrayOfCheckedCategories.push(new FormControl(e.target.value));
    }
    else{
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
        this.itemCreateForm.patchValue({
          itemImageSrc: reader.result
        });

      };
    }
  }



}
