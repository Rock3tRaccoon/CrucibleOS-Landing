import fs from 'fs';
import path from 'path';
import { cn } from '@/lib/utils';

interface SvgAssetProps {
  name: string;
  className?: string;
  envKey?: string;
}

/**
 * A Server Component that reads an SVG file from the repo path.
 * The path can be overridden by an environment variable.
 */
export function SvgAsset({ name, className, envKey }: SvgAssetProps) {
  const defaultPath = `assets/${name}.svg`;
  const envPath = envKey ? process.env[envKey] : undefined;
  const assetPath = envPath || defaultPath;
  
  try {
    const fullPath = path.join(process.cwd(), assetPath);
    const svgContent = fs.readFileSync(fullPath, 'utf8');
    
    // Simple regex to inject className into the svg tag
    const styledSvg = svgContent.replace(
      /<svg/,
      `<svg class="${cn('w-full h-full', className)}"`
    );

    return (
      <div 
        className={cn('inline-block', className)} 
        dangerouslySetInnerHTML={{ __html: styledSvg }} 
      />
    );
  } catch (error) {
    console.error(`Failed to load SVG asset: ${assetPath}`, error);
    return null;
  }
}
