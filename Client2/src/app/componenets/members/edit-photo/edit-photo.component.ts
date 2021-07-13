import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/interfaces/Member';
import { Photo } from 'src/app/interfaces/Photo';
import { User } from 'src/app/interfaces/User';
import { AccountService } from 'src/app/services/account.service';
import { MemberService } from 'src/app/services/member.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-photo',
  templateUrl: './edit-photo.component.html',
  styleUrls: ['./edit-photo.component.scss']
})
export class EditPhotoComponent implements OnInit {
  @Input() member:Member;
  uploader: FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  user: User;

  constructor(private accountService: AccountService, private memberService: MemberService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
    
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  setMainPhoto(photo:Photo){
    this.memberService.setMainPhoto(photo.id).subscribe(()=>{
      this.user.photoUrl = photo.url;
      this.accountService.setCurrentUserSource(this.user);

      let oldMainPhoto = this.member.photos?.find(photo => photo.isMain);
      oldMainPhoto.isMain = false;
      let mainPhotoIndex = this.member.photos.indexOf(photo);
      this.member.photos[mainPhotoIndex].isMain = true;

      this.member.photoUrl = photo.url;

    })

  }

  deletePhoto(photo:Photo){
    this.memberService.deletePhoto(photo.id).subscribe(()=>{
      this.member.photos = this.member.photos.filter(p =>{
        return p != photo
      })
    })
  }

  fileOverBase(e: any) {
    console.log(e);
    
    this.hasBaseDropzoneOver = e;
  }

  // setMainPhoto(photo: Photo) {
  //   this.memberService.setMainPhoto(photo.id).subscribe(() => {
  //     this.user.photoUrl = photo.url;
  //     this.accountService.setCurrentUser(this.user);
  //     this.member.photoUrl = photo.url;
  //     this.member.photos.forEach(p => {
  //       if (p.isMain) p.isMain = false;
  //       if (p.id === photo.id) p.isMain = true;
  //     })
  //   })
  // } 

  // deletePhoto(photoId: number) {
  //   this.memberService.deletePhoto(photoId).subscribe(() => {
  //     this.member.photos = this.member.photos.filter(x => x.id !== photoId);
  //   })
  // }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo:Photo = JSON.parse(response);
        if(photo.isMain){
          this.user.photoUrl = photo.url;
          this.member.photoUrl = photo.url;
          this.accountService.setCurrentUserSource(this.user);
        }
        this.member.photos.push(photo);
      }
    }
  }

}
