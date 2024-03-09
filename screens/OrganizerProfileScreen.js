import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  useWindowDimensions,
  FlatList
} from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useState } from 'react';
import Card from "../components/Card";


export default function OrganizerProfileScreen({ navigation, route: { params: { organizer } } }) {
  const layout = useWindowDimensions();

  // Routes for tabs
  const FirstRoute = () => (
    <View style={{ flex: 1 }} >
      <Text style={styles.text}>{organizer.about}</Text>
    </View>
  );

  const SecondRoute = () => (
    <View style={{ flex: 1}} >
        {activities}
    </View>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'À propos' },
    { key: 'second', title: 'Activités' },
  ]);

  const renderTabBar = (props) => (
    <View style={styles.tabBarContainer}>
      {props.navigationState.routes.map((route, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.tabButton,
            { backgroundColor: '#fff' },
            { borderBottomColor: index === i ? '#EEF0FF' : '#fff' },
            { borderBottomWidth: 4 },
          ]}
          onPress={() => setIndex(i)}
        >
          <Text style={{ color: index === i ? '#5669FF' : '#747688', fontWeight: 'bold', textTransform: 'uppercase' }}>
            {route.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const activities = organizer.activities.map((activity, i) => {
    return <Card key={i} activity={activity} display="vertical" />
  })

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
    >
      <FontAwesome style={styles.iconReturnButton} name={'arrow-left'} color={'black'} size={20} onPress={() => navigation.goBack()} />
      <View style={styles.img}>
        {organizer.imgUrl && <Image source={{ uri: organizer.imgUrl }} style={{ width: 150, height: 150, borderRadius: 100 }} />}
        {organizer.imgUrl==="" && <Text style={styles.initiale}>{organizer.name.slice(0, 1)}</Text>}
      </View>

      <Text style={styles.title}>{organizer.name}</Text>
      <Text style={styles.subtitle}>{organizer.title}</Text>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      // renderTabBar={(props) => (
      //   <TabBar
      //     {...props}
      //     style={{ backgroundColor: '#fff' }}
      //     labelStyle={{ color: '#29253C', fontWeight: 'bold' }}
      //     activeLabelStyle={{ color: '#5669FF' }}
      //     activeTabStyle={{ borderBottomColor: '#5669FF' }}
      //   />
      // )}
      />

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  iconReturnButton: {
    marginTop: 80,
    marginLeft: 20,
  },
  img: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 20,
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: '#EEF0FF',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    margin: 20,
    lineHeight: 22,
  },
  initiale: {
    fontSize: 68,
    fontWeight: 'bold',
    color: '#BBC3FF',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#29253C",
    marginBottom: 8,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: "#B8B6BE",
    marginBottom: 20,
    alignSelf: 'center',
  },

  button: {
    padding: 10,
    width: "70%",
    height: 58,
    backgroundColor: "#5669FF",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "uppercase",
  },
  border: {
    alignItems: "center",
    paddingLeft: 4,
    paddingRight: 4,
    borderColor: "#E4dfdf",
    borderWidth: 1,
    borderRadius: 12,
    width: "90%",
  },
  tabTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: 'yourTabBarBackgroundColor',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
});
