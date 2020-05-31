import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../../../models/users';
import { Businesses, BusinessesType, BusinessesTypeTitles } from '../../../../models/businesses';
import { MatDialog } from '@angular/material/dialog';
import { UserAuthService } from '../../../user-auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { BusinessInfoComponent } from '../business-info.component';

@Component({
  selector: 'app-business-view',
  templateUrl: './business-view.component.html',
  styleUrls: ['./business-view.component.scss']
})
export class BusinessViewComponent implements OnInit {
  displayedColumns: string[] = ['name', 'phone', 'address', 'type', 'dog_friendly', 'action'];
  dataSource: MatTableDataSource<Businesses>;
  private currentUser: User;
  @Input() myBusinesses: Businesses[];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  businessesTypeTitles = BusinessesTypeTitles;
  businessesType = BusinessesType;

  constructor(public dialog: MatDialog,
              private userAuthService: UserAuthService) { }

  ngOnInit(): void {
    this.userAuthService.currentUser.subscribe(res => this.currentUser = res, err => console.log(err));
    this.dataSource = new MatTableDataSource<Businesses>(this.myBusinesses);
    this.dataSource.paginator = this.paginator;
  }

  openCreateDialog(element?: Businesses): void {
    this.dialog.open(BusinessInfoComponent, {
      width: '750px',
      direction: 'rtl',
      data: element ? element : null
    }).afterClosed().subscribe(result => {
      if (result) {
        const idx = this.myBusinesses.findIndex(b => b.id === result.id);
        if (idx >= 0) {
          this.myBusinesses[idx] = result;
        } else {
          this.myBusinesses.push(result);
        }
        this.dataSource = new MatTableDataSource<Businesses>(this.myBusinesses);
        this.dataSource.paginator = this.paginator;
      }
    });
  }

}
