import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, FlatList, StyleSheet, TextInput, ActivityIndicator } from "react-native";


export default function HomeScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const loadSavedSearch = async () => {
      try {
        const savedText = await AsyncStorage.getItem("searchText");
        if (savedText) {
          setSearchText(savedText);
        }
      } catch (e) {
        console.log("Failed to load search text");
      }
    };

    loadSavedSearch();
  }, []);

  useEffect(() => {
    if (searchText === "") {
      setFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredPosts(filtered);
  }, [posts, searchText]);

  const fetchPosts = async () => {
  try {
    setLoading(true);
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts"
    );
    const data = await response.json();
    setPosts(data);
    setFilteredPosts(data);
  } catch (error) {
    console.log("Error fetching posts", error);
  } finally {
    setLoading(false);
  }
};


  const handleSearch = async (text: string) => {
    setSearchText(text);
    try {
      await AsyncStorage.setItem("searchText", text);
    } catch (e) {
      console.log("Failed to save search text");
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.body}</Text>
    </View>
  );

  return (
  <View style={styles.container}>
    <TextInput
      style={styles.searchInput}
      placeholder="Search by title..."
      value={searchText}
      onChangeText={handleSearch}
    />

    {loading ? (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading posts...</Text>
      </View>
    ) : (
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    )}
  </View>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
  backgroundColor: "#ffffff",
  padding: 16,
  marginBottom: 14,
  borderRadius: 14,

  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.12,
  shadowRadius: 6,
  elevation: 4,
},

  title: {
  fontSize: 16,
  fontWeight: "600",
  marginBottom: 6,
  color: "#222",
},

  searchInput: {
  backgroundColor: "#ffffff",
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 12,
  fontSize: 16,
  marginBottom: 16,

  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},
  noDataText: {
  textAlign: "center",
  marginTop: 20,
  fontSize: 16,
  color: "#666",
},
loader: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
},
loadingText: {
  marginTop: 10,
  fontSize: 14,
  color: "#555",
},


});
