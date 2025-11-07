declare module 'bcryptjs' {
  type Input = string | Buffer;

  export function hash(data: Input, saltOrRounds: string | number): Promise<string>;
  export function hashSync(data: Input, saltOrRounds?: string | number): string;
  export function compare(data: Input, encrypted: string): Promise<boolean>;
  export function compareSync(data: Input, encrypted: string): boolean;
  export function genSalt(rounds?: number): Promise<string>;
  export function genSaltSync(rounds?: number): string;
  export function getRounds(encrypted: string): number;

  const bcrypt: {
    hash: typeof hash;
    hashSync: typeof hashSync;
    compare: typeof compare;
    compareSync: typeof compareSync;
    genSalt: typeof genSalt;
    genSaltSync: typeof genSaltSync;
    getRounds: typeof getRounds;
  };

  export default bcrypt;
}
