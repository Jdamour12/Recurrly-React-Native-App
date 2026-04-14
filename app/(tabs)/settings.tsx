import React from 'react';
import { ActivityIndicator, Alert, Image, Pressable, Text, View } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { useClerk, useUser } from '@clerk/expo';

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const primaryEmail = user?.emailAddresses?.[0]?.emailAddress || '';
  const emailLocalPart = primaryEmail.split('@')[0] || '';

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : emailLocalPart || 'User';

  const displayEmail = primaryEmail;

  const onSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
      Alert.alert('Sign out failed', 'Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      {/* Header */}
      <Text
        style={{
          fontFamily: 'sans-bold',
          fontSize: 28,
          color: '#081126',
          marginBottom: 24,
        }}
      >
        Settings
      </Text>

      {/* Profile card */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          backgroundColor: '#fff8e7',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.1)',
          gap: 14,
          marginBottom: 24,
        }}
      >
        <Image
          source={user?.imageUrl ? { uri: user.imageUrl } : require('@/assets/images/avatar.jpg')}
          style={{ width: 56, height: 56, borderRadius: 28 }}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: 'sans-bold',
              fontSize: 18,
              color: '#081126',
              marginBottom: 2,
            }}
          >
            {displayName}
          </Text>
          {displayEmail ? (
            <Text
              style={{
                fontFamily: 'sans-medium',
                fontSize: 13,
                color: 'rgba(0,0,0,0.5)',
              }}
            >
              {displayEmail}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Settings options */}
      <View style={{ gap: 12 }}>
        {/* Account */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            backgroundColor: '#fff8e7',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.1)',
          }}
        >
          <Text style={{ fontFamily: 'sans-semibold', fontSize: 16, color: '#081126' }}>
            Account
          </Text>
          <Text style={{ fontFamily: 'sans-medium', fontSize: 18, color: 'rgba(0,0,0,0.3)' }}>
            ›
          </Text>
        </View>

        {/* Notifications */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            backgroundColor: '#fff8e7',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.1)',
          }}
        >
          <Text style={{ fontFamily: 'sans-semibold', fontSize: 16, color: '#081126' }}>
            Notifications
          </Text>
          <Text style={{ fontFamily: 'sans-medium', fontSize: 18, color: 'rgba(0,0,0,0.3)' }}>
            ›
          </Text>
        </View>

        {/* Appearance */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            backgroundColor: '#fff8e7',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.1)',
          }}
        >
          <Text style={{ fontFamily: 'sans-semibold', fontSize: 16, color: '#081126' }}>
            Appearance
          </Text>
          <Text style={{ fontFamily: 'sans-medium', fontSize: 18, color: 'rgba(0,0,0,0.3)' }}>
            ›
          </Text>
        </View>

        {/* Privacy */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            backgroundColor: '#fff8e7',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.1)',
          }}
        >
          <Text style={{ fontFamily: 'sans-semibold', fontSize: 16, color: '#081126' }}>
            Privacy
          </Text>
          <Text style={{ fontFamily: 'sans-medium', fontSize: 18, color: 'rgba(0,0,0,0.3)' }}>
            ›
          </Text>
        </View>
      </View>

      {/* Sign out button */}
      <Pressable
        style={({ pressed }) => ({
          marginTop: 32,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 16,
          borderRadius: 16,
          backgroundColor:
            pressed && !isSigningOut ? 'rgba(220, 38, 38, 0.15)' : 'rgba(220, 38, 38, 0.08)',
          borderWidth: 1,
          borderColor: isSigningOut ? 'rgba(220, 38, 38, 0.3)' : 'rgba(220, 38, 38, 0.2)',
          opacity: isSigningOut ? 0.7 : 1,
        })}
        onPress={onSignOut}
        disabled={isSigningOut}
      >
        {isSigningOut ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <ActivityIndicator color="#dc2626" />
            <Text
              style={{
                fontFamily: 'sans-bold',
                fontSize: 16,
                color: '#dc2626',
              }}
            >
              Signing out...
            </Text>
          </View>
        ) : (
          <Text
            style={{
              fontFamily: 'sans-bold',
              fontSize: 16,
              color: '#dc2626',
            }}
          >
            Sign out
          </Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;
