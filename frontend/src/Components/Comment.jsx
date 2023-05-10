import React from 'react';
import { View, Text } from 'react-native';

const formatDateRelative = (dateString) => {
  const date = new Date(dateString).getTime();
  const now = new Date().getTime();
  const timeDifference = Math.max(0, now - date); // Ensure time difference is non-negative
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const years = Math.floor(weeks / 52);

  if (years > 0) {
    return `${years} year${years === 1 ? '' : 's'} ago`;
  } else if (weeks > 0) {
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  } else if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else {
    return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
  }
};

const Comment = ({ text, creator_alias, date }) => (
  <View style={{ backgroundColor: 'white', padding: 9, borderRadius: 13, marginBottom: 5, borderColor: '#ccc', borderWidth: 1 }}>
    <Text style={{ color: '#333', fontSize: 13, fontWeight: 'bold' }}>{creator_alias}:</Text>
    <Text style={{ color: '#333', fontSize: 13 }}>{text}</Text>
    <Text style={{ color: '#999', fontSize: 11, textAlign: 'right' }}>{formatDateRelative(date)}</Text>
  </View>
);

export default Comment;
