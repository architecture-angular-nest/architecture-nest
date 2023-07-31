export abstract class ICryptography {
  abstract hash(
    data: string | Buffer,
    saltOrRounds: string | number,
  ): Promise<string>;

  abstract compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}

export const CRYPTOGRAPHY = Symbol('CRYPTOGRAPHY');
