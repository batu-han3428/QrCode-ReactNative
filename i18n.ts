import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      select: 'Choose a mode',
      cameraPermissionRequired: 'Camera permission required',
      thisAppRequiresPermissionToUseYourCamera: 'This app requires permission to use your camera.',
      later: 'Later',
      cancel: 'Cancel',
      ok: 'Ok',
      invalidURL: 'Invalid URL',
      couldNotOpenLinkMakeSureYouProvidedAValidURL: 'Could not open link: Make sure you provided a valid URL.',
      qrScanner: 'Qr Scanner',
      allow: 'Allow',
      anUnexpectedErrorOccurred: 'An unexpected error occurred!',
      warning: 'Warning',
      theUserDidNotMakeASelection: 'The user did not make a selection.',
      imageSelectionError: 'Image selection error',
      qRCodeNotFoundInTheImage: 'QR code not found in the image',
      anErrorOccurredDuringQRCodeDetection: 'An error occurred during QR code detection.',
      qRCodeReader: 'QR Code Reader',
      scanQRCodeFromImages: 'Scan QR code from images',
      selectPhoto: 'Select Photo',
      storagePermissionRequired: 'Storage permission required',
      weNeedStoragePermissionToSaveTheQRCodeOnYourDevice: 'We need storage permission to save the QR code on your device.',
      youMustGrantPermissionToSaveTheQRCode: 'You must grant permission to save the QR code.',
      qRCodeSavedSuccessfully: 'QR code saved successfully',
      qRCodeCouldNotBeSaved: 'QR code could not be saved.',
      enterYourLinkBelowAndGenerateQRCode: 'Enter your link below and generate QR code!',
      connection: 'Connection',
      pleaseEnterAValidLink: 'Please enter a valid link.',
      createQRCode: 'Create QR Code',
      saveQRCode: 'Save QR Code'
    },
  },
  tr: {
    translation: {
      select: 'Bir mod seçin',
      cameraPermissionRequired: 'Kamera izni gerekiyor',
      thisAppRequiresPermissionToUseYourCamera: 'Bu uygulama kameranızı kullanmak için izin gerektirir.',
      later: 'Daha Sonra',
      cancel: 'İptal',
      ok: 'Tamam',
      invalidURL: 'Geçersiz URL',
      couldNotOpenLinkMakeSureYouProvidedAValidURL: 'Bağlantı açılamadı: Geçerli bir URL sağladığınızdan emin olun.',
      qrScanner: 'Qr Tarayıcı',
      allow: 'İzin ver',
      anUnexpectedErrorOccurred: 'Beklenmeyen bir hata oluştu!',
      warning: 'Uyarı',
      theUserDidNotMakeASelection: 'Kullanıcı seçim yapmadı.',
      imageSelectionError: 'Görsel seçme hatası',
      qRCodeNotFoundInTheImage: 'Resimde QR kod bulunamadı',
      anErrorOccurredDuringQRCodeDetection: 'QR kod algılama sırasında bir hata oluştu.',
      qRCodeReader: 'QR Kod Okuyucu',
      scanQRCodeFromImages: 'Resimlerden QR kod tarayın',
      selectPhoto: 'Fotoğraf Seç',
      storagePermissionRequired: 'Depolama izni gerekiyor',
      weNeedStoragePermissionToSaveTheQRCodeOnYourDevice: 'QR kodunu cihazınıza kaydedebilmek için depolama iznine ihtiyacımız var.',
      youMustGrantPermissionToSaveTheQRCode: 'QR kodunu kaydetmek için izin vermelisiniz.',
      qRCodeSavedSuccessfully: 'QR kodu başarıyla kaydedildi',
      qRCodeCouldNotBeSaved: 'QR kodu kaydedilemedi.',
      enterYourLinkBelowAndGenerateQRCode: 'Aşağıya bağlantınızı girin ve QR kodunu oluşturun!',
      connection: 'Bağlantı',
      pleaseEnterAValidLink: 'Lütfen geçerli bir bağlantı girin.',
      createQRCode: 'QR Kodu Oluştur',
      saveQRCode: 'QR Kodunu Kaydet'
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
