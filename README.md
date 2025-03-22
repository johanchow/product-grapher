This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Difficulty
1. How to share data between multiple page
```js
// plan1: when page navigate to other page and back, store will be initialized again, state is missing
function Page() {
  const store = createStore()
}
// plan2: every separate request will use one global store
const store = createStore();
function Page() {
  store
}
```
**Solution**
use React Context to maintain a store for each separate request 
```js
const StoreContext = createContext(null);
const Provider = () => {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createStore();
  }
  return <StoreContext.Provider value=>
    {children}
  </StoreContext.Provider>
}
```

