import { create } from 'zustand';

export const useResponse = create((set) => ({
  body: '',
  headers: [] as { key: string; value: string }[],
  cookies: [] as {
    name: string;
    value: string;
    domain: string;
    path: string;
    expires: string;
    httpOnly: boolean;
    secure: boolean;
    sameSite: string;
  }[],
  responseTime: 0,
  responseSize: 0,
  responseStatus: 0,
  secure: false,
  localAddress: '',
  remoteAddress: '',
  tlsProtocol: '',
  cipherName: '',
  certificateCN: '',
  issuerCN: '',
  validUntil: '',
  setBody: (body: string) => set({ body }),
  setHeaders: (headers: { key: string; value: string }[]) => set({ headers }),
  setCookies: (
    cookies: {
      name: string;
      value: string;
      domain: string;
      path: string;
      expires: string;
      httpOnly: boolean;
      secure: boolean;
      sameSite: string;
    }[]
  ) => set({ cookies }),
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
