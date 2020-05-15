import { Component, OnInit } from '@angular/core';
import { Businesses} from '../../../models/businesses';
import {UserAuthService} from '../../user-auth.service';
import {ToastrService} from 'ngx-toastr';
import {BusinessesService} from '../../services/businesses.service';

@Component({
  selector: 'app-create-business-info',
  templateUrl: './business-info.component.html',
  styleUrls: ['./business-info.component.scss']
})
export class BusinessInfoComponent implements OnInit {

  businessesInfo: Businesses[];
  currentBusiness: Businesses;
  edit: boolean;

  constructor(
    private userAuth: UserAuthService,
    private toastr: ToastrService,
    private businessesService: BusinessesService
  ) { }

  ngOnInit(): void {
    this.userAuth.currentUser.subscribe(user => {
      const hasNoBusinesses = user.businesses === undefined;
      this.businessesInfo = !hasNoBusinesses ? user.businesses : [this.initBusinessInfo()];
      this.edit = !hasNoBusinesses;
      this.currentBusiness = this.businessesInfo[0];
    });
  }

  initBusinessInfo(): Businesses {
    return {
      address: '',
      description: '',
      dog_friendly: false,
      image: '',
      name: '',
      owner_id: 0,
      phone: '',
      type: 1
    };
  }

  publishNewBusiness(): void {
    this.userAuth.currentUser.subscribe(user => this.currentBusiness.owner_id = user.id);
    this.businessesService.createNewBusiness(this.currentBusiness).subscribe(res => {
      this.toastr.success('העסק נוצר בהצלחה!');
      this.businessesInfo.push(this.currentBusiness);
      this.currentBusiness = this.initBusinessInfo();
    }, err => {
      this.toastr.error('משהו השתבש!');
      console.log(err);
    });
  }

  updateEditForm(event: any): void {
    if (event.value === -1) {
      this.currentBusiness = this.initBusinessInfo();
      this.edit = false;
    } else {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.businessesInfo.length; i += 1) {
        if (this.businessesInfo[i].id === event.value) {
          this.currentBusiness = this.businessesInfo[i];
          this.edit = true;
        }
      }
    }
  }

  editCurrentBusiness(): void {
    this.businessesService.updateBusiness(this.currentBusiness).subscribe(res => {
      this.toastr.success('העסק עודכן בהצלחה!');
    }, err => {
      this.toastr.error('משהו השתבש!');
      console.log(err);
    });
  }

}
