import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { useClerk, useUser } from '@clerk/expo';

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : user?.emailAddresses?.[0]?.emailAddress || 'User';

  const displayEmail = user?.emailAddresses?.[0]?.emailAddress || '';

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
        <Pressable
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            backgroundColor: pressed ? '#f6eecf' : '#fff8e7',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.1)',
          })}
        >
          <Text style={{ fontFamily: 'sans-semibold', fontSize: 16, color: '#081126' }}>
            Account
          </Text>
          <Text style={{ fontFamily: 'sans-medium', fontSize: 18, color: 'rgba(0,0,0,0.3)' }}>
            ›
          </Text>
        </Pressable>

        {/* Notifications */}
        <Pressable
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            backgroundColor: pressed ? '#f6eecf' : '#fff8e7',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.1)',
          })}
        >
          <Text style={{ fontFamily: 'sans-semibold', fontSize: 16, color: '#081126' }}>
            Notifications
          </Text>
          <Text style={{ fontFamily: 'sans-medium', fontSize: 18, color: 'rgba(0,0,0,0.3)' }}>
            ›
          </Text>
        </Pressable>

        {/* Appearance */}
        <Pressable
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            backgroundColor: pressed ? '#f6eecf' : '#fff8e7',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.1)',
          })}
        >
          <Text style={{ fontFamily: 'sans-semibold', fontSize: 16, color: '#081126' }}>
            Appearance
          </Text>
          <Text style={{ fontFamily: 'sans-medium', fontSize: 18, color: 'rgba(0,0,0,0.3)' }}>
            ›
          </Text>
        </Pressable>

        {/* Privacy */}
        <Pressable
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            backgroundColor: pressed ? '#f6eecf' : '#fff8e7',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.1)',
          })}
        >
          <Text style={{ fontFamily: 'sans-semibold', fontSize: 16, color: '#081126' }}>
            Privacy
          </Text>
          <Text style={{ fontFamily: 'sans-medium', fontSize: 18, color: 'rgba(0,0,0,0.3)' }}>
            ›
          </Text>
        </Pressable>
      </View>

      {/* Sign out button */}
      <Pressable
        style={({ pressed }) => ({
          marginTop: 32,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 16,
          borderRadius: 16,
          backgroundColor: pressed ? 'rgba(220, 38, 38, 0.15)' : 'rgba(220, 38, 38, 0.08)',
          borderWidth: 1,
          borderColor: 'rgba(220, 38, 38, 0.2)',
        })}
        onPress={() => signOut()}
      >
        <Text
          style={{
            fontFamily: 'sans-bold',
            fontSize: 16,
            color: '#dc2626',
          }}
        >
          Sign out
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;