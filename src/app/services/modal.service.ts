// Angular treats services as singletons.
// A singleton is when one instance of a class exists in an application.
// Whenever we call whatever service inside of a component there will be the same instance.

import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: IModal[] = [];

  constructor() { }

  isModalOpen(id: string): boolean {
    /* 
      *** The optional operator ? works as follows:

      If the find function does not encounter a coincidence 
      then it returns undefined. So if it is undefined then the
      property visible does not exists and it will produce an error.

      This is the reason of why we use the '?' operator. If find returns undefined
      then automatically visible will be undefined as well.

      *** The double negation operator !! works as follows:

      It will convert the type of the value to a boolean = 
      
      A true value becomes false and a false value becomes true
    */

    // The following code is equivalent = !!this.modals.find(q => q.id === id)?.visible:
    return Boolean(this.modals.find(q => q.id === id)?.visible);
  }

  toggleModal(id: string): void {
    const modal = this.modals.find(q => q.id === id);

    if(modal) {
      modal.visible = !modal.visible;
    }
  }

  registerNewModal(id: string): void {
    this.modals.push({ 
      id, 
      visible: false 
    });
  }

  unregisterModal(id: string): void {
    this.modals = this.modals.filter(q => q.id !== id);
  }
}
