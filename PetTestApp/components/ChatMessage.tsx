import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Message } from '../services/ChatService';
import { auth } from '../firebase';
import { colors } from '../constants/Styles';

interface ChatMessageProps {
  message: Message;
  onLongPress?: (message: Message) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onLongPress }) => {
  const currentUser = auth.currentUser;
  const isOwnMessage = message.senderId === currentUser?.uid;

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress(message);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}
      onLongPress={handleLongPress}
      activeOpacity={0.8}
    >
      {!isOwnMessage && (
        <View style={styles.avatarContainer}>
          {message.senderAvatar ? (
            <Image source={{ uri: message.senderAvatar }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Text style={styles.avatarText}>
                {message.senderName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={[
        styles.messageBubble,
        isOwnMessage ? styles.ownBubble : styles.otherBubble
      ]}>
        {!isOwnMessage && (
          <Text style={styles.senderName}>{message.senderName}</Text>
        )}

        {message.type === 'text' && (
          <Text style={[
            styles.messageText,
            isOwnMessage ? styles.ownText : styles.otherText
          ]}>
            {message.text}
          </Text>
        )}

        {message.type === 'image' && message.imageUrl && (
          <Image source={{ uri: message.imageUrl }} style={styles.messageImage} />
        )}

        {message.type === 'location' && message.location && (
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>📍 位置信息</Text>
            <Text style={styles.locationCoords}>
              {message.location.latitude.toFixed(6)}, {message.location.longitude.toFixed(6)}
            </Text>
            {message.location.address && (
              <Text style={styles.locationAddress}>{message.location.address}</Text>
            )}
          </View>
        )}

        <Text style={[
          styles.timestamp,
          isOwnMessage ? styles.ownTimestamp : styles.otherTimestamp
        ]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  ownMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
    marginTop: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  defaultAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 18,
  },
  ownBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownText: {
    color: 'white',
  },
  otherText: {
    color: '#333',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginVertical: 4,
  },
  locationContainer: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    marginVertical: 4,
  },
  locationText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  locationCoords: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  ownTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  otherTimestamp: {
    color: '#999',
    textAlign: 'left',
  },
});

export default React.memo(ChatMessage); 