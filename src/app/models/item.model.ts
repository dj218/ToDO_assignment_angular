export class Item {
    constructor(
        public itemId : string,
        public userEmail : string,
        public title : string ,
        public dueDate : string,
        public categories : string[],
        public reminderDate : string,
        public itemImageSrc : string,
        public markAsDone : boolean){}
}
