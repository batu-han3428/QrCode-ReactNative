import React, { useState } from 'react';
import { View, Image, StyleSheet, Linking } from 'react-native';
import { Button, Card, Text, Snackbar, ActivityIndicator } from 'react-native-paper';
import { launchImageLibrary } from 'react-native-image-picker';
import RNQRGenerator from 'rn-qr-generator';

const QRPhotoReader: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [qrCodeValue, setQRCodeValue] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);

  const selectImage = (): void => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('Kullanıcı seçim yapmadı.');
      } else if (response.errorCode) {
        console.error('Görsel seçme hatası:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
        if (imageUri) {
          setSelectedImage(imageUri);
          detectQRCode(imageUri);
        }
      }
    });
  };

  const detectQRCode = (uri: string): void => {
    setLoading(true);

    RNQRGenerator.detect({ uri })
      .then((response) => {
        const { values } = response;

        if (values && values.length > 0) {
          let detectedValue = values[0];

          const isValidUrl = /^(http|https):\/\//.test(detectedValue);
          if (!isValidUrl) {
            if (detectedValue.toLowerCase().startsWith('www.')) {
              detectedValue = `http://${detectedValue}`;
            } else {
              setQRCodeValue(`Geçersiz URL: ${detectedValue}`);
              setSnackbarVisible(true);
              return;
            }
          }

          setQRCodeValue(detectedValue);

          Linking.openURL(detectedValue).catch((err) => {
            setQRCodeValue(`Bağlantı açılamadı: ${err.message}`);
            setSnackbarVisible(true);
          });
        } else {
          setQRCodeValue('Resimde QR kod bulunamadı.');
          setSnackbarVisible(true);
        }
      })
      .catch((error: Error) => {
        console.error('QR kod algılama hatası:', error);
        setQRCodeValue('QR kod algılama sırasında bir hata oluştu.');
        setSnackbarVisible(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="QR Kod Okuyucu" subtitle="Resimlerden QR kod tarayın" />
        <Card.Content>
          <Button
            mode="contained"
            onPress={selectImage}
            icon="image"
            style={styles.button}
            disabled={loading}
          >
            Fotoğraf Seç
          </Button>
          {loading && <ActivityIndicator animating size="large" style={styles.loader} />}
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.image} />
          )}
          {qrCodeValue && (
            <Text style={styles.qrCodeText}>{qrCodeValue}</Text>
          )}
        </Card.Content>
      </Card>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {qrCodeValue}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    width: '100%',
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  button: {
    marginVertical: 16,
  },
  loader: {
    marginVertical: 16,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 16,
    resizeMode: 'contain',
  },
  qrCodeText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    color: '#6200ee',
  },
});

export default QRPhotoReader;
