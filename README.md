# useApiEasy Hook

`useApiEasy` is a custom React hook designed to simplify API calls while providing built-in support for caching, request aborting, and handling initial API calls.

## Features

- ✅ **Supports API calls with arguments**
- ✅ **Built-in caching mechanism** (optional)
- ✅ **Configurable cache expiration**
- ✅ **Uses AbortController for request cancellation** (optional)
- ✅ **Handles initial API calls automatically**
- ✅ **Manages loading, error, and response states**

---

## Installation

Since this is a custom hook, you can include it in your project by copying the `useApiEasy.ts` file into your project.

```tsx
import useApiEasy from './useApiEasy';
```

---

## Usage

### Basic Example
```tsx
const fetchUserData = async (userId: string, signal?: AbortSignal) => {
  const response = await fetch(`https://api.example.com/users/${userId}`, { signal });
  return response.json();
};

const MyComponent = () => {
  const { isLoading, response, error, eventCall } = useApiEasy({
    apiPromise: fetchUserData,
    initialCall: true,
    initialArg: '123',
    useAbortController: true,
    enableCache: true,
    cacheExpiryMs: 60000, // Cache expires after 60 seconds
  });

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {response && <p>User Name: {response.name}</p>}
      <button onClick={() => eventCall('123', true)}>Refresh Data</button>
    </div>
  );
};
```

---

## API Reference

### `useApiEasy<T, Arg>`

#### **Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `apiPromise` | `(arg?: Arg, signal?: AbortSignal) => Promise<T>` | Required function that performs the API call. It optionally accepts an argument and an `AbortSignal`. |
| `initialCall` | `boolean` | If `true`, the API call is triggered immediately when the hook is mounted. Default: `false`. |
| `initialArg` | `Arg` | Initial argument to be used if `initialCall` is `true`. |
| `useAbortController` | `boolean` | Enables request cancellation via `AbortController`. Default: `false`. |
| `enableCache` | `boolean` | Enables caching of API responses. Default: `false`. |
| `cacheExpiryMs` | `number` | Cache expiration time in milliseconds. If `undefined`, cache never expires. |

#### **Returns**

| Return Value | Type | Description |
|--------------|------|-------------|
| `isLoading` | `boolean` | Indicates whether the API call is in progress. |
| `response` | `T | null` | Holds the API response data or `null` if no response is available. |
| `error` | `Error | null` | Contains any error encountered during the API call. |
| `eventCall` | `(arg?: Arg, forceFresh?: boolean) => Promise<T>` | Function to manually trigger an API call. `forceFresh` bypasses cache when set to `true`. |
| `abort` | `() => void` | Function to cancel an ongoing API request (if `useAbortController` is enabled). |

---

## Advanced Usage

### **Using `forceFresh` to Ignore Cache**
```tsx
<button onClick={() => eventCall('123', true)}>Fetch Fresh Data</button>
```

### **Handling API Abort**
```tsx
<button onClick={abort}>Cancel Request</button>
```

---

## License
MIT License.

---

## Contributing
Feel free to submit pull requests or raise issues for improvements!

