import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import {
  AngularFireAuthModule,
  PERSISTENCE,
  USE_EMULATOR
} from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  providers: [
    { provide: PERSISTENCE, useValue: 'local' },
    {
      provide: USE_EMULATOR,
      useValue: searchString('emulator')
        ? ['http://127.0.0.1:8082']
        : undefined,
    },
  ],
})
export class FirebaseModule {}

function searchString(key: string) {
  const query = new URLSearchParams(window.location.search.substring(1));
  return query.get(key);
}
