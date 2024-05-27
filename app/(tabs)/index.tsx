import React, { useState, useEffect } from 'react';
import { Animated, StyleSheet, Dimensions, View, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from 'react-native-paper';
// import RNDetector from 'react-native-detector';

export default function HomeScreen() {
  const [score, setScore] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [screenshotAlert, setScreenshotAlert] = useState(false);

  const screenWidth = Dimensions.get('window').width;

  const handlePress = () => {
    const isIncrement = Math.random() < 0.5;
    const change = isIncrement ? 1 : -score;
    setScore(prevScore => prevScore + change);

    const newText = {
      id: Math.random().toString(),
      value: change,
      text: isIncrement ? '+1' : `-${score}`,
      opacity: new Animated.Value(1),
      translateY: new Animated.Value(0),
      xPos: screenWidth / 2 - 50 + Math.random() * 100, // Random x position within a range close to the center
    };

    setFloatingTexts([...floatingTexts, newText]);

    Animated.parallel([
      Animated.timing(newText.opacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(newText.translateY, {
        toValue: -50, // Move up by 50 units instead of 20
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Remove the floating text after animation
      setFloatingTexts(currentTexts => currentTexts.filter(text => text.id !== newText.id));
    });
  };

  useEffect(() => {
    const handleScreenshot = () => {
      setScreenshotAlert(true);
      setTimeout(() => setScreenshotAlert(false), 2000); // Hide alert after 2 seconds
    };

    // RNDetector.subscribe('screenshot', handleScreenshot);

    // return () => {
    //   RNDetector.unsubscribe('screenshot', handleScreenshot);
    // };
  }, []);

  return (
    <ThemedView style={styles.container}>
      {screenshotAlert && (
        <View style={styles.screenshotAlert}>
          <Text style={styles.screenshotAlertText}>No screenshots allowed!</Text>
        </View>
      )}
      <View style={styles.scoreContainer}>
        <ThemedText type="title">{score}</ThemedText>
      </View>
      {floatingTexts.map(floatingText => (
        <Animated.View
          key={floatingText.id}
          style={[
            styles.floatingText,
            {
              opacity: floatingText.opacity,
              transform: [{ translateY: floatingText.translateY }],
              left: floatingText.xPos,
            }
          ]}
        >
          <ThemedText type="body" style={{ color: floatingText.value > 0 ? 'green' : 'red' }}>
            {floatingText.text}
          </ThemedText>
        </Animated.View>
      ))}
      <View style={styles.buttonContainer}>
        <Button 
          buttonColor={'black'} 
          textColor={'white'} 
          rippleColor={'#2e2e2e'} 
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          onPress={handlePress}
        >
          50 - 50
        </Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenshotAlert: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenshotAlertText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreContainer: {
    position: 'absolute',
    top: '50%', // Adjust this value to position the score lower if needed
    alignItems: 'center',
  },
  floatingText: {
    position: 'absolute',
    top: '45%', // Adjust this value to position floating text higher
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '30%', // Position the button below the score
    alignItems: 'center',
  },
  button: {
    borderRadius: 5,
    height: 100,
    width: 100,
    justifyContent: 'center',
  },
  buttonContent: {
    height: '100%',
  },
  buttonLabel: {
    fontSize: 16,
  },
});
