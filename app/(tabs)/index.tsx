import "@/global.css"
import {FlatList, Image, Pressable, Text, View} from "react-native";
import { styled } from "nativewind";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {HOME_BALANCE, UPCOMING_SUBSCRIPTIONS} from "@/constants/data";
import {icons} from "@/constants/icons";
import images from "@/constants/images";
import {formatCurrency} from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import SubscriptionCard from "@/components/SubscriptionCard";
import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import {useState} from "react";
import { useUser } from '@clerk/expo';
import { usePostHog } from 'posthog-react-native';
import { useSubscriptions } from "@/lib/subscription-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null)
    const [modalVisible, setModalVisible] = useState(false)
    const { subscriptions, addSubscription } = useSubscriptions();
    const { user } = useUser();
    const posthog = usePostHog();

    // Use Clerk user's name if available, fallback to email, then default
    const displayName = user?.firstName
        ? `${user.firstName}`
        : user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User';

    const handleCreateSubscription = (newSub: Subscription) => {
        addSubscription(newSub);
        posthog.capture('subscription created', {
            subscription_name: newSub.name,
            subscription_category: newSub.category ?? null,
            subscription_price: newSub.price,
            subscription_billing: newSub.billing ?? null,
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-background p-5">

                <FlatList
                    ListHeaderComponent={
                        (
                            <>
                                <View className="home-header">
                                    <View className="home-user">
                                        <Image
                                            source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
                                            className="home-avatar"
                                        />
                                        <Text className="home-user-name">{displayName}</Text>
                                    </View>
                                    <Pressable onPress={() => setModalVisible(true)}>
                                        <Image source={icons.add} className="home-add-icon" />
                                    </Pressable>
                                </View>

                                <View className="home-balance-card">
                                    <Text className="home-balance-label">Balance</Text>
                                    <View className="home-balance-row">
                                        <Text className="home-balance-amount">
                                            {formatCurrency(HOME_BALANCE.amount)}
                                        </Text>
                                        <Text className="home-balance-date">
                                            {dayjs(HOME_BALANCE.nextRenewalDate).isValid()
                                                ? dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")
                                                : "—"}
                                        </Text>
                                    </View>
                                </View>

                                <View className="mb-5">
                                    <ListHeading title="Upcoming" />

                                    <FlatList
                                        data={UPCOMING_SUBSCRIPTIONS}
                                        renderItem={({item}) => (
                                            <UpcomingSubscriptionCard {... item}/>
                                        )}
                                        keyExtractor={(item) => item.id}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        ListEmptyComponent={
                                            <Text className="home-empty-state">No Upcoming Renewals!</Text>}
                                    />
                                </View>

                                <ListHeading title="All Subscriptions" />
                            </>
                        )
                    }
                    data={subscriptions}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <SubscriptionCard
                            {... item}
                            expanded={expandedSubscriptionId === item.id}
                            onPress={() => {
                                const willExpand = expandedSubscriptionId !== item.id;
                                if (willExpand) {
                                    posthog.capture('subscription card expanded', {
                                        subscription_id: item.id,
                                        subscription_name: item.name,
                                    });
                                }
                                setExpandedSubscriptionId((currentId) =>
                                    currentId === item.id ? null : item.id);
                            }}
                        />
                    )}
                    extraData={expandedSubscriptionId}
                    ItemSeparatorComponent={() => <View className="h-4"/> }
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text className='home-empty-state'>No Subscriptions Yet.</Text> }
                    contentContainerClassName="pb-20"
                />

                <CreateSubscriptionModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onCreate={handleCreateSubscription}
                />
        </SafeAreaView>
    );
}
