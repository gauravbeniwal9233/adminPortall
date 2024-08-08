import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { DbOperation } from 'src/app/shared/utility/db-operation';
import { MustMatchValidator } from 'src/app/shared/validations/validations.validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  userId: number = 0;
  addForm: FormGroup;
  submitted: boolean = false;
  objUserTypes: any[] = [];
  dbops: DbOperation;
  buttonText: string = "";

  constructor(private route: ActivatedRoute, private _fb: FormBuilder, private _toastr: ToastrService,
    private _httpService: HttpService, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
    });
  }

  ngOnInit(): void {
    this.setRegisterForm();
    this.getUserTypes();

    if (this.userId && this.userId != null && this.userId > 0) {
      this.buttonText = "Update";
      this.dbops = DbOperation.update;
      this.getUserById(this.userId);
    }

  }

  setRegisterForm() {
    this.buttonText = "Add";
    this.dbops = DbOperation.create;

    this.addForm = new FormGroup({
      id: new FormControl(0),
      firstName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])),
      lastName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])),
      userTypeId: new FormControl('', Validators.required),
      password: new FormControl('', Validators.compose([Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}")])),
      confirmPassword: new FormControl('', Validators.required)
    },
      MustMatchValidator('password', 'confirmPassword'));
  }

  get ctrl() {
    return this.addForm.controls;
  }

  getUserById(id: number) {
    this._httpService.get(environment.BASE_API_PATH + "UserMaster/GetbyId/" + id).subscribe(res => {
      if (res.isSuccess) {
        this.addForm.patchValue(res.data);
      } else {
        this._toastr.error(res.errors[0], "Add User");
      }
    });
  }


  getUserTypes() {
    this._httpService.get(environment.BASE_API_PATH + "UserType/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objUserTypes = res.data;
      } else {
        this._toastr.error(res.errors[0], "Add User");
      }
    });
  }


  register() {
    this.submitted = true;

    if (this.addForm.invalid) {
      return;
    }

    switch (this.dbops) {
      case DbOperation.create:
        this._httpService.post(environment.BASE_API_PATH + "UserMaster/Save/", this.addForm.value).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success("User has been added successfully !!", "Add User");
            this.formReset();
            this.router.navigate(['/users/list-user']);
          } else {
            this._toastr.error(res.errors[0], "Add User")
          }
        });
        break;
      case DbOperation.update:
        this._httpService.post(environment.BASE_API_PATH + "UserMaster/Update/", this.addForm.value).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success("User data has been updated successfully done !!", "Add User");
            this.formReset();
            this.router.navigate(['/users/list-user']);
          } else {
            this._toastr.error(res.errors[0], "Add User")
          }
        });
        break;
    }
  }

  formReset() {
    this.addForm.reset();
    this.submitted = false;
    this.buttonText = "Add";
    this.dbops = DbOperation.create;
  }

  cancel() {
    this.formReset();
    this.router.navigate(['/users/list-user']);
  }

}
