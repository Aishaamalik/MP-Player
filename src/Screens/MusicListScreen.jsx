import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, PermissionsAndroid, Alert, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';

const MusicListScreen = ({ navigation }) => {
  const [musicFiles, setMusicFiles] = useState([]);
  const [fetchingMusic, setFetchingMusic] = useState(false);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const permission = Platform.Version >= 30 
        ? PERMISSIONS.ANDROID.READ_MEDIA_AUDIO 
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

      const result = await request(permission);
      return result === RESULTS.GRANTED;
    }
    return true;
  };

  const fetchMusic = async () => {
    try {
      const hasPermission = await requestStoragePermission();
      if (hasPermission) {
        setFetchingMusic(true);

        const musicDirectory = Platform.Version >= 30
          ? RNFS.ExternalStorageDirectoryPath
          : RNFS.DownloadDirectoryPath;

        const files = await RNFS.readDir(musicDirectory);

        const musicFiles = files
          .filter((file) => file.isFile() && file.name.endsWith('.mp3'))
          .map((file) => ({
            id: file.path,
            title: file.name.replace('.mp3', ''),
            path: 'file://' + file.path,
            albumCover: null, 
            artist: 'Unknown Artist',
            album: 'Unknown Album',
          }));

        setMusicFiles(musicFiles);
        setFetchingMusic(false);

        if (musicFiles.length === 0) {
          showAlert();
        }
      } else {
        console.log('Storage permission denied');
      }
    } catch (error) {
      console.error('Error fetching music files:', error);
    }
  };

  const showAlert = () => {
    Alert.alert(
      'No Music Found',
      'No music files were found in your storage.',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false }
    );
  };

  const handleSongPress = async (item, index) => {
    navigation.navigate('PlayerScreen', {
      title: item.title,
      path: item.path,
      albumCover: item.albumCover,
      currentItem: item,
      currentIndex: index,
      yourPlaylist: musicFiles,
    });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleSongPress(item, index)} style={styles.itemContainer}>
      <View style={{ flexDirection: "row" }}>
        {item.albumCover ? (
          <Image source={{ uri: item.albumCover }} style={styles.albumCover} />
        ) : (
          <Image source={require("../assets/pic.jpeg")} style={styles.albumCover} />
        )}
        <Text style={styles.title}>{item.title}</Text>
      </View>
      <Text style={styles.artist}>Artist: {item.artist}</Text>
      <Text style={styles.album}>Album: {item.album}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.playlistHeading}>Playlist</Text>
      {musicFiles.length === 0 && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={fetchMusic} style={styles.fetchButton}>
            <Text style={styles.fetchButtonText}>Fetch from Device Storage</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={musicFiles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E7B2',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  playlistHeading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#973131',
    marginBottom: 20,
  },
  list: {
    width: '100%',
  },
  itemContainer: {
    backgroundColor: '#F9D689',
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#973131',
    marginLeft: 10,
  },
  fetchButton: {
    backgroundColor: '#E0A75E',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#973131',
    elevation: 3,
  },
  fetchButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 20,
  },
  artist: {
    color: '#973131',
  },
  album: {
    color: '#973131',
  },
  albumCover: {
    height: 50,
    width: 50,
    marginRight: 12,
    borderRadius: 5,
  },
});

export default MusicListScreen;
