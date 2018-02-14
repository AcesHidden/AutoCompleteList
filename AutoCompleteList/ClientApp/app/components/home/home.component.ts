import { Component, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { AutoListComponent, ListItem } from '../autolist/autolist.component';
import { JSONFileService } from '../../services/json.file.service';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    providers: [JSONFileService]
})
export class HomeComponent implements AfterViewInit{

    @ViewChild(AutoListComponent)
    private autoList: AutoListComponent;
    private selectedListItem: ListItem = new ListItem();


    constructor(@Inject(JSONFileService) private service: JSONFileService) {
        service.getFile<ListItem[]>("MOCK_DATA_1000.json").then(
            (value: void | ListItem[]) => {
                if (value != null) {
                    this.autoList.options = value;
                }
            }
        );
    }

    ngAfterViewInit() {
        this.autoList.onSelection.subscribe((item: ListItem) => {
            this.selectedListItem = item;
        });
    }

}
