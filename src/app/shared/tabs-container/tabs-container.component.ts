import { Component, ContentChildren, AfterContentInit, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements AfterContentInit {
  // This decorator targets projected content:
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> = new QueryList();

  constructor() { }

  // Runs after projected content has been initialized:
  ngAfterContentInit(): void {
    //console.log(this.tabs);
    const activeTabs = this.tabs?.filter(
      tab => tab.active
    );

    if(!activeTabs || activeTabs.length === 0) {
      this.selectTab(this.tabs!.first);
    }
  }

  selectTab(tab: TabComponent) {
    // Set all tabs to false:
    this.tabs?.forEach(tab => {
      tab.active = false
    });

    tab.active = true;

    return false;// This is an alternative to preventDefault function.
  }
}
