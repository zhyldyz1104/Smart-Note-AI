import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { db } from "../../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); // placeholder for future auth
    const [notRegistered, setNotRegistered] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        try {
            // Step 1 — Check if user exists
            const q = query(
                collection(db, "users"),
                where("email", "==", email)
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                // User not found
                setNotRegistered(true);
                return;
            }

            // Step 2 — Login successful (no password check yet)
            const docRef = querySnapshot.docs[0].ref;
            router.replace(`/notes?userId=${docRef.id}`);

        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Smart Note AI</Text>
            <Text style={styles.subtitle}>Log in to your account</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor="#C9B8E6"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Your password"
                    placeholderTextColor="#C9B8E6"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={!email || !password}
                >
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>

                {notRegistered && (
                    <Text style={{ color: "red", marginTop: 10 }}>
                        This email is not registered. Please create an account.
                    </Text>
                )}

                <TouchableOpacity
                    onPress={() => router.replace("/register")}
                    style={{ marginTop: 20 }}
                >
                    <Text style={{ color: "#6C4AB6", textDecorationLine: "underline" }}>
                        Register
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const pastelBackground = {
    start: "#FDF7FF",
    mid: "#F7E9FF",
    end: "#FFEAF3",
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 80,
        backgroundColor: pastelBackground.start,
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#6C4AB6",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: "#A08BCF",
        marginBottom: 32,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#D9C4FF",
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        borderWidth: 1,
        borderColor: "#F3E6FF",
    },
    label: {
        fontSize: 13,
        color: "#9A7FD3",
        marginBottom: 6,
        marginTop: 10,
    },
    input: {
        height: 42,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E6D7FF",
        paddingHorizontal: 12,
        backgroundColor: "#FBF7FF",
        color: "#5A3C99",
    },
    button: {
        marginTop: 24,
        height: 44,
        borderRadius: 999,
        backgroundColor: "#D9A7FF",
        alignItems: "center",
        justifyContent: "center",
        opacity: 1,
    },
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "600",
        fontSize: 15,
    },
});
