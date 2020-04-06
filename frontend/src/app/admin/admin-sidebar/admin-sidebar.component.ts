import { Component, OnInit } from '@angular/core';
import { MenuItems } from '../../shared/menu-items/menu-items';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {

  constructor(public menuItems: MenuItems) { }

  ngOnInit(): void {
  }

}
