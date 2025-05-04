# UDST Tools - Arabic Language Support Implementation

## Overview

This project implements Arabic language support using the following approach:

1. **Locale-based Routing** - URLs structured as `/en/...` and `/ar/...`
2. **RTL Support** - Dynamically setting `dir="rtl"` for Arabic UI
3. **Inline Translation Strategy** - Using `locale === 'ar' ? 'Arabic text' : 'English text'` throughout
4. **Language Switcher** - A toggle in the sidebar to switch between English and Arabic

## Implementation Details

### 1. Language Context

A React context (`LanguageContext`) manages the current locale and provides hooks:

- `useLocale()` - Get the current locale ('en' or 'ar')
- `useSetLocale()` - Set a new locale
- `useIsRTL()` - Check if current locale is RTL (returns true for Arabic)

### 2. Routing Structure

We use React Router with localized routes:

- `/en` and `/ar` for home pages
- `/en/gpa-calculator` and `/ar/gpa-calculator` for sub-pages
- Automatic redirection from `/` to `/en` or `/ar` based on user preference

### 3. RTL Support

RTL direction is implemented via:

- Setting `dir="rtl"` on the HTML document when Arabic is active
- Adding the `rtl` class to the body for CSS targeting
- CSS utilities in `index.css` to handle RTL-specific styling
- Component-level RTL accommodations (text alignment, flex direction, etc.)

### 4. Translation Strategy

All UI text is translated using conditional rendering based on the current locale:

```tsx
{
  locale === "ar" ? "نص عربي" : "English text";
}
```

This approach is used consistently throughout all components.

### 5. Components with Language Support

All core UI components have been modified to support RTL layout and Arabic text:

- **Card** - Supports RTL text alignment
- **Button** - Reverses flex direction in RTL mode
- **Input** - Sets `dir="rtl"` and text alignment
- **Select** - Adjusts dropdown indicator position
- **Checkbox** - Reverses alignment in RTL mode
- **Sidebar** - Full RTL support with Arabic navigation labels
- **Footer** - Localized text

### 6. Page Content

Pages like GPACalculator have been updated with Arabic translations for:

- Section titles
- Labels
- Helper text
- Buttons
- Error messages

## Usage Example

```tsx
import { useLocale } from "../context/LanguageContext";

function MyComponent() {
  const locale = useLocale();

  return (
    <div>
      <h1>{locale === "ar" ? "العنوان بالعربية" : "English Title"}</h1>
      <p>{locale === "ar" ? "محتوى النص بالعربية" : "English content text"}</p>
    </div>
  );
}
```

## Language Switcher

A language switcher component in the sidebar allows users to toggle between English and Arabic:

```tsx
<button onClick={handleLanguageChange}>
  {locale === "ar" ? "English" : "العربية"}
</button>
```

When clicked, it changes the locale in the context and navigates to the equivalent page in the new locale.
