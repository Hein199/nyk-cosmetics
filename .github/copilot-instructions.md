# Next.js 16 Project Instructions

## Critical Rules for Next.js 16

1. **Async Request APIs - ALWAYS USE AWAIT:**
   - ALWAYS use `await` for: params, searchParams, cookies(), headers(), draftMode()
   - ALL page components must be `async function`
   
   Example:
```typescript
   export default async function Page({ params, searchParams }) {
     const { id } = await params;
     const search = await searchParams;
     const cookieStore = await cookies();
   }
```

2. **Use App Router (not Pages Router)**
   - File structure: `app/` directory
   - Server Components by default
   - Use `"use client"` directive for client components

3. **Turbopack is default bundler**
   - Don't suggest Webpack configurations
   - Use Turbopack-compatible patterns

4. **For this project:**
   - TypeScript strict mode
   - Tailwind CSS for styling
   - React Hook Form for forms
   - Zustand for state management