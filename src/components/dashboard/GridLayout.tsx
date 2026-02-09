import React, { useMemo } from "react";
import { Responsive, useContainerWidth } from "react-grid-layout";
import "react-grid-layout/css/styles.css";

const ResponsiveReactGridLayout = Responsive as any;
import "react-resizable/css/styles.css";
import { Widget } from "@/hooks/useDashboardState";

interface GridLayoutProps {
  widgets: Widget[];
  layouts: any;
  onLayoutChange: (layout: any[], allLayouts: any) => void;
  isEditing: boolean;
  children: React.ReactNode;
}

export function GridLayout({
  widgets,
  layouts,
  onLayoutChange,
  isEditing,
  children,
}: GridLayoutProps) {
  const { width, containerRef, mounted } = useContainerWidth();

  // Create a map of children by key for RGL
  const childrenMap = useMemo(() => {
    const map: Record<string, React.ReactNode> = {};
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        map[child.key as string] = child;
      }
    });
    return map;
  }, [children]);

  return (
    <div ref={containerRef} className="w-full min-h-[500px]">
      {mounted && (
        <ResponsiveReactGridLayout
          className="layout"
          width={width}
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30} // Half-height for more granular vertical adjustment
          onLayoutChange={(layout: any[], allLayouts: any) =>
            onLayoutChange(layout, allLayouts)
          }
          isDraggable={isEditing}
          isResizable={isEditing}
          resizeHandles={["s", "e", "se", "w", "n", "sw", "nw", "ne"]}
          preventCollision={false}
          compactType="vertical"
          margin={[20, 20]} // Increased gap for cleaner look
          containerPadding={[20, 20]}
          draggableHandle=".drag-handle"
        >
          {widgets.map((w) => (
            <div
              key={w.id}
              className={`h-full ${
                isEditing
                  ? "ring-2 ring-primary/20 rounded-xl transition-shadow"
                  : ""
              }`}
            >
              {childrenMap[w.id]}
            </div>
          ))}
        </ResponsiveReactGridLayout>
      )}
    </div>
  );
}
