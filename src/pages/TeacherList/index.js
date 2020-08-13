import React, { useState } from "react";
import { View, ScrollView, Text, TextInput } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { BorderlessButton, RectButton } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import api from "../../services/api";
import PageHeader from "../../components/PageHeader";
import TeacherItem from "../../components/TeacherItem";
import styles from "./styles";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [subject, setSubject] = useState("");
  const [week_day, setWeekDay] = useState("");
  const [time, setTime] = useState("");

  function loadFavorites() {
    AsyncStorage.getItem("favorites").then((res) => {
      if (res) {
        const favs = JSON.parse(res);
        const id = favs.map((teacher) => {
          return teacher.id;
        });
        setFavorites(id);
      }
    });
  }

  useFocusEffect(() => {
    loadFavorites();
  });

  function handleToggle() {
    setFilterVisible(!filterVisible);
  }

  async function handleFilter() {
    loadFavorites();
    const res = await api.get("classes", {
      params: {
        subject,
        week_day,
        time,
      },
    });
    setFilterVisible(false);
    setTeachers(res.data);
  }

  return (
    <View style={styles.container}>
      <PageHeader
        title="Proffys disponíveis"
        headerRight={
          <BorderlessButton onPress={handleToggle}>
            <Feather name="filter" size={20} color="#fff" />
          </BorderlessButton>
        }
      >
        {filterVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label}>Matéria</Text>
            <TextInput
              style={styles.input}
              placeholder="Qual a matéria?"
              placeholderTextColor="#c1bccc"
              value={subject}
              onChangeText={(e) => setSubject(e)}
            />

            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da semana</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Qual o dia?"
                  placeholderTextColor="#c1bccc"
                  value={week_day}
                  onChangeText={(e) => setWeekDay(e)}
                />
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Qual horário?"
                  placeholderTextColor="#c1bccc"
                  value={time}
                  onChangeText={(e) => setTime(e)}
                />
              </View>
            </View>

            <RectButton style={styles.submitButton} onPress={handleFilter}>
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </View>
        )}
      </PageHeader>

      <ScrollView
        style={styles.teacherList}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
      >
        {teachers.map((item) => (
          <TeacherItem
            key={item.id}
            teacher={item}
            favorited={favorites.includes(item.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default TeacherList;
