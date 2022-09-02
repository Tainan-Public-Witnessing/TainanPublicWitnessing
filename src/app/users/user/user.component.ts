import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  UntypedFormBuilder,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { Gender } from "src/app/_enums/gender.enum";
import { Mode } from "src/app/_enums/mode.enum";
import { Congregation } from "src/app/_interfaces/congregation.interface";
import { CongregationsService } from "src/app/_services/congregations.service";
import { TagsService } from "src/app/_services/tags.service";
import { UsersService } from "src/app/_services/users.service";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"],
})
export class UserComponent implements OnInit, OnDestroy {
  mode: string;
  uuid: string;
  title: string;
  cancelButtonText: string;
  userForm: FormGroup;
  genders = Object.values(Gender);
  congregations$ = new BehaviorSubject<Congregation[] | undefined | null>(null);
  // profilePrimarykeys$ = new BehaviorSubject<Profile[]>(null);
  // tags$ = new BehaviorSubject<Tag[]>(null);
  unsubscribe$ = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private congregationsService: CongregationsService,
    // private tagService: TagsService,
    public usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.congregationsService
      .getCongregationList()
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((congs) => !!congs)
      )
      .subscribe(this.congregations$);
    // this.profilesService.getProfilePrimarykeys().pipe(takeUntil(this.unsubscribe$)).subscribe(this.profilePrimarykeys$);

    this.userForm = this.formBuilder.group({
      username: ["", Validators.required],
      name: ["", Validators.required],
      gender: ["", Validators.required],
      congregationUuid: ["", Validators.required],
      // profile: ["", Validators.required],
      baptizeDate: ["", Validators.required],
      birthDate: [""],
      cellphone: [""],
      phone: [""],
      address: [""],
      note: [""],
      email: [""],
      // tags: [""],
    });

    this.activatedRoute.params.subscribe((params) => {
      this.mode = params.mode;
      this.uuid = params.uuid;

      switch (params.mode) {
        case Mode.CREATE:
          this.title = "USERS.CREATE_TITLE";
          this.cancelButtonText = "GLOBAL.CANCEL";
          break;

        case Mode.UPDATE:
          this.title = "USERS.EDIT_TITLE";
          this.cancelButtonText = "GLOBAL.CANCEL";
          this.setFormGroupValueByUuid(params.uuid);
          break;

        case Mode.READ:
          this.title = "USERS.READ_TITLE";
          this.cancelButtonText = "GLOBAL.BACK";
          this.setFormGroupValueByUuid(params.uuid);
          this.userForm.disable();
          break;
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  onCancelClick = () => {
    this.router.navigate(["users"]);
  };

  // onSubmitClick = () => {
  //   if (this.userForm.status === 'VALID') {

  //     const baptizeDateValue = this.userForm.value.baptizeDate;
  //     const birthDateValue = this.userForm.value.birthDate;
  //     const baptizeDate = typeof(baptizeDateValue) === 'string' ? baptizeDateValue : baptizeDateValue.format('YYYY-MM-DD');
  //     const birthDate = typeof(birthDateValue) === 'string' ? birthDateValue : birthDateValue.format('YYYY-MM-DD');

  //     const user: User = {
  //       uuid: null,
  //       username: this.userForm.value.username.trim(),
  //       name: this.userForm.value.name.trim(),
  //       gender: this.userForm.value.gender,
  //       congregation: this.userForm.value.congregation,
  //       profile: this.userForm.value.profile,
  //       baptizeDate,
  //       birthDate,
  //       cellphone: this.userForm.value.cellphone.trim(),
  //       phone: this.userForm.value.phone.trim(),
  //       address: this.userForm.value.address.trim(),
  //       note: this.userForm.value.note.trim(),
  //       tags: this.userForm.value.tags,
  //     };

  //     let response: Promise<Status>;

  //     if (this.mode === Mode.CREATE) {
  //       response = this.usersService.createUser(user);
  //     } else { // update mode
  //       user.uuid = this.uuid;
  //       if (this.userForm.dirty) {
  //         response = this.usersService.updateUser(user);
  //       } else {
  //         response = Promise.resolve(Status.NO_CHANGES);
  //       }
  //     }

  //     response.then(() => {
  //       this.router.navigate(['users']);
  //     }).catch(reason => {
  //       console.log('reason', reason);
  //       if (reason === Status.EXISTED) {
  //         this.userForm.controls.username.setErrors({existed: true});
  //       }
  //     });
  //   } else {
  //     this.userForm.markAllAsTouched();
  //   }

  // }

  private setFormGroupValueByUuid = (uuid: string): void => {
    this.usersService
      .getUserByUuid(uuid)
      .pipe(
        filter((user) => !!user),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((user) => {
        const values = { ...user };
        this.userForm.patchValue(values);
      });
  };
}
