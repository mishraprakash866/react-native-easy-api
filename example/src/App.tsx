import { multiply, useApiEasy } from 'react-native-easy-api';
import {
  Text,
  View,
  StyleSheet,
  Button,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useState, useEffect } from 'react';

// ✅ API for fetching categories (No caching)
const fetchCategories = (signal?: AbortSignal) => {
  console.log('---Category API Call---');
  return fetch('https://dummyjson.com/products/categories', { signal }).then(
    (res) => res.json()
  );
};

// ✅ API with caching (Fetch products of selected category)
const fetchProductsByCategory = async (
  category: string,
  signal?: AbortSignal
) => {
  console.log(`---Fetching API Data for ${category}---`);
  const response = await fetch(
    `https://dummyjson.com/products/category/${category}`,
    { signal }
  );
  return response.json();
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [result, setResult] = useState<number | undefined>();

  // ✅ Fetch Categories (Auto-fetch on mount)
  const categoryApi = useApiEasy({
    apiPromise: fetchCategories,
    initialCall: true,
    useAbortController: true,
  });

  // ✅ Fetch Products (Cached API calls)
  const productsApi = useApiEasy({
    apiPromise: fetchProductsByCategory,
    useAbortController: true,
    enableCache: true, // Enables caching
    initialCall: false, // Will call when a category is selected
  });

  useEffect(() => {
    multiply(3, 7).then(setResult);
  }, []);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Multiplication Result: {result}</Text>

        {/* ✅ Display Categories */}
        {categoryApi.isLoading ? (
          <Text>Loading Categories...</Text>
        ) : categoryApi.response ? (
          <>
            <Text style={styles.subHeader}>Select a Category:</Text>
            <FlatList
              data={categoryApi.response}
              keyExtractor={(item) => item?.slug}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryListContainer}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    selectedCategory === item?.slug
                      ? styles.selectedCategory
                      : {},
                  ]}
                  onPress={() => {
                    setSelectedCategory(item?.slug);
                    productsApi.eventCall(item?.slug); // ✅ Normal Call (Uses Cache)
                  }}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === item?.slug
                        ? styles.selectedText
                        : {},
                    ]}
                  >
                    {item?.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </>
        ) : categoryApi.error ? (
          <Text>Error: {categoryApi.error.message}</Text>
        ) : null}

        {/* ✅ Display Products (Cached API Calls) */}
        {productsApi.isLoading ? (
          <Text>Loading Products...</Text>
        ) : productsApi.response ? (
          <View style={styles.productListContainer}>
            <Text style={styles.subHeader}>
              Products in {selectedCategory}:
            </Text>
            <FlatList
              data={productsApi.response.products}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.productItem}>
                  <Text>{item.title}</Text>
                </View>
              )}
            />
          </View>
        ) : productsApi.error ? (
          <Text>Error: {productsApi.error.message}</Text>
        ) : null}

        {/* ✅ Force Refresh (Fetch Fresh Data) */}
        <Button
          title="Force Refresh"
          onPress={() => {
            if (selectedCategory) {
              productsApi.eventCall(selectedCategory, true); // ✅ Force API Call (Ignores Cache)
            }
          }}
        />

        {/* ✅ Abort API Call */}
        <Button
          title="Abort API Call"
          onPress={() => {
            categoryApi.abort();
            productsApi.abort();
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  categoryListContainer: {
    paddingBottom: 10,
  },
  categoryItem: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
  selectedCategory: {
    backgroundColor: '#007bff',
  },
  categoryText: {
    color: '#000',
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#fff',
  },
  productListContainer: {
    flex: 1,
    paddingTop: 10,
  },
  productItem: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    marginVertical: 5,
    borderRadius: 5,
  },
});
