import React, { Component } from 'react';
import {View,Text,StyleSheet} from 'react-native';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';

const slideAnimation = new SlideAnimation ({slideFrom: 'bottom'});


class PaymentPopup extends Component {
    constructor (props){
        super(props);
        this.state={
            value:this.props.value,
            credit: this.props.credit,
            gift_credit: this.props.gift_credit,
        };
    }

    render () {
        return (
            <View style={styles.container1}>
            <PopupDialog
              ref={(popupDialog) => { this.popupDialog = popupDialog; }}
              dialogAnimation={slideAnimation}
            >
              <View>
                <Text>this.state.value</Text>
              </View>
            </PopupDialog>
          </View>
        );
    
    }
}

const styles = StyleSheet.create({
    container1: {
      flex: 1,
      flexDirection:'column',
    }
});

export default PaymentPopup;

