import { Component, Inject, EventEmitter, Input, AfterViewInit } from '@angular/core';
import { JSONFileService } from '../../services/json.file.service';

@Component({
    selector: 'auto-list',
    templateUrl: './autolist.component.html'
})
export class AutoListComponent implements AfterViewInit{
    public options: ListItem[] = [];
    public searchResults: ListItem[] = [];
    public selectedItem: ListItem = new ListItem();
    public highlightedIndex: number = 0;

    @Input()
    onSelection: EventEmitter<ListItem> = new EventEmitter<ListItem>();

    constructor() { }

    private scrollHightlightedIntoView(): void {
        var highlightedItem = this.searchResults[this.highlightedIndex];
        var highlightedEle = document.getElementById(highlightedItem.value);
        var resultsDivEle = document.getElementById("Results");
        if (highlightedEle != null) {
            var top = highlightedEle.offsetTop;
            if (resultsDivEle != null) {
                resultsDivEle.scrollTop = top;
            }
        }

    }

    ngAfterViewInit() {
        var ele = document.getElementById("ListSearch");
        if (ele != null) {
            ele.onkeyup = (ev: KeyboardEvent): any => {

                //if the up or down arrows are pressed scroll the highlighted item
                if (ev.keyCode == 40 && this.searchResults.length > 0 && this.highlightedIndex < this.searchResults.length - 1) {
                    this.searchResults[this.highlightedIndex].isHighlighted = false;
                    this.searchResults[++this.highlightedIndex].isHighlighted = true;
                    this.scrollHightlightedIntoView();
                    return false;
                }
                else if (ev.keyCode == 38 && this.searchResults.length > 0 && this.highlightedIndex > 0) {
                    this.searchResults[this.highlightedIndex].isHighlighted = false;
                    this.searchResults[--this.highlightedIndex].isHighlighted = true;
                    this.scrollHightlightedIntoView();
                    return false;
                }
                //if enter is pressed select the item
                else if (ev.keyCode == 13 && this.searchResults.length > 0) {
                    var highlighted = this.searchResults.find((item: ListItem) => {
                        return item.isHighlighted;
                    });
                    if (highlighted != undefined) {
                        this.selectItem(highlighted);
                    }
                    return false;
                }
                else {
                    //we are attempting to append to the search
                    var searchString = ele == null ? "" : (<HTMLInputElement>ele).value;

                    //deselect any selected
                    this.searchResults.forEach((item: ListItem) => {
                        item.isHighlighted = false;
                    });

                    //search the options
                    if (searchString != null && searchString.length > 0) {
                        this.searchResults = this.options.filter((value: ListItem) => {
                            return value.label.toLowerCase().startsWith(searchString.toLowerCase());
                        });

                        //if we searched again select the first item
                        if (this.searchResults.length > 0) {
                            this.highlightedIndex = 0;
                            this.searchResults[this.highlightedIndex].isHighlighted = true;
                        }
                    }
                    //if the search term is empty clear out the results
                    else if (searchString.length == 0) {
                        this.selectItem(new ListItem());
                    }
                }
            };
        }
    }

    public selectItem(result: ListItem) {
        this.selectedItem = result;
        this.highlightedIndex = 0;
        this.searchResults = [];
        this.onSelection.emit(this.selectedItem);
    }
}

export class ListItem {
    public label: string;
    public value: string;
    public isHighlighted: boolean;
}
