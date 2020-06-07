import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Games } from '../../models/Games';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'start', 'end', 'owner', 'steps'];
  dataSource: MatTableDataSource<Games>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private rout: ActivatedRoute) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Games>(this.rout.snapshot.data.games);
    this.dataSource.paginator = this.paginator;
  }

}
