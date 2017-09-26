import React, { Component } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import Stars from 'react-native-stars';
import SearchAnimations from './SearchAnimations';
import Icon from 'react-native-vector-icons/MaterialIcons';

class Explore extends Component {

  constructor(props) {
   super(props);
   this.state = {
     starCount: 2.5
   };
 }

 onStarRatingPress(rating) {
   this.setState({
     starCount: rating
   });
 }

  render () {
    var rating = 3.47;
    if (rating - Math.floor(rating) < 0.5) {
      rating = Math.floor(rating);
    } else {
      rating = Math.ceil(rating);
    }
    return(
      <View style={styles.container}>
        <SearchAnimations />
        <View style={styles.filter}>
        </View>

        <ScrollView style={{
          marginTop: 5,
          marginBottom: 70,
        }}
        showsHorizontalScrollIndicator={false}
        >

        <TouchableOpacity>
      <View style={styles.cards}>
          <View style={styles.previewimg}>
            <Image source={require('./img/homesample.jpg')}
            style={styles.image}>
            </Image>
          </View>
          <View style={styles.details}>
              <View style={styles.info}>
                <Text style={styles.h2}>ویلای لاکچری لب ساحل </Text>
                <Text style={styles.cityfont}>نمک آبرود، مازندران</Text>
                <View style={styles.stars}>

                <Stars
               value={5-rating}
               spacing={0}
               count={5}
               starSize={15}
               fullStar= {require('./img/starBlank.png')}
               emptyStar= {require('./img/starFilled.png')}/>

                  </View>
                </View>

              <View style={styles.price}>
                <Text style={styles.pricetext}>255,000</Text>
                <Text style={styles.toman}>تومان</Text>
                <Text style={styles.night}>/ هر شب</Text>
              </View>
          </View>
      </View>
      </TouchableOpacity>

      <TouchableOpacity>
    <View style={styles.cards}>
        <View style={styles.previewimg}>
          <Image source={require('./img/back.jpg')}
          style={styles.image}>
          </Image>
        </View>
        <View style={styles.details}>
            <View style={styles.info}>
              <Text style={styles.h2}>ویلای لاکچری لب ساحل </Text>
              <Text style={styles.cityfont}>نمک آبرود، مازندران</Text>
              <View style={styles.stars}>

              <Stars
             value={5-rating}
             spacing={0}
             count={5}
             starSize={15}
             fullStar= {require('./img/starBlank.png')}
             emptyStar= {require('./img/starFilled.png')}/>

                </View>
              </View>

            <View style={styles.price}>
              <Text style={styles.pricetext}>255,000</Text>
              <Text style={styles.toman}>تومان</Text>
              <Text style={styles.night}>/ هر شب</Text>
            </View>
        </View>
    </View>
    </TouchableOpacity>

    <TouchableOpacity>
  <View style={styles.cards}>
      <View style={styles.previewimg}>
        <Image source={require('./img/homesample.jpg')}
        style={styles.image}>
        </Image>
      </View>
      <View style={styles.details}>
          <View style={styles.info}>
            <Text style={styles.h2}>ویلای لاکچری لب ساحل </Text>
            <Text style={styles.cityfont}>نمک آبرود، مازندران</Text>
            <View style={styles.stars}>

            <Stars
           value={5-rating}
           spacing={0}
           count={5}
           starSize={15}
           fullStar= {require('./img/starBlank.png')}
           emptyStar= {require('./img/starFilled.png')}/>

              </View>
            </View>

          <View style={styles.price}>
            <Text style={styles.pricetext}>255,000</Text>
            <Text style={styles.toman}>تومان</Text>
            <Text style={styles.night}>/ هر شب</Text>
          </View>
      </View>
  </View>
  </TouchableOpacity>

  <TouchableOpacity>
<View style={styles.cards}>
    <View style={styles.previewimg}>
      <Image source={require('./img/back.jpg')}
      style={styles.image}>
      </Image>
    </View>
    <View style={styles.details}>
        <View style={styles.info}>
          <Text style={styles.h2}>ویلای لاکچری لب ساحل </Text>
          <Text style={styles.cityfont}>نمک آبرود، مازندران</Text>
          <View style={styles.stars}>

          <Stars
         value={5-rating}
         spacing={0}
         count={5}
         starSize={15}
         fullStar= {require('./img/starBlank.png')}
         emptyStar= {require('./img/starFilled.png')}/>

            </View>
          </View>

        <View style={styles.price}>
          <Text style={styles.pricetext}>255,000</Text>
          <Text style={styles.toman}>تومان</Text>
          <Text style={styles.night}>/ هر شب</Text>
        </View>
    </View>
</View>
</TouchableOpacity>

<TouchableOpacity>
<View style={styles.cards}>
  <View style={styles.previewimg}>
    <Image source={require('./img/homesample.jpg')}
    style={styles.image}>
    </Image>
  </View>
  <View style={styles.details}>
      <View style={styles.info}>
        <Text style={styles.h2}>ویلای لاکچری لب ساحل </Text>
        <Text style={styles.cityfont}>نمک آبرود، مازندران</Text>
        <View style={styles.stars}>

        <Stars
       value={5-rating}
       spacing={0}
       count={5}
       starSize={15}
       fullStar= {require('./img/starBlank.png')}
       emptyStar= {require('./img/starFilled.png')}/>

          </View>
        </View>

      <View style={styles.price}>
        <Text style={styles.pricetext}>255,000</Text>
        <Text style={styles.toman}>تومان</Text>
        <Text style={styles.night}>/ هر شب</Text>
      </View>
  </View>
</View>
</TouchableOpacity>

<TouchableOpacity>
<View style={styles.cards}>
  <View style={styles.previewimg}>
    <Image source={require('./img/homesample.jpg')}
    style={styles.image}>
    </Image>
  </View>
  <View style={styles.details}>
      <View style={styles.info}>
        <Text style={styles.h2}>ویلای لاکچری لب ساحل </Text>
        <Text style={styles.cityfont}>نمک آبرود، مازندران</Text>
        <View style={styles.stars}>

        <Stars
       value={5-rating}
       spacing={0}
       count={5}
       starSize={15}
       fullStar= {require('./img/starBlank.png')}
       emptyStar= {require('./img/starFilled.png')}/>
          </View>
        </View>

      <View style={styles.price}>
        <Text style={styles.pricetext}>255,000</Text>
        <Text style={styles.toman}>تومان</Text>
        <Text style={styles.night}>/ هر شب</Text>
      </View>
  </View>
</View>
</TouchableOpacity>

<TouchableOpacity>
<View style={styles.cards}>
  <View style={styles.previewimg}>
    <Image source={require('./img/homesample.jpg')}
    style={styles.image}>
    </Image>
  </View>
  <View style={styles.details}>
      <View style={styles.info}>
        <Text style={styles.h2}>ویلای لاکچری لب ساحل </Text>
        <Text style={styles.cityfont}>نمک آبرود، مازندران</Text>
        <View style={styles.stars}>

        <Stars
       value={5-rating}
       spacing={0}
       count={5}
       starSize={15}
       fullStar= {require('./img/starBlank.png')}
       emptyStar= {require('./img/starFilled.png')}/>
          </View>
        </View>

      <View style={styles.price}>
        <Text style={styles.pricetext}>255,000</Text>
        <Text style={styles.toman}>تومان</Text>
        <Text style={styles.night}>/ هر شب</Text>
      </View>
  </View>
</View>
</TouchableOpacity>

</ScrollView>

      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#dddddd',
  },
  cards: {
    flexWrap: 'wrap',
    width: Dimensions.get('window').width - 20,
    height: 110,
    backgroundColor: '#f9f9f9',
    marginTop:5,
    borderRadius: 3,
    flexDirection: "row",
    justifyContent:"flex-start",
    alignItems: 'center',
},
  details: {
    flex: 4,
    flexDirection: "column",
    justifyContent: 'flex-end',
    alignItems:"flex-end",
    marginRight:10,
  },
  info: {
    flex:3,
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    marginTop:8,
  },
previewimg : {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
h2: {
  fontSize: 16,
  fontFamily: "Vazir-Medium",
  color: "#4f4f4f",
},
cityfont:{
  fontSize: 10,
  fontFamily: "Vazir",
  color: "#4f4f4f",
},
stars: {
alignItems: "flex-end",
},
price: {
  flex:1,
  justifyContent:"flex-start",
  flexDirection: "row-reverse",
},
pricetext: {
  fontSize: 12,
  fontFamily: "Vazir",
  color: "#f56e4e"
},
toman: {
  fontSize: 12,
  fontFamily: "Vazir",
  color: "#f56e4e",
  marginRight:2,
},
night: {
  fontSize: 12,
  fontFamily: "Vazir",
  color: "#acacac",
  marginRight:2,
},
image : {
 width: Dimensions.get('screen').width/3,
 height: 110,
},
filter : {
  backgroundColor: '#636877',
  height:13,
  width: Dimensions.get('screen').width
},
});

export default Explore;
