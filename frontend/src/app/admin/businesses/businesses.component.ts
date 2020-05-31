import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Businesses, BusinessesType, BusinessesTypeTitles } from '../../models/businesses';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-businesses',
  templateUrl: './businesses.component.html',
  styleUrls: ['./businesses.component.scss']
})
export class BusinessesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'phone', 'address', 'type', 'dog_friendly'];
  dataSource: MatTableDataSource<Businesses>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  businessesTypeTitles = BusinessesTypeTitles;

  constructor(private rout: ActivatedRoute) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Businesses>(this.rout.snapshot.data.businesses);
    this.dataSource.paginator = this.paginator;
  }

}
