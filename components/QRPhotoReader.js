import React, { useState } from 'react';
import { View, Text, Button, Image, Alert, StyleSheet, Linking } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import RNQRGenerator from 'rn-qr-generator';

const QRPhotoReader = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [qrCodeValue, setQRCodeValue] = useState(null);

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image Picker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
        setSelectedImage(imageUri);
        detectQRCode(imageUri);
      }
    });
  };

  const detectQRCode = (uri) => {
    RNQRGenerator.detect({ uri })
      .then((response) => {
        const { values } = response;
        if (values && values.length > 0) {
          const isValidUrl = /^(http|https):\/\//.test(values[0]);
  
          if (!isValidUrl) {
            if (values[0].toLowerCase().startsWith('www.')) {
              values[0] = `http://${values[0]}`;
            } else {
              Alert.alert('Geçersiz URL', 'Lütfen geçerli bir bağlantı girin.');
              return;
            }
          }
          setQRCodeValue(values[0]);
          Linking.openURL(values[0]).catch((err) =>
            Alert.alert('Bağlantı açılamadı', err.message)
          );
        } else {
          Alert.alert('No QR Code Found', 'Resimde QR kod bulunamadı.');
        }
      })
      .catch((error) => {
        console.log('Cannot detect QR code in image', error);
        Alert.alert('Error', 'QR kod algılama sırasında bir hata oluştu.');
      });
  };

  return (
    <View style={styles.container}>
      <Button title="Fotoğraf Seç" onPress={selectImage} />
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
      {qrCodeValue && (
        <Text style={styles.qrCodeText}>QR Code Değeri: {qrCodeValue}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 16,
    resizeMode: 'contain',
  },
  qrCodeText: {
    marginTop: 16,
    fontSize: 16,
    color: 'blue',
    textAlign: 'center',
  },
});

export default QRPhotoReader;
