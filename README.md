# Online Shop Multi-Page React Assignment

This project is a small online shop built with React and Vite for our Web Programming lab assignment. The goal of this work was to practice client-side routing, state management with different tools (URL, Context, Zustand, custom hooks), and asynchronous data fetching with proper cleanup.

## File Organization

I organized the source files inside the `src/` folder into separate directories based on their responsibilities:

- `src/api/`: Contains pure JavaScript modules (`productsApi.js` and `authApi.js`) for fetching product data from DummyJSON and simulating user login.
- `src/hooks/`: Contains custom hooks (`useFetch.js` and `useLocalStorage.js`) so that logic can be reused across different components.
- `src/context/`: Contains `AuthContext.jsx` which manages the logged-in user state with `useReducer` and Context API.
- `src/store/`: Contains `cartStore.js` created with Zustand to handle the shopping cart state and sync it with `localStorage`.
- `src/components/`: Contains shared UI and routing helper components (`Layout.jsx`, `ProductCard.jsx`, and `ProtectedRoute.jsx`).
- `src/pages/`: Contains the main view components (`Home.jsx`, `ProductList.jsx`, `ProductDetail.jsx`, `Cart.jsx`, `Login.jsx`, and `NotFound.jsx`).

## Reasoning Questions

**1. State choices**
The signed-in user lives in `AuthContext` because many parts of the app (like the navigation bar and protected routes) need to read it, and it does not change very often. The shopping cart lives in a Zustand store (`cartStore`) because users update item quantities frequently and we only want specific components to re-render by using selectors. Filter values live in the URL query string (`useSearchParams`) so that users can refresh the page or share the filtered link with another person without losing their filters. The product list data lives inside the `useFetch` custom hook (using `useReducer`) since it is tied to the lifecycle of the page requesting the data. Finally, the theme preference lives in `useLocalStorage` inside the `Layout` component so the light or dark mode choice stays saved when the browser is reloaded.

**2. Context versus store**
The signed-in user is stored in Context because login and logout events happen very rarely during a session. In contrast, the shopping cart changes much more often when a user adds products or changes quantities. If we swapped them and put the cart in Context, every single component consuming that Context would re-render whenever an item quantity changed, which makes the app less efficient. Zustand allows us to select only specific values (like total item count in the navbar or the `addItem` action in product detail), preventing unnecessary re-renders.

**3. Custom hooks**
The `useFetch` hook shares the logic for handling loading, error, and data states with `useReducer`, as well as the `AbortController` cleanup logic inside `useEffect`. Because of this, neither `ProductList` nor `ProductDetail` needs to repeat the reducer code or manual abort handling. However, `useFetch` deliberately does not share the actual state values between components. Each component that calls `useFetch` gets its own isolated state instance, and passes its own specific API function and dependency array.

**4. Route parameters**
When we read the `id` from `useParams()`, its data type is always a string (for example, `"5"` instead of `5`). This mattered in `ProductDetail.jsx` when creating the "Next Product" link. If I simply did `id + 1` with a string, `"1" + 1` would become `"11"` instead of `2`. Because of this, I had to convert it using `Number(id) + 1` before building the URL for the next product.

**5. Protected routes**
Client-side protection with `ProtectedRoute` is only a user-experience feature and not real security. All the JavaScript code runs in the user's browser, so anyone can open DevTools, edit the local state, or inspect the source code to see the hidden components. To make an application truly secure, the backend server must verify authentication tokens (like JWT or session cookies) on every API request before returning private data or processing actions.

**6. Deep links**
If this application were deployed on a simple static file server and a user reloaded `/products/3`, the server would look for an actual file or folder at `products/3/index.html` on the disk. Since this is a Single Page Application and only the root `index.html` exists, the static server would return a 404 error. It works on the Vite development server because Vite is configured with history API fallback, which automatically serves the main `index.html` file for any unknown path and lets React Router handle the URL in the browser.

## Notes on Self-Study Items

While working on the assignment, I had to look up several concepts in the official documentation that were not covered in detail during lectures:

- **Updating one query-string parameter without losing the others:** At first, when I called `setSearchParams({ category: 'beauty' })`, it deleted the `q` search parameter from the URL. After reading the React Router documentation on `useSearchParams`, I learned that I can create a copy of the existing parameters with `new URLSearchParams(searchParams)`, use `.set()` or `.delete()` on that object, and pass it back to `setSearchParams`.
- **Initialising Zustand state safely from localStorage:** I learned that `JSON.parse` can throw an error if the stored data in `localStorage` is corrupted or edited manually in the browser. To prevent the whole React app from crashing on load, I wrapped `localStorage.getItem` and `JSON.parse` inside a `try / catch` block in `getInitialItems()` and checked `Array.isArray()` before returning the cart array. Also, I read the Zustand documentation to learn how `useCartStore.subscribe()` works outside of React components so the cart saves automatically without needing a `useEffect`.
- **Implementing light and dark theme:** I checked how CSS class scoping works on a top-level wrapper div. In `Layout.jsx`, I used my `useLocalStorage` hook to get the current `theme` value (`"light"` or `"dark"`) and applied it as a class name (`className={`app-wrapper ${theme}`}`) on the main layout container. Then in `index.css`, I defined different background and text colors for `.app-wrapper.light` and `.app-wrapper.dark`.

## Challenges Faced

1. **AbortError showing up as a real error:** When testing `useFetch` in React StrictMode, the component mounted and unmounted twice very quickly. My `AbortController` cancelled the first request, which caused `fetch` to reject with an `AbortError`, and my page briefly showed an error state. I solved this by checking `if (err.name !== 'AbortError' && !controller.signal.aborted)` inside the `.catch()` block before dispatching `FETCH_ERROR`.
2. **Preventing unnecessary re-renders with Zustand:** Initially, I tried returning an object from my Zustand selector in the navigation bar, which caused infinite re-render warnings. After checking the Zustand docs, I changed the selector in `Layout.jsx` to calculate and return a single primitive number (`totalCount`), and in `ProductDetail.jsx` I selected only `state => state.addItem` so that page never re-renders when the cart changes.
3. **Login redirect history:** When testing `ProtectedRoute`, clicking the browser's Back button after logging in took me back to the `/login` page again. I learned that passing `replace: true` in `navigate(destination, { replace: true })` replaces the login route in the history stack so the back button works naturally.