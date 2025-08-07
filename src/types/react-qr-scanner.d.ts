declare module 'react-qr-scanner' {
  import { Component } from 'react';

  interface QrScannerProps {
    delay?: number;
    style?: object;
    className?: string;
    onError?: (error: any) => void;
    onScan?: (data: any) => void;
    constraints?: {
      audio?: boolean;
      video?: {
        facingMode?: string;
        width?: number;
        height?: number;
      };
    };
  }

  export default class QrScanner extends Component<QrScannerProps> {}
}