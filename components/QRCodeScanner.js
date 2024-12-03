import React, { useEffect, useState } from 'react';
import { View, Alert, Platform, PermissionsAndroid, Linking, Text, Button } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';

const QRScanner = () => {
  const [scanned, setScanned] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Kamera İzni Gerekli',
          message: 'Bu uygulama kameranızı kullanmak için izin gerektirir.',
          buttonNeutral: 'Daha Sonra',
          buttonNegative: 'İptal',
          buttonPositive: 'Tamam',
        }
      );
      setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      setHasPermission(true);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const onBarcodeScan = (event) => {
    try {
      if (!scanned) {
        setScanned(true);
        let scannedData = event.nativeEvent.codeStringValue;
        const isValidUrl = /^(http|https):\/\//.test(scannedData);
        if (!isValidUrl) {
          if (scannedData.toLowerCase().startsWith('www.')) {
            scannedData = `http://${scannedData}`;
          } else {
            Alert.alert('Geçersiz URL', 'Lütfen geçerli bir bağlantı girin.');
            return;
          }
        }
        Linking.openURL(scannedData).catch((err) =>
          Alert.alert('Bağlantı açılamadı', err.message)
        );
        setScanned(false);
      }
    } catch (error) {
      console.log(error)
    }
  
  };

  if (!hasPermission) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Kamera izni gerekiyor</Text>
        <Button title="İzin Ver" onPress={requestCameraPermission} />
      </View>
    );
  }

  return (
    <Camera
      style={{ width: '100%', height: '100%' }}
      cameraType={CameraType.Back}
      flashMode="auto"
      scanBarcode={!scanned}
      onReadCode={onBarcodeScan}
      showFrame={true}
      frameColor="green"
      laserColor="blue"
      focusMode="on"
    />
  );
};

export default QRScanner;
