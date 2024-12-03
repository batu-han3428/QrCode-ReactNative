import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import QRScanner from './components/QRCodeScanner';
import QRCodeGenerator from './components/QRCodeGenerator';
import QRPhotoReader from './components/QRPhotoReader';
// import { Buffer } from 'buffer';
// global.Buffer = Buffer;

const App = () => {

  const [activeMode, setActiveMode] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="QR Tara (Kamera)" onPress={() => setActiveMode('scanner')} />
        <Button title="QR Kod Oluştur" onPress={() => setActiveMode('generator')} />
        <Button title="QR Tara (Fotoğraf)" onPress={() => setActiveMode('photo')} />
      </View>
      {activeMode === 'scanner' && <QRScanner />}
      {activeMode === 'generator' && <QRCodeGenerator />}
      {activeMode === 'photo' && <QRPhotoReader />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f8f8',
    paddingVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 1000,
  },
});

export default App;
