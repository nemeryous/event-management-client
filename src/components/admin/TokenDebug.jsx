import React from "react";
import { useSelector } from "react-redux";

export default function TokenDebug() {
  const accessToken = useSelector(state => state.auth.accessToken);
  const tokenType = useSelector(state => state.auth.tokenType);
  const user = useSelector(state => state.auth.user);

  console.log("TokenDebug - Redux State:", {
    accessToken: accessToken ? "Có token" : "Không có token",
    tokenType,
    user: user ? "Có user" : "Không có user"
  });

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <div>Token: {accessToken ? "✅ Có" : "❌ Không có"}</div>
      <div>Type: {tokenType || "N/A"}</div>
      <div>User: {user ? "✅ Có" : "❌ Không có"}</div>
    </div>
  );
}
