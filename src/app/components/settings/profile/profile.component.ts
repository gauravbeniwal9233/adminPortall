import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { Global } from 'src/app/shared/utility/global';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userImage: string = "assets/images/user.png";
  fullName: string = "";
  emailId: string = "";
  firstName: string = "";
  lastName: string = "";
  userDetails: any;

  addedImagePath: string = "assets/images/noimage.png";
  fileToUpload: any;

  @ViewChild('file') elfile: ElementRef;

  constructor(private _httpService: HttpService, private _toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.userImage = (this.userDetails.imagePath == "" || this.userDetails.imagePath == null) ? "assets/images/user.png" :
      Global.BASE_USERS_IMAGES_PATH + this.userDetails.imagePath;

    this.firstName = this.userDetails.firstName;
    this.lastName = this.userDetails.lastName;
    this.emailId = this.userDetails.email;
    this.fullName = `${this.userDetails.firstName} ${this.userDetails.lastName}`;
  }
  upload(files: any) {
    if (files.length === 0) {
      return;
    }

    let type = files[0].type;
    if (type.match(/image\/*/) == null) {
      this._toastr.error("Please Upload a Valid Image !!", "Brand Logo Master");
      this.elfile.nativeElement.value = "";
      this.addedImagePath = "assets/images/noimage.png";
    }

    this.fileToUpload = files[0];

    //read image
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.addedImagePath = reader.result.toString();
    }

  }

  changePic() {
    if (!this.fileToUpload) {
      this._toastr.error("Please uplaod image !!", "Profile Image");
      return;
    }

    const formData = new FormData();
    formData.append("Id", this.userDetails.id);
    formData.append("Image", this.fileToUpload, this.fileToUpload.name);

    this._httpService.postImage(environment.BASE_API_PATH + "UserMaster/UpdateProfile/", formData).subscribe(res => {
      if (res.isSuccess) {
        this._toastr.success("Profile Image has been changed !!", "Profile Master");
        this.elfile.nativeElement.value = "";
        this.addedImagePath = "assets/images/noimage.png";
        this.fileToUpload = null;

        //

        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
          },
          buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
          title: 'Are you sure?',
          text: "Are you  want to see this changes rightnow ?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, rightnow!',
          cancelButtonText: 'No, keep it!',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/auth/login']);
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
          
          }
        })

        //


      } else {
        this._toastr.error(res.errors[0], "BrandLogo Master");
      }
    });

  }
  tabChange(event: any) {
    this.elfile.nativeElement.value = "";
    this.addedImagePath = "assets/images/noimage.png";
    this.fileToUpload = null;
  }

}
