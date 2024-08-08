import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders = [];
  settings = {
    actions: false,
    columns : {
      orderId : {
        title : "Order Id"
      },
      orderStatus : {
        title : "Order Status", type : "html"
      },
      paymentDate : {
        title : "Payment Date"
      },
      paymentMethod : {
        title : 'Payment Method'
      },
      paymentStatus : {
        title : "Payment Status", type : "html"
      },
      shippingAmount: {
        title : "Shipping Amount"
      },
      subTotalAmount : {
        title :"SubTotal Amount"
      },
      totalAmount: {
        title: "Total Amount"
      }
    }
  };

  constructor(private _httpService: HttpService, private _toastr: ToastrService) { }

  ngOnInit(): void {
    this.getOrdersData();
  }

  getOrdersData() {
    this._httpService.get(environment.BASE_API_PATH + "PaymentMaster/GetReportManageOrder").subscribe(res => {
      if (res.isSuccess) {
        this.orders = res.data;
      } else {
        this._toastr.error(res.errors[0], "Invoice");
      }
    });
  }

}
