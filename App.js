import React from 'react';
import { Dimensions, StyleSheet, ScrollView, Text, View, Image, ListView, ActivityIndicator } from 'react-native';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    return fetch('https://stridr.social/api/v1/social_pages')
      .then((response) => response.json())
      .then((responseJson) => {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson.filter(
            item => item.thumb_avatar_url !== '/images/thumb/missing.png')
          ),
        }, function() {
          // do something with new state
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={{flex: 1}}>
        <View style={{height: 20, backgroundColor: '#ffffff'}} />
        <ScrollView>
          <View>
            <View style={{flexDirection: 'row'}}>
              <View style={{backgroundColor: '#fff',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1,
                            paddingTop: 100}}>
                <ListView
                  dataSource={this.state.dataSource}
                  renderRow={
                    (rowData) => {
                      if(rowData.description === null) { rowData.description = "" }
                      return (
                        <View style={styles.card}>
                          <Text style={styles.cardTitle}>{rowData.page_name}</Text>
                          <Text style={styles.platformName}>{rowData.platform_name}</Text>
                          <View style={styles.row}>
                            <Image style={styles.description} source={{uri: rowData.thumb_avatar_url}} style={{width: 100, height: 100}} />
                            <Text style={styles.description}>{rowData.description.substring(0, 350)}</Text>
                          </View>
                        </View>
                      );
                    }
                  }
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

var cardWidth;
if(width > 600){ cardWidth = width * 0.7 } else { cardWidth = width }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  card: {
    padding: 20,
    flex: 1,
    width: cardWidth,
  },
  row: {
    flexDirection: 'row',
    paddingTop: 15,
  },
  description: {
    flexDirection: 'column',
    padding: 10,
    flex: 1,
  },
  cardTitle: {
    fontSize: 30,
  },
  platformName: {
    fontSize: 10,
  }
});
