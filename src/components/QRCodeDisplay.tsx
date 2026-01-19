import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  title?: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value, size = 128, title }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bg-white p-3 rounded-lg">
        <QRCodeSVG 
          value={value} 
          size={size}
          level="H"
          includeMargin={false}
        />
      </div>
      {title && (
        <p className="text-xs text-muted-foreground font-mono">{title}</p>
      )}
    </div>
  );
};

export default QRCodeDisplay;