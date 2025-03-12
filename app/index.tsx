import { useVideoPlayer, VideoView } from "expo-video";
import {
  ArrowRight,
  ArrowUp,
  Heart,
  Share,
  SlidersHorizontal,
  Volume2,
} from "lucide-react-native";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const ITEM_TYPES = {
  video: "video",
  image: "image",
  color: "color",
} as const;

const THEME = {
  light: "light",
  dark: "dark",
} as const;

type DataType = keyof typeof ITEM_TYPES;
type ThemeType = keyof typeof THEME;

type Data = {
  id: string;
  type: DataType;
  source?: string;
  color?: string;
  title: string;
  description: string;
  theme: ThemeType;
};

const DATA: Data[] = [
  {
    id: "1",
    type: ITEM_TYPES.image,
    source: "https://picsum.photos/seed/3/500/600",
    title: "Image",
    description: "Image type content",
    theme: THEME.light,
  },
  {
    id: "2",
    type: ITEM_TYPES.color,
    color: "#000000",
    title: "Color",
    description: "Color type content",
    theme: THEME.light,
  },
  {
    id: "3",
    type: ITEM_TYPES.video,
    source: require("../assets/video/v4.mp4"),
    title: "Video",
    description: "Video type content",
    theme: THEME.light,
  },
  {
    id: "4",
    type: ITEM_TYPES.color,
    color: "#d4d4d4",
    title: "Color",
    description: "Color type content",
    theme: THEME.dark,
  },
  {
    id: "5",
    type: ITEM_TYPES.video,
    source: require("../assets/video/v2.mp4"),
    title: "Video",
    description: "Video type content",
    theme: THEME.light,
  },
  {
    id: "6",
    type: ITEM_TYPES.image,
    source: "https://picsum.photos/seed/6/500/600",
    title: "Image",
    description: "Image type content",
    theme: THEME.dark,
  },
  {
    id: "7",
    type: ITEM_TYPES.color,
    color: "#7c3aed",
    title: "Color",
    description: "Color type content",
    theme: THEME.dark,
  },
  {
    id: "8",
    type: ITEM_TYPES.video,
    source: require("../assets/video/v3.mp4"),
    title: "Video",
    description: "Video type content",
    theme: THEME.light,
  },
  {
    id: "9",
    type: ITEM_TYPES.image,
    source: "https://picsum.photos/seed/9/500/600",
    title: "Image",
    description: "Image type content",
    theme: THEME.dark,
  },
  {
    id: "10",
    type: ITEM_TYPES.color,
    color: "#f97316",
    title: "Color",
    description: "Color type content",
    theme: THEME.dark,
  },
  {
    id: "11",
    type: ITEM_TYPES.video,
    source: require("../assets/video/v1.mp4"),
    title: "Video",
    description: "Video type content",
    theme: THEME.light,
  },
  {
    id: "12",
    type: ITEM_TYPES.image,
    source: "https://picsum.photos/seed/14/500/600",
    title: "Image",
    description: "Image type content",
    theme: THEME.light,
  },
];

const SPACING = 10;
const LIGHT = "#fff";
const DARK = "#000";
const ICON_SIZE = 24;

const COLORS = {
  light: LIGHT,
  dark: DARK,
} as const;

const ItemAction = ({
  icon,
  label,
  theme,
}: {
  label: string;
  icon: ReactNode;
  theme: Data["theme"];
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING,
        padding: SPACING,
        marginHorizontal: SPACING,
      }}
    >
      {icon}
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: COLORS[theme],
        }}
      >
        {label}
      </Text>
    </View>
  );
};

const ControlAction = ({ icon }: { icon: ReactNode }) => {
  return (
    <View
      style={{
        backgroundColor: "rgba(0,0,0,0.2)",
        padding: SPACING,
        borderStyle: "solid",
        borderColor: "rgba(0,0,0,0.4)",
        borderWidth: 1,
        opacity: 0.7,
      }}
    >
      {icon}
    </View>
  );
};

const VideoPlayer = ({
  item,
  currentItem,
}: {
  item: Data;
  currentItem: Data | null;
}) => {
  const player = useVideoPlayer(item.source!, (player) => {
    player.loop = true;
  });

  useEffect(() => {
    if (currentItem?.id === item.id) {
      player.play();
    } else {
      player.pause();
    }
  }, [currentItem?.id, item.id]);

  return (
    <VideoView
      style={{ width, height, backgroundColor: COLORS[item.theme] }}
      player={player}
      allowsPictureInPicture
      nativeControls={false}
      contentFit="cover"
    />
  );
};

const ImageBackgroundView = ({ item }: { item: Data }) => {
  return (
    <Image
      source={{
        uri: item.source,
      }}
      style={{ width, height, resizeMode: "cover" }}
    />
  );
};

const ColorBackgroundView = ({ item }: { item: Data }) => {
  return <View style={{ width, height, backgroundColor: item.color }} />;
};

const Info = ({
  item,
  currentItem,
}: {
  item: Data;
  currentItem: Data | null;
}) => {
  const anim = new Animated.Value(0);

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [currentItem?.id]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View
      style={{
        position: "absolute",
        justifyContent: "space-between",
        alignItems: "center",
        height: height,
        paddingVertical: SPACING * 20,
        paddingHorizontal: SPACING,
        width: width,
        zIndex: 1,
      }}
    >
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Animated.Text
          style={{
            color: COLORS[item.theme],
            fontSize: 14,
            opacity,
            transform: [{ translateY }],
          }}
        >
          {item.title}
        </Animated.Text>
        <Animated.Text
          style={{
            color: COLORS[item.theme],
            fontSize: 36,
            fontWeight: "700",
            textAlign: "center",
            opacity,
            transform: [{ translateY }],
            marginTop: SPACING,
          }}
        >
          {item.description}
        </Animated.Text>
      </View>

      <Explore item={item} />
    </View>
  );
};

const Explore = ({ item }: { item: Data }) => {
  return (
    <View
      style={{
        borderStyle: "dashed",
        borderColor: "rgba(255,255,255,0.5)",
        borderWidth: 1,
        borderRadius: 100,
        padding: SPACING * 2,
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.light,
          padding: SPACING * 3,
          borderRadius: 100,
        }}
      >
        <ArrowRight color={COLORS.dark} size={ICON_SIZE} />
      </View>
    </View>
  );
};

const TopBar = ({
  theme,
  goToNext,
}: Pick<Data, "theme"> & { goToNext: () => void }) => {
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={[
        StyleSheet.absoluteFillObject,
        {
          zIndex: 2,
          justifyContent: "space-between",
          top: top,
          padding: SPACING,
          height: 70,
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          height: 50,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Pressable onPress={goToNext} hitSlop={10}>
          <ArrowUp color={COLORS[theme]} size={ICON_SIZE} />
        </Pressable>
        <View style={{ flexDirection: "row", gap: SPACING }}>
          <ControlAction
            icon={<Volume2 color={COLORS[theme]} size={ICON_SIZE} />}
          />
          <ControlAction
            icon={<SlidersHorizontal color={COLORS[theme]} size={ICON_SIZE} />}
          />
        </View>
      </View>
    </View>
  );
};

const BottomBar = ({ theme }: Pick<Data, "theme">) => {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          zIndex: 2,
          justifyContent: "space-between",
          top: height - 70,
          marginHorizontal: SPACING * 2,
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          height: 50,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ItemAction
          icon={<Heart color={COLORS[theme]} size={ICON_SIZE} />}
          label="Like"
          theme={theme}
        />
        <ItemAction
          icon={<Share color={COLORS[theme]} size={ICON_SIZE} />}
          label="Share"
          theme={theme}
        />
      </View>
    </View>
  );
};

const VerticalCarousel = () => {
  const flatListRef = useRef<FlatList>(null);
  const [currentItem, setCurrentItem] = useState<{
    index: number;
    viewableItems: Data | null;
  }>({
    index: 0,
    viewableItems: DATA[0],
  });

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<ViewToken<Data>>;
    changed: Array<ViewToken<Data>>;
  }) => {
    if (viewableItems.length > 0 && viewableItems[0].index) {
      setCurrentItem({
        index: viewableItems[0].index,
        viewableItems: viewableItems[0].item,
      });
    }
  };

  const renderItem = ({ item }: { item: Data; index: number }) => {
    return (
      <View style={{ width, height }}>
        <Info item={item} currentItem={currentItem.viewableItems} />
        {item.type === ITEM_TYPES.video && (
          <VideoPlayer item={item} currentItem={currentItem.viewableItems} />
        )}
        {item.type === ITEM_TYPES.image && <ImageBackgroundView item={item} />}
        {item.type === ITEM_TYPES.color && <ColorBackgroundView item={item} />}
      </View>
    );
  };

  const theme = currentItem.viewableItems?.theme!;

  const scrollToNext = () => {
    if (currentItem.index < DATA.length - 1) {
      const nextIndex = currentItem.index + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBar theme={theme} goToNext={scrollToNext} />
      <BottomBar theme={theme} />
      <FlatList
        ref={flatListRef}
        data={DATA}
        scrollToOverflowEnabled
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        decelerationRate="fast"
        windowSize={3}
        initialNumToRender={2}
        maxToRenderPerBatch={3}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
          minimumViewTime: 300,
        }}
      />
    </View>
  );
};

export default VerticalCarousel;
