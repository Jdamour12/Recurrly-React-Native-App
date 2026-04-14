import React, {useEffect} from 'react';
import {Text} from "react-native";
import { styled } from "nativewind";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {usePostHog} from "posthog-react-native";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
    const posthog = usePostHog();

    useEffect(() => {
        posthog.capture('subscriptions tab viewed');
    }, [posthog]);

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text>Subscriptions</Text>
        </SafeAreaView>
    );
};

export default Subscriptions;