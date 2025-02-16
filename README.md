# useApiEasy Documentation

## Introduction

`useApiEasy` is a powerful and easy-to-use React Hook for handling API requests in React and React Native applications. It simplifies data fetching, caching, error handling, and request aborting using the Fetch API.

## Installation

```sh
npm install react-native-use-api-easy
```

or

```sh
yarn add react-native-use-api-easy
```

## Features

- ✅ Simple API Calls
- ✅ Built-in Caching
- ✅ Automatic AbortController Support
- ✅ Auto Fetch on Mount
- ✅ Manual and Forced API Calls
- ✅ Error Handling
- ✅ Loading State Management

## Usage

### 1️⃣ Basic API Call

```tsx
import { useApiEasy } from 'react-native-easy-api';

const fetchUsers = (signal) => {
  return fetch('https://dummyjson.com/users', { signal }).then((res) =>
    res.json()
  );
};

const MyComponent = () => {
  const usersApi = useApiEasy({
    apiPromise: fetchUsers,
    initialCall: true,
  });

  if (usersApi.isLoading) return <Text>Loading...</Text>;
  if (usersApi.error) return <Text>Error: {usersApi.error.message}</Text>;

  return (
    <FlatList
      data={usersApi.response}
      renderItem={({ item }) => <Text>{item.name}</Text>}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};
```

---

### 2️⃣ Manual API Call (Trigger on Event)

```tsx
const fetchUserById = (id, signal) => {
  return fetch(`https://dummyjson.com/users/${id}`, { signal }).then((res) =>
    res.json()
  );
};

const UserDetails = () => {
  const userApi = useApiEasy({
    apiPromise: fetchUserById,
    initialCall: false,
  });

  return (
    <View>
      <Button title="Fetch User" onPress={() => userApi.eventCall(1)} />
      {userApi.isLoading && <Text>Loading...</Text>}
      {userApi.response && <Text>{userApi.response.name}</Text>}
    </View>
  );
};
```

---

### 3️⃣ Enable Caching

```tsx
const productsApi = useApiEasy({
  apiPromise: fetchProductsByCategory,
  enableCache: true,
  initialCall: false,
});
```

- Data will be **stored in cache** and retrieved if available.

---

### 4️⃣ Force Refresh (Ignore Cache)

```tsx
<Button
  title="Force Refresh"
  onPress={() => productsApi.forceCall('electronics')}
/>
```

- Forces a fresh API call, bypassing the cache.

---

### 5️⃣ Abort API Call

```tsx
<Button title="Abort Request" onPress={() => productsApi.abort()} />
```

- Cancels an ongoing API request.

---

## API Reference

| Option               | Type     | Default | Description                                          |
| -------------------- | -------- | ------- | ---------------------------------------------------- |
| `apiPromise`         | Function | `null`  | The function to call the API (must return a Promise) |
| `initialCall`        | Boolean  | `false` | Whether to fetch data on mount                       |
| `useAbortController` | Boolean  | `false` | Enables request abortion support                     |
| `enableCache`        | Boolean  | `false` | Enables caching of API responses                     |

## Methods

| Method            | Description                               |
| ----------------- | ----------------------------------------- |
| `eventCall(args)` | Manually trigger API call with parameters |
| `forceCall(args)` | Force fresh API call, ignoring cache      |
| `abort()`         | Abort the current request                 |

## Conclusion

`useApiEasy` simplifies API handling in React and React Native applications by providing an intuitive API with caching, error handling, and request management. 🚀

---

**Enjoy coding with **``**!**
