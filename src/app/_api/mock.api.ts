import { Injectable } from '@angular/core';
import { v5 as uuidv5 } from 'uuid';
import { environment } from 'src/environments/environment';
import { ApiInterface } from 'src/app/_api/api.interface';
import { User, UserKey } from '../_interfaces/user.interface';
import { Congregation } from '../_interfaces/congregation.interface';
import { Site } from '../_interfaces/site.interface';
import { ShiftHours } from '../_interfaces/shift-hours.interface';
import { Shift, ShiftKey } from '../_interfaces/shift.interface';
import { Gender } from '../_enums/gender.enum';
import { Permission } from '../_enums/permission.enum';
import { Day } from '../_enums/day.enum';
import { PersonalShift } from '../_interfaces/personal-shift.interface';

@Injectable({
  providedIn: 'root'
})
export class Api implements ApiInterface {

  private accounts: {uuid: string, password: string}[] = [
    {
      uuid: '73783509-ecf4-4522-924b-c782d41fb95c',
      password: 'DEV'
    }, {
      uuid: '620a6781-1ef4-4ac6-b23f-8efe20348907',
      password: 'ADMIN'
    }, {
      uuid: '9efe91be-3b71-40e7-8ea2-6e2768bb2ebd',
      password: 'MANAGER'
    }, {
      uuid: 'bdb0fd54-b203-4e87-b744-1867d7eb0932',
      password: 'USER'
    },
  ];

  private userKeys: UserKey[] = [
    {
      uuid: '73783509-ecf4-4522-924b-c782d41fb95c',
      username: 'Phillip Tsai',
      activate: true,
    }, {
      uuid: '620a6781-1ef4-4ac6-b23f-8efe20348907',
      username: 'Amanda Tsai',
      activate: true,
    }, {
      uuid: '9efe91be-3b71-40e7-8ea2-6e2768bb2ebd',
      username: 'Peter Tsai',
      activate: true,
    }, {
      uuid: 'bdb0fd54-b203-4e87-b744-1867d7eb0932',
      username: 'Rachel Tsai',
      activate: true,
    },
  ];

  private users: User[] = [
    Object.assign({
      name: 'Phillip Tsai',
      gender: Gender.MALE,
      congregation: '7e4fc670-12d9-483c-8fdc-2c0f1b6e889a',
      permission: Permission.DEVELOPER,
      baptizeDate: '2000-01-01',
      birthDate: '2000-01-01',
      cellphone: '',
      phone: '',
      address: '',
      note: '',
      tags: ['']
    }, this.userKeys[0]),
    Object.assign({
      name: 'Amanda Tsai',
      gender: Gender.FEMALE,
      congregation: '7e4fc670-12d9-483c-8fdc-2c0f1b6e889a',
      permission: Permission.ADMINISTRATOR,
      baptizeDate: '2000-01-01',
      birthDate: '2000-01-01',
      cellphone: '',
      phone: '',
      address: '',
      note: '',
      tags: ['']
    }, this.userKeys[1]),
    Object.assign({
      name: 'Peter Tsai',
      gender: Gender.MALE,
      congregation: '52a092bb-48b9-4a87-b269-c8774f844671',
      permission: Permission.MANAGER,
      baptizeDate: '2000-01-01',
      birthDate: '2000-01-01',
      cellphone: '',
      phone: '',
      address: '',
      note: '',
      tags: ['']
    }, this.userKeys[2]),
    Object.assign({
      name: 'Rachel Tsai',
      gender: Gender.FEMALE,
      congregation: '52a092bb-48b9-4a87-b269-c8774f844671',
      permission: Permission.USER,
      baptizeDate: '2000-01-01',
      birthDate: '2000-01-01',
      cellphone: '',
      phone: '',
      address: '',
      note: '',
      tags: ['']
    }, this.userKeys[2]),
  ];

  private congregations: Congregation[] = [
    {
      uuid: '7e4fc670-12d9-483c-8fdc-2c0f1b6e889a',
      name: 'Tainan East',
      order: 0,
      activate: true,
    }, {
      uuid: '52a092bb-48b9-4a87-b269-c8774f844671',
      name: 'Tainan West',
      order: 1,
      activate: true,
    },
  ];

  private sites: Site[] = [
    {
      uuid: '408941a1-3af4-4148-a822-baddd9fae407',
      name: 'Park',
      order: 0,
      activate: true,
    }, {
      uuid: '2ab1d2b4-e03b-47ba-991d-7ca801c79b0d',
      name: 'Station',
      order: 1,
      activate: true,
    },
  ];

  private shiftHoursList: ShiftHours[] = [
    {
      uuid: '39cd7d33-ba5c-4967-8502-a1a57f557842',
      name: 'Morning',
      startTime: '09:00',
      endTime: '12:00',
      activate: true,
    }, {
      uuid: 'bb406de4-d090-413b-a68b-ad790a332699',
      name: 'Afternoon',
      startTime: '12:00',
      endTime: '15:00',
      activate: true,
    },
  ];

  private shiftKeys: ShiftKey[] = [
    {
      uuid: '056f687d-2b0b-48ee-ba30-a4190a95cacb',
      date: '2019-04-27',
      day: Day.SATURDAY,
      shiftHoursUuid: '39cd7d33-ba5c-4967-8502-a1a57f557842',
      siteUuid: '408941a1-3af4-4148-a822-baddd9fae407',
      activate: true,
    }, {
      uuid: 'c1c9b287-1f8b-4364-810d-6218c535fb77',
      date: '2019-04-27',
      day: Day.SATURDAY,
      shiftHoursUuid: 'bb406de4-d090-413b-a68b-ad790a332699',
      siteUuid: '2ab1d2b4-e03b-47ba-991d-7ca801c79b0d',
      activate: true,
    },
  ];

  private shifts: Shift[] = [
    Object.assign({
      crewUuids: [
        '73783509-ecf4-4522-924b-c782d41fb95c',
        '620a6781-1ef4-4ac6-b23f-8efe20348907',
      ]
    }, this.shiftKeys[0]),
    Object.assign({
      crewUuids: [
        '73783509-ecf4-4522-924b-c782d41fb95c',
        '9efe91be-3b71-40e7-8ea2-6e2768bb2ebd',
        'bdb0fd54-b203-4e87-b744-1867d7eb0932',
      ]
    }, this.shiftKeys[0]),
  ];

  private personalShifts: PersonalShift[] = [
    {
      uuid: '4248559d-d3bb-50de-91c5-f00fa7a5e34e',
      userUuid: '73783509-ecf4-4522-924b-c782d41fb95c',
      yearMonth: '2019-04',
      shiftUuids: [
        '056f687d-2b0b-48ee-ba30-a4190a95cacb',
        'c1c9b287-1f8b-4364-810d-6218c535fb77',
      ],
    }, {
      uuid: 'dee16a5c-b524-50f7-993c-a6cfcbfc156f',
      userUuid: '620a6781-1ef4-4ac6-b23f-8efe20348907',
      yearMonth: '2019-04',
      shiftUuids: [
        '056f687d-2b0b-48ee-ba30-a4190a95cacb',
      ],
    }, {
      uuid: '9a41ff1a-d98c-53a4-b691-88c1307bed56',
      userUuid: '9efe91be-3b71-40e7-8ea2-6e2768bb2ebd',
      yearMonth: '2019-04',
      shiftUuids: [
        'c1c9b287-1f8b-4364-810d-6218c535fb77',
      ],
    }, {
      uuid: '5e00b534-a49c-5584-9114-75799020eafd',
      userUuid: 'bdb0fd54-b203-4e87-b744-1867d7eb0932',
      yearMonth: '2019-04',
      shiftUuids: [
        'c1c9b287-1f8b-4364-810d-6218c535fb77',
      ],
    },
  ];

  login = (uuid: string, password: string): Promise<void> => {
    console.log('mock api login', {uuid, password});
    const index = this.accounts.findIndex(account => account.uuid === uuid);
    if (index > -1 && this.accounts[index].password === password) {
      return Promise.resolve();
    } else {
      return Promise.reject('NOT_EXIST_OR_WRONG_PASSWORD');
    }
  };

  logout = (uuid: string): Promise<void> => {
    console.log('mock api logout', {uuid});
    return Promise.resolve();
  };

  readUserKeys = (): Promise<UserKey[]> => {
    console.log('mock api logreadUserKeysout');
    return Promise.resolve([...this.userKeys]);
  };

  readUser = (uuid: string): Promise<User> => {
    console.log('mock api readUser', {uuid});
    const index = this.users.findIndex(user => user.uuid === uuid);
    if (index > -1) {
      return Promise.resolve(Object.assign({}, this.users[index]));
    } else {
      return Promise.reject('NOT_EXIST')
    }
  };

  readCongregations = (): Promise<Congregation[]> => {
    console.log('mock api readCongregations');
    return Promise.resolve([...this.congregations]);
  };

  readSites = (): Promise<Site[]> => {
    console.log('mock api readSites');
    return Promise.resolve([...this.sites]);
  };

  readShiftHours = (): Promise<ShiftHours[]> => {
    console.log('mock api readShiftHours');
    return Promise.resolve([...this.shiftHoursList]);
  };

  readShiftKeys = (yearMonth: string): Promise<ShiftKey[]> => {
    console.log('mock api readShiftKeys', {yearMonth});
    const startDate = yearMonth + '-00';
    const endDate = yearMonth + '-32';
    const filteredShiftKeys = this.shiftKeys.filter(shiftKey => startDate.localeCompare(shiftKey.date) < 0 && endDate.localeCompare(shiftKey.date) > 0);
    return Promise.resolve([...filteredShiftKeys]);
  };

  readShift = (uuid: string): Promise<Shift> => {
    console.log('mock api readShift', {uuid});
    const index = this.shifts.findIndex(shift => shift.uuid === uuid);
    if (index > -1) {
      return Promise.resolve(Object.assign({}, this.shifts[index]));
    } else {
      return Promise.reject('NOT_EXIST')
    }
  };

  readPersonalShift = (uuid: string): Promise<PersonalShift> => {
    console.log('mock api readPersonalShift', {uuid});
    const index = this.personalShifts.findIndex(personalShift => personalShift.uuid === uuid);
    if (index > -1) {
      return Promise.resolve(Object.assign({}, this.personalShifts[index]));
    } else {
      return Promise.reject('NOT_EXIST')
    }
  };
}
