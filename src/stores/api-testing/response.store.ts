import { create } from 'zustand';

export interface ICookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: string;
}

export interface IHeader {
  key: string;
  value: string;
}

export interface IResponse {
  body: string;
  headers: IHeader[];
  cookies: ICookie[];
  responseTime: number;
  responseSize: number;
  responseStatus: number;
  secure: boolean;
  localAddress: string;
  remoteAddress: string;
  tlsProtocol: string;
  cipherName: string;
  certificateCN: string;
  issuerCN: string;
  validUntil: string;
  setBody: (body: string) => void;
  setHeaders: (headers: IHeader[]) => void;
  setCookies: (cookies: ICookie[]) => void;
  setResponseTime: (responseTime: number) => void;
  setResponseSize: (responseSize: number) => void;
  setResponseStatus: (responseStatus: number) => void;
  setSecure: (secure: boolean) => void;
  setLocalAddress: (localAddress: string) => void;
  setRemoteAddress: (remoteAddress: string) => void;
  setTlsProtocol: (tlsProtocol: string) => void;
  setCipherName: (cipherName: string) => void;
  setCertificateCN: (certificateCN: string) => void;
  setIssuerCN: (issuerCN: string) => void;
  setValidUntil: (validUntil: string) => void;
}

const defaultResponse = JSON.stringify({
  userId: 1,
  id: 1,
  title:
    'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
  body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
});

export const useResponse = create<IResponse>((set) => ({
  body: defaultResponse,
  headers: [],
  cookies: [],
  responseTime: 56,
  responseSize: 292,
  responseStatus: 200,
  secure: false,
  localAddress: '',
  remoteAddress: '',
  tlsProtocol: '',
  cipherName: '',
  certificateCN: '',
  issuerCN: '',
  validUntil: '',
  setBody: (body: string) => set({ body }),
  setHeaders: (headers: IHeader[]) => set({ headers }),
  setCookies: (cookies: ICookie[]) => set({ cookies }),
  setResponseTime: (responseTime: number) => set({ responseTime }),
  setResponseSize: (responseSize: number) => set({ responseSize }),
  setResponseStatus: (responseStatus: number) => set({ responseStatus }),
  setSecure: (secure: boolean) => set({ secure }),
  setLocalAddress: (localAddress: string) => set({ localAddress }),
  setRemoteAddress: (remoteAddress: string) => set({ remoteAddress }),
  setTlsProtocol: (tlsProtocol: string) => set({ tlsProtocol }),
  setCipherName: (cipherName: string) => set({ cipherName }),
  setCertificateCN: (certificateCN: string) => set({ certificateCN }),
  setIssuerCN: (issuerCN: string) => set({ issuerCN }),
  setValidUntil: (validUntil: string) => set({ validUntil }),
}));
