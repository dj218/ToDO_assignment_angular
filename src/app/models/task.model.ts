export class Task {
    constructor(
        public taskId : string,
        public userEmail : string,
        public title : string ,
        public dueDate : string,
        public categories : string[],
        public reminderDate : string,
        public taskImage : string,
        public taskImageSrc : string,
        public markAsDone : boolean){}
}
