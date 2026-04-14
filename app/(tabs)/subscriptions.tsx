import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Image, Keyboard, Pressable, Text, TextInput, View } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { usePostHog } from "posthog-react-native";
import { icons } from "@/constants/icons";
import SubscriptionCard from "@/components/SubscriptionCard";
import cx from "clsx";
import { useSubscriptions } from "@/lib/subscription-context";

const SafeAreaView = styled(RNSafeAreaView);

const ALL_FILTER = "All";

const Subscriptions = () => {
  const posthog = usePostHog();
  const { subscriptions } = useSubscriptions();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_FILTER);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    posthog.capture("subscriptions tab viewed");
  }, [posthog]);

  // Derive categories dynamically from current subscriptions
  const categories = useMemo(() => [
    ALL_FILTER,
    ...Array.from(
      new Set(
        subscriptions.map((s) => s.category?.trim()).filter(Boolean) as string[]
      )
    ),
  ], [subscriptions]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return subscriptions.filter((sub) => {
      // Category filter
      if (activeCategory !== ALL_FILTER && sub.category !== activeCategory) {
        return false;
      }

      // Search filter — match name, plan, category, status, or billing
      if (q) {
        const haystack = [
          sub.name,
          sub.plan,
          sub.category,
          sub.status,
          sub.billing,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      }

      return true;
    });
  }, [subscriptions, searchQuery, activeCategory]);

  const resultCount = filtered.length;
  const totalCount = subscriptions.length;

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      {/* Header */}
      <Text
        style={{
          fontFamily: "sans-bold",
          fontSize: 28,
          color: "#081126",
          marginBottom: 16,
        }}
      >
        Subscriptions
      </Text>

      {/* Search bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff8e7",
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.1)",
          paddingHorizontal: 14,
          marginBottom: 14,
          gap: 10,
        }}
      >
        <Image
          source={icons.menu}
          style={{ width: 18, height: 18, opacity: 0.4 }}
          resizeMode="contain"
        />
        <TextInput
          style={{
            flex: 1,
            paddingVertical: 14,
            fontSize: 15,
            fontFamily: "sans-medium",
            color: "#081126",
          }}
          placeholder="Search subscriptions..."
          placeholderTextColor="rgba(0,0,0,0.35)"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setExpandedId(null); // collapse cards on new search
          }}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <Pressable
            onPress={() => {
              setSearchQuery("");
              setExpandedId(null);
            }}
            hitSlop={8}
          >
            <Text
              style={{
                fontFamily: "sans-bold",
                fontSize: 16,
                color: "rgba(0,0,0,0.35)",
              }}
            >
              ✕
            </Text>
          </Pressable>
        )}
      </View>

      {/* Category chips */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 18,
        }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <Pressable
              key={cat}
              className={cx("category-chip", isActive && "category-chip-active")}
              onPress={() => {
                setActiveCategory(cat);
                setExpandedId(null);
              }}
            >
              <Text
                className={cx(
                  "category-chip-text",
                  isActive && "category-chip-text-active"
                )}
              >
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Result count */}
      <Text
        style={{
          fontFamily: "sans-medium",
          fontSize: 13,
          color: "rgba(0,0,0,0.45)",
          marginBottom: 10,
        }}
      >
        {searchQuery || activeCategory !== ALL_FILTER
          ? `${resultCount} of ${totalCount} subscriptions`
          : `${totalCount} subscriptions`}
      </Text>

      {/* Subscription list */}
      <FlatList
        data={filtered}
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={Keyboard.dismiss}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedId === item.id}
            onPress={() => {
              const willExpand = expandedId !== item.id;
              if (willExpand) {
                posthog.capture("subscription card expanded", {
                  subscription_id: item.id,
                  subscription_name: item.name,
                  source: "subscriptions_tab",
                });
              }
              setExpandedId((curr) => (curr === item.id ? null : item.id));
            }}
          />
        )}
        extraData={expandedId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View
            style={{
              alignItems: "center",
              paddingVertical: 48,
              gap: 8,
            }}
          >
            <Text
              style={{
                fontFamily: "sans-bold",
                fontSize: 18,
                color: "#081126",
                opacity: 0.5,
              }}
            >
              No subscriptions found
            </Text>
            <Text
              style={{
                fontFamily: "sans-medium",
                fontSize: 14,
                color: "rgba(0,0,0,0.4)",
                textAlign: "center",
                maxWidth: 240,
              }}
            >
              {searchQuery
                ? `No results for "${searchQuery}"`
                : "No subscriptions match this filter"}
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
};

export default Subscriptions;
