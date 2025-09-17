import { Account } from "@application/entities/Account";

export class AccountItem {
  private readonly type = 'Account';

  private readonly keys: AccountItem.keys;  
  static type: "Account";

  constructor(private readonly attrs: AccountItem.Attributes) {
    this.keys = {
      PK: AccountItem.getPK(this.attrs.id),
      SK: AccountItem.getSK(this.attrs.id),
      GSI1PK: AccountItem.getGSI1PK(this.attrs.email),
      GSI1SK: AccountItem.getGSI1SK(this.attrs.email),  
    };
  }

  toItem(): AccountItem.ItemType{
    return {
      ...this.keys,
      ...this.attrs,
      type: AccountItem.type,
    };
  }
   
  static fromEntity(account: Account){
    return new AccountItem({
      ...account,
      createdAt: account.createdAt.toISOString(),
    });
  }
  static toEntity(accountItem: AccountItem.ItemType){
    return new Account({
      id: accountItem.id,
      email: accountItem.email,
      externalId: accountItem.externalId,
      createdAt: new Date(accountItem.createdAt),
    });
  }

  static getPK(accountId: string): AccountItem.keys['PK']{
    return `ACCOUNT#${accountId}`;
  }

  static getSK(accountId: string): AccountItem.keys['SK']{
    return `ACCOUNT#${accountId}`;
  }

  static getGSI1PK(email: string): AccountItem.keys['GSI1PK']{
    return `ACCOUNT#${email}`;
  }
  
  static getGSI1SK(email: string): AccountItem.keys['GSI1SK']{
    return `ACCOUNT#${email}`;
  }
 }
 
 export namespace AccountItem {
   export type keys = {
     PK: `ACCOUNT#${string}`;
     SK: `ACCOUNT#${string}`; 
     GSI1PK: `ACCOUNT#${string}`;
     GSI1SK: `ACCOUNT#${string}`;
    };

   export type Attributes = {
     id: string;
     email: string;
     externalId: string | undefined;
     createdAt: string;
   };  

   export type ItemType = keys & Attributes & {
    type: 'Account';
   };
 }