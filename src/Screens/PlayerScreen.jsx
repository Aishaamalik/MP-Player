import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import TrackPlayer, { Capability, usePlaybackState, useProgress } from 'react-native-track-player';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';

const PlayerScreen = ({ route, navigation }) => {
  const { title, path, albumCover, currentIndex, yourPlaylist } = route.params;

  const playbackState = usePlaybackState();
  const progress = useProgress();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(currentIndex);
  const playerSetup = useRef(false);

  useEffect(() => {
    const setupPlayer = async () => {
      if (playerSetup.current) return;

      try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
          stopWithApp: true,
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
        });

        playerSetup.current = true;
        console.log('Player setup completed');

        loadTrack();
      } catch (error) {
        console.error('Error setting up player:', error);
      }
    };

    setupPlayer();

    return () => {
      TrackPlayer.reset();
    };
  }, []);

  const loadTrack = async () => {
    if (!playerSetup.current) return;

    if (!path) {
      console.error('Error: The track path is invalid or empty.');
      return;
    }

    try {
      console.log('Loading track:', title, path);
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: 'trackId',
        url: path,
        title: title,
        artwork: albumCover ? albumCover : require('../assets/pic.jpeg'),
      });
      await TrackPlayer.play();
      setIsPlaying(true);
      console.log('Track added and playing:', title);
    } catch (error) {
      console.error('Error loading track:', error);
    }
  };

  const playPause = () => {
    if (isPlaying) {
      TrackPlayer.pause();
      setIsPlaying(false);
    } else {
      TrackPlayer.play();
      setIsPlaying(true);
    }
  };

  const handleSliderChange = async (value) => {
    await TrackPlayer.seekTo(value);
  };

  const nextSong = async () => {
    try {
      const nextIndex = (currentSongIndex + 1) % yourPlaylist.length;
      setCurrentSongIndex(nextIndex);
      const nextSong = yourPlaylist[nextIndex];

      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: 'trackId',
        url: nextSong.path,
        title: nextSong.title,
        artwork: nextSong.albumCover ? nextSong.albumCover : require('../assets/pic.jpeg'),
      });
      await TrackPlayer.play();
      setIsPlaying(true);

      navigation.setParams({
        title: nextSong.title,
        path: nextSong.path,
        albumCover: nextSong.albumCover ? nextSong.albumCover : require('../assets/pic.jpeg'),
        currentIndex: nextIndex,
      });
    } catch (error) {
      console.error('Error moving to next song:', error);
    }
  };

  const previousSong = async () => {
    try {
      const prevIndex = (currentSongIndex - 1 + yourPlaylist.length) % yourPlaylist.length;
      setCurrentSongIndex(prevIndex);
      const prevSong = yourPlaylist[prevIndex];

      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: 'trackId',
        url: prevSong.path,
        title: prevSong.title,
        artwork: prevSong.albumCover ? prevSong.albumCover : require('../assets/pic.jpeg'),
      });
      await TrackPlayer.play();
      setIsPlaying(true);

      navigation.setParams({
        title: prevSong.title,
        path: prevSong.path,
        albumCover: prevSong.albumCover ? prevSong.albumCover : require('../assets/pic.jpeg'),
        currentIndex: prevIndex,
      });
    } catch (error) {
      console.error('Error moving to previous song:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.wallpaperContainer}>
        <Image
          source={albumCover && typeof albumCover === 'string' ? { uri: albumCover } : require('../assets/pic.jpeg')}
          style={styles.wallpaper}
        />
      </View>
      <Text style={styles.title}>{title || 'No Title'}</Text>
      {path ? (
        <>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={progress.duration}
            value={progress.position}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="#973131"
            maximumTrackTintColor="#ddd"
            thumbTintColor="#973131"
          />
          <View style={styles.controls}>
            <TouchableOpacity onPress={previousSong}>
              <Icon name="skip-previous" size={50} color="#973131" />
            </TouchableOpacity>
            <TouchableOpacity onPress={playPause}>
              <Icon name={isPlaying ? "pause" : "play-arrow"} size={50} color="#973131" />
            </TouchableOpacity>
            <TouchableOpacity onPress={nextSong}>
              <Icon name="skip-next" size={50} color="#973131" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.noTrackMessage}>Play a song</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5E7B2',
  },
  wallpaperContainer: {
    width: '80%',
    height: '40%',
    borderRadius: 10,
    borderWidth: 5,
    borderColor: '#973131',
    overflow: 'hidden',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wallpaper: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#973131',
    marginVertical: 20,
  },
  slider: {
    width: '80%',
    marginVertical: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  noTrackMessage: {
    fontSize: 18,
    color: '#973131',
    marginTop: 20,
  },
});

export default PlayerScreen;
