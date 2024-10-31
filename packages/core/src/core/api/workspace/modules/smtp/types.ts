export interface YasumuMail {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
}

export interface YasumuSmtpMetadata {
  port: number | `${number}`;
  emails: YasumuMail[];
}
