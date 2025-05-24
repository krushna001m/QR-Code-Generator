import React, { useState, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Copy, Download, Settings } from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AdvancedOptions from './AdvancedOptions';

const QRCodeGenerator = () => {
  const [qrValue, setQRValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [textBelow, setTextBelow] = useState('');
  const [logo, setLogo] = useState('');
  const [showLogo, setShowLogo] = useState(false);
  const [resolution, setResolution] = useState(1000);
  const qrCodeRef = useRef(null);
  const previewSize = 200; // Fixed size for preview

  const generateQRCode = () => {
    if (!inputValue.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setQRValue(inputValue);
      setIsGenerating(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      generateQRCode();
    }
  };

  const generateQRCodeImage = useCallback(() => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = resolution;
      canvas.height = resolution;
      const ctx = canvas.getContext('2d');
      
      // Draw QR Code
      const qrSize = resolution * 0.8; // 80% of the resolution
      const qrPosition = (resolution - qrSize) / 2;
      const svgString = new XMLSerializer().serializeToString(qrCodeRef.current.querySelector('svg'));
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, qrPosition, qrPosition, qrSize, qrSize);
        
        // Draw text below
        if (textBelow) {
          const fontSize = resolution * 0.05;
          ctx.font = `bold ${fontSize}px Arial`;
          ctx.fillStyle = 'black';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          const textY = qrPosition + qrSize + (resolution * 0.05); // 5% padding below QR code
          ctx.fillText(textBelow, resolution / 2, textY);
        }
        
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
    });
  }, [resolution, textBelow]);

  const copyToClipboard = async () => {
    try {
      const dataUrl = await generateQRCodeImage();
      const blob = await fetch(dataUrl).then(res => res.blob());
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      toast.success("QR Code copied to clipboard!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy QR Code");
    }
  };

  const saveAsPNG = async () => {
    try {
      const dataUrl = await generateQRCodeImage();
      const link = document.createElement('a');
      link.download = 'qr-code.png';
      link.href = dataUrl;
      link.click();
      toast.success("QR Code saved as PNG!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save QR Code");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 py-4">
        <CardTitle className="text-2xl font-bold text-white text-center">QR Code Alchemist</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter text or URL and press Enter"
          className="w-full text-lg"
        />
        <Button 
          onClick={generateQRCode} 
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
          disabled={isGenerating || !inputValue.trim()}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate QR Code'
          )}
        </Button>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="advanced-options">
            <AccordionTrigger className="py-2">
              <div className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Advanced Options
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <AdvancedOptions
                text={textBelow}
                setText={setTextBelow}
                logo={logo}
                setLogo={setLogo}
                showLogo={showLogo}
                setShowLogo={setShowLogo}
                resolution={resolution}
                setResolution={setResolution}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {qrValue && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div ref={qrCodeRef} className="p-4 bg-white rounded-lg shadow-md flex flex-col items-center" style={{ width: `${previewSize}px`, minHeight: `${previewSize}px` }}>
                <QRCodeSVG 
                  value={qrValue} 
                  size={Math.round(previewSize * 0.8)} // 80% of preview size
                  level="H"
                  imageSettings={showLogo && logo ? {
                    src: logo,
                    x: undefined,
                    y: undefined,
                    height: Math.round(previewSize * 0.16), // 20% of QR code size
                    width: Math.round(previewSize * 0.16),
                    excavate: true,
                  } : undefined}
                />
                {textBelow && (
                  <div className="text-center mt-4 text-sm font-semibold">
                    {textBelow}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <Button onClick={copyToClipboard} className="flex items-center">
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button onClick={saveAsPNG} className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;