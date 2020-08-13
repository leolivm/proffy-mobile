import React, { useState, useEffect } from "react";
import { View, Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";
import api from "../../services/api";
import styles from "./styles";
import landing from "../../assets/landing.png";
import studyIcon from "../../assets/icons/study.png";
import giveClassesIcon from "../../assets/icons/give-classes.png";
import heartIcon from "../../assets/icons/heart.png";

const Landing = () => {
  const { navigate } = useNavigation();
  const [totalConnections, setTotalConnection] = useState(0);

  useEffect(() => {
    api.get("connections").then((res) => {
      const { total } = res.data;
      setTotalConnection(total);
    });
  }, []);

  function handleNavigate() {
    navigate("GiveClasses");
  }

  function handleStudy() {
    navigate("Study");
  }

  return (
    <View style={styles.container}>
      <Image source={landing} style={styles.banner} />

      <Text style={styles.title}>
        Seja bem-vindo, {"\n"}
        <Text style={styles.titleBold}>O que deseja fazer?</Text>
      </Text>

      <View style={styles.buttonsContainer}>
        <RectButton
          onPress={handleStudy}
          style={[styles.button, styles.buttonPrimary]}
        >
          <Image source={studyIcon} />

          <Text style={styles.buttonText}>Estudar</Text>
        </RectButton>

        <RectButton
          onPress={handleNavigate}
          style={[styles.button, styles.buttonSecondary]}
        >
          <Image source={giveClassesIcon} />

          <Text style={styles.buttonText}>Dar aulas</Text>
        </RectButton>
      </View>

      <Text style={styles.totalConnections}>
        Total de {totalConnections} conexões já realizadas{" "}
        <Image source={heartIcon} />
      </Text>
    </View>
  );
};

export default Landing;
