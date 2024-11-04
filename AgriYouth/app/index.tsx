import { useRouter } from "expo-router"; // Import useRouter
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRef, useState } from "react";
import { UseAuth } from "../Context/ContextProvider"; // Import the UseAuth context

const { width, height } = Dimensions.get("window");

export default function Index() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const router = useRouter(); // Initialize router
  const { darkMode } = UseAuth(); // Get the darkMode state from context

  const slides = [
    {
      id: "1",
      image: require("../assets/images/onboard3.jpeg"),
      title: "Agriculture, our concern",
      subtitle: "Let us share our passion in agriculture",
    },
    {
      id: "2",
      image: require("../assets/images/onboard1.jpeg"),
      title: "Innovate and Cultivate",
      subtitle: "Bring your fresh ideas to the field. Together, we’re transforming agriculture for a sustainable tomorrow",
    },
    {
      id: "3",
      image: require("../assets/images/onboard4.jpeg"),
      title: "From Seed to Success",
      subtitle: "Join a community that nurtures your journey in agriculture. Your passion can make a difference.",
    },
  ];

  const Slide = ({ item }) => {
    return (
      <View style={{ width, alignItems: "center", paddingHorizontal: 10 }}>
        <Image
          source={item.image}
          style={{
            height: "55%",
            width: "100%",
            resizeMode: "contain",
            borderRadius: 10,
            marginHorizontal: width * 0.075,
          }}
        />
        <View style={{ height: 20 }} />
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            marginTop: 10,
            marginLeft: 10,
            color: darkMode ? "#fff" : "#000", // Adjust text color based on dark mode
          }}
        >
          {item.title}
        </Text>
        <Text
          style={{
            fontSize: 20,
            maxHeight: "70%",
            color: darkMode ? "#ccc" : "#333", // Adjust subtitle color based on dark mode
          }}
        >
          {item.subtitle}
        </Text>
      </View>
    );
  };

  const Footer = ({ slides, currentSlideIndex }) => {
    return (
      <View
        style={{
          height: height * 0.25,
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 80 }}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex === index && {
                  backgroundColor: "green",
                  width: 25,
                },
              ]}
            />
          ))}
        </View>
        <View style={{ marginTop: 10 }}>
          {currentSlideIndex === slides.length - 1 ? (
            <View style={{ height: 60 }}>
              <TouchableOpacity style={styles.btn1} onPress={handleGetStarted}>
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 15,
                    fontWeight: "bold",
                    marginTop: 20,
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Get Started
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={[
                  styles.btn,
                  { backgroundColor: "transparent", borderWidth: 1, borderColor: darkMode ? "white" : "black" },
                ]}
                onPress={Skip}
              >
                <Text style={{ color: darkMode ? "white" : "black", fontSize: 15, fontWeight: "bold" }}>
                  Skip
                </Text>
              </TouchableOpacity>
              <View style={{ width: 15 }} />
              <TouchableOpacity style={styles.btn} onPress={goNextSlide}>
                <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const updateCurrentSlideIndex = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex < slides.length) {
      const offset = nextSlideIndex * width;
      ref?.current?.scrollToOffset({ offset });
      setCurrentSlideIndex(nextSlideIndex);
    }
  };

  const Skip = () => {
    const lastSlideIndex = slides.length - 1;
    const offset = lastSlideIndex * width;
    ref?.current?.scrollToOffset({ offset });
    setCurrentSlideIndex(lastSlideIndex);
  };

  const handleGetStarted = () => {
    router.push("/Register"); 
  };

  const ref = useRef(null);

  return (
    <SafeAreaView style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>
      <Text style={{ color: darkMode ? "#fff" : "#000", fontSize: 24, textAlign: "center", marginVertical: 20 }}>
        Onboarding screen
      </Text>
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        pagingEnabled
        data={slides}
        contentContainerStyle={{ height: "100%" }}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <Slide item={item} />}
      />
      <Footer slides={slides} currentSlideIndex={currentSlideIndex} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    justifyContent: "center",
    alignContent: "center",
  },
  darkContainer: {
    backgroundColor: "#000", 
  },
  lightContainer: {
    backgroundColor: "#FFFFFF", 
  },
  indicator: {
    height: 2.5,
    gap: 10,
    width: 10,
    backgroundColor: "grey",
    borderRadius: 2,
    marginHorizontal: 3,
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    backgroundColor: "#1E992C",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  btn1: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    backgroundColor: "#1E992C",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
});
