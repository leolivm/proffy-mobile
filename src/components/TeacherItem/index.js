import React, { useState, useEffect } from "react";
import { View, Image, Text, Linking } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import api from "../../services/api";
import heartOutline from "../../assets/icons/heart-outline.png";
import unfavoriteIcon from "../../assets/icons/unfavorite.png";
import whatsappIcon from "../../assets/icons/whatsapp.png";
import { maskPrice } from "../../util/format";
import styles from "./styles";

const TeacherItem = ({ teacher, favorited }) => {
  const [isFavorited, setIsFavorited] = useState(favorited);
  const [price, setPrice] = useState("");

  useEffect(() => {
    const data = maskPrice(teacher.cost.toString());
    setPrice(data);
  }, []);

  function handleWhatsapp() {
    api.post("connections", {
      user_id: teacher.id,
    });
    Linking.openURL(`whatsapp://send?phone=${teacher.whatsapp}`);
  }

  async function handleFavorite() {
    const favorites = await AsyncStorage.getItem("favorites");

    let favoritesArray = [];

    if (favorites) {
      favoritesArray = JSON.parse(favorites);
    }

    if (isFavorited) {
      const favoriteIndex = favoritesArray.findIndex((item) => {
        return item.id === teacher.id;
      });

      favoritesArray.splice(favoriteIndex, 1);
      setIsFavorited(false);
    } else {
      favoritesArray.push(teacher);
      setIsFavorited(true);
    }

    await AsyncStorage.setItem("favorites", JSON.stringify(favoritesArray));
  }

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image style={styles.avatar} source={{ uri: teacher.avatar }} />

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{teacher.name}</Text>
          <Text style={styles.subject}>{teacher.subject}</Text>
        </View>
      </View>

      <Text style={styles.bio}>{teacher.bio}</Text>

      <View style={styles.footer}>
        <Text style={styles.price}>
          Preço/hora {"   "}
          <Text style={styles.priceValue}>{price}</Text>
        </Text>

        <View style={styles.buttonsContainer}>
          <RectButton
            onPress={handleFavorite}
            style={[styles.favoriteButton, isFavorited ? styles.favorited : {}]}
          >
            {isFavorited ? (
              <Image source={unfavoriteIcon} />
            ) : (
              <Image source={heartOutline} />
            )}
          </RectButton>

          <RectButton onPress={handleWhatsapp} style={styles.contactButton}>
            <Image source={whatsappIcon} />
            <Text style={styles.contactButtonText}>Entrar em contato</Text>
          </RectButton>
        </View>
      </View>
    </View>
  );
};

export default TeacherItem;
