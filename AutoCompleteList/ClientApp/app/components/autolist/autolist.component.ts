import { Component, Inject, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { JSONFileService } from '../../services/json.file.service';

@Component({
    selector: 'auto-list',
    templateUrl: './autolist.component.html',
    providers: [JSONFileService]
})
export class AutoListComponent implements AfterViewInit{
    public list: ListItem[] = [];
    public searchResults: ListItem[] = [];
    public selectedItem: ListItem = new ListItem();

    @Input()
    onSelection: EventEmitter<ListItem> = new EventEmitter<ListItem>();

    constructor(@Inject(JSONFileService) private service: JSONFileService) {
        service.getFile<ListItem[]>("MOCK_DATA_1000.json").then(
            (value: void | ListItem[]) => {
                if (value != null) {
                    this.list = value;
                }
                //JSON.parse(value, (key: any, value: any) => {
                //    var item = new ListItem();
                //    item.label = key;
                //    item.value = value;
                //    this.list.push(item);
                //});
            }
        );   
    }

    ngAfterViewInit() {
        var ele = document.getElementById("ListSearch");
        if (ele != null) {
            ele.onkeyup = (ev: KeyboardEvent): any => {
                var searchString = ele == null ? "" : ele.innerText;
                this.searchResults = this.list.filter((value: ListItem) => {
                    return value.label.toLowerCase().startsWith(searchString.toLowerCase());
                });
            };
        }
    }

    public selectItem(result: ListItem) {
        var ele = document.getElementById("ListSearch");
        if (ele != null) {
            this.selectedItem = result;
            ele.innerHTML = this.selectedItem.label;
            this.searchResults = [];
        }
        this.onSelection.emit(this.selectedItem);
    }


    public valueChanged(value: any):void {
        console.log(value);
    }
}

export class ListItem {
    public label: string;
    public value: string;
}
