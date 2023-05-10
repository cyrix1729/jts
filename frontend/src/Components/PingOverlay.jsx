import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, TextInput, FlatList, ScrollView  } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Comment from './Comment';


const PingOverlay = ({ overlayVisible, selectedPing, expandedOverlay, setExpandedOverlay, onClose }) => {
  if (!overlayVisible || !selectedPing) return null;
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    setUpvoted(false);
    setDownvoted(false);
    console.log('Selected Ping:', selectedPing);
  }, [selectedPing]);

  const handleUpvote = async () => {
  if (upvoted) {
    // Cancel vote
    await apiCall('cancel_vote');
    setUpvoted(false);
  } else {
    if (downvoted) {
      // Cancel downvote
      await apiCall('cancel_vote');
      setDownvoted(false);
    }
    // Upvote
    await apiCall('upvote');
    setUpvoted(true);
  }
};

const handleDownvote = async () => {
  if (downvoted) {
    // Cancel vote
    await apiCall('cancel_vote');
    setDownvoted(false);
  } else {
    if (upvoted) {
      // Cancel upvote
      await apiCall('cancel_vote');
      setUpvoted(false);
    }
    // Downvote
    await apiCall('downvote');
    setDownvoted(true);
  }
};
const fetchComments = async () => {
  try {
    const response = await axios.get(`http://10.0.2.2:8000/api/pings/${selectedPing.id}/comments/`);
    setComments(response.data.comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

useEffect(() => {
  setUpvoted(false);
  setDownvoted(false);
  fetchComments();
}, [selectedPing]);

const addComment = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken) {
      const response = await axios.post(
        `http://10.0.2.2:8000/api/pings/${selectedPing.id}/create_comment/`,
        { text: newCommentText },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      setComments([...comments, response.data]);
      setNewCommentText('');
    } else {
      console.error('Access token not found');
    }
  } catch (error) {
    console.error('Error adding comment:', error);
  }
};
  const apiCall = async (action) => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        const response = await axios.post(`http://10.0.2.2:8000/api/pings/${selectedPing.id}/${action}/`, null, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          
        });
  
        // Update the votes count in the selectedPing object
        if (action === 'upvote' || action === 'downvote') {
          selectedPing.votes = response.data.votes;
        } else if (action === 'cancel_vote') {
          selectedPing.votes = response.data.votes;
        }
      } else {
        console.error('Access token not found');
      }
    } catch (error) {
      console.error(`Error ${action}ing the ping:`, error);
    }
  };
  const smallOverlayContent = (
    <>
      <Text style={{ color: 'white', fontSize: 24 }}>Type: {selectedPing.ping_type}</Text>
      <Text style={{ color: 'white', fontSize: 18 }}>Rating: {selectedPing.rating}</Text>
      <Text style={{ color: 'white', fontSize: 18 }}>Votes: {selectedPing.votes}</Text>
      <Text style={{ color: 'white', fontSize: 18, paddingBottom: 5}}>Comments: {comments.length}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity onPress={handleUpvote}>
          <MaterialIcons name="thumb-up" size={25} color={upvoted ? '#5438f2' : 'white'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDownvote} style={{ marginLeft: 10 }}>
          <MaterialIcons name="thumb-down" size={25} color={downvoted ? '#5438f2' : 'white'} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => setExpandedOverlay(true)} style={{ position: 'absolute', top: 10, left: 10 }}>
        <MaterialIcons name="expand-less" size={25} color="white" />
      </TouchableOpacity>
    </>
  );

  const expandedOverlayContent = (
    <>
      <TouchableOpacity onPress={() => setExpandedOverlay(false)} style={{ position: 'absolute', top: 10, left: -10 }}>
        <MaterialIcons name="expand-more" size={30} color="white" />
      </TouchableOpacity>
      <FlatList
        style={{ paddingTop: 8, width: '95%' }}
        data={comments}
        ListHeaderComponent={
          <View>
            <View style={{ marginBottom: 10 }}>
              <Text style={{ color: 'white', fontSize: 24 }}>Type: {selectedPing.ping_type}</Text>
              <Text style={{ color: 'white', fontSize: 18 }}>Description: {selectedPing.desc}</Text>
              <Text style={{ color: 'white', fontSize: 18 }}>Rating: {selectedPing.rating}</Text>
              <Text style={{ color: 'white', fontSize: 18 }}>Votes: {selectedPing.votes}</Text>
              <View style={{ borderBottomWidth: 1, borderBottomColor: 'white', width: '100%', marginVertical: 10 }} />
              <View style={{ marginTop: 10 }}>
                <Text style={{ color: 'white', fontSize: 18, marginBottom: 5 }}>Comments</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                    backgroundColor: 'white',
                    borderRadius: 9,
                    paddingHorizontal: 5,
                    borderColor: '#ccc',
                    borderWidth: 1,
                  }}
                >
                  <TextInput
                    style={{ flex: 1, marginRight: 5, fontSize: 14}}
                    placeholder="Add a comment..."
                    onChangeText={setNewCommentText}
                    value={newCommentText}
                  />
                  <TouchableOpacity onPress={addComment}>
                    <MaterialIcons name="add" size={23} color="#5438f2" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Comment
            text={item.text}
            creator_alias={item.creator_alias}
            date={item.date} // Make sure the date is being returned from the backend
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </>
  );
    
  
  const overlayStyle = (expanded) => ({
    position: 'absolute',
    top: expanded ? 100 : 400,
    left: expanded ? 20 : 70,
    right: expanded ? 20 : 70,
    bottom: expanded ? 100 : 200,
    backgroundColor: expanded ? 'rgba(158,194,200, 0.9)' : 'rgba(158,194,200, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 20,
  });

  const handleClose = () => {
    onClose();
    setExpandedOverlay(false);
  };

  return (
    <>
      <View style={overlayStyle(expandedOverlay)}>
        {expandedOverlay ? expandedOverlayContent : smallOverlayContent}
        <TouchableOpacity
          onPress={handleClose}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MaterialIcons name="close" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default PingOverlay;
