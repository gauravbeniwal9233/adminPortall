import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  invoice = [];
  settings = {
    actions: false,
    columns : {
      invoiceNo : {
        title : "Invoice No"
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
  orderStatusChart: any;

  constructor(private _httpService: HttpService, private _toastr: ToastrService) { }


  ngOnInit(): void {
    this.GetOrderStatusChart();
    this.getInvoiceData();
  }

  getInvoiceData() {
    this._httpService.get(environment.BASE_API_PATH + "PaymentMaster/GetReportInvoiceList").subscribe(res => {
      if (res.isSuccess) {
        this.invoice = res.data;
      } else {
        this._toastr.error(res.errors[0], "Invoice");
      }
    });
  }

  GetOrderStatusChart() {
    let objOrderStatusData = [];
    let arr = ["Date"];

    this._httpService.get(environment.BASE_API_PATH + "PaymentMaster/GetChartOrderStatus").subscribe(res => {
      if (res.isSuccess) {

        // counts : 5 date: "02-08-2022" orderStatus: "Processing"
        let allData = res.data;
        let allDates = allData.map(item => item.date).filter((value, index, self) => self.indexOf(value) === index);
        let allOrderStatus = allData.map(item => item.orderStatus).filter((value, index, self) => self.indexOf(value) === index);

        for (let status of allOrderStatus) {
          arr.push(status);
        }
        objOrderStatusData.push(arr);

        var setZero: any = 0;
        for (let date of allDates) {
          arr = [];
          arr.push(date);

          for (let status of allOrderStatus) {
            arr.push(setZero);
          }


          for (let i in allOrderStatus) {
            for (let index in allData) {
              if (allOrderStatus[i] === allData[index].orderStatus && date === allData[index].date) {
                arr[parseInt(i) + 1] = allData[index].counts;
              }
            }
          }

          objOrderStatusData.push(arr);
        }


        //google-chart - LineChart
        this.orderStatusChart = {
          chartType: 'LineChart',
          dataTable: objOrderStatusData,
          options: {
            legend: { position: 'none' },
            bars: "vertical",
            vAxis: {
              format: "decimal"
            },
            height: 340,
            width: '100%',
            colors: ["#ff7f83", "#a5a5a5"],
            backgroundColor: 'transparent'
          },
        };



      } else {
        this._toastr.error(res.errors[0], "Dashboard");
      }
    });


    // //google-chart - LineChart
    // this.orderStatusChart = {
    //   chartType: 'LineChart',
    //   dataTable: [
    //     ["Year", "Sales", "Expenses"],
    //     ["100", 2.5, 3.8],
    //     ["200", 3, 1.8],
    //     ["300", 3, 4.3],
    //     ["400", 0.9, 2.3],
    //     ["500", 1.3, 3.6],
    //     ["600", 1.8, 2.8],
    //     ["700", 3.8, 2.8],
    //     ["800", 1.5, 2.8]
    //   ],
    //   options: {
    //     legend: { position: 'none' },
    //     bars: "vertical",
    //     vAxis: {
    //       format: "decimal"
    //     },
    //     height: 340,
    //     width: '100%',
    //     colors: ["#ff7f83", "#a5a5a5"],
    //     backgroundColor: 'transparent'
    //   },
    // };
  }

}
