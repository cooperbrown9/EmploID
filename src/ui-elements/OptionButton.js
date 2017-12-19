import { View, Text, StyleSheet } from 'react-native';

const OptionButton = props => (
  <TouchableOpacity>
    <Text style={styles.text} >

    </Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 16
  }
})
