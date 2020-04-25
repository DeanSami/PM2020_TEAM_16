import { AfterViewInit, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ConfigService } from '../../admin/shared/services/config.service';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../../admin/services/auth.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../loading.service';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-content-admin',
  templateUrl: './content-admin.component.html',
  styleUrls: ['./content-admin.component.scss']
})
export class ContentAdminComponent implements OnInit, AfterViewInit {
  public config: any = {};
  loading = false;
  close = true;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  direction: 'rtl';
  @ViewChild('content-wrapper') wrapper: ElementRef;

  constructor(private configService: ConfigService,
              @Inject(DOCUMENT) private document: Document,
              private renderer: Renderer2,
              private router: Router,
              private userService: AuthService,
              private loadingService: LoadingService
  ) {
    loadingService.loading.subscribe(loading => this.loading = loading);
  }

  ngOnInit(): void {
    this.loadingService.loading.next(true);
    this.userService.login().then(() => {
      this.router.navigate(['/admin/dashboard']).then(() => {
        setTimeout(() => this.close = true, 400);
      });
    }, () => {
      this.loadingService.loading.next(false);
    });
    this.config = this.configService.templateConf;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.config.layout.dir) {
        this.direction = this.config.layout.dir;
      }

      if (this.config.layout.variant === 'Dark') {
        this.renderer.addClass(this.document.body, 'layout-dark');
      }
      else if (this.config.layout.variant === 'Transparent') {
        this.renderer.addClass(this.document.body, 'layout-dark');
        this.renderer.addClass(this.document.body, 'layout-transparent');
        if (this.config.layout.sidebar.backgroundColor) {
          this.renderer.addClass(this.document.body, this.config.layout.sidebar.backgroundColor);
        }
        else {
          this.renderer.addClass(this.document.body, 'bg-glass-1');
        }
      }
    }, 0);
  }

}
