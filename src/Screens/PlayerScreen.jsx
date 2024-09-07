import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PlayerScreen = ({ route }) => {
  const { playlist, currentIndex } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(currentIndex);

  const currentSong = playlist[currentSongIndex];
  const progress = useProgress();

  useEffect(() => {
    const initializePlayer = async () => {
      const isInitialized = await TrackPlayer.isServiceRunning();
      if (!isInitialized) {
        await TrackPlayer.setupPlayer();
      }
      await loadTrack();
    };

    const loadTrack = async () => {
      await TrackPlayer.reset(); 
      await TrackPlayer.add({
        id: currentSong.id,
        url: currentSong.preview,
        title: currentSong.title,
        artwork: currentSong.album.cover_medium,
      });
      TrackPlayer.play();
      setIsPlaying(true);
    };

    initializePlayer();

    return () => {
      TrackPlayer.reset(); 
    };
  }, [currentSongIndex]);

  const playPause = () => {
    if (isPlaying) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNextTrack = () => {
    if (currentSongIndex < playlist.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    }
  };

  const playPreviousTrack = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    }
  };

  const onSlidingComplete = async (value) => {
    await TrackPlayer.seekTo(value);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: currentSong.album.cover_medium }} style={styles.albumCover} />
      <Text style={styles.title}>{currentSong.title}</Text>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={progress.duration}
        value={progress.position} 
        minimumTrackTintColor="#973131"
        maximumTrackTintColor="#F9D689"
        thumbTintColor="#973131"
        onSlidingComplete={onSlidingComplete} 
      />

      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{Math.floor(progress.position)}s</Text>
        <Text style={styles.timeText}>{Math.floor(progress.duration)}s</Text>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={playPreviousTrack}>
          <Icon name="skip-previous" size={50} color="#973131" />
        </TouchableOpacity>

        <TouchableOpacity onPress={playPause}>
          <Icon name={isPlaying ? 'pause' : 'play-arrow'} size={50} color="#973131" />
        </TouchableOpacity>

        <TouchableOpacity onPress={playNextTrack}>
          <Icon name="skip-next" size={50} color="#973131" />
        </TouchableOpacity>
      </View>
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
  albumCover: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#973131',
    marginVertical: 20,
  },
  slider: {
    width: '80%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  timeText: {
    fontSize: 14,
    color: '#973131',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 20,
  },
});

export default PlayerScreen;
