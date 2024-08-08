import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  transactions = [];
  settings = {
    actions: false,
    columns : {
      transactionsId : {
        title : "Transactions Id"
      },
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
    this._httpService.get(environment.BASE_API_PATH + "PaymentMaster/GetReportTransactionDetails").subscribe(res => {
      if (res.isSuccess) {
        this.transactions = res.data;
      } else {
        this._toastr.error(res.errors[0], "Sales");
      }
    });
  }

}
