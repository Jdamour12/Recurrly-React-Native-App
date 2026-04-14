import {Tabs, Redirect} from "expo-router";
import {tabs} from "@/constants/data";
import {colors, components} from "@/constants/theme";
import {View} from "react-native";
import clsx from "clsx";
import {Image} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useAuth} from "@clerk/expo";

const tabBar = components.tabBar
const TabLayout = () => {
    const insets = useSafeAreaInsets();
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) return null;

    if (!isSignedIn) {
        return <Redirect href="/(auth)/sign-in" />;
    }

    type TabIconProps = { focused: boolean; icon: number };

    const TabIcon = ({focused, icon}: TabIconProps) => {
        return (
            <View className="tabs-icon">
                <View className={clsx('tabs-pill', focused && 'tabs-active')}>
                    <Image source={icon} resizeMode={"contain"} style={{width: 24, height: 24}} />
                </View>
            </View>
        )
    }
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: Math.max(insets.bottom, tabBar.horizontalInset),
                    height: tabBar.height,
                    marginHorizontal: tabBar.horizontalInset,
                    borderRadius: tabBar.radius,
                    backgroundColor: colors.primary,
                    borderWidth: 0,
                    elevation: 0,
                },
                tabBarItemStyle: {
                    paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6
                },
                tabBarIconStyle: {
                    width: tabBar.iconFrame,
                    height: tabBar.iconFrame,
                    alignSelf: 'center',
                }
        }}
        >
        {
            tabs.map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        title:tab.title,
                        tabBarIcon: ({focused}) => (
                            <TabIcon focused={focused} icon={tab.icon} />
                        )
                    }}
                />
            ))
        }
    </Tabs>
    )
}

export default TabLayout