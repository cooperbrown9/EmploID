import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, TextInput, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import SubmitButton from '../ui-elements/submit-button';
import RoundButton from '../ui-elements/round-button';
import OptionView from '../ui-elements/option-view';

import * as API from '../api/api';
import * as Colors from '../constants/colors';

class CreatePlaceNoteForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      text: '',
      deleteText: 'DELETE',
      deleteCount: 0,
    }
  }

  static propTypes = {
    dismiss: PropTypes.func,
    edit: PropTypes.func,
    note: PropTypes.object
  }

  static defaultProps = {
    edit: false
  }

  componentDidMount() {
    if(this.props.edit) {
      this.setState({ title: this.props.note.title, text: this.props.note.text }, () => {
        // this.optionSelected((this.props.note.exclusive || false) ? 0 : 1);
      })
    }
  }

  createNote = () => {
    let noteData = {
      "title": this.state.title,
      "text": this.state.text,
      "creatorID": this.props.myID,
      "placeID": this.props.placeID
    };

    API.createPlaceNote(noteData, (err, response) => {
      if(err) {
        console.log(err);
      } else {
        this.props.dismiss(true);
      }
    });
  }

  editNote = () => {
    // let exclusive = this.state.exclusiveOptions[0].selected;
    var data = {
      ...this.props.note,
      "title": this.state.title,
      "text": this.state.text
    }

    API.updatePlaceNote(data, (e1, note) => {
      if(e1) {
        console.log(e1);
      } else {
        this.props.dismiss();
      }
    })
  }

  deleteNote() {
    if(this.state.deleteCount === 0) {
      this.setState({ deleteText: 'Click again to confirm', deleteCount: ++this.state.deleteCount });
    } else {
      API.deletePlaceNote(this.props.note._id, (err, res) => {
        if(err) {
          console.log(err)
        } else {
          this.props.dismiss();
        }
      })
    }
  }

  textInputFactory(placeholder, onTextChange, value) {
    return (
      <TextInput
        placeholder={placeholder} placeholderTextColor={Colors.DARK_GREY}
        selectionColor={Colors.BLUE} style={styles.input}
        autoCorrect={false} autoCapitalize={'none'}
        onChangeText={(text) => onTextChange(text)}
        value={value}
      />
    )
  }

  render() {
    return(
      <ScrollView style={styles.scrollContainer} >
        <View style={styles.backButton} >
          <RoundButton imagePath={require('../../assets/icons/down.png')} onPress={() => this.props.dismiss(false)} />
        </View>
        <KeyboardAwareScrollView style={styles.container} contentContainerStyle={{justifyContent:'center'}} >
          <View style={{height:64}} />

          <Text style={styles.textHeader}>Title</Text>
          <View style={styles.inputView}>
            {this.textInputFactory('Title', (text) => this.setState({ title: text }), this.state.title)}
          </View>

          <Text style={styles.textHeader}>Text</Text>
          <View style={styles.inputView} >
            {this.textInputFactory('Text', (text) => this.setState({ text: text }), this.state.text)}
          </View>

        </KeyboardAwareScrollView>

        <View style={styles.submitButton} >
          <SubmitButton
            title={(this.props.edit) ? 'UPDATE NOTE' : 'CREATE NOTE'}
            onPress={() => {(this.props.edit) ? this.editNote() : this.createNote()}}
          />
        </View>
        {(this.props.edit)
          ? <View style={styles.deleteButton}>
              <SubmitButton title={this.state.deleteText} onPress={() => this.deleteNote()} hasBGColor={true} bgColor={'red'} />
            </View>
          : null
        }

      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_GREY
  },
  backButton: {
    position: 'absolute', left: 16, top: 24,
    ...ifIphoneX({
      top: 40
    }),
  },
  container: {
    flex: 1,
    marginLeft: 16, marginRight: 16, paddingTop: 100
  },
  optionContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    marginBottom: 16,
    flex: 1,
  },
  inputView: {
    borderRadius: 8,
    marginBottom: 32, marginRight: 16, marginLeft: 16,
    height: 56,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  input: {
    marginLeft: 16,
    fontSize: 18, fontFamily: 'roboto-regular',
    color: 'black'
  },
  submitButton: {
    marginTop: 64, marginLeft: 32, marginRight: 32
  },
  deleteButton: {
    marginTop: 16, marginLeft: 32, marginRight: 32, marginBottom: 32
  },
  textHeader: {
    fontSize: 16, marginLeft: 16, marginBottom: 12,
    color: 'black'
  }
});

var mapStateToProps = state => {
  return {
    sessionID: state.user.sessionID,
    myID: state.user.userID,
    placeID: state.detail.location._id
  }
}

export default connect(mapStateToProps)(CreatePlaceNoteForm);
