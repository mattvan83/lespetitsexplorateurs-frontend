import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  Share,
  Alert,
} from "react-native";
import { Svg, Rect, Defs, Pattern, Use} from 'react-native-svg'; 
import { Path } from 'react-native-svg' ;
import { Image as SVGImage } from 'react-native-svg';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useState, useEffect } from "react";

export default function ActivitySheetScreen({ navigation }) {
  const [activityInfo, setActivityInfo] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [organizerImage, setOrganizerImage] = useState('');
  
  const handleShare = async () => {
    console.log('share');

    try {
      const result = await Share.share({
        message:
          'Les Petits Explorateurs | Activité proche de chez vous !',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  }
  
  const handleLike = () => {
    console.log('add to or remove from favorites');
  }

  const handleFollow = () => {
    console.log('follow or unfollow');
  }

  const handleMessage = () => {
    console.log('navigate to MessageScreen');
    navigation.navigate("MessagingDiscussion");
  }

  const handleCalendar = () => {
    console.log('add to calendar');
  }

  //Constante pour la mise en place du fetch / récupération des infos côté front - useEffect pour appeler qu'une seule fois au chargement du composant
  //à remplacer grâce au useSelector une fois les autres pages accessibles?
  useEffect(() => {
    const activityId = '65e77175e8a90dd96d5b277c'

    fetch(`http://192.168.1.111:3000/activities/${activityId}`)
      .then(response => response.json())
      .then(data => {
          console.log('Activity details : ', data);
          setActivityInfo(data);

          //.replace pour enlever les guillemets autour de l'organizerId car problème de fetch avec
          const organizerId = data.organizer.replace(/'/g, '');
          console.log(organizerId);

          fetch(`http://192.168.1.111:3000/users/${organizerId}`)
          .then(response => response.json())
          .then(data => {
          console.log('Organizer info : ', data);
          setOrganizerName(data.name);
          setOrganizerImage({ data: data.image });
      });
      });
    }, []);

    console.log(organizerImage);

  //Gestion de la date
  const dateObject = new Date(activityInfo.date);
    const daysOfWeek = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    // Obtenir le jour de la semaine, le jour du mois, le mois et l'année
    const day = daysOfWeek[dateObject.getDay()];
    const date = dateObject.getDate();
    const month = months[dateObject.getMonth()];
    const year = dateObject.getFullYear();
    // Obtenir l'heure et les minutes
    const hours = dateObject.getUTCHours().toString().padStart(2, '0'); // Ajoute un zéro devant si nécessaire
    const minutes = dateObject.getUTCMinutes().toString().padStart(2, '0'); // Ajoute un zéro devant si nécessaire
    // Formater date et heure
    const formattedDate = `${day} ${date} ${month} ${year}`;
    const formattedTime = `${hours}h${minutes}`;

  //Gestion de la durée
    // Conversion en heures, minutes et secondes
    const durationHours = Math.floor(activityInfo.duration / (1000 * 60 * 60));
    const durationMinutes = Math.floor((activityInfo.duration % (1000 * 60 * 60)) / (1000 * 60));
    // Formater la durée
    const formattedDuration = `${durationHours}h${durationMinutes}`;

  return (
    <View style={styles.container}>
        <ImageBackground resizeMode="cover" style={styles.image} source={require('../assets/Images/bebe-nageurs.jpg')}>
          <View style={styles.iconPosition}>
            <View>
              <FontAwesome name={'arrow-left'} color={'white'} size={20} onPress={() => navigation.goBack()}/>
            </View>
            <View style={styles.likeShare}>
                  <TouchableOpacity onPress={() => handleShare()} style={styles.topIconBckgd}>
                    <Svg width="26" height="26" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg" throwIfNamespace={false}>
                      <Rect width="23.4031" height="21" fill="url(#pattern0)"/>
                      <Defs>
                        <Pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                          <Use xlinkHref="#image0_327_2689" transform="matrix(0.015625 0 0 0.017413 0 -0.0572165)"/>
                        </Pattern>
                        <SVGImage id="image0_327_2689" width="64" height="64" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAACsklEQVR4nO3aS6hVVRgH8JVPBBVBfKSBkAMfmZCCOFMkFMUiELSJCQbSUBBpkg4a+EBFEQLFiaaWhkHiSBAxQqFBg5JE1HxAhGKSQoo9vL9Y3HVFJK/Xc9Y+96zj/o3OYMM+37ef/2/tEGq1Wq1Wq9XaHAZgRHiZYBY+w1X8q9t9nMN6jAqdCMPxObr07nesCp0EY/GjF7M5dAIMwXca81EoHdZq3AO8FkqFQbilOTtCqbBA867jlVAifCyP8aFE2JWpAbNCibA3UwOmh5JgNk5kKv4RRoYSYAa+6sPb3os4G9od3sTXmQtv/5chTMfRdJpW4SIGt7qoJTiAa3iYElv8fQiL0zZTcLjCwqM/MbOVhU9NkbQvR6UnxlblNua1svj5uFthQeexDO/ici/bxXvIEUxqZfFT8EdFhf+MFXHy89QUaCG24RucTHOCdZjcssJ74HQFhcdpzxoMDC9BWHlSPL0/aPvCe2CPPK6nIz4olAQ/ZTrqrX1W56J7ANmsm6FUmp/WRL+GUuGHDA34JY68Q4mwXR6/pZvg4+d9Sbm9Sz7fY24oCY7JqysFpzLG2RiHG6pJcxsw7Bn7XImtaWy2Bav7bfiJN1LkrUJ8SVqe9vMq9uPvZ2wb4/WXeL0/mjAGB5+T8R+lkdelBhpxNsXcvriHpS1vQoRp2IhTuJCKjYHp05gcn1jvW5/+aFX+wduhnem+lvdVOBm6g9Gh3eEtfFtRE8pZG8Q7aRaQ+ywoJ2ViGD5Jj8Fcynq5ijARxzM14P1QIryXqQEfhhJhbqYGLAklwoi0uNKM+IidEEql+VXi9l8c7Q3mNBm5F4XS6f4ytBFfhE6AwQ1cCmf+L0oXCwOxCX89p/C48Lo7Bq7QiTAZO3HlqcJvpEulrO+BmoGhcXTWUad6rVar1Wq10J/+Az9GSgv00HAGAAAAAElFTkSuQmCB"/>
                        </Defs>
                    </Svg>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleLike()} style={styles.topIconBckgd}>
                    <Svg width="23" height="23" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <Path d="M19.2821 3.53908C18.9903 2.9329 18.5696 2.38359 18.0436 1.92189C17.5171 1.45881 16.8964 1.09082 16.2152 0.837904C15.5088 0.57461 14.7512 0.43984 13.9863 0.44142C12.9133 0.44142 11.8663 0.705092 10.9565 1.20314C10.7388 1.32228 10.532 1.45314 10.3361 1.59572C10.1402 1.45314 9.93346 1.32228 9.7158 1.20314C8.80597 0.705092 7.75901 0.44142 6.68593 0.44142C5.91323 0.44142 5.16447 0.574233 4.45706 0.837904C3.7736 1.09181 3.15762 1.45705 2.6287 1.92189C2.10195 2.38307 1.68116 2.93251 1.3902 3.53908C1.08765 4.16994 0.933105 4.83986 0.933105 5.52931C0.933105 6.1797 1.08112 6.85744 1.37496 7.54689C1.62092 8.12306 1.97353 8.72072 2.42409 9.32423C3.13803 10.2793 4.11969 11.2754 5.3386 12.2852C7.35851 13.959 9.35883 15.1152 9.44372 15.1621L9.95958 15.459C10.1881 15.5899 10.482 15.5899 10.7105 15.459L11.2264 15.1621C11.3113 15.1133 13.3094 13.959 15.3315 12.2852C16.5504 11.2754 17.5321 10.2793 18.246 9.32423C18.6966 8.72072 19.0513 8.12306 19.2951 7.54689C19.589 6.85744 19.737 6.1797 19.737 5.52931C19.7392 4.83986 19.5846 4.16994 19.2821 3.53908Z" fill="white"/>
                    </Svg>
                  </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      
      <View style={styles.activity}>
        <Text style={styles.title}>{activityInfo.name}</Text>
        <View style={styles.div}>
          <View style={styles.icon}>
            <Svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <Path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M8.49048 4.35192H17.0475V2.56415H8.49048V4.35192ZM6.54391 2.63757V2.64647C5.87594 2.70098 5.21513 2.82001 4.57225 2.99912V2.99245C4.55314 2.99966 4.53514 3.00521 4.51788 3.01054C4.4952 3.01753 4.47379 3.02414 4.45276 3.03361C4.40137 3.04474 4.35119 3.06142 4.30339 3.08256C4.16238 3.12372 4.02138 3.17267 3.88874 3.22274C3.85349 3.23497 3.81824 3.24916 3.78299 3.26334C3.74774 3.27753 3.71249 3.29171 3.67724 3.30395C3.62884 3.32453 3.57836 3.34706 3.52787 3.36958C3.47738 3.39211 3.4269 3.41464 3.3785 3.43522L3.13951 3.55871C3.09532 3.57893 3.05442 3.60265 3.01269 3.62685L3.01268 3.62685C2.98783 3.64126 2.96268 3.65584 2.93637 3.66996C2.57669 3.87799 2.2433 4.12163 1.94218 4.39864L1.92425 4.41532C1.8847 4.4567 1.84532 4.49684 1.80647 4.53643C1.74085 4.60331 1.67675 4.66864 1.61596 4.73572L1.59803 4.7513C0.620569 5.96169 0.130641 7.45354 0.215483 8.96541V9.44489H2.14532V8.96096C2.14532 6.8539 2.89335 5.54228 4.55791 4.87033C5.19362 4.62892 5.86518 4.47985 6.54869 4.42534H6.56661V2.64535L6.54391 2.63757ZM23.8849 4.72905L23.8933 4.74462C24.8696 5.95613 25.3571 7.44909 25.2711 8.96096V9.4449H23.3424V8.94872C23.3831 8.05651 23.1835 7.16874 22.7605 6.36663C22.3542 5.68023 21.7042 5.14734 20.9191 4.8581C20.2941 4.61669 19.6321 4.4665 18.957 4.4131V2.64202C19.625 2.69764 20.2858 2.81556 20.9298 2.99468V2.98578C20.966 3.00051 20.9936 3.00927 21.041 3.02431L21.0493 3.02694C21.0713 3.03392 21.0918 3.04089 21.1121 3.04779C21.1404 3.05739 21.1681 3.06683 21.1987 3.07589C21.3308 3.11478 21.4544 3.16063 21.5815 3.2078L21.6038 3.21606C21.6625 3.23455 21.7177 3.25748 21.7675 3.27814C21.7836 3.28483 21.7992 3.29129 21.8141 3.29727C21.9193 3.33843 22.0268 3.38738 22.1128 3.42855C22.1702 3.45526 22.2261 3.48385 22.2785 3.51067C22.3069 3.52517 22.3342 3.53915 22.3602 3.55203C22.403 3.57325 22.4402 3.59595 22.476 3.61777C22.5022 3.63372 22.5275 3.64919 22.5538 3.66328C22.9146 3.87243 23.2516 4.11718 23.5563 4.39196L23.5671 4.40865C23.6794 4.50989 23.7858 4.61669 23.8849 4.72905Z" fill="#5669FF"/>
              <Path d="M19.0121 1.39616V5.33558C19.0121 5.83193 18.5633 6.23396 18.0091 6.23396C17.455 6.23396 17.0061 5.83193 17.0061 5.33558V1.40514C17.0011 0.908786 17.4475 0.50339 18.0016 0.500021C18.5558 0.496652 19.0084 0.89531 19.0121 1.39167V1.39616Z" fill="#5669FF"/>
              <Path d="M8.48083 1.41043V5.34011C8.48083 5.83862 8.03145 6.24281 7.47722 6.24281C6.92298 6.24281 6.47485 5.83862 6.47485 5.34011V1.41043C6.47485 0.911923 6.92298 0.50885 7.47722 0.50885C8.03145 0.50885 8.48083 0.911923 8.48083 1.41043" fill="#5669FF"/>
              <Path fill-rule="evenodd" clip-rule="evenodd" d="M0.206055 19.1377V9.44489H25.2808V19.1377C25.2808 23.3645 22.6502 25.5 17.4367 25.5H8.03817C2.83669 25.5 0.206055 23.3645 0.206055 19.1377ZM5.86195 14.8335C5.86195 15.4199 6.37611 15.8957 7.00986 15.8957C7.65556 15.8957 8.16973 15.4088 8.15777 14.8224C8.15777 14.236 7.6436 13.7602 7.02182 13.7602H7.00986C6.37611 13.7602 5.86195 14.247 5.86195 14.8335ZM11.5895 14.8335C11.5895 15.4199 12.1157 15.8957 12.7494 15.8957C13.3832 15.8957 13.8973 15.4199 13.8973 14.8224C13.8973 14.247 13.3832 13.7712 12.7494 13.7602H12.7375C12.1037 13.7712 11.5895 14.247 11.5895 14.8335ZM18.477 15.8957C17.8433 15.8957 17.3291 15.4199 17.3291 14.8335C17.3291 14.247 17.8313 13.7712 18.477 13.7712C19.1108 13.7712 19.6249 14.247 19.6249 14.8335C19.6249 15.4199 19.1108 15.8957 18.477 15.8957ZM18.477 20.4323C17.8433 20.4323 17.3291 19.9565 17.3172 19.37C17.3172 18.7836 17.8313 18.3078 18.4651 18.3078H18.477C19.1108 18.3078 19.625 18.7836 19.625 19.37C19.625 19.9565 19.1108 20.4323 18.477 20.4323ZM12.7494 20.4323C12.1157 20.4323 11.5895 19.9565 11.5895 19.3701C11.5895 18.7836 12.1037 18.3078 12.7375 18.2968H12.7494C13.3832 18.3078 13.8854 18.7836 13.8973 19.359C13.8973 19.9565 13.3832 20.4323 12.7494 20.4323ZM7.00983 20.4323C6.37609 20.4323 5.86192 19.9565 5.86192 19.3701C5.84996 18.7836 6.36414 18.2968 7.00983 18.2968C7.64358 18.2968 8.15775 18.7725 8.15775 19.359C8.15775 19.9454 7.64358 20.4323 7.00983 20.4323Z" fill="#5669FF"/>
            </Svg>
          </View>
          <View marginLeft={20}>
            <Text style={styles.bold}>{formattedDate}</Text>
            <Text style={styles.small}>{formattedTime} - Durée de l'activité : {formattedDuration}</Text>
          </View>
        </View>

        <View style={styles.div}>
          <View style={styles.icon}>
            <Svg width="21" height="26" viewBox="0 0 21 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <Path fill-rule="evenodd" clip-rule="evenodd" d="M5.57863 1.67096C8.62223 0.0840931 12.3633 0.111829 15.3783 1.74362C18.3637 3.40864 20.1782 6.38022 20.1613 9.5768C20.0918 12.7524 18.1462 15.7375 15.7142 18.0451C14.3105 19.383 12.7402 20.566 11.0355 21.57C10.8599 21.6611 10.6676 21.7221 10.468 21.75C10.2759 21.7427 10.0889 21.6917 9.92371 21.6018C7.32105 20.0932 5.03773 18.1675 3.18359 15.9175C1.6321 14.0392 0.750647 11.77 0.658937 9.41802C0.656923 6.21531 2.53504 3.25784 5.57863 1.67096ZM7.3374 10.7434C7.84937 11.876 9.05783 12.6147 10.3985 12.6147C11.2768 12.6204 12.1211 12.3047 12.7433 11.738C13.3655 11.1713 13.7138 10.4007 13.7107 9.59791C13.7154 8.37248 12.9114 7.26533 11.6741 6.79341C10.4368 6.32148 9.01028 6.57788 8.0606 7.44287C7.11093 8.30787 6.82543 9.61084 7.3374 10.7434Z" fill="#5669FF"/>
              <Path opacity="0.4" d="M10.4103 25.5C14.2571 25.5 17.3755 24.9404 17.3755 24.25C17.3755 23.5596 14.2571 23 10.4103 23C6.5635 23 3.44507 23.5596 3.44507 24.25C3.44507 24.9404 6.5635 25.5 10.4103 25.5Z" fill="#5669FF"/>
            </Svg>
          </View>
          <View marginLeft={20}>
            <Text style={styles.bold}>{activityInfo.locationName}</Text>
            <Text style={styles.small}>{activityInfo.address}, {activityInfo.postalCode} {activityInfo.city}</Text>
          </View>
        </View>

        <View style={styles.orgaDiv}>
          <Image style={styles.icon} source={require('../assets/test/profil1.png')} />
          <View marginLeft={20}>
            <Text style={styles.bold}>{organizerName}</Text>
            <Text style={styles.small}>Organisateur</Text>
          </View>
          <View style={styles.followWrite}>
            <TouchableOpacity onPress={() => handleFollow()} style={styles.btn}>
              <Text style={styles.btnOrganizer}>Suivre</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMessage()} style={styles.btn}>
              <Text style={styles.btnOrganizer}>Écrire</Text>
            </TouchableOpacity>
          </View>
        </View>

          <Text style={styles.subtitle}>À propos de l'évènement</Text>
        <ScrollView>
          <Text style={styles.description}>{activityInfo.description}</Text>
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
          <TouchableOpacity
              onPress={() => handleCalendar()}
              style={styles.button}
              activeOpacity={0.8}
          >
              <Text style={styles.textButton}>AJOUTER À L'AGENDA</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    flex: 3.5,
  },
  iconPosition: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 25,
    paddingLeft: 25,
    paddingTop: 35,
  },
  likeShare: {
    display: 'flex',
    flexDirection: 'row',
  },
  topIconBckgd: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
    height: 36,
    width: 36,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 5,
  },
  activity: {
    flex: 6,
  },
  title: {
    fontSize: 35,
    fontWeight: '600',
    display: 'flex',
    alignItems: 'flex-start',
    marginLeft: 25,
    marginTop: 20,
    marginBottom: 20,
    marginRight: 25,
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAEDFF',
    width: 48,
    height: 48,
    borderRadius: 15,
    marginLeft: 25,
  },
  div: {
    display: 'flex',
    height: 55,
    width: 305,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  orgaDiv: {
    display: 'flex',
    height: 55,
    width: 260,
    flexDirection: 'row',
    alignItems: 'center', 
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    marginRight: 25,
  },
  small: {
    fontSize: 12,
    color: 'grey',
    marginRight: 25,
  },
  followWrite: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAEDFF',
    width: 60,
    height: 28,
    borderRadius: 5,
    marginTop: 7,
  },
  btnOrganizer: {
    color: '#5669FF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 25,
    marginRight: 25,
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    marginLeft: 25,
    marginRight: 25,
    fontSize: 15,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 15,
  },
  button: {
      padding: 10,
      width: '70%',
      height: 58,
      backgroundColor: '#5669FF',
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
  },
  textButton: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
      textTransform: 'uppercase',
  },
});
