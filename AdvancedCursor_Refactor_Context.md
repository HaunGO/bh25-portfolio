# AdvancedCursor Component Refactoring Context Document

## 🎯 Project Overview
**Project**: BH25 Portfolio  
**Location**: `/Users/user/Documents/Projects/BH25/bh25-portfolio`  
**Current File**: `src/components/ui/AdvancedCursor.tsx` (754 lines)  
**Goal**: Refactor into modular, maintainable component architecture

## 📊 Current State Analysis

### **Problems with Current Implementation:**
- **Monolithic**: 754-line single component with mixed responsibilities
- **Dual Logic**: Desktop mouse + Mobile touch functionality intertwined
- **Hard to Maintain**: Complex conditional logic, difficult debugging
- **Poor Testability**: Everything bundled together
- **Performance Issues**: Unnecessary re-renders, complex state management

### **Current Functionality:**
✅ **Desktop Mouse Support**
- Custom cursor with ring and dot
- Multi-layer trail system (10 layers with varying opacity/stroke width)
- Hover effects (currently disabled)
- Click ripple effects
- Scroll-based opacity changes

✅ **Mobile Touch Support**  
- Touch trail system (3 layers)
- Fade-out animation on touch end
- Passive event listeners (doesn't block scrolling/clicking)

✅ **Device Detection**
- `useMouseSupport()` hook - detects hover + fine pointer capability
- `useTouchSupport()` hook - detects touch capability
- Conditional rendering based on device capabilities

## 🏗️ Proposed Component Architecture

### **1. TrailRenderer Component**
**Purpose**: Pure SVG trail rendering  
**Location**: `src/components/ui/cursor/TrailRenderer.tsx`  
**Size**: ~50-80 lines  
**Props**:
```typescript
interface TrailRendererProps {
  layers: TrailLayer[];
  viewportSize: { width: number; height: number };
  className?: string;
}
```

**Responsibilities**:
- Render SVG paths for trail layers
- Handle reverse rendering order (shortest trails on top)
- Pure component - no state, no side effects

### **2. MouseTrailManager Component**
**Purpose**: Desktop mouse event handling + trail generation  
**Location**: `src/components/ui/cursor/MouseTrailManager.tsx`  
**Size**: ~100-150 lines  
**Props**:
```typescript
interface MouseTrailManagerProps {
  config: MouseTrailConfig;
  onTrailUpdate: (layers: TrailLayer[]) => void;
  onCursorUpdate: (position: { x: number; y: number }) => void;
  disabled?: boolean;
}
```

**Responsibilities**:
- Mouse event listeners (mousemove, mousedown, mouseup, etc.)
- Trail point generation and management
- Cursor position tracking
- Click ripple effects
- Scroll-based opacity changes

### **3. TouchTrailManager Component**
**Purpose**: Mobile touch event handling + trail generation  
**Location**: `src/components/ui/cursor/TouchTrailManager.tsx`  
**Size**: ~80-120 lines  
**Props**:
```typescript
interface TouchTrailManagerProps {
  config: TouchTrailConfig;
  onTrailUpdate: (layers: TrailLayer[]) => void;
  disabled?: boolean;
}
```

**Responsibilities**:
- Touch event listeners (touchstart, touchmove, touchend)
- Mobile trail point generation
- Fade-out animation management
- Passive event handling (doesn't block native behavior)

### **4. CursorVisual Component**
**Purpose**: Cursor ring and dot rendering  
**Location**: `src/components/ui/cursor/CursorVisual.tsx`  
**Size**: ~60-100 lines  
**Props**:
```typescript
interface CursorVisualProps {
  position: { x: number; y: number };
  state: CursorState;
  config: CursorVisualConfig;
  viewportSize: { width: number; height: number };
}
```

**Responsibilities**:
- Render cursor ring and dot as SVG paths
- Handle cursor state animations (hover, click)
- GSAP animations for cursor visual changes

### **5. AdvancedCursor (Main Component)**
**Purpose**: Orchestration and device detection  
**Location**: `src/components/ui/AdvancedCursor.tsx`  
**Size**: ~80-120 lines  
**Props**:
```typescript
interface AdvancedCursorProps {
  disabled?: boolean;
  config?: Partial<CursorConfig>;
}
```

**Responsibilities**:
- Device capability detection
- Component orchestration
- Configuration management
- Conditional rendering logic

### **6. Configuration & Types**
**Purpose**: Centralized configuration and type definitions  
**Location**: `src/components/ui/cursor/types.ts` and `src/components/ui/cursor/config.ts`

**Types**:
```typescript
interface TrailLayer {
  percentage: number;
  color: string;
  strokeWidth: number;
}

interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  isClicking: boolean;
  isVisible: boolean;
}

interface CursorConfig {
  disabled: boolean;
  mouse: MouseTrailConfig;
  touch: TouchTrailConfig;
  visual: CursorVisualConfig;
}
```

## 🔧 Technical Implementation Details

### **Key Dependencies:**
- **React**: `useRef`, `useState`, `useEffect`, `useCallback`, `memo`
- **GSAP**: Animation library for cursor movements and effects
- **SVG**: All cursor elements are SVG paths for better performance

### **Critical Implementation Notes:**

#### **1. SVG Coordinate System:**
```typescript
// Current implementation uses direct 1:1 mapping
const screenToSVG = useCallback((screenX: number, screenY: number) => {
  return { x: screenX, y: screenY };
}, []);
```

#### **2. Trail Layer Rendering Order:**
```typescript
// CRITICAL: Render in reverse order so shortest (thickest) trails appear on top
const reverseIndex = trailLayers.length - 1 - index;
```

#### **3. Mobile Event Handling:**
```typescript
// CRITICAL: Use passive listeners to not block native browser behavior
document.addEventListener('touchstart', handleTouchStart, { passive: true });
document.addEventListener('touchmove', handleTouchMove, { passive: true });
document.addEventListener('touchend', handleTouchEnd, { passive: true });
```

#### **4. GSAP Path Animations:**
```typescript
// Cursor positioning
gsap.to(cursorRef.current, {
  attr: { d: cursorPath },
  duration: 0,
  ease: 'power2.out'
});

// Ring positioning  
gsap.to(ringRef.current, {
  attr: { transform: `translate(${e.clientX - 80}, ${e.clientY})` },
  duration: 0,
  ease: 'power2.out'
});
```

### **Current Configuration:**
```typescript
const CURSOR_CONFIG = {
  disabled: true, // Currently disabled
  trailLength: 50,
  trailLayers: [
    { percentage: 0.1, color: 'rgba(59, 130, 246, 1)', strokeWidth: 10 },
    { percentage: 0.2, color: 'rgba(59, 130, 246, 0.9)', strokeWidth: 9 },
    // ... 8 more layers
  ]
};

const MOBILE_TRAIL_CONFIG = {
  trailLength: 30,
  trailLayers: [
    { percentage: 0.5, color: 'rgba(59, 130, 246, 0.8)', strokeWidth: 6 },
    { percentage: 0.8, color: 'rgba(59, 130, 246, 0.5)', strokeWidth: 4 },
    { percentage: 1.0, color: 'rgba(59, 130, 246, 0.2)', strokeWidth: 2 }
  ],
  fadeDuration: 2.0
};
```

## 📁 File Structure After Refactoring

```
src/components/ui/cursor/
├── index.ts                    # Export all components
├── types.ts                    # TypeScript interfaces
├── config.ts                   # Configuration constants
├── hooks/
│   ├── useMouseSupport.ts      # Mouse capability detection
│   └── useTouchSupport.ts      # Touch capability detection
├── components/
│   ├── TrailRenderer.tsx       # Pure trail rendering
│   ├── MouseTrailManager.tsx   # Desktop mouse logic
│   ├── TouchTrailManager.tsx   # Mobile touch logic
│   ├── CursorVisual.tsx        # Cursor ring/dot rendering
│   └── AdvancedCursor.tsx      # Main orchestration component
└── utils/
    ├── pathHelpers.ts          # SVG path generation utilities
    └── coordinateUtils.ts      # Coordinate conversion utilities
```

## 🎯 Implementation Priority

### **Phase 1: Core Infrastructure (2-3 hours)**
1. Create `types.ts` and `config.ts`
2. Extract utility functions (`pathHelpers.ts`, `coordinateUtils.ts`)
3. Extract hooks (`useMouseSupport.ts`, `useTouchSupport.ts`)

### **Phase 2: Trail System (3-4 hours)**
1. Create `TrailRenderer.tsx` (pure component)
2. Create `MouseTrailManager.tsx`
3. Create `TouchTrailManager.tsx`
4. Test trail functionality

### **Phase 3: Cursor Visual (2-3 hours)**
1. Create `CursorVisual.tsx`
2. Extract cursor positioning logic
3. Test cursor animations

### **Phase 4: Integration (2-3 hours)**
1. Create new `AdvancedCursor.tsx`
2. Integrate all components
3. Test complete functionality
4. Performance optimization

## ⚠️ Critical Considerations

### **Performance:**
- Use `memo()` for pure components
- Minimize re-renders with proper dependency arrays
- Keep GSAP animations efficient

### **Mobile Compatibility:**
- **CRITICAL**: Never use `e.preventDefault()` on touch events
- Always use `passive: true` for touch listeners
- Test on actual mobile devices

### **SVG Rendering:**
- Maintain reverse rendering order for trail layers
- Use proper SVG path generation
- Handle viewport resizing correctly

### **State Management:**
- Minimize state updates
- Use callbacks for parent-child communication
- Avoid prop drilling

## 🧪 Testing Strategy

### **Desktop Testing:**
- Mouse movement trails
- Click ripple effects
- Hover state changes
- Scroll opacity changes
- Window resize handling

### **Mobile Testing:**
- Touch trail generation
- Fade-out animations
- Native scrolling/clicking still works
- Performance on touch devices

### **Edge Cases:**
- Device capability changes
- Rapid mouse movements
- Multiple touch points
- Viewport orientation changes

## 📋 Success Criteria

✅ **Maintainability**: Each component has single responsibility  
✅ **Performance**: No regression in animation smoothness  
✅ **Mobile**: Touch trails work without blocking native behavior  
✅ **Desktop**: All mouse functionality preserved  
✅ **Configurability**: Easy to adjust trail settings  
✅ **Testability**: Components can be tested in isolation  

## 🚀 Next Steps for Fresh Agent

1. **Read Current Implementation**: Study `src/components/ui/AdvancedCursor.tsx` thoroughly
2. **Create Directory Structure**: Set up `src/components/ui/cursor/` folder
3. **Start with Phase 1**: Extract types, config, and utilities
4. **Test Incrementally**: Ensure each phase works before proceeding
5. **Maintain Functionality**: Don't break existing behavior during refactoring

## 📞 Context Notes

- **User Preferences**: Simple, minimal responses (DEV Agent style)
- **Font Preferences**: Bitter for headings, Inter for body text
- **Component Naming**: Use "AdvancedCursor" not "PhysicsCursor"
- **Current Status**: Component is disabled (`disabled: true`) but fully functional
- **Recent Issues**: Mobile touch blocking was fixed by removing `e.preventDefault()`

---

**Total Estimated Effort**: 8-12 hours  
**Risk Level**: Low (well-defined interfaces)  
**Benefit**: High (significant maintainability improvement)
