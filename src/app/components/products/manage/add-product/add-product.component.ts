import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { DbOperation } from 'src/app/shared/utility/db-operation';
import { CharFieldValidator, NoWhiteSpaceValidator, NumericFieldValidator } from 'src/app/shared/validations/validations.validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit, OnDestroy {
  productId: number = 0;
  addForm: FormGroup;
  submitted: boolean = false;
  dbops: DbOperation;
  buttonText: string = "";

  objSizes: any[] = [];
  objColors: any[] = [];
  objTags: any[] = [];
  objCategories: any[] = [];

  bigImage = "assets/images/product-noimage.jpg";
  images = [
    { img: "assets/images/noimage.png" },
    { img: "assets/images/noimage.png" },
    { img: "assets/images/noimage.png" },
    { img: "assets/images/noimage.png" },
    { img: "assets/images/noimage.png" }
  ];

  fileToUpload = [];
  counter: number = 1;
  @ViewChild('file') elfile: ElementRef;

  formErrors = {
    name: '',
    title: '',
    code: '',
    price: '',
    salePrice: '',
    discount: '',
    sizeId: '',
    colorId: '',
    categoryId: '',
    tagId: ''
  };

  validationMessage = {
    name: {
      required: 'Name is required',
      minlength: 'Name cannot be less than 3 char long',
      maxlength: 'Name cannot be more than 20 char long',
      validCharField: 'Name must be contains char and space only',
      noWhiteSpaceValidator: 'Only whitespace is not allowed'
    },
    title: {
      required: 'Title is required',
      minlength: 'Title cannot be less than 3 char long',
      maxlength: 'Title cannot be more than 20 char long',
      validCharField: 'Title must be contains char and space only',
      noWhiteSpaceValidator: 'Only whitespace is not allowed'
    },
    code: {
      required: 'Name is required',
      minlength: 'Name cannot be less than 3 char long',
      maxlength: 'Name cannot be more than 10 char long',
      noWhiteSpaceValidator: 'Only whitespace is not allowed'
    },
    price: {
      required: 'Price is required',
      minlength: 'Price cannot be less than 1 char long',
      maxlength: 'Price cannot be more than 4 char long',
      validNumericField: 'Price must be contains number only',
      noWhiteSpaceValidator: 'Only whitespace is not allowed'
    },
    salePrice: {
      required: 'Sale Price is required',
      minlength: 'Sale Price cannot be less than 1 char long',
      maxlength: 'Sale Price cannot be more than 4 char long',
      validNumericField: 'Sale Price must be contains number only',
      noWhiteSpaceValidator: 'Only whitespace is not allowed'
    },
    discount: {
      required: 'Discount is required',
      minlength: 'Discount cannot be less than 1 char long',
      maxlength: 'Discount cannot be more than 4 char long',
      validNumericField: 'Discount must be contains number only',
      noWhiteSpaceValidator: 'Only whitespace is not allowed'
    },
    sizeId: {
      required: 'Size is required'
    },
    colorId: {
      required: 'Color is required'
    },
    tagId: {
      required: 'Tag is required'
    },
    categoryId: {
      required: 'Category is required'
    }
  };

  constructor(private route: ActivatedRoute, private router: Router, private _httpService: HttpService,
    private _toastr: ToastrService, private _fb: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      this.productId = params['productId'];
    });
  }

  ngOnInit(): void {
    this.setFormState();
    this.getCategories();
    this.getColors();
    this.getSizes();
    this.getTags();

    if (this.productId && this.productId != null && this.productId > 0) {
      this.buttonText = "Update";
      this.dbops = DbOperation.update;
      this.getProductById(this.productId);
    }

  }

  setFormState() {
    this.buttonText = "Add";
    this.dbops = DbOperation.create;

    this.addForm = this._fb.group({
      id: [0],
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        CharFieldValidator.validCharField,
        NoWhiteSpaceValidator.noWhiteSpaceValidator
      ])],
      title: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        CharFieldValidator.validCharField,
        NoWhiteSpaceValidator.noWhiteSpaceValidator
      ])],
      code: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        NoWhiteSpaceValidator.noWhiteSpaceValidator
      ])],
      price: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(4),
        NumericFieldValidator.validNumericField,
        NoWhiteSpaceValidator.noWhiteSpaceValidator
      ])],
      salePrice: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(4),
        NumericFieldValidator.validNumericField,
        NoWhiteSpaceValidator.noWhiteSpaceValidator
      ])],
      discount: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(4),
        NumericFieldValidator.validNumericField,
        NoWhiteSpaceValidator.noWhiteSpaceValidator
      ])],
      sizeId: ['', Validators.required],
      colorId: ['', Validators.required],
      tagId: ['', Validators.required],
      categoryId: ['', Validators.required],
      quantity: [''],
      isSale: [false],
      isNew: [false],
      shortDetails: [''],
      description: ['']
    });

    this.addForm.valueChanges.subscribe(() => {
      this.onValueChanges();
    });

    this.addForm.get('quantity').setValue(this.counter);
  }

  onValueChanges() {
    if (!this.addForm) {
      return;
    }

    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = "";

      const control = this.addForm.get(field);

      if (control && control.dirty && control.invalid) {
        const message = this.validationMessage[field];

        for (const key of Object.keys(control.errors)) {
          if (key !== 'required') {
            this.formErrors[field] += message[key] + " ";
          }
        }
      }
    }
  }

  getProductById(id: number) {
    this._httpService.get(environment.BASE_API_PATH + "ProductMaster/GetbyId/" + id).subscribe(res => {
      if (res.isSuccess) {
        this.addForm.patchValue(res.data);
        this.counter = res.data.quantity;
        this.addForm.get('isSale').setValue(res.data.isSale === 1 ? true : false);
        this.addForm.get('isNew').setValue(res.data.isNew === 1 ? true : false);

        this._httpService.get(environment.BASE_API_PATH + "ProductMaster/GetProductPicturebyId/" + id).subscribe(res => {
          if (res.isSuccess && res.data.length > 0) {
            this.images = [
              { img: res.data[0].name != null ? environment.BASE_IMAGES_PATH + res.data[0].name : "assets/images/noimage.png" },
              { img: res.data[1].name != null ? environment.BASE_IMAGES_PATH + res.data[1].name : "assets/images/noimage.png" },
              { img: res.data[2].name != null ? environment.BASE_IMAGES_PATH + res.data[2].name : "assets/images/noimage.png" },
              { img: res.data[3].name != null ? environment.BASE_IMAGES_PATH + res.data[3].name : "assets/images/noimage.png" },
              { img: res.data[4].name != null ? environment.BASE_IMAGES_PATH + res.data[4].name : "assets/images/noimage.png" }
            ];
          } else {
            this._toastr.error(res.errors[0], "Add User");
          }
        });

      } else {
        this._toastr.error(res.errors[0], "Add User");
      }
    });
  }


  getSizes() {
    this._httpService.get(environment.BASE_API_PATH + "SizeMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objSizes = res.data;
      } else {
        this._toastr.error(res.errors[0], "Add Product");
      }
    });
  }

  getTags() {
    this._httpService.get(environment.BASE_API_PATH + "TagMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objTags = res.data;
      } else {
        this._toastr.error(res.errors[0], "Add Product");
      }
    });
  }

  getColors() {
    this._httpService.get(environment.BASE_API_PATH + "ColorMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objColors = res.data;
      } else {
        this._toastr.error(res.errors[0], "Add Product");
      }
    });
  }

  getCategories() {
    this._httpService.get(environment.BASE_API_PATH + "Category/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objCategories = res.data;
      } else {
        this._toastr.error(res.errors[0], "Add Product");
      }
    });
  }

  get ctrl() {
    return this.addForm.controls;
  }

  upload(files: any, i: number) {
    if (files.length === 0) {
      return;
    }

    let type = files[0].type;
    if (type.match(/image\/*/) == null) {
      this._toastr.error("Please Upload a Valid Image !!", "Add Product");
      this.elfile.nativeElement.value = "";
      this.bigImage = "assets/images/noimage.png";
    }

    this.fileToUpload[i] = files[0];

    //read image
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.images[i].img = reader.result.toString();
      this.bigImage = reader.result.toString();
    }

  }

  increment() {
    this.counter = this.counter + 1;
    this.addForm.get('quantity').setValue(this.counter);
  }

  decrement() {
    if (this.counter > 1) {
      this.counter = this.counter - 1;
      this.addForm.get('quantity').setValue(this.counter);
    }
  }

  cancelForm() {
    this.addForm.reset({
      id: 0,
      name: '',
      title: '',
      code: '',
      price: '',
      salePrice: '',
      discount: '',
      sizeId: '',
      colorId: '',
      categoryId: '',
      tagId: '',
      quantity: '',
      isSale: false,
      isNew: false,
      shortDetails: '',
      description: ''
    });

    this.buttonText = "Add";
    this.dbops = DbOperation.create;



    this.bigImage = "assets/images/product-noimage.jpg";
    this.images = [
      { img: "assets/images/noimage.png" },
      { img: "assets/images/noimage.png" },
      { img: "assets/images/noimage.png" },
      { img: "assets/images/noimage.png" },
      { img: "assets/images/noimage.png" }
    ];

    this.fileToUpload = [];
    this.counter = 1;
    this.router.navigate(['/products/manage/product-list']);
  }

  Submit() {
    this.submitted = true;

    if (this.addForm.invalid) {
      return;
    }

    if (this.dbops === DbOperation.create && this.fileToUpload.length < 5) {
      this._toastr.error("Please Upload a 5 Image per product !!", "Add Product");
      return;
    } else if (this.dbops === DbOperation.update && (this.fileToUpload.length > 0 && this.fileToUpload.length < 5)) {
      this._toastr.error("Please Upload a 5 Image per product !!", "Add Product");
      return;
    }

    const formData = new FormData();
    formData.append("Id", this.addForm.value.id);
    formData.append("Name", this.addForm.value.name);
    formData.append("Title", this.addForm.value.title);
    formData.append("Code", this.addForm.value.code);
    formData.append("Price", this.addForm.value.price);
    formData.append("SalePrice", this.addForm.value.salePrice);
    formData.append("Discount", this.addForm.value.discount);
    formData.append("Quantity", this.addForm.value.quantity);
    formData.append("IsSale", this.addForm.value.isSale);
    formData.append("ISNew", this.addForm.value.isNew);
    formData.append("SizeId", this.addForm.value.sizeId);
    formData.append("ColorId", this.addForm.value.colorId);
    formData.append("CategoryId", this.addForm.value.categoryId);
    formData.append("TagId", this.addForm.value.tagId);
    formData.append("ShortDetails", this.addForm.value.shortDetails);
    formData.append("Description", this.addForm.value.description);

    if (this.fileToUpload) {
      for (let i = 0; i < this.fileToUpload.length; i++) {
        //formData.append("Image", this.fileToUpload[i], this.fileToUpload[i].name);
        let ToUpload = this.fileToUpload[i];
        formData.append("Image", ToUpload, ToUpload.name);
      }
    }


    switch (this.dbops) {
      case DbOperation.create:
        this._httpService.postImage(environment.BASE_API_PATH + "ProductMaster/Save/", formData).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success("Record Saved !!", "Add Product");
            this.cancelForm();
          } else {
            this._toastr.error(res.errors[0], "Add Product");
          }
        });
        break;
      case DbOperation.update:
        this._httpService.postImage(environment.BASE_API_PATH + "ProductMaster/Update/", formData).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success("Record Updated !!", "Add Product");
            this.cancelForm();
          } else {
            this._toastr.error(res.errors[0], "Add Product");
          }
        });
        break;
    }
  }

  ngOnDestroy() {
    this.objSizes = [];
    this.objColors = [];
    this.objTags = [];
    this.objCategories = [];
    this.fileToUpload = [];
  }
}
