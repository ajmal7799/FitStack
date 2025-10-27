export interface IHashedPasswordServices {
    hashPassword(password:string) : Promise<string>;
    comparePassword(password:string,hashedPassoword:string) : Promise<boolean>;
}