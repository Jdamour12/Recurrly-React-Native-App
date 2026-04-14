import {Text} from "react-native";
import {useLocalSearchParams} from "expo-router";
import {styled} from "nativewind";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {usePostHog} from "posthog-react-native";
import {useEffect} from "react";

const SafeAreaView = styled(RNSafeAreaView);

const SubscriptionDetail = () => {
    const {id} = useLocalSearchParams<{id: string}>();
    const posthog = usePostHog();

    useEffect(() => {
        posthog.capture('subscription detail viewed', { subscription_id: id });
    }, [id, posthog]);

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text className="text-xl font-bold text-foreground">{id} Subscription</Text>
        </SafeAreaView>
    );
};

export default SubscriptionDetail;
