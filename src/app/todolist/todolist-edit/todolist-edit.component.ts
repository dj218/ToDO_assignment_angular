import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { validateDueDate } from 'src/app/helpers/CustomValidators';
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


  itemForm : FormGroup ;
  itemCategory: Array<any> = [
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
      this.itemId = params['ItemID'];
    });

    this.item = todolistService.GetItemByItemId(this.itemId);

    this.itemForm = this.formBuilder.group({
      title : [this.item.title,[Validators.required]],
      dueDate : [this.item.dueDate,[Validators.required]],
      categories: this.formBuilder.array([], [Validators.required]),
      reminderDate : [this.item.reminderDate,[]],
      itemImageSrc : [this.item.itemImageSrc,[]],
      markAsDone : [this.item.markAsDone,[]]
    },
    {
      validator: validateDueDate('dueDate')
    });

      if(this.itemForm.controls['reminderDate'].value != null)
        this.reminderFieldIsVisible = true;
      if(this.itemForm.controls['itemImageSrc'].value != null)
        this.ItemImageDisplay = this.itemForm.controls['itemImageSrc'].value;
      if(this.item.categories != null){
        this.item.categories.forEach((category)=>{
          (<FormArray>this.itemForm.get('categories')).push(new FormControl(category));
        });
      }
  }

  ngOnInit(): void {
  }

  OnCancel(){
    this.router.navigate(['/todolist']);
  }

  OnSubmit(){
    this.todolistService.UpdateItem(this.itemId,this.itemForm.value);
    this.router.navigate(['/todolist']);
  }

  OnAddReminder(){
    this.reminderFieldIsVisible = !this.reminderFieldIsVisible;
    this.itemForm.get('reminderDate').reset();
  }

  OnCheckboxChange(e: any,categories : string) {
    const ArrayOfCheckedCategories= <FormArray>this.itemForm.get(categories);
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
        this.itemForm.patchValue({
          itemImageSrc: reader.result
        });

      };
    }
  }
}
