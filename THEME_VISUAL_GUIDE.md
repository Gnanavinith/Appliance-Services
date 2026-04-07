# 🎨 Booking Module Theme - Visual Guide

## Quick Reference for Colors & Gradients

---

## 🌈 Color Palette

### Primary Emerald Theme
```
Emerald 50:   #ecfdf5  ← Light backgrounds
Emerald 100:  #d1fae5
Emerald 200:  #a7f3d0
Emerald 300:  #6ee7b7
Emerald 400:  #34d399
Emerald 500:  #10b981  ← Primary brand
Emerald 600:  #059669  ← Dark primary
Emerald 700:  #047857  ← Hover states
Emerald 800:  #065f46
Emerald 900:  #064e3b
```

### Supporting Colors
```
Teal 500:     #14b8a6  ← Secondary accent
Cyan 600:     #0891b2  ← Tertiary accent
Blue 600:     #2563eb  ← Info sections
Purple 600:   #9333ea  ← Creative sections
Orange 600:   #ea580c  ← Warning/alert
Pink 600:     #db2777  ← Accent highlight
```

---

## 🎨 Gradient Recipes

### 1. Hero Banner Gradient (Most Common)
```jsx
bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600
```
**Used in:** Page headers, success banners, main CTAs

**CSS Equivalent:**
```css
background: linear-gradient(to right, #059669, #14b8a6, #0891b2);
```

---

### 2. Card Background Gradient
```jsx
bg-gradient-to-br from-white via-emerald-50 to-teal-50
```
**Used in:** Content cards, form containers

**CSS Equivalent:**
```css
background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 50%, #ccfbf1 100%);
```

---

### 3. Icon Badge Gradient
```jsx
bg-gradient-to-br from-emerald-500 to-teal-500
```
**Used in:** Circular icon badges, step indicators

**CSS Equivalent:**
```css
background: linear-gradient(135deg, #10b981, #14b8a6);
```

---

### 4. Button Gradient
```jsx
from-emerald-600 to-emerald-500
```
**Used in:** Primary buttons, CTAs

**CSS Equivalent:**
```css
background: linear-gradient(135deg, #059669, #10b981);
```

---

### 5. Section-Specific Gradients

#### Service Details
```jsx
from-emerald-600 via-teal-600 to-cyan-600
```

#### Appointment Info
```jsx
from-blue-600 via-cyan-600 to-teal-600
```

#### Location Details
```jsx
from-orange-600 via-amber-500 to-yellow-500
```

#### Contact Information
```jsx
from-purple-600 via-pink-600 to-rose-600
```

#### Verification Section
```jsx
from-indigo-600 via-purple-600 to-pink-600
```

---

## 📐 Spacing & Sizing

### Card Border Radius
```
Large Cards:    20px (rounded-3xl)
Buttons:        12px (rounded-xl)
Inputs:         8px (rounded-lg)
Icons:          9999px (rounded-full)
```

### Shadow Depths
```
Base:      shadow-lg     (0 10px 15px rgba(0,0,0,0.1))
Enhanced:  shadow-xl     (0 20px 25px rgba(0,0,0,0.15))
Maximum:   shadow-2xl    (0 25px 50px rgba(0,0,0,0.25))
```

### Padding Standards
```
Card Header:  p-5 (20px)
Card Body:    p-6 (24px)
Section:      p-8 (32px)
Page:         py-8 (32px vertical)
```

---

## ✨ Special Effects

### 1. Blur Background Orbs
```jsx
<div className="absolute inset-0 opacity-10">
  <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
</div>
```
**Effect:** Creates subtle glowing orbs behind gradient backgrounds

---

### 2. Glassmorphism Overlay
```jsx
className="bg-white/80 backdrop-blur-lg"
```
**Effect:** Frosted glass effect for overlays

---

### 3. Hover Lift Animation
```css
.ant-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(16, 185, 129, 0.3);
}

.ant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.15);
}
```
**Effect:** Cards and buttons lift on hover

---

### 4. Focus Glow
```css
.ant-input:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}
```
**Effect:** Input fields glow emerald on focus

---

## 🎯 Component Styling Templates

### Hero Banner Component
```jsx
<div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 mb-8 shadow-2xl">
  {/* Decorative Orbs */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
  </div>
  
  {/* Content */}
  <div className="relative z-10 text-center">
    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Title</h1>
    <p className="text-lg text-white/90">Subtitle</p>
  </div>
</div>
```

---

### Icon Badge Component
```jsx
<div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
  <span className="text-3xl">👤</span>
</div>
```

---

### Card with Gradient Header
```jsx
<Card 
  className="mb-6 shadow-xl border-0"
  style={{ 
    borderRadius: '20px', 
    background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)' 
  }}
>
  {/* Gradient Header Bar */}
  <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-5 -mx-6 mt-[-24px] mb-4">
    <div className="flex items-center gap-3 text-white">
      <CheckCircleOutlined className="text-3xl" />
      <h3 className="text-xl font-bold">Section Title</h3>
    </div>
  </div>
  
  {/* Card Body */}
  <div className="p-6">
    {/* Content here */}
  </div>
</Card>
```

---

### Steps Component (Themed)
```jsx
<Steps 
  current={currentStep} 
  className="mb-8 
    [&_.ant-steps-item-tail]:bg-emerald-200 
    [&_.ant-steps-item-icon]:border-emerald-600 
    [&_.ant-steps-item-icon]:text-emerald-600 
    [&_.ant-steps-item-title]:text-emerald-900 
    [&_.ant-steps-item-description]:text-slate-600"
  size="default"
>
  {steps.map((step, index) => (
    <Step key={index} {...step} />
  ))}
</Steps>
```

---

## 🖱️ Interactive States

### Button States
```css
/* Default State */
.ant-btn-primary {
  background: linear-gradient(135deg, #059669, #10b981);
  box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);
}

/* Hover State */
.ant-btn-primary:hover {
  background: linear-gradient(135deg, #047857, #059669);
  box-shadow: 0 6px 8px rgba(16, 185, 129, 0.3);
  transform: translateY(-2px);
}

/* Active State */
.ant-btn-primary:active {
  background: #047857;
  transform: translateY(0);
}

/* Disabled State */
.ant-btn-primary:disabled {
  background: #d1fae5;
  opacity: 0.5;
}
```

---

### Input States
```css
/* Default */
.ant-input {
  border: 1px solid #d1d5db;
  transition: all 0.3s ease;
}

/* Focus */
.ant-input:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

/* Error */
.ant-input-status-error {
  border-color: #ef4444;
}

.ant-input-status-error:focus {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}
```

---

## 📱 Responsive Breakpoints

### Mobile First Approach
```jsx
// Mobile (default)
className="text-center p-4"

// Tablet (768px+)
className="md:text-left md:p-6"

// Desktop (1024px+)
className="lg:p-8"

// Large Desktop (1280px+)
className="xl:max-w-7xl"
```

---

## 🎨 Quick Copy-Paste Classes

### Backgrounds
```jsx
bg-emerald-50           // Light mint background
bg-gradient-to-br from-emerald-50 via-white to-teal-50  // Page bg
bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600  // Header bg
```

### Text Colors
```jsx
text-emerald-900        // Dark text on light
text-emerald-700        // Medium text
text-emerald-600        // Accent text
text-white              // White on dark
text-white/90           // Slightly transparent white
```

### Shadows
```jsx
shadow-lg               // Standard shadow
shadow-xl               // Enhanced shadow
shadow-2xl              // Maximum shadow
shadow-sm               // Subtle shadow
```

### Borders
```jsx
border-emerald-200      // Light border
border-emerald-600      // Dark border
border-2                // 2px border
border-0                // No border
```

---

## ✅ Quality Checklist

Before deploying theme changes, verify:

### Visual Consistency
- [ ] All gradients use correct colors
- [ ] Shadows are consistent depth
- [ ] Border radius matches standard
- [ ] Spacing follows guidelines

### Accessibility
- [ ] Text has sufficient contrast
- [ ] Focus states are visible
- [ ] Interactive elements are clear
- [ ] Colors are not the only indicator

### Performance
- [ ] Gradients are CSS (not images)
- [ ] Animations are GPU-accelerated
- [ ] No unnecessary transitions
- [ ] Lazy loading where appropriate

### Cross-Browser
- [ ] Chrome renders correctly
- [ ] Firefox renders correctly
- [ ] Safari renders correctly
- [ ] Edge renders correctly

---

## 🚀 Pro Tips

### 1. Layering Gradients
```css
/* Multiple gradients for depth */
background: 
  linear-gradient(135deg, rgba(5,150,105,0.9), rgba(20,184,166,0.9)),
  url('pattern.png');
```

### 2. Smooth Transitions
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### 3. Performance Optimization
```css
/* Use transform instead of position */
transform: translateX(-50%);
/* Better than: left: -50%; */
```

### 4. Dark Mode Ready
```css
@media (prefers-color-scheme: dark) {
  .dark-class {
    background: linear-gradient(135deg, #064e3b, #065f46);
  }
}
```

---

**Visual Guide Complete! Use this as your reference for maintaining the emerald theme! 🎨✨**
