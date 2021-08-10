import React from 'react';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';

import firebase from 'firebase';
require('firebase/firestore');

export class App extends React.Component {
  constructor() {
    super()

    this.state = {
      lists: [],
      loggedInText: '',
      uid: ''
    }

    let firebaseConfig = {
      apiKey: "AIzaSyD2gOynPYmK6sS885yDKNp2QaTz50Ttjxc",
      authDomain: "shopping-list-32ae8.firebaseapp.com",
      projectId: "shopping-list-32ae8",
      storageBucket: "shopping-list-32ae8.appspot.com",
      messagingSenderId: "295872866835",
      appId: "1:295872866835:web:a462128d4a7a81b022ade6",
      measurementId: "G-4Q70XLS97Y"
    };
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    else {
      firebase.app()
    }
  }
  componentDidMount() {
    this.referenceShoppinglist = firebase.firestore().collection('list')

    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
    //update user state with currently active user data
      this.setState({
        uid: user.uid,
        loggedInText: 'You are logged in'
      });
    
    
    
      this.referenceShoppinglistUser = this.referenceShoppinglist.where("uid", "==", this.state.uid);
      this.unsubscribeUser = this.referenceShoppinglistUser.onSnapshot(this.onCollectionUpdate);
    })
}
  addList() {
    this.referenceShoppinglist.add({
      name: 'TestList',
      items: ['eggs', 'pasta', 'veggies'],
      uid: this.state.uid
    });
  }

  onCollectionUpdate = (querySnapshot) => {
    console.log("clicking")
    const lists = [];
    // go through each document
    querySnapshot.forEach(
      (doc) => {
      console.log(doc.data)
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      lists.push({
        name: data.name,
        items: data.items.toString(),
        uid: data.uid
      });
    });
    this.setState({
      lists,
    });
  };

  componentWillUnmount() {
    this.authUnsubscribe()
    this.unsubscribeUser()
  }  
  render () {
    return (
      <View
      style={styles.container}
      >
      <FlatList
  data={this.state.lists}
  renderItem={({ item }) =>
  <Text>{item.name}: {item.items}: {item.uid}</Text>}
/>
<Text>{this.state.uid}</Text>
<Button
      onPress={() => this.addList()}
      title="Add Something"
      ></Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,     
  },
  item: {
    fontSize: 20,
    color: 'blue',
  },
  text: {
    fontSize: 30,
  }
});

export default App