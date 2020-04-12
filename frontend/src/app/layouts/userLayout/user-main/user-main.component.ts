import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

export interface CarouselData {
  name: string;
  subject: string;
  avatar: string;
  text: string;
}

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.scss']
})

export class UserMainComponent implements OnInit {
  testimonialsOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    dots: false,
    autoHeight: true,
    autoWidth: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      }
    },
    navSpeed: 700,
    nav: true
  };
  testimonialsData: CarouselData[] = [
    {
      name: 'דור שושן',
      subject: 'פיתוח תוכנה',
      avatar: 'assets/img/testimonials/testimonials-1.jpg',
      text: 'לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית קולהע צופעט למרקוח איבן איף, ברומץ כלרשט מיחוצים. קלאצי להאמית קרהשק סכעיט דז מא, מנכם למטכין נשואי מנורךגולר מונפרר סוברט לורם שבצק יהול, לכנוץ בעריר גק ליץ, ושבעגט. לפרומי בלוף קינץ תתיח לרעח.'
    },
    {
      name: 'דור שושן',
      subject: 'פיתוח תוכנה',
      avatar: 'assets/img/testimonials/testimonials-1.jpg',
      text: 'לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית קולהע צופעט למרקוח איבן איף, ברומץ כלרשט מיחוצים. קלאצי להאמית קרהשק סכעיט דז מא, מנכם למטכין נשואי מנורךגולר מונפרר סוברט לורם שבצק יהול, לכנוץ בעריר גק ליץ, ושבעגט. לפרומי בלוף קינץ תתיח לרעח.'
    },
    {
      name: 'דור שושן',
      subject: 'פיתוח תוכנה',
      avatar: 'assets/img/testimonials/testimonials-1.jpg',
      text: 'לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית קולהע צופעט למרקוח איבן איף, ברומץ כלרשט מיחוצים. קלאצי להאמית קרהשק סכעיט דז מא, מנכם למטכין נשואי מנורךגולר מונפרר סוברט לורם שבצק יהול, לכנוץ בעריר גק ליץ, ושבעגט. לפרומי בלוף קינץ תתיח לרעח.'
    },
    {
      name: 'דור שושן',
      subject: 'פיתוח תוכנה',
      avatar: 'assets/img/testimonials/testimonials-1.jpg',
      text: 'לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית קולהע צופעט למרקוח איבן איף, ברומץ כלרשט מיחוצים. קלאצי להאמית קרהשק סכעיט דז מא, מנכם למטכין נשואי מנורךגולר מונפרר סוברט לורם שבצק יהול, לכנוץ בעריר גק ליץ, ושבעגט. לפרומי בלוף קינץ תתיח לרעח.'
    },
    {
      name: 'דור שושן',
      subject: 'פיתוח תוכנה',
      avatar: 'assets/img/testimonials/testimonials-1.jpg',
      text: 'לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית קולהע צופעט למרקוח איבן איף, ברומץ כלרשט מיחוצים. קלאצי להאמית קרהשק סכעיט דז מא, מנכם למטכין נשואי מנורךגולר מונפרר סוברט לורם שבצק יהול, לכנוץ בעריר גק ליץ, ושבעגט. לפרומי בלוף קינץ תתיח לרעח.'
    },
    {
      name: 'דור שושן',
      subject: 'פיתוח תוכנה',
      avatar: 'assets/img/testimonials/testimonials-1.jpg',
      text: 'לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית קולהע צופעט למרקוח איבן איף, ברומץ כלרשט מיחוצים. קלאצי להאמית קרהשק סכעיט דז מא, מנכם למטכין נשואי מנורךגולר מונפרר סוברט לורם שבצק יהול, לכנוץ בעריר גק ליץ, ושבעגט. לפרומי בלוף קינץ תתיח לרעח.'
    }
  ];


  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    // autoplay: true,
    navSpeed: 700,
    dots: false,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      }
    }
  };

  constructor() {
  }

  ngOnInit(): void {
  }

}

