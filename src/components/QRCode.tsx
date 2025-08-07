'use client';

import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';

interface QRCodeProps {
  userId: string;
  studentName: string;
}

export default function QRCode({ userId, studentName }: QRCodeProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = () => {
    if (qrRef.current) {
      const canvas = document.createElement('canvas');
      const svg = qrRef.current.querySelector('svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const img = new Image();
        img.onload = () => {
          canvas.width = 400;
          canvas.height = 400;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 400, 400);
            ctx.drawImage(img, 0, 0, 400, 400);
            
                         // Add student name at the bottom
             ctx.fillStyle = 'black';
             ctx.font = '16px Arial';
             ctx.textAlign = 'center';
             ctx.fillText(studentName, 200, 380);
             
             // Add website text below student name
             ctx.fillStyle = '#666666';
             ctx.font = '12px Arial';
             ctx.fillText('Scan at sbkdance.in', 200, 395);
            
            const link = document.createElement('a');
            link.download = `${studentName}_QR_Code.png`;
            link.href = canvas.toDataURL();
            link.click();
          }
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      {/* <h3 className="text-lg font-semibold mb-4 text-black">Your Attendance QR Code</h3> */}
      <div className="flex justify-center mb-4">
        <div ref={qrRef} className="p-4 bg-white rounded-lg shadow-inner">
          <QRCodeSVG
            value={userId}
            size={200}
            level="H"
            includeMargin={true}
            className="mx-auto"
          />
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-2">Student: {studentName}</p>
      <p className="text-xs text-gray-500 mb-4">You may show this QR code to mark your attendance</p>
      
      <button
        onClick={downloadQRCode}
        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
      >
        <Download className="w-4 h-4 mr-2" />
        Download QR Code
      </button>

      {/* SBK Barcode */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-center">
          <img 
            src="/sbk-barcode.gif" 
            alt="SBK Barcode" 
            className="max-w-full h-16 object-contain"
          />
        </div>
      </div>
    </div>
  );
}