# State Management

## Main Rule

```txt
TanStack Query = API/server state
Zustand = shared client/UI state
useState = local component state
Form library = form state
```

## TanStack Query

Use for:

- API data
- loading/error from API
- caching/refetch
- mutations
- query invalidation
- pagination response data

Example:

```ts
const { data, isLoading, error } = useSkills(params);
```

## Zustand

Use for shared UI/client state:

- search
- filters
- sort
- page/limit
- selected item id
- modal open/close
- active tab
- view mode
- section layout state

Do not store API data, loading, error, or CRUD functions in Zustand when TanStack Query exists.

## Flow

```txt
User changes filter
  -> Zustand updates filter params
  -> component re-renders
  -> TanStack Query receives new params
  -> queryKey changes
  -> API fetch/cache happens
```

## Decision Table

| Need                       | Use                    |
| -------------------------- | ---------------------- |
| API data                   | TanStack Query         |
| API loading/error          | TanStack Query         |
| API mutation               | TanStack Mutation      |
| Shared search/filter/page  | Zustand                |
| One component local toggle | useState               |
| Form values/validation     | Form library + schemas |
