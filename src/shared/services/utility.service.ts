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

  public returnsRandom6DigitNumberCode(): string {
    return (Math.random() * 1000000).toFixed(0).toString().padStart(6, '0');
  }

  public compareDateDifferenceInMinutes(
    initialDate: Date = new Date(),
    finalDate: Date = new Date(),
  ): number {
    const date1: number = Date.parse(
      this.returnStringDateWithBrazilianTimeZone(initialDate).toString(),
    );
    const date2: number = Date.parse(
      this.returnStringDateWithBrazilianTimeZone(finalDate).toString(),
    );
    const differenceInMilliseconds: number = Math.abs(date2 - date1);
    const differenceInMinutes: number = Math.round(
      differenceInMilliseconds / 60000,
    );

    return differenceInMinutes;
  }

  public returnStringDateWithBrazilianTimeZone(
    datePassed: Date = new Date(),
  ): Date {
    const options: object = {
      timeZone: 'America/Sao_Paulo',
      hour12: false,
    };
    const timestamp: string = datePassed.toLocaleString('pt-BR', options);
    const dateData: string[] = timestamp
      .split('/')
      .join()
      .split(',')
      .join()
      .split(' ')
      .join()
      .split(':')
      .join()
      .split(',,')
      .join()
      .split(',');

    return new Date(
      +dateData[2],
      +dateData[1] - 1,
      +dateData[0],
      +dateData[3],
      +dateData[4],
      +dateData[5],
      0,
    );
  }
}
