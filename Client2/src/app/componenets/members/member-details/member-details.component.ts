import { AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/interfaces/Member';
import { Message } from 'src/app/interfaces/Message';
import { User } from 'src/app/interfaces/User';
import { AccountService } from 'src/app/services/account.service';
import { MemberService } from 'src/app/services/member.service';
import { MessageService } from 'src/app/services/message.service';
import { PresenceService } from 'src/app/services/presence.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit, OnDestroy {
  member: Member;
  user: User;
  messageBool: boolean = false;
  activeTab: number = 1;

  constructor(private router: ActivatedRoute, private memberService: MemberService,
    private messageService: MessageService, public presence: PresenceService,private route:Router,
     private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    })
  }


  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  ngOnInit(): void {
    this.loadMember();
    this.setActiveTab();

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ]
  }

  ngOnDestroy(): void {
    debugger;
    this.messageService.stopHubConnection();

  }

  setActiveTab() {
    this.router.queryParams.subscribe(queryPa => {
      this.activeTab = (queryPa.activeTab ? queryPa.activeTab : 1);
      if (this.activeTab == 4) this.activateMessageView();
    })
  }
  activateMessageView() {
    this.messageBool = true;
    this.messageService.createHubConnetion(this.user, this.member.userName)

  }

  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    for (const photo of this.member.photos) {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      })
    }
    return imageUrls;
  }

  loadMember() {
    this.memberService.getMember(this.router.snapshot.paramMap.get('username')).subscribe(member => {
      this.member = member;
      this.galleryImages = this.getImages();
    })
  }
  fun(){
    console.log(1);
    
  }
  setTab(tabName: string) {
    debugger;
    if (tabName == "messages") {
      this.activateMessageView(); // starting the hun connection
    } else {
      this.messageService.stopHubConnection();
    }
  }

}
