import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import cx from "clsx";
import dayjs from "dayjs";
import { getSubscriptionIcon } from "@/lib/get-logo";

// ── category → color mapping ────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#fca5a5",
  "AI Tools":    "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design:        "#f5c542",
  Productivity:  "#c4b5fd",
  Cloud:         "#93c5fd",
  Music:         "#fda4af",
  Other:         "#d1d5db",
};

const CATEGORIES = Object.keys(CATEGORY_COLORS);

type Frequency = "Monthly" | "Yearly";

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreate: (subscription: Subscription) => void;
}

export default function CreateSubscriptionModal({
  visible,
  onClose,
  onCreate,
}: Props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("Monthly");
  const [category, setCategory] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory(null);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = (): boolean => {
    const next: { name?: string; price?: string } = {};
    if (!name.trim()) next.name = "Name is required";
    const parsed = parseFloat(price);
    if (!price.trim() || isNaN(parsed) || parsed <= 0) {
      next.price = "Enter a valid positive price";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const now = dayjs();
    const renewalDate =
      frequency === "Yearly"
        ? now.add(1, "year").toISOString()
        : now.add(1, "month").toISOString();

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      name: name.trim(),
      price: parseFloat(price),
      currency: "USD",
      billing: frequency,
      icon: getSubscriptionIcon(name.trim()),
      status: "active",
      category: category || "Other",
      plan: "",
      paymentMethod: "",
      startDate: now.toISOString(),
      renewalDate,
      color: CATEGORY_COLORS[category || "Other"],
    };

    onCreate(newSub);
    resetForm();
    onClose();
  };

  const isValid = name.trim().length > 0 && parseFloat(price) > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <Pressable className="modal-overlay" onPress={handleClose}>
        {/* absorb taps on the overlay */}
        <View style={{ flex: 1 }} />
      </Pressable>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          maxHeight: "85%",
        }}
      >
        <View className="modal-container">
          {/* ── Header ──────────────────────────────── */}
          <View className="modal-header">
            <Text className="modal-title">New Subscription</Text>
            <Pressable className="modal-close" onPress={handleClose}>
              <Text className="modal-close-text">✕</Text>
            </Pressable>
          </View>

          {/* ── Body ────────────────────────────────── */}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="modal-body">
              {/* Name field */}
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  className={cx("auth-input", errors.name && "auth-input-error")}
                  value={name}
                  placeholder="e.g. Netflix, Spotify"
                  placeholderTextColor="rgba(0,0,0,0.35)"
                  onChangeText={(t) => {
                    setName(t);
                    if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
                  }}
                  autoCapitalize="words"
                />
                {errors.name ? (
                  <Text className="auth-error">{errors.name}</Text>
                ) : null}
              </View>

              {/* Price field */}
              <View className="auth-field">
                <Text className="auth-label">Price (USD)</Text>
                <TextInput
                  className={cx("auth-input", errors.price && "auth-input-error")}
                  value={price}
                  placeholder="0.00"
                  placeholderTextColor="rgba(0,0,0,0.35)"
                  keyboardType="decimal-pad"
                  onChangeText={(t) => {
                    setPrice(t);
                    if (errors.price) setErrors((e) => ({ ...e, price: undefined }));
                  }}
                />
                {errors.price ? (
                  <Text className="auth-error">{errors.price}</Text>
                ) : null}
              </View>

              {/* Frequency picker */}
              <View className="auth-field">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  {(["Monthly", "Yearly"] as Frequency[]).map((opt) => {
                    const active = frequency === opt;
                    return (
                      <Pressable
                        key={opt}
                        className={cx(
                          "picker-option",
                          active && "picker-option-active"
                        )}
                        onPress={() => setFrequency(opt)}
                      >
                        <Text
                          className={cx(
                            "picker-option-text",
                            active && "picker-option-text-active"
                          )}
                        >
                          {opt}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Category chips */}
              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <View className="category-scroll">
                  {CATEGORIES.map((cat) => {
                    const active = category === cat;
                    return (
                      <Pressable
                        key={cat}
                        className={cx(
                          "category-chip",
                          active && "category-chip-active"
                        )}
                        onPress={() => setCategory(active ? null : cat)}
                      >
                        <Text
                          className={cx(
                            "category-chip-text",
                            active && "category-chip-text-active"
                          )}
                        >
                          {cat}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Submit button */}
              <Pressable
                className={cx("auth-button", !isValid && "auth-button-disabled")}
                onPress={handleSubmit}
                disabled={!isValid}
              >
                <Text className="auth-button-text">Create Subscription</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
