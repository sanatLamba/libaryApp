import React from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import firebase from 'firebase';
import db from '../config';


export default class SearchScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            allTransactions: [],
            search: "",
            lastVisibleTransaction: null
        }
    }
    componentDidMount=async()=>{
       var query = await db.collection("transaction").limit(10).get()
        query.docs.map((doc)=>{
            console.log(doc.data())
            this.setState({
                allTransactions: [...this.state.allTransactions,doc.data()],
                lastVisibleTransaction: doc
            })
        })
    }

    fetchMoreTransactions=async()=>{
        var text = this.state.search.toLowerCase();
        var enteredText = text.split("");

        if(enteredText[0].toLowerCase()==="b"){
            const transaction = await db.collection("transaction").where('bookId','==',text)
            .startAfter(this.state.lastVisibleTransaction).limit(10).get();
            transaction.docs.map((doc)=>{
                this.setState({
                    allTransactions: [...this.state.allTransactions,doc.data()],
                    lastVisibleTransaction: doc
                })
            })
        }
        else  if(enteredText[0].toLowerCase()==="s"){
            const transaction = await db.collection("transaction").where('studentId','==',text)
            .startAfter(this.state.lastVisibleTransaction).limit(10).get();
            transaction.docs.map((doc)=>{
                this.setState({
                    allTransactions: [...this.state.allTransactions,doc.data()],
                    lastVisibleTransaction: doc
                })
            })
        }
    }

    searchTransaction=async(text)=>{
        var enteredText = text.split("");
        if(enteredText[0].toLowerCase()==="b"){
            const transaction = await db.collection("transaction").where('bookId','==',text).get();
            transaction.docs.map((doc)=>{
                this.setState({
                    allTransactions: [...this.state.allTransactions,doc.data()],
                    lastVisibleTransaction: doc
                })
            })

        }
        else  if(enteredText[0].toLowerCase()==="s"){
            const transaction = await db.collection("transaction").where('studentId','==',text).get();
            transaction.docs.map((doc)=>{
                this.setState({
                    allTransactions: [...this.state.allTransactions,doc.data()],
                    lastVisibleTransaction: doc
                })
            })
        }
    }

    render(){
        return(
            <View style = {styles.container}>
                <TextInput 
                    placeholder = "bookId or studentId"
                    onChangeText = {(text)=>{
                        this.setState({
                            search:text
                        })
                    }}
                    styles = {styles.inputField}
                />
                <TouchableOpacity onPress={()=>{
                    this.searchTransaction(this.state.search)
                }}>
                    <Text>
                        search
                    </Text>
                </TouchableOpacity>
                <FlatList 
                    data = {this.state.allTransactions}
                    renderItem = {({item})=>(
                        <View>
                            <Text>
                                {"bookId is:"+ item.bookId}
                            </Text>
                            <Text>
                                {"studentId is:"+ item.studentId}
                            </Text>
                            <Text>
                                {"transaction type is:"+ item.transactionType}
                            </Text>
                            <Text>
                                {"transaction date is:"+ item.data}
                            </Text>
                        </View>
                    )}
                    keyExtractor = {(item,index)=>{
                        index.toString()
                    }}
                    onEndReached = {this.fetchMoreTransactions}
                    onEndReachedThreshold = {0.7} 
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputField: {
        borderWidth: 2,
        height: 50,
        width: 300,
        padding: 10,
        marginTop: 30,
    }
  });
