export class Filter {
    constructor(
        public userEmail : string,
        public itemTypeArray : string[],
        public startDate : string ,
        public endDate : string,
        public itemCategoryArray : string[],
        public sortType : string){}
}
