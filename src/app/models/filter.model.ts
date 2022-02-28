export class Filter {
    constructor(
        public userEmail : string,
        public taskTypeArray : string[],
        public startDate : string ,
        public endDate : string,
        public taskCategoryArray : string[],
        public sortType : string){}
}
