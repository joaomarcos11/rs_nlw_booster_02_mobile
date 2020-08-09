import React, { useState } from 'react';
import { View, Image, Text, Linking } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

import heartOutlineIcon from '../../assets/images/icons/heart-outline.png';
import unfavoriteIcon from '../../assets/images/icons/unfavorite.png';
import whatsappIcon from '../../assets/images/icons/whatsapp.png';

import styles from './styles';

export interface Teacher {
  id: number;
  avatar: string;
  bio: string;
  cost: number;
  name: string;
  subject: string;
  whatsapp: string;
}

interface TeacherItemProps {
  teacher: Teacher;
  favorited: boolean;
}

const TeacherItem: React.FC<TeacherItemProps> = ({ teacher, favorited }) => {
  const [isFavorited, setIsFavorited ] = useState(favorited);
  
  function handleLinkToWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=${teacher.whatsapp}`);
  }

  async function handleToggleFavorite() {
    // adicionar aos favoritos
    const favorites = await AsyncStorage.getItem('favorites');
    // como pode ser vazio, seta logo
    let favoritesArray = [];
    // como pode retornar null, verifica se vem
    if (favorites) {
      // transforma o favorites em array
      favoritesArray = JSON.parse(favorites);
    }

    if (isFavorited) {
      // remover dos favoritos

      // procurar a posicao do teacher no array de favoritos
      const favoriteIndex = favoritesArray.findIndex((teacherItem: Teacher) => {
        // faz uma varredura procurando qual a posição da props teacher(.id)
        // que é o elemento em evidencia atualmente e compara-lo com os itens
        // dentro do array com os teachers
        return teacherItem.id === teacher.id;
      });

      // a partir de qual indice e quantos elementos deve remover 
      favoritesArray.splice(favoriteIndex, 1);
      // seta como falso, o elemento esta como nao-favoritado
      setIsFavorited(false);
    } else {
      // add o elemento teacher no array
      favoritesArray.push(teacher);
      // seta como true, o elemento esta como favoritado
      setIsFavorited(true);
    }
    // salva no banco de dados, na chave favorites, o array convertido para JSON (texto)
    await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
  }

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image 
          style={styles.avatar}
          source={{ uri: teacher.avatar }}
        />
      
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{ teacher.name }</Text>
          <Text style={styles.subject}>{ teacher.subject }</Text>
        </View>
      </View>
      <Text style={styles.bio}>{ teacher.bio }</Text>
      <View style={styles.footer}>
        <Text style={styles.price}>
          Preço/hora {'  '}
          <Text style={styles.priceValue}> R$ { teacher.cost }</Text>
        </Text>

        <View style={styles.buttonsContainer}>
          <RectButton 
            onPress={handleToggleFavorite}
            style={[
              styles.favoriteButton, 
              isFavorited ? styles.favoritedButton : {},
            ]}
          >
            { isFavorited 
              ? <Image source={unfavoriteIcon} /> 
              : <Image source={heartOutlineIcon} /> 
            }
          </RectButton>
          
          <RectButton onPress={handleLinkToWhatsapp} style={styles.contactButton}>
            <Image source={whatsappIcon} />
            <Text style={styles.contactButtonText}>Entrar em contato</Text>
          </RectButton>
        </View>
      </View>
    </View>
  );
}

export default TeacherItem;