import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilityService {
  public changeObjectNullValuesToUndefined(object: object): object {
    for (const key in object) {
      if (object[key] === null) {
        object[key] = undefined;
      }
    }

    return object;
  }
}
