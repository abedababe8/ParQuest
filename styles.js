import { StyleSheet, Dimensions } from 'react-native';
import { Constants } from 'expo';

const SCREEN_WIDTH = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  mapButton: {
    marginTop: '10px',
  },
  ratingCont: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rating: {
    fontFamily: 'Cochin',
    fontSize: 50,
    fontWeight: 'bold'
  },
  scrollView: {
    flexDirection: "row",
    marginTop: -250
  },
  scrollPage: {
    width: SCREEN_WIDTH,
    padding: 20,
    borderRadius: 25,
  },
  screen: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "white"
  },
  text: {
    fontSize: 45,
    fontWeight: "bold"
  }
});

export default styles
