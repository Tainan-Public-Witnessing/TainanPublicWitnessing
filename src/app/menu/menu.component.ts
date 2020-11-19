import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MenuLink } from 'src/app/_interfaces/menu-link.interface';
import { LoginDialogComponent } from 'src/app/_elements/dialogs/login-dialog/login-dialog.component';
import { PermissionKey } from 'src/app/_enums/permission-key.enum';
import { AuthorityService } from 'src/app/_services/authority.service';
import { GlobalEventService } from 'src/app/_services/global-event.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  MENU_LINKS: MenuLink[] = [
    { display: 'Home', url: '/home', permissionKey: PermissionKey.HOME_READ },
    { display: 'Users', url: '/users', permissionKey: PermissionKey.USERS_READ},
    { display: 'Congregations', url: '/congregations', permissionKey: PermissionKey.CONGREGATIONS_READ},
    { display: 'Tags', url: '/tags', permissionKey: PermissionKey.TAGS_READ},
    { display: 'Profiles', url: '/profiles', permissionKey: PermissionKey.PROFILES_READ},
  ];

  currentMenuLinks$: Observable<MenuLink[]>;

  constructor(
    private authorityService: AuthorityService,
    private globalEventService: GlobalEventService,
    private matDiolog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.currentMenuLinks$ = this.authorityService.currentProfile$.pipe(
      map(profile => this.MENU_LINKS.filter(menuLink => {
        return profile.permissions.find(permission => permission.key === menuLink.permissionKey).access;
      }))
    );
  }

  onMenuLinkClick = () => {
    this.globalEventService.emitGlobalEvent({
      id: 'ON_MENU_LINK_CLICK'
    });
  }

  onLoginClick = () => {
    this.globalEventService.emitGlobalEvent({
      id: 'ON_MENU_LINK_CLICK'
    });

    this.matDiolog.open(LoginDialogComponent, {
      disableClose: true,
      panelClass: 'dialog-panel',
    });
  }

  onLogoutClick = () => {
    this.globalEventService.emitGlobalEvent({
      id: 'ON_MENU_LINK_CLICK'
    });
  }
}
