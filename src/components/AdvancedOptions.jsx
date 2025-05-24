import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

const AdvancedOptions = ({ text, setText, logo, setLogo, showLogo, setShowLogo, resolution, setResolution }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text-below">Text Below QR Code</Label>
        <Input
          id="text-below"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to display below QR code"
        />
      </div>
      <div>
        <Label htmlFor="logo-url">Logo URL</Label>
        <Input
          id="logo-url"
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          placeholder="Enter URL of logo image"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="show-logo"
          checked={showLogo}
          onCheckedChange={setShowLogo}
        />
        <Label htmlFor="show-logo">Show Logo in QR Code</Label>
      </div>
      <div>
        <Label htmlFor="resolution">QR Code Resolution</Label>
        <div className="flex items-center space-x-2">
          <Slider
            id="resolution"
            min={100}
            max={1000}
            step={10}
            value={[resolution]}
            onValueChange={(value) => setResolution(value[0])}
          />
          <span>{resolution}x{resolution}</span>
        </div>
      </div>
    </div>
  );
};

export default AdvancedOptions;