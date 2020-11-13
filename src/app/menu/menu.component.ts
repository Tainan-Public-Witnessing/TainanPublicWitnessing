import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuLink } from 'src/app/_interfaces/menu-link.interface';
import { PermissionService } from 'src/app/_services/permission.service';
import { GlobalEventService } from '../_services/global-event.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  MENU_LINKS: MenuLink[] = [
    { display: 'Home', url: '/home'},
    { display: 'Users', url: '/users'},
    { display: 'Congregations', url: '/congregations'},
    { display: 'Tags', url: '/tags'},
    { display: 'Profiles', url: '/profiles'},
  ];

  currentMenuLinks$: Observable<MenuLink[]>;

  constructor(
    private permissionService: PermissionService,
    private globalEventService: GlobalEventService
  ) { }

  ngOnInit(): void {
    this.currentMenuLinks$ = this.permissionService.profile$.pipe(
      map(profile => this.MENU_LINKS.filter(menuLink => {
        return profile.permissions.find(permission => permission.urlKey === menuLink.url).access;
      }))
    );
  }

  onMenuLinkClick = () => {
    this.globalEventService.emitGlobalEvent({
      id: 'ON_MENU_LINK_CLICK'
    });
  }

}
