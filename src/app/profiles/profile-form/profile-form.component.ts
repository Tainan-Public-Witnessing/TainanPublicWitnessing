import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionKey } from 'src/app/_enums/permission-key.enum';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {

  uuid: string;
  mode: string;
  profileForm: FormGroup;
  permissionKeys = Object.values(PermissionKey);

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const group = {};
      for (const key of this.permissionKeys) {
        group[key] = new FormControl(true);
      }
      this.profileForm = new FormGroup(group);
      this.profileForm.valueChanges.subscribe(data => {
        console.log(data);
      });
    });

    console.log(this.permissionKeys);
  }

}
