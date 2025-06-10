// src/types/sib-api-v3-sdk.d.ts
declare module 'sib-api-v3-sdk' {
  
    export class ApiClient {
      static instance: any;
      static authentications: any;
    }
  
    export class TransactionalEmailsApi {
      sendTransacEmail(email: any): Promise<void>;
    }
  
    export class SendSmtpEmail {
      subject: string;
      htmlContent: string;
      sender: { email: string; name: string };
      to: Array<{ email: string }>;
    }
  
    export namespace SibApiV3Sdk {
      export class SendSmtpEmail {}
      export class TransactionalEmailsApi {}
      export class ApiClient {}
    }
  }
  