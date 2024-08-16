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
  abortController: AbortController | null;
  url: string;
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
  setAbortController: (controller: AbortController | null) => void;
  setUrl: (url: string) => void;
}

export const useResponse = create<IResponse>((set) => ({
  url: '',
  body: '',
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
  abortController: null,
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
  setAbortController: (abortController: AbortController | null) => set({ abortController }),
  setUrl: (url: string) => set({ url }),
}));
