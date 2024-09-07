import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const MusicFetchScreen = ({ navigation }) => {
  const [musicData, setMusicData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await axios.get('https://api.deezer.com/search?q=pop');
        setMusicData(response.data.data); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching music:', error);
        setLoading(false);
      }
    };
    fetchMusic();
  }, []);

  const handleSongPress = (item, index) => {
    navigation.navigate('PlayerScreen', {
      playlist: musicData, // Pass the entire playlist
      currentIndex: index, // Pass the index of the selected song
    });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleSongPress(item, index)} style={styles.itemContainer}>
      <Image source={{ uri: item.album.cover_medium }} style={styles.albumCover} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.artist}>Artist: {item.artist.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Deezer Playlist</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#973131" />
      ) : (
        <FlatList
          data={musicData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E7B2',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#973131',
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9D689',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    alignItems: 'center',
  },
  albumCover: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#973131',
  },
  artist: {
    fontSize: 14,
    color: '#973131',
  },
});

export default MusicFetchScreen;
