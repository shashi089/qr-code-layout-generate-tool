import { useEffect, useRef } from 'react';
import { QRLayoutDesigner, type DesignerOptions, type StickerLayout } from 'qrlayout-ui';
import 'qrlayout-ui/style.css';

// Re-export core/ui types and classes so developers don't have to import from multiple packages
export { StickerPrinter } from 'qrlayout-ui';
export type { StickerLayout, StickerElement } from 'qrlayout-ui';
export type { EntitySchema, EntityField, DesignerOptions } from 'qrlayout-ui';

export interface QRLabelDesignerProps extends Omit<DesignerOptions, 'element'> {
  className?: string;
  style?: React.CSSProperties;
}

export function QRLabelDesigner({ className, style, ...options }: QRLabelDesignerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const designerRef = useRef<QRLayoutDesigner | null>(null);

  // Use refs to handle changing event handlers without re-instantiating the designer
  const onSaveRef = useRef(options.onSave);
  onSaveRef.current = options.onSave;

  const initialLayoutStr = JSON.stringify(options.initialLayout);
  const entitySchemasStr = JSON.stringify(options.entitySchemas);

  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy any existing instance before mounting a new one
    if (designerRef.current) {
      designerRef.current.destroy();
      designerRef.current = null;
    }

    designerRef.current = new QRLayoutDesigner({
      element: containerRef.current,
      ...options,
      onSave: (layout) => {
        if (onSaveRef.current) {
          onSaveRef.current(layout);
        }
      }
    });

    return () => {
      if (designerRef.current) {
        designerRef.current.destroy();
        designerRef.current = null;
      }
    };
  }, [initialLayoutStr, entitySchemasStr]);

  // Keep callback refs updated on every render
  useEffect(() => {
    if (designerRef.current) {
      (designerRef.current as any).onSaveCallback = (layout: StickerLayout) => {
        if (onSaveRef.current) {
          onSaveRef.current(layout);
        }
      };
    }
  }, [options.onSave]);

  return (
    <div 
      ref={containerRef} 
      className={className} 
      style={{ width: '100%', height: '100%', ...style }} 
    />
  );
}
