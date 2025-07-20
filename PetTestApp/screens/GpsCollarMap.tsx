import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { colors } from '../constants/Styles';

const GpsCollarMap = () => {
  const { isDarkMode } = useTheme();

  // 模拟宠物位置（使用多伦多的坐标）
  const petLocation = {
    lat: 43.6532,
    lng: -79.3832,
    name: 'My Pet',
    // 使用一个可靠的图片URL
    avatar: 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png'
  };

  // HTML 内容，包含 Leaflet 地图和标记
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <style>
          html, body, #map {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }
          .pet-marker {
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map').setView([${petLocation.lat}, ${petLocation.lng}], 13);
          
          L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            attribution: '© Google Maps',
            maxZoom: 19
          }).addTo(map);

          // 创建一个自定义图标
          const petIcon = L.icon({
            iconUrl: '${petLocation.avatar}',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            popupAnchor: [0, -20],
            className: 'pet-marker'
          });

          // 添加标记
          const marker = L.marker([${petLocation.lat}, ${petLocation.lng}], {
            icon: petIcon,
            title: '${petLocation.name}'
          }).addTo(map);

          // 添加弹出窗口
          marker.bindPopup('<b>${petLocation.name}</b><br>Last seen here');
        </script>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? colors.gray[900] : colors.white }]}>
      <View style={styles.mapContainer}>
        <WebView
          source={{ html: htmlContent }}
          style={styles.map}
          scrollEnabled={false}
          zoomable={true}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  map: {
    flex: 1,
  },
});

export default GpsCollarMap; 