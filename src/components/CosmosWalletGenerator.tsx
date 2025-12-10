import { useState, useEffect } from "react";
import { bech32 } from "bech32";

export function CosmosWalletGenerator() {
    const [existingAddress, setExistingAddress] = useState("");
    const [networkPrefix, setNetworkPrefix] = useState("stoc");
    const [generatedAddress, setGeneratedAddress] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const generateAddress = () => {
            setError("");
            setGeneratedAddress("");

            if (!existingAddress) return;

            try {
                if (!existingAddress.startsWith("cosmos")) {
                    // Allow non-cosmos source addresses too, but user specific "cosmosXXX" in prompt.
                }

                const decoded = bech32.decode(existingAddress);

                if (!networkPrefix) {
                    setError("Network prefix is required");
                    return;
                }

                const newAddress = bech32.encode(networkPrefix, decoded.words);
                setGeneratedAddress(newAddress);
            } catch {
                // It might fail if address is incomplete or invalid bech32
                if (existingAddress.length > 10) {
                    // arbitrary length to start showing errors
                    setError("Invalid address format");
                }
            }
        };

        generateAddress();
    }, [existingAddress, networkPrefix]);

    const copyToClipboard = () => {
        if (generatedAddress) {
            navigator.clipboard.writeText(generatedAddress);
            alert("Address copied to clipboard!");
        }
    };

    return (
        <div
            style={{
                boxSizing: "border-box",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                maxWidth: "1000px",
                width: "100%",
                minWidth: "min(600px, calc(100vw - 4rem))",
                margin: "20px auto",
            }}
        >
            <h2>Cosmos Wallet Generator</h2>

            <div style={{ marginBottom: "15px", textAlign: "left" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                    Existing Cosmos Address:
                </label>
                <input
                    type="text"
                    value={existingAddress}
                    onChange={(e) => setExistingAddress(e.target.value)}
                    placeholder="cosmos1..."
                    style={{
                        width: "100%",
                        padding: "8px",
                        boxSizing: "border-box",
                        fontFamily: "monospace",
                    }}
                />
            </div>

            <div style={{ marginBottom: "15px", textAlign: "left" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                    Network Prefix:
                </label>
                <input
                    type="text"
                    value={networkPrefix}
                    onChange={(e) => setNetworkPrefix(e.target.value)}
                    placeholder="stoc"
                    style={{
                        width: "100%",
                        padding: "8px",
                        boxSizing: "border-box",
                        fontFamily: "monospace",
                    }}
                />
            </div>

            {error && (
                <div style={{ color: "red", marginBottom: "15px", textAlign: "left" }}>
                    {error}
                </div>
            )}

            <div style={{ marginBottom: "15px", textAlign: "left" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                    Generated Address:
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                    <input
                        type="text"
                        value={generatedAddress}
                        disabled
                        style={{
                            flex: 1,
                            padding: "8px",
                            backgroundColor: "#f5f5f5",
                            color: "#333",
                            fontFamily: "monospace",
                        }}
                    />
                    <button
                        onClick={copyToClipboard}
                        disabled={!generatedAddress}
                        style={{ padding: "8px 16px", cursor: "pointer" }}
                    >
                        Copy
                    </button>
                </div>
            </div>
        </div>
    );
}
