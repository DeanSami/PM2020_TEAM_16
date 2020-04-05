import { Component, OnInit } from '@angular/core';
import { MenuItems } from '../../shared/menu-items/menu-items';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(
    public menuItems: MenuItems
  ) { }

  ngOnInit(): void {
  }

}
