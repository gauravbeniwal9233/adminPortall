import { Component, OnInit } from '@angular/core';
import { Menu } from '../../interface/menu.interface';
import { CollaspeService } from '../../services/collaspe.service';
import { MenuService } from '../../services/menu.service';
import { Global } from '../../utility/global';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  userImage: string = "assets/images/user.png";
  logoImage: string = "assets/images/logo.png";
  fullName: string = "";
  emailId: string = "";
  menuItems: Menu[] = [];

  constructor(private _menuService: MenuService) { }

  ngOnInit(): void {
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.fullName = `${userDetails.firstName} ${userDetails.lastName}`;
    this.emailId = `${userDetails.email}`;
    this.userImage = (userDetails.imagePath == "" || userDetails.imagePath == null) ? "assets/images/user.png" :
      Global.BASE_USERS_IMAGES_PATH + userDetails.imagePath;

    this.menuItems = this._menuService.MENUITEMS;
  }

  toggleNavActive(menuItem: Menu) {
    menuItem.active = !menuItem.active;
  }

}
