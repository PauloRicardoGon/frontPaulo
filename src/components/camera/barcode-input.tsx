'use client';

import type { HTMLAttributes } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BarcodeInputProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export const BarcodeInput = ({ value, onChange, ...props }: BarcodeInputProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  const stopScanner = useCallback(() => {
    readerRef.current?.reset();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsScanning(false);
  }, []);

  const handleBarcode = useCallback(
    async (code: string) => {
      onChange(code);
      stopScanner();
    },
    [onChange, stopScanner],
  );

  useEffect(() => () => stopScanner(), [stopScanner]);

  const startScanner = async () => {
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      try {
        const detector = new (window as typeof window & { BarcodeDetector: new () => BarcodeDetector }).BarcodeDetector({
          formats: ['code_128', 'ean_13', 'qr_code'],
        });
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setIsScanning(true);
        const scan = async () => {
          if (!videoRef.current) return;
          const barcodes = await detector.detect(videoRef.current);
          if (barcodes.length > 0) {
            handleBarcode(barcodes[0].rawValue);
          } else if (isScanning) {
            requestAnimationFrame(scan);
          }
        };
        requestAnimationFrame(scan);
        return;
      } catch (error) {
        console.warn('BarcodeDetector falhou, usando fallback.', error);
      }
    }

    const codeReader = new BrowserMultiFormatReader();
    readerRef.current = codeReader;
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    streamRef.current = stream;
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
    setIsScanning(true);
    codeReader.decodeFromVideoDevice(null, videoRef.current!, (result, err) => {
      if (result) {
        handleBarcode(result.getText());
      }
      if (err) {
        // ignore decode errors
      }
    });
  };

  return (
    <div className="space-y-2" {...props}>
      <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Número de série" />
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={startScanner} disabled={isScanning}>
          {isScanning ? 'Escaneando...' : 'Ler código de barras'}
        </Button>
        {isScanning ? (
          <Button type="button" variant="ghost" onClick={stopScanner}>
            Parar
          </Button>
        ) : null}
      </div>
      {isScanning ? (
        <video ref={videoRef} className="aspect-video w-full rounded-lg border border-neutral-200 bg-black" />
      ) : null}
    </div>
  );
};
